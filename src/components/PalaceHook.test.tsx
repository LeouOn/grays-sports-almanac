import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PalaceHook } from './PalaceHook';
import athenaStatic from '../data/athena-static.json';

describe('PalaceHook', () => {
  it('renders the precomputed mnemonic for a known routeId', () => {
    const routeId = Object.keys(athenaStatic.mnemonics)[0];
    const expected = (athenaStatic.mnemonics as Record<string, string>)[routeId];
    render(<PalaceHook routeId={routeId} />);
    expect(screen.getByText(/Hook:/i)).toBeTruthy();
    expect(screen.getByText(new RegExp(expected.slice(0, 20)))).toBeTruthy();
  });

  it('renders nothing when routeId is not in the static bank', () => {
    const { container } = render(<PalaceHook routeId="nonexistent-route-id-xyz" />);
    expect(container.firstChild).toBeNull();
  });

  it('has no async behavior (no loading state, no spinner)', () => {
    const routeId = Object.keys(athenaStatic.mnemonics)[0];
    render(<PalaceHook routeId={routeId} />);
    expect(screen.queryByText(/thinking/i)).toBeNull();
    expect(screen.queryByText(/loading/i)).toBeNull();
  });
});
