import { useState } from 'react';
import { Link2 } from 'lucide-react';

interface PalaceLinkProps {
  tags: string[];
  contextItem: string;
  excludeId?: string;
}

export function PalaceLink({ tags, contextItem, excludeId }: PalaceLinkProps) {
  const [expanded, setExpanded] = useState(false);
  const [connection, setConnection] = useState('');
  const [targetEntryId, setTargetEntryId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExpand = async () => {
    if (expanded) {
      setExpanded(false);
      return;
    }

    setExpanded(true);
    setLoading(true);

    try {
      // First check if there's a cached palace link via entryId
      const entryId = excludeId;
      if (entryId) {
        const cachedResp = await fetch(`/api/athena/palace-link?entryId=${encodeURIComponent(entryId)}`);
        if (cachedResp.ok) {
          const cached = await cachedResp.json();
          if (cached.cached && cached.connection) {
            setConnection(cached.connection);
            setTargetEntryId(cached.targetEntryId || '');
            setLoading(false);
            return;
          }
        }
      }

      // If not cached, generate one
      const resp = await fetch('/api/athena/palace-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entryId: excludeId }),
      });

      if (resp.ok) {
        const data = await resp.json();
        setConnection(data.connection || '');
        setTargetEntryId(data.targetEntryId || '');
      }
    } catch (err) {
      console.error('PalaceLink fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExpand}
      className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] text-purple-300/70 border border-purple-500/20 bg-purple-950/10 rounded-lg hover:bg-purple-950/20 hover:border-purple-500/30 hover:text-purple-200 transition-all cursor-pointer select-none"
    >
      <Link2 className="size-3" />
      <span>Memory Link</span>
      {expanded && loading && (
        <span className="ml-1 animate-pulse">...</span>
      )}
      {expanded && !loading && connection && (
        <span className="ml-1 text-purple-400/80 italic truncate max-w-[200px]" title={connection}>
          — "{connection}"
        </span>
      )}
    </button>
  );
}
