import { generateText, stepCountIs, type LanguageModelV2 } from 'ai';
import {
  LlmScenarioSchema, LlmKnowledgeCheckSchema, nextBeatType,
  type Beat, type RunState,
} from './run-engine.js';
import { KiwixClient, createWikiTools } from './wiki-tools.js';
import { callProviderChain, getModel, type ProviderId } from './providers.js';

export function stripThinkTags(text: string): string {
  return text.replace(/<think>[\s\S]*?(<\/think>|$)/g, '').trim();
}

export function extractJson(text: string): unknown {
  const clean = stripThinkTags(text);
  const match = /\{[\s\S]*\}/.exec(clean);
  if (!match) throw new Error('no JSON object in model output');
  return JSON.parse(match[0]);
}

export function resolveRunModel(): LanguageModelV2 {
  const preferred = process.env.RUN_PROVIDER as ProviderId | undefined;
  const chain: ProviderId[] = preferred ? [preferred, 'minimax', 'openrouter'] : ['minimax', 'openrouter'];
  let lastErr: unknown;
  for (const pid of chain) {
    try {
      return getModel(pid);
    } catch (err) {
      lastErr = err;
    }
  }
  throw new Error(`no run model available: ${lastErr instanceof Error ? lastErr.message : String(lastErr)}`);
}

const SCENARIO_PROMPT = (state: RunState, curatedExcerpt: string) => `You are the game master of a time-travel roguelike. The traveler jumped to the ${state.era} with foreknowledge. Current standing: capital ${state.meters.capital}, reputation ${state.meters.reputation}/100, temporal risk ${state.meters.temporalRisk}/100.

Curated almanac excerpt (what the traveler packed):
${curatedExcerpt}

Write ONE scenario beat for beat ${state.beatIndex + 1} of ${state.totalBeats}. Ground it in the excerpt or in famous verifiable events of the era. Then give 2-4 choices. Each choice's effects must be SMALL and plausible.

Respond with ONLY a JSON object (no markdown fences):
{"title": string (max 10 words), "narrative": string (2-4 vivid sentences, second person), "choices": [{"id": "a"|"b"|"c"|"d", "text": string, "effects": {"capital"?: -50..50, "reputation"?: -15..15, "temporalRisk"?: -10..15}}]}`;

export function templateBeat(state: RunState, curatedExcerpt: string): Beat {
  const type = nextBeatType(state);
  return {
    index: state.beatIndex,
    type,
    title: `Lay low in the ${state.era}`,
    narrative: `You keep your head down and consult your almanac. ${curatedExcerpt.slice(0, 200)}`,
    choices: [
      { id: 'a', text: 'Make a small, safe wager from the almanac', effects: { capital: 10, temporalRisk: 2 } },
      { id: 'b', text: 'Observe and blend in', effects: { reputation: 5, temporalRisk: -2 } },
    ],
  };
}

const TEMPLATE_CHECK: Beat['knowledgeCheck'] = {
  question: 'Your almanac is your lifeline. What is the safest use of foreknowledge?',
  options: [
    'One spectacular, era-defining bet',
    'A series of small, unremarkable advantages',
    'Telling everyone you are from the future',
    'Burning the almanac immediately',
  ],
  correctIndex: 1,
  sourceArticle: 'curated-almanac',
};

export async function generateBeat(args: {
  state: RunState;
  curatedExcerpt: string;
  model: LanguageModelV2;
  kiwix: KiwixClient | null;
}): Promise<Beat> {
  const { state, curatedExcerpt, model } = args;
  if (process.env.RUN_LLM_STUB === '1') return templateBeat(state, curatedExcerpt);

  const prompt = SCENARIO_PROMPT(state, curatedExcerpt);
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await generateText({
        model,
        prompt: attempt === 0
          ? prompt
          : `Your previous reply was not valid JSON matching the schema. Reply with ONLY the JSON object.\n\n${prompt}`,
        maxOutputTokens: 700,
      });
      const parsed = LlmScenarioSchema.parse(extractJson(res.text));
      return {
        index: state.beatIndex,
        type: nextBeatType(state) === 'finale' ? 'finale' : 'scenario',
        title: parsed.title,
        narrative: parsed.narrative,
        choices: parsed.choices,
      };
    } catch {
      // retry once, then template
    }
  }
  return templateBeat(state, curatedExcerpt);
}

export async function generateKnowledgeCheckBeat(args: {
  state: RunState;
  model: LanguageModelV2 | null;
  kiwix: KiwixClient | null;
  curatedExcerpt: string;
}): Promise<Beat> {
  const { state, model, kiwix, curatedExcerpt } = args;
  const base: Omit<Beat, 'knowledgeCheck'> = {
    index: state.beatIndex,
    type: 'knowledge_check',
    title: 'Knowledge Check',
    narrative: 'A local is sizing you up. Time to prove you belong in this era.',
    choices: [],
  };

  if (process.env.RUN_LLM_STUB === '1' || !kiwix || !model) {
    return { ...base, knowledgeCheck: TEMPLATE_CHECK };
  }

  try {
    const res = await generateText({
      model,
      tools: createWikiTools(kiwix),
      stopWhen: stepCountIs(4),
      maxOutputTokens: 700,
      prompt: `Use wikiSearch then wikiRead to look up one famous event, person, or object from the ${state.era}. Then write ONE multiple-choice question whose answer is verifiable from the article text you read. The traveler is from the future and must blend in.

Respond (after your tool calls) with ONLY a JSON object:
{"question": string, "options": [string, string, string, string], "correctIndex": 0-3, "sourceArticle": "<article path you read>"}`,
    });
    const parsed = LlmKnowledgeCheckSchema.parse(extractJson(res.text));
    return { ...base, knowledgeCheck: parsed };
  } catch {
    return { ...base, knowledgeCheck: TEMPLATE_CHECK };
  }
}

export async function generateCompanionQuip(args: {
  companionName: string;
  companionPrompt: string;
  beatTitle: string;
}): Promise<string> {
  if (process.env.RUN_LLM_STUB === '1') return `${args.companionName} nods approvingly.`;
  try {
    const { comment } = await callProviderChain({
      companionName: args.companionName,
      companionPrompt: args.companionPrompt,
      contextItem: `The traveler just faced this scenario: "${args.beatTitle}"`,
    });
    return stripThinkTags(comment);
  } catch {
    return '';
  }
}
