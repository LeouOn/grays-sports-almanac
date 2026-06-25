import { Router, type Request, type Response } from 'express';
import { sportsAlmanac } from '../src/data/sports.js';
import { financialAlmanac } from '../src/data/finance.js';
import { eraGuideData } from '../src/data/era-guide.js';
import { disasterAlmanac } from '../src/data/disasters.js';
import { techTransferTargets } from '../src/data/tech-transfer.js';
import { medicalInterventions } from '../src/data/medical.js';
import { safetyProtocols } from '../src/data/safety.js';
import { blueprintsData } from '../src/data/blueprints.js';
import { loadIngested, saveIngested, exportIngested, restoreIngested } from './persistence.js';
import { IngestSchema, FetchSchema, ExploreSchema, BatchSchema, RestoreSchema } from './schemas.js';

type ModuleName = 'sports' | 'finance' | 'era-guide' | 'disasters' | 'tech-transfer' | 'medical' | 'safety' | 'blueprints';

interface KnowledgeEntry {
  id: string;
  year?: number;
  optimalYear?: number;
  date?: string;
  tags?: string[];
  title?: string;
  [key: string]: unknown;
}

// Merge static data with ingested entries from previous sessions (portable across computers)
const ingested = loadIngested();

const MODULES: Record<ModuleName, { data: KnowledgeEntry[]; label: string }> = {
  'sports':         { data: [...sportsAlmanac, ...(ingested['sports'] || [])],         label: 'Sports Almanac' },
  'finance':        { data: [...financialAlmanac, ...(ingested['finance'] || [])],       label: 'Financial Almanac' },
  'era-guide':      { data: [...eraGuideData, ...(ingested['era-guide'] || [])],           label: 'Era Integration Guide' },
  'disasters':      { data: [...disasterAlmanac, ...(ingested['disasters'] || [])],        label: 'Disaster Prevention' },
  'tech-transfer':  { data: [...techTransferTargets, ...(ingested['tech-transfer'] || [])],    label: 'Technology Transfer' },
  'medical':        { data: [...medicalInterventions, ...(ingested['medical'] || [])],   label: 'Medical Interventions' },
  'safety':         { data: [...safetyProtocols, ...(ingested['safety'] || [])],         label: 'Safety & Dead Drops' },
  'blueprints':     { data: [...blueprintsData, ...(ingested['blueprints'] || [])],     label: 'Bootstrap Blueprints' },
};

// ── API Key middleware (optional) ───────────────────────────
function apiKeyAuth(req: Request, res: Response, next: () => void) {
  const configuredKey = process.env.API_KEY;
  if (!configuredKey) return next(); // No key configured = open access

  const providedKey = req.headers['x-api-key'] as string;
  if (providedKey !== configuredKey) {
    res.status(401).json({ error: 'Invalid or missing X-API-Key header' });
    return;
  }
  next();
}

// ── Router ──────────────────────────────────────────────────
export function createApiV1Router(): Router {
  const router = Router();
  router.use(apiKeyAuth);

  // GET /api/v1/ — Homepage with link to docs
  router.get('/', (_req, res) => {
    res.json({
      name: 'Time Traveler\'s Guide API v1',
      version: '1.0.0',
      docs: '/api/v1/docs',
      openapi: '/api/v1/openapi.json',
      endpoints: {
        'GET /api/v1/': 'This page.',
        'GET /api/v1/docs': 'Interactive Swagger UI for testing endpoints.',
        'GET /api/v1/openapi.json': 'OpenAPI 3.0 specification.',
        'GET /api/v1/knowledge/:module': 'List all entries in a module. Modules: ' + Object.keys(MODULES).join(', '),
        'GET /api/v1/knowledge/:module/:id': 'Get one entry by ID.',
        'GET /api/v1/search?q=&tags=&era=&module=': 'Federated search with filters.',
        'POST /api/v1/ingest': 'Submit a new entry. Body: { module, entry }',
        'POST /api/v1/fetch': 'Fetch data from external sources (Wikipedia). Body: { source, query }',
        'GET /api/v1/export': 'Full JSON dump.',
        'GET /api/v1/stats': 'Module counts and coverage.',
      },
      auth: process.env.API_KEY ? 'X-API-Key header required' : 'No auth configured',
    });
  });

  // GET /api/v1/openapi.json — OpenAPI 3.0 spec
  router.get('/openapi.json', (_req, res) => {
    res.json({
      openapi: '3.0.3',
      info: {
        title: 'Time Traveler\'s Guide API',
        version: '1.0.0',
        description: 'REST API for querying, searching, and ingesting historical knowledge across 8 modules (sports, finance, era-guide, disasters, tech-transfer, medical, safety, blueprints).',
        contact: { name: 'Time Traveler\'s Guide' },
      },
      servers: [{ url: 'http://localhost:3001', description: 'Local development server' }],
      paths: {
        '/api/v1/': { get: { summary: 'API homepage', responses: { '200': { description: 'Endpoint catalog' } } } },
        '/api/v1/openapi.json': { get: { summary: 'This OpenAPI spec', responses: { '200': { description: 'OpenAPI 3.0 JSON' } } } },
        '/api/v1/stats': { get: { summary: 'Module counts, tag coverage, year ranges', responses: { '200': { description: 'Stats object' } } } },
        '/api/v1/export': { get: { summary: 'Full knowledge base JSON dump', responses: { '200': { description: 'All 8 modules with metadata' } } } },
        '/api/v1/knowledge/{module}': {
          get: {
            summary: 'List entries in a module',
            parameters: [
              { name: 'module', in: 'path', required: true, schema: { type: 'string', enum: Object.keys(MODULES) } },
              { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Full-text search' },
              { name: 'tags', in: 'query', schema: { type: 'string' }, description: 'Comma-separated tags' },
              { name: 'era', in: 'query', schema: { type: 'string', enum: ['1970s','1980s','1990s','2000s'] } },
              { name: 'limit', in: 'query', schema: { type: 'integer', default: 100 } },
              { name: 'offset', in: 'query', schema: { type: 'integer', default: 0 } },
            ],
            responses: { '200': { description: 'Paginated results' } },
          },
        },
        '/api/v1/knowledge/{module}/{id}': {
          get: {
            summary: 'Get one entry by ID',
            parameters: [
              { name: 'module', in: 'path', required: true, schema: { type: 'string', enum: Object.keys(MODULES) } },
              { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
            ],
            responses: { '200': { description: 'Single entry' }, '404': { description: 'Not found' } },
          },
        },
        '/api/v1/search': {
          get: {
            summary: 'Federated search across all modules',
            parameters: [
              { name: 'q', in: 'query', schema: { type: 'string' }, description: 'Full-text query' },
              { name: 'tags', in: 'query', schema: { type: 'string' }, description: 'Comma-separated tags' },
              { name: 'era', in: 'query', schema: { type: 'string', enum: ['1970s','1980s','1990s','2000s'] } },
              { name: 'module', in: 'query', schema: { type: 'string', enum: Object.keys(MODULES) }, description: 'Restrict to one module' },
            ],
            responses: { '200': { description: 'Search results (max 50)' } },
          },
        },
        '/api/v1/ingest': {
          post: {
            summary: 'Submit or update a knowledge entry',
            requestBody: {
              required: true,
              content: { 'application/json': { schema: { type: 'object', properties: { module: { type: 'string', enum: Object.keys(MODULES) }, entry: { type: 'object' } }, required: ['module','entry'] } } },
            },
            responses: { '201': { description: 'Created' }, '200': { description: 'Updated' }, '400': { description: 'Invalid request' } },
          },
        },
        '/api/v1/fetch': {
          post: {
            summary: 'Fetch data from external sources (Wikipedia summary, Wikidata)',
            requestBody: {
              required: true,
              content: { 'application/json': { schema: { type: 'object', properties: { source: { type: 'string', enum: ['wikipedia','wikidata'] }, query: { type: 'string', description: 'Wikipedia page title or Wikidata SPARQL' } }, required: ['source','query'] } } },
            },
            responses: { '200': { description: 'Fetched data' } },
          },
        },
      },
    });
  });

  // GET /api/v1/docs — Swagger UI
  router.get('/docs', (_req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Time Traveler's Guide — API Docs</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css" />
  <style>
    html { background: #0a0a0a; }
    .swagger-ui { filter: invert(88%) hue-rotate(180deg); }
    .swagger-ui .microlight { filter: invert(100%) hue-rotate(180deg); }
    .swagger-ui .scheme-container { background: #111; }
    .swagger-ui .opblock { background: #161616; border-radius: 8px; }
    .swagger-ui .opblock-summary { border: none; }
    .swagger-ui input, .swagger-ui textarea { color: #fff; background: #1a1a1a; }
    .topbar { display: none; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js" crossorigin></script>
  <script>
    SwaggerUIBundle({
      url: '/api/v1/openapi.json',
      dom_id: '#swagger-ui',
      deepLinking: true,
      defaultModelsExpandDepth: 0,
      defaultModelExpandDepth: 0,
    });
  </script>
</body>
</html>`);
  });

  // POST /api/v1/fetch — external data connector (Wikipedia)
  router.post('/fetch', async (req, res) => {
    const parsed = FetchSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation failed', details: parsed.error.issues });
      return;
    }
    const { source, query } = parsed.data;

    try {
      if (source === 'wikipedia') {
        const title = encodeURIComponent(query.replace(/ /g, '_'));
        const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`;
        const resp = await fetch(url, { headers: { 'User-Agent': 'TimeTravelGuide/1.0' } });
        const data = await resp.json() as Record<string, unknown>;
        if (data.title) {
          res.json({
            source: 'wikipedia',
            title: data.title,
            extract: data.extract,
            description: data.description,
            thumbnail: (data.thumbnail as Record<string, unknown> | undefined)?.source,
            pageUrl: (data.content_urls as Record<string, Record<string, unknown>> | undefined)?.desktop?.page,
            coordinates: data.coordinates,
          });
        } else {
          res.status(404).json({ error: 'Wikipedia page not found', detail: data.detail || data });
        }
      } else if (source === 'wikidata') {
        const url = `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(query)}`;
        const resp = await fetch(url, { headers: { 'User-Agent': 'TimeTravelGuide/1.0' } });
        const data = await resp.json() as Record<string, unknown>;
        res.json({ source: 'wikidata', results: (data.results as Record<string, unknown> | undefined)?.bindings || [] });
      }
    } catch (err: unknown) {
      res.status(502).json({ error: `Fetch failed: ${err instanceof Error ? err.message : String(err)}` });
    }
  });

  // POST /api/v1/explore — crawl Wikipedia: summary + related + categories
  router.post('/explore', async (req, res) => {
    const parsed = ExploreSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation failed', details: parsed.error.issues });
      return;
    }
    const { query } = parsed.data;

    try {
      const title = encodeURIComponent(query.replace(/ /g, '_'));
      const headers = { 'User-Agent': 'TimeTravelGuide/1.0' };

      // Fetch summary + related + categories — each wrapped individually
      const fetchJSON = async (url: string) => {
        const r = await fetch(url, { headers });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      };

      const [summary, related, categoriesRaw] = await Promise.allSettled([
        fetchJSON(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`),
        fetchJSON(`https://en.wikipedia.org/api/rest_v1/page/related/${title}`),
        fetchJSON(`https://en.wikipedia.org/w/api.php?action=query&prop=categories&titles=${title}&format=json&cllimit=20&origin=*`),
      ]);

      // Extract data with fallbacks
      const summaryData = summary.status === 'fulfilled' ? summary.value : null;
      const relatedData = related.status === 'fulfilled' ? related.value : null;
      const catData = categoriesRaw.status === 'fulfilled' ? categoriesRaw.value : null;

      // Extract categories
      const pages = catData?.query?.pages || {};
      const cats: string[] = [];
      for (const p of Object.values(pages) as Record<string, unknown>[]) {
        for (const c of (p.categories || [])) {
          const catName = (c.title || '').replace('Category:', '');
          if (catName && !catName.startsWith('Articles_') && !catName.startsWith('All_') && !catName.startsWith('CS1_') && !catName.startsWith('Webarchive_')) {
            cats.push(catName);
          }
        }
      }

      res.json({
        query,
        summary: summaryData?.title ? {
          title: summaryData.title,
          description: summaryData.description,
          extract: summaryData.extract,
          thumbnail: summaryData.thumbnail?.source,
          pageUrl: summaryData.content_urls?.desktop?.page,
          coordinates: summaryData.coordinates,
        } : { error: 'Page not found' },
        related: (relatedData?.pages || []).map((p: Record<string, unknown>) => ({
          title: p.title,
          description: p.description,
          thumbnail: (p.thumbnail as Record<string, unknown> | undefined)?.source,
          pageUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(String(p.title).replace(/ /g, '_'))}`,
        })),
        relatedError: related.status === 'rejected' ? related.reason?.message : null,
        categories: cats.slice(0, 15),
        suggestedTags: cats.slice(0, 15).map((c: string) =>
          c.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/g, '')
        ),
        errors: [
          summary.status === 'rejected' ? `summary: ${summary.reason?.message}` : null,
          related.status === 'rejected' ? `related: ${related.reason?.message}` : null,
          categoriesRaw.status === 'rejected' ? `categories: ${categoriesRaw.reason?.message}` : null,
        ].filter(Boolean),
      });
    } catch (err: unknown) {
      res.status(502).json({ error: `Explore failed: ${err instanceof Error ? err.message : String(err)}` });
    }
  });

  // POST /api/v1/batch — fetch multiple Wikipedia pages in parallel
  router.post('/batch', async (req, res) => {
    const parsed = BatchSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation failed', details: parsed.error.issues });
      return;
    }
    const { queries } = parsed.data;

    try {
      const headers = { 'User-Agent': 'TimeTravelGuide/1.0' };
      const results = await Promise.all(
        queries.map(async (q: string) => {
          const title = encodeURIComponent(q.replace(/ /g, '_'));
          const resp = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`, { headers });
          return resp.json() as Promise<Record<string, unknown>>;
        })
      );

      res.json({
        count: queries.length,
        results: results.map((r: Record<string, unknown>, i: number) => ({
          query: queries[i],
          title: r.title || null,
          description: r.description || null,
          extract: typeof r.extract === 'string' ? r.extract.slice(0, 300) : null,
          pageUrl: (r.content_urls as Record<string, Record<string, unknown>> | undefined)?.desktop?.page || null,
          error: r.title ? null : (r.detail || 'Not found'),
        })),
      });
    } catch (err: unknown) {
      res.status(502).json({ error: `Batch fetch failed: ${err instanceof Error ? err.message : String(err)}` });
    }
  });

  // GET /api/v1/knowledge/:module — list all entries
  router.get('/knowledge/:module', (req, res) => {
    const module = req.params.module as ModuleName;
    if (!MODULES[module]) {
      res.status(404).json({ error: `Unknown module: ${module}. Valid: ${Object.keys(MODULES).join(', ')}` });
      return;
    }
    const { search, tags, era, limit, offset } = req.query;
    let results = [...MODULES[module].data];

    if (search) {
      const q = (search as string).toLowerCase();
      results = results.filter(e => JSON.stringify(e).toLowerCase().includes(q));
    }
    if (tags) {
      const tagList = (tags as string).split(',').map(t => t.trim().toLowerCase());
      results = results.filter((e: KnowledgeEntry) => e.tags && tagList.some(t => e.tags!.includes(t)));
    }
    if (era) {
      const eraFilter = (era as string).toLowerCase();
      results = results.filter((e: KnowledgeEntry) => {
        const year = e.year || e.optimalYear || (e.date ? parseInt(e.date.match(/\d{4}/)?.[0] || '0') : 0);
        if (eraFilter === '1970s') return year >= 1970 && year < 1980;
        if (eraFilter === '1980s') return year >= 1980 && year < 1990;
        if (eraFilter === '1990s') return year >= 1990 && year < 2000;
        if (eraFilter === '2000s') return year >= 2000;
        return true;
      });
    }

    const total = results.length;
    const off = parseInt(offset as string) || 0;
    const lim = parseInt(limit as string) || 100;
    results = results.slice(off, off + lim);

    res.json({ module, total, count: results.length, offset: off, limit: lim, data: results });
  });

  // GET /api/v1/knowledge/:module/:id — get one entry
  router.get('/knowledge/:module/:id', (req, res) => {
    const module = req.params.module as ModuleName;
    if (!MODULES[module]) {
      res.status(404).json({ error: `Unknown module: ${module}` });
      return;
    }
    const entry = MODULES[module].data.find((e: KnowledgeEntry) => e.id === req.params.id);
    if (!entry) {
      res.status(404).json({ error: `Entry ${req.params.id} not found in ${module}` });
      return;
    }
    res.json({ module, data: entry });
  });

  // GET /api/v1/search — federated search
  router.get('/search', (req, res) => {
    const { q, tags, era, module: modFilter } = req.query;
    const results: (KnowledgeEntry & { module: string })[] = [];

    for (const [name, mod] of Object.entries(MODULES)) {
      if (modFilter && name !== modFilter) continue;
      if (era) {
        const eraFilter = (era as string).toLowerCase();
        const filtered = mod.data.filter((e: KnowledgeEntry) => {
          const year = e.year || e.optimalYear || (e.date ? parseInt(e.date.match(/\d{4}/)?.[0] || '0') : 0);
          if (eraFilter === '1970s') return year >= 1970 && year < 1980;
          if (eraFilter === '1980s') return year >= 1980 && year < 1990;
          if (eraFilter === '1990s') return year >= 1990 && year < 2000;
          if (eraFilter === '2000s') return year >= 2000;
          return true;
        });
        results.push(...filtered.map((e: KnowledgeEntry) => ({ module: name, ...e })));
      } else {
        results.push(...mod.data.map((e: KnowledgeEntry) => ({ module: name, ...e })));
      }
    }

    let filtered = results;
    if (q) {
      const query = (q as string).toLowerCase();
      filtered = filtered.filter(e => JSON.stringify(e).toLowerCase().includes(query));
    }
    if (tags) {
      const tagList = (tags as string).split(',').map(t => t.trim().toLowerCase());
      filtered = filtered.filter((e: KnowledgeEntry & { module: string }) => e.tags && tagList.some((t: string) => e.tags!.includes(t)));
    }

    res.json({ query: q, total: filtered.length, data: filtered.slice(0, 50) });
  });

  // POST /api/v1/ingest — submit a new entry
  router.post('/ingest', (req, res) => {
    const parsed = IngestSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation failed', details: parsed.error.issues });
      return;
    }
    const { module, entry } = parsed.data;

    const mod = MODULES[module as ModuleName];
    const existing = mod.data.findIndex((e: KnowledgeEntry) => e.id === entry.id);
    if (existing >= 0) {
      mod.data[existing] = { ...mod.data[existing], ...entry };
      saveIngested(module, mod.data[existing]); // persist to disk
      res.json({ status: 'updated', id: entry.id, module, persisted: true });
    } else {
      mod.data.push(entry);
      saveIngested(module, entry); // persist to disk
      res.status(201).json({ status: 'created', id: entry.id, module, persisted: true });
    }
  });

  // GET /api/v1/export — full data dump (includes ingested)
  router.get('/export', (_req, res) => {
    const dump: Record<string, { label: string; count: number; staticEntries: number; ingestedEntries: number; data: KnowledgeEntry[] }> = {};
    for (const [name, mod] of Object.entries(MODULES)) {
      const staticCount = (name === 'sports' ? sportsAlmanac : name === 'finance' ? financialAlmanac : name === 'era-guide' ? eraGuideData : name === 'disasters' ? disasterAlmanac : name === 'tech-transfer' ? techTransferTargets : name === 'medical' ? medicalInterventions : name === 'safety' ? safetyProtocols : blueprintsData).length;
      dump[name] = {
        label: mod.label,
        count: mod.data.length,
        staticEntries: staticCount,
        ingestedEntries: mod.data.length - staticCount,
        data: mod.data,
      };
    }
    // Also include the raw ingested store for portability
    res.json({
      exported_at: new Date().toISOString(),
      modules: dump,
      ingested: exportIngested(),
      _portability: 'To restore on another computer, POST /api/v1/restore with the "ingested" field from this response.',
    });
  });

  // POST /api/v1/restore — restore ingested data from export
  router.post('/restore', (req, res) => {
    const parsed = RestoreSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation failed', details: parsed.error.issues });
      return;
    }
    const { ingested: store } = parsed.data;
    try {
      const result = restoreIngested(store);
      res.json({ status: 'restored', ...result, message: 'Restart the server to fully load restored entries into MODULES.' });
    } catch (err: unknown) {
      res.status(500).json({ error: `Restore failed: ${err instanceof Error ? err.message : String(err)}` });
    }
  });

  // GET /api/v1/stats — module counts and coverage
  router.get('/stats', (_req, res) => {
    const modules: { module: string; label: string; entries: number; tagged: number; taggedPercent: number; yearRange: string }[] = [];
    let totalEntries = 0;
    let totalTagged = 0;
    const allTags = new Map<string, number>();

    for (const [name, mod] of Object.entries(MODULES)) {
      const count = mod.data.length;
      const tagged = mod.data.filter((e: KnowledgeEntry) => e.tags && e.tags.length > 0).length;
      const eras = new Set<number>();
      mod.data.forEach((e: KnowledgeEntry) => {
        const year = e.year || e.optimalYear || (e.date ? parseInt(e.date.match(/\d{4}/)?.[0] || '0') : 0);
        if (year > 0) eras.add(year);
        if (e.tags) e.tags.forEach((t: string) => allTags.set(t, (allTags.get(t) || 0) + 1));
      });

      modules.push({
        module: name,
        label: mod.label,
        entries: count,
        tagged,
        taggedPercent: count > 0 ? Math.round((tagged / count) * 100) : 0,
        yearRange: eras.size > 0 ? `${Math.min(...eras)}–${Math.max(...eras)}` : 'N/A',
      });
      totalEntries += count;
      totalTagged += tagged;
    }

    const tagCloud = [...allTags.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
      .map(([tag, count]) => ({ tag, count }));

    res.json({
      totalEntries,
      totalTagged,
      overallTaggedPercent: Math.round((totalTagged / totalEntries) * 100),
      modules,
      topTags: tagCloud,
    });
  });

  return router;
}
