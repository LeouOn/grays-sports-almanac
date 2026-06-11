import { useState, useEffect } from 'react';
import { useCompanion } from '../context/CompanionContext';
import { MessageSquare, RefreshCw } from 'lucide-react';

interface CompanionThoughtProps {
  contextItem: string;
}

export function CompanionThought({ contextItem }: CompanionThoughtProps) {
  const { activeCompanion, companionProvider } = useCompanion();
  const [comment, setComment] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const getComment = async () => {
      if (!contextItem) return;

      // Defers setState calls to avoid synchronous updates inside the effect block
      await Promise.resolve();

      setLoading(true);
      setError('');
      try {
        const response = await fetch('/api/companion/comment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            companionName: activeCompanion.name,
            companionPrompt: activeCompanion.prompt,
            contextItem,
            provider: companionProvider,
          }),
          signal,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch response');
        }

        const data = await response.json() as { comment?: string };
        setComment(data.comment || '');
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Error fetching companion comment:', err);
          setError('Failed to get companion comment.');
        } else if (!(err instanceof Error)) {
          setError('Failed to get companion comment.');
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    getComment();

    return () => {
      controller.abort();
    };
  }, [contextItem, activeCompanion.name, activeCompanion.prompt, refreshKey, companionProvider]);

  if (loading) {
    return (
      <div className="flex gap-3 items-center p-3 rounded-lg border border-neutral-800 bg-neutral-900/30 text-neutral-400 mt-2 select-none animate-pulse">
        <span className="text-xl animate-bounce">{activeCompanion.avatar}</span>
        <div className="flex flex-col gap-1.5 flex-1">
          <span className="text-[10px] font-bold text-indigo-400/80 uppercase tracking-wider">{activeCompanion.name} is thinking...</span>
          <div className="flex gap-1 items-center">
            <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex gap-3 items-center p-3 rounded-lg border border-neutral-800 bg-neutral-900/30 text-neutral-400 mt-2 select-none">
        <span className="text-xl">{activeCompanion.avatar}</span>
        <div className="flex-1 text-xs flex items-center justify-between">
          <span className="text-neutral-500">{error}</span>
          <button
            onClick={() => setRefreshKey(k => k + 1)}
            className="text-indigo-400 hover:text-indigo-300 transition-colors p-1 cursor-pointer"
            title="Retry comment generation"
          >
            <RefreshCw className="size-3.5" />
          </button>
        </div>
      </div>
    );
  }

  if (!comment) return null;

  return (
    <div className="flex gap-3 items-start p-3 rounded-lg bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-neutral-950 border border-indigo-950 text-neutral-200 mt-3 relative overflow-hidden animate-in fade-in slide-in-from-top-1 duration-300">
      <div className="flex items-center justify-center size-8 rounded-full bg-indigo-950 border border-indigo-800 shrink-0 text-lg shadow-sm" title={activeCompanion.name}>
        {activeCompanion.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[10px] font-bold tracking-wider text-indigo-400 uppercase">
            {activeCompanion.name}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRefreshKey(k => k + 1)}
              className="text-indigo-400/60 hover:text-indigo-400 transition-colors p-0.5 cursor-pointer"
              title="Regenerate commentary"
            >
              <RefreshCw className="size-3" />
            </button>
            <MessageSquare className="size-3 text-indigo-500/60" />
          </div>
        </div>
        <p className="text-xs leading-relaxed italic text-neutral-300 select-all">
          "{comment}"
        </p>
      </div>
    </div>
  );
}
