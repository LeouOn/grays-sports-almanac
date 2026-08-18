import { useState } from 'react';
import { useRun } from '@/hooks/useRun';
import { useCompanion } from '../context/CompanionContext';
import { RunSetup } from '@/components/run/RunSetup';
import { RunHUD } from '@/components/run/RunHUD';
import { BeatView } from '@/components/run/BeatView';
import { RunSummary } from '@/components/run/RunSummary';

export function Run() {
  const { activeCompanion } = useCompanion();
  const { phase, run, beat, correct, score, start, choose, answer, advance, retire, reset } = useRun(activeCompanion.id);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wrap = (fn: () => void | Promise<void>) => async () => {
    setBusy(true); setError(null);
    try { await fn(); } catch (err) { setError(err instanceof Error ? err.message : String(err)); }
    finally { setBusy(false); }
  };

  if (phase === 'setup') {
    return (
      <div className="space-y-4">
        <RunSetup loading={busy} onStart={(era) => void wrap(() => start(era))()} />
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    );
  }

  if (phase === 'summary' && run) {
    return <RunSummary run={run} score={score} onReset={reset} />;
  }

  if (!run || !beat) return null;

  return (
    <div className="space-y-6 max-w-2xl">
      <RunHUD meters={run.meters} />
      <BeatView key={beat.index} beat={beat} correct={correct} busy={busy}
        onChoose={(id) => void wrap(() => choose(id))()}
        onAnswer={(i) => void wrap(() => answer(i))()}
        onAdvance={() => void wrap(advance)()} />
      {run.beatIndex >= 6 && (
        <button
          onClick={() => void wrap(retire)()}
          disabled={busy}
          className="px-4 py-2 rounded-lg border border-emerald-700/50 bg-emerald-950/30 text-emerald-300 text-sm font-semibold hover:bg-emerald-950/60 transition-colors cursor-pointer"
        >
          Retire now and bank your score
        </button>
      )}
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}