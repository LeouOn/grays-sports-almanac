import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { resetDB } from '@/lib/idb';
import {
  cacheKnowledge,
  getCachedKnowledge,
  isCached,
  getCacheStats,
  clearCache,
} from './knowledgeCache';

describe('Knowledge cache service', () => {
  beforeEach(async () => {
    await resetDB();
  });

  it('caches entries and retrieves them', async () => {
    const entries = [{ id: '1', title: 'Super Bowl III' }];
    await cacheKnowledge('sports', entries);
    const cached = await getCachedKnowledge('sports');
    expect(cached).toEqual(entries);
  });

  it('returns null for uncached module', async () => {
    const cached = await getCachedKnowledge('finance');
    expect(cached).toBeNull();
  });

  it('isCached returns correct boolean', async () => {
    expect(await isCached('sports')).toBe(false);
    await cacheKnowledge('sports', [{ id: '1' }]);
    expect(await isCached('sports')).toBe(true);
  });

  it('getCacheStats returns entry counts', async () => {
    await cacheKnowledge('sports', [{ id: '1' }, { id: '2' }]);
    await cacheKnowledge('finance', [{ id: '3' }]);
    const stats = await getCacheStats();
    expect(stats.totalEntries).toBe(3);
    expect(stats.moduleCount).toBe(2);
  });

  it('clearCache removes all entries', async () => {
    await cacheKnowledge('sports', [{ id: '1' }]);
    await clearCache();
    expect(await isCached('sports')).toBe(false);
  });

  it('overwrites existing cache on re-cache', async () => {
    await cacheKnowledge('sports', [{ id: '1' }]);
    await cacheKnowledge('sports', [{ id: '2' }, { id: '3' }]);
    const cached = await getCachedKnowledge('sports');
    expect(cached).toHaveLength(2);
    expect(cached?.[0].id).toBe('2');
  });

  it('handles entries without id field gracefully', async () => {
    const entries = [{ title: 'No ID entry' }];
    await cacheKnowledge('sports', entries);
    const cached = await getCachedKnowledge('sports');
    expect(cached).toHaveLength(1);
    expect(cached?.[0]).toEqual({ title: 'No ID entry' });
  });

  it('getCacheStats returns module breakdown', async () => {
    await cacheKnowledge('sports', [{ id: 'a' }, { id: 'b' }, { id: 'c' }]);
    await cacheKnowledge('finance', [{ id: 'd' }]);
    const stats = await getCacheStats();
    const sportsModule = stats.modules.find((m) => m.module === 'sports');
    const financeModule = stats.modules.find((m) => m.module === 'finance');
    expect(sportsModule?.count).toBe(3);
    expect(financeModule?.count).toBe(1);
  });

  it('clearCache does not affect non-cached stores', async () => {
    const { openDB } = await import('@/lib/idb');
    const db = await openDB();
    await db.put('bookmarks_cache', {
      id: 'bm-1',
      module: 'sports',
      entry_id: 'sb-iii',
    });
    await cacheKnowledge('sports', [{ id: '1' }]);
    await clearCache();
    const bookmark = await db.get('bookmarks_cache', 'bm-1');
    expect(bookmark).toBeDefined();
    expect(bookmark?.entry_id).toBe('sb-iii');
  });
});