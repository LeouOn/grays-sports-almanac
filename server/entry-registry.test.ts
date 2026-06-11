import { describe, it, expect, beforeEach } from 'vitest';
import { initAthenaDb, type AthenaDb } from './db.js';
import { registerEntries } from './entry-registry.js';

describe('registerEntries', () => {
  let db: AthenaDb;

  beforeEach(() => {
    db = initAthenaDb(':memory:');
  });

  it('registers entries from all data modules', () => {
    registerEntries(db);
    const count = (db._db.prepare('SELECT COUNT(*) as c FROM entries').get() as { c: number }).c;
    expect(count).toBeGreaterThan(50);
  });

  it('registers era-guide entries with synthetic ids', () => {
    registerEntries(db);
    const count = (db._db.prepare("SELECT COUNT(*) as c FROM entries WHERE module = 'era-guide'").get() as { c: number }).c;
    expect(count).toBeGreaterThan(0);
  });

  it('registers engineering entries with tags', () => {
    registerEntries(db);
    const engEntries = db._db.prepare("SELECT * FROM entries WHERE module = 'engineering'").all() as { tags: string }[];
    for (const e of engEntries) {
      const tags = JSON.parse(e.tags);
      expect(tags.length).toBeGreaterThan(0);
    }
  });
});
