import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRecentlyViewed } from './useRecentlyViewed';

describe('useRecentlyViewed', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('starts with an empty list when localStorage is empty', () => {
    const { result } = renderHook(() => useRecentlyViewed());
    expect(result.current.recent).toEqual([]);
  });

  it('addRecent prepends a new entry and persists to localStorage', () => {
    const { result } = renderHook(() => useRecentlyViewed());

    act(() => {
      result.current.addRecent({ id: 'e1', module: 'Sports', title: 'Super Bowl', path: '/sports' });
    });

    expect(result.current.recent).toHaveLength(1);
    expect(result.current.recent[0]).toMatchObject({
      id: 'e1',
      module: 'Sports',
      title: 'Super Bowl',
      path: '/sports',
    });
    expect(typeof result.current.recent[0].viewedAt).toBe('number');

    const stored = JSON.parse(localStorage.getItem('tt-recently-viewed') as string);
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe('e1');
  });

  it('moves an existing entry to the front instead of duplicating', () => {
    const { result } = renderHook(() => useRecentlyViewed());

    act(() => {
      result.current.addRecent({ id: 'e1', module: 'A', title: 'First', path: '/a' });
    });
    act(() => {
      result.current.addRecent({ id: 'e2', module: 'B', title: 'Second', path: '/b' });
    });
    act(() => {
      result.current.addRecent({ id: 'e1', module: 'A', title: 'First', path: '/a' });
    });

    expect(result.current.recent).toHaveLength(2);
    expect(result.current.recent[0].id).toBe('e1');
    expect(result.current.recent[1].id).toBe('e2');
  });

  it('caps the list at 5 entries (most recent first)', () => {
    const { result } = renderHook(() => useRecentlyViewed());

    for (let i = 0; i < 7; i++) {
      act(() => {
        result.current.addRecent({ id: `e${i}`, module: 'M', title: `Entry ${i}`, path: `/e${i}` });
      });
    }

    expect(result.current.recent).toHaveLength(5);
    // Most recent first — e6 was added last
    expect(result.current.recent[0].id).toBe('e6');
    expect(result.current.recent[4].id).toBe('e2');
  });

  it('hydrates from localStorage on mount', () => {
    const seed = [
      { id: 'old', module: 'Finance', title: 'Crash', path: '/finance', viewedAt: 1000 },
    ];
    localStorage.setItem('tt-recently-viewed', JSON.stringify(seed));

    const { result } = renderHook(() => useRecentlyViewed());
    expect(result.current.recent).toEqual(seed);
  });

  it('ignores corrupted localStorage and returns an empty list', () => {
    localStorage.setItem('tt-recently-viewed', '{not json');

    const { result } = renderHook(() => useRecentlyViewed());
    expect(result.current.recent).toEqual([]);
  });

  it('clearRecent empties the list and removes the localStorage key', () => {
    const { result } = renderHook(() => useRecentlyViewed());

    act(() => {
      result.current.addRecent({ id: 'e1', module: 'A', title: 'T', path: '/a' });
    });
    expect(result.current.recent).toHaveLength(1);

    act(() => {
      result.current.clearRecent();
    });

    expect(result.current.recent).toEqual([]);
    expect(localStorage.getItem('tt-recently-viewed')).toBeNull();
  });
});
