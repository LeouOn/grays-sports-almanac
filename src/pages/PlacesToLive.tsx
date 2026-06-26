import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, AlertTriangle, CheckCircle2, Download } from 'lucide-react';
import { loadPlacesToLive } from '@/data/loader';
import { type RelocationDestination } from '@/data/places-to-live';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageSkeleton } from '@/components/PageSkeleton';
import { showError } from '@/lib/toast';
import { exportToCSV } from '@/lib/export';
import { RelatedEntries } from '@/components/RelatedEntries';
import { useURLState } from '../hooks/useURLState';

const DECADES = ['1970s', '1980s', '1990s', '2000s'] as const;
const STABILITY_LEVELS = ['Stable', 'Turbulent', 'Authoritarian', 'Transitional'] as const;
type Stability = typeof STABILITY_LEVELS[number];

const STABILITY_COLORS: Record<Stability, string> = {
  Stable: 'bg-emerald-500/20 text-emerald-300',
  Turbulent: 'bg-amber-500/20 text-amber-300',
  Authoritarian: 'bg-red-500/20 text-red-300',
  Transitional: 'bg-blue-500/20 text-blue-300',
};

export function PlacesToLive() {
  const [places, setPlaces] = useState<RelocationDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [decade, setDecade] = useURLState('decade', 'all');
  const [stability, setStability] = useURLState('stability', 'all');
  const [activeEntry, setActiveEntry] = useState<RelocationDestination | null>(null);

  useEffect(() => {
    loadPlacesToLive()
      .then(data => {
        setPlaces(data);
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

  const filtered = useMemo(() => {
    return places.filter(p => {
      if (decade !== 'all' && p.decade !== decade) return false;
      if (stability !== 'all' && p.politicalStability !== stability) return false;
      return true;
    });
  }, [places, decade, stability]);

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-8">
      <div>
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white mb-2">
          <ArrowLeft className="size-3.5" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-white">Places to Live</h1>
        <p className="text-neutral-400 mt-1">
          Relocation guide: cost of living, quality of life, and political climate by city and decade.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400">Decade:</span>
          <button
            onClick={() => setDecade('all')}
            className={`px-3 py-1 text-xs rounded-full ${decade === 'all' ? 'bg-indigo-600 text-white' : 'bg-neutral-800 text-neutral-400'}`}
          >
            All
          </button>
          {DECADES.map(d => (
            <button
              key={d}
              onClick={() => setDecade(d)}
              className={`px-3 py-1 text-xs rounded-full ${decade === d ? 'bg-indigo-600 text-white' : 'bg-neutral-800 text-neutral-400'}`}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-4">
          <label htmlFor="stability-filter" className="text-xs text-neutral-400">Stability:</label>
          <select
            id="stability-filter"
            value={stability}
            onChange={(e) => setStability(e.target.value as Stability | 'all')}
            className="h-8 px-2 rounded-md border border-neutral-800 bg-neutral-900 text-sm text-white"
          >
            <option value="all">All</option>
            {STABILITY_LEVELS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <span className="text-xs text-neutral-500">
          Showing {filtered.length} of {places.length}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportToCSV(filtered as unknown as Record<string, unknown>[], 'places-to-live.csv')}
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
        {filtered.map(p => (
          <Card
            key={p.id}
            className="bg-neutral-900 border-neutral-800 cursor-pointer hover:border-neutral-700 transition-colors"
            onClick={() => setActiveEntry(p)}
          >
            <CardContent className="pt-5 space-y-3">
              <div>
                <div className="flex items-baseline justify-between">
                  <h3 className="font-semibold text-white">{p.city}</h3>
                  <span className="text-xs text-neutral-500">{p.decade}</span>
                </div>
                <p className="text-xs text-neutral-500">{p.country}</p>
              </div>

              {/* Stability badge */}
              <div>
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${STABILITY_COLORS[p.politicalStability]}`}>
                  {p.politicalStability}
                </span>
              </div>

              {/* Cost of living bar (lower = better, so inverted visual) */}
              <div>
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                  <span>Cost of Living</span>
                  <span>{p.costOfLivingIndex}/100</span>
                </div>
                <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: `${p.costOfLivingIndex}%` }} />
                </div>
              </div>

              {/* Quality of life bar */}
              <div>
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                  <span>Quality of Life</span>
                  <span>{p.qualityOfLifeScore}/100</span>
                </div>
                <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${p.qualityOfLifeScore}%` }} />
                </div>
              </div>

              {/* Highlights */}
              <div className="space-y-1">
                {p.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-xs text-neutral-300">
                    <CheckCircle2 className="size-3 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              {/* Cautions */}
              {p.cautions.length > 0 && (
                <div className="space-y-1">
                  {p.cautions.map((c, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-neutral-400">
                      <AlertTriangle className="size-3 text-amber-400 mt-0.5 shrink-0" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Best for */}
              {p.bestFor.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {p.bestFor.map((b, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-full bg-neutral-800 text-[10px] text-neutral-400">
                      {b}
                    </span>
                  ))}
                </div>
              )}

              <RelatedEntries tags={p.tags ?? []} excludeId={p.id} />
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

            <h2 className="text-xl font-bold text-white leading-snug">
              {activeEntry.city}, {activeEntry.country}
            </h2>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-[10px] text-neutral-400">
                {activeEntry.decade}
              </span>
              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${STABILITY_COLORS[activeEntry.politicalStability]}`}>
                {activeEntry.politicalStability}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-neutral-950 border border-neutral-800 rounded p-2">
                <div className="text-neutral-500">Cost of Living</div>
                <div className="text-neutral-200 font-semibold">{activeEntry.costOfLivingIndex}/100</div>
              </div>
              <div className="bg-neutral-950 border border-neutral-800 rounded p-2">
                <div className="text-neutral-500">Quality of Life</div>
                <div className="text-neutral-200 font-semibold">{activeEntry.qualityOfLifeScore}/100</div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <CheckCircle2 className="size-3 text-emerald-400" /> Highlights
              </h3>
              <ul className="space-y-1">
                {activeEntry.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-neutral-300">
                    <CheckCircle2 className="size-3 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {activeEntry.cautions.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <AlertTriangle className="size-3 text-amber-400" /> Cautions
                </h3>
                <ul className="space-y-1">
                  {activeEntry.cautions.map((c, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-neutral-400">
                      <AlertTriangle className="size-3 text-amber-400 mt-0.5 shrink-0" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeEntry.bestFor.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Best for</h3>
                <div className="flex flex-wrap gap-1">
                  {activeEntry.bestFor.map((b, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-full bg-neutral-800 text-[10px] text-neutral-400">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            )}

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
