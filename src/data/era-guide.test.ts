import { describe, it, expect } from 'vitest';
import { eraGuideData } from './era-guide.js';

describe('era-guide data integrity', () => {
  it('every entry has a unique id', () => {
    const ids = eraGuideData.map(e => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('ids follow era-guide pattern', () => {
    for (const entry of eraGuideData) {
      expect(entry.id).toMatch(/^era-guide-/);
    }
  });

  it('no empty ids', () => {
    for (const entry of eraGuideData) {
      expect(entry.id!.length).toBeGreaterThan(10);
    }
  });
});
