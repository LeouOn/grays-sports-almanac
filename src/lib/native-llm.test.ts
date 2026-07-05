import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the platform module to control isNative()
const mocks = vi.hoisted(() => ({
  isNative: vi.fn(() => false),
}));

vi.mock('@/lib/platform', () => ({
  isNative: () => mocks.isNative(),
}));

import {
  openAICompatibleChat,
  claudeChat,
  geminiChat,
  nativeChat,
  LLMError,
  type LLMRequest,
} from './native-llm';

const baseRequest: LLMRequest = {
  model: 'test-model',
  messages: [{ role: 'user', content: 'Hello' }],
  temperature: 0.7,
  systemPrompt: 'You are a helpful assistant.',
};

describe('openAICompatibleChat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sends POST to {baseUrl}/chat/completions with Bearer auth', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({
        choices: [{ message: { content: 'Hi there!' } }],
        usage: { prompt_tokens: 5, completion_tokens: 3 },
      }), { status: 200, headers: { 'Content-Type': 'application/json' } }),
    );

    const result = await openAICompatibleChat('https://api.openai.com/v1', 'sk-test', baseRequest);

    expect(result.text).toBe('Hi there!');
    expect(result.usage?.promptTokens).toBe(5);
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': 'Bearer sk-test',
          'Content-Type': 'application/json',
        }),
      }),
    );
  });

  it('prepends system prompt as a role:system message', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ choices: [{ message: { content: 'ok' } }] }), { status: 200 }),
    );

    await openAICompatibleChat('https://api.test/v1', 'k', baseRequest);

    const body = JSON.parse(fetchSpy.mock.calls[0][1].body);
    expect(body.messages[0]).toEqual({ role: 'system', content: 'You are a helpful assistant.' });
    expect(body.messages[1]).toEqual({ role: 'user', content: 'Hello' });
  });

  it('omits temperature when not provided', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ choices: [{ message: { content: 'ok' } }] }), { status: 200 }),
    );

    await openAICompatibleChat('https://api.test/v1', 'k', { ...baseRequest, temperature: undefined });

    const body = JSON.parse(fetchSpy.mock.calls[0][1].body);
    expect(body).not.toHaveProperty('temperature');
  });

  it('uses reasoning_content when content is empty', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({
        choices: [{ message: { content: '', reasoning_content: 'thinking hard' } }],
      }), { status: 200 }),
    );

    const result = await openAICompatibleChat('https://api.test/v1', 'k', baseRequest);
    expect(result.text).toBe('thinking hard');
    expect(result.thinking).toBeUndefined();
  });

  it('throws LLMError on 401', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response('Unauthorized', { status: 401 }),
    );

    await expect(
      openAICompatibleChat('https://api.test/v1', 'bad-key', baseRequest),
    ).rejects.toThrow(LLMError);
  });

  it('maps 401 to auth error message', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response('Unauthorized', { status: 401 }),
    );

    try {
      await openAICompatibleChat('https://api.test/v1', 'bad-key', baseRequest);
    } catch (e) {
      expect((e as LLMError).message).toMatch(/Authentication failed/);
    }
  });

  it('maps 429 to rate limit error', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response('Too Many Requests', { status: 429 }),
    );

    try {
      await openAICompatibleChat('https://api.test/v1', 'k', baseRequest);
    } catch (e) {
      expect((e as LLMError).message).toMatch(/Rate limit/);
    }
  });

  it('throws on empty response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ choices: [{ message: { content: '' } }] }), { status: 200 }),
    );

    await expect(
      openAICompatibleChat('https://api.test/v1', 'k', baseRequest),
    ).rejects.toThrow(/empty/);
  });

  it('strips wrapping quotes from response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({
        choices: [{ message: { content: '"Hello!"' } }],
      }), { status: 200 }),
    );

    const result = await openAICompatibleChat('https://api.test/v1', 'k', baseRequest);
    expect(result.text).toBe('Hello!');
  });

  it('strips trailing slash from baseUrl', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ choices: [{ message: { content: 'ok' } }] }), { status: 200 }),
    );

    await openAICompatibleChat('https://api.test/v1/', 'k', baseRequest);
    expect(fetchSpy.mock.calls[0][0]).toBe('https://api.test/v1/chat/completions');
  });
});

describe('claudeChat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sends POST to {baseUrl}/messages with x-api-key', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({
        content: [{ type: 'text', text: 'Hello from Claude' }],
        usage: { input_tokens: 10, output_tokens: 5 },
      }), { status: 200, headers: { 'Content-Type': 'application/json' } }),
    );

    const result = await claudeChat('https://api.anthropic.com/v1', 'sk-ant-test', baseRequest);

    expect(result.text).toBe('Hello from Claude');
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://api.anthropic.com/v1/messages',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'x-api-key': 'sk-ant-test',
          'anthropic-version': '2023-06-01',
        }),
      }),
    );
  });

  it('passes system prompt as separate top-level field', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ content: [{ type: 'text', text: 'ok' }] }), { status: 200 }),
    );

    await claudeChat('https://api.test/v1', 'k', baseRequest);

    const body = JSON.parse(fetchSpy.mock.calls[0][1].body);
    expect(body.system).toBe('You are a helpful assistant.');
    expect(body.messages).toEqual([{ role: 'user', content: 'Hello' }]);
  });

  it('uses default max_tokens of 200', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ content: [{ type: 'text', text: 'ok' }] }), { status: 200 }),
    );

    await claudeChat('https://api.test/v1', 'k', { ...baseRequest, maxTokens: undefined });
    const body = JSON.parse(fetchSpy.mock.calls[0][1].body);
    expect(body.max_tokens).toBe(200);
  });

  it('captures thinking blocks', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({
        content: [
          { type: 'thinking', thinking: 'reasoning...' },
          { type: 'text', text: 'final answer' },
        ],
      }), { status: 200 }),
    );

    const result = await claudeChat('https://api.test/v1', 'k', baseRequest);
    expect(result.text).toBe('final answer');
    expect(result.thinking).toBe('reasoning...');
  });

  it('throws on 401', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response('Unauthorized', { status: 401 }),
    );

    await expect(
      claudeChat('https://api.test/v1', 'bad', baseRequest),
    ).rejects.toThrow(/Authentication/);
  });
});

describe('geminiChat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sends POST to {baseUrl}/models/{model}:generateContent?key={apiKey}', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({
        candidates: [{ content: { parts: [{ text: 'Hello from Gemini' }] } }],
        usageMetadata: { promptTokenCount: 8, candidatesTokenCount: 4 },
      }), { status: 200 }),
    );

    const result = await geminiChat('https://generativelanguage.googleapis.com/v1beta', 'AIza-test', {
      ...baseRequest,
      model: 'gemini-2.0-flash',
    });

    expect(result.text).toBe('Hello from Gemini');
    expect(fetchSpy.mock.calls[0][0]).toBe(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIza-test',
    );
  });

  it('maps assistant role to model role', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] }), { status: 200 }),
    );

    await geminiChat('https://api.test/v1beta', 'k', {
      model: 'gemini',
      messages: [
        { role: 'user', content: 'Hi' },
        { role: 'assistant', content: 'Hello' },
        { role: 'user', content: 'How are you?' },
      ],
    });

    const body = JSON.parse(fetchSpy.mock.calls[0][1].body);
    expect(body.contents[0].role).toBe('user');
    expect(body.contents[1].role).toBe('model');
    expect(body.contents[2].role).toBe('user');
  });

  it('passes system prompt as systemInstruction', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] }), { status: 200 }),
    );

    await geminiChat('https://api.test/v1beta', 'k', baseRequest);

    const body = JSON.parse(fetchSpy.mock.calls[0][1].body);
    expect(body.systemInstruction).toEqual({ parts: [{ text: 'You are a helpful assistant.' }] });
  });

  it('filters thought parts', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({
        candidates: [{
          content: {
            parts: [
              { thought: true, text: 'reasoning...' },
              { text: 'final answer' },
            ],
          },
        }],
      }), { status: 200 }),
    );

    const result = await geminiChat('https://api.test/v1beta', 'k', baseRequest);
    expect(result.text).toBe('final answer');
    expect(result.thinking).toBe('reasoning...');
  });

  it('throws on 401', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response('Unauthorized', { status: 401 }),
    );

    await expect(
      geminiChat('https://api.test/v1beta', 'bad', baseRequest),
    ).rejects.toThrow(/Authentication/);
  });
});

describe('nativeChat dispatcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('routes openai to openAICompatibleChat', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ choices: [{ message: { content: 'ok' } }] }), { status: 200 }),
    );

    await nativeChat('openai', { baseUrl: 'https://api.openai.com/v1', apiKey: 'sk', model: 'gpt-4o' }, baseRequest);
    expect(fetchSpy.mock.calls[0][0]).toBe('https://api.openai.com/v1/chat/completions');
  });

  it('routes deepseek to openAICompatibleChat', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ choices: [{ message: { content: 'ok' } }] }), { status: 200 }),
    );

    await nativeChat('deepseek', { baseUrl: 'https://api.deepseek.com', apiKey: 'k', model: 'deepseek' }, baseRequest);
    expect(fetchSpy.mock.calls[0][0]).toBe('https://api.deepseek.com/chat/completions');
  });

  it('routes claude to claudeChat', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ content: [{ type: 'text', text: 'ok' }] }), { status: 200 }),
    );

    await nativeChat('claude', { baseUrl: 'https://api.anthropic.com/v1', apiKey: 'k', model: 'claude' }, baseRequest);
    expect(fetchSpy.mock.calls[0][0]).toBe('https://api.anthropic.com/v1/messages');
  });

  it('routes gemini to geminiChat', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] }), { status: 200 }),
    );

    await nativeChat('gemini', { baseUrl: 'https://generativelanguage.googleapis.com/v1beta', apiKey: 'k', model: 'gemini' }, baseRequest);
    expect(fetchSpy.mock.calls[0][0]).toContain(':generateContent?key=k');
  });

  it('routes ollama to openAICompatibleChat', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ choices: [{ message: { content: 'ok' } }] }), { status: 200 }),
    );

    await nativeChat('ollama', { baseUrl: 'http://localhost:11434/v1', apiKey: '', model: 'llama3.3' }, baseRequest);
    expect(fetchSpy.mock.calls[0][0]).toBe('http://localhost:11434/v1/chat/completions');
  });
});
