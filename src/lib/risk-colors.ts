/**
 * Shared risk-level color system.
 *
 * Centralises the color tokens used by every risk badge in the app so that
 * Low / Medium / High / Extreme look identical across:
 *   - DisasterPrevention
 *   - MedicalInterventions
 *   - TechTransfer
 *   - Engineering (confidence levels)
 *   - RiskVisualizationInner (numeric score → level)
 *
 * All tokens are Tailwind class strings so the styling is consistent with the
 * rest of the app (dark theme, no hardcoded hex values).
 *
 * Use via:
 *   import { riskBadgeClasses, riskLevel, RISK_LABELS } from '@/lib/risk-colors';
 *   const cls = riskBadgeClasses('High');
 */

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Extreme';
export type ConfidenceLevel = 'low' | 'medium' | 'high' | 'estimated';

/** Badge classes for the 4 risk levels (background + text + border). */
export const riskBadgeClasses: Record<RiskLevel, string> = {
  Low:      'bg-emerald-950/40 text-emerald-400 border-emerald-900/60',
  Medium:   'bg-amber-950/40  text-amber-400  border-amber-900/60',
  High:     'bg-orange-950/50 text-orange-400 border-orange-900/60',
  Extreme:  'bg-red-950/60    text-red-400    border-red-900/60',
};

/** Solid-fill button/badge variants for when we need a stronger visual hit. */
export const riskBadgeSolid: Record<RiskLevel, string> = {
  Low:      'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  Medium:   'bg-amber-500/15  text-amber-300  border-amber-500/30',
  High:     'bg-orange-500/20 text-orange-300 border-orange-500/30',
  Extreme:  'bg-red-500/20    text-red-300    border-red-500/30',
};

/** Text-color-only classes (for inline text without a badge background). */
export const riskTextClass: Record<RiskLevel, string> = {
  Low:      'text-emerald-400',
  Medium:   'text-amber-400',
  High:     'text-orange-400',
  Extreme:  'text-red-400',
};

/** Friendly labels with a small icon for tooltips and detail panels. */
export const RISK_LABELS: Record<RiskLevel, { name: string; hint: string; emoji: string }> = {
  Low:     { name: 'Low Risk',     hint: 'Minimal timeline disruption',         emoji: '🟢' },
  Medium:  { name: 'Medium Risk',  hint: 'Proceed with care',                   emoji: '🟡' },
  High:    { name: 'High Risk',    hint: 'Significant ripple effects likely',    emoji: '🟠' },
  Extreme: { name: 'Extreme Risk', hint: 'Cascading effects nearly certain',     emoji: '🔴' },
};

/** Map a numeric score (1-5) to a RiskLevel. Used by RiskVisualizationInner. */
export function riskLevelFromScore(score: number): RiskLevel {
  if (score <= 1) return 'Low';
  if (score === 2) return 'Low';
  if (score === 3) return 'Medium';
  if (score === 4) return 'High';
  return 'Extreme';
}

/**
 * Raw hex values for chart libraries (recharts) that need stroke/fill strings
 * rather than CSS classes. Kept in sync with the Tailwind tokens above:
 *   emerald-500 = #10b981
 *   yellow-500  = #eab308
 *   orange-500  = #f97316
 *   red-500     = #ef4444
 */
export const riskHex: Record<RiskLevel, string> = {
  Low:      '#10b981',
  Medium:   '#eab308',
  High:     '#f97316',
  Extreme:  '#ef4444',
};

/** Map a numeric score (1-5) to a hex color (for recharts). */
export function hexFromScore(score: number): string {
  return riskHex[riskLevelFromScore(score)];
}

/** Map a confidence level to the same badge classes. */
export function riskBadgeForConfidence(c: ConfidenceLevel): string {
  switch (c) {
    case 'low':       return riskBadgeClasses.Low;
    case 'medium':    return riskBadgeClasses.Medium;
    case 'high':      return riskBadgeClasses.High;
    case 'estimated': return 'bg-neutral-900/60 text-neutral-400 border-neutral-800';
  }
}
