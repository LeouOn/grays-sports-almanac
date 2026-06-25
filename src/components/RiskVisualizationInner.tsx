import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Cell,
  Tooltip,
} from 'recharts';

export interface RiskVisualizationProps {
  visibility: number | null;
  temporal: number | null;
  reversibility: number | null;
  connectedness: number | null;
  rawScore: number | null;
}

interface FactorDatum {
  name: string;
  score: number;
  fullMark: number;
}

/** Color for individual factor bars: green (1-2), amber (3), red (4-5). */
const getFactorColor = (score: number): string => {
  if (score === 0) return 'var(--muted-foreground)';
  if (score <= 2) return '#22c55e';
  if (score === 3) return '#eab308';
  return '#ef4444';
};

/** Color for composite / radar based on raw product score. */
const getCompositeColor = (raw: number): string => {
  if (raw <= 9) return '#22c55e';
  if (raw <= 45) return '#eab308';
  if (raw <= 150) return '#f97316';
  return '#ef4444';
};

/* ── Bar chart tooltip ──────────────────────────────────────────── */

function BarTooltip({ active, payload }: {
  active?: boolean;
  payload?: Array<{ value: number; payload: FactorDatum }>;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-popover/95 backdrop-blur-sm p-3 shadow-xl">
      <p className="text-xs font-bold text-foreground">{d.name}</p>
      <p className="text-xs text-muted-foreground mt-1">
        Score:{' '}
        <span className="font-semibold" style={{ color: getFactorColor(d.score) }}>
          {d.score}
        </span>{' '}
        / 5
      </p>
    </div>
  );
}

/* ── Radar tooltip ──────────────────────────────────────────────── */

function RadarTooltipContent({ active, payload }: {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover/95 backdrop-blur-sm p-3 shadow-xl">
      {payload.map((p) => (
        <p key={p.name} className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{p.name}</span>:{' '}
          <span className="font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────── */

/**
 * Inner implementation of the risk visualization charts (bar + radar).
 * Imports recharts eagerly; the lazy wrapper in `RiskVisualization.tsx`
 * defers loading this module (and the recharts vendor chunk) until the
 * host page actually renders the chart.
 */
export function RiskVisualizationInner({
  visibility,
  temporal,
  reversibility,
  connectedness,
  rawScore,
}: RiskVisualizationProps) {
  const factorData: FactorDatum[] = [
    { name: 'Visibility', score: visibility ?? 0, fullMark: 5 },
    { name: 'Temporal', score: temporal ?? 0, fullMark: 5 },
    { name: 'Reversibility', score: reversibility ?? 0, fullMark: 5 },
    { name: 'Connectedness', score: connectedness ?? 0, fullMark: 5 },
  ];

  const allSelected =
    visibility !== null &&
    temporal !== null &&
    reversibility !== null &&
    connectedness !== null;

  const radarColor =
    allSelected && rawScore !== null
      ? getCompositeColor(rawScore)
      : 'var(--chart-1)';

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            Risk Factor Analysis
          </h2>
          <p className="text-xs text-muted-foreground">
            Factor scores across four risk dimensions
          </p>
        </div>

        {/* Summary score badge */}
        {rawScore !== null && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                Composite Index
              </div>
              <div className="text-2xl font-extrabold font-mono text-foreground">
                {rawScore}<span className="text-xs font-normal text-muted-foreground ml-1">/625</span>
              </div>
            </div>
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-base font-bold transition-colors duration-500"
              style={{
                backgroundColor: `color-mix(in oklch, ${getCompositeColor(rawScore)} 15%, transparent)`,
                color: getCompositeColor(rawScore),
                border: `1px solid color-mix(in oklch, ${getCompositeColor(rawScore)} 30%, transparent)`,
              }}
            >
              {rawScore > 150 ? '☠' : rawScore > 45 ? '⚠' : rawScore > 9 ? '⚡' : '✓'}
            </div>
          </div>
        )}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ── Horizontal bar chart ─────────────────────────────── */}
        <div
          className="rounded-lg border border-border bg-card/50 p-4"
          style={{ height: 280 }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={factorData}
              layout="vertical"
              margin={{ top: 8, right: 24, left: 16, bottom: 8 }}
            >
              <XAxis
                type="number"
                domain={[0, 5]}
                ticks={[0, 1, 2, 3, 4, 5]}
                tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                axisLine={{ stroke: 'var(--border)' }}
                tickLine={{ stroke: 'var(--border)' }}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{
                  fill: 'var(--foreground)',
                  fontSize: 12,
                  fontWeight: 600,
                }}
                axisLine={{ stroke: 'var(--border)' }}
                tickLine={false}
                width={100}
              />
              <Tooltip content={<BarTooltip />} />
              {/* Background bars showing max (5) */}
              <Bar
                dataKey="fullMark"
                fill="var(--muted)"
                fillOpacity={0.08}
                radius={[0, 6, 6, 0]}
                isAnimationActive={false}
              />
              {/* Score bars */}
              <Bar
                dataKey="score"
                radius={[0, 6, 6, 0]}
                animationDuration={600}
                animationEasing="ease-out"
              >
                {factorData.map((entry, idx) => (
                  <Cell
                    key={`bar-${idx}`}
                    fill={getFactorColor(entry.score)}
                    fillOpacity={entry.score === 0 ? 0.12 : 0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── Radar / spider chart ─────────────────────────────── */}
        <div
          className="rounded-lg border border-border bg-card/50 p-4"
          style={{ height: 280 }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              data={factorData}
              cx="50%"
              cy="50%"
              outerRadius="70%"
            >
              <PolarGrid
                stroke="var(--border)"
                strokeOpacity={0.35}
              />
              <PolarAngleAxis
                dataKey="name"
                tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 5]}
                tickCount={6}
                tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                axisLine={false}
              />
              <Tooltip content={<RadarTooltipContent />} />
              <Radar
                name="Risk"
                dataKey="score"
                stroke={radarColor}
                fill={radarColor}
                fillOpacity={0.18}
                strokeWidth={2}
                animationDuration={600}
                animationEasing="ease-out"
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
