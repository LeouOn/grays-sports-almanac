import { describe, it, expect } from 'vitest';
import { blueprintsData } from '../data/blueprints';
import { searchAll } from './search';

describe('Bootstrap Blueprints Data & Search', () => {
  it('contains all 4 expected engineering blueprints', () => {
    expect(blueprintsData.length).toBe(4);

    const ids = blueprintsData.map(b => b.id);
    expect(ids).toContain('czochralski-silicon');
    expect(ids).toContain('optical-photolithography');
    expect(ids).toContain('precision-ball-screw');
    expect(ids).toContain('silicon-planar-process');
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
    expect(results[0].module).toBe('Blueprints');
    expect(results[0].title).toBe('Silicon Crystal Pulling (Czochralski Method)');
    expect(results[0].link).toBe('/blueprints');
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
