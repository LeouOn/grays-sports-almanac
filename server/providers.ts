// Provider chain for runtime LLM calls. Used by palaceLinkHandler (and the
// existing /api/companion/comment endpoint in index.ts). Extracted from the
// inline chain in index.ts so the new endpoint can share the same fallback
// order without modifying the existing route.
import { generateText, type LanguageModelV2 } from 'ai';
import { google } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { deepseek } from '@ai-sdk/deepseek';
import { createAnthropic } from '@ai-sdk/anthropic';

export type ProviderId = 'google' | 'deepseek' | 'zhipu' | 'minimax' | 'openrouter';

const KEY_ENV_MAP: Record<string, string> = {
  google:     'GOOGLE_GENERATIVE_AI_API_KEY',
  deepseek:   'DEEPSEEK_API_KEY',
  zhipu:      'ZHIPU_API_KEY',
  minimax:    'MINIMAX_API_KEY',
  openrouter: 'OPENROUTER_API_KEY',
};

const PROVIDER_DEFAULTS: Record<ProviderId, { model: string; baseURL?: string }> = {
  google:    { model: process.env.GOOGLE_MODEL    || 'gemini-2.5-flash' },
  deepseek:  { model: process.env.DEEPSEEK_MODEL  || 'deepseek-v4-pro', baseURL: 'https://api.deepseek.com' },
  zhipu:     { model: process.env.ZHIPU_MODEL     || 'glm-4.5',         baseURL: 'https://api.z.ai/api/coding/paas/v4' },
  minimax:   { model: process.env.MINIMAX_MODEL   || 'MiniMax-M3',      baseURL: 'https://api.minimax.io/anthropic/v1' },
  openrouter: { model: process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash', baseURL: 'https://openrouter.com/api/v1' },
};

export function getModel(providerId: ProviderId, modelName?: string): LanguageModelV2 {
  const cfg = PROVIDER_DEFAULTS[providerId];
  const model = modelName || cfg.model;

  if (providerId === 'google') {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) throw new Error('GOOGLE_GENERATIVE_AI_API_KEY not set');
    return google(model);
  }

  if (providerId === 'deepseek') {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) throw new Error('DEEPSEEK_API_KEY not set');
    return deepseek(model);
  }

  if (providerId === 'minimax') {
    const apiKey = process.env.MINIMAX_API_KEY;
    if (!apiKey) throw new Error('MINIMAX_API_KEY not set');
    const anthropic = createAnthropic({ baseURL: cfg.baseURL, apiKey });
    return anthropic(model);
  }

  if (cfg.baseURL) {
    const apiKey = process.env[KEY_ENV_MAP[providerId]];
    if (!apiKey) throw new Error(`${KEY_ENV_MAP[providerId]} not set for provider "${providerId}"`);

    const openai = createOpenAI({ baseURL: cfg.baseURL, apiKey });
    return openai.chat(model);
  }

  throw new Error(`Unknown provider: ${providerId}`);
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
 * configured and whose call succeeds wins. Mirrors the inline chain in the
 * existing /api/companion/comment route.
 */
export async function callProviderChain(
  args: CallProviderChainArgs
): Promise<CallProviderChainResult> {
  const { companionName, companionPrompt, contextItem, provider } = args;

  const fallbackOrder: ProviderId[] = provider
    ? [provider, 'minimax', 'zhipu', 'deepseek', 'google']
    : ['minimax', 'zhipu', 'deepseek', 'google'];

  let lastError = '';

  for (const pid of fallbackOrder) {
    const keyEnv = KEY_ENV_MAP[pid];
    if (keyEnv && !process.env[keyEnv]) {
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

      return { comment: response.text.trim(), provider: pid };
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : String(err);
      lastError = `${pid}: ${errMessage}`;
    }
  }

  throw new Error(`All companion providers failed. Last: ${lastError}`);
}
