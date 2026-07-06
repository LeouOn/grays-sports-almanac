import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { ShareButton } from './ShareButton';

// Mock the share helper so we can assert it was called with the right args
// without touching the real Capacitor/Web Share code.
const shareMock = vi.fn();
vi.mock('@/lib/share', () => ({
  share: (...args: unknown[]) => shareMock(...args),
}));

const showSuccessMock = vi.fn();
const showErrorMock = vi.fn();
vi.mock('@/lib/toast', () => ({
  showSuccess: (...args: unknown[]) => showSuccessMock(...args),
  showError: (...args: unknown[]) => showErrorMock(...args),
}));

describe('ShareButton', () => {
  beforeEach(() => {
    shareMock.mockReset();
    showSuccessMock.mockReset();
    showErrorMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders a button with an accessible share label', () => {
    render(<ShareButton title="Berlin Wall" text="A historic event" />);
    const btn = screen.getByRole('button', { name: /share berlin wall/i });
    expect(btn).toBeTruthy();
  });

  it('calls share() with the provided title and text on click', async () => {
    shareMock.mockResolvedValueOnce(undefined);
    render(<ShareButton title="Berlin Wall" text="A historic event" />);

    await fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(shareMock).toHaveBeenCalledTimes(1);
    });
    expect(shareMock).toHaveBeenCalledWith({
      title: 'Berlin Wall',
      text: 'A historic event',
    });
  });

  it('shows a success toast after a successful share', async () => {
    shareMock.mockResolvedValueOnce(undefined);
    render(<ShareButton title="X" text="Y" />);

    await fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(showSuccessMock).toHaveBeenCalledWith('Shared!');
    });
  });

  it('shows an error toast when share rejects', async () => {
    shareMock.mockRejectedValueOnce(new Error('share failed'));
    render(<ShareButton title="X" text="Y" />);

    await fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(showErrorMock).toHaveBeenCalledWith('Failed to share');
    });
    expect(showSuccessMock).not.toHaveBeenCalled();
  });
});
