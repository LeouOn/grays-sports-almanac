import { describe, it, expect, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { initAthenaDb, runFeatureMigrations, type AthenaDb } from './db.js';
import { createFeatureRoutes } from './feature-routes.js';

describe('Feature Routes (bookmarks, progress, reviews)', () => {
  let app: express.Express;
  let db: AthenaDb;

  beforeEach(() => {
    db = initAthenaDb(':memory:');
    runFeatureMigrations(db._db);
    app = express();
    app.use(express.json());
    app.use('/api/features', createFeatureRoutes(db));
  });

  // ── BOOKMARKS ─────────────────────────────────────────────────

  describe('POST /api/features/bookmarks', () => {
    it('creates a bookmark with valid module + entry_id', async () => {
      const res = await request(app)
        .post('/api/features/bookmarks')
        .send({ module: 'disasters', entry_id: 'tenerife', note: 'check ATC' });
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        module: 'disasters',
        entry_id: 'tenerife',
        note: 'check ATC',
      });
      expect(res.body.id).toEqual(expect.any(String));
    });

    it('defaults note to empty string when omitted', async () => {
      const res = await request(app)
        .post('/api/features/bookmarks')
        .send({ module: 'sports', entry_id: 'game-7-1985' });
      expect(res.status).toBe(201);
      expect(res.body.note).toBe('');
    });

    it('returns 400 when module is missing', async () => {
      const res = await request(app)
        .post('/api/features/bookmarks')
        .send({ entry_id: 'tenerife' });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/module and entry_id/);
    });

    it('returns 400 when entry_id is missing', async () => {
      const res = await request(app)
        .post('/api/features/bookmarks')
        .send({ module: 'disasters' });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/features/bookmarks', () => {
    it('returns empty array when no bookmarks exist', async () => {
      const res = await request(app).get('/api/features/bookmarks');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('returns all bookmarks, newer created_at first', async () => {
      // Use direct DB inserts so we control created_at precisely (datetime('now')
      // has second-resolution and a 10ms wait between inserts isn't enough).
      const newerId = '00000000-0000-0000-0000-0000000000aa';
      const olderId = '00000000-0000-0000-0000-0000000000bb';
      db._db.prepare(
        'INSERT INTO bookmarks (id, module, entry_id, note, created_at) VALUES (?, ?, ?, ?, ?)'
      ).run(olderId, 'a', 'e1', '', '2020-01-01 00:00:00');
      db._db.prepare(
        'INSERT INTO bookmarks (id, module, entry_id, note, created_at) VALUES (?, ?, ?, ?, ?)'
      ).run(newerId, 'b', 'e2', '', '2024-01-01 00:00:00');

      const res = await request(app).get('/api/features/bookmarks');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].entry_id).toBe('e2');
      expect(res.body[1].entry_id).toBe('e1');
    });
  });

  describe('DELETE /api/features/bookmarks/:id', () => {
    it('deletes an existing bookmark', async () => {
      const created = await request(app)
        .post('/api/features/bookmarks')
        .send({ module: 'disasters', entry_id: 'tenerife' });
      const id = created.body.id;

      const del = await request(app).delete(`/api/features/bookmarks/${id}`);
      expect(del.status).toBe(200);
      expect(del.body.deleted).toBe(true);

      const list = await request(app).get('/api/features/bookmarks');
      expect(list.body).toHaveLength(0);
    });

    it('returns 404 for an unknown bookmark id', async () => {
      const res = await request(app).delete('/api/features/bookmarks/does-not-exist');
      expect(res.status).toBe(404);
      expect(res.body.error).toMatch(/not found/i);
    });
  });

  // ── PROGRESS ──────────────────────────────────────────────────

  describe('PUT /api/features/progress/:module', () => {
    it('creates a new progress row', async () => {
      const res = await request(app)
        .put('/api/features/progress/disasters')
        .send({ entries_viewed: 5, total_entries: 20, quiz_score: 4, quiz_total: 5 });
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        module: 'disasters',
        entries_viewed: 5,
        total_entries: 20,
        quiz_score: 4,
        quiz_total: 5,
      });
    });

    it('upserts (updates) an existing module row', async () => {
      await request(app)
        .put('/api/features/progress/sports')
        .send({ entries_viewed: 1, total_entries: 100 });

      const res = await request(app)
        .put('/api/features/progress/sports')
        .send({ entries_viewed: 10, total_entries: 100, quiz_score: 8, quiz_total: 10 });

      expect(res.status).toBe(200);
      expect(res.body.entries_viewed).toBe(10);
      expect(res.body.quiz_score).toBe(8);
    });

    it('overwrites quiz fields to 0 when omitted on update (existing behavior)', async () => {
      // The endpoint's SQL guards quiz fields with IS NULL, but the route
      // coerces undefined → 0 via `quiz_score ?? 0`, so omitting the field
      // results in a literal 0 overwriting the previous value. This test
      // pins that behavior so future changes don't silently regress it.
      await request(app)
        .put('/api/features/progress/medical')
        .send({ entries_viewed: 5, total_entries: 50, quiz_score: 4, quiz_total: 5 });

      const res = await request(app)
        .put('/api/features/progress/medical')
        .send({ entries_viewed: 7, total_entries: 50 });

      expect(res.status).toBe(200);
      expect(res.body.quiz_score).toBe(0);
      expect(res.body.quiz_total).toBe(0);
    });

    it('returns 400 when entries_viewed or total_entries missing', async () => {
      const res = await request(app)
        .put('/api/features/progress/safety')
        .send({ quiz_score: 1 });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/features/progress', () => {
    it('returns all progress rows', async () => {
      await request(app)
        .put('/api/features/progress/disasters')
        .send({ entries_viewed: 3, total_entries: 10 });
      await request(app)
        .put('/api/features/progress/sports')
        .send({ entries_viewed: 1, total_entries: 10 });

      const res = await request(app).get('/api/features/progress');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      const modules = res.body.map((r: { module: string }) => r.module);
      expect(modules).toEqual(expect.arrayContaining(['disasters', 'sports']));
    });
  });

  // ── SPACED REPETITION / REVIEWS ───────────────────────────────

  describe('POST /api/features/reviews', () => {
    it('creates a new review record on first submission', async () => {
      const res = await request(app)
        .post('/api/features/reviews')
        .send({ topic: 'aviation-safety', isCorrect: true });
      expect(res.status).toBe(200);
      expect(res.body.topic).toBe('aviation-safety');
      expect(res.body.competence).toBe(1);
      expect(res.body.review_count).toBe(1);
      expect(res.body.interval_days).toBe(2);
    });

    it('increments competence and doubles interval on correct review', async () => {
      await request(app).post('/api/features/reviews').send({ topic: 'tnm-staging', isCorrect: true });
      const res = await request(app)
        .post('/api/features/reviews')
        .send({ topic: 'tnm-staging', isCorrect: true });
      expect(res.body.competence).toBe(2);
      expect(res.body.interval_days).toBe(4);
      expect(res.body.review_count).toBe(2);
    });

    it('resets interval to 1 day on incorrect review', async () => {
      // Prime with correct reviews to grow interval
      await request(app).post('/api/features/reviews').send({ topic: 'apollo-1', isCorrect: true });
      await request(app).post('/api/features/reviews').send({ topic: 'apollo-1', isCorrect: true });
      // Now incorrect
      const res = await request(app)
        .post('/api/features/reviews')
        .send({ topic: 'apollo-1', isCorrect: false });
      expect(res.body.interval_days).toBe(1);
      // competence should not go below 0
      expect(res.body.competence).toBeGreaterThanOrEqual(0);
    });

    it('returns 400 when topic or isCorrect missing', async () => {
      const missingTopic = await request(app)
        .post('/api/features/reviews')
        .send({ isCorrect: true });
      expect(missingTopic.status).toBe(400);

      const missingIsCorrect = await request(app)
        .post('/api/features/reviews')
        .send({ topic: 'x' });
      expect(missingIsCorrect.status).toBe(400);
    });
  });

  describe('GET /api/features/reviews', () => {
    it('returns empty array when no reviews are due', async () => {
      const res = await request(app).get('/api/features/reviews');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('returns reviews whose next_review is today or earlier', async () => {
      // POST /reviews always schedules next_review = today + N days (N >= 1),
      // so newly created reviews are never immediately due. Seed a due row
      // directly via the DB to exercise the query.
      db._db.prepare(`
        INSERT INTO spaced_repetition (id, topic, competence, next_review, interval_days, review_count, last_reviewed)
        VALUES ('due-1', 'past-topic', 2, date('now', '-1 day'), 1, 1, date('now'))
      `).run();
      db._db.prepare(`
        INSERT INTO spaced_repetition (id, topic, competence, next_review, interval_days, review_count, last_reviewed)
        VALUES ('future-1', 'future-topic', 0, date('now', '+5 days'), 1, 0, NULL)
      `).run();

      const res = await request(app).get('/api/features/reviews');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].topic).toBe('past-topic');
    });
  });
});