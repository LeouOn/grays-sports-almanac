import { useState, useEffect, useCallback, useRef } from 'react';
import { useOnlineStatus } from './useOnlineStatus';

export interface Bookmark {
  id: string;
  module: string;
  entry_id: string;
  note: string;
  created_at: string;
}

const QUEUE_KEY = 'tt-bookmark-queue';

/**
 * Operation queued for replay when the device comes back online.
 * `note` is only meaningful for `add` actions.
 * The id is used to uniquely identify ops when pruning the queue.
 */
interface QueuedBookmarkOp {
  id: string;
  module: string;
  entryId: string;
  action: 'add' | 'remove';
  note?: string;
  timestamp: number;
}

function genOpId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function readQueue(): QueuedBookmarkOp[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (op): op is QueuedBookmarkOp =>
        typeof op === 'object' &&
        op !== null &&
        typeof (op as QueuedBookmarkOp).id === 'string' &&
        typeof (op as QueuedBookmarkOp).module === 'string' &&
        typeof (op as QueuedBookmarkOp).entryId === 'string' &&
        ((op as QueuedBookmarkOp).action === 'add' || (op as QueuedBookmarkOp).action === 'remove') &&
        typeof (op as QueuedBookmarkOp).timestamp === 'number'
    );
  } catch {
    return [];
  }
}

function writeQueue(queue: QueuedBookmarkOp[]): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch {
    // localStorage may be unavailable (quota, private mode); drop silently.
  }
}

function appendQueue(op: QueuedBookmarkOp): void {
  const queue = readQueue();
  queue.push(op);
  writeQueue(queue);
}

export function useBookmarks() {
  const isOnline = useOnlineStatus();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  // Tracks whether the initial GET has settled. Queue processing waits on this
  // so the initial fetch's `setBookmarks(serverData)` cannot clobber a real
  // bookmark that the queue processing has just synced.
  const [initialFetchDone, setInitialFetchDone] = useState(false);
  // Keep a ref in sync so async queue processing can read latest state
  // without re-creating the effect each time the bookmarks change.
  const bookmarksRef = useRef<Bookmark[]>([]);
  useEffect(() => {
    bookmarksRef.current = bookmarks;
  }, [bookmarks]);

  // Initial fetch
  useEffect(() => {
    let cancelled = false;
    fetch('/api/features/bookmarks')
      .then(res => res.json())
      .then((data: Bookmark[]) => {
        if (!cancelled) {
          setBookmarks(data);
          setLoading(false);
          setInitialFetchDone(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoading(false);
          setInitialFetchDone(true);
        }
      });
    return () => { cancelled = true; };
  }, []);

  // Process the offline queue when online AND the initial fetch has settled.
  // Gating on `initialFetchDone` ensures we never race the initial GET —
  // otherwise the GET's `setBookmarks(serverData)` could overwrite a real
  // bookmark we just synced from the queue.
  useEffect(() => {
    if (!isOnline || !initialFetchDone) return;
    const snapshot = readQueue();
    if (snapshot.length === 0) return;

    let cancelled = false;
    const successfullyProcessed: QueuedBookmarkOp[] = [];

    (async () => {
      for (const op of snapshot) {
        if (cancelled) break;
        try {
          if (op.action === 'add') {
            const res = await fetch('/api/features/bookmarks', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                module: op.module,
                entry_id: op.entryId,
                note: op.note ?? '',
              }),
            });
            if (res.ok) {
              const created: Bookmark = await res.json();
              if (!cancelled) {
                // Replace the optimistic temp entry (if still in state) with the real one
                setBookmarks(prev => {
                  const withoutTemp = prev.filter(
                    b => !(b.module === op.module && b.entry_id === op.entryId && b.id.startsWith('pending-'))
                  );
                  if (withoutTemp.some(b => b.id === created.id)) return withoutTemp;
                  return [created, ...withoutTemp];
                });
              }
              successfullyProcessed.push(op);
            } else if (res.status === 409) {
              // Server already has this bookmark — treat as resolved, drop the op
              successfullyProcessed.push(op);
            }
            // Other failures: leave the op in the queue for next attempt
          } else {
            // 'remove'
            const current = bookmarksRef.current.find(
              b => b.module === op.module && b.entry_id === op.entryId
            );
            if (current && !current.id.startsWith('pending-')) {
              // We have a real server id — try to DELETE
              const res = await fetch(`/api/features/bookmarks/${current.id}`, {
                method: 'DELETE',
              });
              if (res.ok || res.status === 404) {
                successfullyProcessed.push(op);
              }
              // Other failures: keep op in queue
            } else {
              // No real id (added offline then removed offline before sync,
              // or already synced and removed). Nothing to delete on server.
              successfullyProcessed.push(op);
            }
          }
        } catch {
          // Network error mid-sync — stop processing, leave the rest in the queue
          break;
        }
      }

      if (!cancelled) {
        const processedIds = new Set(successfullyProcessed.map(o => o.id));
        // Preserve: ops still pending + any ops that were appended while we were processing
        const current = readQueue();
        const updated = current.filter(op => !processedIds.has(op.id));
        writeQueue(updated);
      }
    })();

    return () => { cancelled = true; };
  }, [isOnline, initialFetchDone]);

  const toggleBookmark = useCallback(async (module: string, entryId: string, note?: string) => {
    if (!isOnline) {
      // Offline path: optimistically update + queue for later sync
      const existing = bookmarks.find(b => b.module === module && b.entry_id === entryId);
      if (existing) {
        setBookmarks(prev => prev.filter(b => b.id !== existing.id));
        appendQueue({
          id: genOpId(),
          module,
          entryId,
          action: 'remove',
          timestamp: Date.now(),
        });
        return false;
      } else {
        const tempBookmark: Bookmark = {
          id: `pending-${genOpId()}`,
          module,
          entry_id: entryId,
          note: note ?? '',
          created_at: new Date().toISOString(),
        };
        setBookmarks(prev => [tempBookmark, ...prev]);
        appendQueue({
          id: genOpId(),
          module,
          entryId,
          action: 'add',
          note: note ?? '',
          timestamp: Date.now(),
        });
        return true;
      }
    }

    // Online path: original behavior — await the server, then update state
    const existing = bookmarks.find(b => b.module === module && b.entry_id === entryId);
    if (existing) {
      const res = await fetch(`/api/features/bookmarks/${existing.id}`, { method: 'DELETE' });
      if (res.ok) {
        setBookmarks(prev => prev.filter(b => b.id !== existing.id));
        return false; // removed
      }
    } else {
      const res = await fetch('/api/features/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module, entry_id: entryId, note: note ?? '' }),
      });
      if (res.ok) {
        const created: Bookmark = await res.json();
        setBookmarks(prev => [created, ...prev]);
        return true; // added
      }
    }
    return undefined;
  }, [bookmarks, isOnline]);

  const isBookmarked = useCallback((module: string, entryId: string) => {
    return bookmarks.some(b => b.module === module && b.entry_id === entryId);
  }, [bookmarks]);

  const deleteBookmark = useCallback(async (id: string) => {
    const res = await fetch(`/api/features/bookmarks/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setBookmarks(prev => prev.filter(b => b.id !== id));
      return true;
    }
    return false;
  }, []);

  return { bookmarks, toggleBookmark, isBookmarked, deleteBookmark, loading };
}
