import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import { PalaceLink } from './PalaceLink';

describe('PalaceLink', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders collapsed by default with Memory Link text', () => {
    render(<PalaceLink tags={['aviation', 'fog']} contextItem="Tenerife disaster" />);
    expect(screen.getByText('Memory Link')).toBeTruthy();
    expect(screen.queryByText(/exponential growth/)).toBeNull();
  });

  it('fetches from Athena API on click and shows connection', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    // GET cache check returns nothing cached
    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify({ cached: false }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    // POST generates a connection
    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify({ connection: 'Both share exponential growth.', targetEntryId: 'tech-42' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    render(<PalaceLink tags={['aviation', 'fog']} contextItem="Tenerife disaster" excludeId="entry-1" />);

    await fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText(/exponential growth/)).toBeTruthy();
    });
      });
  
  it('checks cache via GET before generating via POST', async () => {
    // First call: GET cache check returns cached result
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ cached: true, connection: 'Cached link.', targetEntryId: 'cache-1' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    render(<PalaceLink tags={['aviation']} contextItem="Test" excludeId="entry-1" />);

    await fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText(/Cached link/)).toBeTruthy();
    });

    // Should have called GET with entryId
    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/athena/palace-link?entryId=entry-1',
    );
  });

  it('shows loading indicator while fetching', async () => {
    // Never resolve — keeps it in loading state
    vi.spyOn(globalThis, 'fetch').mockReturnValueOnce(new Promise(() => {}));

    render(<PalaceLink tags={['aviation', 'fog']} contextItem="Loading test" excludeId="entry-1" />);

    await fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText('...')).toBeTruthy();
  });

  it('collapses on second click', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ cached: true, connection: 'A link.', targetEntryId: 'id-1' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    render(<PalaceLink tags={['test']} contextItem="Test" excludeId="entry-1" />);

    // First click: expand
    await fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByText(/A link/)).toBeTruthy();
    });

    // Second click: collapse
    await fireEvent.click(screen.getByRole('button'));
    expect(screen.queryByText(/A link/)).toBeNull();
  });
});
