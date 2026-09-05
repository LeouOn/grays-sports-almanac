import { lazy, Suspense } from 'react';
import { useProgress, type ProgressEntry } from '@/hooks/useProgress';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartSkeleton } from '@/components/ChartSkeleton';
import { formatActivity } from '@/lib/formatActivity';

// Lazy-load the recharts-backed donut so the recharts vendor chunk is only
// fetched when the Progress page renders. While it loads, an
// accessible pulse placeholder occupies the same 28x28 (w-28 h-28) slot.
const ProgressDonut = lazy(() =>
  import('@/components/ProgressDonut').then(m => ({ default: m.ProgressDonut })),
);

const modules = [
  { key: 'Sports', emoji: '🏈', label: 'Sports Almanac', route: '/sports' },
  { key: 'Finance', emoji: '📈', label: 'Financial Almanac', route: '/finance' },
  { key: 'Era Guide', emoji: '📖', label: 'Era Integration Guide', route: '/era-guide' },
  { key: 'Disasters', emoji: '🌋', label: 'Disaster Prevention', route: '/disasters' },
  { key: 'Tech Transfer', emoji: '🔧', label: 'Technology Transfer', route: '/tech-transfer' },
  { key: 'Medical', emoji: '💊', label: 'Medical Interventions', route: '/medical' },
  { key: 'Safety', emoji: '🛡️', label: 'Safety & Dead Drops', route: '/safety' },
  { key: 'Blueprints', emoji: '📋', label: 'Bootstrap Blueprints', route: '/blueprints' },
];

function modulePercentage(entry: ProgressEntry | undefined): number {
  if (!entry || entry.total_entries === 0) return 0;
  return Math.round((entry.entries_viewed / entry.total_entries) * 100);
}

export function Progress() {
  const { progress, loading, overallPercentage } = useProgress();

  const progressMap = new Map(progress.map(p => [p.module, p]));

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-64 bg-neutral-800 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-40 bg-neutral-900 border border-neutral-800 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (progress.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Mission Progress</h1>
          <p className="text-neutral-400 mt-1">Track your preparation across every knowledge module.</p>
        </div>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-6xl mb-6">📊</div>
          <h2 className="text-xl font-semibold text-neutral-200 mb-2">No progress yet</h2>
          <p className="text-neutral-400 max-w-md">
            Start exploring to track your progress! Visit any module below to begin building your dossier.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            {modules.slice(0, 4).map(m => (
              <Link
                key={m.key}
                to={m.route}
                className="px-4 py-2 rounded-lg border border-neutral-800 bg-neutral-900/50 hover:border-indigo-500/40 hover:bg-neutral-900 text-sm text-neutral-300 hover:text-white transition-all text-center"
              >
                <span className="mr-1">{m.emoji}</span> {m.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with donut */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="w-28 h-28 shrink-0 relative">
          <Suspense
            fallback={
              <ChartSkeleton
                height={112}
                label="Loading progress chart"
                className="!p-0 border-transparent bg-transparent"
              />
            }
          >
            <ProgressDonut percentage={overallPercentage} />
          </Suspense>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-lg font-bold text-white">{overallPercentage}%</span>
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Mission Progress</h1>
          <p className="text-neutral-400 mt-1">
            {overallPercentage === 100
              ? 'All modules complete. You are fully prepared, Traveler.'
              : `${overallPercentage}% of all entries explored across ${progress.length} module${progress.length !== 1 ? 's' : ''}.`}
          </p>
        </div>
      </div>

      {/* Module cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map(mod => {
          const entry = progressMap.get(mod.key);
          const pct = modulePercentage(entry);
          return (
            <Card key={mod.key} className="bg-neutral-900 border-neutral-800 hover:border-indigo-800/50 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2 text-base">
                  <span>{mod.emoji}</span>
                  {mod.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs text-neutral-400 mb-1">
                    <span>{entry ? entry.entries_viewed : 0} / {entry ? entry.total_entries : 0} entries</span>
                    <span className="font-semibold text-neutral-300">{pct}%</span>
                  </div>
                  <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Quiz score */}
                {entry?.quiz_score != null && entry.quiz_total != null && entry.quiz_total > 0 && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-500">Quiz</span>
                    <span className="font-medium text-neutral-300">
                      {entry.quiz_score} / {entry.quiz_total}
                    </span>
                  </div>
                )}

                {/* Last activity */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-500">Last activity</span>
                  <span className="text-neutral-400">{formatActivity(entry?.last_activity ?? null)}</span>
                </div>

                <Link
                  to={mod.route}
                  className="block text-center text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors pt-1"
                >
                  Open module →
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
