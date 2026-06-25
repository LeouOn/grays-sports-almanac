import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { DisasterPrevention } from './DisasterPrevention';
import React from 'react';

const mockFetch = vi.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve([]),
});
vi.stubGlobal('fetch', mockFetch);

const renderPage = () =>
  render(
    <MemoryRouter>
      <DisasterPrevention />
    </MemoryRouter>
  );

describe('DisasterPrevention', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });
  });

  it('renders page heading, description, and search input', () => {
    renderPage();
    expect(screen.getByText('Disaster Prevention & Mitigation')).toBeTruthy();
    expect(screen.getByText(/Preventable tragedies/)).toBeTruthy();
    expect(screen.getByPlaceholderText('Search by event, location, or category...')).toBeTruthy();
  });

  it('renders disaster entries in accordion', () => {
    renderPage();
    // Should render accordion items with disaster data
    const buttons = screen.getAllByRole('button');
    // At least the accordion triggers should exist
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('filters disasters when typing in search', () => {
    renderPage();
    const input = screen.getByPlaceholderText('Search by event, location, or category...');
    fireEvent.change(input, { target: { value: 'xyznonexistent' } });
    expect(screen.getByText('No disasters matching your search.')).toBeTruthy();
  });

  it('renders specific named disasters on load', () => {
    renderPage();
    // Specific entries from src/data/disasters.ts should all appear in the
    // initial accordion list.
    expect(screen.getByText('Tenerife Airport Disaster')).toBeTruthy();
    expect(screen.getByText('Chernobyl Nuclear Disaster')).toBeTruthy();
    expect(screen.getByText('Bhopal Gas Tragedy')).toBeTruthy();
    expect(screen.getByText('Apollo 1 Fire')).toBeTruthy();
  });

  it('renders location and date metadata for specific entries', () => {
    renderPage();
    // Each disaster card shows its location string.
    expect(screen.getByText(/Tenerife, Canary Islands/)).toBeTruthy();
    expect(screen.getByText(/Pripyat, Ukrainian SSR/)).toBeTruthy();
    expect(screen.getByText(/Bhopal, Madhya Pradesh, India/)).toBeTruthy();
  });

  it('renders butterfly risk badges with the 🦋 suffix', () => {
    renderPage();
    // The page renders `{e.butterflyRisk} 🦋 Risk` for every entry.
    // The Chernobyl entry has High risk; HIV/AIDS Early Warning and
    // September 11 Attacks both have Extreme.
    expect(screen.getAllByText(/🦋 Risk/).length).toBeGreaterThan(10);
    expect(screen.getAllByText('Extreme 🦋 Risk').length).toBeGreaterThan(0);
    expect(screen.getAllByText('High 🦋 Risk').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Low 🦋 Risk').length).toBeGreaterThan(0);
  });

  it('renders category icon glyphs from each category', () => {
    renderPage();
    // categoryIcons mapping: Aviation ✈️, Industrial 🏭, Natural 🌪️,
    // Terrorism ⚠️, Public Health 🦠. At least one of each should render
    // because the dataset has disasters in every category.
    expect(screen.getAllByText('✈️').length).toBeGreaterThan(0);
    expect(screen.getAllByText('🏭').length).toBeGreaterThan(0);
    expect(screen.getAllByText('🌪️').length).toBeGreaterThan(0);
    expect(screen.getAllByText('⚠️').length).toBeGreaterThan(0);
    expect(screen.getAllByText('🦠').length).toBeGreaterThan(0);
  });

  it('filters to a specific disaster when searching by its name', () => {
    renderPage();
    const input = screen.getByPlaceholderText('Search by event, location, or category...');
    fireEvent.change(input, { target: { value: 'chernobyl' } });
    // The filtered result keeps the matching entry.
    expect(screen.getByText('Chernobyl Nuclear Disaster')).toBeTruthy();
    // Other disasters should be hidden.
    expect(screen.queryByText('Tenerife Airport Disaster')).toBeNull();
    expect(screen.queryByText('Bhopal Gas Tragedy')).toBeNull();
    expect(screen.queryByText('Apollo 1 Fire')).toBeNull();
  });

  it('filters by category when searching for the category name', () => {
    renderPage();
    const input = screen.getByPlaceholderText('Search by event, location, or category...');
    fireEvent.change(input, { target: { value: 'Public Health' } });
    // Public Health entries should remain visible.
    expect(screen.getByText('HIV/AIDS Early Warning')).toBeTruthy();
    // Aviation entries should be filtered out.
    expect(screen.queryByText('Tenerife Airport Disaster')).toBeNull();
    expect(screen.queryByText('Apollo 1 Fire')).toBeNull();
  });
});
