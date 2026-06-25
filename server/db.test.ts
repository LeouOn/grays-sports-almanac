import { describe, it, expect, beforeEach } from 'vitest';
import { initAthenaDb, getCommentary, upsertCommentary, getEntry, upsertEntry, type AthenaDb } from './db.js';

describe('AthenaDb', () => {
  let db: AthenaDb;

  beforeEach(() => {
    db = initAthenaDb(':memory:');
  });

  it('creates tables on init', () => {
    const tables = db._db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
      .all() as { name: string }[];
    const names = tables.map(t => t.name);
    expect(names).toContain('entries');
    expect(names).toContain('commentary');
    expect(names).toContain('chat_context');
  });

  it('upserts and retrieves an entry', () => {
    upsertEntry(db, {
      entry_id: 'tenerife', module: 'disasters', title: 'Tenerife Airport Disaster',
      era: null, year: 1977, category: 'Aviation', subcategory: null,
      tags: '["aviation","fog","atc"]', data_hash: 'abc123',
    });
    const entry = getEntry(db, 'tenerife');
    expect(entry).not.toBeNull();
    expect(entry!.entry_id).toBe('tenerife');
    expect(entry!.module).toBe('disasters');
    expect(entry!.tags).toBe('["aviation","fog","atc"]');
  });

  it('upserts entry (updates on conflict)', () => {
    upsertEntry(db, { entry_id: 'x', module: 'sports', title: 'A', era: null, year: 1990, category: null, subcategory: null, tags: '[]', data_hash: 'h1' });
    upsertEntry(db, { entry_id: 'x', module: 'sports', title: 'B', era: null, year: 1990, category: null, subcategory: null, tags: '[]', data_hash: 'h2' });
    const entry = getEntry(db, 'x');
    expect(entry!.title).toBe('B');
    expect(entry!.data_hash).toBe('h2');
  });

  it('upserts and retrieves commentary', () => {
    upsertEntry(db, { entry_id: 't', module: 'disasters', title: 'T', era: null, year: 1977, category: null, subcategory: null, tags: '[]', data_hash: 'h' });
    upsertCommentary(db, {
      entry_id: 't', content_type: 'commentary', companion_id: 'athena',
      content: 'A dark day for aviation.', context_hash: 'ch1', source: 'precomputed',
      provider: 'deepseek', model: 'deepseek-v4-pro', target_entry_id: null,
      tier: 0, performance: '', topic: '',
    });
    const result = getCommentary(db, { entry_id: 't', content_type: 'commentary', companion_id: 'athena' });
    expect(result).not.toBeNull();
    expect(result!.content).toBe('A dark day for aviation.');
    expect(result!.source).toBe('precomputed');
  });

  it('getCommentary returns null for missing entry', () => {
    const result = getCommentary(db, { entry_id: 'nonexistent', content_type: 'commentary', companion_id: 'athena' });
    expect(result).toBeNull();
  });

  it('increments access_count', () => {
    upsertEntry(db, { entry_id: 't', module: 'disasters', title: 'T', era: null, year: 1977, category: null, subcategory: null, tags: '[]', data_hash: 'h' });
    upsertCommentary(db, { entry_id: 't', content_type: 'commentary', companion_id: 'athena', content: 'X', context_hash: 'ch', source: 'lazy', provider: null, model: null, target_entry_id: null, tier: 0, performance: '', topic: '' });
    getCommentary(db, { entry_id: 't', content_type: 'commentary', companion_id: 'athena' });
    getCommentary(db, { entry_id: 't', content_type: 'commentary', companion_id: 'athena' });
    const row = getCommentary(db, { entry_id: 't', content_type: 'commentary', companion_id: 'athena' });
    expect(row!.access_count).toBe(3);
  });

  it('stores and retrieves quiz reactions', () => {
    upsertEntry(db, { entry_id: '__quiz__', module: 'system', title: 'Quiz Reactions', era: null, year: null, category: null, subcategory: null, tags: '[]', data_hash: 'h' });
    upsertCommentary(db, {
      entry_id: '__quiz__', content_type: 'quiz_reaction', companion_id: 'athena',
      content: 'Nailed it!', context_hash: 'ch', source: 'precomputed',
      provider: null, model: null, target_entry_id: null,
      tier: 1, performance: 'high', topic: 'sports',
    });
    const result = getCommentary(db, { entry_id: '__quiz__', content_type: 'quiz_reaction', companion_id: 'athena', tier: 1, performance: 'high', topic: 'sports' });
    expect(result!.content).toBe('Nailed it!');
  });
});
