import { describe, it, expect } from 'vitest';
import { findBestTagMatch } from './tagMatch.js';

describe('findBestTagMatch (cross-module tag intersection)', () => {
  it('returns null when input tags are empty', () => {
    expect(findBestTagMatch([])).toBeNull();
  });

  it('returns null when no entry shares any tag', () => {
    // Tags that don't appear in any data module entry
    expect(findBestTagMatch(['zzzz-not-a-real-tag-xyz'])).toBeNull();
  });

  it('finds a single-tag match in the disasters module', () => {
    // 'aviation' is shared across many disaster entries
    const match = findBestTagMatch(['aviation']);
    expect(match).not.toBeNull();
    expect(match!.module).toBeTruthy();
    expect(match!.tags).toContain('aviation');
  });

  it('prefers the entry with the highest overlap (best score wins)', () => {
    // Tenerife has 3 of these tags (aviation, fog, atc) — it should beat
    // any entry with only one or two.
    const match = findBestTagMatch(['aviation', 'fog', 'atc']);
    expect(match).not.toBeNull();
    expect(match!.id).toBe('tenerife');
    expect(match!.module).toBe('disasters');
  });

  it('excludes the calling entry when excludeId matches (no self-match)', () => {
    // Even though 'aviation' would otherwise match tenerife (which carries
    // that tag), excluding it by id must return a DIFFERENT entry.
    const match = findBestTagMatch(['aviation'], 'tenerife');
    expect(match).not.toBeNull();
    expect(match!.id).not.toBe('tenerife');
    // The match must still be aviation-related (aviation is the only
    // shared tag with the query).
    expect(match!.tags).toContain('aviation');
  });

  it('returns null when excluding the only possible match', () => {
    // Constrain the query so only one entry in the data can possibly
    // match, then exclude that entry — the result must be null.
    // 'canary-islands' is uniquely Tenerife's tag.
    const match = findBestTagMatch(['canary-islands'], 'tenerife');
    expect(match).toBeNull();
  });

  it('matches across modules (engineering ↔ disasters)', () => {
    // Engineering entries with the 'aerospace' domain tag (derived from
    // subDomain) overlap with disasters tagged 'aviation'. Both surface
    // in the result regardless of source module.
    const match = findBestTagMatch(['aerospace', 'aviation']);
    expect(match).not.toBeNull();
    // Whichever side wins, it must carry one of our query tags.
    expect(match!.tags).toEqual(expect.arrayContaining(['aerospace', 'aviation']));
  });

  it('is case-sensitive (aviation ≠ AVIATION)', () => {
    // The matching logic does a Set.has lookup on raw input strings, so a
    // differently-cased query tag must NOT match. This test pins that
    // behavior so future refactors don't accidentally normalize silently.
    const lower = findBestTagMatch(['aviation']);
    const upper = findBestTagMatch(['AVIATION']);
    expect(lower).not.toBeNull();
    expect(upper).toBeNull();
  });

  it('returns the highest-scoring entry when multiple entries share tags', () => {
    // 'aviation' appears in many entries; the function should still return
    // a single match (the first one found at the max score during iteration).
    // Multiple tags on the query should not produce an array — only the
    // best single entry.
    const match = findBestTagMatch(['aviation', 'fog', 'atc', 'communication-breakdown']);
    expect(match).not.toBeNull();
    // The returned object must conform to the MatchableEntry shape.
    expect(match).toMatchObject({
      id: expect.any(String),
      title: expect.any(String),
      description: expect.any(String),
      tags: expect.any(Array),
      module: expect.any(String),
    });
  });
});