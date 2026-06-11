import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import { AthenaCommentary } from './AthenaCommentary';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('AthenaCommentary', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('shows cached content on mount', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ cached: true, content: 'A dark day for aviation.', source: 'precomputed' }),
    });

    render(<AthenaCommentary entryId="tenerife" />);

    await waitFor(() => {
      expect(screen.getByText(/A dark day for aviation/)).toBeTruthy();
    });
  });

  it('shows button when not cached', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ cached: false, content: null }),
    });

    render(<AthenaCommentary entryId="tenerife" />);

    await waitFor(() => {
      expect(screen.getByText(/What does Athena think/i)).toBeTruthy();
    });
  });

  it('fetches commentary on button click', async () => {
    // First call: GET (not cached)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ cached: false, content: null }),
    });
    // Second call: POST (generates)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ content: 'A dark day for aviation.', provider: 'deepseek', source: 'lazy' }),
    });

    render(<AthenaCommentary entryId="tenerife" />);

    await waitFor(() => {
      expect(screen.getByText(/What does Athena think/i)).toBeTruthy();
    });

    fireEvent.click(screen.getByText(/What does Athena think/i));

    await waitFor(() => {
      expect(screen.getByText(/A dark day for aviation/)).toBeTruthy();
    });
  });
});
