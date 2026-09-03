import express from 'express';
import cors from 'cors';
import { streamText, tool, convertToModelMessages } from 'ai';
import { z } from 'zod';
import dotenv from 'dotenv';
import { initAthenaDb, runFeatureMigrations, runRunMigrations, seedStaticContent, getSessionNotes, insertSessionNote } from './db.js';
import { registerEntries } from './entry-registry.js';
import { requestLogger } from './middleware.js';
import { createAthenaRoutes } from './athena-routes.js';
import { createFeatureRoutes } from './feature-routes.js';
import {
  getModel,
  PROVIDER_DEFAULTS,
  KEY_ENV_MAP,
  callProviderChain,
  type ProviderId,
} from './providers.js';
import athenaStatic from '../src/data/athena-static.json' with { type: 'json' };

dotenv.config();

// ── Athena SQLite DB ────────────────────────────────────────
const athenaDb = initAthenaDb('data/athena.db');
registerEntries(athenaDb);
seedStaticContent(athenaDb, athenaStatic as { mnemonics: Record<string, string>; quizReactions: Record<string, string> });
runFeatureMigrations(athenaDb._db);
runRunMigrations(athenaDb._db);
console.log('[athena] SQLite cache initialized');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(requestLogger());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// ── Provider configuration ─────────────────────────────────
// All provider config (ProviderId, PROVIDER_DEFAULTS, KEY_ENV_MAP, getModel,
// callProviderChain, mapLLMError) lives in ./providers.ts — see there for
// the canonical 8-provider spec.
const VALID_PROVIDERS: ProviderId[] = [
  'openai', 'deepseek', 'openrouter', 'zai',
  'minimax', 'gemini', 'claude', 'ollama',
];
const DEFAULT_PROVIDER: ProviderId = 'minimax';

// ── Model List Cache ────────────────────────────────────────
const modelCache = new Map<string, { models: string[]; expiry: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

app.get('/api/models', async (req, res) => {
  const provider = req.query.provider as string;
  if (!VALID_PROVIDERS.includes(provider as ProviderId)) {
    res.status(400).json({ error: `Invalid provider: ${provider}` });
    return;
  }
  const providerId = provider as ProviderId;

  // Check cache
  const cached = modelCache.get(providerId);
  if (cached && cached.expiry > Date.now()) {
    res.json({ provider: providerId, models: cached.models, cached: true });
    return;
  }

  try {
    const apiKey = process.env[KEY_ENV_MAP[providerId]];
    // ollama runs locally and typically needs no key
    const keyRequired = providerId !== 'ollama';
    if (keyRequired && !apiKey) throw new Error(`${KEY_ENV_MAP[providerId]} not set`);

    let models: string[] = [];

    if (providerId === 'gemini') {
      // Google Generative Language API
      const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
      const resp = await fetch(url);
      const data = await resp.json() as { models?: { name: string; supportedGenerationMethods?: string[] }[] };
      if (data.models) {
        models = data.models
          .filter((m) => m.supportedGenerationMethods?.includes('generateContent') && !m.name?.includes('tunedModels'))
          .map((m) => m.name!.replace('models/', ''))
          .sort();
      }
    } else if (providerId === 'claude') {
      // Anthropic Models API (needs x-api-key + anthropic-version headers)
      const cfg = PROVIDER_DEFAULTS[providerId];
      const resp = await fetch(`${cfg.baseURL}/models`, {
        headers: {
          'x-api-key': apiKey!,
          'anthropic-version': '2023-06-01',
        },
      });
      const data = await resp.json() as { data?: { id: string }[] };
      if (data.data && Array.isArray(data.data)) {
        models = data.data.map((m) => m.id).sort();
      }
    } else {
      // OpenAI-compatible providers (openai, deepseek, openrouter, zai,
      // minimax, ollama) all expose GET /v1/models with Bearer auth.
      const cfg = PROVIDER_DEFAULTS[providerId];
      const resp = await fetch(`${cfg.baseURL}/models`, {
        headers: { 'Authorization': `Bearer ${apiKey ?? ''}` },
      });
      const data = await resp.json() as { data?: { id: string }[] };
      if (data.data && Array.isArray(data.data)) {
        // Filter to chat-capable models, exclude embedding/audio/moderation models
        models = data.data
          .map((m) => m.id as string)
          .filter((id: string) =>
            !id.includes('embedding') &&
            !id.includes('moderation') &&
            !id.includes('tts') &&
            !id.includes('whisper') &&
            !id.includes('dall-e')
          )
          .sort();
      }
    }

    modelCache.set(providerId, { models, expiry: Date.now() + CACHE_TTL });
    res.json({ provider: providerId, models, cached: false });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);
    console.error(`[models] ERROR for ${providerId}: ${errMessage}`);
    res.status(502).json({ error: `Failed to fetch models: ${errMessage}` });
  }
});

import { KNOWLEDGE_MODULES } from './knowledge/index.js';
import { createApiV1Router } from './api-v1.js';
import { createPalaceLinkHandler } from './palaceLinkHandler.js';
import { createRunRoutes } from './run-routes.js';

app.post('/api/chat', async (req, res) => {
  const { messages, tier, provider, model: modelOverride, companionName, companionPrompt, eras, categories, subcategories, sessionId } = req.body;
  const providerId: ProviderId = (VALID_PROVIDERS.includes(provider) ? provider : DEFAULT_PROVIDER) as ProviderId;

  // Convert UIMessages from frontend to CoreMessages for streamText
  const coreMessages = await convertToModelMessages(messages ?? []);

  // Dynamically build the knowledge string based on selected eras, categories, and subcategories
  let CURATED_KNOWLEDGE = '=== CURATED TIME TRAVELER KNOWLEDGE BASE ===\n';
  const selectedEras = Array.isArray(eras) && eras.length > 0 ? eras : Object.keys(KNOWLEDGE_MODULES);
  
  for (const era of selectedEras) {
    if (KNOWLEDGE_MODULES[era]) {
      const selectedCats = Array.isArray(categories) && categories.length > 0 ? categories : Object.keys(KNOWLEDGE_MODULES[era]);
      for (const cat of selectedCats) {
        if (KNOWLEDGE_MODULES[era][cat]) {
          const selectedSubs = Array.isArray(subcategories) && subcategories.length > 0 ? subcategories : Object.keys(KNOWLEDGE_MODULES[era][cat]);
          for (const sub of selectedSubs) {
            if (KNOWLEDGE_MODULES[era][cat][sub]) {
              CURATED_KNOWLEDGE += KNOWLEDGE_MODULES[era][cat][sub] + '\n';
            }
          }
        }
      }
    }
  }

  let systemPrompt: string;
  if (tier === 'tier2') {
    systemPrompt = `You are the Time Traveler's Training AI. You are examining a traveler's situational judgment for a journey spanning 1950 to 2001.

Your job is to put the traveler in simulated historical scenarios where they must make choices that prevent disasters, transfer tech, or integrate without raising suspicion or causing a timeline collapse.

## YOUR BEHAVIOR
1. Present ONE scenario at a time. Each scenario should be based on the events or blueprints in the knowledge base.
2. Present 3 or 4 choices (A, B, C, D).
3. The traveler must make a decision.
4. Grade their decision:
   - Safe/optimal decisions: Keep suspicion stable or lower it.
   - Careless/butterfly-inducing decisions: Raise suspicion and warn them about timeline disruption.
   - Severe/anachronistic decisions: Majorly raise suspicion.
5. You MUST track a **Suspicion Meter** (from 0% to 100%).
   - You MUST output the current suspicion level at the END of each response in the format: \`[Suspicion: X%]\` (where X is a number, e.g. \`[Suspicion: 15%]\`). Start the simulation at \`[Suspicion: 0%]\`.
   - If Suspicion reaches 100%, declare the timeline compromised, end the simulation, and ask them to restart.
6. After each response, present a new scenario. After 5 scenarios, evaluate their overall readiness.

${CURATED_KNOWLEDGE}`;
  } else if (tier === 'tier3') {
    // Dungeon Master prompt — interactive fiction style
    let sessionNotesBlock = '';
    if (sessionId) {
      const notes = getSessionNotes(athenaDb, sessionId);
      if (notes.length > 0) {
        sessionNotesBlock = '\n\n## YOUR SESSION NOTES (observations from this session so far)\n';
        for (const n of notes) {
          sessionNotesBlock += `- [${n.category}] ${n.note}\n`;
        }
        sessionNotesBlock += '\nUse these notes to maintain continuity. Reference earlier events and observations naturally.\n';
      }
    }

    systemPrompt = `You are the Time Travel Dungeon Master — a vivid narrator running immersive historical simulations for a time traveler preparing for deployment to 1950-2001.

You are NOT a generic AI examiner. You are a storyteller, scene-painter, and character actor who weaves real historical knowledge into gripping interactive fiction.

## NARRATION STYLE
Every response has TWO parts:
1. **[Narrator:]** — A vivid scene-setting paragraph. Describe the sensory texture of the era: the smell of cigarette smoke in a 1982 office, the hum of a PDP-11 in a 1978 cleanroom, the static on a CRT in a 1995 Netscape cubicle. Ground the traveler in time and place.
2. **[NPC Name:]** — An era-specific character speaks. Each NPC has a distinct voice, accent, personality, and hidden agenda. They are not generic — they have opinions, secrets, moods, and goals.

## STARTING THE SIMULATION
1. Begin with a cinematic [Narrator:] opening that drops the traveler into a specific time and place.
2. Then introduce 3-4 scenario choices — each drawn from the knowledge base. Make them evocative: not "bartender in 1986" but "Night shift at the Starlight Lounge, Chernobyl week, April 1986 — the regulars are jittery and the TV is stuck on the news."
3. Once the traveler selects, adopt the NPC persona fully.

## SUSPICION & GAME MECHANICS
- Track a Suspicion Meter (0% to 100%). Start at [Suspicion: 5%].
- Output the meter at the END of every response: \`[Suspicion: X%]\`
- Anachronisms raise suspicion: future references, post-era slang ("no cap", "rizz", "skibidi"), knowledge of events that haven't happened yet.
- Era-appropriate behavior and knowledge LOWERS suspicion by 2-5% when they demonstrate real understanding.
- At 100%: break character, declare "Timeline compromised! Your cover has been blown." End session.
- After 4-6 successful exchanges, offer a scene transition — new location, time jump, different NPC. This keeps sessions open-ended with chapter breaks.

## EDUCATIONAL INTEGRATION (THE CORE MISSION)
- The traveler MUST use real historical knowledge to succeed. NPCs ask questions that require era-specific facts from the knowledge base.
- When they demonstrate knowledge, the NPC reacts with trust and the scene deepens.
- When they fail, turn it into learning: the NPC teaches them something, then tests them again later.
- Use the \`takeNote\` tool to record what the traveler has learned and where they struggle. These notes persist for the entire session.
- Use the \`evaluateAnswer\` tool whenever the traveler answers a factual question in-character.

## TOOLS (USE THEM ACTIVELY)
- \`takeNote\`: Record observations about the traveler — what they know, what they got wrong, notable choices. Use this frequently.
- \`evaluateAnswer\`: When the traveler answers a historical question in-character, evaluate their accuracy and update competency.

## NARRATIVE QUALITY
- Make each scene feel like a page from a historical novel, not a textbook.
- NPCs should have names, backstories, quirks, and emotional depth.
- Dialogue should crackle — not "Please answer this question" but "Look, I don't know what kinda fancy-pants school you went to, but around here we measure silicon wafers in mils, not whatever you just said."

${CURATED_KNOWLEDGE}${sessionNotesBlock}`;
  } else {
    // Tier 1 (Default)
    systemPrompt = `You are the Time Traveler's Training AI — an examiner preparing a time traveler for departure to the 1950 to 2001 era.

Your job: prioritize conversational teaching and then test the traveler using spaced repetition, relying ONLY on the facts in your curated knowledge base below. Never invent outcomes or dates.

## YOUR BEHAVIOR (DAEMON TEACHING WORKFLOW)
1. Phase 1 - Concept Introduction: Start by introducing 2 or 3 fascinating facts from the selected era/topics below. Present them in an engaging, conversational way.
2. Phase 2 - Spaced Repetition Testing: Ask ONE question at a time to test their understanding. Make it multiple-choice (A/B/C/D) OR short-answer. Heavily weight your questions toward concepts the traveler previously answered incorrectly in this session.
3. **TOOL CALLING (CRITICAL):** WHENEVER the traveler answers a question, you MUST call the \`evaluateAnswer\` tool to programmatically record their performance. This is mandatory.
4. After the traveler answers and you call the tool, tell them if they're correct. If wrong, give the correct answer with context, and ensure you re-test them on this concept later in the session.
5. Track a running score (X correct / Y total). State the score after each answer.
6. Keep a lighthearted tone — this is fun preparation, not an interrogation. Use era-appropriate humor.
7. If asked something outside your knowledge base, say "That's above my clearance level, traveler. Please adjust your era and topic filters."

${CURATED_KNOWLEDGE}`;
  }

  if (companionName && companionPrompt) {
    const companionInstruction = `\n\n## TIME TRAVEL COMPANION CHIME-IN
You have a traveling companion with you named "${companionName}".
Here is their personality and prompt:
"${companionPrompt}"

At the VERY END of every response (after your questions, scores, scenarios, or character dialogue), you MUST include a short, wittily appropriate, in-character chime-in or comment from "${companionName}".
This comment MUST be formatted exactly as: \`[Companion: "Comment text goes here"]\` on a new line.
Example:
[Companion: "Great Scott, Marty! That is absolutely correct!"]
Make sure they stay in character and react to what just happened. If the traveler fails, Biff can laugh, or Doc can panic.`;
    
    systemPrompt += companionInstruction;
  }

  try {
    console.log(`[chat] provider=${providerId} model=${modelOverride || 'default'} tier=${tier ?? 'tier1'}`);
    const model = getModel(providerId, modelOverride);

    const evaluateAnswerTool = {
      evaluateAnswer: tool({
        description: 'Evaluate the traveler\'s answer to a quiz question to update their mastery profile. Call this WHENEVER they answer a question.',
        inputSchema: z.object({
          topic: z.string().describe('The broad topic of the question (e.g., sports, tech, blueprints, finance, 1980s).'),
          isCorrect: z.boolean().describe('Whether the traveler got the question correct or not.'),
          competenceDelta: z.number().describe('A score adjustment indicating how much their competence changes (e.g., +10 for correct, -5 for incorrect).'),
          feedback: z.string().describe('Short snippet of feedback (e.g., "Nailed it!", "Close, but it was 1982.").')
        }),
        execute: async (args: { topic: string; isCorrect: boolean; competenceDelta: number; feedback: string }) => {
          // Fire-and-forget: create/update spaced repetition entry
          fetch(`http://localhost:${PORT}/api/features/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic: args.topic, isCorrect: args.isCorrect }),
          }).catch(() => { /* ignore SRS errors */ });

          return `Answer evaluated: ${args.isCorrect ? 'Correct' : 'Incorrect'}, delta: ${args.competenceDelta}.`;
        }
      })
    };

    // Tier 3 gets takeNote tool for persistent session observations
    const takeNoteTool = tier === 'tier3' && sessionId ? {
      takeNote: tool({
        description: 'Record an observation about the traveler or the session. Use this to note what they know, what they struggle with, notable choices, or scene transitions. Notes persist across the session.',
        inputSchema: z.object({
          note: z.string().describe('The observation to record (e.g., "Traveler correctly identified Intel 4004 as first microprocessor")'),
          category: z.enum(['observation', 'warning', 'achievement', 'fact_learned', 'scene_transition']).describe('Type of note')
        }),
        execute: async (args: { note: string; category: string }) => {
          try {
            insertSessionNote(athenaDb, sessionId, args.note, args.category);
            return `Note recorded: [${args.category}] ${args.note}`;
          } catch (err) {
            return `Failed to record note: ${err}`;
          }
        }
      })
    } : {};

    const allTools = { ...evaluateAnswerTool, ...takeNoteTool };

    const result = streamText({
      model,
      messages: coreMessages,
      system: systemPrompt,
      tools: allTools,
    });

    // AI SDK v6: use toUIMessageStreamResponse() instead of removed pipeDataStreamToResponse()
    const response = result.toUIMessageStreamResponse({
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });

    // Copy headers from Web Response to Express Response
    for (const [key, value] of response.headers.entries()) {
      res.setHeader(key, value);
    }
    res.status(response.status);

    // Pipe Web ReadableStream to Express response
    if (response.body) {
      const reader = response.body.getReader();
      const pump = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) { res.end(); break; }
            res.write(value);
          }
        } catch (err: unknown) {
          const errMessage = err instanceof Error ? err.message : String(err);
          console.error(`[chat] stream pump error: ${errMessage}`);
          if (!res.writableEnded) res.end();
        }
      };
      pump();
    } else {
      res.end();
    }
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);
    console.error(`[chat] ERROR: ${errMessage}`);
    const statusCode = errMessage.includes('not set') ? 503 : 500;
    res.status(statusCode).json({
      error: errMessage,
      hint: errMessage.includes('not set') ? `Set the required env var in .env and restart the server.` : undefined
    });
  }
});

app.post('/api/companion/comment', async (req, res) => {
  const { companionName, companionPrompt, contextItem, provider } = req.body;

  // The frontend (CompanionContext) still persists legacy provider names;
  // map them onto the canonical ProviderId values before delegating.
  const LEGACY_PROVIDER_MAP: Partial<Record<string, ProviderId>> = {
    google: 'gemini',
    zhipu: 'zai',
  };
  const providerId = provider ? LEGACY_PROVIDER_MAP[provider] ?? provider : undefined;

  try {
    const result = await callProviderChain({
      companionName,
      companionPrompt,
      contextItem,
      provider: providerId,
    });
    console.log(`[companion] used provider=${result.provider}`);
    res.json(result);
  } catch (err: unknown) {
    const errMessage = err instanceof Error ? err.message : String(err);
    console.error(`[companion] all providers failed. Last error: ${errMessage}`);
    res.status(502).json({ error: errMessage });
  }
});

// ── Runtime palace-link (cross-topic synthesis) ──────────────
app.post('/api/companion/palace-link', createPalaceLinkHandler());

// ── REST API v1 ─────────────────────────────────────────────
app.use('/api/v1', createApiV1Router());
app.use('/api/athena', createAthenaRoutes(athenaDb));
app.use('/api/features', createFeatureRoutes(athenaDb));
app.use('/api/run', createRunRoutes(athenaDb));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
