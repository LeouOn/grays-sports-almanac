import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Calendar, MapPin, Download } from 'lucide-react';
import { loadWorldEvents } from '@/data/loader';
import { type WorldEvent } from '@/data/world-events';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageSkeleton } from '@/components/PageSkeleton';
import { showError } from '@/lib/toast';
import { exportToCSV } from '@/lib/export';
import { RelatedEntries } from '@/components/RelatedEntries';
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
  const [activeEntry, setActiveEntry] = useState<WorldEvent | null>(null);

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

  useEffect(() => {
    if (!activeEntry) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveEntry(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeEntry]);

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
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportToCSV(filtered as unknown as Record<string, unknown>[], 'world-events.csv')}
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
          No events match the current filters.
        </div>
      )}

      {/* Card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((e) => (
          <Card
            key={e.id}
            className="bg-neutral-900 border-neutral-800 cursor-pointer hover:border-neutral-700 transition-colors"
            onClick={() => setActiveEntry(e)}
          >
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
              <RelatedEntries tags={e.tags ?? []} excludeId={e.id} />
            </CardContent>
          </Card>
        ))}
      </div>

      {activeEntry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setActiveEntry(null)}
        >
          <div
            className="bg-neutral-900 border border-neutral-800 rounded-lg max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveEntry(null)}
              className="float-right text-neutral-400 hover:text-white"
              aria-label="Close detail"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-white leading-snug">{activeEntry.event}</h2>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="flex items-center gap-1 text-neutral-500">
                <Calendar className="size-3" /> {activeEntry.year}
              </span>
              <span className="flex items-center gap-1 text-neutral-500">
                <MapPin className="size-3" /> {activeEntry.country}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${REGION_COLORS[activeEntry.region]}`}>
                {activeEntry.region}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${CATEGORY_COLORS[activeEntry.category]}`}>
                {activeEntry.category}
              </span>
            </div>

            <div>
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Significance</h3>
              <p className="text-sm text-neutral-300 leading-relaxed">{activeEntry.significance}</p>
            </div>

            {activeEntry.tags && activeEntry.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {activeEntry.tags.map((t) => (
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
