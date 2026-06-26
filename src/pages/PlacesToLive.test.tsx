import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { PlacesToLive } from './PlacesToLive';

// The global `vitest.setup.ts` mocks `@/data/loader` so every loader resolves
// synchronously with the REAL dataset. `MemoryRouter` with fresh initialEntries
// prevents `useURLState` from leaking URL params between tests.

const renderPage = (entries: string[] = ['/']) =>
  render(
    <MemoryRouter initialEntries={entries}>
      <PlacesToLive />
    </MemoryRouter>
  );

describe('PlacesToLive page', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/');
  });

  it('renders the page heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: /places to live/i })).toBeTruthy();
  });

  it('renders destination cards on load', () => {
    renderPage();
    expect(screen.getAllByText('San Francisco').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Tokyo').length).toBeGreaterThan(0);
  });

  it('renders stability badges', () => {
    renderPage();
    expect(screen.getAllByText('Stable').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Turbulent').length).toBeGreaterThan(0);
  });

  it('filters by decade via chip buttons', () => {
    renderPage();
    // Tehran is 1970s in the real dataset.
    expect(screen.getAllByText('Tehran').length).toBeGreaterThan(0);

    // Click the 2000s chip — Tehran (1970s) must disappear.
    fireEvent.click(screen.getByRole('button', { name: '2000s' }));

    expect(screen.queryByText('Tehran')).toBeFalsy();
    // San Francisco has a 2000s entry, so it remains.
    expect(screen.getAllByText('San Francisco').length).toBeGreaterThan(0);
  });

  it('filters by political stability via the dropdown', () => {
    renderPage();
    // All destinations initially.
    expect(screen.getByText(/of 47/)).toBeTruthy();

    // Select "Turbulent" — only Turbulent destinations remain.
    fireEvent.change(screen.getByLabelText(/stability/i), {
      target: { value: 'Turbulent' },
    });

    // Tehran is Turbulent, so it remains.
    expect(screen.getAllByText('Tehran').length).toBeGreaterThan(0);
    // San Francisco is Stable in every decade, so it must be filtered out.
    expect(screen.queryByText('San Francisco')).toBeFalsy();
    // Count must drop below 47.
    const countText = screen.getByText(/of 47/).textContent || '';
    expect(countText).not.toMatch(/Showing 47 of 47/);
  });

  it('shows the count of filtered destinations', () => {
    renderPage();
    expect(screen.getByText(/of 47/)).toBeTruthy();
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
