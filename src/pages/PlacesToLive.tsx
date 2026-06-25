import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { loadPlacesToLive } from '@/data/loader';
import { type RelocationDestination } from '@/data/places-to-live';
import { Card, CardContent } from '@/components/ui/card';
import { PageSkeleton } from '@/components/PageSkeleton';
import { showError } from '@/lib/toast';
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
          <Card key={p.id} className="bg-neutral-900 border-neutral-800">
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
