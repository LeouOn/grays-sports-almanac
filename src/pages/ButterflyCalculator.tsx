import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useURLState } from '../hooks/useURLState';
import { RiskVisualization } from '@/components/RiskVisualization';

interface FactorOption {
  label: string;
  score: number;
  description: string;
}

const visibilityOptions: FactorOption[] = [
  { label: 'Anonymous dead drop / mailed letter', score: 1, description: 'No human contact. Untraceable.' },
  { label: 'Anonymous phone call', score: 2, description: 'Voice heard but not seen. Payphone = untraceable.' },
  { label: 'In-person meeting using alias', score: 3, description: 'Face seen. Alias may not hold up.' },
  { label: 'Public figure / media appearance', score: 5, description: 'Your face and name are recorded. Maximum exposure.' },
];

const temporalOptions: FactorOption[] = [
  { label: '>10 years before documented discovery', score: 1, description: 'Far enough back that you are not the cause.' },
  { label: '5-10 years before discovery', score: 2, description: 'You might accelerate, not create.' },
  { label: '2-5 years before discovery', score: 3, description: 'You are close to the historical timeline.' },
  { label: '<2 years — you might BE the discovery event', score: 5, description: 'Very risky. The timeline may depend on you.' },
];

const reversibilityOptions: FactorOption[] = [
  { label: 'Pure information — recipient can ignore it', score: 1, description: 'Your intervention is a memo. It can be thrown away.' },
  { label: 'Physical object delivered — harder to undo', score: 3, description: 'A device, document, or evidence that persists.' },
  { label: 'Infrastructure changed / people moved', score: 5, description: 'Permanent physical change. No undo.' },
];

const connectednessOptions: FactorOption[] = [
  { label: 'Affects <100 people directly', score: 1, description: 'Local, contained. A single family or village.' },
  { label: 'Affects a city or industry', score: 3, description: 'Regional scope. Think Three Mile Island or a company.' },
  { label: 'Cascading global effects', score: 5, description: 'Changes the course of nations. Extreme caution required.' },
];

function FactorPicker({ title, options, selected, onSelect }: {
  title: string;
  options: FactorOption[];
  selected: number | null;
  onSelect: (score: number) => void;
}) {
  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold text-neutral-200">{title}</h2>
      <div className="grid gap-2">
        {options.map(opt => (
          <button
            key={opt.score}
            onClick={() => onSelect(opt.score)}
            className={`text-left p-3 rounded-lg border transition-all text-sm ${
              selected === opt.score
                ? 'border-indigo-500 bg-indigo-950/40 text-white'
                : 'border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
            }`}
          >
            <div className="font-medium">{opt.label}</div>
            <div className="text-xs text-neutral-500 mt-0.5">{opt.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function ButterflyCalculator() {
  const [visibilityStr, setVisibilityStr] = useURLState('visibility', '');
  const [temporalStr, setTemporalStr] = useURLState('temporal', '');
  const [reversibilityStr, setReversibilityStr] = useURLState('reversibility', '');
  const [connectednessStr, setConnectednessStr] = useURLState('connectedness', '');

  const visibility = visibilityStr ? Number(visibilityStr) : null;
  const temporal = temporalStr ? Number(temporalStr) : null;
  const reversibility = reversibilityStr ? Number(reversibilityStr) : null;
  const connectedness = connectednessStr ? Number(connectednessStr) : null;

  const allSelected = visibility !== null && temporal !== null && reversibility !== null && connectedness !== null;
  const rawScore = allSelected ? visibility! * temporal! * reversibility! * connectedness! : null;

  const getRiskLevel = (score: number) => {
    if (score <= 9) return { label: '🟢 SAFE', color: 'text-green-400', desc: 'Proceed. Low butterfly risk. Standard caution applies.' };
    if (score <= 45) return { label: '🟡 CAUTION', color: 'text-amber-400', desc: 'Proceed with care. Weigh the benefits against moderate timeline disruption.' };
    if (score <= 150) return { label: '🟠 HIGH RISK', color: 'text-orange-400', desc: 'Consider alternatives. This intervention has significant butterfly potential.' };
    return { label: '🔴 EXTREME', color: 'text-red-400', desc: 'DO NOT PROCEED without extreme justification. Cascading effects are nearly certain.' };
  };

  const risk = rawScore !== null ? getRiskLevel(rawScore) : null;

  const reset = () => {
    setVisibilityStr('');
    setTemporalStr('');
    setReversibilityStr('');
    setConnectednessStr('');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-neutral-50 via-neutral-200 to-neutral-500 bg-clip-text text-transparent">Butterfly Risk Calculator</h1>
        <p className="text-neutral-400 mt-2">Score your intervention across four dimensions. Multiply the factors. Scores above 50 are red-flagged.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Pickers Column */}
        <div className="lg:col-span-2 space-y-6">
          <FactorPicker title="1. Visibility — How exposed are you?" options={visibilityOptions} selected={visibility} onSelect={(s) => setVisibilityStr(String(s))} />
          <FactorPicker title="2. Temporal Distance — How close to the known event?" options={temporalOptions} selected={temporal} onSelect={(s) => setTemporalStr(String(s))} />
          <FactorPicker title="3. Reversibility — Can you undo this?" options={reversibilityOptions} selected={reversibility} onSelect={(s) => setReversibilityStr(String(s))} />
          <FactorPicker title="4. Connectedness — How far do the effects ripple?" options={connectednessOptions} selected={connectedness} onSelect={(s) => setConnectednessStr(String(s))} />
        </div>

        {/* Risk Gauge Card Column */}
        <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-6">
          <Card className={`border-2 transition-all duration-500 ${allSelected ? (rawScore! > 45 ? 'border-red-900 bg-red-950/20 shadow-red-950/40 shadow-xl' : 'border-green-900 bg-green-950/20 shadow-green-950/20 shadow-xl') : 'border-neutral-850 bg-neutral-900/40'}`}>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-white text-base">Timeline Impact Gauge</CardTitle>
              <CardDescription className="text-neutral-500 text-xs">
                Formula: Vis × Temp × Rev × Conn
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4 pt-2">
              {/* SVG Gauge */}
              <div className="w-full flex justify-center">
                <svg viewBox="0 0 200 120" className="w-full max-w-[200px] overflow-visible">
                  <defs>
                    <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#22c55e" />
                      <stop offset="30%" stopColor="#eab308" />
                      <stop offset="60%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                    <filter id="gauge-glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  <path
                    d="M 25 100 A 75 75 0 0 1 175 100"
                    fill="none"
                    stroke="#1f1f1f"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 25 100 A 75 75 0 0 1 175 100"
                    fill="none"
                    stroke="url(#gauge-grad)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    opacity="0.15"
                  />
                  {allSelected && (
                    <path
                      d="M 25 100 A 75 75 0 0 1 175 100"
                      fill="none"
                      stroke="url(#gauge-grad)"
                      strokeWidth="11"
                      strokeLinecap="round"
                      strokeDasharray="235.6"
                      strokeDashoffset={235.6 - (Math.min(625, rawScore!) / 625) * 235.6}
                      className="transition-all duration-700 ease-out"
                      filter="url(#gauge-glow)"
                    />
                  )}
                  <text x="100" y="85" textAnchor="middle" className="fill-white font-extrabold text-2xl font-mono">
                    {rawScore !== null ? rawScore : '—'}
                  </text>
                  <text x="100" y="105" textAnchor="middle" className="fill-neutral-500 font-bold text-[9px] tracking-wider uppercase">
                    {rawScore !== null ? `Index (Max 625)` : 'Pending selections'}
                  </text>
                </svg>
              </div>

              {allSelected && risk ? (
                <div className="w-full text-center space-y-2 animate-in fade-in duration-300">
                  <div className={`text-xl font-extrabold tracking-tight ${risk.color}`}>{risk.label}</div>
                  <p className="text-neutral-400 text-xs leading-relaxed px-2">{risk.desc}</p>
                  <div className="text-[10px] text-neutral-500 font-mono bg-black/40 py-1.5 px-3 rounded-md border border-neutral-800/40 inline-block mt-1">
                    Calculation: {visibility} × {temporal} × {reversibility} × {connectedness} = {rawScore}
                  </div>
                  <div className="pt-2 border-t border-neutral-800">
                    <Button variant="secondary" onClick={reset} className="w-full text-xs h-7 py-0 cursor-pointer">
                      Reset Parameters
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-neutral-500 text-center py-6 text-xs px-4 leading-relaxed">
                  Select one option from each category on the left to evaluate timeline disruption risk.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Risk Factor Visualization */}
      <RiskVisualization
        visibility={visibility}
        temporal={temporal}
        reversibility={reversibility}
        connectedness={connectedness}
        rawScore={rawScore}
      />
    </div>
  );
}
