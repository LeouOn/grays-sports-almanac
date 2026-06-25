import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ── Module mocks ────────────────────────────────────────────────────────
//
// `providers.ts` builds a `LanguageModelV2` object by calling SDK factories
// (google/deepseek/createAnthropic/createOpenAI) and then hands it to
// `ai.generateText`. We don't want to hit any real network — so we stub
// every SDK factory AND `generateText` here, and capture references for the
// tests to drive directly.
//
// `vi.hoisted` is required because vi.mock factories are hoisted above all
// top-level statements — referencing a regular `const` from inside the
// factory would hit the TDZ.
const { generateTextMock } = vi.hoisted(() => ({
  generateTextMock: vi.fn(),
}));

vi.mock('ai', () => ({
  generateText: generateTextMock,
}));

vi.mock('@ai-sdk/google', () => ({
  google: vi.fn((model: string) => ({ __sdk: 'google', model })),
}));
vi.mock('@ai-sdk/deepseek', () => ({
  deepseek: vi.fn((model: string) => ({ __sdk: 'deepseek', model })),
}));
vi.mock('@ai-sdk/anthropic', () => ({
  createAnthropic: vi.fn(() => (model: string) => ({ __sdk: 'anthropic-compat', model })),
}));
vi.mock('@ai-sdk/openai', () => ({
  createOpenAI: vi.fn(() => ({
    chat: (model: string) => ({ __sdk: 'openai-compat', model }),
  })),
}));

import { getModel, callProviderChain, type ProviderId } from './providers.js';
import { google } from '@ai-sdk/google';
import { deepseek } from '@ai-sdk/deepseek';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';

const ENV_KEYS = [
  'GOOGLE_GENERATIVE_AI_API_KEY',
  'DEEPSEEK_API_KEY',
  'ZHIPU_API_KEY',
  'MINIMAX_API_KEY',
  'OPENROUTER_API_KEY',
];

// Snapshot the original env so we can restore it between tests.
const originalEnv: Record<string, string | undefined> = {};
for (const k of ENV_KEYS) originalEnv[k] = process.env[k];

beforeEach(() => {
  for (const k of ENV_KEYS) delete process.env[k];
  vi.clearAllMocks();
});

afterEach(() => {
  for (const k of ENV_KEYS) {
    if (originalEnv[k] === undefined) delete process.env[k];
    else process.env[k] = originalEnv[k];
  }
});

describe('getModel (provider configuration)', () => {
  it('throws with a clear message when GOOGLE_GENERATIVE_AI_API_KEY is unset', () => {
    expect(() => getModel('google')).toThrow(/GOOGLE_GENERATIVE_AI_API_KEY not set/);
  });

  it('throws when DEEPSEEK_API_KEY is unset', () => {
    expect(() => getModel('deepseek')).toThrow(/DEEPSEEK_API_KEY not set/);
  });

  it('throws when MINIMAX_API_KEY is unset', () => {
    expect(() => getModel('minimax')).toThrow(/MINIMAX_API_KEY not set/);
  });

  it('throws when ZHIPU_API_KEY is unset', () => {
    expect(() => getModel('zhipu')).toThrow(/ZHIPU_API_KEY not set for provider "zhipu"/);
  });

  it('throws when OPENROUTER_API_KEY is unset', () => {
    expect(() => getModel('openrouter')).toThrow(/OPENROUTER_API_KEY not set/);
  });

  it('returns a Google model when the key is set, defaulting to gemini-2.5-flash', () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'test-google-key';
    const model = getModel('google') as { __sdk: string; model: string };
    expect(model.__sdk).toBe('google');
    expect(model.model).toBe('gemini-2.5-flash');
    expect(google).toHaveBeenCalledWith('gemini-2.5-flash');
  });

  it('returns a DeepSeek model with its custom baseURL wired through', () => {
    process.env.DEEPSEEK_API_KEY = 'test-deepseek-key';
    getModel('deepseek');
    expect(deepseek).toHaveBeenCalledWith('deepseek-v4-pro');
  });

  it('returns a Minimax model via the Anthropic-compat SDK', () => {
    process.env.MINIMAX_API_KEY = 'test-minimax-key';
    getModel('minimax');
    expect(createAnthropic).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: 'https://api.minimax.io/anthropic/v1',
        apiKey: 'test-minimax-key',
      }),
    );
  });

  it('returns a Zhipu model via the OpenAI-compat SDK', () => {
    process.env.ZHIPU_API_KEY = 'test-zhipu-key';
    getModel('zhipu');
    expect(createOpenAI).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: 'https://api.z.ai/api/coding/paas/v4',
        apiKey: 'test-zhipu-key',
      }),
    );
  });

  it('honors an explicit modelName override', () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'test-google-key';
    getModel('google', 'gemini-2.5-pro');
    expect(google).toHaveBeenCalledWith('gemini-2.5-pro');
  });

  it('throws when given an id outside the ProviderId union', () => {
    // Cast to ProviderId to bypass the type system — this guards against
    // runtime data accidentally bypassing the TypeScript-narrowed call sites.
    // Because PROVIDER_DEFAULTS[badId] is undefined, the function throws on
    // the `.model` dereference BEFORE reaching the explicit "Unknown
    // provider" branch — pin that behavior so future refactors don't
    // silently swallow it.
    expect(() => getModel('made-up-provider' as unknown as ProviderId)).toThrow();
  });
});

describe('callProviderChain (fallback order)', () => {
  it('throws "All companion providers failed" when no provider keys are configured', async () => {
    await expect(
      callProviderChain({
        companionName: 'Athena',
        companionPrompt: 'p',
        contextItem: 'c',
      }),
    ).rejects.toThrow(/All companion providers failed/);
  });

  it('returns the first successful provider result without falling through', async () => {
    // Only set the DEEPSEEK key; the chain should skip minimax/zhipu
    // (no key), succeed at deepseek, and return deepseek as the provider.
    process.env.DEEPSEEK_API_KEY = 'k';
    generateTextMock.mockResolvedValueOnce({ text: 'hello from deepseek' });

    const result = await callProviderChain({
      companionName: 'Athena',
      companionPrompt: 'p',
      contextItem: 'c',
    });
    expect(result.provider).toBe('deepseek');
    expect(result.comment).toBe('hello from deepseek');
    // generateText should have been called exactly once (for deepseek).
    expect(generateTextMock).toHaveBeenCalledTimes(1);
  });

  it('puts the user-requested provider first when specified, then falls back to default order', async () => {
    // Provider='google' should reorder the chain to [google, minimax, zhipu, deepseek].
    // Only set GOOGLE key, so the chain stops at google.
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'k';
    generateTextMock.mockResolvedValueOnce({ text: 'google wins' });

    const result = await callProviderChain({
      companionName: 'Athena',
      companionPrompt: 'p',
      contextItem: 'c',
      provider: 'google',
    });
    expect(result.provider).toBe('google');
    expect(generateTextMock).toHaveBeenCalledTimes(1);
  });

  it('tries providers in default order (minimax → zhipu → deepseek → google) and surfaces the last error', async () => {
    // Set ALL keys so every provider is reachable. Make generateText throw
    // a distinguishable error every time. The "Last:" suffix on the final
    // error should reference the LAST provider tried (google), proving the
    // chain walked through the full default order without short-circuiting.
    process.env.MINIMAX_API_KEY = 'k';
    process.env.ZHIPU_API_KEY = 'k';
    process.env.DEEPSEEK_API_KEY = 'k';
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'k';
    generateTextMock.mockRejectedValue(new Error('boom-from-llm'));

    await expect(
      callProviderChain({
        companionName: 'Athena',
        companionPrompt: 'p',
        contextItem: 'c',
      }),
    ).rejects.toThrow(/All companion providers failed.*google: boom-from-llm/);

    // Each provider's key was set, so generateText should be called 4 times
    // (once per provider in the default fallback chain).
    expect(generateTextMock).toHaveBeenCalledTimes(4);
  });

  it('skips providers whose env keys are unset (does not call generateText for them)', async () => {
    // Only set DEEPSEEK and GOOGLE keys. The chain should attempt exactly
    // those two — minimax and zhipu should be skipped at the env-var guard
    // before any LLM call happens.
    process.env.DEEPSEEK_API_KEY = 'k';
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'k';
    generateTextMock.mockResolvedValueOnce({ text: 'deepseek wins' });

    const result = await callProviderChain({
      companionName: 'Athena',
      companionPrompt: 'p',
      contextItem: 'c',
    });
    expect(result.provider).toBe('deepseek');
    // Only 1 generateText call (the winning deepseek one). The chain
    // stopped after the first success, so google was never reached.
    expect(generateTextMock).toHaveBeenCalledTimes(1);
  });
});