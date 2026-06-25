import { describe, it, expect, beforeEach, vi } from 'vitest';
import 'fake-indexeddb/auto';
import { resetDB } from '@/lib/idb';
import { syncBookmarks, getCachedBookmarks, isBookmarksCached, clearBookmarkCache } from './bookmarkSync';

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('Bookmark sync service', () => {
  beforeEach(async () => {
    await resetDB();
    await clearBookmarkCache();
    mockFetch.mockReset();
  });

  it('syncs bookmarks from server to cache', async () => {
    const serverBookmarks = [
      { id: 'bm-1', module: 'sports', entry_id: 'sb-iii', note: 'Key game' },
      { id: 'bm-2', module: 'finance', entry_id: 'crash-87', note: '' },
    ];
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(serverBookmarks),
    });

    await syncBookmarks();

    const cached = await getCachedBookmarks();
    expect(cached).toHaveLength(2);
    expect(cached?.[0].entry_id).toBe('sb-iii');
  });

  it('returns cached bookmarks when offline', async () => {
    // First, populate cache
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([{ id: 'bm-1', module: 'sports', entry_id: 'sb-iii' }]),
    });
    await syncBookmarks();

    // Now simulate offline
    mockFetch.mockRejectedValue(new Error('Network error'));

    const cached = await getCachedBookmarks();
    expect(cached).toHaveLength(1);
    expect(cached?.[0].entry_id).toBe('sb-iii');
  });

  it('isBookmarksCached returns correct boolean', async () => {
    expect(await isBookmarksCached()).toBe(false);

    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([{ id: 'bm-1', module: 'sports', entry_id: 'sb-iii' }]),
    });
    await syncBookmarks();

    expect(await isBookmarksCached()).toBe(true);
  });

  it('handles sync failure gracefully', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    // Should not throw, should return empty/null
    await expect(syncBookmarks()).resolves.not.toThrow();
    const cached = await getCachedBookmarks();
    expect(cached).toBeNull();
  });

  it('clearBookmarkCache removes all cached bookmarks', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([{ id: 'bm-1', module: 'sports', entry_id: 'sb-iii' }]),
    });
    await syncBookmarks();
    await clearBookmarkCache();

    expect(await isBookmarksCached()).toBe(false);
    expect(await getCachedBookmarks()).toBeNull();
  });

  it('updates cache on re-sync (not duplicates)', async () => {
    // First sync
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([{ id: 'bm-1', module: 'sports', entry_id: 'sb-iii' }]),
    });
    await syncBookmarks();

    // Second sync with updated data
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([
        { id: 'bm-1', module: 'sports', entry_id: 'sb-iii', note: 'updated' },
        { id: 'bm-2', module: 'finance', entry_id: 'crash-87' },
      ]),
    });
    await syncBookmarks();

    const cached = await getCachedBookmarks();
    expect(cached).toHaveLength(2);
  });
});