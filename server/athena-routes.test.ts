import { describe, it, expect, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import { initAthenaDb, upsertCommentary, type AthenaDb } from './db.js';
import { createAthenaRoutes } from './athena-routes.js';
import { registerEntries } from './entry-registry.js';

// Mock the provider chain so we don't make real LLM calls
vi.mock('./providers.js', () => ({
  callProviderChain: vi.fn().mockResolvedValue({
    comment: 'A test comment from the provider.',
    provider: 'test-provider',
  }),
}));

describe('Athena API Routes', () => {
  let app: express.Express;
  let db: AthenaDb;

  beforeEach(() => {
    db = initAthenaDb(':memory:');
    registerEntries(db);
    app = express();
    app.use(express.json());
    app.use('/api/athena', createAthenaRoutes(db));
  });

  describe('GET /api/athena/commentary', () => {
    it('returns null content when not cached', async () => {
      const res = await request(app).get('/api/athena/commentary?entryId=tenerife');
      expect(res.status).toBe(200);
      expect(res.body.cached).toBe(false);
      expect(res.body.content).toBeNull();
    });

    it('returns 400 when entryId is missing', async () => {
      const res = await request(app).get('/api/athena/commentary');
      expect(res.status).toBe(400);
    });

    it('returns cached content when available', async () => {
      upsertCommentary(db, {
        entry_id: 'tenerife', content_type: 'commentary', companion_id: 'athena',
        content: 'A dark day.', context_hash: 'x', source: 'precomputed',
        provider: null, model: null, target_entry_id: null, tier: 0, performance: '', topic: '',
      });

      const res = await request(app).get('/api/athena/commentary?entryId=tenerife');
      expect(res.status).toBe(200);
      expect(res.body.cached).toBe(true);
      expect(res.body.content).toBe('A dark day.');
    });
  });

  describe('POST /api/athena/commentary', () => {
    it('returns 400 for missing entryId', async () => {
      const res = await request(app).post('/api/athena/commentary').send({});
      expect(res.status).toBe(400);
    });

    it('returns generated commentary', async () => {
      const res = await request(app).post('/api/athena/commentary').send({ entryId: 'tenerife' });
      expect(res.status).toBe(200);
      expect(res.body.content).toBeTruthy();
    });

    it('returns cached commentary on second call', async () => {
      // First call generates
      await request(app).post('/api/athena/commentary').send({ entryId: 'tenerife' });
      // Second should return cached
      const res = await request(app).post('/api/athena/commentary').send({ entryId: 'tenerife' });
      expect(res.status).toBe(200);
      expect(res.body.content).toBeTruthy();
    });
  });

  describe('GET /api/athena/palace-link', () => {
    it('returns null when not cached', async () => {
      const res = await request(app).get('/api/athena/palace-link?entryId=tenerife');
      expect(res.status).toBe(200);
      expect(res.body.cached).toBe(false);
    });
  });
});
