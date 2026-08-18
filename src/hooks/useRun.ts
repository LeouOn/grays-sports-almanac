import { useState, useCallback } from 'react';

export interface Meters { capital: number; reputation: number; temporalRisk: number }
export interface Choice { id: string; text: string; effects: Partial<Meters> }
export interface Beat {
  index: number;
  type: 'scenario' | 'knowledge_check' | 'finale';
  title: string;
  narrative: string;
  choices: Choice[];
  knowledgeCheck?: { question: string; options: string[]; correctIndex: number; sourceArticle: string };
  companionQuip?: string;
}
export interface RunState {
  runId: string; era: string; companionId: string;
  beatIndex: number; totalBeats: number;
  meters: Meters; outcome: 'active' | 'retired' | 'exiled';
  checksAsked: number; checksCorrect: number;
}

type Phase = 'setup' | 'playing' | 'summary';

async function post<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? `HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

export function useRun(companionId: string) {
  const [phase, setPhase] = useState<Phase>('setup');
  const [run, setRun] = useState<RunState | null>(null);
  const [beat, setBeat] = useState<Beat | null>(null);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState<number | null>(null);

  const start = useCallback(async (era: string) => {
    const data = await post<{ run: RunState; beat: Beat }>('/api/run/start', { era, companionId });
    setRun(data.run); setBeat(data.beat); setCorrect(null); setScore(null);
    setPhase('playing');
  }, [companionId]);

  const choose = useCallback(async (choiceId: string) => {
    if (!run) return;
    const data = await post<{ run: RunState; beat: Beat | null }>(`/api/run/${run.runId}/choice`, { choiceId });
    setRun(data.run); setBeat(data.beat); setCorrect(null);
    if (data.run.outcome !== 'active') setPhase('summary');
  }, [run]);

  const answer = useCallback(async (answerIndex: number) => {
    if (!run) return;
    const data = await post<{ correct: boolean; run: RunState; beat: Beat | null }>(`/api/run/${run.runId}/knowledge-check`, { answerIndex });
    setRun(data.run); setBeat(data.beat); setCorrect(data.correct);
    if (data.run.outcome !== 'active') setPhase('summary');
  }, [run]);

  const retire = useCallback(async () => {
    if (!run) return;
    const data = await post<{ run: RunState; score: number }>(`/api/run/${run.runId}/retire`);
    setRun(data.run); setScore(data.score); setPhase('summary');
  }, [run]);

  const reset = useCallback(() => {
    setPhase('setup'); setRun(null); setBeat(null); setCorrect(null); setScore(null);
  }, []);

  return { phase, run, beat, correct, score, start, choose, answer, retire, reset };
}