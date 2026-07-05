# LLM Provider Architecture — Implementation Plan

## Source
Based on the LLM Provider Handlers spec (Flutter/Dart app), adapted for our
React/TypeScript + Vite + Express stack.

## Goal
Upgrade from 5 providers (with wrong URLs/handlers for 2) to the full 8-provider
architecture from the spec, with correct base URLs, models, handler classes,
settings persistence, and error handling.

---

## Phase 1: Server-side provider update (server/providers.ts + server/index.ts)

### 1.1 Expand ProviderId type
```typescript
type ProviderId = 'openai' | 'deepseek' | 'openrouter' | 'zai' | 'minimax' | 'gemini' | 'claude' | 'ollama';
```

### 1.2 Update PROVIDER_DEFAULTS (8 providers)
| Provider | Default Model | Base URL | Handler |
|----------|--------------|----------|---------|
| openai | gpt-4o | https://api.openai.com/v1 | createOpenAI |
| deepseek | deepseek-v4-flash | https://api.deepseek.com | createOpenAI |
| openrouter | anthropic/claude-sonnet-latest | https://openrouter.ai/api/v1 | createOpenAI |
| zai | glm-5.1 | https://open.bigmodel.cn/api/paas/v4 | createOpenAI |
| minimax | minimax-m3 | https://api.minimax.chat/v1 | createOpenAI |
| gemini | gemini-2.0-flash | (SDK default) | google() |
| claude | claude-sonnet-4-20250514 | https://api.anthropic.com/v1 | createAnthropic |
| ollama | llama3.3 | http://localhost:11434/v1 | createOpenAI |

### 1.3 Update KEY_ENV_MAP
```typescript
openai:     'OPENAI_API_KEY',
deepseek:   'DEEPSEEK_API_KEY',
openrouter: 'OPENROUTER_API_KEY',
zai:        'ZAI_API_KEY',         // was ZHIPU_API_KEY
minimax:    'MINIMAX_API_KEY',
gemini:     'GOOGLE_GENERATIVE_AI_API_KEY',
claude:     'ANTHROPIC_API_KEY',
ollama:     'OLLAMA_API_KEY',      // optional for local
```

### 1.4 Update getModel() for all 8 providers
- gemini → `google(model)`
- claude → `createAnthropic({ baseURL, apiKey })(model)`
- All others → `createOpenAI({ baseURL, apiKey }).chat(model)`
- ollama → same as OpenAI-compatible but apiKey can be empty string

### 1.5 Update fallback chain
```
[provider?, 'minimax', 'zai', 'deepseek', 'gemini', 'openai', 'claude', 'openrouter']
```

### 1.6 Consolidate providers.ts + index.ts
Remove duplicate provider config from index.ts. Export getModel + PROVIDER_DEFAULTS
from providers.ts and import in index.ts.

---

## Phase 2: Error handling (server/providers.ts)

### 2.1 Add mapLLMError function
```typescript
export class LLMError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
  }
}

export function mapLLMError(err: unknown): LLMError {
  if (err instanceof LLMError) return err;
  const msg = err instanceof Error ? err.message : String(err);
  if (/timeout|timed?\s*out/i.test(msg)) {
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
```

---

## Phase 3: Settings persistence (client-side)

### 3.1 Create src/hooks/useProviderSettings.ts
```typescript
// localStorage key-value pairs matching the spec:
// provider_names: comma-separated list
// {name}_api_key: API key
// {name}_model: model name
// {name}_base_url: base URL (optional override)
```

### 3.2 ProviderConfig type
```typescript
interface ProviderConfig {
  providerName: string;
  baseUrl: string;
  apiKey: string;
  model: string;
}
```

### 3.3 CRUD operations
- `getProviderConfigs()`: read all from localStorage
- `saveProviderConfig(config)`: write 3 keys + name to list
- `deleteProvider(name)`: remove 3 keys + name from list
- `getActiveProvider()`: returns the first configured provider

---

## Phase 4: Update Quiz page (src/pages/Quiz.tsx)

### 4.1 Update PROVIDERS array (5 → 8)
```typescript
const PROVIDERS = [
  { id: 'gemini',     label: 'Gemini',    icon: '🔵', defaultModel: 'gemini-2.0-flash' },
  { id: 'claude',     label: 'Claude',    icon: '🟠', defaultModel: 'claude-sonnet-4-20250514' },
  { id: 'deepseek',   label: 'DeepSeek',  icon: '🐋', defaultModel: 'deepseek-v4-flash' },
  { id: 'zai',        label: 'GLM',       icon: '🧠', defaultModel: 'glm-5.1' },
  { id: 'minimax',    label: 'MiniMax',   icon: '⚡', defaultModel: 'minimax-m3' },
  { id: 'openai',     label: 'OpenAI',    icon: '🟢', defaultModel: 'gpt-4o' },
  { id: 'openrouter', label: 'OpenRouter', icon: '🔀', defaultModel: 'anthropic/claude-sonnet-latest' },
  { id: 'ollama',     label: 'Ollama',    icon: '🦙', defaultModel: 'llama3.3' },
];
```

### 4.2 Update fallback chain on client
Default to first provider with an API key configured.

### 4.3 Mobile-optimized provider selector
- Horizontal scroll on mobile (instead of wrapping)
- Show only provider icon on mobile, icon + label on desktop

---

## Phase 5: Tests

### 5.1 Server tests (server/providers.test.ts)
- Test getModel() for all 8 providers
- Test fallback chain order
- Test error mapping (timeout, 401, 403, 429, generic)
- Test missing API key handling

### 5.2 Client tests
- Test useProviderSettings hook
- Test provider config CRUD
- Test Quiz page with 8 providers

---

## Success Criteria
- All 8 providers configured with correct URLs and models
- minimax uses OpenAI-compatible handler (not Anthropic)
- zai uses bigmodel.cn (not z.ai)
- Error messages match the spec (timeout, auth, rate limit, generic)
- Settings persist in localStorage with the spec's key pattern
- All 460+ tests pass
- tsc + lint clean
