import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { MedicalInterventions } from './MedicalInterventions';
import React from 'react';

const mockFetch = vi.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve([]),
});
vi.stubGlobal('fetch', mockFetch);

const renderPage = () =>
  render(
    <MemoryRouter>
      <MedicalInterventions />
    </MemoryRouter>
  );

describe('MedicalInterventions', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });
  });

  it('renders page heading, description, and search input', () => {
    renderPage();
    expect(screen.getByText('Medical Interventions')).toBeTruthy();
    expect(screen.getByText(/High-impact, low-butterfly medical knowledge/)).toBeTruthy();
    expect(screen.getByPlaceholderText('Search by condition, target, or details...')).toBeTruthy();
  });

  it('renders medical entries with risk badges', () => {
    renderPage();
    // Should have accordion triggers for medical entries
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
    // Should show color-coded risk badges (emoji + level concatenated via nested span)
    const isRiskBadge = (_: string, el: Element | null) =>
      /^(🟢|🟡|🟠|🔴)(Low|Medium|High|Extreme)$/.test(el?.textContent ?? '');
    expect(screen.getAllByText(isRiskBadge).length).toBeGreaterThan(0);
  });

  it('filters entries when typing non-matching search', () => {
    renderPage();
    const input = screen.getByPlaceholderText('Search by condition, target, or details...');
    fireEvent.change(input, { target: { value: 'xyznonexistent' } });
    expect(screen.getByText('No matches.')).toBeTruthy();
  });

  it('renders specific named conditions on load', () => {
    renderPage();
    // Specific entries from src/data/medical.ts.
    expect(screen.getByText("H. Pylori & Peptic Ulcers")).toBeTruthy();
    expect(screen.getByText('HIV/AIDS Early Warning & Response')).toBeTruthy();
    expect(screen.getByText("Reye's Syndrome / Aspirin Warning")).toBeTruthy();
    expect(screen.getByText('Thalidomide Teratogenicity Prevention')).toBeTruthy();
    expect(screen.getByText('CPR (Cardiopulmonary Resuscitation) Standardization')).toBeTruthy();
  });

  it('renders the "Intervene by YYYY" metadata for known entries', () => {
    renderPage();
    // Each card surfaces the optimalYear via `Intervene by {optimalYear}`.
    // 1979 (H. Pylori) and 1978 (HIV/AIDS) are each held by a single entry.
    expect(screen.getByText('Intervene by 1979')).toBeTruthy();
    expect(screen.getByText('Intervene by 1978')).toBeTruthy();
    // 1959 is shared by Thalidomide and Measles — both must render.
    expect(screen.getAllByText('Intervene by 1959').length).toBe(2);
  });

  it('renders estimated lives saved text for specific entries', () => {
    renderPage();
    // The green lives-saved text per card. Pick three representative strings
    // that come straight from the dataset.
    expect(screen.getByText(/Millions spared unnecessary surgery/)).toBeTruthy();
    expect(screen.getByText(/Potentially millions/)).toBeTruthy();
    expect(screen.getAllByText(/500-1,000\+ children/).length).toBeGreaterThan(0);
  });

  it('renders risk badges including the Extreme rating', () => {
    renderPage();
    // Most entries render `<RiskBadge>`. HIV/AIDS Early Warning is
    // the one Extreme entry.
    const isRiskBadge = (_: string, el: Element | null) =>
      /^(🟢|🟡|🟠|🔴)(Low|Medium|High|Extreme)$/.test(el?.textContent ?? '');
    expect(screen.getAllByText(isRiskBadge).length).toBeGreaterThan(10);
    expect(screen.getByText('Extreme')).toBeTruthy();
  });

  it('filters to a specific condition when searching by its name', () => {
    renderPage();
    const input = screen.getByPlaceholderText('Search by condition, target, or details...');
    fireEvent.change(input, { target: { value: 'thalidomide' } });
    // The matching condition stays visible.
    expect(screen.getByText('Thalidomide Teratogenicity Prevention')).toBeTruthy();
    // Other conditions are filtered out.
    expect(screen.queryByText('H. Pylori & Peptic Ulcers')).toBeNull();
    expect(screen.queryByText('CPR (Cardiopulmonary Resuscitation) Standardization')).toBeNull();
  });
});
