import { describe, it, expect } from 'vitest';
import { formatPreferences, athenaPreferences, type AthenaPreference } from './athena-preferences';

describe('formatPreferences', () => {
  it('returns placeholder text for empty array', () => {
    expect(formatPreferences([])).toBe('No specific notes or memories yet.');
  });

  it('renders single preference under its category', () => {
    const prefs: AthenaPreference[] = [
      { category: 'history', statement: 'X' },
    ];
    const result = formatPreferences(prefs);
    expect(result).toContain('### HISTORY');
    expect(result).toContain('- X');
  });

  it('sorts categories alphabetically', () => {
    const prefs: AthenaPreference[] = [
      { category: 'sports', statement: 'A' },
      { category: 'history', statement: 'B' },
      { category: 'crafts', statement: 'C' },
    ];
    const result = formatPreferences(prefs);
    const historyIdx = result.indexOf('### HISTORY');
    const sportsIdx = result.indexOf('### SPORTS');
    const craftsIdx = result.indexOf('### CRAFTS');
    expect(craftsIdx).toBeGreaterThan(-1);
    expect(craftsIdx).toBeLessThan(historyIdx);
    expect(historyIdx).toBeLessThan(sportsIdx);
  });

  it('appends "(held loosely)" for confidence below 0.7', () => {
    const prefs: AthenaPreference[] = [
      { category: 'history', statement: 'X', confidence: 0.5 },
    ];
    expect(formatPreferences(prefs)).toContain('- X (held loosely)');
  });

  it('appends "(strongly held)" for confidence above 0.95', () => {
    const prefs: AthenaPreference[] = [
      { category: 'history', statement: 'X', confidence: 0.99 },
    ];
    expect(formatPreferences(prefs)).toContain('- X (strongly held)');
  });

  it('omits confidence marker for values inside (0.7, 0.95]', () => {
    const prefs: AthenaPreference[] = [
      { category: 'history', statement: 'X', confidence: 0.85 },
    ];
    const result = formatPreferences(prefs);
    expect(result).not.toContain('held loosely');
    expect(result).not.toContain('strongly held');
    expect(result).toContain('- X');
  });

  it('omits confidence marker when confidence is undefined (treated as 1.0)', () => {
    const prefs: AthenaPreference[] = [
      { category: 'history', statement: 'X' },
    ];
    const result = formatPreferences(prefs);
    expect(result).not.toContain('held loosely');
    expect(result).not.toContain('strongly held');
    expect(result).toContain('- X');
  });

  it('appends [When: ...] tag when context is set', () => {
    const prefs: AthenaPreference[] = [
      { category: 'history', statement: 'X', context: 'discussing Y' },
    ];
    expect(formatPreferences(prefs)).toContain('- X [When: discussing Y]');
  });

  it('places confidence marker before context tag when both are set', () => {
    const prefs: AthenaPreference[] = [
      { category: 'history', statement: 'X', confidence: 0.99, context: 'discussing Y' },
    ];
    expect(formatPreferences(prefs)).toContain('- X (strongly held) [When: discussing Y]');
  });

  it('preserves insertion order within a category', () => {
    const prefs: AthenaPreference[] = [
      { category: 'history', statement: 'A' },
      { category: 'history', statement: 'B' },
      { category: 'history', statement: 'C' },
    ];
    const result = formatPreferences(prefs);
    const aIdx = result.indexOf('- A');
    const bIdx = result.indexOf('- B');
    const cIdx = result.indexOf('- C');
    expect(aIdx).toBeGreaterThan(-1);
    expect(aIdx).toBeLessThan(bIdx);
    expect(bIdx).toBeLessThan(cIdx);
  });
});

describe('athenaPreferences content coverage', () => {
  it('references the new world-events content area', () => {
    const categories = athenaPreferences.map((p) => p.category);
    expect(categories).toContain('world-events');
  });

  it('references the new places-to-live content area', () => {
    const categories = athenaPreferences.map((p) => p.category);
    expect(categories).toContain('places-to-live');
  });

  it('references the new places-to-visit content area', () => {
    const categories = athenaPreferences.map((p) => p.category);
    expect(categories).toContain('places-to-visit');
  });

  it('formats the full athenaPreferences array without throwing', () => {
    expect(() => formatPreferences(athenaPreferences)).not.toThrow();
    const formatted = formatPreferences(athenaPreferences);
    expect(formatted).toContain('### WORLD-EVENTS');
    expect(formatted).toContain('### PLACES-TO-LIVE');
    expect(formatted).toContain('### PLACES-TO-VISIT');
  });
});
