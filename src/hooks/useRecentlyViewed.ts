import { useCallback, useEffect, useState } from 'react';

export interface RecentEntry {
  id: string;
  module: string;
  title: string;
  path: string;
  viewedAt: number;
}

const KEY = 'tt-recently-viewed';
const MAX = 5;

function read(): RecentEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is RecentEntry =>
        e &&
        typeof e === 'object' &&
        typeof e.id === 'string' &&
        typeof e.module === 'string' &&
        typeof e.title === 'string' &&
        typeof e.path === 'string' &&
        typeof e.viewedAt === 'number',
    );
  } catch {
    return [];
  }
}

function write(list: RecentEntry[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
  } catch {
    // Quota exceeded or private mode — silently ignore
  }
}

/**
 * Tracks the last {@link MAX} content entries the user opened, persisted to
 * localStorage. De-duplicates by `id` and keeps the most recent first.
 *
 * Returns `recent` (the current list) and `addRecent` (upsert by id). A
 * `clearRecent` helper empties the list and storage.
 */
export function useRecentlyViewed() {
  const [recent, setRecent] = useState<RecentEntry[]>(read);

  // Re-sync from storage on mount in case another tab wrote to it.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setRecent(read());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const addRecent = useCallback((entry: Omit<RecentEntry, 'viewedAt'>) => {
    setRecent((prev) => {
      const filtered = prev.filter((e) => e.id !== entry.id);
      const next = [{ ...entry, viewedAt: Date.now() }, ...filtered].slice(0, MAX);
      write(next);
      return next;
    });
  }, []);

  const clearRecent = useCallback(() => {
    setRecent([]);
    try {
      localStorage.removeItem(KEY);
    } catch {
      // ignore
    }
  }, []);

  return { recent, addRecent, clearRecent };
}
