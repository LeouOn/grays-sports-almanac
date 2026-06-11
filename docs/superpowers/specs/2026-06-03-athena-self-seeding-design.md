# Athena Memory Palace v2 — Self-Seeding Commentary Design

**Date**: 2026-06-03
**Status**: Draft

## Problem

The current Athena system makes **2 LLM API calls per data page visit** (CompanionThought + PalaceLink), costing money passively every time a user browses. With 8 data pages, a browsing session can rack up 10-20 calls without the user doing anything meaningful.

## Solution

Replace passive LLM calls with a **self-seeding commentary cache** backed by SQLite:

1. **Precomputed content** displays instantly (free)
2. **User-initiated fetch** for uncached entries (one click, one call)
3. **Results persist to SQLite** — survive restarts, shared across users
4. **"Chat about this" link** takes entry context to Quiz for deep conversation

**Result**: Zero passive API cost. Users control when they spend API budget.

---

## Architecture

### SQLite Database (`data/athena.db`)

Server-side, created on first boot. Uses `better-sqlite3` (synchronous, embedded, zero-config).

#### Table: `entries` — Registry of all data module entries

Populated at server startup by scanning all 9 data modules.

```sql
CREATE TABLE entries (
  entry_id    TEXT PRIMARY KEY,          -- e.g. 'tenerife', 'sb-iv', 'tcp-ip'
  module      TEXT NOT NULL,             -- 'sports'|'disasters'|'finance'|'era-guide'|'medical'|'safety'|'tech-transfer'|'blueprints'|'engineering'
  title       TEXT NOT NULL,             -- display name
  era         TEXT,                      -- '1950s'|'1960s'|'1970s'|'1980s'|'1990s'|'2000s'|NULL
  year        INTEGER,                  -- relevant year or NULL
  category    TEXT,                      -- e.g. 'Aviation', 'Football', 'Currency'
  subcategory TEXT,                      -- e.g. 'cnc_machining', 'semiconductors'
  tags        TEXT NOT NULL DEFAULT '[]', -- JSON array: '["aviation","fog","atc"]'
  data_hash   TEXT NOT NULL,             -- SHA-256 of key fields (detects source data changes)
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_entries_module ON entries(module);
```

**`data_hash`**: Computed from the entry's key fields at startup. When source data changes, the hash changes and stale cached commentary is flagged for recompute.

#### Table: `commentary` — LLM-generated content per entry

The main cache. Each row is one piece of generated content tied to an entry.

```sql
CREATE TABLE commentary (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  entry_id        TEXT NOT NULL,              -- FK to entries
  content_type    TEXT NOT NULL,              -- 'commentary' | 'mnemonic' | 'palace_link' | 'quiz_reaction'
  companion_id    TEXT NOT NULL DEFAULT 'athena', -- 'athena' | 'doc' | 'biff' | 'custom'
  content         TEXT NOT NULL,              -- the generated text
  context_hash    TEXT NOT NULL,              -- SHA-256 of input prompt (detects stale content)
  source          TEXT NOT NULL DEFAULT 'precomputed', -- 'precomputed' | 'lazy' | 'recomputed'
  provider        TEXT,                       -- which LLM: 'deepseek' | 'zhipu' | 'minimax' | 'google'
  model           TEXT,                       -- exact model: 'deepseek-v4-pro' | 'glm-4.5'
  target_entry_id TEXT,                       -- for palace_links: connected entry
  tier            INTEGER NOT NULL DEFAULT 0, -- for quiz_reactions: 1|2|3; 0 for all other types
  performance     TEXT NOT NULL DEFAULT '',    -- for quiz_reactions: 'low'|'mid'|'high'; '' for other types
  topic           TEXT NOT NULL DEFAULT '',    -- for quiz_reactions: 'sports'|'history'|etc.; '' for other types
  access_count    INTEGER NOT NULL DEFAULT 0, -- display frequency
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now')),

  FOREIGN KEY (entry_id) REFERENCES entries(entry_id),
  UNIQUE(entry_id, content_type, companion_id, tier, performance, topic)
);

CREATE INDEX idx_commentary_lookup ON commentary(entry_id, content_type, companion_id);
CREATE INDEX idx_commentary_source ON commentary(source);
CREATE INDEX idx_commentary_access ON commentary(access_count DESC);
```

**`context_hash`**: SHA-256 of the prompt sent to the LLM (entry title + description + tags + companion persona). If any of these change, the hash changes and the content is flagged for recompute.

**UNIQUE constraint** prevents duplicates per combination. All columns default to `0`/`''` for non-quiz types so NULLs don't bypass uniqueness.

#### Table: `chat_context` — Entry-to-Quiz seed data (optional, for analytics)

Stores auto-generated questions when users click "Chat about this". The actual question/context flows through URL params and the request body — this table is for analytics (which entries spark conversations) and is optional in the MVP.

```sql
CREATE TABLE chat_context (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  entry_id    TEXT NOT NULL,
  question    TEXT NOT NULL,              -- auto-generated question text
  context     TEXT NOT NULL,              -- full entry summary
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),

  FOREIGN KEY (entry_id) REFERENCES entries(entry_id)
);

CREATE INDEX idx_chat_context_entry ON chat_context(entry_id);
```

---

### New Component: `AthenaCommentary` (Replaces `CompanionThought`)

3-tier lookup, zero passive API cost:

```
┌─────────────────┐    hit    ┌──────────────┐
│ SQLite cache     │ ───────► │ Display it    │
│ (server-side)    │           └──────────────┘
└────────┬────────┘
         │ miss
         ▼
┌─────────────────┐    hit    ┌──────────────┐
│ Precomputed JSON │ ───────► │ Seed to SQLite│──► Display
│ (athena-static)  │           └──────────────┘
└────────┬────────┘
         │ miss
         ▼
┌─────────────────┐    click   ┌──────────────┐
│ "What does       │ ────────► │ POST /api/    │──► Cache to SQLite──► Display
│  Athena think?"  │           │ athena/       │
│  button          │           │ commentary    │
└─────────────────┘           └──────────────┘
```

**On mount**: `GET /api/athena/commentary?entryId=X` → returns cached content or `null`.
**If cached**: Display instantly. No LLM call.
**If null**: Show "What does Athena think?" button.
**On click**: `POST /api/athena/commentary` with `{ entryId }` → calls LLM, writes to SQLite, returns.
**Recompute button**: `POST` with `{ entryId, forceRecompute: true }` → regenerates and updates row.

### PalaceLink Becomes User-Initiated

- **Collapsed by default** — small "Cross-topic link" disclosure arrow
- **On expand**: `GET /api/athena/palace-link?entryId=X` (checks SQLite first)
- Result cached in SQLite with `content_type='palace_link'` and `target_entry_id` set
- No passive API calls

---

### New API Endpoints

#### `GET /api/athena/commentary?entryId=X&companionId=athena`

Returns cached commentary or `{ cached: false }`. No LLM call. Checks SQLite by `entry_id + content_type + companion_id`.

#### `POST /api/athena/commentary`

```json
{
  "entryId": "tenerife",
  "companionId": "athena",
  "forceRecompute": false
}
```

- Checks SQLite cache. If fresh and not forced → return cached.
- If miss or forced → calls `callProviderChain`, writes to SQLite, returns result.
- Response: `{ content: "...", provider: "zhipu", source: "lazy" }`

#### `GET /api/athena/palace-link?entryId=X`

Returns cached palace link or `{ cached: false }`. Checks SQLite by `entry_id + content_type='palace_link'`.

#### `POST /api/athena/palace-link`

```json
{
  "entryId": "tenerife",
  "companionId": "athena",
  "forceRecompute": false
}
```

Same pattern as commentary. Uses `findBestTagMatch` to find connected entry, then LLM to generate the link text.

---

### "Chat About This" → Quiz Navigation

New button on each entry card across all 8 data pages.

**Click flow:**
1. Generate contextual auto-question based on entry type
2. Navigate to `/quiz?entryId={id}&q={encoded question}`
3. Quiz.tsx reads params on mount → if present, auto-sends the question with entry context injected into the request body

**Auto-question templates per module:**

| Module | Template |
|---|---|
| Sports | `"What happened in the {event} ({year}) and why was it significant?"` |
| Disasters | `"Walk me through the {event} — what caused it and how could it have been prevented?"` |
| Finance | `"Explain the {event} on {date}. What were the key signals and what happened next?"` |
| Medical | `"Tell me about {condition} — what was the breakthrough and who was involved?"` |
| Safety | `"How does the '{title}' protocol work and why does it matter for a time traveler?"` |
| Tech Transfer | `"Explain the {concept} transfer plan. What's the butterfly risk?"` |
| Blueprints | `"Walk me through the {title} blueprint. What are the critical tolerances?"` |
| Engineering | `"What was the state of {conceptName} in the {era} and what were the key specs?"` |
| Era Guide | `"What should I know about {item} in the {era}? Give me the survival essentials."` |

**Quiz.tsx changes:**
- On mount, read `URLSearchParams` for `entryId` and `q`
- If present, call `sendMessage({ text: q }, { body: { ...getRequestBody(), initialContext: entrySummary } })`
- `initialContext` gets prepended to the system prompt so the AI knows what the user was just looking at

---

### Data Module Fixes

#### EraGuide — Add synthetic `id` field

Currently has no `id`. Generate at export time:

```
era-guide-{era}-{category}-{slug}
```

Examples: `era-guide-1970s-prices-gasoline`, `era-guide-1980s-slang-radical`

Slug derived from `item` field: lowercase, strip special chars, replace spaces with hyphens. If two items produce the same slug (e.g., "Gasoline (per gallon)" in both 1970s and 1980s), the era differentiates them via `era-guide-1970s-prices-gasoline` vs `era-guide-1980s-prices-gasoline`. If still colliding, append a numeric suffix.

#### Engineering — Add `tags` field

Currently has no `tags`. Auto-derived from `subDomain` + `conceptName`:

```typescript
tags: deriveEngineeringTags(entry.subDomain, entry.conceptName)
// e.g. ['cnc', 'machining', 'mit', 'servomechanisms', 'numerical-control']
```

Both changes make these modules fully tag-matchable for PalaceLink and RelatedEntries. The `tagMatch.ts` file currently excludes `era-guide` — after this fix, it can include it.

---

### Precompute Script Expansion

`scripts/precompute-athena.ts` gets expanded:

1. Reads all 9 data modules → generates `entries` rows with `data_hash`
2. Generates commentary for entries tagged as high-priority. Priority is determined by: entries with `butterflyRisk='Extreme'|'High'`, entries referenced by multiple other entries via tags, and entries from the `disasters` and `tech-transfer` modules (core gameplay). Approximately 40-60 entries qualify.
3. Outputs `athena-static.json` (mnemonics + quizReactions, same format as now)
4. Seeds `data/athena.db` with precomputed commentary rows (`source='precomputed'`)
5. Script is optional — the system works without it (everything lazy-loads). Precompute just front-loads valuable content.

---

### Startup Sequence

1. Server boots → `better-sqlite3` opens/creates `data/athena.db`
2. Run migrations (create tables if not exist)
3. Scan all 9 data modules → upsert `entries` rows with `data_hash`
4. For each entry where `data_hash` changed → flag associated `commentary` rows as stale
5. Load `athena-static.json` mnemonics/quizReactions into `commentary` if not already present
6. Server ready — all endpoints operational

---

### What Gets Removed / Changed

| Component | Change |
|---|---|
| `CompanionThought.tsx` | Replaced by `AthenaCommentary.tsx` |
| `PalaceLink.tsx` | Becomes user-initiated (collapsed by default) |
| `PalaceHook.tsx` | Unchanged (already static JSON) |
| `AthenaQuizReaction.tsx` | Unchanged (already static JSON) |
| `palaceCache.ts` | Removed (localStorage replaced by SQLite) |
| `palaceLinkHandler.ts` | Refactored to use SQLite instead of in-memory Map |
| `athena-static.json` | Kept for mnemonics/quizReactions, commentary moves to SQLite |
| All 8 data pages | Wire `AthenaCommentary` + "Chat about this" button |
| `Quiz.tsx` | Add URL param reading for `entryId` + `q` |
| `era-guide.ts` | Add `id` field generation |
| `engineering.ts` | Add `tags` field generation |
| `tagMatch.ts` | Include era-guide and engineering in matching |

---

### Dependencies

- `better-sqlite3` — SQLite binding for Node.js (synchronous, embedded)
- No new frontend dependencies
