import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { stripThinkTags, extractJson, generateBeat, templateBeat } from './run-llm.js';
import { createRun } from './run-engine.js';
// Brief used `MockLanguageModelV2` from 'ai/test'. Installed SDK (ai ^6.0.195)
// exports only `MockLanguageModelV3`; adapt minimally — same constructor
// signature (doGenerate returns text content) and the same doGenerateCalls
// counter, so the test assertions are unchanged. `generateText` in v6 accepts
// both V2 and V3 models.
import { MockLanguageModelV3 as MockLanguageModelV2 } from 'ai/test';

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
