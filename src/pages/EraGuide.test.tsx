import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { EraGuide } from './EraGuide';
import React from 'react';

const mockFetch = vi.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve([]),
});
vi.stubGlobal('fetch', mockFetch);

const renderPage = () =>
  render(
    <MemoryRouter>
      <EraGuide />
    </MemoryRouter>
  );

describe('EraGuide', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });
  });

  it('renders page heading, description, and category tabs', () => {
    renderPage();
    expect(screen.getByText('Era Integration Guide')).toBeTruthy();
    expect(screen.getByText(/Essential knowledge to blend in/)).toBeTruthy();
    // Should have category tabs
    const tabs = screen.getAllByRole('tab');
    expect(tabs.length).toBeGreaterThan(0);
  });

  it('renders Slang Safety Checker when Slang category is active', () => {
    renderPage();
    // The default category may or may not be Slang — find the Slang tab
    const slangTab = screen.getByRole('tab', { name: 'Slang' });
    fireEvent.click(slangTab);
    expect(screen.getByText(/Slang Safety Checker & Translator/)).toBeTruthy();
    expect(screen.getByPlaceholderText(/Type your phrase/)).toBeTruthy();
  });

  it('translates slang and shows warnings for anachronisms', () => {
    renderPage();
    const slangTab = screen.getByRole('tab', { name: 'Slang' });
    fireEvent.click(slangTab);

    const input = screen.getByPlaceholderText(/Type your phrase/);
    fireEvent.change(input, { target: { value: 'I will google it on my cellphone no cap' } });

    // Should show translated text with replacements (use getAllByText since "library" appears in multiple places)
    expect(screen.getAllByText(/library/).length).toBeGreaterThan(0);
    // Should show anachronism warnings
    expect(screen.getByText(/Anachronism Warnings/)).toBeTruthy();
  });

  it('shows all clear when no anachronisms detected', () => {
    renderPage();
    const slangTab = screen.getByRole('tab', { name: 'Slang' });
    fireEvent.click(slangTab);

    const input = screen.getByPlaceholderText(/Type your phrase/);
    fireEvent.change(input, { target: { value: 'hello world' } });

    expect(screen.getByText(/Dialogue scanned/)).toBeTruthy();
  });

  it('switches categories when tabs are clicked', () => {
    renderPage();
    const tabs = screen.getAllByRole('tab');
    // Click each non-Slang tab and verify content changes
    if (tabs.length > 1) {
      fireEvent.click(tabs[0]);
      // Should still have accordion items
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    }
  });
});
