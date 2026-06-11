import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ButterflyCalculator } from './ButterflyCalculator';

describe('ButterflyCalculator Component', () => {
  it('renders instructions and pickers', () => {
    render(<ButterflyCalculator />);
    expect(screen.getByText('Butterfly Risk Calculator')).toBeTruthy();
    expect(screen.getByText(/Select one option from each category/)).toBeTruthy();
  });

  it('calculates the correct risk score and level when options are selected', () => {
    render(<ButterflyCalculator />);

    // Select Visibility: Anonymous dead drop (score 1)
    const visBtn = screen.getByText('Anonymous dead drop / mailed letter');
    fireEvent.click(visBtn);

    // Select Temporal: >10 years (score 1)
    const tempBtn = screen.getByText('>10 years before documented discovery');
    fireEvent.click(tempBtn);

    // Select Reversibility: Pure information (score 1)
    const revBtn = screen.getByText('Pure information — recipient can ignore it');
    fireEvent.click(revBtn);

    // Select Connectedness: Affects <100 people (score 1)
    const connBtn = screen.getByText('Affects <100 people directly');
    fireEvent.click(connBtn);

    // Score should be 1 * 1 * 1 * 1 = 1 (SAFE)
    expect(screen.getByText('1')).toBeTruthy();
    expect(screen.getByText('🟢 SAFE')).toBeTruthy();
  });

  it('calculates extreme risk when highly disruptive options are selected', () => {
    render(<ButterflyCalculator />);

    // Select Visibility: Public figure (score 5)
    fireEvent.click(screen.getByText('Public figure / media appearance'));

    // Select Temporal: <2 years (score 5)
    fireEvent.click(screen.getByText('<2 years — you might BE the discovery event'));

    // Select Reversibility: Infrastructure changed (score 5)
    fireEvent.click(screen.getByText('Infrastructure changed / people moved'));

    // Select Connectedness: Cascading global effects (score 5)
    fireEvent.click(screen.getByText('Cascading global effects'));

    // Score should be 5 * 5 * 5 * 5 = 625 (EXTREME)
    expect(screen.getByText('625')).toBeTruthy();
    expect(screen.getByText('🔴 EXTREME')).toBeTruthy();
  });
});
