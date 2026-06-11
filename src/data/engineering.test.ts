import { describe, it, expect } from 'vitest';
import { engineeringData } from './engineering.js';

describe('engineering data integrity', () => {
  it('every entry has tags', () => {
    for (const entry of engineeringData) {
      expect(entry.tags).toBeDefined();
      expect(entry.tags!.length).toBeGreaterThan(0);
    }
  });

  it('tags include subDomain keywords', () => {
    for (const entry of engineeringData) {
      if (entry.subDomain === 'cnc_machining') {
        expect(entry.tags!.join(',')).toContain('cnc');
      }
    }
  });
});
