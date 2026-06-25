import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ErrorBoundary } from './ErrorBoundary';

function ThrowingChild(): JSX.Element {
  throw new Error('Test explosion');
}

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <p>All clear</p>
      </ErrorBoundary>,
    );
    expect(screen.getByText('All clear')).toBeTruthy();
  });

  it('renders fallback UI when a child throws', () => {
    // Suppress console.error from React's error boundary logging
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <MemoryRouter>
        <ErrorBoundary>
          <ThrowingChild />
        </ErrorBoundary>
      </MemoryRouter>,
    );
    expect(screen.getByText(/Temporal Anomaly Detected/i)).toBeTruthy();
    expect(screen.getByText('Something went wrong.')).toBeTruthy();
    expect(screen.getByText('Return to Safety')).toBeTruthy();
    spy.mockRestore();
  });
});
