import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { openDB, resetDB } from './idb';

describe('IndexedDB wrapper', () => {
  beforeEach(async () => {
    await resetDB();
  });

  it('opens database with correct name and version', async () => {
    const db = await openDB();
    expect(db.name).toBe('time-traveler-guide');
    expect(db.version).toBe(2);
  });

  it('creates knowledge store with keyPath and indexes', async () => {
    const db = await openDB();
    expect(db.objectStoreNames.contains('knowledge')).toBe(true);
    const tx = db.transaction('knowledge', 'readonly');
    const store = tx.objectStore('knowledge');
    expect(store.indexNames.contains('module')).toBe(true);
    expect(store.indexNames.contains('type')).toBe(true);
    await tx.done;
  });

  it('creates bookmarks_cache store', async () => {
    const db = await openDB();
    expect(db.objectStoreNames.contains('bookmarks_cache')).toBe(true);
  });

  it('CRUD works on knowledge store', async () => {
    const db = await openDB();
    await db.put('knowledge', { id: 'test-1', module: 'sports', type: 'event', data: { x: 1 } });
    const item = await db.get('knowledge', 'test-1');
    expect(item?.id).toBe('test-1');
    expect(item?.data).toEqual({ x: 1 });
    await db.delete('knowledge', 'test-1');
    const deleted = await db.get('knowledge', 'test-1');
    expect(deleted).toBeUndefined();
  });

  it('CRUD works on bookmarks_cache store', async () => {
    const db = await openDB();
    await db.put('bookmarks_cache', { id: 'bm-1', module: 'sports', entry_id: 'sb-iii' });
    const item = await db.get('bookmarks_cache', 'bm-1');
    expect(item?.entry_id).toBe('sb-iii');
    await db.delete('bookmarks_cache', 'bm-1');
    const deleted = await db.get('bookmarks_cache', 'bm-1');
    expect(deleted).toBeUndefined();
  });

  it('querying by module index works', async () => {
    const db = await openDB();
    await db.put('knowledge', { id: '1', module: 'sports', type: 'event', data: {} });
    await db.put('knowledge', { id: '2', module: 'sports', type: 'event', data: {} });
    await db.put('knowledge', { id: '3', module: 'finance', type: 'event', data: {} });
    const sportsItems = await db.getAllFromIndex('knowledge', 'module', 'sports');
    expect(sportsItems).toHaveLength(2);
  });

  it('querying by type index works', async () => {
    const db = await openDB();
    await db.put('knowledge', { id: '1', module: 'sports', type: 'event', data: {} });
    await db.put('knowledge', { id: '2', module: 'finance', type: 'event', data: {} });
    await db.put('knowledge', { id: '3', module: 'sports', type: 'person', data: {} });
    const events = await db.getAllFromIndex('knowledge', 'type', 'event');
    expect(events).toHaveLength(2);
  });

  it('handles concurrent operations', async () => {
    const db = await openDB();
    await Promise.all(
      Array.from({ length: 10 }, (_, i) =>
        db.put('knowledge', { id: `item-${i}`, module: 'test', type: 'event', data: { i } })
      )
    );
    const all = await db.getAll('knowledge');
    expect(all).toHaveLength(10);
  });

  it('returns cached db instance on subsequent openDB calls', async () => {
    const db1 = await openDB();
    const db2 = await openDB();
    expect(db1).toBe(db2);
  });

  it('creates custom_companions store with indexes (v2 schema)', async () => {
    const db = await openDB();
    expect(db.objectStoreNames.contains('custom_companions')).toBe(true);
    const tx = db.transaction('custom_companions', 'readonly');
    const store = tx.objectStore('custom_companions');
    expect(store.indexNames.contains('name')).toBe(true);
    expect(store.indexNames.contains('createdAt')).toBe(true);
    await tx.done;
  });

  it('CRUD works on custom_companions store', async () => {
    const db = await openDB();
    await db.put('custom_companions', {
      id: 'c-1', name: 'Sarcastic Bot', prompt: 'You are...', avatar: '🤖',
      styleTags: ['sarcastic'], createdAt: Date.now(), updatedAt: Date.now(),
    });
    const item = await db.get('custom_companions', 'c-1');
    expect(item?.name).toBe('Sarcastic Bot');
    await db.delete('custom_companions', 'c-1');
    const deleted = await db.get('custom_companions', 'c-1');
    expect(deleted).toBeUndefined();
  });
});
