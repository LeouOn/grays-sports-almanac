# The Run Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build "The Run" — a time-travel run simulator that fuses quiz, companions, and progress into one game — per `docs/superpowers/specs/2026-08-17-the-run-game-design.md`.

**Architecture:** Deterministic engine (`run-engine.ts`) owns all rules; LLM (`run-llm.ts`) only narrates/proposes within zod-validated bounds; Kiwix Wikipedia accessed via HTTP tools (`wiki-tools.ts`); state persisted in better-sqlite3; React page under `/run`.

**Tech Stack:** Express 5 + better-sqlite3 (server, run via tsx — NOT type-checked by tsc), Vercel AI SDK v6 (`generateText`, `tool`, `stepCountIs`), zod v4, vitest + supertest, React 19 + react-router 7.

## Global Constraints

- Server files use ESM with `.js` import suffixes (e.g. `from './db.js'`) and run under `tsx`; they are **not** covered by `tsc -b`. **Vitest is the correctness gate** — every server task must end with green `npx vitest run server/<file>.test.ts`.
- Frontend files ARE type-checked: `npx tsc -b` must stay green for files a task touches (pre-existing errors in unrelated files exist — do not fix them, do not add new ones).
- DB tests use `initAthenaDb(':memory:')` + migration runner, per `server/feature-routes.test.ts`.
- Route tests use `express()` + `supertest`, per `server/feature-routes.test.ts`.
- zod v4: `z.object`, `z.enum`, `.int()`, `.min()/.max()` as in `server/schemas.ts`.
- AI SDK v6: tool name comes from the `tools` object key (no `name` property); bound loops with `stopWhen: stepCountIs(N)`; import `generateText, tool, stepCountIs` from `'ai'`.
- All LLM calls cap output: beats ≤ 700 tokens, companion quips ≤ 90 tokens.
- LLM output may contain `<think>...</think>` blocks (MiniMax-M2) — always strip via `stripThinkTags` (Task 5) before parsing.
- No new npm dependencies. XML parsing and HTML stripping are hand-rolled (see Task 2).
- Known pre-existing issue (OUT OF SCOPE, do not fix): `/api/companion/comment` in `server/index.ts:365-410` references un-imported `generateText` and legacy provider names `'zhipu'/'google'`. CompanionContext.tsx uses legacy frontend provider naming. Neither is touched by this plan.

---

### Task 1: Wave 0 — Provider fixes

**Files:**
- Modify: `server/providers.ts:31-40` (PROVIDER_DEFAULTS), `server/providers.ts:20-29` (KEY_ENV_MAP docs), `server/providers.ts:54-65` (getModel key lookup)
- Modify: `src/pages/Quiz.tsx:19-28` (PROVIDERS defaults)
- Test: `server/providers.test.ts` (extend)

**Interfaces:**
- Consumes: nothing.
- Produces: `getModel('minimax')` targets `https://api.minimax.io/v1` model `MiniMax-M2`; `getModel('openrouter')` defaults to `google/gemini-2.5-flash`; zhipu key resolves from `ZAI_API_KEY` or `ZHIPU_API_KEY`.

- [ ] **Step 1: Write the failing tests** (append to `server/providers.test.ts`)

```ts
it('minimax targets the international endpoint with MiniMax-M2', () => {
  expect(PROVIDER_DEFAULTS.minimax.baseURL).toBe('https://api.minimax.io/v1');
  expect(PROVIDER_DEFAULTS.minimax.model).toBe('MiniMax-M2');
});

it('openrouter defaults to a live model id', () => {
  expect(PROVIDER_DEFAULTS.openrouter.model).toBe('google/gemini-2.5-flash');
});

it('zai falls back to ZHIPU_API_KEY when ZAI_API_KEY is unset', () => {
  const savedZai = process.env.ZAI_API_KEY;
  const savedZhipu = process.env.ZHIPU_API_KEY;
  delete process.env.ZAI_API_KEY;
  process.env.ZHIPU_API_KEY = 'zhipu-test-key';
  try {
    expect(() => getModel('zai')).not.toThrow();
  } finally {
    if (savedZai !== undefined) process.env.ZAI_API_KEY = savedZai;
    if (savedZhipu !== undefined) process.env.ZHIPU_API_KEY = savedZhipu;
    else delete process.env.ZHIPU_API_KEY;
  }
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run server/providers.test.ts`
Expected: 3 FAIL (old baseURL/model values; ZHIPU alias missing)

- [ ] **Step 3: Implement the fixes**

In `server/providers.ts` PROVIDER_DEFAULTS, change two lines:

```ts
  openrouter: { model: process.env.OPENROUTER_MODEL  || 'google/gemini-2.5-flash', baseURL: 'https://openrouter.ai/api/v1' },
  minimax:    { model: process.env.MINIMAX_MODEL     || 'MiniMax-M2',              baseURL: 'https://api.minimax.io/v1' },
```

In `getModel`, replace the key lookup line `const apiKey = process.env[keyEnv];` with:

```ts
  // Zhipu's key historically shipped as ZHIPU_API_KEY; accept either name.
  const apiKey = process.env[keyEnv] ?? (providerId === 'zai' ? process.env.ZHIPU_API_KEY : undefined);
```

In `src/pages/Quiz.tsx` PROVIDERS array, update two entries:

```ts
  { id: 'minimax',    label: 'MiniMax',    icon: '⚡', defaultModel: 'MiniMax-M2' },
  { id: 'openrouter', label: 'OpenRouter', icon: '🔀', defaultModel: 'google/gemini-2.5-flash' },
```

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run server/providers.test.ts`
Expected: PASS (all, including pre-existing)

- [ ] **Step 5: Smoke-test live connectivity (manual, real API call)**

Run: `npx tsx -e "import {getModel} from './server/providers.js'; import {generateText} from 'ai'; const r = await generateText({model: getModel('minimax'), prompt: 'Reply with exactly: OK', maxOutputTokens: 8}); console.log('minimax OK');"`
Expected: prints `minimax OK` (requires MINIMAX_API_KEY in env). If the key is absent, skip with a note — unit tests still gate the change.

- [ ] **Step 6: Commit**

```bash
git add server/providers.ts server/providers.test.ts src/pages/Quiz.tsx
git commit -m "fix(providers): MiniMax intl endpoint, live OpenRouter default, ZHIPU key alias"
```

---

### Task 2: Kiwix client + wiki tools

**Files:**
- Create: `server/wiki-tools.ts`
- Test: `server/wiki-tools.test.ts`

**Interfaces:**
- Consumes: nothing (Kiwix HTTP only).
- Produces:
  - `interface WikiSearchResult { title: string; path: string; snippet: string }`
  - `class KiwixClient { constructor(baseUrl?: string, zimName?: string); ping(): Promise<boolean>; search(query: string, limit?: number): Promise<WikiSearchResult[]>; readArticle(path: string): Promise<{ title: string; text: string }> }`
  - `parseSearchXml(xml: string): WikiSearchResult[]`
  - `htmlToText(html: string, maxChars?: number): string`
  - `createWikiTools(client: KiwixClient): { wikiSearch: ...; wikiRead: ... }` (AI SDK tools)

- [ ] **Step 1: Write the failing test** (`server/wiki-tools.test.ts`)

```ts
import { describe, it, expect } from 'vitest';
import { parseSearchXml, htmlToText, KiwixClient, createWikiTools } from './wiki-tools.js';

const SEARCH_XML = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <entry>
    <title>Babe Ruth</title>
    <link href="/raw/wikipedia_en_top_nopic/content/A/Babe_Ruth"/>
    <summary>American baseball player (1895–1948) …</summary>
  </entry>
  <entry>
    <title>1978 World Series</title>
    <link href="/raw/wikipedia_en_top_nopic/content/A/1978_World_Series"/>
    <summary>The 1978 World Series was the championship series …</summary>
  </entry>
</feed>`;

describe('parseSearchXml', () => {
  it('extracts title, path (without A/ prefix), and snippet', () => {
    const results = parseSearchXml(SEARCH_XML);
    expect(results).toHaveLength(2);
    expect(results[0]).toEqual({
      title: 'Babe Ruth',
      path: 'Babe_Ruth',
      snippet: 'American baseball player (1895–1948) …',
    });
  });

  it('returns [] on malformed xml', () => {
    expect(parseSearchXml('not xml at all')).toEqual([]);
  });
});

describe('htmlToText', () => {
  it('strips tags, scripts, styles and collapses whitespace', () => {
    const html = '<html><head><style>body{color:red}</style><script>var x=1;</script></head>' +
      '<body><h1>Title</h1><p>Hello <b>bold</b>   world &amp; friends</p></body></html>';
    expect(htmlToText(html)).toBe('Title Hello bold world & friends');
  });

  it('truncates to maxChars on a word boundary', () => {
    const long = '<p>' + 'word '.repeat(2000) + '</p>';
    const out = htmlToText(long, 100);
    expect(out.length).toBeLessThanOrEqual(101); // 100 + ellipsis
    expect(out.endsWith('…')).toBe(true);
  });
});

describe('KiwixClient', () => {
  it('ping returns false when server unreachable', async () => {
    const client = new KiwixClient('http://127.0.0.1:59999', 'test_zim');
    expect(await client.ping()).toBe(false);
  });

  it('search hits /search with format=xml and books.name', async () => {
    const calls: string[] = [];
    const client = new KiwixClient('http://fake', 'my_zim');
    (client as unknown as { fetchImpl: typeof fetch }).fetchImpl = async (url: unknown) => {
      calls.push(String(url));
      return new Response(SEARCH_XML, { status: 200 });
    };
    const results = await client.search('Babe Ruth', 3);
    expect(calls[0]).toContain('/search?');
    expect(calls[0]).toContain('pattern=Babe+Ruth');
    expect(calls[0]).toContain('books.name=my_zim');
    expect(calls[0]).toContain('format=xml');
    expect(calls[0]).toContain('pageLength=3');
    expect(results[0].path).toBe('Babe_Ruth');
  });

  it('readArticle fetches /raw/{zim}/content/A/{path} and returns text', async () => {
    const client = new KiwixClient('http://fake', 'my_zim');
    (client as unknown as { fetchImpl: typeof fetch }).fetchImpl = async (url: unknown) => {
      expect(String(url)).toBe('http://fake/raw/my_zim/content/A/Babe_Ruth');
      return new Response('<html><body><h1>Babe Ruth</h1><p>George Herman Ruth Jr.</p></body></html>', { status: 200 });
    };
    const article = await client.readArticle('Babe_Ruth');
    expect(article.title).toBe('Babe Ruth');
    expect(article.text).toContain('George Herman Ruth Jr.');
  });
});

describe('createWikiTools', () => {
  it('wikiSearch.execute delegates to client.search', async () => {
    const client = new KiwixClient('http://fake', 'zim');
    client.search = async (q: string) => [{ title: 'T', path: 'P', snippet: q }];
    const tools = createWikiTools(client);
    const out = await tools.wikiSearch.execute!(
      { query: '1978 World Series', limit: 5 },
      { toolCallId: 't1', messages: [] },
    );
    expect(out).toEqual([{ title: 'T', path: 'P', snippet: '1978 World Series' }]);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run server/wiki-tools.test.ts`
Expected: FAIL — `Cannot find module './wiki-tools.js'`

- [ ] **Step 3: Implement** (`server/wiki-tools.ts`)

```ts
import { tool } from 'ai';
import { z } from 'zod';

export interface WikiSearchResult {
  title: string;
  path: string;
  snippet: string;
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
}

export function htmlToText(html: string, maxChars = 4000): string {
  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');
  text = decodeEntities(text).replace(/\s+/g, ' ').trim();
  if (text.length <= maxChars) return text;
  const cut = text.slice(0, maxChars);
  return cut.slice(0, cut.lastIndexOf(' ')) + '…';
}

// kiwix-serve /search?format=xml returns an Atom-ish feed whose entries link
// to /raw/{zim}/content/A/{path}. Regex-based parsing is deliberate: the feed
// is simple and adding an XML dependency for it is not justified.
export function parseSearchXml(xml: string): WikiSearchResult[] {
  const results: WikiSearchResult[] = [];
  const entryRe = /<entry>([\s\S]*?)<\/entry>/g;
  let m: RegExpExecArray | null;
  while ((m = entryRe.exec(xml)) !== null) {
    const block = m[1];
    const title = /<title>([\s\S]*?)<\/title>/.exec(block)?.[1];
    const href = /<link[^>]*href="([^"]*)"/.exec(block)?.[1];
    const snippet = /<summary>([\s\S]*?)<\/summary>/.exec(block)?.[1] ?? '';
    if (!title || !href) continue;
    const pathMatch = /\/content\/A\/([^"?#]+)/.exec(href);
    if (!pathMatch) continue;
    results.push({
      title: decodeEntities(title).trim(),
      path: decodeURIComponent(pathMatch[1]),
      snippet: htmlToText(snippet, 300),
    });
  }
  return results;
}

export class KiwixClient {
  // fetchImpl is swappable in tests.
  fetchImpl: typeof fetch = fetch;

  constructor(
    private baseUrl: string = process.env.KIWIX_URL || 'http://localhost:8080',
    private zimName: string = process.env.KIWIX_ZIM || 'wikipedia_en_top_nopic',
  ) {}

  async ping(): Promise<boolean> {
    try {
      const res = await this.fetchImpl(`${this.baseUrl}/catalog/v2/root.xml`, {
        signal: AbortSignal.timeout(2000),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async search(query: string, limit = 5): Promise<WikiSearchResult[]> {
    const url = new URL(`${this.baseUrl}/search`);
    url.searchParams.set('pattern', query);
    url.searchParams.set('books.name', this.zimName);
    url.searchParams.set('pageLength', String(limit));
    url.searchParams.set('format', 'xml');
    const res = await this.fetchImpl(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`kiwix search failed: HTTP ${res.status}`);
    return parseSearchXml(await res.text());
  }

  async readArticle(path: string): Promise<{ title: string; text: string }> {
    const res = await this.fetchImpl(
      `${this.baseUrl}/raw/${this.zimName}/content/A/${encodeURIComponent(path)}`,
      { signal: AbortSignal.timeout(8000) },
    );
    if (!res.ok) throw new Error(`kiwix read failed: HTTP ${res.status}`);
    const html = await res.text();
    const title = /<h1[^>]*>([\s\S]*?)<\/h1>/.exec(html)?.[1];
    return {
      title: title ? htmlToText(title, 200) : path.replace(/_/g, ' '),
      text: htmlToText(html),
    };
  }
}

export function createWikiTools(client: KiwixClient) {
  return {
    wikiSearch: tool({
      description:
        'Search the offline Wikipedia archive for articles. Returns title, path, and snippet. Use before wikiRead.',
      inputSchema: z.object({
        query: z.string().describe('Free-text search, e.g. "1978 World Series"'),
        limit: z.number().int().min(1).max(10).default(5),
      }),
      execute: async ({ query, limit }) => client.search(query, limit),
    }),
    wikiRead: tool({
      description:
        'Read the plain text of a Wikipedia article by its path (from wikiSearch results, without the A/ prefix).',
      inputSchema: z.object({
        path: z.string().describe('Article path, e.g. "Babe_Ruth"'),
      }),
      execute: async ({ path }) => client.readArticle(path),
    }),
  };
}
```

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run server/wiki-tools.test.ts`
Expected: PASS (7 tests)

- [ ] **Step 5: Commit**

```bash
git add server/wiki-tools.ts server/wiki-tools.test.ts
git commit -m "feat(run): Kiwix HTTP client and AI SDK wiki tools"
```

---

### Task 3: Run engine (deterministic state machine)

**Files:**
- Create: `server/run-engine.ts`
- Test: `server/run-engine.test.ts`

**Interfaces:**
- Consumes: zod only.
- Produces (relied on by Tasks 4-7 — names must match exactly):
  - `const ERA_IDS = ['1950s','1960s','1970s','1980s','1990s','2000s'] as const; type EraId`
  - `interface Meters { capital: number; reputation: number; temporalRisk: number }`
  - `type BeatType = 'scenario' | 'knowledge_check' | 'finale'; type RunOutcome = 'active' | 'retired' | 'exiled'`
  - `interface Choice { id: string; text: string; effects: Partial<Meters> }`
  - `interface KnowledgeCheck { question: string; options: string[]; correctIndex: number; sourceArticle: string }`
  - `interface Beat { index: number; type: BeatType; title: string; narrative: string; choices: Choice[]; knowledgeCheck?: KnowledgeCheck; companionQuip?: string }`
  - `interface RunState { runId: string; era: EraId; companionId: string; beatIndex: number; totalBeats: number; meters: Meters; outcome: RunOutcome; checksAsked: number; checksCorrect: number }`
  - `LlmScenarioSchema`, `LlmKnowledgeCheckSchema` (zod)
  - `createRun(era: EraId, companionId: string, runId: string): RunState`
  - `nextBeatType(state: RunState): BeatType`
  - `canRetire(state: RunState): boolean`
  - `applyChoice(state: RunState, beat: Beat, choiceId: string): RunState` (throws `EngineError` on invalid choice / ended run)
  - `applyKnowledgeCheck(state: RunState, correct: boolean): RunState`
  - `retireRun(state: RunState): RunState`
  - `computeScore(state: RunState): number`
  - `class EngineError extends Error`

Rules (exact): start meters `{ capital: 100, reputation: 50, temporalRisk: 10 }`; `totalBeats = 10`; knowledge_check at indices 2, 5, 8 (`(index+1) % 3 === 0 && index < 9`); finale at index 9; retire allowed when `beatIndex >= 6`; exile at `temporalRisk >= 100`; reputation/risk clamp to [0,100]; capital floors at 0; score = `max(0, round(capital) + reputation*10 - temporalRisk*5 + checksCorrect*50)`.

- [ ] **Step 1: Write the failing test** (`server/run-engine.test.ts`)

```ts
import { describe, it, expect } from 'vitest';
import {
  createRun, nextBeatType, canRetire, applyChoice, applyKnowledgeCheck,
  retireRun, computeScore, EngineError, LlmScenarioSchema, type Beat,
} from './run-engine.js';

const base = () => createRun('1980s', 'doc', 'run-1');

function scenarioBeat(index: number): Beat {
  return {
    index, type: 'scenario', title: 'T', narrative: 'N',
    choices: [
      { id: 'a', text: 'Safe', effects: { capital: 10, reputation: 5, temporalRisk: -2 } },
      { id: 'b', text: 'Risky', effects: { capital: 40, temporalRisk: 15 } },
    ],
  };
}

describe('createRun', () => {
  it('starts with default meters and 10 beats', () => {
    const s = base();
    expect(s.meters).toEqual({ capital: 100, reputation: 50, temporalRisk: 10 });
    expect(s.totalBeats).toBe(10);
    expect(s.outcome).toBe('active');
    expect(s.beatIndex).toBe(0);
  });
});

describe('nextBeatType', () => {
  it('is knowledge_check at indices 2, 5, 8 and finale at 9', () => {
    const expected = ['scenario','scenario','knowledge_check','scenario','scenario','knowledge_check','scenario','scenario','knowledge_check','finale'];
    expected.forEach((type, i) => {
      expect(nextBeatType({ ...base(), beatIndex: i })).toBe(type);
    });
  });
});

describe('applyChoice', () => {
  it('applies effects, clamps meters, advances beatIndex', () => {
    const s = applyChoice(base(), scenarioBeat(0), 'b');
    expect(s.meters).toEqual({ capital: 140, reputation: 50, temporalRisk: 25 });
    expect(s.beatIndex).toBe(1);
  });

  it('clamps reputation/risk to [0,100] and capital to >= 0', () => {
    const beat: Beat = { ...scenarioBeat(0), choices: [{ id: 'a', text: 'x', effects: { capital: -999, reputation: -999, temporalRisk: -999 } }] };
    const s = applyChoice(base(), beat, 'a');
    expect(s.meters).toEqual({ capital: 0, reputation: 0, temporalRisk: 0 });
  });

  it('exiles the run when temporalRisk reaches 100', () => {
    const beat: Beat = { ...scenarioBeat(0), choices: [{ id: 'a', text: 'x', effects: { temporalRisk: 95 } }] };
    const s = applyChoice(base(), beat, 'a');
    expect(s.outcome).toBe('exiled');
  });

  it('throws EngineError on unknown choice or ended run', () => {
    expect(() => applyChoice(base(), scenarioBeat(0), 'zzz')).toThrow(EngineError);
    const ended = retireRun({ ...base(), beatIndex: 7 });
    expect(() => applyChoice(ended, scenarioBeat(7), 'a')).toThrow(EngineError);
  });
});

describe('knowledge checks, retire, score', () => {
  it('applyKnowledgeCheck tracks asked/correct and advances', () => {
    let s = applyKnowledgeCheck(base(), true);
    expect(s.checksAsked).toBe(1);
    expect(s.checksCorrect).toBe(1);
    expect(s.beatIndex).toBe(1);
    s = applyKnowledgeCheck(s, false);
    expect(s.checksCorrect).toBe(1);
  });

  it('canRetire only from beat 6', () => {
    expect(canRetire({ ...base(), beatIndex: 5 })).toBe(false);
    expect(canRetire({ ...base(), beatIndex: 6 })).toBe(true);
  });

  it('retireRun sets outcome retired; computeScore formula', () => {
    const s = retireRun({ ...base(), beatIndex: 8, meters: { capital: 200, reputation: 60, temporalRisk: 20 }, checksCorrect: 2 });
    expect(s.outcome).toBe('retired');
    expect(computeScore(s)).toBe(200 + 600 - 100 + 100);
  });
});

describe('LlmScenarioSchema', () => {
  it('accepts bounded effects, rejects out-of-range deltas', () => {
    const good = {
      title: 'T', narrative: 'N',
      choices: [
        { id: 'a', text: 'x', effects: { capital: 15, reputation: -15, temporalRisk: 15 } },
        { id: 'b', text: 'y', effects: {} },
      ],
    };
    expect(LlmScenarioSchema.safeParse(good).success).toBe(true);
    const bad = { ...good, choices: [{ id: 'a', text: 'x', effects: { capital: 500 } }] };
    expect(LlmScenarioSchema.safeParse(bad).success).toBe(false);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run server/run-engine.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement** (`server/run-engine.ts`)

```ts
import { z } from 'zod';

export const ERA_IDS = ['1950s', '1960s', '1970s', '1980s', '1990s', '2000s'] as const;
export type EraId = (typeof ERA_IDS)[number];

export interface Meters {
  capital: number;
  reputation: number;
  temporalRisk: number;
}

export type BeatType = 'scenario' | 'knowledge_check' | 'finale';
export type RunOutcome = 'active' | 'retired' | 'exiled';

export interface Choice {
  id: string;
  text: string;
  effects: Partial<Meters>;
}

export interface KnowledgeCheck {
  question: string;
  options: string[];
  correctIndex: number;
  sourceArticle: string;
}

export interface Beat {
  index: number;
  type: BeatType;
  title: string;
  narrative: string;
  choices: Choice[];
  knowledgeCheck?: KnowledgeCheck;
  companionQuip?: string;
}

export interface RunState {
  runId: string;
  era: EraId;
  companionId: string;
  beatIndex: number;
  totalBeats: number;
  meters: Meters;
  outcome: RunOutcome;
  checksAsked: number;
  checksCorrect: number;
}

export class EngineError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EngineError';
  }
}

// Bounds on LLM-proposed effects — the engine's defense against narrative inflation.
const EffectsSchema = z.object({
  capital: z.number().int().min(-50).max(50).optional(),
  reputation: z.number().int().min(-15).max(15).optional(),
  temporalRisk: z.number().int().min(-10).max(15).optional(),
});

export const LlmScenarioSchema = z.object({
  title: z.string().min(1).max(120),
  narrative: z.string().min(1).max(2000),
  choices: z.array(z.object({
    id: z.enum(['a', 'b', 'c', 'd']),
    text: z.string().min(1).max(300),
    effects: EffectsSchema,
  })).min(2).max(4),
});

export const LlmKnowledgeCheckSchema = z.object({
  question: z.string().min(1).max(500),
  options: z.array(z.string().min(1).max(300)).length(4),
  correctIndex: z.number().int().min(0).max(3),
  sourceArticle: z.string().min(1),
});

const START_METERS: Meters = { capital: 100, reputation: 50, temporalRisk: 10 };
const TOTAL_BEATS = 10;
const RETIRE_MIN_BEAT = 6;

export function createRun(era: EraId, companionId: string, runId: string): RunState {
  return {
    runId, era, companionId,
    beatIndex: 0, totalBeats: TOTAL_BEATS,
    meters: { ...START_METERS },
    outcome: 'active', checksAsked: 0, checksCorrect: 0,
  };
}

export function nextBeatType(state: RunState): BeatType {
  if (state.beatIndex >= state.totalBeats - 1) return 'finale';
  if ((state.beatIndex + 1) % 3 === 0) return 'knowledge_check';
  return 'scenario';
}

export function canRetire(state: RunState): boolean {
  return state.outcome === 'active' && state.beatIndex >= RETIRE_MIN_BEAT;
}

function clampMeters(m: Meters): Meters {
  return {
    capital: Math.max(0, Math.round(m.capital)),
    reputation: Math.min(100, Math.max(0, Math.round(m.reputation))),
    temporalRisk: Math.min(100, Math.max(0, Math.round(m.temporalRisk))),
  };
}

function withOutcome(state: RunState): RunState {
  if (state.meters.temporalRisk >= 100) return { ...state, outcome: 'exiled' };
  if (state.beatIndex >= state.totalBeats) return { ...state, outcome: 'retired' };
  return state;
}

function assertActive(state: RunState): void {
  if (state.outcome !== 'active') throw new EngineError(`run ${state.runId} already ended (${state.outcome})`);
}

export function applyChoice(state: RunState, beat: Beat, choiceId: string): RunState {
  assertActive(state);
  const choice = beat.choices.find(c => c.id === choiceId);
  if (!choice) throw new EngineError(`unknown choice "${choiceId}" for beat ${beat.index}`);
  const meters = clampMeters({
    capital: state.meters.capital + (choice.effects.capital ?? 0),
    reputation: state.meters.reputation + (choice.effects.reputation ?? 0),
    temporalRisk: state.meters.temporalRisk + (choice.effects.temporalRisk ?? 0),
  });
  return withOutcome({ ...state, meters, beatIndex: state.beatIndex + 1 });
}

export function applyKnowledgeCheck(state: RunState, correct: boolean): RunState {
  assertActive(state);
  const meters = clampMeters({
    ...state.meters,
    reputation: state.meters.reputation + (correct ? 5 : -5),
    temporalRisk: state.meters.temporalRisk + (correct ? -5 : 3),
  });
  return withOutcome({
    ...state,
    meters,
    beatIndex: state.beatIndex + 1,
    checksAsked: state.checksAsked + 1,
    checksCorrect: state.checksCorrect + (correct ? 1 : 0),
  });
}

export function retireRun(state: RunState): RunState {
  assertActive(state);
  return { ...state, outcome: 'retired' };
}

export function computeScore(state: RunState): number {
  return Math.max(
    0,
    Math.round(state.meters.capital)
      + state.meters.reputation * 10
      - state.meters.temporalRisk * 5
      + state.checksCorrect * 50,
  );
}
```

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run server/run-engine.test.ts`
Expected: PASS (10 tests)

- [ ] **Step 5: Commit**

```bash
git add server/run-engine.ts server/run-engine.test.ts
git commit -m "feat(run): deterministic run engine with zod-bounded LLM effects"
```

---

### Task 4: Run persistence

**Files:**
- Modify: `server/db.ts` (append RUN_MIGRATIONS + helpers)
- Test: `server/run-db.test.ts` (create)

**Interfaces:**
- Consumes: `RunState`, `Beat` from `./run-engine.js`; `AthenaDb` from `./db.js`.
- Produces:
  - `runRunMigrations(db: Database.Database): void`
  - `insertRun(db: AthenaDb, state: RunState): void`
  - `getRun(db: AthenaDb, runId: string): RunState | null`
  - `updateRun(db: AthenaDb, state: RunState): void`
  - `insertBeat(db: AthenaDb, runId: string, beat: Beat): void`
  - `getBeats(db: AthenaDb, runId: string): Beat[]`

Schema: `runs(run_id TEXT PK, era TEXT, companion_id TEXT, beat_index INTEGER, total_beats INTEGER, capital INTEGER, reputation INTEGER, temporal_risk INTEGER, outcome TEXT, checks_asked INTEGER, checks_correct INTEGER, created_at, updated_at)`; `run_beats(run_id TEXT, beat_index INTEGER, type TEXT, title TEXT, narrative TEXT, payload TEXT /* JSON: choices, knowledgeCheck, companionQuip */, PRIMARY KEY(run_id, beat_index))`.

- [ ] **Step 1: Write the failing test** (`server/run-db.test.ts`)

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { initAthenaDb, runRunMigrations, insertRun, getRun, updateRun, insertBeat, getBeats, type AthenaDb } from './db.js';
import { createRun, applyChoice, type Beat } from './run-engine.js';

describe('run persistence', () => {
  let db: AthenaDb;
  beforeEach(() => {
    db = initAthenaDb(':memory:');
    runRunMigrations(db._db);
  });

  it('round-trips a RunState', () => {
    const state = createRun('1970s', 'marty', 'run-x');
    insertRun(db, state);
    expect(getRun(db, 'run-x')).toEqual(state);
  });

  it('getRun returns null for unknown id', () => {
    expect(getRun(db, 'nope')).toBeNull();
  });

  it('updateRun persists meter and outcome changes', () => {
    const state = createRun('1980s', 'doc', 'run-y');
    insertRun(db, state);
    const beat: Beat = {
      index: 0, type: 'scenario', title: 'T', narrative: 'N',
      choices: [{ id: 'a', text: 'x', effects: { capital: 25, temporalRisk: 10 } }],
    };
    updateRun(db, applyChoice(state, beat, 'a'));
    const loaded = getRun(db, 'run-y')!;
    expect(loaded.meters.capital).toBe(125);
    expect(loaded.beatIndex).toBe(1);
  });

  it('round-trips beats in order', () => {
    insertRun(db, createRun('1990s', 'biff', 'run-z'));
    const b0: Beat = { index: 0, type: 'scenario', title: 'T0', narrative: 'N0', choices: [{ id: 'a', text: 'x', effects: {} }], companionQuip: 'Great Scott!' };
    const b1: Beat = { index: 1, type: 'knowledge_check', title: 'T1', narrative: 'N1', choices: [], knowledgeCheck: { question: 'Q?', options: ['1','2','3','4'], correctIndex: 2, sourceArticle: 'Babe_Ruth' } };
    insertBeat(db, 'run-z', b0);
    insertBeat(db, 'run-z', b1);
    const beats = getBeats(db, 'run-z');
    expect(beats).toHaveLength(2);
    expect(beats[0]).toEqual(b0);
    expect(beats[1].knowledgeCheck).toEqual(b1.knowledgeCheck);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run server/run-db.test.ts`
Expected: FAIL — `runRunMigrations is not a function` / not exported

- [ ] **Step 3: Implement** (append to `server/db.ts`; add `import type { RunState, Beat } from './run-engine.js';` at top)

```ts
// --- The Run (game) persistence ---

const RUN_MIGRATIONS = `
CREATE TABLE IF NOT EXISTS runs (
  run_id        TEXT PRIMARY KEY,
  era           TEXT NOT NULL,
  companion_id  TEXT NOT NULL,
  beat_index    INTEGER NOT NULL DEFAULT 0,
  total_beats   INTEGER NOT NULL DEFAULT 10,
  capital       INTEGER NOT NULL,
  reputation    INTEGER NOT NULL,
  temporal_risk INTEGER NOT NULL,
  outcome       TEXT NOT NULL DEFAULT 'active',
  checks_asked  INTEGER NOT NULL DEFAULT 0,
  checks_correct INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS run_beats (
  run_id     TEXT NOT NULL,
  beat_index INTEGER NOT NULL,
  type       TEXT NOT NULL,
  title      TEXT NOT NULL,
  narrative  TEXT NOT NULL,
  payload    TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (run_id, beat_index)
);
`;

export function runRunMigrations(db: Database.Database): void {
  db.exec(RUN_MIGRATIONS);
}

interface RunRow {
  run_id: string; era: string; companion_id: string;
  beat_index: number; total_beats: number;
  capital: number; reputation: number; temporal_risk: number;
  outcome: string; checks_asked: number; checks_correct: number;
}

function rowToState(r: RunRow): RunState {
  return {
    runId: r.run_id, era: r.era as RunState['era'], companionId: r.companion_id,
    beatIndex: r.beat_index, totalBeats: r.total_beats,
    meters: { capital: r.capital, reputation: r.reputation, temporalRisk: r.temporal_risk },
    outcome: r.outcome as RunState['outcome'],
    checksAsked: r.checks_asked, checksCorrect: r.checks_correct,
  };
}

export function insertRun(db: AthenaDb, state: RunState): void {
  db._db.prepare(`
    INSERT INTO runs (run_id, era, companion_id, beat_index, total_beats, capital, reputation, temporal_risk, outcome, checks_asked, checks_correct)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    state.runId, state.era, state.companionId, state.beatIndex, state.totalBeats,
    state.meters.capital, state.meters.reputation, state.meters.temporalRisk,
    state.outcome, state.checksAsked, state.checksCorrect,
  );
}

export function getRun(db: AthenaDb, runId: string): RunState | null {
  const row = db._db.prepare('SELECT * FROM runs WHERE run_id = ?').get(runId) as RunRow | undefined;
  return row ? rowToState(row) : null;
}

export function updateRun(db: AthenaDb, state: RunState): void {
  db._db.prepare(`
    UPDATE runs SET beat_index=?, capital=?, reputation=?, temporal_risk=?, outcome=?, checks_asked=?, checks_correct=?, updated_at=datetime('now')
    WHERE run_id=?
  `).run(
    state.beatIndex, state.meters.capital, state.meters.reputation, state.meters.temporalRisk,
    state.outcome, state.checksAsked, state.checksCorrect, state.runId,
  );
}

export function insertBeat(db: AthenaDb, runId: string, beat: Beat): void {
  db._db.prepare(`
    INSERT OR REPLACE INTO run_beats (run_id, beat_index, type, title, narrative, payload)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    runId, beat.index, beat.type, beat.title, beat.narrative,
    JSON.stringify({ choices: beat.choices, knowledgeCheck: beat.knowledgeCheck, companionQuip: beat.companionQuip }),
  );
}

export function getBeats(db: AthenaDb, runId: string): Beat[] {
  const rows = db._db.prepare('SELECT * FROM run_beats WHERE run_id = ? ORDER BY beat_index ASC').all(runId) as {
    beat_index: number; type: string; title: string; narrative: string; payload: string;
  }[];
  return rows.map(r => {
    const payload = JSON.parse(r.payload) as { choices?: Beat['choices']; knowledgeCheck?: Beat['knowledgeCheck']; companionQuip?: string };
    return {
      index: r.beat_index,
      type: r.type as Beat['type'],
      title: r.title,
      narrative: r.narrative,
      choices: payload.choices ?? [],
      knowledgeCheck: payload.knowledgeCheck,
      companionQuip: payload.companionQuip,
    };
  });
}
```

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run server/run-db.test.ts server/db.test.ts`
Expected: PASS (both files — existing db tests must stay green)

- [ ] **Step 5: Commit**

```bash
git add server/db.ts server/run-db.test.ts
git commit -m "feat(run): runs/run_beats tables and persistence helpers"
```

---

### Task 5: Run LLM orchestration

**Files:**
- Create: `server/run-llm.ts`
- Test: `server/run-llm.test.ts`

**Interfaces:**
- Consumes: `RunState, Beat, EraId, LlmScenarioSchema, LlmKnowledgeCheckSchema, nextBeatType` from `./run-engine.js`; `KiwixClient, createWikiTools` from `./wiki-tools.js`; `callProviderChain` from `./providers.js`; `LanguageModelV2` type from `'ai'`.
- Produces:
  - `stripThinkTags(text: string): string`
  - `extractJson(text: string): unknown` (throws on no JSON)
  - `generateBeat(args: { state: RunState; curatedExcerpt: string; model: LanguageModelV2; kiwix: KiwixClient | null }): Promise<Beat>` — scenario or finale beats
  - `generateKnowledgeCheckBeat(args: { state: RunState; model: LanguageModelV2; kiwix: KiwixClient | null }): Promise<Beat>`
  - `templateBeat(state: RunState, curatedExcerpt: string): Beat` — deterministic fallback (also stub mode)
  - `resolveRunModel(): LanguageModelV2` — env `RUN_PROVIDER` override, else tries `minimax` then `openrouter`
  - `generateCompanionQuip(args: { companionName: string; companionPrompt: string; beatTitle: string }): Promise<string>` — wraps `callProviderChain`, strips think tags, returns `''` on total failure

Behavior: `generateBeat` prompts the model for JSON matching `LlmScenarioSchema`, validates; on parse/validation failure retries once with a repair prompt; then falls back to `templateBeat`. `generateKnowledgeCheckBeat` gives the model `createWikiTools(kiwix)` with `stopWhen: stepCountIs(4)`; without a kiwix client it builds a check from `curatedExcerpt`. When `process.env.RUN_LLM_STUB === '1'`, all generators return `templateBeat`/canned quip without any model call (e2e + offline dev).

- [ ] **Step 1: Write the failing test** (`server/run-llm.test.ts`)

```ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { stripThinkTags, extractJson, generateBeat, templateBeat } from './run-llm.js';
import { createRun } from './run-engine.js';
import { MockLanguageModelV2 } from 'ai/test';

const state = createRun('1980s', 'doc', 'run-llm-1');

describe('stripThinkTags', () => {
  it('removes think blocks and trims', () => {
    expect(stripThinkTags('<think>\nreasoning\n</think>\n{"a":1}')).toBe('{"a":1}');
    expect(stripThinkTags('no tags')).toBe('no tags');
  });
});

describe('extractJson', () => {
  it('parses JSON embedded in prose', () => {
    expect(extractJson('Here you go:\n{"title":"T","x":[1,2]}\nDone')).toEqual({ title: 'T', x: [1, 2] });
  });
  it('throws when no JSON object present', () => {
    expect(() => extractJson('no json here')).toThrow(/no JSON/);
  });
});

describe('generateBeat', () => {
  const validJson = JSON.stringify({
    title: 'Pennant Race',
    narrative: 'October 1985. The Royals are down 3-1.',
    choices: [
      { id: 'a', text: 'Bet the farm', effects: { capital: 40, temporalRisk: 12 } },
      { id: 'b', text: 'Walk away', effects: { reputation: 5 } },
    ],
  });

  it('parses valid model output into a Beat', async () => {
    const model = new MockLanguageModelV2({
      doGenerate: async () => ({
        content: [{ type: 'text' as const, text: validJson }],
        finishReason: 'stop' as const,
        usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
        warnings: [],
      }),
    });
    const beat = await generateBeat({ state, curatedExcerpt: 'EXCERPT', model, kiwix: null });
    expect(beat.type).toBe('scenario');
    expect(beat.title).toBe('Pennant Race');
    expect(beat.choices).toHaveLength(2);
    expect(beat.index).toBe(state.beatIndex);
  });

  it('falls back to templateBeat after two invalid outputs', async () => {
    const model = new MockLanguageModelV2({
      doGenerate: async () => ({
        content: [{ type: 'text' as const, text: 'total garbage' }],
        finishReason: 'stop' as const,
        usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
        warnings: [],
      }),
    });
    const beat = await generateBeat({ state, curatedExcerpt: 'EXCERPT', model, kiwix: null });
    expect(beat.title).toContain('1980s'); // template title contains era
    expect(beat.choices.length).toBeGreaterThanOrEqual(2);
  });
});

describe('templateBeat + stub mode', () => {
  beforeEach(() => { process.env.RUN_LLM_STUB = '1'; });
  afterEach(() => { delete process.env.RUN_LLM_STUB; });

  it('generateBeat returns a template without calling the model when stubbed', async () => {
    const model = new MockLanguageModelV2({
      doGenerate: async () => { throw new Error('must not be called'); },
    });
    const beat = await generateBeat({ state, curatedExcerpt: 'EXCERPT', model, kiwix: null });
    expect(beat).toEqual(templateBeat(state, 'EXCERPT'));
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run server/run-llm.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement** (`server/run-llm.ts`)

```ts
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
  model: LanguageModelV2;
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

  if (process.env.RUN_LLM_STUB === '1' || !kiwix) {
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
```

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run server/run-llm.test.ts`
Expected: PASS (6 tests). If `ai/test` does not export `MockLanguageModelV2`, check installed version: `node -e "console.log(Object.keys(require('ai/test')))"` and adjust the import to the v6 testing entry point before re-running.

- [ ] **Step 5: Commit**

```bash
git add server/run-llm.ts server/run-llm.test.ts
git commit -m "feat(run): LLM orchestration with zod validation, repair retry, template fallback"
```

---

### Task 6: Run routes

**Files:**
- Create: `server/run-routes.ts`
- Modify: `server/index.ts` (register router + run migrations)
- Test: `server/run-routes.test.ts`

**Interfaces:**
- Consumes: Task 3 engine, Task 4 persistence, Task 5 generators, `KNOWLEDGE_MODULES` from `./knowledge/index.js`, `defaultCompanions` from `../src/data/companions.js` (for companion name/prompt lookup).
- Produces: `createRunRoutes(db: AthenaDb, deps?: RunRouteDeps): Router` where `RunRouteDeps = { generateBeatFn?: typeof generateBeat; generateKnowledgeCheckBeatFn?: typeof generateKnowledgeCheckBeat; generateCompanionQuipFn?: typeof generateCompanionQuip; resolveModelFn?: () => LanguageModelV2; kiwix?: KiwixClient | null }` — all optional, defaulting to the real implementations. Mounted at `/api/run` in `server/index.ts`.

Endpoints:
- `POST /start` `{ era, companionId }` → 201 `{ run, beat }`; 400 on invalid era/companion
- `POST /:id/choice` `{ choiceId }` → `{ run, beat: Beat | null }`; beat is null when run ended
- `POST /:id/knowledge-check` `{ answerIndex }` → `{ correct, run, beat: Beat | null }`
- `POST /:id/retire` → `{ run, score }`; 409 if `!canRetire`
- `GET /:id` → `{ run, beats }`; 404 unknown id
- EngineError → 400; unknown run → 404; ended run action → 409

Curated excerpt builder (in run-routes.ts): concatenate all strings in `KNOWLEDGE_MODULES[era]`, cap 3000 chars; era `'global'` falls back to concatenating the `global_*` modules.

- [ ] **Step 1: Write the failing test** (`server/run-routes.test.ts`)

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { initAthenaDb, runRunMigrations, type AthenaDb } from './db.js';
import { createRunRoutes } from './run-routes.js';
import { templateBeat, generateCompanionQuip } from './run-llm.js';
import { createRun, type Beat, type RunState } from './run-engine.js';

describe('Run Routes', () => {
  let app: express.Express;
  let db: AthenaDb;

  beforeEach(() => {
    process.env.RUN_LLM_STUB = '1'; // deterministic beats, no model calls
    db = initAthenaDb(':memory:');
    runRunMigrations(db._db);
    app = express();
    app.use(express.json());
    app.use('/api/run', createRunRoutes(db));
  });

  afterEach(() => { delete process.env.RUN_LLM_STUB; });

  it('POST /start creates a run and returns beat 0', async () => {
    const res = await request(app).post('/api/run/start').send({ era: '1980s', companionId: 'doc' });
    expect(res.status).toBe(201);
    expect(res.body.run.era).toBe('1980s');
    expect(res.body.run.meters).toEqual({ capital: 100, reputation: 50, temporalRisk: 10 });
    expect(res.body.beat.index).toBe(0);
    expect(res.body.beat.choices.length).toBeGreaterThanOrEqual(2);
  });

  it('POST /start rejects invalid era', async () => {
    const res = await request(app).post('/api/run/start').send({ era: '1899', companionId: 'doc' });
    expect(res.status).toBe(400);
  });

  it('choice flow: applies effects and returns next beat', async () => {
    const start = await request(app).post('/api/run/start').send({ era: '1970s', companionId: 'marty' });
    const runId = start.body.run.runId;
    const res = await request(app).post(`/api/run/${runId}/choice`).send({ choiceId: 'a' });
    expect(res.status).toBe(200);
    expect(res.body.run.beatIndex).toBe(1);
    expect(res.body.run.meters.capital).toBe(110); // template choice a: +10
    expect(res.body.beat.index).toBe(1);
  });

  it('returns 400 on unknown choice, 404 on unknown run', async () => {
    const start = await request(app).post('/api/run/start').send({ era: '1970s', companionId: 'marty' });
    const runId = start.body.run.runId;
    expect((await request(app).post(`/api/run/${runId}/choice`).send({ choiceId: 'zzz' })).status).toBe(400);
    expect((await request(app).post('/api/run/nope/choice').send({ choiceId: 'a' })).status).toBe(404);
  });

  it('knowledge-check beat grades the answer', async () => {
    const start = await request(app).post('/api/run/start').send({ era: '1990s', companionId: 'athena' });
    const runId = start.body.run.runId;
    await request(app).post(`/api/run/${runId}/choice`).send({ choiceId: 'a' }); // beat 1
    await request(app).post(`/api/run/${runId}/choice`).send({ choiceId: 'a' }); // beat 2 = knowledge_check
    const res = await request(app).post(`/api/run/${runId}/knowledge-check`).send({ answerIndex: 1 });
    expect(res.status).toBe(200);
    expect(res.body.correct).toBe(true); // template check correctIndex = 1
    expect(res.body.run.checksCorrect).toBe(1);
  });

  it('retire blocked before beat 6, allowed after; GET returns run + beats', async () => {
    const start = await request(app).post('/api/run/start').send({ era: '2000s', companionId: 'biff' });
    const runId = start.body.run.runId;
    expect((await request(app).post(`/api/run/${runId}/retire`)).status).toBe(409);

    // play through: scenario beats take choice 'a', knowledge checks answer 1
    for (let i = 0; i < 9; i++) {
      const state = (await request(app).get(`/api/run/${runId}`)).body.run;
      if (state.outcome !== 'active') break;
      const current = (await request(app).get(`/api/run/${runId}`)).body;
      const lastBeat = current.beats[current.beats.length - 1];
      if (lastBeat.type === 'knowledge_check') {
        await request(app).post(`/api/run/${runId}/knowledge-check`).send({ answerIndex: 1 });
      } else {
        await request(app).post(`/api/run/${runId}/choice`).send({ choiceId: 'a' });
      }
    }

    const retire = await request(app).post(`/api/run/${runId}/retire`);
    expect(retire.status).toBe(200);
    expect(retire.body.run.outcome).toBe('retired');
    expect(retire.body.score).toBeGreaterThan(0);

    const get = await request(app).get(`/api/run/${runId}`);
    expect(get.body.beats.length).toBeGreaterThanOrEqual(6);
  });
});
```

(Add `import { afterEach } from 'vitest';` to the imports when writing the file.)

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run server/run-routes.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement** (`server/run-routes.ts`)

```ts
import { Router } from 'express';
import crypto from 'node:crypto';
import type { AthenaDb } from './db.js';
import { getRun, insertRun, updateRun, insertBeat, getBeats } from './db.js';
import {
  ERA_IDS, createRun, nextBeatType, canRetire, applyChoice, applyKnowledgeCheck,
  retireRun, computeScore, EngineError,
  type Beat, type EraId, type RunState,
} from './run-engine.js';
import {
  generateBeat, generateKnowledgeCheckBeat, generateCompanionQuip, resolveRunModel,
} from './run-llm.js';
import { KiwixClient } from './wiki-tools.js';
import { KNOWLEDGE_MODULES } from './knowledge/index.js';
import { defaultCompanions } from '../src/data/companions.js';
import type { LanguageModelV2 } from 'ai';

export interface RunRouteDeps {
  generateBeatFn?: typeof generateBeat;
  generateKnowledgeCheckBeatFn?: typeof generateKnowledgeCheckBeat;
  generateCompanionQuipFn?: typeof generateCompanionQuip;
  resolveModelFn?: () => LanguageModelV2;
  kiwix?: KiwixClient | null;
}

function curatedExcerpt(era: string): string {
  const modules = KNOWLEDGE_MODULES[era] ?? KNOWLEDGE_MODULES['global'] ?? {};
  let out = '';
  for (const cat of Object.values(modules)) {
    for (const text of Object.values(cat)) {
      out += text + '\n';
      if (out.length > 3000) return out.slice(0, 3000);
    }
  }
  return out;
}

export function createRunRoutes(db: AthenaDb, deps: RunRouteDeps = {}): Router {
  const router = Router();
  const genBeat = deps.generateBeatFn ?? generateBeat;
  const genCheck = deps.generateKnowledgeCheckBeatFn ?? generateKnowledgeCheckBeat;
  const genQuip = deps.generateCompanionQuipFn ?? generateCompanionQuip;
  const model = (deps.resolveModelFn ?? resolveRunModel)();
  const kiwix = deps.kiwix !== undefined ? deps.kiwix : new KiwixClient();

  async function buildBeat(state: RunState): Promise<Beat> {
    const excerpt = curatedExcerpt(state.era);
    const type = nextBeatType(state);
    const beat = type === 'knowledge_check'
      ? await genCheck({ state, model, kiwix, curatedExcerpt: excerpt })
      : await genBeat({ state, curatedExcerpt: excerpt, model, kiwix });
    const companion = defaultCompanions.find(c => c.id === state.companionId);
    if (companion && companion.id !== 'custom') {
      beat.companionQuip = await genQuip({
        companionName: companion.name,
        companionPrompt: companion.prompt,
        beatTitle: beat.title,
      });
    }
    insertBeat(db, state.runId, beat);
    return beat;
  }

  function loadActiveRun(id: string): RunState {
    const state = getRun(db, id);
    if (!state) {
      const err = new Error(`run ${id} not found`);
      err.name = 'NotFoundError';
      throw err;
    }
    return state;
  }

  router.post('/start', async (req, res) => {
    const { era, companionId } = req.body ?? {};
    if (!ERA_IDS.includes(era as EraId)) {
      res.status(400).json({ error: `era must be one of ${ERA_IDS.join(', ')}` });
      return;
    }
    if (!defaultCompanions.some(c => c.id === companionId)) {
      res.status(400).json({ error: 'unknown companionId' });
      return;
    }
    const state = createRun(era as EraId, companionId, crypto.randomUUID());
    insertRun(db, state);
    const beat = await buildBeat(state);
    res.status(201).json({ run: state, beat });
  });

  router.post('/:id/choice', async (req, res) => {
    try {
      const state = loadActiveRun(req.params.id);
      const beats = getBeats(db, state.runId);
      const current = beats[beats.length - 1];
      if (!current || current.type === 'knowledge_check') {
        res.status(400).json({ error: 'current beat expects a knowledge-check answer' });
        return;
      }
      const next = applyChoice(state, current, req.body?.choiceId);
      updateRun(db, next);
      const beat = next.outcome === 'active' ? await buildBeat(next) : null;
      res.json({ run: next, beat });
    } catch (err) {
      handleRouteError(err, res);
    }
  });

  router.post('/:id/knowledge-check', async (req, res) => {
    try {
      const state = loadActiveRun(req.params.id);
      const beats = getBeats(db, state.runId);
      const current = beats[beats.length - 1];
      if (!current?.knowledgeCheck) {
        res.status(400).json({ error: 'current beat is not a knowledge check' });
        return;
      }
      const answerIndex = req.body?.answerIndex;
      if (typeof answerIndex !== 'number' || answerIndex < 0 || answerIndex >= current.knowledgeCheck.options.length) {
        res.status(400).json({ error: 'answerIndex out of range' });
        return;
      }
      const correct = answerIndex === current.knowledgeCheck.correctIndex;
      const next = applyKnowledgeCheck(state, correct);
      updateRun(db, next);
      const beat = next.outcome === 'active' ? await buildBeat(next) : null;
      res.json({ correct, run: next, beat });
    } catch (err) {
      handleRouteError(err, res);
    }
  });

  router.post('/:id/retire', (req, res) => {
    try {
      const state = loadActiveRun(req.params.id);
      if (!canRetire(state)) {
        res.status(409).json({ error: 'cannot retire yet — survive to beat 6' });
        return;
      }
      const retired = retireRun(state);
      updateRun(db, retired);
      res.json({ run: retired, score: computeScore(retired) });
    } catch (err) {
      handleRouteError(err, res);
    }
  });

  router.get('/:id', (req, res) => {
    try {
      const state = loadActiveRun(req.params.id);
      res.json({ run: state, beats: getBeats(db, state.runId) });
    } catch (err) {
      handleRouteError(err, res);
    }
  });

  return router;
}

function handleRouteError(err: unknown, res: import('express').Response): void {
  if (err instanceof EngineError) {
    res.status(400).json({ error: err.message });
    return;
  }
  if (err instanceof Error && err.name === 'NotFoundError') {
    res.status(404).json({ error: err.message });
    return;
  }
  const msg = err instanceof Error ? err.message : String(err);
  res.status(500).json({ error: msg });
}
```

In `server/index.ts`, add to the imports near the top:

```ts
import { runRunMigrations } from './db.js';
import { createRunRoutes } from './run-routes.js';
```

(merge `runRunMigrations` into the existing `./db.js` import instead of adding a second one), add after `runFeatureMigrations(athenaDb._db);`:

```ts
runRunMigrations(athenaDb._db);
```

and add next to the other `app.use` lines:

```ts
app.use('/api/run', createRunRoutes(athenaDb));
```

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run server/run-routes.test.ts`
Expected: PASS (6 tests). Then full server suite: `npx vitest run server/` — all green.

- [ ] **Step 5: Commit**

```bash
git add server/run-routes.ts server/run-routes.test.ts server/index.ts
git commit -m "feat(run): /api/run routes with stub-able LLM deps"
```

---

### Task 7: Frontend Run page

**Files:**
- Create: `src/hooks/useRun.ts`, `src/pages/Run.tsx`, `src/components/run/RunSetup.tsx`, `src/components/run/RunHUD.tsx`, `src/components/run/BeatView.tsx`, `src/components/run/RunSummary.tsx`
- Modify: `src/App.tsx` (lazy import, route, nav link, dashboard card)
- Test: `src/pages/Run.test.tsx`

**Interfaces:**
- Consumes: `/api/run/*` endpoints (Task 6 shapes); `useCompanion` context for companion display.
- Produces: route `/run`. `useRun()` returns `{ phase: 'setup' | 'playing' | 'summary', run, beat, correct, start(era), choose(choiceId), answer(idx), retire(), reset() }`. Types mirrored client-side: `RunState`, `Beat` (duplicate minimal interfaces in `src/hooks/useRun.ts` — server types are not shared across the boundary).

UI: Setup = era picker (6 era buttons) + Start. Playing = `RunHUD` (three meter bars: Capital, Reputation, Temporal Risk — use existing neutral/red/amber palette, red for risk per the unified risk color system), `BeatView` (title, narrative, choice buttons; knowledge-check renders options + submit), companion quip line under the beat, Retire button visible when `run.beatIndex >= 6`. Summary = outcome, score via retire response or final GET, Play Again (reset).

- [ ] **Step 1: Write the failing test** (`src/pages/Run.test.tsx`)

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Run } from './Run';

const startResponse = {
  run: {
    runId: 'r1', era: '1980s', companionId: 'athena', beatIndex: 0, totalBeats: 10,
    meters: { capital: 100, reputation: 50, temporalRisk: 10 },
    outcome: 'active', checksAsked: 0, checksCorrect: 0,
  },
  beat: {
    index: 0, type: 'scenario', title: 'Arrival', narrative: 'You land in 1985.',
    choices: [{ id: 'a', text: 'Look around', effects: {} }],
  },
};

describe('Run page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('shows setup, starts a run, renders the first beat and HUD', async () => {
    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      if (String(input).endsWith('/api/run/start') && init?.method === 'POST') {
        return new Response(JSON.stringify(startResponse), { status: 201 });
      }
      return new Response('{}', { status: 200 });
    }));

    render(<MemoryRouter><Run /></MemoryRouter>);
    expect(screen.getByText(/choose your destination/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /1980s/i }));
    fireEvent.click(screen.getByRole('button', { name: /jump/i }));

    await waitFor(() => expect(screen.getByText('Arrival')).toBeInTheDocument());
    expect(screen.getByText('You land in 1985.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Look around' })).toBeInTheDocument();
    expect(screen.getByText(/temporal risk/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/pages/Run.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 3: Implement**

`src/hooks/useRun.ts`:

```ts
import { useState, useCallback } from 'react';

export interface Meters { capital: number; reputation: number; temporalRisk: number }
export interface Choice { id: string; text: string; effects: Partial<Meters> }
export interface Beat {
  index: number;
  type: 'scenario' | 'knowledge_check' | 'finale';
  title: string;
  narrative: string;
  choices: Choice[];
  knowledgeCheck?: { question: string; options: string[]; correctIndex: number; sourceArticle: string };
  companionQuip?: string;
}
export interface RunState {
  runId: string; era: string; companionId: string;
  beatIndex: number; totalBeats: number;
  meters: Meters; outcome: 'active' | 'retired' | 'exiled';
  checksAsked: number; checksCorrect: number;
}

type Phase = 'setup' | 'playing' | 'summary';

async function post<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? `HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

export function useRun(companionId: string) {
  const [phase, setPhase] = useState<Phase>('setup');
  const [run, setRun] = useState<RunState | null>(null);
  const [beat, setBeat] = useState<Beat | null>(null);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState<number | null>(null);

  const start = useCallback(async (era: string) => {
    const data = await post<{ run: RunState; beat: Beat }>('/api/run/start', { era, companionId });
    setRun(data.run); setBeat(data.beat); setCorrect(null); setScore(null);
    setPhase('playing');
  }, [companionId]);

  const choose = useCallback(async (choiceId: string) => {
    if (!run) return;
    const data = await post<{ run: RunState; beat: Beat | null }>(`/api/run/${run.runId}/choice`, { choiceId });
    setRun(data.run); setBeat(data.beat); setCorrect(null);
    if (data.run.outcome !== 'active') setPhase('summary');
  }, [run]);

  const answer = useCallback(async (answerIndex: number) => {
    if (!run) return;
    const data = await post<{ correct: boolean; run: RunState; beat: Beat | null }>(`/api/run/${run.runId}/knowledge-check`, { answerIndex });
    setRun(data.run); setBeat(data.beat); setCorrect(data.correct);
    if (data.run.outcome !== 'active') setPhase('summary');
  }, [run]);

  const retire = useCallback(async () => {
    if (!run) return;
    const data = await post<{ run: RunState; score: number }>(`/api/run/${run.runId}/retire`);
    setRun(data.run); setScore(data.score); setPhase('summary');
  }, [run]);

  const reset = useCallback(() => {
    setPhase('setup'); setRun(null); setBeat(null); setCorrect(null); setScore(null);
  }, []);

  return { phase, run, beat, correct, score, start, choose, answer, retire, reset };
}
```

`src/components/run/RunHUD.tsx`:

```tsx
import type { Meters } from '@/hooks/useRun';

function Meter({ label, value, max, tone }: { label: string; value: number; max: number; tone: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="flex-1 min-w-0">
      <div className="flex justify-between text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
        <span>{label}</span><span>{value}</span>
      </div>
      <div className="h-2 rounded bg-neutral-800 overflow-hidden">
        <div className={`h-full ${tone}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function RunHUD({ meters }: { meters: Meters }) {
  return (
    <div className="flex gap-4 p-3 bg-neutral-900/50 border border-neutral-800 rounded-lg">
      <Meter label="Capital" value={meters.capital} max={500} tone="bg-emerald-500" />
      <Meter label="Reputation" value={meters.reputation} max={100} tone="bg-amber-400" />
      <Meter label="Temporal Risk" value={meters.temporalRisk} max={100} tone="bg-red-500" />
    </div>
  );
}
```

`src/components/run/RunSetup.tsx`:

```tsx
const ERAS = ['1950s', '1960s', '1970s', '1980s', '1990s', '2000s'];

export function RunSetup({ onStart, loading }: { onStart: (era: string) => void; loading: boolean }) {
  const [era, setEra] = useState('1980s');
  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">The Run</h1>
        <p className="text-neutral-400">Choose your destination, traveler. Survive 10 beats, grow your capital, and retire before the timeline notices you.</p>
      </div>
      <div className="grid grid-cols-3 gap-2" role="group" aria-label="Destination era">
        {ERAS.map(e => (
          <button
            key={e}
            onClick={() => setEra(e)}
            aria-pressed={era === e}
            className={`py-3 rounded-lg border text-sm font-semibold transition-colors cursor-pointer ${era === e ? 'bg-indigo-600/20 border-indigo-500/60 text-indigo-300' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'}`}
          >
            {e}
          </button>
        ))}
      </div>
      <button
        onClick={() => onStart(era)}
        disabled={loading}
        className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold transition-colors cursor-pointer"
      >
        {loading ? 'Jumping…' : `Jump to the ${era} ⚡`}
      </button>
    </div>
  );
}
```

(Add `import { useState } from 'react';` at the top of RunSetup.tsx.)

`src/components/run/BeatView.tsx`:

```tsx
import { useState } from 'react';
import type { Beat } from '@/hooks/useRun';

export function BeatView({ beat, correct, onChoose, onAnswer, busy }: {
  beat: Beat;
  correct: boolean | null;
  onChoose: (choiceId: string) => void;
  onAnswer: (idx: number) => void;
  busy: boolean;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const kc = beat.knowledgeCheck;

  return (
    <div className="space-y-4">
      <div>
        <div className="text-[10px] uppercase tracking-wider text-indigo-400 mb-1">
          Beat {beat.index + 1} · {beat.type.replace('_', ' ')}
        </div>
        <h2 className="text-xl font-bold text-white">{beat.title}</h2>
        <p className="text-neutral-300 mt-2 leading-relaxed">{beat.narrative}</p>
      </div>

      {kc ? (
        <div className="space-y-2">
          <p className="font-semibold text-neutral-200">{kc.question}</p>
          {kc.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => { setPicked(i); onAnswer(i); }}
              disabled={busy || picked !== null}
              className={`w-full text-left p-3 rounded-lg border text-sm transition-colors cursor-pointer ${
                picked === null
                  ? 'bg-neutral-900 border-neutral-800 hover:border-indigo-600 text-neutral-200'
                  : i === kc.correctIndex
                    ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-300'
                    : picked === i
                      ? 'bg-red-950/40 border-red-600/50 text-red-300'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-500'
              }`}
            >
              {opt}
            </button>
          ))}
          {correct !== null && (
            <p className={`text-sm ${correct ? 'text-emerald-400' : 'text-red-400'}`}>
              {correct ? 'Correct — the locals buy your cover.' : 'Wrong — a few eyebrows rise.'} (Source: {kc.sourceArticle})
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {beat.choices.map(c => (
            <button
              key={c.id}
              onClick={() => onChoose(c.id)}
              disabled={busy}
              className="w-full text-left p-3 rounded-lg border bg-neutral-900 border-neutral-800 hover:border-indigo-600 text-neutral-200 text-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              {c.text}
            </button>
          ))}
        </div>
      )}

      {beat.companionQuip && (
        <p className="text-sm italic text-purple-300/80 border-l-2 border-purple-800 pl-3">
          {beat.companionQuip}
        </p>
      )}
    </div>
  );
}
```

`src/components/run/RunSummary.tsx`:

```tsx
import type { RunState } from '@/hooks/useRun';

export function RunSummary({ run, score, onReset }: { run: RunState; score: number | null; onReset: () => void }) {
  const exiled = run.outcome === 'exiled';
  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-3xl font-bold tracking-tight">
        {exiled ? '⛔ Temporal Exile' : '🏁 Run Complete'}
      </h1>
      <p className="text-neutral-400">
        {exiled
          ? 'The timeline noticed you. A quiet van pulls up; your almanac is confiscated.'
          : `You retired after ${run.beatIndex} beats in the ${run.era}.`}
      </p>
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-neutral-900/50 border border-neutral-800 rounded-lg">
          <div className="text-2xl font-bold text-emerald-400">{run.meters.capital}</div>
          <div className="text-[10px] uppercase tracking-wider text-neutral-500">Capital</div>
        </div>
        <div className="p-3 bg-neutral-900/50 border border-neutral-800 rounded-lg">
          <div className="text-2xl font-bold text-amber-400">{run.checksCorrect}/{run.checksAsked}</div>
          <div className="text-[10px] uppercase tracking-wider text-neutral-500">Checks</div>
        </div>
        <div className="p-3 bg-neutral-900/50 border border-neutral-800 rounded-lg">
          <div className="text-2xl font-bold text-indigo-400">{score ?? '—'}</div>
          <div className="text-[10px] uppercase tracking-wider text-neutral-500">Score</div>
        </div>
      </div>
      <button
        onClick={onReset}
        className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors cursor-pointer"
      >
        Run It Back ⚡
      </button>
    </div>
  );
}
```

`src/pages/Run.tsx`:

```tsx
import { useState } from 'react';
import { useRun } from '@/hooks/useRun';
import { useCompanion } from '../context/CompanionContext';
import { RunSetup } from '@/components/run/RunSetup';
import { RunHUD } from '@/components/run/RunHUD';
import { BeatView } from '@/components/run/BeatView';
import { RunSummary } from '@/components/run/RunSummary';

export function Run() {
  const { activeCompanion } = useCompanion();
  const { phase, run, beat, correct, score, start, choose, answer, retire, reset } = useRun(activeCompanion.id);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wrap = (fn: () => Promise<void>) => async () => {
    setBusy(true); setError(null);
    try { await fn(); } catch (err) { setError(err instanceof Error ? err.message : String(err)); }
    finally { setBusy(false); }
  };

  if (phase === 'setup') {
    return (
      <div className="space-y-4">
        <RunSetup loading={busy} onStart={(era) => void wrap(() => start(era))()} />
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    );
  }

  if (phase === 'summary' && run) {
    return <RunSummary run={run} score={score} onReset={reset} />;
  }

  if (!run || !beat) return null;

  return (
    <div className="space-y-6 max-w-2xl">
      <RunHUD meters={run.meters} />
      <BeatView beat={beat} correct={correct} busy={busy}
        onChoose={(id) => void wrap(() => choose(id))()}
        onAnswer={(i) => void wrap(() => answer(i))()} />
      {run.beatIndex >= 6 && (
        <button
          onClick={() => void wrap(retire)()}
          disabled={busy}
          className="px-4 py-2 rounded-lg border border-emerald-700/50 bg-emerald-950/30 text-emerald-300 text-sm font-semibold hover:bg-emerald-950/60 transition-colors cursor-pointer"
        >
          Retire now and bank your score
        </button>
      )}
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
```

In `src/App.tsx`: add lazy import after the Quiz line:

```tsx
const Run = lazy(() => import('./pages/Run').then(m => ({ default: m.Run })));
```

add route after the quiz route:

```tsx
<Route path="/run" element={<Lazy><Run /></Lazy>} />
```

add nav link after the Quiz link (keep the offline dot pattern — The Run also needs the LLM):

```tsx
<Link to="/run" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
  Run
  {!isOnline && <span className="ml-1 text-[9px] text-amber-400" aria-label="Offline">●</span>}
</Link>
```

add a dashboard card after the LLM Testing Module card:

```tsx
<Card className="bg-neutral-900 border-neutral-800 hover:border-amber-500/50 transition-colors">
  <CardHeader>
    <CardTitle className="text-white">⚡ The Run</CardTitle>
    <CardDescription className="text-neutral-400">Jump to an era with your almanac. Grow capital, keep your cover, retire rich.</CardDescription>
  </CardHeader>
  <CardContent>
    <Link to="/run" className={buttonVariants({ variant: "secondary", className: "w-full text-center" })}>
      Start a Run
    </Link>
  </CardContent>
</Card>
```

- [ ] **Step 4: Run tests + type check**

Run: `npx vitest run src/pages/Run.test.tsx`
Expected: PASS
Run: `npx tsc -b 2>&1 | Select-String -Pattern 'run/'`
Expected: no output (no NEW errors in files this task touched; pre-existing unrelated errors remain)

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useRun.ts src/pages/Run.tsx src/pages/Run.test.tsx src/components/run/ src/App.tsx
git commit -m "feat(run): Run page with HUD, beats, knowledge checks, summary"
```

---

### Task 8: Kiwix setup script, docs, E2E

**Files:**
- Create: `scripts/kiwix-setup.mjs`, `e2e/run.spec.ts`, `docs/kiwix.md`
- Modify: `package.json` (add `"kiwix:setup": "node scripts/kiwix-setup.mjs"`)

**Interfaces:**
- Consumes: everything above.
- Produces: `pnpm kiwix:setup` (checks/downloads ZIM, prints kiwix-serve launch command); Playwright happy path against `RUN_LLM_STUB=1` backend.

- [ ] **Step 1: Write the setup script** (`scripts/kiwix-setup.mjs`)

```js
import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

const ZIM_NAME = process.env.KIWIX_ZIM || 'wikipedia_en_top_nopic';
const ZIM_DIR = path.join(process.cwd(), 'data', 'zim');
const INDEX_URL = 'https://download.kiwix.org/zim/wikipedia/';

async function findLatestZimUrl(name) {
  const html = await fetch(INDEX_URL).then(r => r.text());
  const matches = [...html.matchAll(/href="(wikipedia_en_top_nopic_\d{4}-\d{2}\.zim)"/g)].map(m => m[1]);
  if (matches.length === 0) throw new Error(`no ${name} files found on the Kiwix index`);
  const latest = matches.sort().at(-1);
  return INDEX_URL + latest;
}

const dest = path.join(ZIM_DIR, `${ZIM_NAME}.zim`);
if (fs.existsSync(dest)) {
  console.log(`[kiwix] ZIM already present: ${dest}`);
} else {
  fs.mkdirSync(ZIM_DIR, { recursive: true });
  const url = process.env.KIWIX_ZIM_URL || (await findLatestZimUrl(ZIM_NAME));
  console.log(`[kiwix] downloading ${url} (~1.1 GB) — this takes a while`);
  const res = await fetch(url);
  if (!res.ok || !res.body) throw new Error(`download failed: HTTP ${res.status}`);
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  console.log(`[kiwix] saved to ${dest}`);
}

console.log('\n[kiwix] Next: serve the ZIM with kiwix-serve:');
console.log(`  kiwix-serve --port=8080 "${dest}"`);
console.log('Then start the app — /api/run will use it automatically (KIWIX_URL/KIWIX_ZIM env vars to override).');
```

- [ ] **Step 2: Write docs** (`docs/kiwix.md`)

```markdown
# Offline Wikipedia (Kiwix) for The Run

The Run's knowledge checks ground questions in a local Wikipedia ZIM via kiwix-serve.

## Setup

1. `pnpm kiwix:setup` — downloads `wikipedia_en_top_nopic` (~1.1 GB, top-50k articles) to `data/zim/`.
2. Install kiwix-serve (Windows): `winget install Kiwix.KiwixServe` or download from https://download.kiwix.org/release/kiwix-tools/
3. Serve: `kiwix-serve --port=8080 data/zim/wikipedia_en_top_nopic.zim`
4. Start the app normally. Env overrides: `KIWIX_URL` (default `http://localhost:8080`), `KIWIX_ZIM` (default `wikipedia_en_top_nopic`).

Without kiwix-serve running, the game degrades to curated-only mode — fully playable, knowledge checks come from the built-in almanac instead of Wikipedia.
```

- [ ] **Step 3: Write the E2E spec** (`e2e/run.spec.ts`)

```ts
import { test, expect } from '@playwright/test';

// Requires the dev stack running with RUN_LLM_STUB=1 on the backend
// (deterministic template beats, no provider keys needed).
test('run happy path: start → choices → retire or finish', async ({ page }) => {
  await page.goto('/run');
  await expect(page.getByText(/choose your destination/i)).toBeVisible();

  await page.getByRole('button', { name: '1980s' }).click();
  await page.getByRole('button', { name: /jump/i }).click();

  // Play until summary appears (max 12 interactions)
  for (let i = 0; i < 12; i++) {
    if (await page.getByRole('button', { name: /run it back/i }).isVisible().catch(() => false)) break;
    const retireBtn = page.getByRole('button', { name: /retire now/i });
    if (await retireBtn.isVisible().catch(() => false)) {
      await retireBtn.click();
      break;
    }
    await page.locator('button').filter({ hasText: /.+/ }).first().click();
    await page.waitForTimeout(300);
  }

  await expect(page.getByText(/run complete|temporal exile/i)).toBeVisible({ timeout: 10000 });
});
```

Add to `package.json` scripts: `"kiwix:setup": "node scripts/kiwix-setup.mjs"`.

- [ ] **Step 4: Verify E2E manually**

Run backend stubbed: `powershell: $env:RUN_LLM_STUB='1'; npm run dev`
Run: `npx playwright test e2e/run.spec.ts`
Expected: PASS. (Check `playwright.config.ts` webServer first — if it auto-starts dev servers, set `RUN_LLM_STUB=1` in that config's env instead.)

- [ ] **Step 5: Verify live Kiwix integration (manual, after setup script)**

With kiwix-serve running on :8080 and backend in normal mode: start a run at `/run`, play to beat 3 (knowledge check), confirm the question cites a real Wikipedia article in the source line.

- [ ] **Step 6: Commit**

```bash
git add scripts/kiwix-setup.mjs docs/kiwix.md e2e/run.spec.ts package.json
git commit -m "feat(run): kiwix setup script, docs, e2e happy path"
```

---

## Self-Review Notes

- **Spec coverage:** Wave 0 → Task 1. Kiwix stack → Tasks 2, 8. Engine/LLM split → Tasks 3, 5. Persistence → Task 4. Routes/data flow → Task 6. Error handling/degradation → Task 5 (repair retry, template fallback, stub mode), Task 6 (error mapping), curated-only mode via `kiwix: null`/ping. Testing → per-task vitest + Task 8 e2e. Progress-page surfacing of scores: **deferred** — spec mentions it, but a minimal v1 ships without it; noted as follow-up, not blocking.
- **Type consistency:** `RunState`/`Beat`/`Choice`/`Meters`/`EngineError` identical across Tasks 3-7; route dep names (`generateBeatFn` etc.) match Task 5 exports; `runRunMigrations` name consistent in Tasks 4, 6.
- **Placeholder scan:** none — all steps contain code or exact commands; the only "adjust if needed" is the `ai/test` MockLanguageModelV2 import check with an exact verification command.
