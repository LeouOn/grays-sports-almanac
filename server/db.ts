import Database from 'better-sqlite3';
import type { RunState, Beat } from './run-engine.js';

export interface AthenaDb {
  _db: Database.Database;
}

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

CREATE TABLE IF NOT EXISTS session_notes (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id  TEXT NOT NULL,
  note        TEXT NOT NULL,
  category    TEXT NOT NULL DEFAULT 'observation',
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_session_notes_session ON session_notes(session_id);
`;

const FEATURE_MIGRATIONS = `
CREATE TABLE IF NOT EXISTS bookmarks (
  id          TEXT PRIMARY KEY,
  module      TEXT NOT NULL,
  entry_id    TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  note        TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_module ON bookmarks(module);
CREATE INDEX IF NOT EXISTS idx_bookmarks_entry ON bookmarks(entry_id);

CREATE TABLE IF NOT EXISTS spaced_repetition (
  id            TEXT PRIMARY KEY,
  topic         TEXT NOT NULL UNIQUE,
  competence    INTEGER NOT NULL DEFAULT 0,
  next_review   TEXT NOT NULL,
  interval_days INTEGER NOT NULL DEFAULT 1,
  review_count  INTEGER NOT NULL DEFAULT 0,
  last_reviewed TEXT
);

CREATE INDEX IF NOT EXISTS idx_srs_next_review ON spaced_repetition(next_review);

CREATE TABLE IF NOT EXISTS progress_tracking (
  id              TEXT PRIMARY KEY,
  module          TEXT NOT NULL UNIQUE,
  entries_viewed  INTEGER NOT NULL DEFAULT 0,
  total_entries   INTEGER NOT NULL DEFAULT 0,
  quiz_score      INTEGER NOT NULL DEFAULT 0,
  quiz_total      INTEGER NOT NULL DEFAULT 0,
  last_activity   TEXT
);

CREATE INDEX IF NOT EXISTS idx_progress_module ON progress_tracking(module);
`;

export function runFeatureMigrations(db: Database.Database): void {
  db.exec(FEATURE_MIGRATIONS);
}

export function initAthenaDb(path: string = 'data/athena.db'): AthenaDb {
  const db = new Database(path);
  db.pragma('journal_mode = WAL');
  db.exec(MIGRATIONS);
  return { _db: db };
}

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

  if (row) {
    db._db.prepare('UPDATE commentary SET access_count = access_count + 1 WHERE id = ?').run(row.id);
    row.access_count += 1;
  }

  return row;
}

export function insertChatContext(db: AthenaDb, entryId: string, question: string, context: string): void {
  db._db.prepare('INSERT INTO chat_context (entry_id, question, context) VALUES (?, ?, ?)').run(entryId, question, context);
}

export function seedStaticContent(db: AthenaDb, staticData: { mnemonics: Record<string, string>; quizReactions: Record<string, string> }): void {
  // Disable FK checks during seeding — mnemonic keys (e.g. 'wars-vietnam') are legacy
  // route IDs that don't correspond to entries in the data modules
  db._db.pragma('foreign_keys = OFF');

  upsertEntry(db, {
    entry_id: '__quiz__', module: 'system', title: 'Quiz Reactions',
    era: null, year: null, category: null, subcategory: null, tags: '[]', data_hash: 'static',
  });

  for (const [routeId, mnemonic] of Object.entries(staticData.mnemonics)) {
    upsertCommentary(db, {
      entry_id: routeId, content_type: 'mnemonic', companion_id: 'athena',
      content: mnemonic, context_hash: 'static', source: 'precomputed',
      provider: null, model: null, target_entry_id: null, tier: 0, performance: '', topic: '',
    });
  }

  for (const [key, reaction] of Object.entries(staticData.quizReactions)) {
    const [tierStr, perf, topic] = key.split(':');
    upsertCommentary(db, {
      entry_id: '__quiz__', content_type: 'quiz_reaction', companion_id: 'athena',
      content: reaction, context_hash: 'static', source: 'precomputed',
      provider: null, model: null, target_entry_id: null,
      tier: parseInt(tierStr, 10), performance: perf, topic: topic,
    });
  }

  db._db.pragma('foreign_keys = ON');
}

// --- Session Notes (Tier 3 persistence) ---

export interface SessionNoteRow {
  id: number;
  session_id: string;
  note: string;
  category: string;
  created_at: string;
}

const INSERT_SESSION_NOTE = `
INSERT INTO session_notes (session_id, note, category) VALUES (?, ?, ?)
`;

export function insertSessionNote(db: AthenaDb, sessionId: string, note: string, category: string): void {
  db._db.prepare(INSERT_SESSION_NOTE).run(sessionId, note, category);
}

const GET_SESSION_NOTES = `
SELECT * FROM session_notes WHERE session_id = ? ORDER BY created_at ASC
`;

export function getSessionNotes(db: AthenaDb, sessionId: string): SessionNoteRow[] {
  return db._db.prepare(GET_SESSION_NOTES).all(sessionId) as SessionNoteRow[];
}

// --- The Run (game) persistence ---

const RUN_MIGRATIONS = `
CREATE TABLE IF NOT EXISTS runs (
  run_id        TEXT PRIMARY KEY,
  era           TEXT NOT NULL,
  companion_id  TEXT NOT NULL,
  beat_index    INTEGER NOT NULL DEFAULT 0,
  total_beats   INTEGER NOT NULL DEFAULT 10,
  capital       INTEGER NOT NULL,
  reputation    INTEGER NOT NULL,
  temporal_risk INTEGER NOT NULL,
  outcome       TEXT NOT NULL DEFAULT 'active',
  checks_asked  INTEGER NOT NULL DEFAULT 0,
  checks_correct INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS run_beats (
  run_id     TEXT NOT NULL,
  beat_index INTEGER NOT NULL,
  type       TEXT NOT NULL,
  title      TEXT NOT NULL,
  narrative  TEXT NOT NULL,
  payload    TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (run_id, beat_index)
);
`;

export function runRunMigrations(db: Database.Database): void {
  db.exec(RUN_MIGRATIONS);
}

interface RunRow {
  run_id: string; era: string; companion_id: string;
  beat_index: number; total_beats: number;
  capital: number; reputation: number; temporal_risk: number;
  outcome: string; checks_asked: number; checks_correct: number;
}

function rowToState(r: RunRow): RunState {
  return {
    runId: r.run_id, era: r.era as RunState['era'], companionId: r.companion_id,
    beatIndex: r.beat_index, totalBeats: r.total_beats,
    meters: { capital: r.capital, reputation: r.reputation, temporalRisk: r.temporal_risk },
    outcome: r.outcome as RunState['outcome'],
    checksAsked: r.checks_asked, checksCorrect: r.checks_correct,
  };
}

export function insertRun(db: AthenaDb, state: RunState): void {
  db._db.prepare(`
    INSERT INTO runs (run_id, era, companion_id, beat_index, total_beats, capital, reputation, temporal_risk, outcome, checks_asked, checks_correct)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    state.runId, state.era, state.companionId, state.beatIndex, state.totalBeats,
    state.meters.capital, state.meters.reputation, state.meters.temporalRisk,
    state.outcome, state.checksAsked, state.checksCorrect,
  );
}

export function getRun(db: AthenaDb, runId: string): RunState | null {
  const row = db._db.prepare('SELECT * FROM runs WHERE run_id = ?').get(runId) as RunRow | undefined;
  return row ? rowToState(row) : null;
}

export function updateRun(db: AthenaDb, state: RunState): void {
  db._db.prepare(`
    UPDATE runs SET beat_index=?, capital=?, reputation=?, temporal_risk=?, outcome=?, checks_asked=?, checks_correct=?, updated_at=datetime('now')
    WHERE run_id=?
  `).run(
    state.beatIndex, state.meters.capital, state.meters.reputation, state.meters.temporalRisk,
    state.outcome, state.checksAsked, state.checksCorrect, state.runId,
  );
}

export function insertBeat(db: AthenaDb, runId: string, beat: Beat): void {
  db._db.prepare(`
    INSERT OR REPLACE INTO run_beats (run_id, beat_index, type, title, narrative, payload)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    runId, beat.index, beat.type, beat.title, beat.narrative,
    JSON.stringify({ choices: beat.choices, knowledgeCheck: beat.knowledgeCheck, companionQuip: beat.companionQuip }),
  );
}

export function getBeats(db: AthenaDb, runId: string): Beat[] {
  const rows = db._db.prepare('SELECT * FROM run_beats WHERE run_id = ? ORDER BY beat_index ASC').all(runId) as {
    beat_index: number; type: string; title: string; narrative: string; payload: string;
  }[];
  return rows.map(r => {
    const payload = JSON.parse(r.payload) as { choices?: Beat['choices']; knowledgeCheck?: Beat['knowledgeCheck']; companionQuip?: string };
    return {
      index: r.beat_index,
      type: r.type as Beat['type'],
      title: r.title,
      narrative: r.narrative,
      choices: payload.choices ?? [],
      knowledgeCheck: payload.knowledgeCheck,
      companionQuip: payload.companionQuip,
    };
  });
}
