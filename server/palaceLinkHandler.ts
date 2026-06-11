import crypto from 'node:crypto';
import type { Request, Response, RequestHandler } from 'express';
import { callProviderChain, type ProviderId } from './providers.js';
import { findBestTagMatch } from './tagMatch.js';

const CACHE = new Map<string, { connection: string; targetEntryId: string }>();
const CACHE_MAX = 1000;

function evictIfFull() {
  if (CACHE.size >= CACHE_MAX) {
    const firstKey = CACHE.keys().next().value;
    if (firstKey !== undefined) CACHE.delete(firstKey);
  }
}

function hashTags(tags: string[]): string {
  return crypto.createHash('sha1').update([...tags].sort().join('|')).digest('hex');
}

export function createPalaceLinkHandler(): RequestHandler {
  return async (req: Request, res: Response) => {
    const { tags, contextItem, companionName, companionPrompt, provider, excludeId } = req.body ?? {};
    if (!Array.isArray(tags) || typeof contextItem !== 'string') {
      return res.status(400).json({ error: 'tags[] and contextItem required' });
    }

    const hash = hashTags(tags);
    const cached = CACHE.get(hash);
    if (cached) return res.json(cached);

    const target = findBestTagMatch(tags, typeof excludeId === 'string' ? excludeId : undefined);
    if (!target) {
      const empty = { connection: '', targetEntryId: '' };
      evictIfFull();
      CACHE.set(hash, empty);
      return res.json(empty);
    }

    const focusedContext = `Tags: [${tags.join(', ')}]\nEntry A: ${contextItem}\nEntry B: ${target.title} — ${target.description}\nWrite ONE sentence showing how they connect as memory hooks. Speak in Athena's voice. No fluff.`;
    let result;
    try {
      result = await callProviderChain({
        companionName,
        companionPrompt,
        contextItem: focusedContext,
        provider: provider as ProviderId | undefined,
      });
    } catch {
      // All providers failed (spec §3.3 step 7): return empty result, cache it.
      const empty = { connection: '', targetEntryId: '' };
      evictIfFull();
      CACHE.set(hash, empty);
      return res.json(empty);
    }

    const out = {
      connection: (result.comment ?? '').trim(),
      targetEntryId: target.id,
    };
    evictIfFull();
    CACHE.set(hash, out);
    return res.json(out);
  };
}
