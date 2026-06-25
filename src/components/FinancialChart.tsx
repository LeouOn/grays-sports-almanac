import { lazy, Suspense } from 'react';
import { ChartSkeleton } from './ChartSkeleton';

/**
 * Public FinancialChart component.
 *
 * This is a thin lazy-loading wrapper around {@link FinancialChartInner},
 * which contains the actual recharts usage. Splitting the chart into its
 * own dynamic import means recharts (the large `CategoricalChart` vendor
 * chunk) is only fetched when a route renders this component, rather than
 * being eagerly pulled into the page chunk that hosts it. While the
 * chart module loads, callers see an accessible loading placeholder.
 */
const FinancialChartInner = lazy(() =>
  import('./FinancialChartInner').then(m => ({ default: m.FinancialChartInner })),
);

export function FinancialChart() {
  return (
    <Suspense fallback={<ChartSkeleton height={420} label="Loading market chart" />}>
      <FinancialChartInner />
    </Suspense>
  );
}
