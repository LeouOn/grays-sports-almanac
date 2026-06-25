import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useSpacedRepetition } from './useSpacedRepetition';

function jsonResponse(body: unknown, init: { ok?: boolean; status?: number } = {}): Response {
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

const mkItem = (over: Partial<{
  id: string; topic: string; competence: number; next_review: string;
  interval_days: number; review_count: number; last_reviewed: string | null;
}> = {}) => ({
  id: over.id ?? 'r1',
  topic: over.topic ?? 'tech',
  competence: over.competence ?? 0.5,
  next_review: over.next_review ?? '2024-01-01T00:00:00Z',
  interval_days: over.interval_days ?? 1,
  review_count: over.review_count ?? 0,
  last_reviewed: over.last_reviewed ?? null,
});

describe('useSpacedRepetition', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('starts loading and then hydrates from the initial GET', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([]));
    const { result } = renderHook(() => useSpacedRepetition());

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.dueReviews).toEqual([]);
    expect(result.current.dueCount).toBe(0);
    expect(fetchMock).toHaveBeenCalledWith('/api/features/reviews');
  });

  it('exposes dueCount that matches the length of dueReviews', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([
      mkItem({ id: 'a', topic: 'tech' }),
      mkItem({ id: 'b', topic: 'sports' }),
      mkItem({ id: 'c', topic: 'finance' }),
    ]));
    const { result } = renderHook(() => useSpacedRepetition());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.dueReviews).toHaveLength(3);
    expect(result.current.dueCount).toBe(3);
  });

  it('submitReview POSTs the topic + outcome and removes the item on success', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([
      mkItem({ id: 'a', topic: 'tech' }),
      mkItem({ id: 'b', topic: 'sports' }),
    ]));
    const { result } = renderHook(() => useSpacedRepetition());
    await waitFor(() => expect(result.current.loading).toBe(false));

    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }));

    let ok: boolean | undefined;
    await act(async () => {
      ok = await result.current.submitReview('tech', true);
    });

    expect(ok).toBe(true);
    expect(fetchMock).toHaveBeenLastCalledWith('/api/features/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: 'tech', isCorrect: true }),
    });
    expect(result.current.dueReviews.map(i => i.topic)).toEqual(['sports']);
    expect(result.current.dueCount).toBe(1);
  });

  it('submitReview accepts a false outcome and only removes the matching topic', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([
      mkItem({ id: 'a', topic: 'tech' }),
      mkItem({ id: 'b', topic: 'sports' }),
      mkItem({ id: 'c', topic: 'finance' }),
    ]));
    const { result } = renderHook(() => useSpacedRepetition());
    await waitFor(() => expect(result.current.loading).toBe(false));

    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }));

    await act(async () => {
      await result.current.submitReview('sports', false);
    });

    expect(fetchMock).toHaveBeenLastCalledWith('/api/features/reviews', expect.objectContaining({
      body: JSON.stringify({ topic: 'sports', isCorrect: false }),
    }));
    expect(result.current.dueReviews.map(i => i.topic).sort()).toEqual(['finance', 'tech']);
  });

  it('submitReview keeps the item when the server does not respond ok', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([
      mkItem({ id: 'a', topic: 'tech' }),
    ]));
    const { result } = renderHook(() => useSpacedRepetition());
    await waitFor(() => expect(result.current.loading).toBe(false));

    fetchMock.mockResolvedValueOnce(new Response('boom', { status: 500 }));

    let ok: boolean | undefined;
    await act(async () => {
      ok = await result.current.submitReview('tech', true);
    });

    expect(ok).toBe(false);
    expect(result.current.dueReviews).toHaveLength(1);
  });

  it('refresh re-fetches the reviews endpoint and flips loading back on', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([
      mkItem({ id: 'a', topic: 'tech' }),
    ]));
    const { result } = renderHook(() => useSpacedRepetition());
    await waitFor(() => expect(result.current.loading).toBe(false));

    fetchMock.mockResolvedValueOnce(jsonResponse([
      mkItem({ id: 'b', topic: 'sports' }),
      mkItem({ id: 'c', topic: 'finance' }),
    ]));

    await act(async () => {
      await result.current.refresh();
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result.current.dueCount).toBe(2);
    expect(result.current.dueReviews.map(i => i.topic).sort()).toEqual(['finance', 'sports']);
  });

  it('falls back to an empty list when the initial fetch rejects', async () => {
    fetchMock.mockRejectedValueOnce(new Error('network down'));
    const { result } = renderHook(() => useSpacedRepetition());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.dueReviews).toEqual([]);
    expect(result.current.dueCount).toBe(0);
  });
});
