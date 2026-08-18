import type { RunState } from '@/hooks/useRun';

export function RunSummary({ run, score, onReset }: { run: RunState; score: number | null; onReset: () => void }) {
  const exiled = run.outcome === 'exiled';
  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-3xl font-bold tracking-tight">
        {exiled ? '⛔ Temporal Exile' : '🏁 Run Complete'}
      </h1>
      <p className="text-neutral-400">
        {exiled
          ? 'The timeline noticed you. A quiet van pulls up; your almanac is confiscated.'
          : `You retired after ${run.beatIndex} beats in the ${run.era}.`}
      </p>
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-neutral-900/50 border border-neutral-800 rounded-lg">
          <div className="text-2xl font-bold text-emerald-400">{run.meters.capital}</div>
          <div className="text-[10px] uppercase tracking-wider text-neutral-500">Capital</div>
        </div>
        <div className="p-3 bg-neutral-900/50 border border-neutral-800 rounded-lg">
          <div className="text-2xl font-bold text-amber-400">{run.checksCorrect}/{run.checksAsked}</div>
          <div className="text-[10px] uppercase tracking-wider text-neutral-500">Checks</div>
        </div>
        <div className="p-3 bg-neutral-900/50 border border-neutral-800 rounded-lg">
          <div className="text-2xl font-bold text-indigo-400">{score ?? '—'}</div>
          <div className="text-[10px] uppercase tracking-wider text-neutral-500">Score</div>
        </div>
      </div>
      <button
        onClick={onReset}
        className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors cursor-pointer"
      >
        Run It Back ⚡
      </button>
    </div>
  );
}