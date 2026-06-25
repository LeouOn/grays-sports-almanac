import { useState, useEffect, useCallback } from 'react';

export interface SpacedRepetitionItem {
  id: string;
  topic: string;
  competence: number;
  next_review: string;
  interval_days: number;
  review_count: number;
  last_reviewed: string | null;
}

export function useSpacedRepetition() {
  const [dueReviews, setDueReviews] = useState<SpacedRepetitionItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDueReviews = useCallback(() => {
    setLoading(true);
    fetch('/api/features/reviews')
      .then(res => res.json())
      .then((data: SpacedRepetitionItem[]) => {
        setDueReviews(data);
        setLoading(false);
      })
      .catch(() => {
        setDueReviews([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDueReviews();
  }, [fetchDueReviews]);

  const submitReview = useCallback(async (topic: string, isCorrect: boolean) => {
    const res = await fetch('/api/features/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, isCorrect }),
    });
    if (res.ok) {
      setDueReviews(prev => prev.filter(item => item.topic !== topic));
    }
    return res.ok;
  }, []);

  return {
    dueReviews,
    dueCount: dueReviews.length,
    loading,
    submitReview,
    refresh: fetchDueReviews,
  };
}
