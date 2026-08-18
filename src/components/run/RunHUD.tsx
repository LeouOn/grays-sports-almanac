import type { Meters } from '@/hooks/useRun';

function Meter({ label, value, max, tone }: { label: string; value: number; max: number; tone: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="flex-1 min-w-0">
      <div className="flex justify-between text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
        <span>{label}</span><span>{value}</span>
      </div>
      <div className="h-2 rounded bg-neutral-800 overflow-hidden">
        <div className={`h-full ${tone}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function RunHUD({ meters }: { meters: Meters }) {
  return (
    <div className="flex gap-4 p-3 bg-neutral-900/50 border border-neutral-800 rounded-lg">
      <Meter label="Capital" value={meters.capital} max={500} tone="bg-emerald-500" />
      <Meter label="Reputation" value={meters.reputation} max={100} tone="bg-amber-400" />
      <Meter label="Temporal Risk" value={meters.temporalRisk} max={100} tone="bg-red-500" />
    </div>
  );
}