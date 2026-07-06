import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { RiskBadge, ScoreRiskBadge } from './RiskBadge';
import { riskBadgeClasses, riskHex, riskLevelFromScore, hexFromScore, riskBadgeForConfidence } from '@/lib/risk-colors';

afterEach(() => cleanup());

describe('RiskBadge', () => {
  it('renders the risk level text with a colored emoji prefix', () => {
    render(<RiskBadge level="High" />);
    expect(screen.getByText('🟠')).toBeTruthy();
    expect(screen.getByText('High')).toBeTruthy();
  });

  it('uses the correct color classes for each risk level', () => {
    const { rerender } = render(<RiskBadge level="Low" />);
    let span = screen.getByText('Low').closest('span')!;
    expect(span.className).toContain(riskBadgeClasses.Low);

    rerender(<RiskBadge level="Medium" />);
    span = screen.getByText('Medium').closest('span')!;
    expect(span.className).toContain(riskBadgeClasses.Medium);

    rerender(<RiskBadge level="High" />);
    span = screen.getByText('High').closest('span')!;
    expect(span.className).toContain(riskBadgeClasses.High);

    rerender(<RiskBadge level="Extreme" />);
    span = screen.getByText('Extreme').closest('span')!;
    expect(span.className).toContain(riskBadgeClasses.Extreme);
  });

  it('maps confidence-level strings to risk levels', () => {
    const { unmount: u1 } = render(<RiskBadge level="low" />);
    expect(screen.getByText('Low')).toBeTruthy();
    u1();
    const { unmount: u2 } = render(<RiskBadge level="medium" />);
    expect(screen.getByText('Medium')).toBeTruthy();
    u2();
    const { unmount: u3 } = render(<RiskBadge level="high" />);
    expect(screen.getByText('High')).toBeTruthy();
    u3();
    const { unmount: u4 } = render(<RiskBadge level="estimated" />);
    // estimated falls back to Low in the badge system
    expect(screen.getByText('Low')).toBeTruthy();
    u4();
  });

  it('falls back to Medium for unknown level values', () => {
    render(<RiskBadge level="SomethingWeird" />);
    expect(screen.getByText('Medium')).toBeTruthy();
  });

  it('hides the icon when showIcon is false', () => {
    render(<RiskBadge level="High" showIcon={false} />);
    expect(screen.queryByText('🟠')).toBeNull();
    expect(screen.getByText('High')).toBeTruthy();
  });

  it('uses sm size when specified', () => {
    const { rerender } = render(<RiskBadge level="Low" size="md" />);
    let span = screen.getByText('Low').closest('span')!;
    expect(span.className).toContain('px-2 py-0.5');
    expect(span.className).toContain('text-xs');

    rerender(<RiskBadge level="Low" size="sm" />);
    span = screen.getByText('Low').closest('span')!;
    expect(span.className).toContain('px-1.5 py-0.5');
    expect(span.className).toContain('text-[10px]');
  });

  it('appends extra className', () => {
    render(<RiskBadge level="High" className="border" />);
    const span = screen.getByText('High').closest('span')!;
    expect(span.className).toContain('border');
  });

  it('uses custom title for tooltip', () => {
    render(<RiskBadge level="High" title="Custom tooltip" />);
    const span = screen.getByText('High').closest('span')!;
    expect(span.getAttribute('title')).toBe('Custom tooltip');
  });

  it('uses default tooltip from RISK_LABELS when title is omitted', () => {
    render(<RiskBadge level="Extreme" />);
    const span = screen.getByText('Extreme').closest('span')!;
    expect(span.getAttribute('title')).toBe('Cascading effects nearly certain');
  });
});

describe('ScoreRiskBadge', () => {
  it('maps numeric score to risk level', () => {
    const { rerender } = render(<ScoreRiskBadge score={1} />);
    expect(screen.getByText('Low')).toBeTruthy();
    rerender(<ScoreRiskBadge score={3} />);
    expect(screen.getByText('Medium')).toBeTruthy();
    rerender(<ScoreRiskBadge score={4} />);
    expect(screen.getByText('High')).toBeTruthy();
    rerender(<ScoreRiskBadge score={5} />);
    expect(screen.getByText('Extreme')).toBeTruthy();
  });
});

describe('risk-colors module', () => {
  it('riskLevelFromScore maps correctly', () => {
    expect(riskLevelFromScore(1)).toBe('Low');
    expect(riskLevelFromScore(2)).toBe('Low');
    expect(riskLevelFromScore(3)).toBe('Medium');
    expect(riskLevelFromScore(4)).toBe('High');
    expect(riskLevelFromScore(5)).toBe('Extreme');
  });

  it('hexFromScore returns matching hex for level', () => {
    expect(hexFromScore(1)).toBe(riskHex.Low);
    expect(hexFromScore(3)).toBe(riskHex.Medium);
    expect(hexFromScore(4)).toBe(riskHex.High);
    expect(hexFromScore(5)).toBe(riskHex.Extreme);
  });

  it('riskBadgeForConfidence maps all confidence levels', () => {
    expect(riskBadgeForConfidence('low')).toContain('emerald');
    expect(riskBadgeForConfidence('medium')).toContain('amber');
    expect(riskBadgeForConfidence('high')).toContain('orange');
    expect(riskBadgeForConfidence('estimated')).toContain('neutral');
  });
});
