import { Link } from 'react-router';
import { BookmarkX, ArrowUpRight } from 'lucide-react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { showSuccess, showError } from '@/lib/toast';
import { PageSkeleton } from '@/components/PageSkeleton';
import { SyncStatusIndicator } from '@/components/SyncStatusIndicator';

const moduleRoutes: Record<string, string> = {
  Sports: '/sports',
  Finance: '/finance',
  'Era Guide': '/era-guide',
  Disasters: '/disasters',
  'Tech Transfer': '/tech-transfer',
  Medical: '/medical',
  Safety: '/safety',
  Blueprints: '/blueprints',
  Timeline: '/timeline',
  Butterfly: '/butterfly',
};

export function Bookmarks() {
  const { bookmarks, deleteBookmark, loading } = useBookmarks();

  const handleDelete = async (id: string) => {
    const ok = await deleteBookmark(id);
    if (ok) {
      showSuccess('Bookmark removed');
    } else {
      showError('Failed to remove bookmark');
    }
  };

  if (loading) return <PageSkeleton />;

  if (bookmarks.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">📑 Bookmarks</h1>
          <p className="text-neutral-400">Your saved entries across all modules.</p>
          <SyncStatusIndicator />
        </div>
        <div className="text-center py-20">
          <p className="text-lg font-medium text-neutral-500">No bookmarks yet.</p>
          <p className="text-sm text-neutral-600 mt-1">Start exploring and bookmark entries you want to revisit!</p>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
          >
            Explore Modules
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">📑 Bookmarks</h1>
        <p className="text-neutral-400">{bookmarks.length} saved {bookmarks.length === 1 ? 'entry' : 'entries'} across all modules.</p>
        <SyncStatusIndicator />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookmarks.map(b => (
          <div
            key={b.id}
            className="flex items-start gap-3 p-4 rounded-lg border border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-semibold tracking-wider text-indigo-400 uppercase">{b.module}</span>
              </div>
              <div className="text-sm font-medium text-neutral-200 truncate">{b.entry_id}</div>
              {b.note && (
                <div className="text-xs text-neutral-400 mt-1 line-clamp-2">{b.note}</div>
              )}
              <div className="text-[10px] text-neutral-600 mt-1.5">
                {new Date(b.created_at).toLocaleDateString()}
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Link
                to={moduleRoutes[b.module] ?? '/'}
                className="inline-flex items-center justify-center size-7 rounded-md border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 text-neutral-400 hover:text-white transition-all cursor-pointer select-none"
                title="Go to module"
                aria-label={`Open ${b.module} module`}
              >
                <ArrowUpRight className="size-3.5" />
              </Link>
              <button
                onClick={() => handleDelete(b.id)}
                className="inline-flex items-center justify-center size-7 rounded-md border border-neutral-800 bg-neutral-900/50 hover:bg-red-950/30 hover:border-red-800/50 text-neutral-400 hover:text-red-400 transition-all cursor-pointer select-none"
                title="Remove bookmark"
                aria-label={`Remove bookmark ${b.entry_id}`}
              >
                <BookmarkX className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
