import { describe, it, expect } from 'vitest';
import { searchAll } from './search';

describe('searchAll', () => {
  it('returns empty array when search query is empty', async () => {
    expect(await searchAll('')).toEqual([]);
    expect(await searchAll('   ')).toEqual([]);
  });

  it('matches sports queries case-insensitively', async () => {
    const results = await searchAll('SECRETARIAT');
    expect(results.length).toBeGreaterThan(0);
    expect(results.every(r => r.module === 'Sports')).toBe(true);
    expect(
      results[0].title.toLowerCase().includes('secretariat') ||
      results[0].subtitle.toLowerCase().includes('secretariat') ||
      results[0].description.toLowerCase().includes('secretariat')
    ).toBe(true);
  });

  it('matches financial events like Apple IPO', async () => {
    const results = await searchAll('apple');
    expect(results.length).toBeGreaterThan(0);
    const financeResults = results.filter(r => r.module === 'Finance');
    expect(financeResults.length).toBeGreaterThan(0);
    expect(financeResults[0].title).toContain('Apple');
  });

  it('matches disaster queries', async () => {
    const results = await searchAll('chernobyl');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].module).toBe('Disasters');
    expect(results[0].title).toContain('Chernobyl');
  });

  it('limits results to a max of 20 elements', async () => {
    // Search for a very common character like 'a' to get many hits
    const results = await searchAll('a');
    expect(results.length).toBeLessThanOrEqual(20);
  });
});

// ---------------------------------------------------------------------------
// World Events search behavior (group 9 of searchAll).
//
// NOTE: There is no standalone `searchWorldEvents` export — the world-events
// search logic lives inside `searchAll` (src/lib/search.ts, "9. World Events"
// block). These tests exercise that behavior through the public `searchAll`
// API, filtering results by `module === 'World Events'`.
// ---------------------------------------------------------------------------
describe('searchAll — World Events results', () => {
  // Helper: run a query and return only the World Events results.
  const worldEvents = (q: string) =>
    searchAll(q).then(rs => rs.filter(r => r.module === 'World Events'));

  it('matches World Events by event text', async () => {
    const results = await worldEvents('watergate');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title.toLowerCase()).toContain('watergate');
    expect(results[0].link).toBe('/world-events');
  });

  it('surfaces the region in the result subtitle', async () => {
    // "Solidarity" (Poland) is a unique World Events entry in Europe.
    const results = await worldEvents('solidarity');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].subtitle).toContain('Europe');
    expect(results[0].subtitle).toContain('Poland');
  });

  it('surfaces the category in the result subtitle', async () => {
    // Soweto uprising is categorized as Social.
    const results = await worldEvents('soweto');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].subtitle).toContain('Social');
  });

  it('includes the year in both the title and the year field', async () => {
    const results = await worldEvents('watergate');
    expect(results.length).toBeGreaterThan(0);
    // Watergate entry is dated 1973.
    expect(results[0].title).toContain('(1973)');
    expect(results[0].year).toBe(1973);
  });

  it('matches World Events by country', async () => {
    // "rwanda" appears only in the World Events genocide entry.
    const results = await worldEvents('rwanda');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].subtitle).toContain('Rwanda');
  });

  it('matches World Events via tags', async () => {
    // The Pentagon Papers entry has the tag "whistleblower".
    const results = await worldEvents('whistleblower');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title.toLowerCase()).toContain('pentagon papers');
  });
});

// ---------------------------------------------------------------------------
// Places to Live search behavior (group 10 of searchAll).
// ---------------------------------------------------------------------------
describe('searchAll — Places to Live results', () => {
  const placesToLive = (q: string) =>
    searchAll(q).then(rs => rs.filter(r => r.module === 'Places to Live'));

  it('matches Places to Live by city', async () => {
    // Bangalore appears in 3 decades; the term is unique to this dataset.
    const results = await placesToLive('bangalore');
    expect(results.length).toBeGreaterThanOrEqual(3);
    expect(results[0].link).toBe('/places-to-live');
  });

  it('matches Places to Live by country', async () => {
    const results = await placesToLive('ireland');
    expect(results.length).toBeGreaterThan(0);
    // Dublin entries live under country "Ireland".
    results.forEach(r => expect(r.title).toContain('Ireland'));
  });

  it('includes the decade in the result title', async () => {
    // Tehran only has a 1970s entry.
    const results = await placesToLive('tehran');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toContain('(1970s)');
  });

  it('surfaces the political-stability rating in the subtitle', async () => {
    const results = await placesToLive('tehran');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].subtitle).toContain('Stability: Turbulent');
  });

  it('matches Places to Live via the bestFor field', async () => {
    // "Digital nomads" is in Tallinn (2000s) bestFor and is unique.
    const results = await placesToLive('digital nomads');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toContain('Tallinn');
  });

  it('matches Places to Live via tags', async () => {
    // Prague (1990s) has the tag "post-communist".
    const results = await placesToLive('post-communist');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toContain('Prague');
  });
});

// ---------------------------------------------------------------------------
// Places to Visit search behavior (group 11 of searchAll).
// ---------------------------------------------------------------------------
describe('searchAll — Places to Visit results', () => {
  const placesToVisit = (q: string) =>
    searchAll(q).then(rs => rs.filter(r => r.module === 'Places to Visit'));

  it('matches Places to Visit by name', async () => {
    const results = await placesToVisit('studio 54');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toContain('Studio 54');
    expect(results[0].link).toBe('/places-to-visit');
  });

  it('includes the decade in the result title', async () => {
    const results = await placesToVisit('woodstock');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toContain("(1990s)");
  });

  it('surfaces the category in the result subtitle', async () => {
    // CBGB is a Music/Arts Scene destination.
    const results = await placesToVisit('cbgb');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].subtitle).toContain('Music/Arts Scene');
  });

  it('surfaces the bestTimeToVisit in the result subtitle', async () => {
    const results = await placesToVisit('sydney');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].subtitle).toContain('Best: September');
  });

  it('matches Places to Visit via the costTier field', async () => {
    // "luxury" only matches Places to Visit destinations through costTier
    // (Apollo, Bubble-Era Tokyo, ISS, Dubai) — proving the field is indexed.
    const results = await placesToVisit('luxury');
    expect(results.length).toBeGreaterThanOrEqual(3);
  });

  it('matches Places to Visit via tags', async () => {
    // Apollo Lunar Landing Sites has the tag "moon".
    const results = await placesToVisit('moon');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toContain('Apollo');
  });
});

// ---------------------------------------------------------------------------
// Integration: the three new module groups must appear in searchAll output.
// ---------------------------------------------------------------------------
describe('searchAll — new module groups are reachable', () => {
  it('returns World Events results for a world-events-only query', async () => {
    const results = await searchAll('watergate');
    expect(results.some(r => r.module === 'World Events')).toBe(true);
  });

  it('returns Places to Live results for a places-to-live-only query', async () => {
    const results = await searchAll('bangalore');
    expect(results.some(r => r.module === 'Places to Live')).toBe(true);
  });

  it('returns Places to Visit results for a places-to-visit-only query', async () => {
    const results = await searchAll('studio 54');
    expect(results.some(r => r.module === 'Places to Visit')).toBe(true);
  });

  it('returns Engineering results for an engineering-only query', async () => {
    // "microprocessor" appears only in engineering spec descriptions (Intel 4004 / 8080).
    const results = await searchAll('microprocessor');
    expect(results.some(r => r.module === 'Engineering')).toBe(true);
  });

  it('surfaces multiple new groups for a query that spans them', async () => {
    // "berlin" matches World Events (Wall falls/reunification),
    // Places to Live (Berlin entries), and Places to Visit (Berlin Wall sites).
    const results = await searchAll('berlin');
    const modules = new Set(results.map(r => r.module));
    expect(modules.has('World Events')).toBe(true);
    expect(modules.has('Places to Live')).toBe(true);
    expect(modules.has('Places to Visit')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Engineering search behavior (group 12 of searchAll).
// ---------------------------------------------------------------------------
describe('searchAll — Engineering results', () => {
  const engineering = (q: string) =>
    searchAll(q).then(rs => rs.filter(r => r.module === 'Engineering'));

  it('matches Engineering specs by conceptName text', async () => {
    // "microprocessor" appears only in Intel 4004 / 8080 conceptName+description.
    const results = await engineering('microprocessor');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].link).toBe('/engineering');
    expect(results[0].title.toLowerCase()).toContain('microprocessor');
  });

  it('surfaces the era and sub-domain in the result subtitle', async () => {
    // "Apollo" only matches the Apollo Guidance Computer entry (aerospace, 1960s).
    const results = await engineering('apollo');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].subtitle).toContain('1960s');
    expect(results[0].subtitle).toContain('aerospace');
  });

  it('matches Engineering specs by subDomain', async () => {
    // "semiconductor" matches any entry in the semiconductors subDomain.
    const results = await engineering('semiconductor');
    expect(results.length).toBeGreaterThan(0);
    expect(results.every(r => r.module === 'Engineering')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Edge cases for the new groups.
// ---------------------------------------------------------------------------
describe('searchAll — edge cases for new groups', () => {
  it('returns no results for a gibberish query with no matches', async () => {
    const results = await searchAll('qzxwkzpb');
    expect(results).toEqual([]);
  });

  it('matches new-group content case-insensitively', async () => {
    const upper = await searchAll('STUDIO 54');
    const lower = await searchAll('studio 54');
    expect(upper.some(r => r.module === 'Places to Visit')).toBe(true);
    expect(upper.length).toBe(lower.length);
  });

  it('trims surrounding whitespace before matching new groups', async () => {
    const results = await searchAll('   watergate   ');
    expect(results.some(r => r.module === 'World Events')).toBe(true);
  });

  it('does not set a year on Places to Live or Places to Visit results', async () => {
    // Only World Events carries a numeric year; the other two new groups do not.
    const live = (await searchAll('bangalore')).filter(r => r.module === 'Places to Live');
    const visit = (await searchAll('moon')).filter(r => r.module === 'Places to Visit');
    live.forEach(r => expect(r.year).toBeUndefined());
    visit.forEach(r => expect(r.year).toBeUndefined());
  });
});
