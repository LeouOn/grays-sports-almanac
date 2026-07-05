/**
 * Client-direct LLM calls for native (Capacitor) builds.
 *
 * On Android, the app can call provider APIs directly from the WebView —
 * Capacitor bypasses CORS, so we can hit provider endpoints with the user's
 * stored API key without going through a server proxy.
 *
 * The three handler functions mirror the LLM Provider Handlers spec:
 * - openAICompatibleChat: openai, deepseek, openrouter, zai, minimax, ollama
 * - claudeChat: claude
 * - geminiChat: gemini
 *
 * On web, this module is unused — the Quiz page calls the server proxy
 * (useChat → /api/chat on the Express server).
 */

import { isNative } from './platform';

// ── Shared types ─────────────────────────────────────────────

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMRequest {
  model: string;
  messages: LLMMessage[];
  temperature?: number;
  maxTokens?: number;
  /** Provider-specific system prompt. For Claude/Gemini this is a top-level
   * field; for OpenAI-compatible it becomes a `role: system` message. */
  systemPrompt?: string;
}

export interface LLMUsage {
  promptTokens: number;
  completionTokens: number;
}

export interface LLMResult {
  text: string;
  thinking?: string;
  usage?: LLMUsage;
}

// ── Error mapping (matches the spec) ────────────────────────

export class LLMError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'LLMError';
  }
}

function mapHTTPError(status: number, raw: string): LLMError {
  if (status === 401 || status === 403) {
    return new LLMError('Authentication failed. Please check your API key.', status);
  }
  if (status === 429) {
    return new LLMError('Rate limit exceeded. Please try again later.', status);
  }
  if (status >= 500) {
    return new LLMError(`Provider error (${status}): ${raw}`, status);
  }
  return new LLMError(`Provider error: HTTP ${status} ${raw}`, status);
}

async function safeJson(response: Response): Promise<{ ok: boolean; status: number; data: unknown; raw: string }> {
  const raw = await response.text();
  try {
    return { ok: response.ok, status: response.status, data: JSON.parse(raw), raw };
  } catch {
    return { ok: response.ok, status: response.status, data: null, raw };
  }
}

// ── OpenAI-compatible handler ────────────────────────────────
// Covers: openai, deepseek, openrouter, zai, minimax, ollama
// Endpoint: POST {baseUrl}/chat/completions
// Auth: Authorization: Bearer <apiKey>
// Body: { model, messages, temperature }
// Response: { choices: [{ message: { content, reasoning_content } }], usage }

export async function openAICompatibleChat(
  baseUrl: string,
  apiKey: string,
  req: LLMRequest,
): Promise<LLMResult> {
  // Convert system prompt to a role: system message
  const messages: LLMMessage[] = [
    ...(req.systemPrompt ? [{ role: 'system' as const, content: req.systemPrompt }] : []),
    ...req.messages,
  ];

  const response = await fetch(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: req.model,
      messages,
      ...(req.temperature !== undefined ? { temperature: req.temperature } : {}),
    }),
  });

  const { ok, status, data, raw } = await safeJson(response);
  if (!ok) throw mapHTTPError(status, raw);

  const body = data as {
    choices?: Array<{ message?: { content?: string; reasoning_content?: string } }>;
    usage?: { prompt_tokens?: number; completion_tokens?: number };
  };

  const message = body.choices?.[0]?.message;
  const content = message?.content ?? '';
  const reasoning = message?.reasoning_content ?? '';
  // Prefer content as the text; fall back to reasoning_content. When reasoning
  // is used as the text, don't also set it as `thinking` (would be circular).
  let text: string;
  let thinking: string | undefined;
  if (content.trim()) {
    text = content;
    thinking = reasoning || undefined;
  } else if (reasoning.trim()) {
    text = reasoning;
    thinking = undefined;
  } else {
    throw new LLMError('Provider returned an empty response.', status);
  }
  if (!text) throw new LLMError('Provider returned an empty response.', status);

  return {
    text: text.replace(/^["']|["']$/g, ''),
    thinking: thinking,
    usage: body.usage
      ? { promptTokens: body.usage.prompt_tokens ?? 0, completionTokens: body.usage.completion_tokens ?? 0 }
      : undefined,
  };
}

// ── Claude handler ──────────────────────────────────────────
// Endpoint: POST {baseUrl}/messages
// Auth: x-api-key: <apiKey>, anthropic-version: 2023-06-01
// Body: { model, max_tokens, system, messages }
// Response: { content: [{ type: 'text', text }], usage: { input_tokens, output_tokens } }

export async function claudeChat(
  baseUrl: string,
  apiKey: string,
  req: LLMRequest,
): Promise<LLMResult> {
  // Claude wants the user/assistant messages only (system is separate)
  const messages: LLMMessage[] = req.messages.filter((m) => m.role !== 'system');

  const response = await fetch(`${baseUrl.replace(/\/$/, '')}/messages`, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: req.model,
      max_tokens: req.maxTokens ?? 200,
      ...(req.systemPrompt ? { system: req.systemPrompt } : {}),
      messages,
    }),
  });

  const { ok, status, data, raw } = await safeJson(response);
  if (!ok) throw mapHTTPError(status, raw);

  const body = data as {
    content?: Array<{ type: string; text?: string; thinking?: string }>;
    usage?: { input_tokens?: number; output_tokens?: number };
  };

  const blocks = body.content ?? [];
  const thinking = blocks.filter((b) => b.type === 'thinking').map((b) => b.thinking ?? '').join('');
  const textBlock = blocks.find((b) => b.type === 'text');
  const text = (textBlock?.text ?? '').replace(/^["']|["']$/g, '');
  if (!text) throw new LLMError('Claude returned an empty response.', status);

  return {
    text,
    thinking: thinking || undefined,
    usage: body.usage
      ? { promptTokens: body.usage.input_tokens ?? 0, completionTokens: body.usage.output_tokens ?? 0 }
      : undefined,
  };
}

// ── Gemini handler ──────────────────────────────────────────
// Endpoint: POST {baseUrl}/models/{model}:generateContent?key={apiKey}
// Auth: query param ?key=<apiKey>
// Body: { contents, systemInstruction, generationConfig }
// Response: { candidates: [{ content: { parts: [{ text }] }] }

export async function geminiChat(
  baseUrl: string,
  apiKey: string,
  req: LLMRequest,
): Promise<LLMResult> {
  // Convert messages: assistant → model
  const contents = req.messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

  const response = await fetch(
    `${baseUrl.replace(/\/$/, '')}/models/${req.model}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        ...(req.systemPrompt
          ? { systemInstruction: { parts: [{ text: req.systemPrompt }] } }
          : {}),
        ...(req.temperature !== undefined || req.maxTokens !== undefined
          ? {
              generationConfig: {
                ...(req.temperature !== undefined ? { temperature: req.temperature } : {}),
                ...(req.maxTokens !== undefined ? { maxOutputTokens: req.maxTokens } : {}),
              },
            }
          : {}),
      }),
    },
  );

  const { ok, status, data, raw } = await safeJson(response);
  if (!ok) throw mapHTTPError(status, raw);

  const body = data as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string; thought?: boolean }> };
    }>;
    usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number };
  };

  const parts = body.candidates?.[0]?.content?.parts ?? [];
  const thinking = parts.filter((p) => p.thought).map((p) => p.text ?? '').join('');
  const answerPart = parts.find((p) => !p.thought && p.text);
  const text = (answerPart?.text ?? '').replace(/^["']|["']$/g, '');
  if (!text) throw new LLMError('Gemini returned an empty response.', status);

  return {
    text,
    thinking: thinking || undefined,
    usage: body.usageMetadata
      ? {
          promptTokens: body.usageMetadata.promptTokenCount ?? 0,
          completionTokens: body.usageMetadata.candidatesTokenCount ?? 0,
        }
      : undefined,
  };
}

// ── Convenience: dispatch by provider id ────────────────────

export type NativeProviderId =
  | 'openai'
  | 'deepseek'
  | 'openrouter'
  | 'zai'
  | 'minimax'
  | 'gemini'
  | 'claude'
  | 'ollama';

export interface NativeLLMConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
}

export async function nativeChat(
  providerId: NativeProviderId,
  config: NativeLLMConfig,
  req: LLMRequest,
): Promise<LLMResult> {
  switch (providerId) {
    case 'claude':
      return claudeChat(config.baseUrl, config.apiKey, req);
    case 'gemini':
      return geminiChat(config.baseUrl, config.apiKey, req);
    case 'openai':
    case 'deepseek':
    case 'openrouter':
    case 'zai':
    case 'minimax':
    case 'ollama':
    default:
      return openAICompatibleChat(config.baseUrl, config.apiKey, req);
  }
}

/** Only run native-direct calls on a native platform. */
export const canRunNativeLLM = (): boolean => isNative();
