import { lazy, Suspense } from 'react';
import { ChartSkeleton } from './ChartSkeleton';
import type { RiskVisualizationProps } from './RiskVisualizationInner';

/**
 * Public RiskVisualization component.
 *
 * Thin lazy-loading wrapper around {@link RiskVisualizationInner}. The
 * recharts-dependent implementation lives in the inner module so the
 * recharts vendor chunk is only fetched when this component actually
 * renders (e.g. after the user has picked all four risk factors on the
 * Butterfly Calculator) rather than being eagerly bundled into the host
 * page chunk.
 */
const RiskVisualizationInner = lazy(() =>
  import('./RiskVisualizationInner').then(m => ({ default: m.RiskVisualizationInner })),
);

export type { RiskVisualizationProps } from './RiskVisualizationInner';

export function RiskVisualization(props: RiskVisualizationProps) {
  return (
    <Suspense
      fallback={
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartSkeleton height={280} label="Loading risk bar chart" />
          <ChartSkeleton height={280} label="Loading risk radar chart" />
        </div>
      }
    >
      <RiskVisualizationInner {...props} />
    </Suspense>
  );
}
