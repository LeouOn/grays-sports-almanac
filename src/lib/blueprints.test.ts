import { describe, it, expect } from 'vitest';
import { blueprintsData } from '../data/blueprints';
import { searchAll } from './search';

describe('Bootstrap Blueprints Data & Search', () => {
  it('contains all 8 expected engineering blueprints', () => {
    expect(blueprintsData.length).toBe(8);

    const ids = blueprintsData.map(b => b.id);
    expect(ids).toContain('czochralski-silicon');
    expect(ids).toContain('optical-photolithography');
    expect(ids).toContain('precision-ball-screw');
    expect(ids).toContain('silicon-planar-process');
    // Wave 3 expansion: pre-1900 bootstrap tech for the 1970-2001 traveler.
    expect(ids).toContain('electromagnetic-telegraph');
    expect(ids).toContain('daguerreotype-process');
    expect(ids).toContain('monier-reinforced-concrete');
    expect(ids).toContain('benz-internal-combustion-engine');
  });

  it('verifies semiconductor blueprint details are correct', () => {
    const cz = blueprintsData.find(b => b.id === 'czochralski-silicon');
    expect(cz).toBeDefined();
    expect(cz?.category).toBe('Semiconductors');
    expect(cz?.difficulty).toBe('Advanced');
    expect(cz?.tolerances).toContain('1420°C');
    expect(cz?.stepByStepGuide).toContain('Necking');
  });

  it('integrates successfully with the search utility for titles', async () => {
    const results = await searchAll('Czochralski');
    expect(results.length).toBeGreaterThan(0);
    // Czochralski may also appear in Tech/Engineering modules, so find the
    // Blueprints result specifically rather than assuming it's first.
    const blueprintResult = results.find(r => r.module === 'Blueprints');
    expect(blueprintResult).toBeDefined();
    expect(blueprintResult!.title).toBe('Silicon Crystal Pulling (Czochralski Method)');
    expect(blueprintResult!.link).toBe('/blueprints');
  });

  it('finds blueprints via related keywords or principles', async () => {
    // Search for "backlash" which is in precision ball screws
    const results = await searchAll('backlash');
    expect(results.length).toBeGreaterThan(0);
    const blueprintMatches = results.filter(r => r.module === 'Blueprints');
    expect(blueprintMatches.length).toBeGreaterThan(0);
    expect(blueprintMatches[0].title).toContain('Precision Ball Screws');

    // Search for "TMAH" which is in photolithography developer materials
    const tmahResults = await searchAll('tmah');
    expect(tmahResults.length).toBeGreaterThan(0);
    expect(tmahResults[0].title).toContain('Photolithography');
  });
});
