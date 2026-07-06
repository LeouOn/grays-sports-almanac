import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, MapPin, Calendar, Clock, Wallet, Download } from 'lucide-react';
import { loadPlacesToVisit } from '@/data/loader';
import { type TouristDestination } from '@/data/places-to-visit';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageSkeleton } from '@/components/PageSkeleton';
import { showError } from '@/lib/toast';
import { exportToCSV } from '@/lib/export';
import { RelatedEntries } from '@/components/RelatedEntries';
import { ShareButton } from '@/components/ShareButton';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { useURLState } from '../hooks/useURLState';

const DECADES = ['1970s', '1980s', '1990s', '2000s'] as const;
const PAGE_SIZE = 24;
const CATEGORIES = [
  'Natural Wonder',
  'Historical Site',
  'Cultural Event',
  'Architectural Marvel',
  'Music/Arts Scene',
  'Urban Experience',
] as const;
type CostTier = 'Budget' | 'Moderate' | 'Expensive' | 'Luxury';
type Category = (typeof CATEGORIES)[number];

const COST_COLORS: Record<CostTier, string> = {
  Budget: 'bg-emerald-500/20 text-emerald-300',
  Moderate: 'bg-amber-500/20 text-amber-300',
  Expensive: 'bg-orange-500/20 text-orange-300',
  Luxury: 'bg-purple-500/20 text-purple-300',
};

const CATEGORY_COLORS: Record<Category, string> = {
  'Natural Wonder': 'bg-emerald-500/20 text-emerald-300',
  'Historical Site': 'bg-amber-500/20 text-amber-300',
  'Cultural Event': 'bg-purple-500/20 text-purple-300',
  'Architectural Marvel': 'bg-indigo-500/20 text-indigo-300',
  'Music/Arts Scene': 'bg-pink-500/20 text-pink-300',
  'Urban Experience': 'bg-blue-500/20 text-blue-300',
};

export function PlacesToVisit() {
  const [places, setPlaces] = useState<TouristDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [decade, setDecade] = useURLState('decade', 'all');
  const [category, setCategory] = useURLState('category', 'all');
  const [activeEntry, setActiveEntry] = useState<TouristDestination | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const { addRecent } = useRecentlyViewed();

  useEffect(() => {
    // NOTE: `setLoading(false)` is invoked inside `.then`/`.catch` rather than
    // `.finally` so the synchronous test loader mock in `vitest.setup.ts`
    // (which honors `.then` but not `.finally`) resolves the loading state on
    // the first render — matching the synchronous assertion style used across
    // every other page test.
    loadPlacesToVisit()
      .then(p => {
        setPlaces(p);
        setLoading(false);
      })
      .catch(() => {
        showError('Failed to load destinations');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!activeEntry) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveEntry(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeEntry]);

  // Track opened entries for the Dashboard 'Recently Viewed' shortcut.
  useEffect(() => {
    if (activeEntry) {
      addRecent({ id: activeEntry.id, module: 'Places to Visit', title: activeEntry.name, path: '/places-to-visit' });
    }
  }, [activeEntry, addRecent]);

  const filtered = useMemo(() => {
    return places.filter(p => {
      if (decade !== 'all' && p.decade !== decade) return false;
      if (category !== 'all' && p.category !== category) return false;
      return true;
    });
  }, [places, decade, category]);

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white mb-2"
        >
          <ArrowLeft className="size-3.5" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Places to Visit</h1>
        <p className="text-neutral-400 mt-2">
          Temporal tourism guide: what to see, where to be, and when to be there.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400">Decade:</span>
          <button
            type="button"
            onClick={() => {
              setDecade('all');
              setVisibleCount(PAGE_SIZE);
            }}
            aria-pressed={decade === 'all'}
            className={`px-4 py-2 text-sm rounded-full transition-colors ${
              decade === 'all' ? 'bg-indigo-600 text-white' : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            All
          </button>
          {DECADES.map(d => (
            <button
              key={d}
              type="button"
              onClick={() => {
                setDecade(d);
                setVisibleCount(PAGE_SIZE);
              }}
              aria-pressed={decade === d}
              className={`px-4 py-2 text-sm rounded-full transition-colors ${
                decade === d ? 'bg-indigo-600 text-white' : 'bg-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-4">
          <label htmlFor="category-filter" className="text-xs text-neutral-400">
            Category:
          </label>
          <select
            id="category-filter"
            value={category}
            onChange={e => {
              setCategory(e.target.value as Category | 'all');
              setVisibleCount(PAGE_SIZE);
            }}
            className="h-10 px-3 rounded-md border border-neutral-800 bg-neutral-900 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <span className="text-xs text-neutral-500">
          Showing {filtered.length} of {places.length}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportToCSV(filtered as unknown as Record<string, unknown>[], 'places-to-visit.csv')}
          disabled={filtered.length === 0}
          className="gap-2"
        >
          <Download className="size-4" />
          Export CSV
        </Button>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-16 text-neutral-500">
          No destinations match the current filters.
        </div>
      )}

      {/* Card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.slice(0, visibleCount).map(p => (
          <Card
            key={p.id}
            className="bg-neutral-900/50 border-neutral-800 cursor-pointer hover:border-neutral-700 transition-colors"
            onClick={() => setActiveEntry(p)}
          >
            <CardContent className="pt-1 space-y-3">
              <div>
                <h3 className="font-semibold text-white leading-snug">{p.name}</h3>
                <div className="flex items-center gap-1 text-xs text-neutral-500 mt-0.5">
                  <MapPin className="size-3" /> {p.location}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-[10px] text-neutral-400 flex items-center gap-1">
                  <Calendar className="size-2.5" /> {p.decade}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${CATEGORY_COLORS[p.category]}`}
                >
                  {p.category}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 ${COST_COLORS[p.costTier]}`}
                >
                  <Wallet className="size-2.5" /> {p.costTier}
                </span>
              </div>

              <p className="text-sm text-neutral-400 leading-relaxed">{p.description}</p>

              <div className="flex items-center gap-1 text-xs text-neutral-500">
                <Clock className="size-3" /> Best: {p.bestTimeToVisit}
              </div>

              {p.tags && p.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {p.tags.map(t => (
                    <span
                      key={t}
                      className="px-1.5 py-0.5 rounded bg-neutral-800 text-[10px] text-neutral-500"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
              <RelatedEntries tags={p.tags ?? []} excludeId={p.id} />
            </CardContent>
          </Card>
        ))}
      </div>

      {visibleCount < filtered.length && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="h-11 px-6"
          >
            Load more ({filtered.length - visibleCount} remaining)
          </Button>
        </div>
      )}

      {activeEntry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setActiveEntry(null)}
        >
          <div
            className="bg-neutral-900 border border-neutral-800 rounded-lg max-w-2xl w-full max-h-[85dvh] overflow-y-auto p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="float-right flex items-center gap-3">
              <ShareButton title={activeEntry.name} text={`${activeEntry.name} — ${activeEntry.location}`} />
              <button
                onClick={() => setActiveEntry(null)}
                className="text-neutral-400 hover:text-white cursor-pointer"
                aria-label="Close detail"
              >
                ✕
              </button>
            </div>

            <h2 className="text-xl font-bold text-white leading-snug">{activeEntry.name}</h2>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="flex items-center gap-1 text-neutral-500">
                <MapPin className="size-3" /> {activeEntry.location}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-[10px] text-neutral-400 flex items-center gap-1">
                <Calendar className="size-2.5" /> {activeEntry.decade}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${CATEGORY_COLORS[activeEntry.category]}`}>
                {activeEntry.category}
              </span>
            </div>

            <p className="text-sm text-neutral-300 leading-relaxed">{activeEntry.description}</p>

            <div className="bg-neutral-950 border border-neutral-800 rounded p-3 text-xs flex items-center gap-2">
              <Clock className="size-4 text-indigo-400 shrink-0" />
              <div>
                <div className="text-neutral-500 uppercase tracking-wider text-[10px] font-bold">Best time to visit</div>
                <div className="text-neutral-200 font-medium">{activeEntry.bestTimeToVisit}</div>
              </div>
            </div>

            <div>
              <span className="text-neutral-500 uppercase tracking-wider text-[10px] font-bold">Cost tier:</span>{' '}
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${COST_COLORS[activeEntry.costTier]}`}>
                <Wallet className="size-2.5" /> {activeEntry.costTier}
              </span>
            </div>

            {activeEntry.tags && activeEntry.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {activeEntry.tags.map(t => (
                  <span
                    key={t}
                    className="px-1.5 py-0.5 rounded bg-neutral-800 text-[10px] text-neutral-500"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
