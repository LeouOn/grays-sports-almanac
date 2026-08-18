import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { initAthenaDb, runRunMigrations, type AthenaDb } from './db.js';
import { createRunRoutes } from './run-routes.js';
import { templateBeat, generateCompanionQuip } from './run-llm.js';
import { createRun, type Beat, type RunState } from './run-engine.js';

describe('Run Routes', () => {
  let app: express.Express;
  let db: AthenaDb;

  beforeEach(() => {
    process.env.RUN_LLM_STUB = '1'; // deterministic beats, no model calls
    db = initAthenaDb(':memory:');
    runRunMigrations(db._db);
    app = express();
    app.use(express.json());
    app.use('/api/run', createRunRoutes(db));
  });

  afterEach(() => { delete process.env.RUN_LLM_STUB; });

  it('POST /start creates a run and returns beat 0', async () => {
    const res = await request(app).post('/api/run/start').send({ era: '1980s', companionId: 'doc' });
    expect(res.status).toBe(201);
    expect(res.body.run.era).toBe('1980s');
    expect(res.body.run.meters).toEqual({ capital: 100, reputation: 50, temporalRisk: 10 });
    expect(res.body.beat.index).toBe(0);
    expect(res.body.beat.choices.length).toBeGreaterThanOrEqual(2);
  });

  it('POST /start rejects invalid era', async () => {
    const res = await request(app).post('/api/run/start').send({ era: '1899', companionId: 'doc' });
    expect(res.status).toBe(400);
  });

  it('choice flow: applies effects and returns next beat', async () => {
    const start = await request(app).post('/api/run/start').send({ era: '1970s', companionId: 'marty' });
    const runId = start.body.run.runId;
    const res = await request(app).post(`/api/run/${runId}/choice`).send({ choiceId: 'a' });
    expect(res.status).toBe(200);
    expect(res.body.run.beatIndex).toBe(1);
    expect(res.body.run.meters.capital).toBe(110); // template choice a: +10
    expect(res.body.beat.index).toBe(1);
  });

  it('returns 400 on unknown choice, 404 on unknown run', async () => {
    const start = await request(app).post('/api/run/start').send({ era: '1970s', companionId: 'marty' });
    const runId = start.body.run.runId;
    expect((await request(app).post(`/api/run/${runId}/choice`).send({ choiceId: 'zzz' })).status).toBe(400);
    expect((await request(app).post('/api/run/nope/choice').send({ choiceId: 'a' })).status).toBe(404);
  });

  it('knowledge-check beat grades the answer', async () => {
    const start = await request(app).post('/api/run/start').send({ era: '1990s', companionId: 'athena' });
    const runId = start.body.run.runId;
    await request(app).post(`/api/run/${runId}/choice`).send({ choiceId: 'a' }); // beat 1
    await request(app).post(`/api/run/${runId}/choice`).send({ choiceId: 'a' }); // beat 2 = knowledge_check
    const res = await request(app).post(`/api/run/${runId}/knowledge-check`).send({ answerIndex: 1 });
    expect(res.status).toBe(200);
    expect(res.body.correct).toBe(true); // template check correctIndex = 1
    expect(res.body.run.checksCorrect).toBe(1);
  });

  it('retire blocked before beat 6, allowed after; GET returns run + beats', async () => {
    const start = await request(app).post('/api/run/start').send({ era: '2000s', companionId: 'biff' });
    const runId = start.body.run.runId;
    expect((await request(app).post(`/api/run/${runId}/retire`)).status).toBe(409);

    // play through: scenario beats take choice 'a', knowledge checks answer 1
    for (let i = 0; i < 9; i++) {
      const state = (await request(app).get(`/api/run/${runId}`)).body.run;
      if (state.outcome !== 'active') break;
      const current = (await request(app).get(`/api/run/${runId}`)).body;
      const lastBeat = current.beats[current.beats.length - 1];
      if (lastBeat.type === 'knowledge_check') {
        await request(app).post(`/api/run/${runId}/knowledge-check`).send({ answerIndex: 1 });
      } else {
        await request(app).post(`/api/run/${runId}/choice`).send({ choiceId: 'a' });
      }
    }

    const retire = await request(app).post(`/api/run/${runId}/retire`);
    expect(retire.status).toBe(200);
    expect(retire.body.run.outcome).toBe('retired');
    expect(retire.body.score).toBeGreaterThan(0);

    const get = await request(app).get(`/api/run/${runId}`);
    expect(get.body.beats.length).toBeGreaterThanOrEqual(6);
  });

  // Amendment: keyless operation — resolveModelFn throws, router must still
  // serve requests via the template path. The brief's eager resolver would
  // throw at construction; the lazy resolver returns null and buildBeat
  // routes scenario/finale beats to templateBeat and knowledge-check beats
  // through genCheck with a null model + null kiwix (Task 5 returns the
  // template check on that path).
  it('works with no provider keys (resolveModelFn throws) — template beats', async () => {
    delete process.env.RUN_LLM_STUB;
    const keyless = express();
    keyless.use(express.json());
    keyless.use('/api/run', createRunRoutes(db, { resolveModelFn: () => { throw new Error('no keys'); } }));
    const start = await request(keyless).post('/api/run/start').send({ era: '1960s', companionId: 'doc' });
    expect(start.status).toBe(201);
    expect(start.body.beat.choices.length).toBeGreaterThanOrEqual(2);
    const runId = start.body.run.runId;
    const res = await request(keyless).post(`/api/run/${runId}/choice`).send({ choiceId: 'a' });
    expect(res.status).toBe(200);
    expect(res.body.run.beatIndex).toBe(1);
  });
});
