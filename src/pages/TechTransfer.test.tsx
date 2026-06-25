import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { TechTransfer } from './TechTransfer';
import React from 'react';

const mockFetch = vi.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve([]),
});
vi.stubGlobal('fetch', mockFetch);

const renderPage = () =>
  render(
    <MemoryRouter>
      <TechTransfer />
    </MemoryRouter>
  );

describe('TechTransfer', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });
  });

  it('renders page heading, description, and search input', () => {
    renderPage();
    expect(screen.getByText('Technology Transfer Strategy')).toBeTruthy();
    expect(screen.getByText(/What to send, to whom, and when/)).toBeTruthy();
    expect(screen.getByPlaceholderText('Search by concept, recipient, or impact...')).toBeTruthy();
  });

  it('renders tech transfer entries in accordion', () => {
    renderPage();
    // Should render accordion items with tech data
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('filters entries when typing non-matching search', () => {
    renderPage();
    const input = screen.getByPlaceholderText('Search by concept, recipient, or impact...');
    fireEvent.change(input, { target: { value: 'xyznonexistent' } });
    expect(screen.getByText('No matches.')).toBeTruthy();
  });

  it('renders specific named tech concepts on load', () => {
    renderPage();
    // Specific entries from src/data/tech-transfer.ts.
    expect(screen.getByText('TCP/IP & Internet Architecture')).toBeTruthy();
    expect(screen.getByText('Lithium-Ion Battery Prioritization')).toBeTruthy();
    expect(screen.getByText('CFC / Ozone Depletion Warning')).toBeTruthy();
    expect(screen.getByText('Public-Key Cryptography')).toBeTruthy();
    expect(screen.getByText('PageRank Search Engine Algorithm')).toBeTruthy();
  });

  it('renders the target recipient text for specific entries', () => {
    renderPage();
    // Each card surfaces `e.targetRecipient` directly.
    expect(screen.getByText(/Xerox PARC.*or DARPA/)).toBeTruthy();
    expect(screen.getByText(/Mario Molina and F. Sherwood Rowland at UC Irvine/)).toBeTruthy();
    expect(screen.getByText(/Larry Page and Sergey Brin at Stanford University/)).toBeTruthy();
    expect(screen.getByText(/Raytheon appliance division/)).toBeTruthy();
  });

  it('renders the "Send in YYYY" metadata for known entries', () => {
    renderPage();
    // 1975 is held by both TCP/IP and Public-Key Cryptography.
    expect(screen.getAllByText('Send in 1975').length).toBe(2);
    // 1990 is the single entry for the World Wide Web.
    expect(screen.getByText('Send in 1990')).toBeTruthy();
  });

  it('renders butterfly risk badges across the spectrum', () => {
    renderPage();
    // TCP/IP and PageRank are the two High-risk entries.
    expect(screen.getAllByText('High 🦋 Risk').length).toBe(2);
    // Multiple entries are Medium (Li-ion, Recombinant DNA, etc.).
    expect(screen.getAllByText('Medium 🦋 Risk').length).toBeGreaterThan(0);
    // Many entries are Low risk.
    expect(screen.getAllByText('Low 🦋 Risk').length).toBeGreaterThan(5);
  });

  it('filters to a specific concept when searching by its name', () => {
    renderPage();
    const input = screen.getByPlaceholderText('Search by concept, recipient, or impact...');
    fireEvent.change(input, { target: { value: 'polio' } });
    // The matching Polio Vaccine entry stays visible.
    expect(screen.getByText('Polio Vaccine Acceleration (Salk Inactivated)')).toBeTruthy();
    // Other tech concepts are filtered out.
    expect(screen.queryByText('TCP/IP & Internet Architecture')).toBeNull();
    expect(screen.queryByText('PageRank Search Engine Algorithm')).toBeNull();
    expect(screen.queryByText('Lithium-Ion Battery Prioritization')).toBeNull();
  });
});
