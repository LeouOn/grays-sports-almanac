import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TemporalMap } from './TemporalMap';
import { CompanionProvider } from '../context/CompanionContext';
import React from 'react';

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<CompanionProvider>{ui}</CompanionProvider>);
};

describe('TemporalMap Expansion Component (1990–2001)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders timeline year groupings and search items up to 2001', () => {
    renderWithProvider(<TemporalMap />);
    // Check that some years in the expanded range (e.g. 1993, 2001) are listed on the timeline
    expect(screen.getAllByText('1993')).toBeTruthy();
    expect(screen.getAllByText('2001')).toBeTruthy();

    // Check that some specific expanded events appear in the list
    expect(screen.getByText('September 11 Attacks')).toBeTruthy();
    expect(screen.getByText('Y2K Bug Computer Crisis')).toBeTruthy();
    expect(screen.getByText('World Wide Web Protocols (HTML/HTTP)')).toBeTruthy();
  });

  it('allows ticking Y2K and 9/11 events to calculate simulated lives saved and risk score', () => {
    renderWithProvider(<TemporalMap />);

    // Initially stats should be empty
    expect(screen.getByTestId('stats-lives-saved').textContent).toBe('0');
    expect(screen.getByTestId('stats-risk-distortion').textContent).toBe('0');

    // Select Y2K Bug (lives saved: 0, risk: Low = 1)
    const y2kCheckbox = screen.getByTestId('checkbox-y2k-bug');
    fireEvent.click(y2kCheckbox);

    // Verify Y2K updates risk index to 1, lives saved stays 0
    expect(screen.getByTestId('stats-lives-saved').textContent).toBe('0');
    expect(screen.getByTestId('stats-risk-distortion').textContent).toBe('1');

    // Select September 11 Attacks (lives saved: 2977, risk: Extreme = 10)
    const sep11Checkbox = screen.getByTestId('checkbox-sept-11-attacks');
    fireEvent.click(sep11Checkbox);

    // Verify total lives saved is 2,977 and risk index is 11 (1 + 10)
    expect(screen.getByTestId('stats-lives-saved').textContent).toBe('2,977');
    expect(screen.getByTestId('stats-risk-distortion').textContent).toBe('11');
    expect(screen.getByText('🟡 Stable - Monitor timelines')).toBeTruthy();
  });
});
