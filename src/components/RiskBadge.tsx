import { riskBadgeClasses, riskLevelFromScore, RISK_LABELS, type RiskLevel, type ConfidenceLevel } from '@/lib/risk-colors';

interface RiskBadgeProps {
  /** Risk level name (e.g. from the data model). */
  level: RiskLevel | ConfidenceLevel | string;
  /** Show an icon/emoji prefix. Default: true */
  showIcon?: boolean;
  /** Smaller size for dense card layouts */
  size?: 'sm' | 'md';
  /** Extra className appended to the badge */
  className?: string;
  /** Title attribute (hover tooltip) */
  title?: string;
  /** Override the auto-detected risk level (e.g. for numeric score → level) */
  asLevel?: RiskLevel;
}

/** Compact, color-coded risk indicator used across the app. */
export function RiskBadge({
  level,
  showIcon = true,
  size = 'md',
  className = '',
  title,
  asLevel,
}: RiskBadgeProps) {
  // Detect the level: explicit override > confidence string > known risk string
  let resolved: RiskLevel;
  if (asLevel) {
    resolved = asLevel;
  } else if (level === 'low' || level === 'medium' || level === 'high' || level === 'estimated') {
    resolved = level === 'estimated' ? 'Low' : level === 'low' ? 'Low' : level === 'medium' ? 'Medium' : 'High';
  } else if (level === 'Low' || level === 'Medium' || level === 'High' || level === 'Extreme') {
    resolved = level;
  } else {
    resolved = 'Medium';
  }
  const classes = riskBadgeClasses[resolved];
  const label = RISK_LABELS[resolved];
  const padding = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border font-semibold whitespace-nowrap ${padding} ${classes} ${className}`}
      title={title ?? label.hint}
    >
      {showIcon && <span aria-hidden="true">{label.emoji}</span>}
      {resolved}
    </span>
  );
}

/** Helper: convert a numeric score (1-5) to a RiskBadge. */
export function ScoreRiskBadge({ score, className = '' }: { score: number; className?: string }) {
  return <RiskBadge level="" asLevel={riskLevelFromScore(score)} className={className} />;
}
