import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, MapPin, Calendar, Clock, Wallet } from 'lucide-react';
import { loadPlacesToVisit } from '@/data/loader';
import { type TouristDestination } from '@/data/places-to-visit';
import { Card, CardContent } from '@/components/ui/card';
import { PageSkeleton } from '@/components/PageSkeleton';
import { showError } from '@/lib/toast';
import { useURLState } from '../hooks/useURLState';

const DECADES = ['1970s', '1980s', '1990s', '2000s'] as const;
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
            onClick={() => setDecade('all')}
            aria-pressed={decade === 'all'}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              decade === 'all' ? 'bg-indigo-600 text-white' : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            All
          </button>
          {DECADES.map(d => (
            <button
              key={d}
              type="button"
              onClick={() => setDecade(d)}
              aria-pressed={decade === d}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
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
            onChange={e => setCategory(e.target.value as Category | 'all')}
            className="h-8 px-2 rounded-md border border-neutral-800 bg-neutral-900 text-sm text-white focus:outline-none focus:border-indigo-500"
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
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-16 text-neutral-500">
          No destinations match the current filters.
        </div>
      )}

      {/* Card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => (
          <Card key={p.id} className="bg-neutral-900/50 border-neutral-800">
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
