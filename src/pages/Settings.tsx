import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Trash2, CheckCircle2, XCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { useProviderSettings, type ProviderConfig } from '@/hooks/useProviderSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showError, showSuccess } from '@/lib/toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProviderMeta {
  id: string;
  label: string;
  icon: string;
  defaultModel: string;
  defaultBaseUrl: string;
  docs: string;
}

const PROVIDER_META: readonly ProviderMeta[] = [
  { id: 'gemini',     label: 'Gemini',     icon: '🔵', defaultModel: 'gemini-2.0-flash',          defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta', docs: 'https://aistudio.google.com/apikey' },
  { id: 'claude',     label: 'Claude',     icon: '🟠', defaultModel: 'claude-sonnet-4-20250514',  defaultBaseUrl: 'https://api.anthropic.com/v1',                    docs: 'https://console.anthropic.com/settings/keys' },
  { id: 'deepseek',   label: 'DeepSeek',   icon: '🐋', defaultModel: 'deepseek-v4-flash',         defaultBaseUrl: 'https://api.deepseek.com',                       docs: 'https://platform.deepseek.com/api_keys' },
  { id: 'zai',        label: 'GLM (Zhipu)', icon: '🧠', defaultModel: 'glm-5.1',                  defaultBaseUrl: 'https://open.bigmodel.cn/api/paas/v4',           docs: 'https://bigmodel.cn/user-center/prove-key' },
  { id: 'minimax',    label: 'MiniMax',    icon: '⚡', defaultModel: 'minimax-m3',                 defaultBaseUrl: 'https://api.minimax.chat/v1',                   docs: 'https://api.minimax.chat/user-center/basic-information/interface-key' },
  { id: 'openai',     label: 'OpenAI',     icon: '🟢', defaultModel: 'gpt-4o',                     defaultBaseUrl: 'https://api.openai.com/v1',                     docs: 'https://platform.openai.com/api-keys' },
  { id: 'openrouter', label: 'OpenRouter', icon: '🔀', defaultModel: 'anthropic/claude-sonnet-latest', defaultBaseUrl: 'https://openrouter.ai/api/v1',                docs: 'https://openrouter.ai/settings/keys' },
  { id: 'ollama',     label: 'Ollama',     icon: '🦙', defaultModel: 'llama3.3',                   defaultBaseUrl: 'http://localhost:11434/v1',                   docs: 'https://ollama.com/download' },
];

type TestState = 'idle' | 'testing' | 'success' | 'error';

interface ProviderTestState {
  status: TestState;
  message?: string;
}

export function Settings() {
  const { providers, saveProvider, deleteProvider, loading } = useProviderSettings();
  const [editing, setEditing] = useState<Record<string, { apiKey: string; model: string; baseUrl: string; showKey: boolean }>>({});
  const [testStates, setTestStates] = useState<Record<string, ProviderTestState>>({});

  const getProvider = (id: string): ProviderConfig | undefined =>
    providers.find((p) => p.providerName === id);

  const startEditing = (id: string): void => {
    const meta = PROVIDER_META.find((m) => m.id === id)!;
    const existing = getProvider(id);
    setEditing((prev) => ({
      ...prev,
      [id]: {
        apiKey: existing?.apiKey ?? '',
        model: existing?.model ?? meta.defaultModel,
        baseUrl: existing?.baseUrl ?? meta.defaultBaseUrl,
        showKey: false,
      },
    }));
  };

  const cancelEditing = (id: string): void => {
    setEditing((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const save = async (id: string): Promise<void> => {
    const edit = editing[id];
    if (!edit) return;
    if (!edit.apiKey.trim() && id !== 'ollama') {
      showError('API key is required (Ollama is the only exception).');
      return;
    }
    await saveProvider({
      providerName: id,
      apiKey: edit.apiKey,
      model: edit.model,
      baseUrl: edit.baseUrl,
    });
    showSuccess(`${PROVIDER_META.find((m) => m.id === id)!.label} saved.`);
    cancelEditing(id);
  };

  const remove = async (id: string): Promise<void> => {
    if (!confirm(`Delete ${PROVIDER_META.find((m) => m.id === id)!.label} config? Your API key will be removed from this device.`)) return;
    await deleteProvider(id);
    showSuccess('Provider config removed.');
  };

  const testConnection = async (id: string): Promise<void> => {
    const meta = PROVIDER_META.find((m) => m.id === id)!;
    const cfg = getProvider(id);
    if (!cfg?.apiKey && id !== 'ollama') {
      showError('Save your API key first.');
      return;
    }
    setTestStates((prev) => ({ ...prev, [id]: { status: 'testing' } }));
    try {
      const baseUrl = cfg?.baseUrl || meta.defaultBaseUrl;
      const apiKey = cfg?.apiKey || '';
      const url = id === 'gemini'
        ? `${baseUrl}/models?key=${encodeURIComponent(apiKey)}`
        : id === 'claude'
          ? `${baseUrl}/messages`
          : `${baseUrl.replace(/\/$/, '')}/models`;
      const headers: Record<string, string> = {};
      if (id === 'claude') {
        headers['x-api-key'] = apiKey;
        headers['anthropic-version'] = '2023-06-01';
        headers['Content-Type'] = 'application/json';
      } else if (id !== 'ollama') {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }
      const init: RequestInit = { method: id === 'claude' ? 'POST' : 'GET', headers };
      if (id === 'claude') {
        init.body = JSON.stringify({
          model: cfg?.model || meta.defaultModel,
          max_tokens: 1,
          messages: [{ role: 'user', content: 'ping' }],
        });
      }
      const res = await fetch(url, init);
      if (res.ok) {
        setTestStates((prev) => ({ ...prev, [id]: { status: 'success', message: 'Connected' } }));
        showSuccess(`${meta.label} connection OK.`);
      } else {
        const text = await res.text().catch(() => '');
        setTestStates((prev) => ({
          ...prev,
          [id]: { status: 'error', message: `HTTP ${res.status}${text ? `: ${text.slice(0, 80)}` : ''}` },
        }));
        showError(`${meta.label} failed: HTTP ${res.status}`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setTestStates((prev) => ({ ...prev, [id]: { status: 'error', message: msg } }));
      showError(`${meta.label} failed: ${msg}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="size-8 animate-spin text-neutral-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white mb-2">
          <ArrowLeft className="size-3.5" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-white">LLM Settings</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Configure your LLM provider API keys. Keys are stored securely on this device
          (encrypted on mobile, localStorage on web) and never sent to our server.
        </p>
      </div>

      <div className="space-y-3">
        {PROVIDER_META.map((meta) => {
          const cfg = getProvider(meta.id);
          const isEditing = !!editing[meta.id];
          const edit = editing[meta.id];
          const testState = testStates[meta.id] ?? { status: 'idle' };
          const hasConfig = !!cfg;

          return (
            <Card key={meta.id} className="bg-neutral-900 border-neutral-800">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <span className="text-xl">{meta.icon}</span>
                    {meta.label}
                    {hasConfig && !isEditing && (
                      <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 rounded px-1.5 py-0.5">
                        Configured
                      </span>
                    )}
                  </CardTitle>
                  <a
                    href={meta.docs}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] uppercase tracking-wider text-indigo-400 hover:text-indigo-300"
                  >
                    Get key →
                  </a>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {!isEditing ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Model</span>
                        <p className="text-neutral-200 font-mono text-xs">
                          {cfg?.model || <span className="text-neutral-600 italic">not set</span>}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Base URL</span>
                        <p className="text-neutral-200 font-mono text-xs truncate">
                          {cfg?.baseUrl || meta.defaultBaseUrl}
                        </p>
                      </div>
                    </div>
                    {cfg?.apiKey && (
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase tracking-wider">API Key</span>
                        <p className="text-neutral-200 font-mono text-xs">
                          {cfg.apiKey.slice(0, 8)}…{cfg.apiKey.slice(-4)}
                        </p>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEditing(meta.id)}
                        className="h-10 px-4 text-xs"
                      >
                        {hasConfig ? 'Edit' : 'Configure'}
                      </Button>
                      {hasConfig && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => void testConnection(meta.id)}
                            disabled={testState.status === 'testing'}
                            className="h-10 px-4 text-xs"
                          >
                            {testState.status === 'testing' ? <Loader2 className="size-3 animate-spin mr-1" /> : null}
                            Test connection
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => void remove(meta.id)}
                            className="h-10 px-3 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30"
                          >
                            <Trash2 className="size-3" />
                          </Button>
                        </>
                      )}
                    </div>
                    {testState.message && testState.status !== 'idle' && testState.status !== 'testing' && (
                      <p className={`text-xs flex items-center gap-1 ${testState.status === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {testState.status === 'success' ? <CheckCircle2 className="size-3" /> : <XCircle className="size-3" />}
                        {testState.message}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <div>
                      <label className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-1">
                        API Key {meta.id === 'ollama' && <span className="text-neutral-600">(optional for local Ollama)</span>}
                      </label>
                      <div className="relative">
                        <Input
                          type={edit?.showKey ? 'text' : 'password'}
                          value={edit?.apiKey ?? ''}
                          onChange={(e) => setEditing((prev) => ({ ...prev, [meta.id]: { ...(prev[meta.id] ?? { apiKey: '', model: meta.defaultModel, baseUrl: meta.defaultBaseUrl, showKey: false }), apiKey: e.target.value } }))}
                          placeholder={meta.id === 'ollama' ? 'leave empty for local' : 'sk-...'}
                          className="h-11 bg-neutral-950 border-neutral-800 text-white font-mono text-xs pr-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          autoComplete="off"
                        />
                        <button
                          type="button"
                          onClick={() => setEditing((prev) => ({ ...prev, [meta.id]: { ...(prev[meta.id]!), showKey: !prev[meta.id]!.showKey } }))}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-neutral-500 hover:text-neutral-200"
                          aria-label={edit?.showKey ? 'Hide API key' : 'Show API key'}
                        >
                          {edit?.showKey ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-1">Model</label>
                        <Input
                          value={edit?.model ?? ''}
                          onChange={(e) => setEditing((prev) => ({ ...prev, [meta.id]: { ...(prev[meta.id]!), model: e.target.value } }))}
                          className="h-11 bg-neutral-950 border-neutral-800 text-white font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-1">Base URL</label>
                        <Input
                          value={edit?.baseUrl ?? ''}
                          onChange={(e) => setEditing((prev) => ({ ...prev, [meta.id]: { ...(prev[meta.id]!), baseUrl: e.target.value } }))}
                          className="h-11 bg-neutral-950 border-neutral-800 text-white font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Button
                        size="sm"
                        onClick={() => void save(meta.id)}
                        className="h-10 px-4 text-xs"
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => cancelEditing(meta.id)}
                        className="h-10 px-4 text-xs"
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
