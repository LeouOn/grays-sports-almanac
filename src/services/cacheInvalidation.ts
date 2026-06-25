import { openDB } from '@/lib/idb';

const STALE_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const VERSION_KEY = 'tt-cache-version';

/**
 * Returns the age of cached data for a module, in milliseconds.
 * Returns null if the module is not cached.
 */
export async function getCacheAge(module: string): Promise<number | null> {
  const db = await openDB();
  const entries = await db.getAllFromIndex('knowledge', 'module', module);
  if (entries.length === 0) return null;
  
  // Use the most recent cachedAt timestamp
  const newest = entries.reduce((max, e) => {
    const ts = e.cachedAt || 0;
    return ts > max ? ts : max;
  }, 0);
  
  if (newest === 0) return null;
  return Date.now() - newest;
}

/**
 * Removes all cached entries for a specific module.
 */
export async function invalidateByModule(module: string): Promise<void> {
  const db = await openDB();
  const entries = await db.getAllFromIndex('knowledge', 'module', module);
  const tx = db.transaction('knowledge', 'readwrite');
  await Promise.all(entries.map(e => tx.store.delete(e.id)));
  await tx.done;
}

/**
 * Removes all entries older than the stale threshold.
 * Returns the count of removed entries.
 */
export async function invalidateStaleEntries(
  thresholdMs: number = STALE_THRESHOLD_MS,
): Promise<number> {
  const db = await openDB();
  const all = await db.getAll('knowledge');
  const now = Date.now();
  
  const staleIds = all
    .filter(e => {
      const age = now - (e.cachedAt || 0);
      return age > thresholdMs;
    })
    .map(e => e.id);
  
  if (staleIds.length === 0) return 0;
  
  const tx = db.transaction('knowledge', 'readwrite');
  await Promise.all(staleIds.map(id => tx.store.delete(id)));
  await tx.done;
  
  return staleIds.length;
}

/**
 * Nuclear option: clears all caches (knowledge + bookmarks).
 */
export async function clearAllCaches(): Promise<void> {
  const db = await openDB();
  const tx1 = db.transaction('knowledge', 'readwrite');
  await tx1.store.clear();
  await tx1.done;
  
  const tx2 = db.transaction('bookmarks_cache', 'readwrite');
  await tx2.store.clear();
  await tx2.done;
}

/**
 * Checks if the app version has changed since last cache.
 * If so, invalidates all caches and updates the stored version.
 * Returns true if cache was invalidated, false otherwise.
 */
export async function checkVersionAndInvalidate(
  currentVersion: string,
): Promise<boolean> {
  const storedVersion = localStorage.getItem(VERSION_KEY);
  
  // First run — just store the version, nothing to invalidate
  if (storedVersion === null) {
    localStorage.setItem(VERSION_KEY, currentVersion);
    return false;
  }
  
  // Version unchanged — do nothing
  if (storedVersion === currentVersion) {
    return false;
  }
  
  // Version changed — clear caches and update stored version
  await clearAllCaches();
  localStorage.setItem(VERSION_KEY, currentVersion);
  return true;
}
