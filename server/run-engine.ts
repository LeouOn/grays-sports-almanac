import { z } from 'zod';

export const ERA_IDS = ['1950s', '1960s', '1970s', '1980s', '1990s', '2000s'] as const;
export type EraId = (typeof ERA_IDS)[number];

export interface Meters {
  capital: number;
  reputation: number;
  temporalRisk: number;
}

export type BeatType = 'scenario' | 'knowledge_check' | 'finale';
export type RunOutcome = 'active' | 'retired' | 'exiled';

export interface Choice {
  id: string;
  text: string;
  effects: Partial<Meters>;
}

export interface KnowledgeCheck {
  question: string;
  options: string[];
  correctIndex: number;
  sourceArticle: string;
}

export interface Beat {
  index: number;
  type: BeatType;
  title: string;
  narrative: string;
  choices: Choice[];
  knowledgeCheck?: KnowledgeCheck;
  companionQuip?: string;
}

export interface RunState {
  runId: string;
  era: EraId;
  companionId: string;
  beatIndex: number;
  totalBeats: number;
  meters: Meters;
  outcome: RunOutcome;
  checksAsked: number;
  checksCorrect: number;
}

export class EngineError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EngineError';
  }
}

// Bounds on LLM-proposed effects — the engine's defense against narrative inflation.
const EffectsSchema = z.object({
  capital: z.number().int().min(-50).max(50).optional(),
  reputation: z.number().int().min(-15).max(15).optional(),
  temporalRisk: z.number().int().min(-10).max(15).optional(),
});

export const LlmScenarioSchema = z.object({
  title: z.string().min(1).max(120),
  narrative: z.string().min(1).max(2000),
  choices: z.array(z.object({
    id: z.enum(['a', 'b', 'c', 'd']),
    text: z.string().min(1).max(300),
    effects: EffectsSchema,
  })).min(2).max(4),
});

export const LlmKnowledgeCheckSchema = z.object({
  question: z.string().min(1).max(500),
  options: z.array(z.string().min(1).max(300)).length(4),
  correctIndex: z.number().int().min(0).max(3),
  sourceArticle: z.string().min(1),
});

const START_METERS: Meters = { capital: 100, reputation: 50, temporalRisk: 10 };
const TOTAL_BEATS = 10;
const RETIRE_MIN_BEAT = 6;

export function createRun(era: EraId, companionId: string, runId: string): RunState {
  return {
    runId, era, companionId,
    beatIndex: 0, totalBeats: TOTAL_BEATS,
    meters: { ...START_METERS },
    outcome: 'active', checksAsked: 0, checksCorrect: 0,
  };
}

export function nextBeatType(state: RunState): BeatType {
  if (state.beatIndex >= state.totalBeats - 1) return 'finale';
  if ((state.beatIndex + 1) % 3 === 0) return 'knowledge_check';
  return 'scenario';
}

export function canRetire(state: RunState): boolean {
  return state.outcome === 'active' && state.beatIndex >= RETIRE_MIN_BEAT;
}

function clampMeters(m: Meters): Meters {
  return {
    capital: Math.max(0, Math.round(m.capital)),
    reputation: Math.min(100, Math.max(0, Math.round(m.reputation))),
    temporalRisk: Math.min(100, Math.max(0, Math.round(m.temporalRisk))),
  };
}

function withOutcome(state: RunState): RunState {
  if (state.meters.temporalRisk >= 100) return { ...state, outcome: 'exiled' };
  if (state.beatIndex >= state.totalBeats) return { ...state, outcome: 'retired' };
  return state;
}

function assertActive(state: RunState): void {
  if (state.outcome !== 'active') throw new EngineError(`run ${state.runId} already ended (${state.outcome})`);
}

export function applyChoice(state: RunState, beat: Beat, choiceId: string): RunState {
  assertActive(state);
  const choice = beat.choices.find(c => c.id === choiceId);
  if (!choice) throw new EngineError(`unknown choice "${choiceId}" for beat ${beat.index}`);
  const meters = clampMeters({
    capital: state.meters.capital + (choice.effects.capital ?? 0),
    reputation: state.meters.reputation + (choice.effects.reputation ?? 0),
    temporalRisk: state.meters.temporalRisk + (choice.effects.temporalRisk ?? 0),
  });
  return withOutcome({ ...state, meters, beatIndex: state.beatIndex + 1 });
}

export function applyKnowledgeCheck(state: RunState, correct: boolean): RunState {
  assertActive(state);
  const meters = clampMeters({
    ...state.meters,
    reputation: state.meters.reputation + (correct ? 5 : -5),
    temporalRisk: state.meters.temporalRisk + (correct ? -5 : 3),
  });
  return withOutcome({
    ...state,
    meters,
    beatIndex: state.beatIndex + 1,
    checksAsked: state.checksAsked + 1,
    checksCorrect: state.checksCorrect + (correct ? 1 : 0),
  });
}

export function retireRun(state: RunState): RunState {
  assertActive(state);
  return { ...state, outcome: 'retired' };
}

export function computeScore(state: RunState): number {
  return Math.max(
    0,
    Math.round(state.meters.capital)
      + state.meters.reputation * 10
      - state.meters.temporalRisk * 5
      + state.checksCorrect * 50,
  );
}
