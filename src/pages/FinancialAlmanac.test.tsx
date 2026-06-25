import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { FinancialAlmanac } from './FinancialAlmanac';
import React from 'react';

// Mock recharts to avoid width/height errors in tests
vi.mock('recharts', async () => {
  const OriginalModule = await vi.importActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});

// Mock export to avoid URL.createObjectURL issues
vi.mock('@/lib/export', () => ({
  exportToCSV: vi.fn(),
}));

const mockFetch = vi.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve([]),
});
vi.stubGlobal('fetch', mockFetch);

const renderPage = () =>
  render(
    <MemoryRouter>
      <FinancialAlmanac />
    </MemoryRouter>
  );

describe('FinancialAlmanac', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });
  });

  it('renders page heading, search input, and table headers', () => {
    renderPage();
    expect(screen.getByText('Financial Almanac')).toBeTruthy();
    expect(screen.getByPlaceholderText('Search by year, event, or category...')).toBeTruthy();
    // Table headers
    expect(screen.getByText('Date')).toBeTruthy();
    expect(screen.getByText('Category')).toBeTruthy();
    expect(screen.getByText('Event')).toBeTruthy();
    expect(screen.getByText('Direction')).toBeTruthy();
  });

  it('renders financial data rows in the table', () => {
    renderPage();
    // Table should have data rows — look for direction badges
    const longBadges = screen.getAllByText('▲ LONG');
    const shortBadges = screen.getAllByText('▼ SHORT');
    expect(longBadges.length + shortBadges.length).toBeGreaterThan(0);
  });

  it('filters data when typing in search', () => {
    renderPage();
    const input = screen.getByPlaceholderText('Search by year, event, or category...');
    fireEvent.change(input, { target: { value: 'xyznonexistent' } });
    expect(screen.getByText('No records matching your search.')).toBeTruthy();
  });

  it('has an Export CSV button', () => {
    renderPage();
    expect(screen.getByText('Export CSV')).toBeTruthy();
  });
});
