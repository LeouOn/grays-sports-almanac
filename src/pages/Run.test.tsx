import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router';
import { Run } from './Run';
import type { ReactNode } from 'react';

// Minimal CompanionContext mock — Run.tsx calls useCompanion(), which throws
// outside a CompanionProvider. Mirrors the pattern in Quiz.test.tsx.
vi.mock('@/context/CompanionContext', () => ({
  useCompanion: () => ({
    activeCompanion: { id: 'athena', name: 'Athena', avatar: '🦉', description: 'Test', prompt: '' },
  }),
  CompanionProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

const startResponse = {
  run: {
    runId: 'r1', era: '1980s', companionId: 'athena', beatIndex: 0, totalBeats: 10,
    meters: { capital: 100, reputation: 50, temporalRisk: 10 },
    outcome: 'active', checksAsked: 0, checksCorrect: 0,
  },
  beat: {
    index: 0, type: 'scenario', title: 'Arrival', narrative: 'You land in 1985.',
    choices: [{ id: 'a', text: 'Look around', effects: {} }],
  },
};

describe('Run page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('shows setup, starts a run, renders the first beat and HUD', async () => {
    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      if (String(input).endsWith('/api/run/start') && init?.method === 'POST') {
        return new Response(JSON.stringify(startResponse), { status: 201 });
      }
      return new Response('{}', { status: 200 });
    }));

    render(<MemoryRouter><Run /></MemoryRouter>);
    expect(screen.getByText(/choose your destination/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /^1980s$/i }));
    fireEvent.click(screen.getByRole('button', { name: /jump/i }));

    await waitFor(() => expect(screen.getByText('Arrival')).toBeInTheDocument());
    expect(screen.getByText('You land in 1985.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Look around' })).toBeInTheDocument();
    expect(screen.getByText(/temporal risk/i)).toBeInTheDocument();
  });

  it('shows knowledge-check feedback before advancing to the next beat', async () => {
    const kcBeat = {
      index: 0, type: 'knowledge_check', title: 'Knowledge Check', narrative: 'Prove it.',
      choices: [],
      knowledgeCheck: {
        question: 'Q?',
        options: ['w', 'x', 'y', 'z'],
        correctIndex: 1,
        sourceArticle: 'Test_Article',
      },
    };
    const kcStartResponse = {
      run: {
        runId: 'r1', era: '1980s', companionId: 'athena', beatIndex: 0, totalBeats: 10,
        meters: { capital: 100, reputation: 50, temporalRisk: 10 },
        outcome: 'active', checksAsked: 0, checksCorrect: 0,
      },
      beat: kcBeat,
    };
    const nextScenarioBeat = {
      index: 1, type: 'scenario', title: 'Next Scenario', narrative: 'Onward.',
      choices: [{ id: 'a', text: 'Go', effects: {} }],
    };
    const kcResponse = {
      correct: true,
      run: {
        runId: 'r1', era: '1980s', companionId: 'athena', beatIndex: 1, totalBeats: 10,
        meters: { capital: 100, reputation: 50, temporalRisk: 10 },
        outcome: 'active', checksAsked: 1, checksCorrect: 1,
      },
      beat: nextScenarioBeat,
    };

    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.endsWith('/api/run/start') && init?.method === 'POST') {
        return new Response(JSON.stringify(kcStartResponse), { status: 201 });
      }
      if (url.endsWith('/knowledge-check') && init?.method === 'POST') {
        return new Response(JSON.stringify(kcResponse), { status: 200 });
      }
      return new Response('{}', { status: 200 });
    }));

    render(<MemoryRouter><Run /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: /^1980s$/i }));
    fireEvent.click(screen.getByRole('button', { name: /jump/i }));

    await waitFor(() => expect(screen.getByText('Knowledge Check')).toBeInTheDocument());

    // Click the correct option (index 1 = 'x').
    fireEvent.click(screen.getByRole('button', { name: 'x' }));

    await waitFor(() => {
      expect(screen.getByText(/correct/i)).toBeInTheDocument();
      expect(screen.queryByText('Next Scenario')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    await waitFor(() => expect(screen.getByText('Next Scenario')).toBeInTheDocument());
  });
});