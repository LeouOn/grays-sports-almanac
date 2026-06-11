import { AlertTriangle, GitBranch, History } from 'lucide-react';

interface ButterflyImpactProps {
  cascade?: string[];
  confidence?: 'high' | 'medium' | 'low' | 'contested';
  butterflyRisk: 'Low' | 'Medium' | 'High' | 'Extreme';
}

const confidenceLabel: Record<string, string> = {
  high: 'Well-documented — records are reliable',
  medium: 'Some disputes in the historical record',
  low: 'Significant uncertainty — records may be incomplete',
  contested: 'Multiple conflicting accounts exist',
};

const confidenceColor: Record<string, string> = {
  high: 'text-green-400 border-green-800 bg-green-950/30',
  medium: 'text-amber-400 border-amber-800 bg-amber-950/30',
  low: 'text-orange-400 border-orange-800 bg-orange-950/30',
  contested: 'text-red-400 border-red-800 bg-red-950/30',
};

export function ButterflyImpact({ cascade, confidence, butterflyRisk }: ButterflyImpactProps) {
  if (!cascade && !confidence) return null;

  return (
    <div className="mt-3 p-3 rounded-lg border border-neutral-800 bg-neutral-950/40 space-y-3">
      <div className="flex items-center gap-2">
        <GitBranch className="size-3.5 text-purple-400" />
        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Butterfly Analysis</span>
        <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ml-auto ${
          butterflyRisk === 'Extreme' ? 'bg-red-950/60 text-red-400 border border-red-800' :
          butterflyRisk === 'High' ? 'bg-orange-950/60 text-orange-400 border border-orange-800' :
          butterflyRisk === 'Medium' ? 'bg-amber-950/60 text-amber-400 border border-amber-800' :
          'bg-green-950/60 text-green-400 border border-green-800'
        }`}>
          {butterflyRisk} 🦋 Risk
        </span>
      </div>

      {confidence && (
        <div className={`flex items-start gap-2 p-2 rounded border text-xs ${confidenceColor[confidence]}`}>
          <History className="size-3.5 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Historical Confidence: {confidence}</span>
            <span className="text-neutral-400 ml-1">— {confidenceLabel[confidence]}</span>
          </div>
        </div>
      )}

      {cascade && cascade.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle className="size-3" />
            If This Didn't Happen
          </div>
          <ul className="space-y-1">
            {cascade.map((effect, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-neutral-400">
                <span className="text-purple-500 mt-0.5 shrink-0">→</span>
                <span>{effect}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
