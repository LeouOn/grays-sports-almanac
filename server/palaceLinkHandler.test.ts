import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

// Mock the provider chain before importing the handler.
// The mock returns a fixed "comment" so we can assert against it.
vi.mock('./providers.js', () => ({
  callProviderChain: vi.fn(async () => ({
    comment: 'They both follow exponential curves.',
    provider: 'google',
  })),
}));

import { createPalaceLinkHandler } from './palaceLinkHandler.js';

function makeApp() {
  const app = express();
  app.use(express.json());
  app.post('/api/companion/palace-link', createPalaceLinkHandler());
  return app;
}

describe('POST /api/companion/palace-link', () => {
  beforeEach(() => {
    // Clear any module-level cache if the implementation has one
    vi.clearAllMocks();
  });

  it('returns 400 when tags is missing or not an array', async () => {
    const app = makeApp();
    const res = await request(app)
      .post('/api/companion/palace-link')
      .send({ contextItem: 'Malthus' });
    expect(res.status).toBe(400);
  });

  it('returns connection and targetEntryId on success', async () => {
    const app = makeApp();
    const res = await request(app)
      .post('/api/companion/palace-link')
      .send({
        // Real tags from the project data modules (aviation/fog/atc match
        // the Tenerife disaster entry). The plan's "population/growth"
        // tags were not present in any tags[] in this codebase.
        tags: ['aviation', 'fog', 'atc'],
        contextItem: 'A dense fog grounding flights at a major airport',
        companionName: 'Athena',
        companionPrompt: 'You are Athena',
      });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      connection: expect.any(String),
      targetEntryId: expect.any(String),
    });
  });

  it('caches results: second call with same tags does not invoke LLM again', async () => {
    const { callProviderChain } = await import('./providers.js');
    const app = makeApp();
    // Use a distinct tag set so we don't accidentally hit a prior test's
    // module-level cache entry. The CACHE is module-scoped and persists
    // across tests, so each test that asserts call counts must use unique tags.
    const body = {
      tags: ['tcp-ip', 'internet', 'packet-switching'],
      contextItem: 'ARPANET architecture in 1975',
      companionName: 'Athena',
      companionPrompt: 'p',
    };
    await request(app).post('/api/companion/palace-link').send(body);
    await request(app).post('/api/companion/palace-link').send(body);
    expect(callProviderChain).toHaveBeenCalledTimes(1);
  });

  it('returns empty connection when no target found', async () => {
    const app = makeApp();
    const res = await request(app)
      .post('/api/companion/palace-link')
      .send({
        tags: ['xqz-nonexistent-tag-xyz'],
        contextItem: 'unrelated',
        companionName: 'Athena',
        companionPrompt: 'p',
      });
    expect(res.status).toBe(200);
    expect(res.body.connection).toBe('');
  });

  it('returns empty connection when all providers fail (spec §3.3 step 7)', async () => {
    const { callProviderChain } = await import('./providers.js');
    vi.mocked(callProviderChain).mockRejectedValueOnce(
      new Error('All companion providers failed')
    );
    const app = makeApp();
    // Unique tag set so we don't hit the module-level CACHE from earlier
    // tests. The earlier "success" test already cached ['aviation', 'fog', 'atc'],
    // so reusing those tags would short-circuit to the cached success.
    const res = await request(app)
      .post('/api/companion/palace-link')
      .send({
        tags: ['unique-allfail-1', 'unique-allfail-2'],
        contextItem: 'A scenario where the providers all fail',
        companionName: 'Athena',
        companionPrompt: 'p',
      });
    expect(res.status).toBe(200);
    expect(res.body.connection).toBe('');
    expect(res.body.targetEntryId).toBe('');
  });
});
