import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { BrowserRouter } from 'react-router';
import { useURLState } from './useURLState';

// react-router reads the live `window.location` on mount and updates the
// history via `window.history.replaceState`. happy-dom lets us drive both, but
// `location` is a read-only accessor, so we replace the URL through history
// instead and stub the history methods to observe replace vs. push.
function setWindowSearch(search: string) {
  const url = `${window.location.pathname}${search}${window.location.hash}`;
  window.history.replaceState(null, '', url);
}

// `.test.ts` (not `.tsx`) — keep JSX out by routing through `createElement`.
function wrapperFor(urlSearch: string) {
  // Make sure the URL reflects what each test expects BEFORE React mounts the
  // router, otherwise the initial `useSearchParams()` reads stale search.
  setWindowSearch(urlSearch);
  return ({ children }: { children: ReactNode }) =>
    createElement(BrowserRouter, null, children);
}

describe('useURLState', () => {
  beforeEach(() => {
    setWindowSearch('');
    vi.spyOn(window.history, 'pushState').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    setWindowSearch('');
  });

  it('returns the default value when the URL has no matching param', () => {
    setWindowSearch('');
    const { result } = renderHook(
      () => useURLState('view', 'grid'),
      { wrapper: wrapperFor('') },
    );

    expect(result.current[0]).toBe('grid');
  });

  it('reads an existing param from the URL on mount', () => {
    const { result } = renderHook(
      () => useURLState('view', 'grid'),
      { wrapper: wrapperFor('?view=list') },
    );

    expect(result.current[0]).toBe('list');
  });

  it('updates the URL when setValue is called with a non-default value', () => {
    const { result } = renderHook(
      () => useURLState('view', 'grid'),
      { wrapper: wrapperFor('') },
    );

    act(() => {
      result.current[1]('list');
    });

    expect(result.current[0]).toBe('list');
    expect(window.location.search).toContain('view=list');
  });

  it('removes the param when the new value equals the default', () => {
    const { result } = renderHook(
      () => useURLState('view', 'grid'),
      { wrapper: wrapperFor('?view=list') },
    );

    // Sanity check: starts in the URL-driven state.
    expect(result.current[0]).toBe('list');

    act(() => {
      result.current[1]('grid');
    });

    expect(result.current[0]).toBe('grid');
    // ?view= must be gone (only the leading "?" remains, no other params).
    expect(window.location.search).toBe('');
  });

  it('uses replaceState instead of pushState so the back button is not polluted', () => {
    const replaceSpy = vi
      .spyOn(window.history, 'replaceState')
      .mockImplementation(() => {});

    const { result } = renderHook(
      () => useURLState('view', 'grid'),
      { wrapper: wrapperFor('') },
    );

    act(() => {
      result.current[1]('list');
    });
    act(() => {
      result.current[1]('cards');
    });

    // Every navigation performed by the hook must be a *replace*, never a push.
    expect(replaceSpy).toHaveBeenCalled();
    expect(window.history.pushState).not.toHaveBeenCalled();
  });

  it('preserves unrelated query params when updating its key', () => {
    const { result } = renderHook(
      () => useURLState('view', 'grid'),
      { wrapper: wrapperFor('?other=1&keep=me') },
    );

    expect(result.current[0]).toBe('grid');

    act(() => {
      result.current[1]('list');
    });

    const params = new URLSearchParams(window.location.search);
    expect(params.get('view')).toBe('list');
    expect(params.get('other')).toBe('1');
    expect(params.get('keep')).toBe('me');
  });
});
