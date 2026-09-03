// Provider chain for runtime LLM calls. Single source of truth for the
// ProviderId union, default models/baseURLs, API-key env mapping, model
// factory (getModel), and the cost-ordered fallback chain used by both
// palaceLinkHandler and the /api/companion/comment route in index.ts.
import { generateText, type LanguageModelV2 } from 'ai';
import { google } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';

export type ProviderId =
  | 'openai'
  | 'deepseek'
  | 'openrouter'
  | 'zai'
  | 'minimax'
  | 'gemini'
  | 'claude'
  | 'ollama';

export const KEY_ENV_MAP: Record<ProviderId, string> = {
  openai:     'OPENAI_API_KEY',
  deepseek:   'DEEPSEEK_API_KEY',
  openrouter: 'OPENROUTER_API_KEY',
  zai:        'ZAI_API_KEY',      // ZHIPU_API_KEY is also accepted as a fallback (see getModel).
  minimax:    'MINIMAX_API_KEY',
  gemini:     'GOOGLE_GENERATIVE_AI_API_KEY',
  claude:     'ANTHROPIC_API_KEY',
  ollama:     'OLLAMA_API_KEY',
};

export const PROVIDER_DEFAULTS: Record<ProviderId, { model: string; baseURL?: string }> = {
  openai:     { model: process.env.OPENAI_MODEL     || 'gpt-4o',                          baseURL: 'https://api.openai.com/v1' },
  deepseek:   { model: process.env.DEEPSEEK_MODEL   || 'deepseek-v4-flash',               baseURL: 'https://api.deepseek.com' },
  openrouter: { model: process.env.OPENROUTER_MODEL  || 'google/gemini-2.5-flash', baseURL: 'https://openrouter.ai/api/v1' },
  zai:        { model: process.env.ZAI_MODEL         || 'glm-5.1',                         baseURL: 'https://open.bigmodel.cn/api/paas/v4' },
  minimax:    { model: process.env.MINIMAX_MODEL     || 'MiniMax-M2',              baseURL: 'https://api.minimax.io/v1' },
  gemini:     { model: process.env.GEMINI_MODEL      || 'gemini-2.0-flash' },
  claude:     { model: process.env.CLAUDE_MODEL      || 'claude-sonnet-4-20250514',        baseURL: 'https://api.anthropic.com/v1' },
  ollama:     { model: process.env.OLLAMA_MODEL      || 'llama3.3',                        baseURL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434/v1' },
};

// Providers whose API key is optional (e.g. local Ollama needs no auth).
const OPTIONAL_KEY_PROVIDERS: ReadonlySet<ProviderId> = new Set<ProviderId>(['ollama']);

/**
 * Build a LanguageModelV2 for the given provider. Throws a clear error when a
 * required API key is missing. The handler class is chosen per the
 * LLM Provider Handlers spec:
 *   - gemini   → @ai-sdk/google
 *   - claude   → @ai-sdk/anthropic (with explicit baseURL)
 *   - deepseek → @ai-sdk/deepseek (own SDK; baseURL handled internally)
 *   - openai, openrouter, zai, minimax, ollama → OpenAI-compatible Chat
 */
export function getModel(providerId: ProviderId, modelName?: string): LanguageModelV2 {
  const cfg = PROVIDER_DEFAULTS[providerId];
  if (!cfg) {
    throw new Error(`Unknown provider: ${providerId}`);
  }
  const model = modelName || cfg.model;
  const keyEnv = KEY_ENV_MAP[providerId];
  const apiKey = process.env[keyEnv] ?? (providerId === 'zai' ? process.env.ZHIPU_API_KEY : undefined);
  const keyRequired = !OPTIONAL_KEY_PROVIDERS.has(providerId);
  if (keyRequired && !apiKey) {
    throw new Error(`${keyEnv} not set for provider "${providerId}"`);
  }

  // Gemini uses the dedicated Google SDK (no baseURL — Google's SDK handles it).
  if (providerId === 'gemini') {
    return google(model);
  }

  // Claude uses the dedicated Anthropic SDK with the spec's baseURL.
  if (providerId === 'claude') {
    return createAnthropic({ baseURL: cfg.baseURL, apiKey: apiKey! })(model);
  }

  // All remaining providers (openai, deepseek, openrouter, zai, minimax, ollama)
  // speak the OpenAI-compatible Chat Completions API. ollama may send an empty key.
  if (cfg.baseURL) {
    return createOpenAI({ baseURL: cfg.baseURL, apiKey: apiKey ?? '' }).chat(model);
  }

  throw new Error(`Unknown provider: ${providerId}`);
}

// ── Error normalization ─────────────────────────────────────
//
// Wrap provider errors in a consistent LLMError so routes can map them to
// HTTP statuses without sniffing vendor-specific message text. Timeout,
// auth, and rate-limit patterns are detected by regex; anything else is
// surfaced as a generic "Provider error".
export class LLMError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'LLMError';
  }
}

// Reasoning models (MiniMax-M2, GLM) emit <think>...</think> blocks in their
// completion text. Callers never want the model's inner monologue, so the
// chain strips it before returning a comment.
export function stripThinkTags(text: string): string {
  return text.replace(/<think>[\s\S]*?(<\/think>|$)/g, '').trim();
}

export function mapLLMError(err: unknown): LLMError {
  if (err instanceof LLMError) return err;
  const msg = err instanceof Error ? err.message : String(err);
  if (/timeout|timed\s*out|ETIMEDOUT|ECONNREFUSED/i.test(msg)) {
    return new LLMError('Connection timed out. Please check your network.');
  }
  if (/401|403|unauthorized|forbidden/i.test(msg)) {
    return new LLMError('Authentication failed. Please check your API key.');
  }
  if (/429|rate\s*limit/i.test(msg)) {
    return new LLMError('Rate limit exceeded. Please try again later.');
  }
  return new LLMError(`Provider error: ${msg}`);
}

export interface CallProviderChainArgs {
  companionName: string;
  companionPrompt: string;
  contextItem: string;
  provider?: ProviderId;
}

export interface CallProviderChainResult {
  comment: string;
  provider: ProviderId;
}

/**
 * Call the provider chain in cost order. The first provider whose key is
 * configured (when required) and whose call succeeds wins. Errors from
 * generateText are normalized through `mapLLMError` so the surfaced "Last:"
 * message is user-actionable rather than a vendor-specific blob.
 */
export async function callProviderChain(
  args: CallProviderChainArgs
): Promise<CallProviderChainResult> {
  const { companionName, companionPrompt, contextItem, provider } = args;

  const fallbackOrder: ProviderId[] = provider
    ? [provider, 'minimax', 'zai', 'deepseek', 'gemini', 'openai', 'claude', 'openrouter']
    : ['minimax', 'zai', 'deepseek', 'gemini', 'openai', 'claude', 'openrouter'];

  let lastError = '';

  for (const pid of fallbackOrder) {
    const keyEnv = KEY_ENV_MAP[pid];
    const hasKey = !!process.env[keyEnv];
    const keyRequired = !OPTIONAL_KEY_PROVIDERS.has(pid);
    if (keyRequired && !hasKey) {
      lastError = `${keyEnv} not set for ${pid}`;
      continue;
    }

    try {
      const model = getModel(pid);
      const response = await generateText({
        model,
        system: `You are ${companionName}, a time travel companion.
Here is your persona:
"${companionPrompt}"

Your job is to provide a single, short, witty, in-character comment (max 2 sentences) about the historical item or facts the user is currently looking at.
Do not break character. Do not output anything other than your in-character dialogue. Do not wrap it in quotes.`,
        prompt: `The user is currently reading this historical guide entry: "${contextItem}". What is your reaction?`,
      });

      return { comment: stripThinkTags(response.text.trim()), provider: pid };
    } catch (err: unknown) {
      lastError = `${pid}: ${mapLLMError(err).message}`;
    }
  }

  throw new Error(`All companion providers failed. Last: ${lastError}`);
}
