import { describe, it, expect } from 'vitest';
import { searchAll } from './search';

describe('searchAll', () => {
  it('returns empty array when search query is empty', () => {
    expect(searchAll('')).toEqual([]);
    expect(searchAll('   ')).toEqual([]);
  });

  it('matches sports queries case-insensitively', () => {
    const results = searchAll('SECRETARIAT');
    expect(results.length).toBeGreaterThan(0);
    expect(results.every(r => r.module === 'Sports')).toBe(true);
    expect(
      results[0].title.toLowerCase().includes('secretariat') ||
      results[0].subtitle.toLowerCase().includes('secretariat') ||
      results[0].description.toLowerCase().includes('secretariat')
    ).toBe(true);
  });

  it('matches financial events like Apple IPO', () => {
    const results = searchAll('apple');
    expect(results.length).toBeGreaterThan(0);
    const financeResults = results.filter(r => r.module === 'Finance');
    expect(financeResults.length).toBeGreaterThan(0);
    expect(financeResults[0].title).toContain('Apple');
  });

  it('matches disaster queries', () => {
    const results = searchAll('chernobyl');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].module).toBe('Disasters');
    expect(results[0].title).toContain('Chernobyl');
  });

  it('limits results to a max of 20 elements', () => {
    // Search for a very common character like 'a' to get many hits
    const results = searchAll('a');
    expect(results.length).toBeLessThanOrEqual(20);
  });
});
