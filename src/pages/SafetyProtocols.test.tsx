import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { SafetyProtocols } from './SafetyProtocols';
import React from 'react';

const mockFetch = vi.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve([]),
});
vi.stubGlobal('fetch', mockFetch);

const renderPage = () =>
  render(
    <MemoryRouter>
      <SafetyProtocols />
    </MemoryRouter>
  );

describe('SafetyProtocols', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });
  });

  it('renders page heading, description, and search input', () => {
    renderPage();
    expect(screen.getByText('Personal Safety & Dead Drops')).toBeTruthy();
    expect(screen.getByText(/Identity, banking, housing/)).toBeTruthy();
    expect(screen.getByPlaceholderText('Search protocols...')).toBeTruthy();
  });

  it('renders category tabs when no search term is active', () => {
    renderPage();
    // Category tabs should be visible (Identity, Banking, Housing, etc.)
    expect(screen.getByRole('tab', { name: /Identity/ })).toBeTruthy();
    expect(screen.getByRole('tab', { name: /Banking/ })).toBeTruthy();
    expect(screen.getByRole('tab', { name: /Housing/ })).toBeTruthy();
  });

  it('filters protocols when typing in search', () => {
    renderPage();
    const input = screen.getByPlaceholderText('Search protocols...');
    fireEvent.change(input, { target: { value: 'xyznonexistent' } });
    expect(screen.getByText('No protocols match your search.')).toBeTruthy();
  });

  it('renders specific Identity protocols on initial load', () => {
    renderPage();
    // The Identity tab is the default. Its three protocols should render.
    expect(screen.getByText('Paper Identity Documents')).toBeTruthy();
    expect(screen.getByText('Cover Story Construction')).toBeTruthy();
    expect(screen.getByText('Flexibility Protocol — When History Doesn\'t Match the Records')).toBeTruthy();
    // Protocols in other categories are hidden behind their tabs.
    expect(screen.queryByText('Cash-Based Existence')).toBeNull();
    expect(screen.queryByText('Newspaper Classified Ads')).toBeNull();
  });

  it('reveals Banking protocols when the Banking tab is activated', () => {
    renderPage();
    fireEvent.click(screen.getByRole('tab', { name: /Banking/ }));
    // The two Banking protocols appear.
    expect(screen.getByText('Cash-Based Existence')).toBeTruthy();
    expect(screen.getByText('Converting Foreknowledge to Wealth (Quietly)')).toBeTruthy();
    // Identity protocols are no longer in the active panel.
    expect(screen.queryByText('Cover Story Construction')).toBeNull();
  });

  it('reveals Dead Drops protocols when the Dead Drops tab is activated', () => {
    renderPage();
    fireEvent.click(screen.getByRole('tab', { name: /Dead Drops/ }));
    // All five Dead Drops protocol titles should render.
    expect(screen.getByText('Newspaper Classified Ads')).toBeTruthy();
    expect(screen.getByText('Safety Deposit Boxes')).toBeTruthy();
    expect(screen.getByText('Library Book Annotations')).toBeTruthy();
    expect(screen.getByText('Physical Dead Drops (Geocaching, 1970s Style)')).toBeTruthy();
    expect(screen.getByText('Book Cipher for Temporal Communication')).toBeTruthy();
  });

  it('reveals Communication protocols when the Communication tab is activated', () => {
    renderPage();
    fireEvent.click(screen.getByRole('tab', { name: /Communication/ }));
    expect(screen.getByText('Analog Cellphone Sniffing & Cloning')).toBeTruthy();
    expect(screen.getByText('Pager / Beeper Numeric Cryptography')).toBeTruthy();
    expect(screen.getByText('Early Internet Security & Email Scams')).toBeTruthy();
  });

  it('finds a specific protocol across all tabs when searching by title', () => {
    renderPage();
    const input = screen.getByPlaceholderText('Search protocols...');
    fireEvent.change(input, { target: { value: 'pager' } });
    // The matching Communication protocol surfaces via search even though
    // it's hidden behind a tab in the tabbed view.
    expect(screen.getByText('Pager / Beeper Numeric Cryptography')).toBeTruthy();
    // Non-matching protocols are filtered out.
    expect(screen.queryByText('Cover Story Construction')).toBeNull();
    expect(screen.queryByText('Cash-Based Existence')).toBeNull();
  });
});
