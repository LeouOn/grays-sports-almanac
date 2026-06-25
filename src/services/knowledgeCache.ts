import { openDB } from '@/lib/idb';
import type { KnowledgeEntry } from '@/lib/idb';

const CACHE_PREFIX = 'knowledge:';

/**
 * Cache knowledge entries for a module in IndexedDB.
 * Overwrites any existing cache for the same module.
 */
export async function cacheKnowledge(
  module: string,
  entries: unknown[],
): Promise<void> {
  const db = await openDB();

  // Remove old entries for this module
  const oldEntries = await db.getAllFromIndex('knowledge', 'module', module);
  await Promise.all(oldEntries.map((e) => db.delete('knowledge', e.id)));

  // Insert new entries
  const now = Date.now();
  await Promise.all(
    entries.map((entry, i) => {
      const raw = entry as Record<string, unknown> | null | undefined;
      const id = raw?.id
        ? `${CACHE_PREFIX}${module}:${String(raw.id)}`
        : `${CACHE_PREFIX}${module}:${i}`;
      return db.put('knowledge', {
        id,
        module,
        type: 'entry',
        data: entry,
        cachedAt: now,
      } satisfies KnowledgeEntry);
    }),
  );
}

/**
 * Retrieve cached knowledge entries for a module.
 * Returns null if no entries are cached for the module.
 */
export async function getCachedKnowledge(
  module: string,
): Promise<unknown[] | null> {
  const db = await openDB();
  const entries = await db.getAllFromIndex('knowledge', 'module', module);
  if (entries.length === 0) return null;
  return entries.map((e) => e.data);
}

/**
 * Check whether a module has cached entries.
 */
export async function isCached(module: string): Promise<boolean> {
  const db = await openDB();
  const count = await db.countFromIndex('knowledge', 'module', module);
  return count > 0;
}

/** Per-module cache statistics. */
export interface CacheStats {
  totalEntries: number;
  moduleCount: number;
  modules: { module: string; count: number }[];
}

/**
 * Get statistics about the knowledge cache.
 */
export async function getCacheStats(): Promise<CacheStats> {
  const db = await openDB();
  const all = await db.getAll('knowledge');
  const moduleMap = new Map<string, number>();
  for (const entry of all) {
    moduleMap.set(entry.module, (moduleMap.get(entry.module) || 0) + 1);
  }
  return {
    totalEntries: all.length,
    moduleCount: moduleMap.size,
    modules: Array.from(moduleMap.entries()).map(([module, count]) => ({
      module,
      count,
    })),
  };
}

/**
 * Remove all cached knowledge entries.
 * Does not affect the bookmarks_cache store.
 */
export async function clearCache(): Promise<void> {
  const db = await openDB();
  await db.clear('knowledge');
}