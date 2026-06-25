import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { SportsAlmanac } from './SportsAlmanac';
import React from 'react';

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
      <SportsAlmanac />
    </MemoryRouter>
  );

describe('SportsAlmanac', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });
  });

  it('renders page heading, search input, and table headers', () => {
    renderPage();
    expect(screen.getByText('The Sports Almanac')).toBeTruthy();
    expect(screen.getByPlaceholderText('Search by year, sport, or event...')).toBeTruthy();
    // Table headers
    expect(screen.getByText('Year')).toBeTruthy();
    expect(screen.getByText('Sport')).toBeTruthy();
    expect(screen.getByText('Winner')).toBeTruthy();
  });

  it('renders sports data rows in the table', () => {
    renderPage();
    // Table should have clickable rows with sports data
    const rows = screen.getAllByRole('row');
    // At least header + some data rows
    expect(rows.length).toBeGreaterThan(1);
  });

  it('filters data when typing non-matching search', () => {
    renderPage();
    const input = screen.getByPlaceholderText('Search by year, sport, or event...');
    fireEvent.change(input, { target: { value: 'xyznonexistent' } });
    expect(screen.getByText('No records found matching your search.')).toBeTruthy();
  });

  it('has an Export CSV button', () => {
    renderPage();
    expect(screen.getByText('Export CSV')).toBeTruthy();
  });
});
