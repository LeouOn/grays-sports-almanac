import { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useURLState } from '@/hooks/useURLState';

// Historical financial metrics a time traveler would track (approximate real values)
const yearlyData = [
  { year: 1970, sp500: 83, gold: 36, oil: 3.2, dow: 839 },
  { year: 1971, sp500: 98, gold: 41, oil: 3.4, dow: 890 },
  { year: 1972, sp500: 110, gold: 58, oil: 3.4, dow: 950 },
  { year: 1973, sp500: 92, gold: 97, oil: 4.8, dow: 831 },
  { year: 1974, sp500: 68, gold: 154, oil: 9.0, dow: 616 },
  { year: 1975, sp500: 90, gold: 161, oil: 7.7, dow: 802 },
  { year: 1976, sp500: 107, gold: 125, oil: 8.2, dow: 947 },
  { year: 1977, sp500: 98, gold: 148, oil: 9.6, dow: 875 },
  { year: 1978, sp500: 96, gold: 193, oil: 9.0, dow: 805 },
  { year: 1979, sp500: 103, gold: 307, oil: 15.9, dow: 839 },
  { year: 1980, sp500: 135, gold: 615, oil: 21.5, dow: 964 },
  { year: 1981, sp500: 122, gold: 400, oil: 31.8, dow: 899 },
  { year: 1982, sp500: 141, gold: 448, oil: 28.5, dow: 1047 },
  { year: 1983, sp500: 165, gold: 381, oil: 26.0, dow: 1259 },
  { year: 1984, sp500: 167, gold: 361, oil: 24.0, dow: 1212 },
  { year: 1985, sp500: 187, gold: 327, oil: 24.0, dow: 1328 },
  { year: 1986, sp500: 236, gold: 368, oil: 13.0, dow: 1793 },
  { year: 1987, sp500: 287, gold: 447, oil: 16.5, dow: 1938 },
  { year: 1988, sp500: 278, gold: 410, oil: 14.0, dow: 2168 },
  { year: 1989, sp500: 340, gold: 381, oil: 18.0, dow: 2509 },
  { year: 1990, sp500: 335, gold: 385, oil: 20.0, dow: 2679 },
  { year: 1991, sp500: 394, gold: 362, oil: 17.0, dow: 3169 },
  { year: 1992, sp500: 416, gold: 334, oil: 17.5, dow: 3301 },
  { year: 1993, sp500: 451, gold: 392, oil: 15.0, dow: 3754 },
  { year: 1994, sp500: 467, gold: 370, oil: 14.0, dow: 3834 },
  { year: 1995, sp500: 543, gold: 371, oil: 16.0, dow: 4527 },
  { year: 1996, sp500: 708, gold: 350, oil: 20.0, dow: 5760 },
  { year: 1997, sp500: 953, gold: 290, oil: 17.0, dow: 7908 },
  { year: 1998, sp500: 1190, gold: 282, oil: 11.0, dow: 9181 },
  { year: 1999, sp500: 1394, gold: 279, oil: 18.0, dow: 10788 },
  { year: 2000, sp500: 1469, gold: 272, oil: 22.0, dow: 10788 },
  { year: 2001, sp500: 1195, gold: 271, oil: 19.0, dow: 10022 },
];

interface MetricConfig {
  key: string;
  label: string;
  unit: string;
  color: string;
  gradientId: string;
}

const metrics: MetricConfig[] = [
  { key: 'sp500', label: 'S&P 500', unit: 'pts', color: 'var(--chart-1)', gradientId: 'grad-sp500' },
  { key: 'gold', label: 'Gold', unit: '$/oz', color: 'var(--chart-2)', gradientId: 'grad-gold' },
  { key: 'oil', label: 'Oil', unit: '$/bbl', color: 'var(--chart-3)', gradientId: 'grad-oil' },
  { key: 'dow', label: 'DJIA', unit: 'pts', color: 'var(--chart-4)', gradientId: 'grad-dow' },
];

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-border bg-popover/95 backdrop-blur-sm p-3 shadow-xl">
      <p className="text-xs font-bold text-muted-foreground mb-2">{label}</p>
      {payload.map((entry) => {
        const metric = metrics.find(m => m.key === entry.dataKey);
        return (
          <div key={entry.dataKey} className="flex items-center gap-2 text-xs">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{metric?.label ?? entry.dataKey}:</span>
            <span className="font-semibold text-foreground">
              {metric?.unit.startsWith('$') ? '$' : ''}{entry.value.toLocaleString()}{!metric?.unit.startsWith('$') && metric?.unit ? ` ${metric.unit}` : ''}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Inner implementation of the financial market chart. Imports recharts
 * eagerly so the library is bundled into this chunk (loaded on demand by
 * the lazy wrapper in `FinancialChart.tsx`).
 *
 * Exported separately from the public `FinancialChart` wrapper so callers
 * that already hold a reference to a loaded chart can render it without
 * paying the Suspense cost.
 */
export function FinancialChartInner() {
  const [urlMetric, setUrlMetric] = useURLState('metric', 'sp500');
  const [activeMetrics, setActiveMetrics] = useState<Set<string>>(new Set([urlMetric]));

  const toggleMetric = (key: string) => {
    setActiveMetrics(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size <= 1) return prev; // keep at least one active
        next.delete(key);
      } else {
        next.add(key);
      }
      setUrlMetric(key);
      return next;
    });
  };

  const chartData = useMemo(() => yearlyData, []);

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Market Overview</h2>
          <p className="text-xs text-muted-foreground">Key financial metrics across the decades</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {metrics.map(m => {
            const isActive = activeMetrics.has(m.key);
            return (
              <button
                key={m.key}
                onClick={() => toggleMetric(m.key)}
                className={`
                  px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 border cursor-pointer
                  ${isActive
                    ? 'border-border shadow-sm'
                    : 'border-transparent opacity-50 hover:opacity-75'
                  }
                `}
                style={{
                  backgroundColor: isActive ? 'color-mix(in oklch, var(--muted) 80%, transparent)' : 'transparent',
                  color: isActive ? 'var(--foreground)' : 'var(--muted-foreground)',
                  boxShadow: isActive ? `inset 0 0 0 1px color-mix(in oklch, ${m.color} 40%, transparent)` : undefined,
                }}
              >
                <span
                  className="inline-block w-2 h-2 rounded-full mr-1.5"
                  style={{ backgroundColor: m.color }}
                />
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card/50 p-4" style={{ height: 380 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              {metrics.map(m => (
                <linearGradient key={m.gradientId} id={m.gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={m.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={m.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              strokeOpacity={0.4}
            />
            <XAxis
              dataKey="year"
              tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={{ stroke: 'var(--border)' }}
            />
            <YAxis
              tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={{ stroke: 'var(--border)' }}
              tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)}
            />
            <Tooltip content={<CustomTooltip />} />
            {metrics.map(m => (
              <Area
                key={m.key}
                type="monotone"
                dataKey={m.key}
                stroke={m.color}
                strokeWidth={2}
                fill={`url(#${m.gradientId})`}
                hide={!activeMetrics.has(m.key)}
                animationDuration={800}
                animationEasing="ease-out"
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
