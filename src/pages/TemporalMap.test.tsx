import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TemporalMap } from './TemporalMap';
import { CompanionProvider } from '../context/CompanionContext';
import React from 'react';

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<CompanionProvider>{ui}</CompanionProvider>);
};

describe('TemporalMap Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders page titles and filter options', () => {
    renderWithProvider(<TemporalMap />);
    expect(screen.getByText('Temporal Strategy Map & Timeline')).toBeTruthy();
    expect(screen.getByText('Search & Filters')).toBeTruthy();
    expect(screen.getByText('Simulated Plan Summary')).toBeTruthy();
  });

  it('renders timeline year groupings and search items', () => {
    renderWithProvider(<TemporalMap />);
    // Check that some years (e.g. 1977, 1986) are listed on the timeline
    expect(screen.getAllByText('1977')).toBeTruthy();
    expect(screen.getAllByText('1986')).toBeTruthy();

    // Check that some specific events appear in the merged list
    expect(screen.getByText('Tenerife Airport Disaster')).toBeTruthy();
    expect(screen.getByText('TCP/IP & Internet Architecture')).toBeTruthy();
  });

  it('filters list based on search queries', () => {
    renderWithProvider(<TemporalMap />);

    // Search for "Tenerife"
    const input = screen.getByPlaceholderText('Search events or tools...');
    fireEvent.change(input, { target: { value: 'Tenerife' } });

    // Tenerife should be visible
    expect(screen.getByText('Tenerife Airport Disaster')).toBeTruthy();

    // Space Shuttle Challenger should NOT be visible under search
    expect(screen.queryByText('Space Shuttle Challenger Disaster')).toBeNull();
  });

  it('allows ticking events to calculate simulated lives saved and risk score', () => {
    renderWithProvider(<TemporalMap />);

    // Initially stats should be empty
    expect(screen.getByTestId('stats-lives-saved').textContent).toBe('0');
    expect(screen.getByTestId('stats-risk-distortion').textContent).toBe('0');

    // Select Tenerife Airport Disaster (lives saved: 583, risk: Low = 1)
    const tenerifeCheckbox = screen.getByTestId('checkbox-tenerife');
    fireEvent.click(tenerifeCheckbox);

    // Verify lives saved is updated to 583 and risk index is 1
    expect(screen.getByTestId('stats-lives-saved').textContent).toBe('583');
    expect(screen.getByTestId('stats-risk-distortion').textContent).toBe('1');
    expect(screen.getByText('🟢 Safe - Minor divergence')).toBeTruthy();
  });

  it('selects multiple interventions and calculates metrics and warnings', () => {
    renderWithProvider(<TemporalMap />);

    // Select TCP/IP & Internet Architecture (risk: High = 5)
    const tcpCheckbox = screen.getByTestId('checkbox-tcp-ip');
    fireEvent.click(tcpCheckbox);

    // Select Recombinant DNA / Genetic Engineering (risk: Medium = 3)
    const dnaCheckbox = screen.getByTestId('checkbox-recombinant-dna');
    fireEvent.click(dnaCheckbox);

    // Total risk should be 5 + 3 = 8
    expect(screen.getByTestId('stats-risk-distortion').textContent).toBe('8');
    expect(screen.getByText('🟡 Stable - Monitor timelines')).toBeTruthy();

    // Verify warning for Multi-Vector Tech Wave is present
    expect(screen.getAllByText(/⚠️ Multi-Vector Technology Wave/).length).toBeGreaterThan(0);

    // Reset plan
    const clearBtn = screen.getByText('Clear Queue');
    fireEvent.click(clearBtn);

    // Stats should reset to 0
    expect(screen.getByTestId('stats-lives-saved').textContent).toBe('0');
    expect(screen.getByTestId('stats-risk-distortion').textContent).toBe('0');
  });
});
