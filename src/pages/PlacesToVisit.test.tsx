import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { PlacesToVisit } from './PlacesToVisit';

// The loader is mocked globally in `vitest.setup.ts` with a synchronously-
// resolving thenable backed by the real dataset, so every page renders with
// its full data on the first `render()` and assertions can be synchronous —
// matching the convention used by every other page test in this repo.

const renderPage = () =>
  render(
    <MemoryRouter>
      <PlacesToVisit />
    </MemoryRouter>
  );

// The page now paginates (PAGE_SIZE = 24). Tests that assert on specific
// destinations deep in the dataset click "Load more" until all are visible.
const loadAll = () => {
  while (screen.queryByRole('button', { name: /^load more/i })) {
    fireEvent.click(screen.getByRole('button', { name: /^load more/i }));
  }
};

describe('PlacesToVisit page', () => {
  it('renders the page heading and description', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: /places to visit/i })).toBeTruthy();
    expect(screen.getByText(/Temporal tourism guide/)).toBeTruthy();
  });

  it('renders all 60 destinations on load', () => {
    renderPage();
    loadAll();
    // Anchors from each of the four decades.
    expect(screen.getByText('Apollo Lunar Landing Sites')).toBeTruthy(); // 1970s
    expect(screen.getByText('The Berlin Wall & Checkpoint Charlie')).toBeTruthy(); // 1980s
    expect(screen.getByText('Hong Kong Handover Ceremony')).toBeTruthy(); // 1990s
    expect(screen.getByText('Kyoto Cherry Blossoms')).toBeTruthy(); // 2000s
    expect(screen.getByText(/Showing 60 of 60/)).toBeTruthy();
  });

  it('filters by decade via the chip controls', () => {
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: '1990s' }));

    // A 1990s entry stays visible.
    expect(screen.getByText('Hong Kong Handover Ceremony')).toBeTruthy();
    // Non-1990s entries are filtered out.
    expect(screen.queryByText('Apollo Lunar Landing Sites')).toBeNull();
    expect(screen.queryByText('Kyoto Cherry Blossoms')).toBeNull();
    expect(screen.getByText(/Showing 8 of 60/)).toBeTruthy();
  });

  it('filters by category via the dropdown', () => {
    renderPage();

    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: 'Music/Arts Scene' },
    });

    // Music/Arts entries: Studio 54, CBGB & OMFUG, Live Aid Concert, Woodstock '94.
    expect(screen.getByText('Studio 54')).toBeTruthy();
    expect(screen.getByText('Live Aid Concert')).toBeTruthy();
    expect(screen.getByText(/Woodstock/)).toBeTruthy();
    // Non-Music entries are filtered out.
    expect(screen.queryByText('Apollo Lunar Landing Sites')).toBeNull();
    expect(screen.getByText(/Showing 5 of 60/)).toBeTruthy();
  });

  it('shows cost tier badges across the grid', () => {
    renderPage();
    expect(screen.getAllByText('Budget').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Moderate').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Expensive').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Luxury').length).toBeGreaterThan(0);
  });

  it('shows category and decade badges on the cards', () => {
    renderPage();
    expect(screen.getAllByText('Natural Wonder').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Historical Site').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Architectural Marvel').length).toBeGreaterThan(0);
  });

  it('shows the empty state when no destination matches both filters', () => {
    renderPage();
    // The 1990s has no "Natural Wonder" entries, so combining the two filters
    // yields an empty result set.
    fireEvent.click(screen.getByRole('button', { name: '1990s' }));
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: 'Natural Wonder' },
    });

    expect(screen.getByText(/No destinations match/)).toBeTruthy();
    expect(screen.queryByText('Hong Kong Handover Ceremony')).toBeNull();
  });

  it('resets the decade filter when the "All" chip is clicked', () => {
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: '1990s' }));
    expect(screen.getByText(/Showing 8 of 60/)).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'All' }));
    expect(screen.getByText(/Showing 60 of 60/)).toBeTruthy();
    expect(screen.getByText('Apollo Lunar Landing Sites')).toBeTruthy();
  });

  it('opens detail modal on card click', () => {
    renderPage();
    const headings = screen.getAllByRole('heading', { level: 3 });
    fireEvent.click(headings[0]);
    // Modal should show the close button
    expect(screen.getByLabelText(/close/i)).toBeTruthy();
  });

  it('closes modal on backdrop click', () => {
    renderPage();
    const headings = screen.getAllByRole('heading', { level: 3 });
    fireEvent.click(headings[0]);
    expect(screen.getByLabelText(/close/i)).toBeTruthy();
    // Click backdrop (the fixed overlay)
    const overlay = screen.getByLabelText(/close/i).closest('.fixed');
    if (overlay) fireEvent.click(overlay);
    expect(screen.queryByLabelText(/close/i)).toBeNull();
  });
});
