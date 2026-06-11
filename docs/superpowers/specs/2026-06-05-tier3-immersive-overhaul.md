# Tier 3 Immersive Overhaul — Design Spec

## Problem

Tier 3 "Immersive Roleplay" is currently a flat chat with a generic AI examiner. It lacks:
- Scene-setting and atmospheric narration
- Distinct NPC personalities with depth
- Persistent state across sessions (the AI forgets everything)
- Tool-calling integration (no competency tracking, no note-taking)
- Cross-app integration (can't reference data pages, can't build on prior sessions)

## Scope (This Iteration)

**MVP**: Dungeon Master prompt + `takeNote` tool + session notes continuity.

Later iterations will add: inventory system, competency read/write, deep linking, knowledge base queries, visual polish, multi-dimensional suspicion.

## Architecture

### 1. Dungeon Master System Prompt (Server)

Replace the current Tier 3 prompt in `server/index.ts` with a structured "Time Travel Dungeon Master" prompt that:
- Opens each scene with **narration blocks** (sensory details, atmosphere, era-specific cultural texture)
- Runs **distinct NPCs** with names, personalities, accents, hidden agendas
- Weaves **historical facts from the knowledge base** into the fiction — player learns by needing knowledge to survive
- Uses `[Suspicion: X%]` meter (kept for backward compat with frontend)
- Generates **chapter/scene transitions** — after 4-6 exchanges, a scene change with new location/time/NPC
- Companion chime-ins become **inner whispers** ("Athena whispers...") rendered differently in UI

### 2. `takeNote` Tool (Server)

Add a tool callable by the LLM during Tier 3:

```
takeNote({ note: string, category: "observation" | "character" | "location" | "fact" | "warning" })
```

**Storage**: New `session_notes` table in `data/athena.db`:
```sql
CREATE TABLE session_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  note TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'observation',
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX idx_session_notes_session ON session_notes(session_id);
```

**Flow**:
1. Frontend generates a `sessionId` (UUID) when Tier 3 starts, sends it with each message
2. When LLM calls `takeNote`, server inserts into `session_notes`
3. On each new message, server fetches all notes for this `sessionId` and injects them into the system prompt as "## YOUR SESSION NOTES"
4. Notes persist across the session — LLM can reference earlier observations

### 3. Frontend Changes

**Minimal**:
- Generate and persist a `sessionId` in Quiz.tsx state for Tier 3
- Include `sessionId` in `getRequestBody()`
- Parse message content for visual differentiation:
  - Lines starting with `**` or wrapped in `*...*` → narration (italic, dimmed)
  - Lines in `"..."` or character dialogue → bold
  - `[Companion: ...]` → already handled, styled as "whisper" for Tier 3

### 4. DB Schema Addition

Add to `server/db.ts`:
- `initSessionNotesTable(db)` — creates `session_notes` table
- `insertSessionNote(db, sessionId, note, category)` — inserts a note
- `getSessionNotes(db, sessionId)` — returns all notes for a session

### 5. Server Route Changes

In `server/index.ts` `/api/chat` route:
- Accept `sessionId` from request body
- If Tier 3 and `sessionId` exists:
  - Fetch session notes from DB
  - Inject into system prompt as `## SESSION NOTES (what you've observed so far)`
  - Add `takeNote` tool to the tool set alongside `evaluateAnswer`
  - Wire `takeNote` execute handler to persist notes

## Files Changed

| File | Change |
|------|--------|
| `server/index.ts` | New Tier 3 prompt, `takeNote` tool, session notes injection |
| `server/db.ts` | `session_notes` table + CRUD functions |
| `src/pages/Quiz.tsx` | `sessionId` state, pass in body, minor visual differentiation |

## Future (NOT this iteration)

- `readCompetency` / `writeCompetency` tools
- `queryKnowledge` tool (search knowledge base from within roleplay)
- `linkToEntry` tool (deep link to app pages)
- `updateInventory` tool (items the player carries)
- Multi-dimensional suspicion (Anachronism, Cultural Fit, Knowledge)
- Scene transition animations
- Era-specific color theming
- Session summary export
- Cross-session journal (notes persist across different Tier 3 sessions)
