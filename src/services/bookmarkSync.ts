import { openDB } from '@/lib/idb';
import type { CachedBookmark } from '@/lib/idb';

const API_URL = '/api/features/bookmarks';

/**
 * Syncs bookmarks from the server to IndexedDB cache.
 * This is a read-only sync — no offline writes allowed.
 * On failure (network error), leaves existing cache intact.
 */
export async function syncBookmarks(): Promise<void> {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) return;

    const bookmarks: Array<{ id: string; module: string; entry_id: string; note?: string }> = await res.json();

    const db = await openDB();
    const tx = db.transaction('bookmarks_cache', 'readwrite');

    // Clear old cache
    await tx.store.clear();

    // Insert fresh data
    const now = Date.now();
    await Promise.all(
      bookmarks.map(bm =>
        tx.store.put({
          ...bm,
          cachedAt: now,
        } as CachedBookmark)
      )
    );

    await tx.done;
  } catch {
    // Network error — leave existing cache intact
    // User can still browse cached bookmarks offline
  }
}

/**
 * Retrieves cached bookmarks from IndexedDB.
 * Returns null if no bookmarks cached.
 */
export async function getCachedBookmarks(): Promise<CachedBookmark[] | null> {
  const db = await openDB();
  const all = await db.getAll('bookmarks_cache');
  if (all.length === 0) return null;
  return all.sort((a, b) => (b.cachedAt || 0) - (a.cachedAt || 0));
}

/**
 * Checks if any bookmarks are cached.
 */
export async function isBookmarksCached(): Promise<boolean> {
  const db = await openDB();
  const count = await db.count('bookmarks_cache');
  return count > 0;
}

/**
 * Clears the bookmark cache entirely.
 */
export async function clearBookmarkCache(): Promise<void> {
  const db = await openDB();
  await db.clear('bookmarks_cache');
}