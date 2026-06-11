import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { BootstrapBlueprints } from './BootstrapBlueprints';
import { CompanionProvider } from '../context/CompanionContext';
import React from 'react';

const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <CompanionProvider>{ui}</CompanionProvider>
    </MemoryRouter>
  );
};

describe('BootstrapBlueprints Page Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders page titles, search inputs, and category tabs', () => {
    renderWithProvider(<BootstrapBlueprints />);
    expect(screen.getByText('Bootstrap Blueprints & Specs')).toBeTruthy();
    expect(screen.getByPlaceholderText('Search blueprints, materials, or rules...')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Semiconductors' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Machine Tooling' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Electronics' })).toBeTruthy();
  });

  it('renders all default blueprint cards', () => {
    renderWithProvider(<BootstrapBlueprints />);
    expect(screen.getByText('Silicon Crystal Pulling (Czochralski Method)')).toBeTruthy();
    expect(screen.getByText('Optical Reduction Photolithography (Step-and-Repeat)')).toBeTruthy();
    expect(screen.getByText('Precision Ball Screws & Closed-Loop CNC Control')).toBeTruthy();
    expect(screen.getByText('Silicon Planar Process (Hoerni Planar Transistor)')).toBeTruthy();
  });

  it('filters cards when a category button is clicked', () => {
    renderWithProvider(<BootstrapBlueprints />);

    // Click "Machine Tooling" category button
    const btn = screen.getByRole('button', { name: 'Machine Tooling' });
    fireEvent.click(btn);

    // Ball Screws (Machine Tooling) should be visible
    expect(screen.getByText('Precision Ball Screws & Closed-Loop CNC Control')).toBeTruthy();

    // Czochralski method (Semiconductors) should NOT be visible
    expect(screen.queryByText('Silicon Crystal Pulling (Czochralski Method)')).toBeNull();
  });

  it('filters cards based on text search query', () => {
    renderWithProvider(<BootstrapBlueprints />);

    const searchInput = screen.getByPlaceholderText('Search blueprints, materials, or rules...');
    fireEvent.change(searchInput, { target: { value: 'planar' } });

    // Planar Process should be visible
    expect(screen.getByText('Silicon Planar Process (Hoerni Planar Transistor)')).toBeTruthy();

    // Photolithography should NOT be visible
    expect(screen.queryByText('Optical Reduction Photolithography (Step-and-Repeat)')).toBeNull();
  });

  it('opens details modal when View Specifications is clicked', () => {
    renderWithProvider(<BootstrapBlueprints />);

    // Find and click View Specifications for Czochralski silicon
    const buttons = screen.getAllByRole('button', { name: 'View Specifications' });
    // First button corresponds to Czochralski (order of display)
    fireEvent.click(buttons[0]);

    // Check modal header is displayed
    expect(screen.getByRole('heading', { name: 'Silicon Crystal Pulling (Czochralski Method)' })).toBeTruthy();

    // Check modal tabs are rendered
    expect(screen.getByRole('button', { name: /General Specs/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Build Guide/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Chrono Impact/ })).toBeTruthy();

    // Verify materials lists in General Specs
    expect(screen.getByText(/Refined polycrystalline silicon/)).toBeTruthy();

    // Click close button
    const closeBtn = screen.getByRole('button', { name: 'Close Blueprint' });
    fireEvent.click(closeBtn);

    // Modal should be gone
    expect(screen.queryByRole('heading', { name: 'Silicon Crystal Pulling (Czochralski Method)' })).toBeNull();
  });
});
