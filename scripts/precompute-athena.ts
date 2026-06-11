import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUTPUT_PATH = path.join(ROOT, 'src/data/athena-static.json');
const API_URL = process.env.PRECOMPUTE_API_URL ?? 'http://localhost:3001/api/companion/comment';

const DATA_PAGES: ReadonlyArray<{ id: string; summary: string }> = [
  { id: 'wars-vietnam', summary: 'The Vietnam War (1955-1975) — Cold War proxy conflict, US involvement, fall of Saigon' },
  { id: 'disasters-1906-sf', summary: 'The 1906 San Francisco earthquake and fire' },
  { id: 'inventions-lithography', summary: "Alois Senefelder's invention of lithography in 1796" },
  { id: 'sports-1982-superbowl', summary: 'Super Bowl XVI (1982) — Cincinnati Bengals vs San Francisco 49ers' },
  { id: 'sports-1986-worldcup', summary: 'The 1986 FIFA World Cup in Mexico, won by Argentina' },
  { id: 'philosophy-bodhisattva', summary: 'The bodhisattva vow in Mahayana Buddhism — refusal of personal nirvana until all beings are saved' },
  { id: 'engineering-watermill', summary: 'The watermill as a foundational pre-industrial technology, converting river flow to mechanical work' },
  { id: 'crafts-eyeglasses', summary: 'The history of eyeglasses from 13th-century Italy onward — lenses, optics, the reading stone' },
];

const TIERS = [1, 2, 3] as const;
const BRACKETS = ['low', 'mid', 'high'] as const;
const TOPICS = [
  'history', 'sports', 'philosophy', 'crafts', 'science', 'engineering',
  'disasters', 'inventions',
];

const ATHENA_PROMPT = `You are Athena — Greek goddess of wisdom, teaching the user through a time-traveling app. Speak directly, warmly, with genuine depth. No fluff. Use the time-travel conceit: you have personally witnessed the events.`;

interface StaticBank {
  mnemonics: Record<string, string>;
  quizReactions: Record<string, string>;
}

async function callComment(contextItem: string): Promise<string> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      companionName: 'Athena',
      companionPrompt: ATHENA_PROMPT,
      contextItem,
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API error ${res.status}: ${text.slice(0, 200)}`);
  }
  const data = (await res.json()) as { comment?: string };
  return (data.comment ?? '').trim();
}

async function main(): Promise<void> {
  console.log('[precompute] Starting Athena precompute...');
  console.log(`[precompute] API: ${API_URL}`);
  console.log(`[precompute] Output: ${OUTPUT_PATH}`);

  const bank: StaticBank = {
    mnemonics: {},
    quizReactions: {},
  };

  // 1. Mnemonics — one per data page
  for (const page of DATA_PAGES) {
    const prompt = `Write a single vivid mnemonic or "palace hook" (under 20 words) for this entry. The hook must be a concrete image, analogy, or compression that makes the entry memorable. Speak in Athena's voice — direct, warm, opinionated. No lectures.\n\nEntry: ${page.summary}`;
    const hook = await callComment(prompt);
    bank.mnemonics[page.id] = hook;
    console.log(`[precompute] mnemonic[${page.id}] = "${hook}"`);
  }

  // 2. Quiz reactions — 3 tiers × 3 brackets × topics + generic fallbacks
  for (const tier of TIERS) {
    for (const bracket of BRACKETS) {
      // Generic fallback
      const genericPrompt = `Athena is reacting to a tier-${tier} quiz answer where the user is in the ${bracket} competency bracket. Write one short reaction (under 25 words) in Athena's voice — direct, warm, slightly opinionated. No general feedback.`;
      bank.quizReactions[`${tier}:${bracket}:generic`] = await callComment(genericPrompt);

      // Per-topic reactions
      for (const topic of TOPICS) {
        const prompt = `Athena is reacting to a tier-${tier} quiz answer on the topic "${topic}" where the user is in the ${bracket} competency bracket. Write one short reaction (under 25 words) in Athena's voice — direct, warm, slightly opinionated. No general feedback.`;
        bank.quizReactions[`${tier}:${bracket}:${topic}`] = await callComment(prompt);
      }
    }
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(bank, null, 2) + '\n', 'utf-8');
  console.log(`[precompute] Wrote ${OUTPUT_PATH}`);

  // Verify completeness
  const expected = DATA_PAGES.length + TIERS.length * BRACKETS.length * (1 + TOPICS.length);
  const actual = Object.keys(bank.mnemonics).length + Object.keys(bank.quizReactions).length;
  if (actual !== expected) {
    throw new Error(`Precompute incomplete: expected ${expected} keys, got ${actual}`);
  }
  console.log(
    `[precompute] Verified: ${actual} keys present ` +
      `(${Object.keys(bank.mnemonics).length} mnemonics + ${Object.keys(bank.quizReactions).length} reactions).`
  );
}

main().catch((err) => {
  console.error('[precompute] FAILED:', err);
  process.exit(1);
});
