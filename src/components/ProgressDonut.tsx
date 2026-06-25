import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

/**
 * Props for the {@link ProgressDonut} chart.
 */
export interface ProgressDonutProps {
  /** Overall completion percentage (0-100). Drives the filled arc length. */
  percentage: number;
  /** Hex color for the completed arc. Defaults to the indigo accent. */
  accentColor?: string;
  /** Hex color for the remaining arc track. */
  trackColor?: string;
}

/**
 * Circular progress donut rendered with recharts. Lives in its own module
 * so recharts is dynamically imported only when the Progress page (which
 * is itself lazy-loaded) actually renders this header chart.
 */
export function ProgressDonut({
  percentage,
  accentColor = '#818cf8',
  trackColor = '#292524',
}: ProgressDonutProps) {
  const data = [
    { name: 'Complete', value: percentage },
    { name: 'Remaining', value: 100 - percentage },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          innerRadius={38}
          outerRadius={52}
          startAngle={90}
          endAngle={-270}
          strokeWidth={0}
        >
          <Cell fill={accentColor} />
          <Cell fill={trackColor} />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
