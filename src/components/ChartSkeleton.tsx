/**
 * Loading placeholder shown inside chart Suspense boundaries while the
 * lazy-loaded chart module (and its recharts dependency) is being fetched.
 *
 * `aria-busy` / `role="status"` / `aria-label` expose the loading state to
 * assistive tech so screen-reader users are not left with silent gaps.
 */
interface ChartSkeletonProps {
  /** Pixel height of the placeholder box. Defaults to 280 to match the
   *  height of most charts in the app. */
  height?: number;
  /** Accessible label describing what is loading. */
  label?: string;
  /** Optional className passthrough for layout-specific overrides. */
  className?: string;
}

export function ChartSkeleton({
  height = 280,
  label = 'Loading chart',
  className,
}: ChartSkeletonProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={label}
      className={`rounded-lg border border-border bg-card/50 p-4 animate-pulse ${className ?? ''}`}
      style={{ height }}
    >
      <div className="h-full w-full rounded-md bg-muted/40" />
    </div>
  );
}
