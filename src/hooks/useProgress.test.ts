import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useProgress } from './useProgress';

function jsonResponse(body: unknown, init: { ok?: boolean; status?: number } = {}): Response {
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

const mkEntry = (over: Partial<{
  id: string; module: string; entries_viewed: number; total_entries: number;
  quiz_score: number | null; quiz_total: number | null; last_activity: string | null;
}> = {}) => ({
  id: over.id ?? 'p1',
  module: over.module ?? 'tech',
  entries_viewed: over.entries_viewed ?? 0,
  total_entries: over.total_entries ?? 10,
  quiz_score: over.quiz_score ?? null,
  quiz_total: over.quiz_total ?? null,
  last_activity: over.last_activity ?? null,
});

describe('useProgress', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('fetches progress on mount and flips loading off', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([]));
    const { result } = renderHook(() => useProgress());

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.progress).toEqual([]);
    expect(fetchMock).toHaveBeenCalledWith('/api/features/progress');
  });

  it('hydrates the progress array from the GET response', async () => {
    const seed = [
      mkEntry({ id: 'p1', module: 'tech', entries_viewed: 5, total_entries: 10 }),
      mkEntry({ id: 'p2', module: 'sports', entries_viewed: 3, total_entries: 12 }),
    ];
    fetchMock.mockResolvedValueOnce(jsonResponse(seed));

    const { result } = renderHook(() => useProgress());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.progress).toEqual(seed);
  });

  it('computes overallPercentage as the rounded aggregate viewed/total', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([
      mkEntry({ id: 'p1', entries_viewed: 50, total_entries: 100 }),
      mkEntry({ id: 'p2', entries_viewed: 25, total_entries: 100 }),
    ]));
    const { result } = renderHook(() => useProgress());
    await waitFor(() => expect(result.current.loading).toBe(false));

    // (50 + 25) / (100 + 100) = 37.5 -> 38
    expect(result.current.overallPercentage).toBe(38);
  });

  it('overallPercentage is 0 when there is no progress and when total entries is 0', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([]));
    const { result } = renderHook(() => useProgress());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.overallPercentage).toBe(0);

    fetchMock.mockResolvedValueOnce(jsonResponse([
      mkEntry({ id: 'p1', entries_viewed: 0, total_entries: 0 }),
    ]));
    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.overallPercentage).toBe(0);
  });

  it('updateProgress sends a PUT with the right body and merges by module', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([
      mkEntry({ id: 'p1', module: 'tech', entries_viewed: 2, total_entries: 10 }),
    ]));
    const { result } = renderHook(() => useProgress());
    await waitFor(() => expect(result.current.loading).toBe(false));

    const updated = mkEntry({ id: 'p1', module: 'tech', entries_viewed: 5, total_entries: 10 });
    fetchMock.mockResolvedValueOnce(jsonResponse(updated));

    await act(async () => {
      await result.current.updateProgress('tech', 5, 10);
    });

    expect(fetchMock).toHaveBeenLastCalledWith('/api/features/progress/tech', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entries_viewed: 5, total_entries: 10 }),
    });
    expect(result.current.progress).toEqual([updated]);
  });

  it('updateProgress includes quiz fields when provided', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([]));
    const { result } = renderHook(() => useProgress());
    await waitFor(() => expect(result.current.loading).toBe(false));

    fetchMock.mockResolvedValueOnce(jsonResponse(
      mkEntry({ id: 'p1', module: 'sports', entries_viewed: 4, total_entries: 4, quiz_score: 3, quiz_total: 5 }),
    ));

    await act(async () => {
      await result.current.updateProgress('sports', 4, 4, 3, 5);
    });

    expect(fetchMock).toHaveBeenLastCalledWith('/api/features/progress/sports', expect.objectContaining({
      body: JSON.stringify({ entries_viewed: 4, total_entries: 4, quiz_score: 3, quiz_total: 5 }),
    }));
  });

  it('updateProgress prepends a brand-new module instead of merging', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([
      mkEntry({ id: 'p1', module: 'tech', entries_viewed: 2, total_entries: 10 }),
    ]));
    const { result } = renderHook(() => useProgress());
    await waitFor(() => expect(result.current.loading).toBe(false));

    const created = mkEntry({ id: 'p2', module: 'sports', entries_viewed: 1, total_entries: 10 });
    fetchMock.mockResolvedValueOnce(jsonResponse(created));

    await act(async () => {
      await result.current.updateProgress('sports', 1, 10);
    });

    expect(result.current.progress).toEqual([created, expect.objectContaining({ module: 'tech' })]);
  });

  it('refresh re-fetches the progress endpoint on demand', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([]));
    const { result } = renderHook(() => useProgress());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(fetchMock).toHaveBeenCalledTimes(1);

    fetchMock.mockResolvedValueOnce(jsonResponse([
      mkEntry({ id: 'p1', module: 'tech', entries_viewed: 7, total_entries: 10 }),
    ]));

    await act(async () => {
      await result.current.refresh();
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result.current.progress).toHaveLength(1);
    expect(result.current.progress[0].entries_viewed).toBe(7);
  });

  it('falls back to an empty list when the initial fetch rejects', async () => {
    fetchMock.mockRejectedValueOnce(new Error('network down'));
    const { result } = renderHook(() => useProgress());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.progress).toEqual([]);
  });

  it('encodes the module segment in the PUT URL', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([]));
    const { result } = renderHook(() => useProgress());
    await waitFor(() => expect(result.current.loading).toBe(false));

    fetchMock.mockResolvedValueOnce(jsonResponse(
      mkEntry({ id: 'p1', module: 'a/b', entries_viewed: 1, total_entries: 1 }),
    ));

    await act(async () => {
      await result.current.updateProgress('a/b', 1, 1);
    });

    expect(fetchMock).toHaveBeenLastCalledWith('/api/features/progress/a%2Fb', expect.any(Object));
  });
});
