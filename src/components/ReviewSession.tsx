import { useState } from 'react';
import { Link } from 'react-router';
import { useSpacedRepetition, type SpacedRepetitionItem } from '../hooks/useSpacedRepetition';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

type SessionState = 'reviewing' | 'complete';

interface SessionStats {
  reviewed: number;
  correct: number;
}

export function ReviewSession() {
  const { dueReviews, dueCount, loading, submitReview } = useSpacedRepetition();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionState, setSessionState] = useState<SessionState>('reviewing');
  const [stats, setStats] = useState<SessionStats>({ reviewed: 0, correct: 0 });
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-20 text-neutral-400">Loading review session...</div>
      </div>
    );
  }

  if (dueCount === 0 && sessionState === 'reviewing') {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="sr-only">Review Session</h1>
        <div className="mb-6">
          <Link to="/" className="text-sm text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-1">
            <ArrowLeft className="size-3.5" /> Back to Dashboard
          </Link>
        </div>
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader className="text-center">
            <CardTitle className="text-white">No Reviews Due</CardTitle>
            <CardDescription className="text-neutral-400">
              You're all caught up! Come back later for more reviews.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Link to="/">
              <Button variant="secondary">Return to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (sessionState === 'complete') {
    const accuracy = stats.reviewed > 0 ? Math.round((stats.correct / stats.reviewed) * 100) : 0;
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="sr-only">Review Session</h1>
        <div className="mb-6">
          <Link to="/" className="text-sm text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-1">
            <ArrowLeft className="size-3.5" /> Back to Dashboard
          </Link>
        </div>
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader className="text-center">
            <CardTitle className="text-white">Session Complete</CardTitle>
            <CardDescription className="text-neutral-400">
              You reviewed {stats.reviewed} topic{stats.reviewed !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800">
                <div className="text-2xl font-bold text-white">{stats.reviewed}</div>
                <div className="text-xs text-neutral-400 mt-1">Reviewed</div>
              </div>
              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800">
                <div className="text-2xl font-bold text-emerald-400">{stats.correct}</div>
                <div className="text-xs text-neutral-400 mt-1">Correct</div>
              </div>
              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800">
                <div className="text-2xl font-bold text-indigo-400">{accuracy}%</div>
                <div className="text-xs text-neutral-400 mt-1">Accuracy</div>
              </div>
            </div>
            <div className="flex justify-center pt-2">
              <Link to="/">
                <Button variant="secondary">Return to Dashboard</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const current = dueReviews[currentIndex] as SpacedRepetitionItem | undefined;
  if (!current) {
    setSessionState('complete');
    return null;
  }

  const handleAnswer = async (isCorrect: boolean) => {
    setSubmitting(true);
    await submitReview(current.topic, isCorrect);
    const newStats = {
      reviewed: stats.reviewed + 1,
      correct: stats.correct + (isCorrect ? 1 : 0),
    };
    setStats(newStats);

    if (currentIndex + 1 >= dueCount) {
      setSessionState('complete');
    } else {
      setCurrentIndex(prev => prev + 1);
    }
    setSubmitting(false);
  };

  const lastReviewed = current.last_reviewed
    ? new Date(current.last_reviewed).toLocaleDateString()
    : 'Never';

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="sr-only">Review Session</h1>
      <div className="mb-6 flex items-center justify-between">
        <Link to="/" className="text-sm text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-1">
          <ArrowLeft className="size-3.5" /> Back to Dashboard
        </Link>
        <span className="text-xs text-neutral-500">
          {currentIndex + 1} of {dueCount}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-neutral-800 rounded-full mb-6">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all"
          style={{ width: `${((currentIndex) / dueCount) * 100}%` }}
        />
      </div>

      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-white text-lg">{current.topic}</CardTitle>
          <CardDescription className="text-neutral-400">
            Last reviewed: {lastReviewed} · Interval: {current.interval_days} day{current.interval_days !== 1 ? 's' : ''} · Reviews: {current.review_count}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-neutral-500 mb-6">
            Recall what you know about this topic, then rate your confidence.
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => handleAnswer(true)}
              disabled={submitting}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <CheckCircle className="size-4 mr-2" />
              Got it
            </Button>
            <Button
              onClick={() => handleAnswer(false)}
              disabled={submitting}
              variant="destructive"
              className="flex-1"
            >
              <XCircle className="size-4 mr-2" />
              Missed it
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 text-center text-xs text-neutral-600">
        Session: {stats.reviewed} reviewed, {stats.correct} correct
      </div>
    </div>
  );
}
