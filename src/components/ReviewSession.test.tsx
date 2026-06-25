import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

// Hoisted: the hook is replaced wholesale, so its mock factory just needs to
// return an object whose `.useSpacedRepetition` is a vi.fn we control per test.
const { hookMock } = vi.hoisted(() => ({
  hookMock: { useSpacedRepetition: vi.fn() },
}));

vi.mock('@/hooks/useSpacedRepetition', () => hookMock);

import { ReviewSession } from '@/components/ReviewSession';
import type { SpacedRepetitionItem } from '@/hooks/useSpacedRepetition';

const sampleReviews: SpacedRepetitionItem[] = [
  {
    id: 'r1',
    topic: 'Quantum Mechanics',
    competence: 3,
    next_review: '2024-01-01',
    interval_days: 5,
    review_count: 2,
    last_reviewed: '2023-12-27',
  },
  {
    id: 'r2',
    topic: 'Renaissance Art',
    competence: 2,
    next_review: '2024-01-02',
    interval_days: 3,
    review_count: 1,
    last_reviewed: '2023-12-30',
  },
];

function renderReview() {
  return render(
    <MemoryRouter>
      <ReviewSession />
    </MemoryRouter>,
  );
}

describe('ReviewSession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders a loading state while the hook reports loading', () => {
    hookMock.useSpacedRepetition.mockReturnValue({
      dueReviews: [],
      dueCount: 0,
      loading: true,
      submitReview: vi.fn(),
      refresh: vi.fn(),
    });

    renderReview();

    expect(screen.getByText(/Loading review session/i)).toBeTruthy();
  });

  it('renders the "No Reviews Due" empty state when dueCount is zero', () => {
    hookMock.useSpacedRepetition.mockReturnValue({
      dueReviews: [],
      dueCount: 0,
      loading: false,
      submitReview: vi.fn(),
      refresh: vi.fn(),
    });

    renderReview();

    expect(screen.getByText('No Reviews Due')).toBeTruthy();
    expect(screen.getByText(/all caught up/i)).toBeTruthy();
    // Return-to-dashboard link is present
    expect(screen.getByText('Return to Dashboard')).toBeTruthy();
  });

  it('renders the first review card with progress indicator when due items exist', () => {
    hookMock.useSpacedRepetition.mockReturnValue({
      dueReviews: sampleReviews,
      dueCount: 2,
      loading: false,
      submitReview: vi.fn(),
      refresh: vi.fn(),
    });

    renderReview();

    // Topic name appears as the card title
    expect(screen.getByText('Quantum Mechanics')).toBeTruthy();
    // Progress counter "1 of 2"
    expect(screen.getByText('1 of 2')).toBeTruthy();
    // Metadata — last reviewed date + interval days + review count
    expect(screen.getByText(/Last reviewed:/)).toBeTruthy();
    expect(screen.getByText(/Interval: 5 days/)).toBeTruthy();
    expect(screen.getByText(/Reviews: 2/)).toBeTruthy();
  });

  it('clicking "Got it" calls submitReview with the topic and true, then advances to the next card', async () => {
    const submitReview = vi.fn().mockResolvedValue(true);
    hookMock.useSpacedRepetition.mockReturnValue({
      dueReviews: sampleReviews,
      dueCount: 2,
      loading: false,
      submitReview,
      refresh: vi.fn(),
    });

    renderReview();
    fireEvent.click(screen.getByText('Got it'));

    await waitFor(() => {
      expect(submitReview).toHaveBeenCalledWith('Quantum Mechanics', true);
    });

    // The component navigates by currentIndex — even though the mocked
    // dueReviews array is static, the component reads dueReviews[1] next.
    expect(screen.getByText('Renaissance Art')).toBeTruthy();
    expect(screen.getByText('2 of 2')).toBeTruthy();
  });

  it('clicking "Missed it" calls submitReview with the topic and false', async () => {
    const submitReview = vi.fn().mockResolvedValue(true);
    hookMock.useSpacedRepetition.mockReturnValue({
      dueReviews: [sampleReviews[0]],
      dueCount: 1,
      loading: false,
      submitReview,
      refresh: vi.fn(),
    });

    renderReview();
    fireEvent.click(screen.getByText('Missed it'));

    await waitFor(() => {
      expect(submitReview).toHaveBeenCalledWith('Quantum Mechanics', false);
    });
  });

  it('transitions to "Session Complete" after the last review with correct stats', async () => {
    const submitReview = vi.fn().mockResolvedValue(true);
    hookMock.useSpacedRepetition.mockReturnValue({
      dueReviews: [sampleReviews[0]],
      dueCount: 1,
      loading: false,
      submitReview,
      refresh: vi.fn(),
    });

    renderReview();
    fireEvent.click(screen.getByText('Got it'));

    await waitFor(() => {
      expect(screen.getByText('Session Complete')).toBeTruthy();
    });
    expect(screen.getByText('You reviewed 1 topic')).toBeTruthy();
    // 1 correct out of 1 reviewed = 100% accuracy
    expect(screen.getByText('100%')).toBeTruthy();
    // Reviewed + Correct stats
    expect(screen.getByText('Reviewed').textContent).toBe('Reviewed');
  });

  it('shows mixed stats when one correct and one incorrect review is recorded', async () => {
    const submitReview = vi.fn().mockResolvedValue(true);
    hookMock.useSpacedRepetition.mockReturnValue({
      dueReviews: sampleReviews,
      dueCount: 2,
      loading: false,
      submitReview,
      refresh: vi.fn(),
    });

    renderReview();
    // First: Got it (correct)
    fireEvent.click(screen.getByText('Got it'));
    await waitFor(() => {
      expect(screen.getByText('Renaissance Art')).toBeTruthy();
    });
    // Second: Missed it (incorrect)
    fireEvent.click(screen.getByText('Missed it'));

    await waitFor(() => {
      expect(screen.getByText('Session Complete')).toBeTruthy();
    });
    expect(screen.getByText('You reviewed 2 topics')).toBeTruthy();
    // 1/2 correct = 50% accuracy
    expect(screen.getByText('50%')).toBeTruthy();
  });

  it('disables the Got it / Missed it buttons while submit is in flight', async () => {
    let resolveSubmit: (ok: boolean) => void = () => {};
    const submitReview = vi.fn(
      () =>
        new Promise<boolean>((resolve) => {
          resolveSubmit = resolve;
        }),
    );
    hookMock.useSpacedRepetition.mockReturnValue({
      dueReviews: sampleReviews,
      dueCount: 2,
      loading: false,
      submitReview,
      refresh: vi.fn(),
    });

    renderReview();
    fireEvent.click(screen.getByText('Got it'));

    // While the submit promise is pending, both buttons should be disabled
    await waitFor(() => {
      expect(
        (screen.getByText('Got it').closest('button') as HTMLButtonElement)
          .disabled,
      ).toBe(true);
    });
    expect(
      (screen.getByText('Missed it').closest('button') as HTMLButtonElement)
        .disabled,
    ).toBe(true);

    // Resolve to clean up
    resolveSubmit(true);
  });
});