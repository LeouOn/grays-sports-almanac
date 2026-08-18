import { describe, it, expect, beforeEach } from 'vitest';
import { initAthenaDb, runRunMigrations, insertRun, getRun, updateRun, insertBeat, getBeats, type AthenaDb } from './db.js';
import { createRun, applyChoice, type Beat } from './run-engine.js';

describe('run persistence', () => {
  let db: AthenaDb;
  beforeEach(() => {
    db = initAthenaDb(':memory:');
    runRunMigrations(db._db);
  });

  it('round-trips a RunState', () => {
    const state = createRun('1970s', 'marty', 'run-x');
    insertRun(db, state);
    expect(getRun(db, 'run-x')).toEqual(state);
  });

  it('getRun returns null for unknown id', () => {
    expect(getRun(db, 'nope')).toBeNull();
  });

  it('updateRun persists meter and outcome changes', () => {
    const state = createRun('1980s', 'doc', 'run-y');
    insertRun(db, state);
    const beat: Beat = {
      index: 0, type: 'scenario', title: 'T', narrative: 'N',
      choices: [{ id: 'a', text: 'x', effects: { capital: 25, temporalRisk: 10 } }],
    };
    updateRun(db, applyChoice(state, beat, 'a'));
    const loaded = getRun(db, 'run-y')!;
    expect(loaded.meters.capital).toBe(125);
    expect(loaded.beatIndex).toBe(1);
  });

  it('round-trips beats in order', () => {
    insertRun(db, createRun('1990s', 'biff', 'run-z'));
    const b0: Beat = { index: 0, type: 'scenario', title: 'T0', narrative: 'N0', choices: [{ id: 'a', text: 'x', effects: {} }], companionQuip: 'Great Scott!' };
    const b1: Beat = { index: 1, type: 'knowledge_check', title: 'T1', narrative: 'N1', choices: [], knowledgeCheck: { question: 'Q?', options: ['1','2','3','4'], correctIndex: 2, sourceArticle: 'Babe_Ruth' } };
    insertBeat(db, 'run-z', b0);
    insertBeat(db, 'run-z', b1);
    const beats = getBeats(db, 'run-z');
    expect(beats).toHaveLength(2);
    expect(beats[0]).toEqual(b0);
    expect(beats[1].knowledgeCheck).toEqual(b1.knowledgeCheck);
  });
});
