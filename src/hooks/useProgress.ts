import { useState, useEffect, useCallback } from 'react';

export interface ProgressEntry {
  id: string;
  module: string;
  entries_viewed: number;
  total_entries: number;
  quiz_score: number | null;
  quiz_total: number | null;
  last_activity: string | null;
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(() => {
    fetch('/api/features/progress')
      .then(res => res.json())
      .then((data: ProgressEntry[]) => {
        setProgress(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/features/progress')
      .then(res => res.json())
      .then((data: ProgressEntry[]) => {
        if (!cancelled) {
          setProgress(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const overallPercentage = (() => {
    if (progress.length === 0) return 0;
    const totalViewed = progress.reduce((sum, p) => sum + p.entries_viewed, 0);
    const totalEntries = progress.reduce((sum, p) => sum + p.total_entries, 0);
    if (totalEntries === 0) return 0;
    return Math.round((totalViewed / totalEntries) * 100);
  })();

  const updateProgress = useCallback(async (
    module: string,
    entriesViewed: number,
    totalEntries: number,
    quizScore?: number,
    quizTotal?: number,
  ) => {
    const body: Record<string, number> = {
      entries_viewed: entriesViewed,
      total_entries: totalEntries,
    };
    if (quizScore !== undefined) body.quiz_score = quizScore;
    if (quizTotal !== undefined) body.quiz_total = quizTotal;

    const res = await fetch(`/api/features/progress/${encodeURIComponent(module)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const updated: ProgressEntry = await res.json();
      setProgress(prev => {
        const idx = prev.findIndex(p => p.module === module);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = updated;
          return next;
        }
        return [updated, ...prev];
      });
    }
  }, []);

  return { progress, loading, updateProgress, refresh: fetchProgress, overallPercentage };
}
