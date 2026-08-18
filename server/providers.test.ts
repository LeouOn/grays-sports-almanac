import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ── Module mocks ────────────────────────────────────────────────────────
//
// `providers.ts` builds a `LanguageModelV2` object by calling SDK factories
// (google/createAnthropic/createOpenAI) and then hands it to
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
vi.mock('@ai-sdk/anthropic', () => ({
  createAnthropic: vi.fn(() => (model: string) => ({ __sdk: 'anthropic-compat', model })),
}));
vi.mock('@ai-sdk/openai', () => ({
  createOpenAI: vi.fn(() => ({
    chat: (model: string) => ({ __sdk: 'openai-compat', model }),
  })),
}));

import { getModel, callProviderChain, mapLLMError, LLMError, PROVIDER_DEFAULTS, type ProviderId } from './providers.js';
import { google } from '@ai-sdk/google';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';

const ENV_KEYS = [
  'OPENAI_API_KEY',
  'DEEPSEEK_API_KEY',
  'OPENROUTER_API_KEY',
  'ZAI_API_KEY',
  'MINIMAX_API_KEY',
  'GOOGLE_GENERATIVE_AI_API_KEY',
  'ANTHROPIC_API_KEY',
  'OLLAMA_API_KEY',
  'ZHIPU_API_KEY',
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

// ── getModel: missing API key ───────────────────────────────────────────

describe('getModel (provider configuration) — missing API key', () => {
  it('throws when OPENAI_API_KEY is unset', () => {
    expect(() => getModel('openai')).toThrow(/OPENAI_API_KEY not set/);
  });

  it('throws when DEEPSEEK_API_KEY is unset', () => {
    expect(() => getModel('deepseek')).toThrow(/DEEPSEEK_API_KEY not set/);
  });

  it('throws when OPENROUTER_API_KEY is unset', () => {
    expect(() => getModel('openrouter')).toThrow(/OPENROUTER_API_KEY not set/);
  });

  it('throws when ZAI_API_KEY (and ZHIPU_API_KEY) is unset', () => {
    expect(() => getModel('zai')).toThrow(/ZAI_API_KEY not set/);
  });

  it('throws when MINIMAX_API_KEY is unset', () => {
    expect(() => getModel('minimax')).toThrow(/MINIMAX_API_KEY not set/);
  });

  it('throws when GOOGLE_GENERATIVE_AI_API_KEY is unset', () => {
    expect(() => getModel('gemini')).toThrow(/GOOGLE_GENERATIVE_AI_API_KEY not set/);
  });

  it('throws when ANTHROPIC_API_KEY is unset', () => {
    expect(() => getModel('claude')).toThrow(/ANTHROPIC_API_KEY not set/);
  });
});

// ── getModel: happy path for all 8 providers ────────────────────────────

describe('getModel (provider configuration) — model construction', () => {
  it('returns a Gemini model via the Google SDK, defaulting to gemini-2.0-flash', () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'test-gemini-key';
    const model = getModel('gemini') as { __sdk: string; model: string };
    expect(model.__sdk).toBe('google');
    expect(model.model).toBe('gemini-2.0-flash');
    expect(google).toHaveBeenCalledWith('gemini-2.0-flash');
  });

  it('returns a Claude model via the Anthropic SDK with the correct baseURL', () => {
    process.env.ANTHROPIC_API_KEY = 'test-claude-key';
    const model = getModel('claude') as { __sdk: string; model: string };
    expect(model.__sdk).toBe('anthropic-compat');
    expect(model.model).toBe('claude-sonnet-4-20250514');
    expect(createAnthropic).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: 'https://api.anthropic.com/v1',
        apiKey: 'test-claude-key',
      }),
    );
  });

  it('returns an OpenAI model via the OpenAI-compat SDK with the correct baseURL', () => {
    process.env.OPENAI_API_KEY = 'test-openai-key';
    const model = getModel('openai') as { __sdk: string; model: string };
    expect(model.__sdk).toBe('openai-compat');
    expect(model.model).toBe('gpt-4o');
    expect(createOpenAI).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: 'https://api.openai.com/v1',
        apiKey: 'test-openai-key',
      }),
    );
  });

  it('returns a DeepSeek model via the OpenAI-compat SDK with the deepseek baseURL', () => {
    process.env.DEEPSEEK_API_KEY = 'test-deepseek-key';
    const model = getModel('deepseek') as { __sdk: string; model: string };
    expect(model.__sdk).toBe('openai-compat');
    expect(model.model).toBe('deepseek-v4-flash');
    expect(createOpenAI).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: 'https://api.deepseek.com',
        apiKey: 'test-deepseek-key',
      }),
    );
  });

  it('returns an OpenRouter model via the OpenAI-compat SDK with the openrouter baseURL', () => {
    process.env.OPENROUTER_API_KEY = 'test-openrouter-key';
    const model = getModel('openrouter') as { __sdk: string; model: string };
    expect(model.__sdk).toBe('openai-compat');
    expect(model.model).toBe('google/gemini-2.5-flash');
    expect(createOpenAI).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: 'test-openrouter-key',
      }),
    );
  });

  it('returns a ZAI model via the OpenAI-compat SDK with the bigmodel.cn baseURL', () => {
    process.env.ZAI_API_KEY = 'test-zai-key';
    const model = getModel('zai') as { __sdk: string; model: string };
    expect(model.__sdk).toBe('openai-compat');
    expect(model.model).toBe('glm-5.1');
    expect(createOpenAI).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: 'https://open.bigmodel.cn/api/paas/v4',
        apiKey: 'test-zai-key',
      }),
    );
  });

  it('returns a Minimax model via the OpenAI-compat SDK (NOT Anthropic) with the minimax baseURL', () => {
    process.env.MINIMAX_API_KEY = 'test-minimax-key';
    const model = getModel('minimax') as { __sdk: string; model: string };
    // CRITICAL: minimax must use the OpenAI-compatible handler, not Anthropic.
    expect(model.__sdk).toBe('openai-compat');
    expect(model.model).toBe('MiniMax-M2');
    expect(createOpenAI).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: 'https://api.minimax.io/v1',
        apiKey: 'test-minimax-key',
      }),
    );
    // And it must NOT have touched the Anthropic SDK.
    expect(createAnthropic).not.toHaveBeenCalled();
  });

  it('returns an Ollama model via the OpenAI-compat SDK without requiring an API key (local)', () => {
    // ollama runs locally — no API key needed. getModel should not throw
    // and should wire the local base URL through createOpenAI.
    const model = getModel('ollama') as { __sdk: string; model: string };
    expect(model.__sdk).toBe('openai-compat');
    expect(model.model).toBe('llama3.3');
    expect(createOpenAI).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: 'http://localhost:11434/v1',
      }),
    );
  });

  it('honors an explicit modelName override', () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'test-gemini-key';
    getModel('gemini', 'gemini-2.5-pro');
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
});

// ── mapLLMError: error mapping ──────────────────────────────────────────

describe('mapLLMError (error mapping)', () => {
  it('maps timeout errors to a friendly "Connection timed out" message', () => {
    const result = mapLLMError(new Error('Connection timed out'));
    expect(result).toBeInstanceOf(LLMError);
    expect(result.message).toBe('Connection timed out. Please check your network.');
  });

  it('maps ETIMEDOUT-style errors to the timeout message', () => {
    const result = mapLLMError(new Error('ETIMEDOUT'));
    expect(result).toBeInstanceOf(LLMError);
    expect(result.message).toBe('Connection timed out. Please check your network.');
  });

  it('maps "timed out" (with space) to the timeout message', () => {
    const result = mapLLMError(new Error('the request timed out after 30000ms'));
    expect(result.message).toBe('Connection timed out. Please check your network.');
  });

  it('maps 401 Unauthorized errors to an authentication-failed message', () => {
    const result = mapLLMError(new Error('401 Unauthorized'));
    expect(result).toBeInstanceOf(LLMError);
    expect(result.message).toBe('Authentication failed. Please check your API key.');
  });

  it('maps 403 Forbidden errors to an authentication-failed message', () => {
    const result = mapLLMError(new Error('403 Forbidden'));
    expect(result).toBeInstanceOf(LLMError);
    expect(result.message).toBe('Authentication failed. Please check your API key.');
  });

  it('maps "unauthorized" keyword to the authentication-failed message', () => {
    const result = mapLLMError(new Error('unauthorized access'));
    expect(result.message).toBe('Authentication failed. Please check your API key.');
  });

  it('maps 429 rate-limit errors to a rate-limit message', () => {
    const result = mapLLMError(new Error('429 Too Many Requests'));
    expect(result).toBeInstanceOf(LLMError);
    expect(result.message).toBe('Rate limit exceeded. Please try again later.');
  });

  it('maps "rate limit" keyword to the rate-limit message', () => {
    const result = mapLLMError(new Error('rate limit exceeded'));
    expect(result.message).toBe('Rate limit exceeded. Please try again later.');
  });

  it('maps unknown errors to a generic "Provider error" message that includes the original text', () => {
    const result = mapLLMError(new Error('something completely unexpected'));
    expect(result).toBeInstanceOf(LLMError);
    expect(result.message).toBe('Provider error: something completely unexpected');
  });

  it('passes through an existing LLMError unchanged (same instance)', () => {
    const original = new LLMError('already mapped', 500);
    const result = mapLLMError(original);
    expect(result).toBe(original);
    expect(result.message).toBe('already mapped');
    expect(result.statusCode).toBe(500);
  });

  it('handles non-Error throwables by stringifying them', () => {
    const result = mapLLMError('a plain string error');
    expect(result).toBeInstanceOf(LLMError);
    expect(result.message).toBe('Provider error: a plain string error');
  });
});

// ── callProviderChain: fallback order ───────────────────────────────────

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
    // minimax is first in the default chain. Set only its key, succeed
    // immediately, and verify the chain stops there.
    process.env.MINIMAX_API_KEY = 'k';
    generateTextMock.mockResolvedValueOnce({ text: 'hello from minimax' });

    const result = await callProviderChain({
      companionName: 'Athena',
      companionPrompt: 'p',
      contextItem: 'c',
    });
    expect(result.provider).toBe('minimax');
    expect(result.comment).toBe('hello from minimax');
    expect(generateTextMock).toHaveBeenCalledTimes(1);
  });

  it('puts the user-requested provider first when specified, then falls back to default order', async () => {
    // provider='gemini' should reorder the chain to put gemini first.
    // Only set GOOGLE key, so the chain stops at gemini.
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'k';
    generateTextMock.mockResolvedValueOnce({ text: 'gemini wins' });

    const result = await callProviderChain({
      companionName: 'Athena',
      companionPrompt: 'p',
      contextItem: 'c',
      provider: 'gemini',
    });
    expect(result.provider).toBe('gemini');
    expect(generateTextMock).toHaveBeenCalledTimes(1);
  });

  it('tries providers in default order and surfaces the last error (openrouter is last)', async () => {
    // Set ALL keys so every provider in the default chain is reachable.
    // Make generateText throw a distinguishable error every time. The
    // "Last:" suffix on the final error should reference the LAST provider
    // tried (openrouter), proving the chain walked the full default order.
    process.env.MINIMAX_API_KEY = 'k';
    process.env.ZAI_API_KEY = 'k';
    process.env.DEEPSEEK_API_KEY = 'k';
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'k';
    process.env.OPENAI_API_KEY = 'k';
    process.env.ANTHROPIC_API_KEY = 'k';
    process.env.OPENROUTER_API_KEY = 'k';
    generateTextMock.mockRejectedValue(new Error('boom-from-llm'));

    await expect(
      callProviderChain({
        companionName: 'Athena',
        companionPrompt: 'p',
        contextItem: 'c',
      }),
    ).rejects.toThrow(/All companion providers failed.*openrouter.*boom-from-llm/);

    // 7 providers in the default chain (ollama excluded), all keys set:
    // minimax → zai → deepseek → gemini → openai → claude → openrouter.
    expect(generateTextMock).toHaveBeenCalledTimes(7);
  });

  it('skips providers whose env keys are unset (does not call generateText for them)', async () => {
    // Only set DEEPSEEK and GEMINI keys. The chain (minimax → zai → deepseek
    // → gemini → openai → claude → openrouter) should skip minimax and zai
    // (no key), succeed at deepseek, and never reach gemini.
    process.env.DEEPSEEK_API_KEY = 'k';
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'k';
    generateTextMock.mockResolvedValueOnce({ text: 'deepseek wins' });

    const result = await callProviderChain({
      companionName: 'Athena',
      companionPrompt: 'p',
      contextItem: 'c',
    });
    expect(result.provider).toBe('deepseek');
    expect(generateTextMock).toHaveBeenCalledTimes(1);
  });

  it('uses an explicitly-requested local ollama provider without requiring its key', async () => {
    // ollama is local — no API key needed. When the user explicitly asks
    // for ollama, the chain should attempt it first even though
    // OLLAMA_API_KEY is unset.
    generateTextMock.mockResolvedValueOnce({ text: 'hello from ollama' });

    const result = await callProviderChain({
      companionName: 'Athena',
      companionPrompt: 'p',
      contextItem: 'c',
      provider: 'ollama',
    });
    expect(result.provider).toBe('ollama');
    expect(result.comment).toBe('hello from ollama');
    expect(generateTextMock).toHaveBeenCalledTimes(1);
  });
});
