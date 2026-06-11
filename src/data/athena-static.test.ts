import { describe, it, expect } from 'vitest';
import athenaStatic from './athena-static.json';

const REQUIRED_DATA_PAGES = [
  'wars-vietnam',
  'disasters-1906-sf',
  'inventions-lithography',
  'sports-1982-superbowl',
  'sports-1986-worldcup',
  'philosophy-bodhisattva',
  'engineering-watermill',
  'crafts-eyeglasses',
];

const TIERS = [1, 2, 3] as const;
const BRACKETS = ['low', 'mid', 'high'] as const;

describe('athena-static.json', () => {
  it('has a mnemonic for every data page', () => {
    for (const page of REQUIRED_DATA_PAGES) {
      const m = (athenaStatic.mnemonics as Record<string, string>)[page];
      expect(m, `missing mnemonic for ${page}`).toBeTruthy();
      expect(m.length, `mnemonic for ${page} too short`).toBeGreaterThan(0);
      expect(m.length, `mnemonic for ${page} too long`).toBeLessThanOrEqual(200);
    }
  });

  it('has a generic fallback for every (tier, bracket)', () => {
    for (const tier of TIERS) {
      for (const bracket of BRACKETS) {
        const key = `${tier}:${bracket}:generic`;
        const r = (athenaStatic.quizReactions as Record<string, string>)[key];
        expect(r, `missing generic fallback for ${key}`).toBeTruthy();
        expect(r.length, `generic reaction ${key} too long`).toBeGreaterThan(0);
        expect(r.length, `generic reaction ${key} too long`).toBeLessThanOrEqual(280);
      }
    }
  });

  it('has a quiz reaction for every (tier, bracket, topic) combination', () => {
    const reactions = athenaStatic.quizReactions as Record<string, string>;
    const topics = new Set<string>();
    for (const key of Object.keys(reactions)) {
      const parts = key.split(':');
      if (parts.length === 3 && parts[0] !== 'generic' && parts[2] !== 'generic') {
        topics.add(parts[2]);
      }
    }
    expect(topics.size, 'no topics found in reactions bank').toBeGreaterThan(0);

    for (const tier of TIERS) {
      for (const bracket of BRACKETS) {
        for (const topic of topics) {
          const key = `${tier}:${bracket}:${topic}`;
          expect(reactions[key], `missing reaction for ${key}`).toBeTruthy();
          expect(reactions[key].length, `reaction ${key} too long`).toBeGreaterThan(0);
          expect(reactions[key].length, `reaction ${key} too long`).toBeLessThanOrEqual(280);
        }
      }
    }
  });
});
