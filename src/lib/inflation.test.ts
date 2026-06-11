import { describe, it, expect } from 'vitest';
import { calculateInflation } from './inflation';

describe('calculateInflation', () => {
  it('correctly calculates inflation between years in the CPI range', () => {
    // 1970 CPI is 38.8, 1980 CPI is 82.4
    // 100 * (82.4 / 38.8) = 212.371134...
    const result = calculateInflation(100, 1970, 1980);
    expect(result).toBeCloseTo(212.37, 2);
  });

  it('handles reverse inflation calculations', () => {
    // 1980 to 1970
    // 100 * (38.8 / 82.4) = 47.087378...
    const result = calculateInflation(100, 1980, 1970);
    expect(result).toBeCloseTo(47.09, 2);
  });

  it('handles same year calculations', () => {
    const result = calculateInflation(100, 1985, 1985);
    expect(result).toBe(100);
  });

  it('extrapolates prior to 1970', () => {
    // 1969 is 1 year before 1970.
    // CPI for 1969 should be 38.8 / 1.035 = 37.48792
    // 1970 to 1969 for $100 -> 100 * (37.48792 / 38.8) = 96.618...
    const result = calculateInflation(100, 1970, 1969);
    expect(result).toBeCloseTo(96.62, 2);
  });

  it('extrapolates after 2001', () => {
    // 2002 is 1 year after 2001.
    // CPI for 2002 should be 177.1 * 1.035 = 183.2985
    // 2001 to 2002 for $100 -> 100 * (183.2985 / 177.1) = 103.5
    const result = calculateInflation(100, 2001, 2002);
    expect(result).toBeCloseTo(103.50, 2);
  });
});
