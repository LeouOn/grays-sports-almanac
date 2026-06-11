import { Router } from 'express';
import crypto from 'node:crypto';
import type { AthenaDb } from './db.js';
import { getCommentary, upsertCommentary, getEntry } from './db.js';
import { callProviderChain, type ProviderId } from './providers.js';
import { findBestTagMatch } from './tagMatch.js';

export function createAthenaRoutes(db: AthenaDb): Router {
  const router = Router();

  // ── GET /api/athena/commentary ──────────────────────────────
  router.get('/commentary', (req, res) => {
    const { entryId, companionId } = req.query;
    if (!entryId || typeof entryId !== 'string') {
      res.status(400).json({ error: 'entryId required' });
      return;
    }
    const companion = (companionId as string) || 'athena';
    const row = getCommentary(db, { entry_id: entryId, content_type: 'commentary', companion_id: companion });
    if (row) {
      res.json({ cached: true, content: row.content, provider: row.provider, source: row.source });
    } else {
      res.json({ cached: false, content: null });
    }
  });

  // ── POST /api/athena/commentary ─────────────────────────────
  router.post('/commentary', async (req, res) => {
    const { entryId, companionId, forceRecompute } = req.body ?? {};
    if (!entryId || typeof entryId !== 'string') {
      res.status(400).json({ error: 'entryId required' });
      return;
    }
    const companion = companionId || 'athena';

    // Check cache unless forced
    if (!forceRecompute) {
      const cached = getCommentary(db, { entry_id: entryId, content_type: 'commentary', companion_id: companion });
      if (cached) {
        res.json({ content: cached.content, provider: cached.provider, source: cached.source });
        return;
      }
    }

    // Look up entry to build prompt context
    const entry = getEntry(db, entryId);
    if (!entry) {
      res.status(404).json({ error: `Entry not found: ${entryId}` });
      return;
    }

    const contextItem = `${entry.title} (${entry.module}) — ${entry.category ?? ''}`;
    const contextHash = crypto.createHash('sha256').update(contextItem).digest('hex').slice(0, 16);

    try {
      const result = await callProviderChain({
        companionName: companion,
        companionPrompt: `You are ${companion}, a wise and witty observer of history. You speak concisely and memorably.`,
        contextItem,
      });

      upsertCommentary(db, {
        entry_id: entryId,
        content_type: 'commentary',
        companion_id: companion,
        content: result.comment,
        context_hash: contextHash,
        source: forceRecompute ? 'recomputed' : 'lazy',
        provider: result.provider,
        model: null,
        target_entry_id: null,
        tier: 0,
        performance: '',
        topic: '',
      });

      res.json({ content: result.comment, provider: result.provider, source: forceRecompute ? 'recomputed' : 'lazy' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[athena] commentary generation failed for ${entryId}: ${msg}`);
      res.status(502).json({ error: `Failed to generate commentary: ${msg}` });
    }
  });

  // ── GET /api/athena/palace-link ─────────────────────────────
  router.get('/palace-link', (req, res) => {
    const { entryId, companionId } = req.query;
    if (!entryId || typeof entryId !== 'string') {
      res.status(400).json({ error: 'entryId required' });
      return;
    }
    const companion = (companionId as string) || 'athena';
    const row = getCommentary(db, { entry_id: entryId, content_type: 'palace_link', companion_id: companion });
    if (row) {
      res.json({ cached: true, connection: row.content, targetEntryId: row.target_entry_id });
    } else {
      res.json({ cached: false });
    }
  });

  // ── POST /api/athena/palace-link ────────────────────────────
  router.post('/palace-link', async (req, res) => {
    const { entryId, companionId, forceRecompute } = req.body ?? {};
    if (!entryId || typeof entryId !== 'string') {
      res.status(400).json({ error: 'entryId required' });
      return;
    }
    const companion = companionId || 'athena';

    if (!forceRecompute) {
      const cached = getCommentary(db, { entry_id: entryId, content_type: 'palace_link', companion_id: companion });
      if (cached) {
        res.json({ connection: cached.content, targetEntryId: cached.target_entry_id });
        return;
      }
    }

    const entry = getEntry(db, entryId);
    if (!entry) {
      res.status(404).json({ error: `Entry not found: ${entryId}` });
      return;
    }

    const tags = JSON.parse(entry.tags) as string[];
    const target = findBestTagMatch(tags, entryId);
    if (!target) {
      res.json({ connection: '', targetEntryId: '' });
      return;
    }

    const focusedContext = `Tags: [${tags.join(', ')}]\nEntry A: ${entry.title}\nEntry B: ${target.title}\nWrite ONE sentence showing how they connect as memory hooks. Speak in Athena's voice.`;

    try {
      const result = await callProviderChain({
        companionName: companion,
        companionPrompt: `You are ${companion}, a wise observer who finds hidden connections across history.`,
        contextItem: focusedContext,
      });

      upsertCommentary(db, {
        entry_id: entryId,
        content_type: 'palace_link',
        companion_id: companion,
        content: result.comment,
        context_hash: crypto.createHash('sha256').update(focusedContext).digest('hex').slice(0, 16),
        source: forceRecompute ? 'recomputed' : 'lazy',
        provider: result.provider,
        model: null,
        target_entry_id: target.id,
        tier: 0,
        performance: '',
        topic: '',
      });

      res.json({ connection: result.comment, targetEntryId: target.id });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[athena] palace-link failed for ${entryId}: ${msg}`);
      res.json({ connection: '', targetEntryId: '' });
    }
  });

  return router;
}
