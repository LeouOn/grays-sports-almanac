import { describe, it, expect } from 'vitest';
import { generateChatQuestion } from './ChatAboutThis';

describe('generateChatQuestion', () => {
  it('generates sports question', () => {
    const q = generateChatQuestion('sports', { event: 'Super Bowl IV', year: 1970 });
    expect(q).toContain('Super Bowl IV');
    expect(q).toContain('1970');
  });

  it('generates disasters question', () => {
    const q = generateChatQuestion('disasters', { event: 'Tenerife Airport Disaster' });
    expect(q).toContain('Tenerife');
    expect(q).toContain('prevented');
  });

  it('generates era-guide question', () => {
    const q = generateChatQuestion('era-guide', { item: 'Gasoline (per gallon)', era: '1970s' });
    expect(q).toContain('Gasoline');
    expect(q).toContain('1970s');
  });

  it('falls back for unknown module', () => {
    const q = generateChatQuestion('unknown', { title: 'Something' });
    expect(q).toContain('Something');
  });
});
