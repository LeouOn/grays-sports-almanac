import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router';
import { Podcasts } from './Podcasts';

function mockManifestResponse(episodes: unknown[] | 'fail') {
  if (episodes === 'fail') {
    return new Response('not found', { status: 404 });
  }
  return new Response(JSON.stringify({ episodes }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('Podcasts page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders episode cards from the mocked manifest with a working audio element', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        mockManifestResponse([
          {
            id: '1980s-briefing',
            title: "1980s Traveler's Briefing",
            era: '1980s',
            file: 'podcasts/1980s-briefing.mp3',
            description: 'Neon, leg warmers, and the Cold War.',
            addedAt: '2026-08-30T12:00:00.000Z',
          },
          {
            id: '1990s-briefing',
            title: "1990s Traveler's Briefing",
            era: '1990s',
            file: 'podcasts/1990s-briefing.mp3',
            description: 'Dial-up, grunge, and Y2K panic.',
            addedAt: '2026-08-29T12:00:00.000Z',
          },
        ]),
      ),
    );

    render(
      <MemoryRouter>
        <Podcasts />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("1980s Traveler's Briefing")).toBeInTheDocument();
    });

    expect(screen.getByText("1990s Traveler's Briefing")).toBeInTheDocument();
    expect(screen.getByText('1980s')).toBeInTheDocument();
    expect(screen.getByText('1990s')).toBeInTheDocument();
    expect(screen.getByText('Neon, leg warmers, and the Cold War.')).toBeInTheDocument();

    const audios = document.querySelectorAll('audio');
    expect(audios).toHaveLength(2);
    expect(audios[0].getAttribute('src')).toBe('podcasts/1980s-briefing.mp3');
    expect(audios[0].getAttribute('preload')).toBe('none');
    expect(audios[1].getAttribute('src')).toBe('podcasts/1990s-briefing.mp3');
  });

  it('shows the empty-state flow hint when the manifest has no episodes', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => mockManifestResponse([])),
    );

    render(
      <MemoryRouter>
        <Podcasts />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/no episodes yet/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/pnpm briefing/i)).toBeInTheDocument();
    expect(screen.getByText(/scripts\/add-podcast\.mjs/)).toBeInTheDocument();
  });
});
