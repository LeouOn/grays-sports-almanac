import { Router } from 'express';
import crypto from 'node:crypto';
import type { AthenaDb } from './db.js';

export function createFeatureRoutes(db: AthenaDb): Router {
  const router = Router();
  const raw = db._db;

  // ── BOOKMARKS ────────────────────────────────────────────────

  // GET /api/features/bookmarks — list all bookmarks
  router.get('/bookmarks', (_req, res) => {
    const rows = raw.prepare('SELECT * FROM bookmarks ORDER BY created_at DESC').all();
    res.json(rows);
  });

  // POST /api/features/bookmarks — add bookmark
  router.post('/bookmarks', (req, res) => {
    const { module, entry_id, note } = req.body ?? {};
    if (!module || !entry_id) {
      res.status(400).json({ error: 'module and entry_id are required' });
      return;
    }
    const id = crypto.randomUUID();
    raw.prepare(
      'INSERT INTO bookmarks (id, module, entry_id, note) VALUES (?, ?, ?, ?)'
    ).run(id, module, entry_id, note ?? '');
    res.status(201).json({ id, module, entry_id, note: note ?? '' });
  });

  // DELETE /api/features/bookmarks/:id — remove bookmark
  router.delete('/bookmarks/:id', (req, res) => {
    const changes = raw.prepare('DELETE FROM bookmarks WHERE id = ?').run(req.params.id);
    if (changes.changes === 0) {
      res.status(404).json({ error: 'Bookmark not found' });
      return;
    }
    res.json({ deleted: true });
  });

  // ── PROGRESS ─────────────────────────────────────────────────

  // GET /api/features/progress — get all progress
  router.get('/progress', (_req, res) => {
    const rows = raw.prepare('SELECT * FROM progress_tracking ORDER BY last_activity DESC').all();
    res.json(rows);
  });

  // PUT /api/features/progress/:module — update module progress (UPSERT)
  router.put('/progress/:module', (req, res) => {
    const mod = req.params.module;
    const { entries_viewed, total_entries, quiz_score, quiz_total } = req.body ?? {};
    if (entries_viewed === undefined || total_entries === undefined) {
      res.status(400).json({ error: 'entries_viewed and total_entries are required' });
      return;
    }
    const id = crypto.randomUUID();
    raw.prepare(`
      INSERT INTO progress_tracking (id, module, entries_viewed, total_entries, quiz_score, quiz_total, last_activity)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
      ON CONFLICT(module) DO UPDATE SET
        entries_viewed = excluded.entries_viewed,
        total_entries  = excluded.total_entries,
        quiz_score     = CASE WHEN excluded.quiz_score IS NOT NULL THEN excluded.quiz_score ELSE quiz_score END,
        quiz_total     = CASE WHEN excluded.quiz_total IS NOT NULL THEN excluded.quiz_total ELSE quiz_total END,
        last_activity  = datetime('now')
    `).run(id, mod, entries_viewed, total_entries, quiz_score ?? 0, quiz_total ?? 0);
    const row = raw.prepare('SELECT * FROM progress_tracking WHERE module = ?').get(mod);
    res.json(row);
  });

  // ── SPACED REPETITION ────────────────────────────────────────

  // GET /api/features/reviews — get due reviews
  router.get('/reviews', (_req, res) => {
    const rows = raw.prepare(
      "SELECT * FROM spaced_repetition WHERE next_review <= date('now') ORDER BY next_review ASC"
    ).all();
    res.json(rows);
  });

  // POST /api/features/reviews — submit review result
  router.post('/reviews', (req, res) => {
    const { topic, isCorrect } = req.body ?? {};
    if (!topic || isCorrect === undefined) {
      res.status(400).json({ error: 'topic and isCorrect are required' });
      return;
    }

    const existing = raw.prepare('SELECT * FROM spaced_repetition WHERE topic = ?').get(topic) as {
      id: string;
      topic: string;
      competence: number;
      next_review: string;
      interval_days: number;
      review_count: number;
      last_reviewed: string | null;
    } | undefined;

    if (existing) {
      const newInterval = isCorrect ? existing.interval_days * 2 : 1;
      const newCompetence = isCorrect
        ? existing.competence + 1
        : Math.max(0, existing.competence - 1);
      raw.prepare(`
        UPDATE spaced_repetition
        SET interval_days = ?,
            competence = ?,
            next_review = date('now', '+' || ? || ' days'),
            review_count = review_count + 1,
            last_reviewed = date('now')
        WHERE topic = ?
      `).run(newInterval, newCompetence, newInterval, topic);
    } else {
      const id = crypto.randomUUID();
      const intervalDays = isCorrect ? 2 : 1;
      const competence = isCorrect ? 1 : 0;
      raw.prepare(`
        INSERT INTO spaced_repetition (id, topic, competence, next_review, interval_days, review_count, last_reviewed)
        VALUES (?, ?, ?, date('now', '+' || ? || ' days'), ?, 1, date('now'))
      `).run(id, topic, competence, intervalDays, intervalDays);
    }

    const row = raw.prepare('SELECT * FROM spaced_repetition WHERE topic = ?').get(topic);
    res.json(row);
  });

  return router;
}
