/**
 * Web Vitals reporter (added in T14 / P3).
 *
 * This module is OPTIONAL plumbing for future use (P6 perf verification).
 * It is tree-shaken out of the production bundle unless something calls
 * `captureVitals()` — verified by the P3 baseline, which does not yet
 * reference this module from the app entry.
 *
 * The numbers it reports are RUNTIME metrics (requires a real browser):
 *   CLS, FCP, INP, LCP, TTFB.
 *
 * To wire it up later, import it lazily from the app entry:
 *
 *   if (import.meta.env.PROD) {
 *     void import("./lib/web-vitals").then((m) => m.captureVitals());
 *   }
 *
 * Or, for a one-off measurement in `pnpm preview`, paste this snippet into
 * the browser console after loading the app.
 */

export interface VitalMetric {
  name: "CLS" | "FCP" | "INP" | "LCP" | "TTFB";
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  id: string;
  navigationType: string;
}

export type VitalReporter = (metric: VitalMetric) => void;

const DEFAULT_REPORTER: VitalReporter = (metric) => {
   
  console.info(
    `[web-vitals] ${metric.name}=${metric.value.toFixed(2)} (${metric.rating})`,
  );
};

/**
 * Capture Core Web Vitals once the module is imported in a browser context.
 *
 * Resolves once all reporters have been registered (not once metrics arrive —
 * metrics arrive at browser-determined times throughout the page lifecycle).
 *
 * Returns the reporters so callers can unsubscribe / forward later.
 */
export async function captureVitals(
  reporter: VitalReporter = DEFAULT_REPORTER,
): Promise<{
  cls: () => void;
  fcp: () => void;
  inp: () => void;
  lcp: () => void;
  ttfb: () => void;
}> {
  if (typeof window === "undefined") {
    // SSR / Node context: nothing to measure. Return no-ops so callers don't
    // have to guard.
    const noop = () => {};
    return { cls: noop, fcp: noop, inp: noop, lcp: noop, ttfb: noop };
  }

  const { onCLS, onFCP, onINP, onLCP, onTTFB } = await import("web-vitals");

  onCLS(reporter);
  onFCP(reporter);
  onINP(reporter);
  onLCP(reporter);
  onTTFB(reporter);

  return {
    cls: () => onCLS(reporter, { reportAllChanges: true }),
    fcp: () => onFCP(reporter),
    inp: () => onINP(reporter),
    lcp: () => onLCP(reporter),
    ttfb: () => onTTFB(reporter),
  };
}
