import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useBookmarks } from './useBookmarks';

// `vi.mock` factories are hoisted above all top-level statements; referencing a
// regular `const` hits the TDZ. `vi.hoisted` lets us define a shared `vi.fn()`
// the mock factory can close over.
const { useOnlineStatusMock } = vi.hoisted(() => ({
  useOnlineStatusMock: vi.fn(() => true),
}));

vi.mock('./useOnlineStatus', () => ({
  useOnlineStatus: useOnlineStatusMock,
}));

// Build a Response-like object for a parsed JSON payload.
function jsonResponse(body: unknown, init: { ok?: boolean; status?: number } = {}): Response {
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('useBookmarks', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    // Default to online for the existing tests; offline tests override.
    useOnlineStatusMock.mockReturnValue(true);
    useOnlineStatusMock.mockClear();
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('starts in loading state and fetches bookmarks on mount', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([]));
    const { result } = renderHook(() => useBookmarks());

    // Resolves while still loading, then transitions to not-loading.
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.bookmarks).toEqual([]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('/api/features/bookmarks');
  });

  it('hydrates bookmarks from the initial GET', async () => {
    const seed = [
      { id: 'b1', module: 'tech', entry_id: 'e1', note: 'first', created_at: '2024-01-01T00:00:00Z' },
      { id: 'b2', module: 'sports', entry_id: 'e2', note: '', created_at: '2024-02-01T00:00:00Z' },
    ];
    fetchMock.mockResolvedValueOnce(jsonResponse(seed));

    const { result } = renderHook(() => useBookmarks());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.bookmarks).toEqual(seed);
  });

  it('isBookmarked returns true for matching module+entry, false otherwise', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([
      { id: 'b1', module: 'tech', entry_id: 'e1', note: '', created_at: '2024-01-01T00:00:00Z' },
    ]));
    const { result } = renderHook(() => useBookmarks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.isBookmarked('tech', 'e1')).toBe(true);
    expect(result.current.isBookmarked('tech', 'other')).toBe(false);
    expect(result.current.isBookmarked('finance', 'e1')).toBe(false);
  });

  it('toggleBookmark POSTs a new bookmark when none exists', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([]));
    const { result } = renderHook(() => useBookmarks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    const created = {
      id: 'new-id',
      module: 'tech',
      entry_id: 'e42',
      note: 'remember this',
      created_at: '2024-03-01T00:00:00Z',
    };
    fetchMock.mockResolvedValueOnce(jsonResponse(created));

    let added: boolean | undefined;
    await act(async () => {
      added = await result.current.toggleBookmark('tech', 'e42', 'remember this');
    });

    expect(added).toBe(true);
    expect(fetchMock).toHaveBeenLastCalledWith('/api/features/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ module: 'tech', entry_id: 'e42', note: 'remember this' }),
    });
    expect(result.current.bookmarks).toHaveLength(1);
    expect(result.current.bookmarks[0]).toEqual(created);
    expect(result.current.isBookmarked('tech', 'e42')).toBe(true);
  });

  it('toggleBookmark defaults note to an empty string when omitted', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([]));
    const { result } = renderHook(() => useBookmarks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    fetchMock.mockResolvedValueOnce(jsonResponse({
      id: 'x', module: 'tech', entry_id: 'e1', note: '', created_at: '2024-01-01T00:00:00Z',
    }));

    await act(async () => {
      await result.current.toggleBookmark('tech', 'e1');
    });

    expect(fetchMock).toHaveBeenLastCalledWith('/api/features/bookmarks', expect.objectContaining({
      body: JSON.stringify({ module: 'tech', entry_id: 'e1', note: '' }),
    }));
  });

  it('toggleBookmark DELETEs an existing bookmark instead of POSTing', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([
      { id: 'b1', module: 'tech', entry_id: 'e1', note: '', created_at: '2024-01-01T00:00:00Z' },
    ]));
    const { result } = renderHook(() => useBookmarks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));

    let removed: boolean | undefined;
    await act(async () => {
      removed = await result.current.toggleBookmark('tech', 'e1');
    });

    expect(removed).toBe(false);
    expect(fetchMock).toHaveBeenLastCalledWith('/api/features/bookmarks/b1', { method: 'DELETE' });
    expect(result.current.bookmarks).toEqual([]);
    expect(result.current.isBookmarked('tech', 'e1')).toBe(false);
  });

  it('deleteBookmark removes by id and returns true on success', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([
      { id: 'b1', module: 'tech', entry_id: 'e1', note: '', created_at: '2024-01-01T00:00:00Z' },
      { id: 'b2', module: 'sports', entry_id: 'e2', note: '', created_at: '2024-01-01T00:00:00Z' },
    ]));
    const { result } = renderHook(() => useBookmarks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));

    let ok: boolean | undefined;
    await act(async () => {
      ok = await result.current.deleteBookmark('b1');
    });

    expect(ok).toBe(true);
    expect(fetchMock).toHaveBeenLastCalledWith('/api/features/bookmarks/b1', { method: 'DELETE' });
    expect(result.current.bookmarks.map(b => b.id)).toEqual(['b2']);
  });

  it('deleteBookmark returns false when the server does not respond ok', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([
      { id: 'b1', module: 'tech', entry_id: 'e1', note: '', created_at: '2024-01-01T00:00:00Z' },
    ]));
    const { result } = renderHook(() => useBookmarks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    fetchMock.mockResolvedValueOnce(new Response('nope', { status: 500 }));

    let ok: boolean | undefined;
    await act(async () => {
      ok = await result.current.deleteBookmark('b1');
    });

    expect(ok).toBe(false);
    expect(result.current.bookmarks).toHaveLength(1);
  });

  it('falls back to an empty list when the initial fetch rejects', async () => {
    fetchMock.mockRejectedValueOnce(new Error('network down'));
    const { result } = renderHook(() => useBookmarks());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.bookmarks).toEqual([]);
  });

  it('toggleBookmark returns undefined when POST fails and leaves state untouched', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([]));
    const { result } = renderHook(() => useBookmarks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    fetchMock.mockResolvedValueOnce(new Response('boom', { status: 500 }));

    let ret: boolean | undefined;
    await act(async () => {
      ret = await result.current.toggleBookmark('tech', 'e1');
    });

    expect(ret).toBeUndefined();
    expect(result.current.bookmarks).toEqual([]);
  });

  // ----- offline write queue ------------------------------------------------

  describe('offline write queue', () => {
    it('toggles optimistically when offline (add path) — state updates immediately', async () => {
      useOnlineStatusMock.mockReturnValue(false);
      fetchMock.mockResolvedValueOnce(jsonResponse([]));
      const { result } = renderHook(() => useBookmarks());
      await waitFor(() => expect(result.current.loading).toBe(false));

      let added: boolean | undefined;
      await act(async () => {
        added = await result.current.toggleBookmark('tech', 'e1', 'remember this');
      });

      expect(added).toBe(true);
      expect(result.current.isBookmarked('tech', 'e1')).toBe(true);
      expect(result.current.bookmarks).toHaveLength(1);
      // Optimistic entry uses a `pending-` id so queue processing can replace it
      expect(result.current.bookmarks[0].id).toMatch(/^pending-/);
    });

    it('queues the add operation in localStorage when offline', async () => {
      useOnlineStatusMock.mockReturnValue(false);
      fetchMock.mockResolvedValueOnce(jsonResponse([]));
      const { result } = renderHook(() => useBookmarks());
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.toggleBookmark('tech', 'e1', 'remember');
      });

      const raw = localStorage.getItem('tt-bookmark-queue');
      expect(raw).not.toBeNull();
      const queue = JSON.parse(raw as string);
      expect(queue).toHaveLength(1);
      expect(queue[0]).toMatchObject({
        module: 'tech',
        entryId: 'e1',
        action: 'add',
        note: 'remember',
      });
      expect(typeof queue[0].id).toBe('string');
      expect(typeof queue[0].timestamp).toBe('number');
    });

    it('toggles optimistically when offline (remove path) and queues the remove', async () => {
      useOnlineStatusMock.mockReturnValue(false);
      const seed = [
        { id: 'b1', module: 'tech', entry_id: 'e1', note: '', created_at: '2024-01-01T00:00:00Z' },
      ];
      fetchMock.mockResolvedValueOnce(jsonResponse(seed));
      const { result } = renderHook(() => useBookmarks());
      await waitFor(() => expect(result.current.loading).toBe(false));

      let removed: boolean | undefined;
      await act(async () => {
        removed = await result.current.toggleBookmark('tech', 'e1');
      });

      expect(removed).toBe(false);
      expect(result.current.bookmarks).toEqual([]);
      expect(result.current.isBookmarked('tech', 'e1')).toBe(false);

      const queue = JSON.parse(localStorage.getItem('tt-bookmark-queue') as string);
      expect(queue).toHaveLength(1);
      expect(queue[0]).toMatchObject({
        module: 'tech',
        entryId: 'e1',
        action: 'remove',
      });
    });

    it('does not call fetch for a toggle when offline', async () => {
      useOnlineStatusMock.mockReturnValue(false);
      fetchMock.mockResolvedValueOnce(jsonResponse([]));
      const { result } = renderHook(() => useBookmarks());
      await waitFor(() => expect(result.current.loading).toBe(false));

      // Only the initial GET fired
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenLastCalledWith('/api/features/bookmarks');

      await act(async () => {
        await result.current.toggleBookmark('tech', 'e1');
      });

      // No additional network call while offline
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('processes the queue when transitioning back online', async () => {
      useOnlineStatusMock.mockReturnValue(false);
      fetchMock.mockResolvedValueOnce(jsonResponse([]));
      const { result, rerender } = renderHook(() => useBookmarks());
      await waitFor(() => expect(result.current.loading).toBe(false));

      // Queue an add while offline
      await act(async () => {
        await result.current.toggleBookmark('tech', 'e1', 'queued');
      });
      expect(JSON.parse(localStorage.getItem('tt-bookmark-queue') as string)).toHaveLength(1);

      // Mock the response for the queued POST
      fetchMock.mockResolvedValueOnce(
        jsonResponse({
          id: 'real-1',
          module: 'tech',
          entry_id: 'e1',
          note: 'queued',
          created_at: '2024-05-01T00:00:00Z',
        })
      );

      // Flip online and re-render
      useOnlineStatusMock.mockReturnValue(true);
      rerender();

      // Queue is drained
      await waitFor(() => {
        const raw = localStorage.getItem('tt-bookmark-queue');
        const queue = raw ? JSON.parse(raw) : [];
        expect(queue).toEqual([]);
      });

      // The real server id replaced the optimistic pending- id
      expect(result.current.bookmarks.map(b => b.id)).toEqual(['real-1']);
    });

    it('clears the queue after a successful sync (idempotent after reload)', async () => {
      useOnlineStatusMock.mockReturnValue(true);
      // Pre-populate the queue as if a previous session wrote it
      const preQueue = [
        {
          id: 'op-prior',
          module: 'tech',
          entryId: 'e1',
          action: 'add',
          note: 'prev',
          timestamp: Date.now(),
        },
      ];
      localStorage.setItem('tt-bookmark-queue', JSON.stringify(preQueue));

      fetchMock.mockResolvedValueOnce(jsonResponse([])); // initial GET
      fetchMock.mockResolvedValueOnce(
        jsonResponse({
          id: 'real-1',
          module: 'tech',
          entry_id: 'e1',
          note: 'prev',
          created_at: '2024-05-01T00:00:00Z',
        })
      );

      const { result } = renderHook(() => useBookmarks());
      await waitFor(() => expect(result.current.loading).toBe(false));

      await waitFor(() => {
        const raw = localStorage.getItem('tt-bookmark-queue');
        const queue = raw ? JSON.parse(raw) : [];
        expect(queue).toEqual([]);
      });
      expect(result.current.bookmarks.map(b => b.id)).toContain('real-1');
    });

    it('processes the queue on mount when online (queue survives page reload)', async () => {
      // Queue written in a prior session — persists in localStorage across reloads
      const preQueue = [
        {
          id: 'op-reload',
          module: 'sports',
          entryId: 's1',
          action: 'add',
          note: 'sports',
          timestamp: Date.now(),
        },
      ];
      localStorage.setItem('tt-bookmark-queue', JSON.stringify(preQueue));

      useOnlineStatusMock.mockReturnValue(true);
      fetchMock.mockResolvedValueOnce(jsonResponse([])); // initial GET
      fetchMock.mockResolvedValueOnce(
        jsonResponse({
          id: 'real-s1',
          module: 'sports',
          entry_id: 's1',
          note: 'sports',
          created_at: '2024-05-01T00:00:00Z',
        })
      );

      const { result } = renderHook(() => useBookmarks());
      await waitFor(() => expect(result.current.loading).toBe(false));

      await waitFor(() => {
        const raw = localStorage.getItem('tt-bookmark-queue');
        const queue = raw ? JSON.parse(raw) : [];
        expect(queue).toEqual([]);
      });
      expect(result.current.bookmarks.map(b => b.id)).toContain('real-s1');
    });

    it('queues multiple operations and processes them in order', async () => {
      useOnlineStatusMock.mockReturnValue(false);
      fetchMock.mockResolvedValueOnce(jsonResponse([]));
      const { result, rerender } = renderHook(() => useBookmarks());
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.toggleBookmark('tech', 'e1');
      });
      await act(async () => {
        await result.current.toggleBookmark('sports', 's1');
      });

      const queue = JSON.parse(localStorage.getItem('tt-bookmark-queue') as string);
      expect(queue).toHaveLength(2);

      // Mock both POSTs in queue order
      fetchMock.mockResolvedValueOnce(
        jsonResponse({
          id: 'real-tech',
          module: 'tech',
          entry_id: 'e1',
          note: '',
          created_at: '2024-01-01T00:00:00Z',
        })
      );
      fetchMock.mockResolvedValueOnce(
        jsonResponse({
          id: 'real-sports',
          module: 'sports',
          entry_id: 's1',
          note: '',
          created_at: '2024-01-01T00:00:00Z',
        })
      );

      useOnlineStatusMock.mockReturnValue(true);
      rerender();

      await waitFor(() => {
        const raw = localStorage.getItem('tt-bookmark-queue');
        const q = raw ? JSON.parse(raw) : [];
        expect(q).toEqual([]);
      });

      expect(result.current.bookmarks.map(b => b.id).sort()).toEqual(['real-sports', 'real-tech']);
    });

    it('treats a 409 conflict on a queued add as resolved (server already has it)', async () => {
      useOnlineStatusMock.mockReturnValue(true);
      const preQueue = [
        {
          id: 'op-conflict',
          module: 'tech',
          entryId: 'e1',
          action: 'add',
          note: '',
          timestamp: Date.now(),
        },
      ];
      localStorage.setItem('tt-bookmark-queue', JSON.stringify(preQueue));

      fetchMock.mockResolvedValueOnce(jsonResponse([])); // initial GET
      fetchMock.mockResolvedValueOnce(new Response('conflict', { status: 409 }));

      const { result } = renderHook(() => useBookmarks());
      await waitFor(() => expect(result.current.loading).toBe(false));

      await waitFor(() => {
        const raw = localStorage.getItem('tt-bookmark-queue');
        const q = raw ? JSON.parse(raw) : [];
        expect(q).toEqual([]);
      });
      // The failed POST should not have populated state with a fake id
      expect(result.current.bookmarks.map(b => b.id)).not.toContain('op-conflict');
    });

    it('skips a queued remove for an entry that was added offline then removed offline', async () => {
      // Simulate the add-then-remove-while-offline scenario: only the remove op
      // remains because the user "un-toggled" before the device came back online.
      // There is no real server id, so the queue processor should drop it.
      useOnlineStatusMock.mockReturnValue(true);
      const preQueue = [
        {
          id: 'op-orphan-remove',
          module: 'tech',
          entryId: 'e1',
          action: 'remove',
          timestamp: Date.now(),
        },
      ];
      localStorage.setItem('tt-bookmark-queue', JSON.stringify(preQueue));

      fetchMock.mockResolvedValueOnce(jsonResponse([])); // initial GET — no real bookmark
      // No DELETE mock needed: with no real id, the processor should skip the call.

      const { result } = renderHook(() => useBookmarks());
      await waitFor(() => expect(result.current.loading).toBe(false));

      await waitFor(() => {
        const raw = localStorage.getItem('tt-bookmark-queue');
        const q = raw ? JSON.parse(raw) : [];
        expect(q).toEqual([]);
      });
      // Only the initial GET fired — no DELETE attempted for the orphan op
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
  });
});
