import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, RefreshCw, Sparkles } from 'lucide-react';

interface AthenaCommentaryProps {
  entryId: string;
  companionId?: string;
}

interface CommentaryResult {
  content: string | null;
  cached: boolean;
  provider?: string | null;
  source?: string | null;
}

export function AthenaCommentary({ entryId, companionId = 'athena' }: AthenaCommentaryProps) {
  const [result, setResult] = useState<CommentaryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch cached content on mount
  useEffect(() => {
    if (!entryId) return;
    const controller = new AbortController();

    // eslint-disable-next-line react-hooks/set-state-in-effect -- same pattern as CompanionThought.tsx
    setLoading(true);
    fetch(`/api/athena/commentary?entryId=${encodeURIComponent(entryId)}&companionId=${encodeURIComponent(companionId)}`, { signal: controller.signal })
      .then(r => r.json())
      .then((data: CommentaryResult) => {
        if (data.cached && data.content) {
          setResult(data);
        } else {
          setResult(null);
        }
      })
      .catch((err: Error) => {
        if (err.name !== 'AbortError') {
          // Network errors are expected in test envs (no server) — silently degrade
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => { controller.abort(); };
  }, [entryId, companionId]);

  const fetchCommentary = useCallback(async (force = false) => {
    setLoading(true);
    setError('');
    try {
      const resp = await fetch('/api/athena/commentary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entryId, companionId, forceRecompute: force }),
      });
      if (!resp.ok) throw new Error('Failed to generate commentary');
      const data: CommentaryResult = await resp.json();
      setResult({ content: data.content, cached: true, provider: data.provider, source: data.source });
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Failed to generate commentary.');
    } finally {
      setLoading(false);
    }
  }, [entryId, companionId]);

  if (loading && !result) {
    return (
      <div className="flex gap-3 items-center p-3 rounded-lg border border-neutral-800 bg-neutral-900/30 text-neutral-400 mt-3 select-none animate-pulse">
        <span className="text-xl">🏛️</span>
        <div className="flex flex-col gap-1.5 flex-1">
          <span className="text-[10px] font-bold text-amber-400/80 uppercase tracking-wider">Athena is consulting her archives...</span>
          <div className="flex gap-1 items-center">
            <span className="h-1.5 w-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 bg-amber-400 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex gap-3 items-center p-3 rounded-lg border border-neutral-800 bg-neutral-900/30 text-neutral-400 mt-3 select-none">
        <span className="text-xl">🏛️</span>
        <div className="flex-1 text-xs flex items-center justify-between">
          <span className="text-neutral-500">{error}</span>
          <button onClick={() => fetchCommentary()} className="text-amber-400 hover:text-amber-300 transition-colors p-1 cursor-pointer" title="Retry">
            <RefreshCw className="size-3.5" />
          </button>
        </div>
      </div>
    );
  }

  if (!result?.content) {
    return (
      <button
        onClick={() => fetchCommentary()}
        disabled={loading}
        className="flex items-center gap-2 px-3 py-2 mt-3 text-xs text-amber-300/70 border border-amber-500/20 bg-amber-950/10 rounded-lg hover:bg-amber-950/20 hover:border-amber-500/30 transition-all cursor-pointer select-none disabled:opacity-50"
      >
        <Sparkles className="size-3.5" />
        <span>What does Athena think?</span>
      </button>
    );
  }

  return (
    <div className="flex gap-3 items-start p-3 rounded-lg bg-gradient-to-br from-amber-950/30 via-neutral-950 to-neutral-950 border border-amber-900/40 text-neutral-200 mt-3 relative overflow-hidden animate-in fade-in slide-in-from-top-1 duration-300">
      <div className="flex items-center justify-center size-8 rounded-full bg-amber-950 border border-amber-800 shrink-0 text-lg shadow-sm" title="Athena">
        🏛️
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[10px] font-bold tracking-wider text-amber-400 uppercase">Athena</span>
          <div className="flex items-center gap-2">
            {result.provider && (
              <span className="text-[9px] text-neutral-600">{result.provider}</span>
            )}
            <button
              onClick={() => fetchCommentary(true)}
              className="text-amber-400/60 hover:text-amber-400 transition-colors p-0.5 cursor-pointer"
              title="Recompute commentary"
            >
              <RefreshCw className="size-3" />
            </button>
            <MessageSquare className="size-3 text-amber-500/60" />
          </div>
        </div>
        <p className="text-xs leading-relaxed italic text-neutral-300 select-all">
          &ldquo;{result.content}&rdquo;
        </p>
      </div>
    </div>
  );
}
