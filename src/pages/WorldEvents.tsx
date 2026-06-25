import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import { loadWorldEvents } from '@/data/loader';
import { type WorldEvent } from '@/data/world-events';
import { Card, CardContent } from '@/components/ui/card';
import { PageSkeleton } from '@/components/PageSkeleton';
import { showError } from '@/lib/toast';
import { useURLState } from '../hooks/useURLState';

const REGIONS = ['Americas', 'Europe', 'Asia', 'Africa', 'Middle East'] as const;
const CATEGORIES = ['Geopolitical', 'Economic', 'Cultural', 'Scientific', 'Social'] as const;
type Region = typeof REGIONS[number];
type Category = typeof CATEGORIES[number];

const REGION_COLORS: Record<Region, string> = {
  Americas: 'bg-blue-500/20 text-blue-300',
  Europe: 'bg-indigo-500/20 text-indigo-300',
  Asia: 'bg-amber-500/20 text-amber-300',
  Africa: 'bg-emerald-500/20 text-emerald-300',
  'Middle East': 'bg-orange-500/20 text-orange-300',
};

const CATEGORY_COLORS: Record<Category, string> = {
  Geopolitical: 'bg-red-500/20 text-red-300',
  Economic: 'bg-amber-500/20 text-amber-300',
  Cultural: 'bg-purple-500/20 text-purple-300',
  Scientific: 'bg-cyan-500/20 text-cyan-300',
  Social: 'bg-pink-500/20 text-pink-300',
};

export function WorldEvents() {
  const [events, setEvents] = useState<WorldEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useURLState('region', 'all');
  const [category, setCategory] = useURLState('category', 'all');

  useEffect(() => {
    loadWorldEvents()
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => {
        showError('Failed to load world events');
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    return events
      .filter((e) => {
        if (region !== 'all' && e.region !== region) return false;
        if (category !== 'all' && e.category !== category) return false;
        return true;
      })
      .sort((a, b) => a.year - b.year);
  }, [events, region, category]);

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-8">
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white mb-2"
        >
          <ArrowLeft className="size-3.5" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-white">World Events</h1>
        <p className="text-neutral-400 mt-1">
          150+ pivotal global events from 1970–2001 across geopolitics, economics, culture, and science.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="region-filter" className="text-xs text-neutral-400">
            Region:
          </label>
          <select
            id="region-filter"
            value={region}
            onChange={(e) => setRegion(e.target.value as Region | 'all')}
            className="h-8 px-2 rounded-md border border-neutral-800 bg-neutral-900 text-sm text-white"
          >
            <option value="all">All</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="category-filter" className="text-xs text-neutral-400">
            Category:
          </label>
          <select
            id="category-filter"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category | 'all')}
            className="h-8 px-2 rounded-md border border-neutral-800 bg-neutral-900 text-sm text-white"
          >
            <option value="all">All</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <span className="text-xs text-neutral-500">
          Showing {filtered.length} of {events.length}
        </span>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-16 text-neutral-500">
          No events match the current filters.
        </div>
      )}

      {/* Card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((e) => (
          <Card key={e.id} className="bg-neutral-900 border-neutral-800">
            <CardContent className="pt-5 space-y-3">
              <div className="flex items-center gap-2 text-xs flex-wrap">
                <span className="flex items-center gap-1 text-neutral-500">
                  <Calendar className="size-3" /> {e.year}
                </span>
                <span className="flex items-center gap-1 text-neutral-500">
                  <MapPin className="size-3" /> {e.country}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${REGION_COLORS[e.region]}`}
                >
                  {e.region}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${CATEGORY_COLORS[e.category]}`}
                >
                  {e.category}
                </span>
              </div>
              <h3 className="font-semibold text-white leading-snug">{e.event}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{e.significance}</p>
              {e.tags && e.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {e.tags.map((t) => (
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
