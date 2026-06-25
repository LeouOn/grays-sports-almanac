import { describe, it, expect } from 'vitest';
import {
  IngestSchema,
  FetchSchema,
  ExploreSchema,
  BatchSchema,
  RestoreSchema,
} from './schemas.js';

describe('Zod Schemas', () => {
  describe('IngestSchema', () => {
    it('accepts valid module and entry', () => {
      const result = IngestSchema.safeParse({
        module: 'sports',
        entry: { id: 'test-entry' },
      });
      expect(result.success).toBe(true);
    });

    it('accepts entry with extra fields via passthrough', () => {
      const result = IngestSchema.safeParse({
        module: 'finance',
        entry: { id: 'abc', name: 'test', extra: 42 },
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid module', () => {
      const result = IngestSchema.safeParse({
        module: 'invalid',
        entry: { id: 'test' },
      });
      expect(result.success).toBe(false);
    });

    it('rejects missing entry', () => {
      const result = IngestSchema.safeParse({ module: 'sports' });
      expect(result.success).toBe(false);
    });
  });

  describe('FetchSchema', () => {
    it('accepts valid wikipedia source and query', () => {
      const result = FetchSchema.safeParse({
        source: 'wikipedia',
        query: 'Albert Einstein',
      });
      expect(result.success).toBe(true);
    });

    it('accepts valid wikidata source', () => {
      const result = FetchSchema.safeParse({
        source: 'wikidata',
        query: 'Q937',
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid source', () => {
      const result = FetchSchema.safeParse({
        source: 'google',
        query: 'test',
      });
      expect(result.success).toBe(false);
    });

    it('rejects empty query', () => {
      const result = FetchSchema.safeParse({
        source: 'wikipedia',
        query: '',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('ExploreSchema', () => {
    it('accepts valid query', () => {
      const result = ExploreSchema.safeParse({ query: 'time travel paradoxes' });
      expect(result.success).toBe(true);
    });

    it('rejects empty query', () => {
      const result = ExploreSchema.safeParse({ query: '' });
      expect(result.success).toBe(false);
    });

    it('rejects missing query', () => {
      const result = ExploreSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe('BatchSchema', () => {
    it('accepts valid array of queries', () => {
      const result = BatchSchema.safeParse({
        queries: ['sports', 'finance', 'era-guide'],
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty array', () => {
      const result = BatchSchema.safeParse({ queries: [] });
      expect(result.success).toBe(false);
    });

    it('rejects array with more than 10 items', () => {
      const result = BatchSchema.safeParse({
        queries: Array.from({ length: 11 }, (_, i) => `query-${i}`),
      });
      expect(result.success).toBe(false);
    });

    it('accepts array with exactly 10 items', () => {
      const result = BatchSchema.safeParse({
        queries: Array.from({ length: 10 }, (_, i) => `query-${i}`),
      });
      expect(result.success).toBe(true);
    });
  });

  describe('RestoreSchema', () => {
    it('accepts valid record', () => {
      const result = RestoreSchema.safeParse({
        ingested: { sports: [{ id: 'a' }], finance: [] },
      });
      expect(result.success).toBe(true);
    });

    it('accepts empty record', () => {
      const result = RestoreSchema.safeParse({ ingested: {} });
      expect(result.success).toBe(true);
    });

    it('rejects missing ingested field', () => {
      const result = RestoreSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });
});
