import { describe, it, expect } from 'vitest';
import {
  createRun, nextBeatType, canRetire, applyChoice, applyKnowledgeCheck,
  retireRun, computeScore, EngineError, LlmScenarioSchema, type Beat,
} from './run-engine.js';

const base = () => createRun('1980s', 'doc', 'run-1');

function scenarioBeat(index: number): Beat {
  return {
    index, type: 'scenario', title: 'T', narrative: 'N',
    choices: [
      { id: 'a', text: 'Safe', effects: { capital: 10, reputation: 5, temporalRisk: -2 } },
      { id: 'b', text: 'Risky', effects: { capital: 40, temporalRisk: 15 } },
    ],
  };
}

describe('createRun', () => {
  it('starts with default meters and 10 beats', () => {
    const s = base();
    expect(s.meters).toEqual({ capital: 100, reputation: 50, temporalRisk: 10 });
    expect(s.totalBeats).toBe(10);
    expect(s.outcome).toBe('active');
    expect(s.beatIndex).toBe(0);
  });
});

describe('nextBeatType', () => {
  it('is knowledge_check at indices 2, 5, 8 and finale at 9', () => {
    const expected = ['scenario','scenario','knowledge_check','scenario','scenario','knowledge_check','scenario','scenario','knowledge_check','finale'];
    expected.forEach((type, i) => {
      expect(nextBeatType({ ...base(), beatIndex: i })).toBe(type);
    });
  });
});

describe('applyChoice', () => {
  it('applies effects, clamps meters, advances beatIndex', () => {
    const s = applyChoice(base(), scenarioBeat(0), 'b');
    expect(s.meters).toEqual({ capital: 140, reputation: 50, temporalRisk: 25 });
    expect(s.beatIndex).toBe(1);
  });

  it('clamps reputation/risk to [0,100] and capital to >= 0', () => {
    const beat: Beat = { ...scenarioBeat(0), choices: [{ id: 'a', text: 'x', effects: { capital: -999, reputation: -999, temporalRisk: -999 } }] };
    const s = applyChoice(base(), beat, 'a');
    expect(s.meters).toEqual({ capital: 0, reputation: 0, temporalRisk: 0 });
  });

  it('exiles the run when temporalRisk reaches 100', () => {
    const beat: Beat = { ...scenarioBeat(0), choices: [{ id: 'a', text: 'x', effects: { temporalRisk: 95 } }] };
    const s = applyChoice(base(), beat, 'a');
    expect(s.outcome).toBe('exiled');
  });

  it('throws EngineError on unknown choice or ended run', () => {
    expect(() => applyChoice(base(), scenarioBeat(0), 'zzz')).toThrow(EngineError);
    const ended = retireRun({ ...base(), beatIndex: 7 });
    expect(() => applyChoice(ended, scenarioBeat(7), 'a')).toThrow(EngineError);
  });
});

describe('knowledge checks, retire, score', () => {
  it('applyKnowledgeCheck tracks asked/correct and advances', () => {
    let s = applyKnowledgeCheck(base(), true);
    expect(s.checksAsked).toBe(1);
    expect(s.checksCorrect).toBe(1);
    expect(s.beatIndex).toBe(1);
    s = applyKnowledgeCheck(s, false);
    expect(s.checksCorrect).toBe(1);
  });

  it('canRetire only from beat 6', () => {
    expect(canRetire({ ...base(), beatIndex: 5 })).toBe(false);
    expect(canRetire({ ...base(), beatIndex: 6 })).toBe(true);
  });

  it('retireRun sets outcome retired; computeScore formula', () => {
    const s = retireRun({ ...base(), beatIndex: 8, meters: { capital: 200, reputation: 60, temporalRisk: 20 }, checksCorrect: 2 });
    expect(s.outcome).toBe('retired');
    expect(computeScore(s)).toBe(200 + 600 - 100 + 100);
  });
});

describe('LlmScenarioSchema', () => {
  it('accepts bounded effects, rejects out-of-range deltas', () => {
    const good = {
      title: 'T', narrative: 'N',
      choices: [
        { id: 'a', text: 'x', effects: { capital: 15, reputation: -15, temporalRisk: 15 } },
        { id: 'b', text: 'y', effects: {} },
      ],
    };
    expect(LlmScenarioSchema.safeParse(good).success).toBe(true);
    const bad = { ...good, choices: [{ id: 'a', text: 'x', effects: { capital: 500 } }] };
    expect(LlmScenarioSchema.safeParse(bad).success).toBe(false);
  });
});
