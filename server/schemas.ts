import { z } from 'zod';

export const IngestSchema = z.object({
  module: z.enum([
    'sports',
    'finance',
    'era-guide',
    'disasters',
    'tech-transfer',
    'medical',
    'safety',
    'blueprints',
  ]),
  entry: z.object({ id: z.string() }).passthrough(),
});

export const FetchSchema = z.object({
  source: z.enum(['wikipedia', 'wikidata']),
  query: z.string().min(1),
});

export const ExploreSchema = z.object({
  query: z.string().min(1),
});

export const BatchSchema = z.object({
  queries: z.array(z.string()).min(1).max(10),
});

export const RestoreSchema = z.object({
  ingested: z.record(z.any()),
});
