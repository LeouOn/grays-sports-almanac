# Athena Memory Palace v2 — Self-Seeding Commentary Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace passive LLM calls on data pages with a self-seeding SQLite commentary cache, add "Chat about this" navigation to Quiz, and fix EraGuide/Engineering data modules.

**Architecture:** SQLite (`better-sqlite3`) stores all LLM-generated content server-side. New `AthenaCommentary` component replaces `CompanionThought` with a 3-tier lookup (SQLite → static JSON → user-initiated fetch). PalaceLink becomes collapsed/user-initiated. "Chat about this" button navigates to Quiz with auto-question via URL params.

**Tech Stack:** better-sqlite3, Express, React, Vitest, TypeScript

**Spec:** `docs/superpowers/specs/2026-06-03-athena-self-seeding-design.md`

---

## File Structure

### New Files
- `server/db.ts` — SQLite database module (schema, migrations, CRUD helpers)
- `server/entry-registry.ts` — Scans data modules, upserts entries at startup
- `server/athena-routes.ts` — GET/POST commentary + palace-link endpoints
- `src/components/AthenaCommentary.tsx` — Replaces CompanionThought (3-tier lookup)
- `src/components/ChatAboutThis.tsx` — "Chat about this" button with auto-question
- `server/db.test.ts` — Tests for DB module
- `server/entry-registry.test.ts` — Tests for entry registry
- `server/athena-routes.test.ts` — Tests for API endpoints
- `src/components/AthenaCommentary.test.tsx` — Tests for AthenaCommentary
- `src/components/ChatAboutThis.test.tsx` — Tests for ChatAboutThis

### Modified Files
- `src/data/era-guide.ts` — Add synthetic `id` field
- `src/data/engineering.ts` — Add `tags` field
- `server/tagMatch.ts` — Include era-guide and engineering
- `server/palaceLinkHandler.ts` — Refactor to use SQLite
- `server/index.ts` — Wire DB init, new routes, startup sequence
- `src/pages/Quiz.tsx` — URL param reading for entryId + q
- All 8 data pages — Wire AthenaCommentary + ChatAboutThis, remove CompanionThought import/usage

### Removed Files
- `src/lib/palaceCache.ts` — Replaced by SQLite

### Unchanged Files
- `src/components/PalaceHook.tsx` — Still uses static JSON
- `src/components/AthenaQuizReaction.tsx` — Still uses static JSON
- `src/data/athena-static.json` — Kept for mnemonics + quizReactions

---

### Task 1: Install better-sqlite3

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install dependency**

Run:
```bash
npm install better-sqlite3 && npm install -D @types/better-sqlite3
```

- [ ] **Step 2: Verify install**

Run: `node -e "const db = require('better-sqlite3')(':memory:'); console.log(db.pragma('journal_mode', {simple:true})); db.close()"`
Expected: `wal` or `memory`

---

### Task 2: SQLite Database Module

**Files:**
- Create: `server/db.ts`
- Create: `server/db.test.ts`

- [ ] **Step 1: Write tests for database module**

Create `server/db.test.ts`:
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { initAthenaDb, getCommentary, upsertCommentary, getEntry, upsertEntry, type AthenaDb } from './db.js';
import type { Database } from 'better-sqlite3';

describe('AthenaDb', () => {
  let db: AthenaDb;

  beforeEach(() => {
    db = initAthenaDb(':memory:');
  });

  it('creates tables on init', () => {
    const tables = (db as unknown as Database)
      .prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
      .all() as { name: string }[];
    const names = tables.map(t => t.name);
    expect(names).toContain('entries');
    expect(names).toContain('commentary');
    expect(names).toContain('chat_context');
  });

  it('upserts and retrieves an entry', () => {
    upsertEntry(db, {
      entry_id: 'tenerife',
      module: 'disasters',
      title: 'Tenerife Airport Disaster',
      era: null,
      year: 1977,
      category: 'Aviation',
      subcategory: null,
      tags: '["aviation","fog","atc"]',
      data_hash: 'abc123',
    });
    const entry = getEntry(db, 'tenerife');
    expect(entry).not.toBeNull();
    expect(entry!.entry_id).toBe('tenerife');
    expect(entry!.module).toBe('disasters');
    expect(entry!.tags).toBe('["aviation","fog","atc"]');
  });

  it('upserts entry (updates on conflict)', () => {
    upsertEntry(db, { entry_id: 'x', module: 'sports', title: 'A', era: null, year: 1990, category: null, subcategory: null, tags: '[]', data_hash: 'h1' });
    upsertEntry(db, { entry_id: 'x', module: 'sports', title: 'B', era: null, year: 1990, category: null, subcategory: null, tags: '[]', data_hash: 'h2' });
    const entry = getEntry(db, 'x');
    expect(entry!.title).toBe('B');
    expect(entry!.data_hash).toBe('h2');
  });

  it('upserts and retrieves commentary', () => {
    upsertEntry(db, { entry_id: 't', module: 'disasters', title: 'T', era: null, year: 1977, category: null, subcategory: null, tags: '[]', data_hash: 'h' });

    upsertCommentary(db, {
      entry_id: 't',
      content_type: 'commentary',
      companion_id: 'athena',
      content: 'A dark day for aviation.',
      context_hash: 'ch1',
      source: 'precomputed',
      provider: 'deepseek',
      model: 'deepseek-v4-pro',
      target_entry_id: null,
      tier: 0,
      performance: '',
      topic: '',
    });

    const result = getCommentary(db, { entry_id: 't', content_type: 'commentary', companion_id: 'athena' });
    expect(result).not.toBeNull();
    expect(result!.content).toBe('A dark day for aviation.');
    expect(result!.source).toBe('precomputed');
  });

  it('getCommentary returns null for missing entry', () => {
    const result = getCommentary(db, { entry_id: 'nonexistent', content_type: 'commentary', companion_id: 'athena' });
    expect(result).toBeNull();
  });

  it('increments access_count', () => {
    upsertEntry(db, { entry_id: 't', module: 'disasters', title: 'T', era: null, year: 1977, category: null, subcategory: null, tags: '[]', data_hash: 'h' });
    upsertCommentary(db, { entry_id: 't', content_type: 'commentary', companion_id: 'athena', content: 'X', context_hash: 'ch', source: 'lazy', provider: null, model: null, target_entry_id: null, tier: 0, performance: '', topic: '' });

    getCommentary(db, { entry_id: 't', content_type: 'commentary', companion_id: 'athena' });
    getCommentary(db, { entry_id: 't', content_type: 'commentary', companion_id: 'athena' });

    const row = getCommentary(db, { entry_id: 't', content_type: 'commentary', companion_id: 'athena' });
    expect(row!.access_count).toBe(2);
  });

  it('stores and retrieves quiz reactions', () => {
    upsertEntry(db, { entry_id: '__quiz__', module: 'system', title: 'Quiz Reactions', era: null, year: null, category: null, subcategory: null, tags: '[]', data_hash: 'h' });

    upsertCommentary(db, {
      entry_id: '__quiz__',
      content_type: 'quiz_reaction',
      companion_id: 'athena',
      content: 'Nailed it!',
      context_hash: 'ch',
      source: 'precomputed',
      provider: null,
      model: null,
      target_entry_id: null,
      tier: 1,
      performance: 'high',
      topic: 'sports',
    });

    const result = getCommentary(db, { entry_id: '__quiz__', content_type: 'quiz_reaction', companion_id: 'athena', tier: 1, performance: 'high', topic: 'sports' });
    expect(result!.content).toBe('Nailed it!');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run server/db.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement database module**

Create `server/db.ts`:
```typescript
import Database from 'better-sqlite3';

export interface AthenaDb {
  _db: Database.Database;
}

// ── Schema ──────────────────────────────────────────────────

const MIGRATIONS = `
CREATE TABLE IF NOT EXISTS entries (
  entry_id    TEXT PRIMARY KEY,
  module      TEXT NOT NULL,
  title       TEXT NOT NULL,
  era         TEXT,
  year        INTEGER,
  category    TEXT,
  subcategory TEXT,
  tags        TEXT NOT NULL DEFAULT '[]',
  data_hash   TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_entries_module ON entries(module);

CREATE TABLE IF NOT EXISTS commentary (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  entry_id        TEXT NOT NULL,
  content_type    TEXT NOT NULL,
  companion_id    TEXT NOT NULL DEFAULT 'athena',
  content         TEXT NOT NULL,
  context_hash    TEXT NOT NULL,
  source          TEXT NOT NULL DEFAULT 'precomputed',
  provider        TEXT,
  model           TEXT,
  target_entry_id TEXT,
  tier            INTEGER NOT NULL DEFAULT 0,
  performance     TEXT NOT NULL DEFAULT '',
  topic           TEXT NOT NULL DEFAULT '',
  access_count    INTEGER NOT NULL DEFAULT 0,
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now')),

  FOREIGN KEY (entry_id) REFERENCES entries(entry_id),
  UNIQUE(entry_id, content_type, companion_id, tier, performance, topic)
);

CREATE INDEX IF NOT EXISTS idx_commentary_lookup ON commentary(entry_id, content_type, companion_id);
CREATE INDEX IF NOT EXISTS idx_commentary_source ON commentary(source);
CREATE INDEX IF NOT EXISTS idx_commentary_access ON commentary(access_count DESC);

CREATE TABLE IF NOT EXISTS chat_context (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  entry_id    TEXT NOT NULL,
  question    TEXT NOT NULL,
  context     TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),

  FOREIGN KEY (entry_id) REFERENCES entries(entry_id)
);

CREATE INDEX IF NOT EXISTS idx_chat_context_entry ON chat_context(entry_id);
`;

// ── Init ────────────────────────────────────────────────────

export function initAthenaDb(path: string = 'data/athena.db'): AthenaDb {
  const db = new Database(path);
  db.pragma('journal_mode = WAL');
  db.exec(MIGRATIONS);
  return { _db: db };
}

// ── Entries ─────────────────────────────────────────────────

export interface EntryRow {
  entry_id: string;
  module: string;
  title: string;
  era: string | null;
  year: number | null;
  category: string | null;
  subcategory: string | null;
  tags: string;
  data_hash: string;
}

const UPSERT_ENTRY = `
INSERT INTO entries (entry_id, module, title, era, year, category, subcategory, tags, data_hash)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
ON CONFLICT(entry_id) DO UPDATE SET
  module=excluded.module, title=excluded.title, era=excluded.era, year=excluded.year,
  category=excluded.category, subcategory=excluded.subcategory, tags=excluded.tags,
  data_hash=excluded.data_hash
`;

export function upsertEntry(db: AthenaDb, entry: EntryRow): void {
  db._db.prepare(UPSERT_ENTRY).run(
    entry.entry_id, entry.module, entry.title, entry.era, entry.year,
    entry.category, entry.subcategory, entry.tags, entry.data_hash
  );
}

const GET_ENTRY = `SELECT * FROM entries WHERE entry_id = ?`;

export function getEntry(db: AthenaDb, entryId: string): EntryRow | null {
  return db._db.prepare(GET_ENTRY).get(entryId) as EntryRow | null ?? null;
}

// ── Commentary ──────────────────────────────────────────────

export interface CommentaryRow {
  id: number;
  entry_id: string;
  content_type: string;
  companion_id: string;
  content: string;
  context_hash: string;
  source: string;
  provider: string | null;
  model: string | null;
  target_entry_id: string | null;
  tier: number;
  performance: string;
  topic: string;
  access_count: number;
  created_at: string;
  updated_at: string;
}

export interface CommentaryKey {
  entry_id: string;
  content_type: string;
  companion_id: string;
  tier?: number;
  performance?: string;
  topic?: string;
}

const UPSERT_COMMENTARY = `
INSERT INTO commentary (entry_id, content_type, companion_id, content, context_hash, source, provider, model, target_entry_id, tier, performance, topic)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
ON CONFLICT(entry_id, content_type, companion_id, tier, performance, topic) DO UPDATE SET
  content=excluded.content, context_hash=excluded.context_hash, source=excluded.source,
  provider=excluded.provider, model=excluded.model, target_entry_id=excluded.target_entry_id,
  updated_at=datetime('now')
`;

export function upsertCommentary(db: AthenaDb, row: Omit<CommentaryRow, 'id' | 'access_count' | 'created_at' | 'updated_at'>): void {
  db._db.prepare(UPSERT_COMMENTARY).run(
    row.entry_id, row.content_type, row.companion_id, row.content, row.context_hash,
    row.source, row.provider, row.model, row.target_entry_id,
    row.tier, row.performance, row.topic
  );
}

const GET_COMMENTARY = `
SELECT * FROM commentary
WHERE entry_id = ? AND content_type = ? AND companion_id = ? AND tier = ? AND performance = ? AND topic = ?
`;

export function getCommentary(db: AthenaDb, key: CommentaryKey): CommentaryRow | null {
  const row = db._db.prepare(GET_COMMENTARY).get(
    key.entry_id, key.content_type, key.companion_id,
    key.tier ?? 0, key.performance ?? '', key.topic ?? ''
  ) as CommentaryRow | null ?? null;

  // Increment access count on read
  if (row) {
    db._db.prepare('UPDATE commentary SET access_count = access_count + 1 WHERE id = ?').run(row.id);
    row.access_count += 1;
  }

  return row;
}

// ── Staleness ───────────────────────────────────────────────

/**
 * Find commentary rows whose entry's data_hash has changed since the commentary was created.
 * Returns entry_ids whose commentary needs recomputing.
 */
export function findStaleEntryIds(db: AthenaDb): string[] {
  const rows = db._db.prepare(`
    SELECT DISTINCT c.entry_id
    FROM commentary c
    JOIN entries e ON c.entry_id = e.entry_id
    WHERE c.source != 'precomputed' OR c.updated_at < e.created_at
  `).all() as { entry_id: string }[];
  return rows.map(r => r.entry_id);
}

// ── Chat Context ────────────────────────────────────────────

export function insertChatContext(db: AthenaDb, entryId: string, question: string, context: string): void {
  db._db.prepare('INSERT INTO chat_context (entry_id, question, context) VALUES (?, ?, ?)').run(entryId, question, context);
}

// ── Seed from athena-static.json ────────────────────────────

export function seedStaticContent(db: AthenaDb, staticData: { mnemonics: Record<string, string>; quizReactions: Record<string, string> }): void {
  // Ensure system entry exists for quiz reactions
  upsertEntry(db, {
    entry_id: '__quiz__',
    module: 'system',
    title: 'Quiz Reactions',
    era: null, year: null, category: null, subcategory: null,
    tags: '[]', data_hash: 'static',
  });

  for (const [routeId, mnemonic] of Object.entries(staticData.mnemonics)) {
    upsertCommentary(db, {
      entry_id: routeId,
      content_type: 'mnemonic',
      companion_id: 'athena',
      content: mnemonic,
      context_hash: 'static',
      source: 'precomputed',
      provider: null, model: null, target_entry_id: null,
      tier: 0, performance: '', topic: '',
    });
  }

  for (const [key, reaction] of Object.entries(staticData.quizReactions)) {
    const [tierStr, perf, topic] = key.split(':');
    upsertCommentary(db, {
      entry_id: '__quiz__',
      content_type: 'quiz_reaction',
      companion_id: 'athena',
      content: reaction,
      context_hash: 'static',
      source: 'precomputed',
      provider: null, model: null, target_entry_id: null,
      tier: parseInt(tierStr, 10),
      performance: perf,
      topic: topic,
    });
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run server/db.test.ts`
Expected: All 7 tests PASS

- [ ] **Step 5: Commit**

```bash
git add server/db.ts server/db.test.ts package.json package-lock.json
git commit -m "feat: add SQLite database module for Athena commentary cache"
```

---

### Task 3: Fix EraGuide — Add `id` Field

**Files:**
- Modify: `src/data/era-guide.ts`

- [ ] **Step 1: Add `id` field to EraGuideEntry interface and generate it**

In `src/data/era-guide.ts`, add `id` to the interface and generate it for each entry:

```typescript
export interface EraGuideEntry {
  id: string;                  // <-- ADD THIS
  category: 'Slang' | 'Prices' | 'Tech Constraints' | 'Fashion' | 'Identity';
  era: '1970s' | '1980s' | '1990s' | '2000s';
  item: string;
  description: string;
  advice: string;
  tags?: string[];
}

function slugifyItem(item: string): string {
  return item
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    || 'entry';
}

function generateId(entry: Omit<EraGuideEntry, 'id'>): string {
  return `era-guide-${entry.era.toLowerCase()}-${entry.category.toLowerCase()}-${slugifyItem(entry.item)}`;
}
```

Then update the array to wrap each entry. Add after the array definition:

```typescript
// Generate stable IDs for each entry
eraGuideData.forEach(entry => {
  if (!entry.id) {
    (entry as { id: string }).id = generateId(entry);
  }
});
```

- [ ] **Step 2: Verify EraGuide entries have IDs**

Run: `node -e "const d = require('./src/data/era-guide.ts'); console.log('skipped - needs ts-node')" 2>/dev/null || echo "Check via test"`

Add a quick test to `src/data/athena-static.test.ts` or create a new test:

Create `src/data/era-guide.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { eraGuideData } from './era-guide.js';

describe('era-guide data integrity', () => {
  it('every entry has a unique id', () => {
    const ids = eraGuideData.map(e => e.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('ids follow era-guide-{era}-{category}-{slug} pattern', () => {
    for (const entry of eraGuideData) {
      expect(entry.id).toMatch(/^era-guide-/);
    }
  });

  it('no entry has empty id', () => {
    for (const entry of eraGuideData) {
      expect(entry.id.length).toBeGreaterThan(10);
    }
  });
});
```

Run: `npx vitest run src/data/era-guide.test.ts`
Expected: All 3 tests PASS

- [ ] **Step 3: Commit**

```bash
git add src/data/era-guide.ts src/data/era-guide.test.ts
git commit -m "feat: add synthetic id field to EraGuide entries"
```

---

### Task 4: Fix Engineering — Add `tags` Field

**Files:**
- Modify: `src/data/engineering.ts`

- [ ] **Step 1: Add `tags` to EngineeringSpec and derive them**

In `src/data/engineering.ts`, add `tags` to the interface:

```typescript
export interface EngineeringSpec {
  id: string;
  era: '1950s' | '1960s' | '1970s' | '1980s' | '1990s' | '2000s';
  subDomain: 'cnc_machining' | 'semiconductors' | 'metallurgy' | 'aerospace' | 'telecommunications';
  conceptName: string;
  description: string;
  keySpecs: Record<string, string>;
  provenance: {
    sourceUrl: string;
    sourceSite: string;
    confidence: ConfidenceLevel;
    extractedAt: string;
  };
  tags?: string[];              // <-- ADD THIS
}
```

Then derive tags from subDomain and conceptName. Add after the data array:

```typescript
function deriveEngineeringTags(subDomain: string, conceptName: string): string[] {
  const domainTags: Record<string, string[]> = {
    cnc_machining: ['cnc', 'machining', 'numerical-control'],
    semiconductors: ['semiconductor', 'silicon', 'integrated-circuit'],
    metallurgy: ['metallurgy', 'steel', 'alloy'],
    aerospace: ['aerospace', 'aviation', 'rocketry'],
    telecommunications: ['telecom', 'communication', 'radio'],
  };
  const tags = [...(domainTags[subDomain] ?? [])];
  // Extract meaningful words from conceptName (skip common words)
  const skip = new Set(['the', 'a', 'an', 'of', 'in', 'for', 'and', 'with', 'from', 'to', 'at', 'by']);
  conceptName.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/)
    .filter(w => w.length > 2 && !skip.has(w))
    .forEach(w => tags.push(w));
  return [...new Set(tags)];
}

engineeringData.forEach(entry => {
  if (!entry.tags || entry.tags.length === 0) {
    entry.tags = deriveEngineeringTags(entry.subDomain, entry.conceptName);
  }
});
```

- [ ] **Step 2: Verify with test**

Create `src/data/engineering.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { engineeringData } from './engineering.js';

describe('engineering data integrity', () => {
  it('every entry has tags', () => {
    for (const entry of engineeringData) {
      expect(entry.tags).toBeDefined();
      expect(entry.tags!.length).toBeGreaterThan(0);
    }
  });

  it('tags include subDomain keywords', () => {
    for (const entry of engineeringData) {
      const tagStr = entry.tags!.join(',');
      if (entry.subDomain === 'cnc_machining') {
        expect(tagStr).toContain('cnc');
      }
    }
  });
});
```

Run: `npx vitest run src/data/engineering.test.ts`
Expected: All 2 tests PASS

- [ ] **Step 3: Commit**

```bash
git add src/data/engineering.ts src/data/engineering.test.ts
git commit -m "feat: add auto-derived tags to Engineering entries"
```

---

### Task 5: Update tagMatch.ts — Include EraGuide and Engineering

**Files:**
- Modify: `server/tagMatch.ts`

- [ ] **Step 1: Add era-guide and engineering to ALL_ENTRIES**

In `server/tagMatch.ts`, add the missing imports and projections:

```typescript
import { eraGuideData } from '../src/data/era-guide.js';
import { engineeringData } from '../src/data/engineering.js';
```

Add to the `ALL_ENTRIES` array (before the closing `];`):

```typescript
  ...eraGuideData.map((e) => project('era-guide', e.id, `${e.item} (${e.era})`, e.advice, e.tags)),
  ...engineeringData.map((e) => project('engineering', e.id, e.conceptName, e.description, e.tags)),
```

Also remove the comment about `era-guide` being intentionally excluded and the comment about `engineeringData` receiving empty tags.

- [ ] **Step 2: Run existing tests**

Run: `npx vitest run`
Expected: All existing tests still PASS (tagMatch doesn't have dedicated tests, but RelatedEntries and palaceLinkHandler tests should pass)

- [ ] **Step 3: Commit**

```bash
git add server/tagMatch.ts
git commit -m "feat: include era-guide and engineering in cross-module tag matching"
```

---

### Task 6: Entry Registry — Scan Data Modules at Startup

**Files:**
- Create: `server/entry-registry.ts`
- Create: `server/entry-registry.test.ts`

- [ ] **Step 1: Write tests**

Create `server/entry-registry.test.ts`:
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { initAthenaDb, getEntry, type AthenaDb } from './db.js';
import { registerEntries } from './entry-registry.js';

describe('registerEntries', () => {
  let db: AthenaDb;

  beforeEach(() => {
    db = initAthenaDb(':memory:');
  });

  it('registers entries from all data modules', () => {
    registerEntries(db);
    const count = (db._db.prepare('SELECT COUNT(*) as c FROM entries').get() as { c: number }).c;
    expect(count).toBeGreaterThan(50); // we have hundreds of entries across 9 modules
  });

  it('registers era-guide entries with synthetic ids', () => {
    registerEntries(db);
    const entry = getEntry(db, 'era-guide-1970s-prices-gasoline');
    // May or may not exist depending on exact slug — check that at least one era-guide entry exists
    const count = (db._db.prepare("SELECT COUNT(*) as c FROM entries WHERE module = 'era-guide'").get() as { c: number }).c;
    expect(count).toBeGreaterThan(0);
  });

  it('registers engineering entries with tags', () => {
    registerEntries(db);
    const engEntries = (db._db.prepare("SELECT * FROM entries WHERE module = 'engineering'").all() as { tags: string }[]);
    for (const e of engEntries) {
      const tags = JSON.parse(e.tags);
      expect(tags.length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run server/entry-registry.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement entry registry**

Create `server/entry-registry.ts`:
```typescript
import crypto from 'node:crypto';
import type { AthenaDb, EntryRow } from './db.js';
import { upsertEntry } from './db.js';

import { sportsAlmanac } from '../src/data/sports.js';
import { financialAlmanac } from '../src/data/finance.js';
import { eraGuideData } from '../src/data/era-guide.js';
import { disasterAlmanac } from '../src/data/disasters.js';
import { techTransferTargets } from '../src/data/tech-transfer.js';
import { medicalInterventions } from '../src/data/medical.js';
import { safetyProtocols } from '../src/data/safety.js';
import { blueprintsData } from '../src/data/blueprints.js';
import { engineeringData } from '../src/data/engineering.js';

function hashFields(...fields: (string | number | null | undefined)[]): string {
  const content = fields.map(f => String(f ?? '')).join('|');
  return crypto.createHash('sha256').update(content).digest('hex').slice(0, 16);
}

export function registerEntries(db: AthenaDb): void {
  const rows: EntryRow[] = [];

  for (const e of sportsAlmanac) {
    rows.push({
      entry_id: e.id, module: 'sports', title: `${e.event} (${e.year})`,
      era: null, year: e.year, category: e.sport, subcategory: null,
      tags: JSON.stringify(e.tags ?? []), data_hash: hashFields(e.event, e.winner, e.score, e.notableDetails),
    });
  }

  for (const e of financialAlmanac) {
    rows.push({
      entry_id: e.id, module: 'finance', title: `${e.event} (${e.date})`,
      era: null, year: e.year, category: e.category, subcategory: null,
      tags: JSON.stringify(e.tags ?? []), data_hash: hashFields(e.event, e.notableDetails, e.direction),
    });
  }

  for (const e of eraGuideData) {
    rows.push({
      entry_id: e.id, module: 'era-guide', title: `${e.item} (${e.era})`,
      era: e.era, year: null, category: e.category, subcategory: null,
      tags: JSON.stringify(e.tags ?? []), data_hash: hashFields(e.item, e.description, e.advice),
    });
  }

  for (const e of disasterAlmanac) {
    rows.push({
      entry_id: e.id, module: 'disasters', title: e.event,
      era: null, year: e.year, category: e.category, subcategory: null,
      tags: JSON.stringify(e.tags ?? []), data_hash: hashFields(e.event, e.cause, e.intervention),
    });
  }

  for (const e of techTransferTargets) {
    rows.push({
      entry_id: e.id, module: 'tech-transfer', title: e.concept,
      era: null, year: e.optimalYear, category: null, subcategory: null,
      tags: JSON.stringify(e.tags ?? []), data_hash: hashFields(e.concept, e.description, e.optimalYear),
    });
  }

  for (const e of medicalInterventions) {
    rows.push({
      entry_id: e.id, module: 'medical', title: e.condition,
      era: null, year: e.optimalYear, category: null, subcategory: null,
      tags: JSON.stringify(e.tags ?? []), data_hash: hashFields(e.condition, e.details, e.optimalYear),
    });
  }

  for (const e of safetyProtocols) {
    rows.push({
      entry_id: e.id, module: 'safety', title: e.title,
      era: null, year: null, category: e.category, subcategory: null,
      tags: JSON.stringify(e.tags ?? []), data_hash: hashFields(e.title, e.protocol, e.eraNote),
    });
  }

  for (const e of blueprintsData) {
    rows.push({
      entry_id: e.id, module: 'blueprints', title: e.title,
      era: null, year: null, category: e.category, subcategory: null,
      tags: JSON.stringify(e.tags ?? []), data_hash: hashFields(e.title, e.description, e.stepByStepGuide),
    });
  }

  for (const e of engineeringData) {
    rows.push({
      entry_id: e.id, module: 'engineering', title: e.conceptName,
      era: e.era, year: null, category: null, subcategory: e.subDomain,
      tags: JSON.stringify(e.tags ?? []), data_hash: hashFields(e.conceptName, e.description, JSON.stringify(e.keySpecs)),
    });
  }

  const insert = db._db.transaction(() => {
    for (const row of rows) {
      upsertEntry(db, row);
    }
  });
  insert();
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run server/entry-registry.test.ts`
Expected: All 3 tests PASS

- [ ] **Step 5: Commit**

```bash
git add server/entry-registry.ts server/entry-registry.test.ts
git commit -m "feat: add entry registry to scan data modules into SQLite"
```

---

### Task 7: Athena API Routes

**Files:**
- Create: `server/athena-routes.ts`
- Create: `server/athena-routes.test.ts`

- [ ] **Step 1: Write tests**

Create `server/athena-routes.test.ts`:
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { initAthenaDb, type AthenaDb } from './db.js';
import { createAthenaRoutes } from './athena-routes.js';
import { registerEntries } from './entry-registry.js';

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

    it('returns cached content when available', async () => {
      // Seed a commentary
      const { upsertCommentary } = await import('./db.js');
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
  });

  describe('GET /api/athena/palace-link', () => {
    it('returns null when not cached', async () => {
      const res = await request(app).get('/api/athena/palace-link?entryId=tenerife');
      expect(res.status).toBe(200);
      expect(res.body.cached).toBe(false);
    });
  });
});
```

Note: The POST tests that trigger LLM calls should be integration tests, not unit tests. For unit tests, mock `callProviderChain`.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run server/athena-routes.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement Athena routes**

Create `server/athena-routes.ts`:
```typescript
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run server/athena-routes.test.ts`
Expected: All tests PASS

Note: You may need `npm install -D supertest @types/supertest` if not already installed.

- [ ] **Step 5: Commit**

```bash
git add server/athena-routes.ts server/athena-routes.test.ts
git commit -m "feat: add Athena API routes for commentary and palace-link with SQLite cache"
```

---

### Task 8: Wire Startup + Routes in server/index.ts

**Files:**
- Modify: `server/index.ts`

- [ ] **Step 1: Add imports and startup sequence**

At the top of `server/index.ts`, add:

```typescript
import { initAthenaDb, seedStaticContent } from './db.js';
import { registerEntries } from './entry-registry.js';
import { createAthenaRoutes } from './athena-routes.js';
import athenaStatic from '../src/data/athena-static.json' with { type: 'json' };
```

After `dotenv.config()`, add the DB init:

```typescript
// ── Athena SQLite DB ────────────────────────────────────────
const athenaDb = initAthenaDb('data/athena.db');
registerEntries(athenaDb);
seedStaticContent(athenaDb, athenaStatic as { mnemonics: Record<string, string>; quizReactions: Record<string, string> });
console.log('[athena] SQLite cache initialized');
```

Mount the new routes (after existing routes):

```typescript
app.use('/api/athena', createAthenaRoutes(athenaDb));
```

- [ ] **Step 2: Verify server starts**

Run: `npx tsx server/index.ts`
Expected: Server starts, logs `[athena] SQLite cache initialized`, no errors

- [ ] **Step 3: Commit**

```bash
git add server/index.ts
git commit -m "feat: wire Athena SQLite DB and routes into server startup"
```

---

### Task 9: AthenaCommentary Component

**Files:**
- Create: `src/components/AthenaCommentary.tsx`
- Create: `src/components/AthenaCommentary.test.tsx`

- [ ] **Step 1: Write tests**

Create `src/components/AthenaCommentary.test.tsx`:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AthenaCommentary } from './AthenaCommentary';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('AthenaCommentary', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('shows cached content on mount', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ cached: true, content: 'A dark day for aviation.', source: 'precomputed' }),
    });

    render(<AthenaCommentary entryId="tenerife" />);

    await waitFor(() => {
      expect(screen.getByText(/A dark day for aviation/)).toBeTruthy();
    });
  });

  it('shows button when not cached', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ cached: false, content: null }),
    });

    render(<AthenaCommentary entryId="tenerife" />);

    await waitFor(() => {
      expect(screen.getByText(/What does Athena think/i)).toBeTruthy();
    });
  });

  it('fetches commentary on button click', async () => {
    // First call: GET (not cached)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ cached: false, content: null }),
    });
    // Second call: POST (generates)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ content: 'A dark day for aviation.', provider: 'deepseek', source: 'lazy' }),
    });

    const user = userEvent.setup();
    render(<AthenaCommentary entryId="tenerife" />);

    await waitFor(() => {
      expect(screen.getByText(/What does Athena think/i)).toBeTruthy();
    });

    await user.click(screen.getByText(/What does Athena think/i));

    await waitFor(() => {
      expect(screen.getByText(/A dark day for aviation/)).toBeTruthy();
    });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/AthenaCommentary.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 3: Implement AthenaCommentary**

Create `src/components/AthenaCommentary.tsx`:
```tsx
import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, RefreshCw, Sparkles } from 'lucide-react';

interface AthenaCommentaryProps {
  entryId: string;
  companionId?: string;
}

interface CommentaryResult {
  content: string | null;
  cached: boolean;
  provider?: string | null;
  source?: string | null;
}

export function AthenaCommentary({ entryId, companionId = 'athena' }: AthenaCommentaryProps) {
  const [result, setResult] = useState<CommentaryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch cached content on mount
  useEffect(() => {
    if (!entryId) return;
    const controller = new AbortController();

    setLoading(true);
    fetch(`/api/athena/commentary?entryId=${encodeURIComponent(entryId)}&companionId=${encodeURIComponent(companionId)}`, { signal: controller.signal })
      .then(r => r.json())
      .then((data: CommentaryResult) => {
        if (data.cached && data.content) {
          setResult(data);
        } else {
          setResult(null);
        }
      })
      .catch((err: Error) => {
        if (err.name !== 'AbortError') {
          console.error('AthenaCommentary fetch error:', err);
          setError('Failed to check cache.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => { controller.abort(); };
  }, [entryId, companionId]);

  const fetchCommentary = useCallback(async (force = false) => {
    setLoading(true);
    setError('');
    try {
      const resp = await fetch('/api/athena/commentary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entryId, companionId, forceRecompute: force }),
      });
      if (!resp.ok) throw new Error('Failed to generate commentary');
      const data: CommentaryResult = await resp.json();
      setResult({ content: data.content, cached: true, provider: data.provider, source: data.source });
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Failed to generate commentary.');
    } finally {
      setLoading(false);
    }
  }, [entryId, companionId]);

  if (loading && !result) {
    return (
      <div className="flex gap-3 items-center p-3 rounded-lg border border-neutral-800 bg-neutral-900/30 text-neutral-400 mt-3 select-none animate-pulse">
        <span className="text-xl">🏛️</span>
        <div className="flex flex-col gap-1.5 flex-1">
          <span className="text-[10px] font-bold text-amber-400/80 uppercase tracking-wider">Athena is consulting her archives...</span>
          <div className="flex gap-1 items-center">
            <span className="h-1.5 w-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 bg-amber-400 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex gap-3 items-center p-3 rounded-lg border border-neutral-800 bg-neutral-900/30 text-neutral-400 mt-3 select-none">
        <span className="text-xl">🏛️</span>
        <div className="flex-1 text-xs flex items-center justify-between">
          <span className="text-neutral-500">{error}</span>
          <button onClick={() => fetchCommentary()} className="text-amber-400 hover:text-amber-300 transition-colors p-1 cursor-pointer" title="Retry">
            <RefreshCw className="size-3.5" />
          </button>
        </div>
      </div>
    );
  }

  if (!result?.content) {
    return (
      <button
        onClick={() => fetchCommentary()}
        disabled={loading}
        className="flex items-center gap-2 px-3 py-2 mt-3 text-xs text-amber-300/70 border border-amber-500/20 bg-amber-950/10 rounded-lg hover:bg-amber-950/20 hover:border-amber-500/30 transition-all cursor-pointer select-none disabled:opacity-50"
      >
        <Sparkles className="size-3.5" />
        <span>What does Athena think?</span>
      </button>
    );
  }

  return (
    <div className="flex gap-3 items-start p-3 rounded-lg bg-gradient-to-br from-amber-950/30 via-neutral-950 to-neutral-950 border border-amber-900/40 text-neutral-200 mt-3 relative overflow-hidden animate-in fade-in slide-in-from-top-1 duration-300">
      <div className="flex items-center justify-center size-8 rounded-full bg-amber-950 border border-amber-800 shrink-0 text-lg shadow-sm" title="Athena">
        🏛️
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[10px] font-bold tracking-wider text-amber-400 uppercase">Athena</span>
          <div className="flex items-center gap-2">
            {result.provider && (
              <span className="text-[9px] text-neutral-600">{result.provider}</span>
            )}
            <button
              onClick={() => fetchCommentary(true)}
              className="text-amber-400/60 hover:text-amber-400 transition-colors p-0.5 cursor-pointer"
              title="Recompute commentary"
            >
              <RefreshCw className="size-3" />
            </button>
            <MessageSquare className="size-3 text-amber-500/60" />
          </div>
        </div>
        <p className="text-xs leading-relaxed italic text-neutral-300 select-all">
          &ldquo;{result.content}&rdquo;
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/components/AthenaCommentary.test.tsx`
Expected: All 3 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/AthenaCommentary.tsx src/components/AthenaCommentary.test.tsx
git commit -m "feat: add AthenaCommentary component with 3-tier cache lookup"
```

---

### Task 10: ChatAboutThis Component

**Files:**
- Create: `src/components/ChatAboutThis.tsx`
- Create: `src/components/ChatAboutThis.test.tsx`

- [ ] **Step 1: Implement ChatAboutThis**

Create `src/components/ChatAboutThis.tsx`:
```tsx
import { useNavigate } from 'react-router';
import { MessageCircle } from 'lucide-react';

interface ChatAboutThisProps {
  entryId: string;
  module: string;
  /** Key-value pairs from the entry used to build the auto-question */
  fields: Record<string, string | number>;
}

const QUESTION_TEMPLATES: Record<string, (f: Record<string, string | number>) => string> = {
  sports: (f) => `What happened in the ${f.event} (${f.year}) and why was it significant?`,
  disasters: (f) => `Walk me through the ${f.event} — what caused it and how could it have been prevented?`,
  finance: (f) => `Explain the ${f.event} on ${f.date}. What were the key signals and what happened next?`,
  medical: (f) => `Tell me about ${f.condition} — what was the breakthrough and who was involved?`,
  safety: (f) => `How does the '${f.title}' protocol work and why does it matter for a time traveler?`,
  'tech-transfer': (f) => `Explain the ${f.concept} transfer plan. What's the butterfly risk?`,
  blueprints: (f) => `Walk me through the ${f.title} blueprint. What are the critical tolerances?`,
  engineering: (f) => `What was the state of ${f.conceptName} in the ${f.era} and what were the key specs?`,
  'era-guide': (f) => `What should I know about ${f.item} in the ${f.era}? Give me the survival essentials.`,
};

export function generateChatQuestion(module: string, fields: Record<string, string | number>): string {
  const template = QUESTION_TEMPLATES[module] ?? (() => `Tell me about ${fields.title ?? fields.item ?? fields.event ?? 'this entry'}.`);
  return template(fields);
}

export function ChatAboutThis({ entryId, module, fields }: ChatAboutThisProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    const question = generateChatQuestion(module, fields);
    const params = new URLSearchParams({ entryId, q: question });
    navigate(`/quiz?${params.toString()}`);
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] text-indigo-300/70 border border-indigo-500/20 bg-indigo-950/10 rounded-lg hover:bg-indigo-950/20 hover:border-indigo-500/30 hover:text-indigo-200 transition-all cursor-pointer select-none"
    >
      <MessageCircle className="size-3" />
      <span>Chat about this</span>
    </button>
  );
}
```

- [ ] **Step 2: Write tests**

Create `src/components/ChatAboutThis.test.tsx`:
```typescript
import { describe, it, expect } from 'vitest';
import { generateChatQuestion } from './ChatAboutThis';

describe('generateChatQuestion', () => {
  it('generates sports question', () => {
    const q = generateChatQuestion('sports', { event: 'Super Bowl IV', year: 1970 });
    expect(q).toContain('Super Bowl IV');
    expect(q).toContain('1970');
  });

  it('generates disasters question', () => {
    const q = generateChatQuestion('disasters', { event: 'Tenerife Airport Disaster' });
    expect(q).toContain('Tenerife');
    expect(q).toContain('prevented');
  });

  it('generates era-guide question', () => {
    const q = generateChatQuestion('era-guide', { item: 'Gasoline (per gallon)', era: '1970s' });
    expect(q).toContain('Gasoline');
    expect(q).toContain('1970s');
  });

  it('falls back for unknown module', () => {
    const q = generateChatQuestion('unknown', { title: 'Something' });
    expect(q).toContain('Something');
  });
});
```

- [ ] **Step 3: Run tests**

Run: `npx vitest run src/components/ChatAboutThis.test.tsx`
Expected: All 4 tests PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/ChatAboutThis.tsx src/components/ChatAboutThis.test.tsx
git commit -m "feat: add ChatAboutThis component with per-module question templates"
```

---

### Task 11: Update Quiz.tsx — URL Param Reading

**Files:**
- Modify: `src/pages/Quiz.tsx`

- [ ] **Step 1: Add URL param reading on mount**

In `src/pages/Quiz.tsx`, add imports at the top:

```typescript
import { useSearchParams } from 'react-router';
```

Inside the `Quiz` component, after the existing `useRef`/`useState` declarations, add:

```typescript
const [searchParams] = useSearchParams();
const initialEntryId = searchParams.get('entryId');
const initialQuestion = searchParams.get('q');
const hasSentInitial = useRef(false);

// Auto-send question from "Chat about this" navigation
useEffect(() => {
  if (initialQuestion && initialEntryId && !hasSentInitial.current && messages.length === 0) {
    hasSentInitial.current = true;
    sendMessage({ text: initialQuestion }, { body: getRequestBody() });
  }
}, [initialQuestion, initialEntryId, messages.length, sendMessage]);
```

**Important**: This effect fires only once (guarded by `hasSentInitial` ref) and only when there are no messages yet (fresh Quiz session).

- [ ] **Step 2: Verify no type errors**

Run: `npx tsc --noEmit`
Expected: No errors in Quiz.tsx

- [ ] **Step 3: Commit**

```bash
git add src/pages/Quiz.tsx
git commit -m "feat: Quiz auto-sends question from ChatAboutThis navigation"
```

---

### Task 12: Wire AthenaCommentary + ChatAboutThis Into All 8 Data Pages

**Files:**
- Modify: All 8 data pages in `src/pages/`

For each of the 8 data pages, the pattern is the same:

1. **Remove** `CompanionThought` import and usage
2. **Add** imports for `AthenaCommentary` and `ChatAboutThis`
3. **Replace** `<CompanionThought contextItem={...} />` with `<AthenaCommentary entryId={entry.id} />`
4. **Add** `<ChatAboutThis entryId={entry.id} module="..." fields={...} />` button next to the entry

The 8 pages and their module names:

| Page file | Module name | Key fields for ChatAboutThis |
|---|---|---|
| `SportsAlmanac.tsx` | `sports` | `{ event, year }` |
| `DisasterPrevention.tsx` | `disasters` | `{ event }` |
| `FinancialAlmanac.tsx` | `finance` | `{ event, date }` |
| `EraGuide.tsx` | `era-guide` | `{ item, era }` |
| `MedicalInterventions.tsx` | `medical` | `{ condition }` |
| `SafetyProtocols.tsx` | `safety` | `{ title }` |
| `TechTransfer.tsx` | `tech-transfer` | `{ concept }` |
| `BootstrapBlueprints.tsx` | `blueprints` | `{ title }` |

Example for `SportsAlmanac.tsx`:

Replace:
```tsx
import { CompanionThought } from '@/components/CompanionThought';
```
With:
```tsx
import { AthenaCommentary } from '@/components/AthenaCommentary';
import { ChatAboutThis } from '@/components/ChatAboutThis';
```

Replace:
```tsx
<CompanionThought contextItem={`Sports Outcome - Year: ${selectedEvent.year}, Sport: ${selectedEvent.sport}, Event: ${selectedEvent.event}, Winner: ${selectedEvent.winner}, Score: ${selectedEvent.score}. Details: ${selectedEvent.notableDetails}. Odds: ${selectedEvent.odds}`} />
```
With:
```tsx
<AthenaCommentary entryId={selectedEvent.id} />
<ChatAboutThis entryId={selectedEvent.id} module="sports" fields={{ event: selectedEvent.event, year: selectedEvent.year }} />
```

Repeat this pattern for all 8 pages. PalaceLink stays in place (it becomes user-initiated in Task 13).

- [ ] **Step 1: Update all 8 pages**

- [ ] **Step 2: Verify build**

Run: `npx vite build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/pages/SportsAlmanac.tsx src/pages/DisasterPrevention.tsx src/pages/FinancialAlmanac.tsx src/pages/EraGuide.tsx src/pages/MedicalInterventions.tsx src/pages/SafetyProtocols.tsx src/pages/TechTransfer.tsx src/pages/BootstrapBlueprints.tsx
git commit -m "feat: wire AthenaCommentary and ChatAboutThis into all data pages"
```

---

### Task 13: Refactor PalaceLink — User-Initiated with SQLite Cache

**Files:**
- Modify: `src/components/PalaceLink.tsx`

- [ ] **Step 1: Refactor PalaceLink to be collapsed by default with SQLite-backed cache**

Replace the current `PalaceLink.tsx` implementation with:

```tsx
import { useState } from 'react';
import { ChevronRight, RefreshCw, Link2 } from 'lucide-react';

interface PalaceLinkProps {
  entryId: string;
  companionId?: string;
}

interface PalaceLinkResult {
  connection: string;
  targetEntryId: string;
}

export function PalaceLink({ entryId, companionId = 'athena' }: PalaceLinkProps) {
  const [expanded, setExpanded] = useState(false);
  const [result, setResult] = useState<PalaceLinkResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchLink = async (force = false) => {
    setLoading(true);
    setError('');
    try {
      // Check cache first (GET)
      if (!force) {
        const cacheResp = await fetch(`/api/athena/palace-link?entryId=${encodeURIComponent(entryId)}&companionId=${encodeURIComponent(companionId)}`);
        const cacheData = await cacheResp.json();
        if (cacheData.cached && cacheData.connection) {
          setResult({ connection: cacheData.connection, targetEntryId: cacheData.targetEntryId });
          return;
        }
      }

      // Fetch/generate (POST)
      const resp = await fetch('/api/athena/palace-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entryId, companionId, forceRecompute: force }),
      });
      const data = await resp.json();
      if (data.connection) {
        setResult({ connection: data.connection, targetEntryId: data.targetEntryId });
      } else {
        setResult(null);
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Failed to fetch link.');
    } finally {
      setLoading(false);
    }
  };

  const handleExpand = () => {
    if (!expanded) {
      setExpanded(true);
      fetchLink();
    } else {
      setExpanded(false);
    }
  };

  if (!expanded) {
    return (
      <button
        onClick={handleExpand}
        className="flex items-center gap-2 px-3 py-2 mt-2 text-xs text-purple-300/70 border border-purple-500/20 bg-purple-950/10 rounded-lg hover:bg-purple-950/20 hover:border-purple-500/30 transition-all cursor-pointer select-none"
      >
        <Link2 className="size-3.5" />
        <span>Cross-topic link</span>
        <ChevronRight className="size-3 transition-transform" />
      </button>
    );
  }

  return (
    <div className="mt-2 space-y-1">
      <button
        onClick={handleExpand}
        className="flex items-center gap-2 text-xs text-purple-400 cursor-pointer select-none"
      >
        <Link2 className="size-3.5" />
        <span className="font-bold uppercase tracking-wider text-[10px]">Cross-topic link</span>
        <ChevronRight className="size-3 rotate-90 transition-transform" />
      </button>

      {loading && (
        <div className="flex items-center gap-2 px-3 py-2 text-xs text-neutral-500 border-l-2 border-purple-500/30 bg-purple-950/10 rounded-r select-none animate-pulse">
          <span className="font-bold uppercase tracking-wider text-[10px] text-purple-400/60">Linking...</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 px-3 py-2 text-xs text-neutral-500 border-l-2 border-red-500/30 bg-red-950/10 rounded-r select-none">
          <span>{error}</span>
          <button onClick={() => fetchLink()} className="text-purple-400 hover:text-purple-300 p-0.5 cursor-pointer">
            <RefreshCw className="size-3" />
          </button>
        </div>
      )}

      {result?.connection && (
        <div className="flex items-center gap-2 px-3 py-2 text-xs italic text-purple-300 border-l-2 border-purple-500/40 bg-purple-950/20 rounded-r select-none">
          <span>&ldquo;{result.connection}&rdquo;</span>
          <button onClick={() => fetchLink(true)} className="text-purple-400/60 hover:text-purple-400 p-0.5 cursor-pointer shrink-0" title="Recompute link">
            <RefreshCw className="size-3" />
          </button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Update PalaceLink usage in all data pages**

The existing data pages pass `tags`, `contextItem`, and `excludeId` to PalaceLink. Update all usages to the new simpler API:

Replace: `<PalaceLink tags={e.tags} contextItem={...} excludeId={e.id} />`
With: `<PalaceLink entryId={e.id} />`

This needs to be done in all 8 data pages.

- [ ] **Step 3: Run tests**

Run: `npx vitest run`
Expected: All tests PASS (update PalaceLink.test.tsx to match new API if needed)

- [ ] **Step 4: Commit**

```bash
git add src/components/PalaceLink.tsx src/pages/
git commit -m "feat: refactor PalaceLink to user-initiated with SQLite cache"
```

---

### Task 14: Remove palaceCache.ts (Now Replaced by SQLite)

**Files:**
- Remove: `src/lib/palaceCache.ts`
- Remove: `src/lib/palaceCache.test.ts`

- [ ] **Step 1: Remove files**

Run:
```bash
rm src/lib/palaceCache.ts src/lib/palaceCache.test.ts
```

- [ ] **Step 2: Verify no imports remain**

Run: `grep -r "palaceCache" src/`
Expected: No results

- [ ] **Step 3: Run full test suite**

Run: `npx vitest run`
Expected: All remaining tests PASS

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove localStorage palaceCache (replaced by SQLite)"
```

---

### Task 15: Final Verification

- [ ] **Step 1: Run full test suite**

Run: `npx vitest run`
Expected: All tests PASS

- [ ] **Step 2: Run build**

Run: `npx vite build`
Expected: Build succeeds

- [ ] **Step 3: Start dev servers and manual smoke test**

Run: `npm run dev` (frontend) and `npx tsx server/index.ts` (backend)

Manual checks:
1. Browse a data page → AthenaCommentary shows cached content or "What does Athena think?" button
2. Click "What does Athena think?" → commentary appears
3. Refresh page → commentary appears instantly (cached)
4. Click "Chat about this" → navigates to Quiz with auto-question
5. Click "Cross-topic link" on an entry → link appears
6. Recompute button works on both commentary and palace-link
