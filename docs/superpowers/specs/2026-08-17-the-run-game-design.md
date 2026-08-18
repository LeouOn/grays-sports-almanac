# The Run — Game Design Spec

**Date:** 2026-08-17
**Status:** Approved direction, pending implementation plan
**Scope:** New game mode ("The Run") for grays-sports-almanac, plus Wave 0 provider-config fixes and local Kiwix Wikipedia integration.

---

## 1. Concept

A time-travel run simulator that fuses the app's three existing proto-game systems (Quiz, Companions, Progress) into one game:

- You pick an era (1950s–2000s) and a companion, then "jump".
- A run is a chain of **8–12 beats**. Each beat the LLM narrates a scenario grounded in (a) the app's curated almanac entries for that era — what you "packed" — and (b) live Kiwix Wikipedia lookups via LLM tool calls.
- You choose among 2–4 options per beat. Choices move three meters:
  - **Capital** — wealth accumulated (bets, investments, patents).
  - **Reputation** — cover-identity strength; low reputation triggers suspicion events.
  - **Temporal Risk** — butterfly/paradox meter; reaching 100% ends the run in **temporal exile**.
- Every third beat is a **Knowledge Check**: a quiz question the LLM composes from actual Wikipedia article text fetched via tools during the run. Correct answers grant leverage (capital/odds boost, risk reduction).
- Companions post short in-character reactions at each beat, reusing the existing companion provider chain.
- From beat 6 onward you may **Retire** to bank your score; pushing further raises stakes.
- Final score and unlocks persist to SQLite and surface on the existing Progress page.

## 2. Wave 0 — Provider Fixes (prerequisite)

Verified by live probes on 2026-08-17:

| Fix | File | Change |
|---|---|---|
| MiniMax endpoint | `server/providers.ts` | baseURL `https://api.minimax.chat/v1` → `https://api.minimax.io/v1`; default model → `MiniMax-M2` (probe passed) |
| OpenRouter default model | `server/providers.ts` | `anthropic/claude-sonnet-latest` → `google/gemini-2.5-flash` (probe passed; old ID no longer exists) |
| Zhipu key alias | `server/providers.ts` | Accept `ZHIPU_API_KEY` as fallback when `ZAI_API_KEY` unset (system env uses the former) |
| Quiz page defaults | `src/pages/Quiz.tsx` | Update `PROVIDERS` default models to match (minimax → `MiniMax-M2`, openrouter → `google/gemini-2.5-flash`) |

Zhipu currently has no account balance, so it stays in the chain but will skip/fail gracefully as today.

## 3. Architecture

New backend modules (following existing `server/*-routes.ts` patterns):

| Module | Responsibility |
|---|---|
| `server/wiki-tools.ts` | Kiwix HTTP client; proxies `/search?format=xml` and `/raw/{zim}/content/A/{path}`; HTML→text sanitization; exports AI SDK `tool()` definitions `wikiSearch`/`wikiRead` with zod schemas. |
| `server/run-engine.ts` | Pure deterministic state machine: beat sequencing, meter deltas, knowledge-check cadence, retire/exile rules, scoring. **No LLM calls.** Validates all LLM output with zod before applying effects. |
| `server/run-llm.ts` | LLM orchestration: `generateText` with tools, `stopWhen: stepCountIs(4)`, structured beat generation, companion reactions via existing provider chain. |
| `server/run-routes.ts` | `POST /api/run/start`, `POST /api/run/:id/choice`, `POST /api/run/:id/knowledge-check`, `GET /api/run/:id`. |

New frontend (following existing `src/pages/*` patterns):

- `src/pages/Run.tsx` — page shell + routing (add `/run` route, nav entry).
- Components: `RunSetup`, `BeatView`, `RunHUD` (Capital/Reputation/Risk meters), `KnowledgeCheckModal`, `RunSummary`.

Persistence (better-sqlite3, existing `server/db.ts`):

- `runs` — id, local session id (same anonymous-session pattern used by quiz/progress), era, companion id, started/ended timestamps, outcome (`active|retired|exiled`), final score.
- `run_beats` — run id, beat index, beat type, narrative, choices JSON, chosen index, meter snapshot, knowledge-check Q/A.

### Engine/LLM split (deliberate)

The engine owns all rules; the LLM only narrates and proposes choices within engine-computed constraints (available beat type, allowed delta ranges). Engine zod-validates every LLM payload. The LLM proposes; the engine disposes. This keeps the game deterministic and testable, and prevents narrative drift from corrupting game state.

## 4. Kiwix Wikipedia Stack

Confirmed by research (2026-08-17):

- **ZIM:** `wikipedia_en_top_nopic` (~1.1 GB) or `wikipedia_en_top_maxi` (~5 GB) — curated top-50k English articles, full-text search index included. Download from `https://download.kiwix.org/zim/wikipedia/`.
- **Serving:** `kiwix-serve` 3.8.2 (official Windows binary) on port 8080.
- **Endpoints used (public):** `/search?pattern=...&books.name=...&format=xml&pageLength=N` and `/raw/{ZIMNAME}/content/A/{path}`.
- **LLM wiring:** custom `tool()` + zod (no MCP server). `stopWhen: stepCountIs(4)` bounds the agent loop.
- **Sanitization:** strip article HTML to text before LLM context (raw HTML balloons tokens 3–5×).
- **Setup:** `pnpm kiwix:setup` script (downloads ZIM, documents kiwix-serve launch); manual step, not CI.
- **Gotchas:** always pass `format=xml`; article paths need the `A/` prefix; avoid native `@openzim/libzim` bindings on Windows (node-gyp pain, GPLv3).

## 5. Data Flow

1. Client posts choice → `run-routes` loads run state from SQLite.
2. Engine computes next beat **type** (scenario / knowledge-check / finale) and constraints.
3. `run-llm` generates narrative + choices grounded in curated era entries + Wikipedia tool calls.
4. zod validates beat JSON. On failure: one repair retry → fallback template beat from curated content.
5. Engine applies meter effects, checks retire/exile, persists.
6. Companion reaction fires (async, non-blocking, ~80 tokens).
7. Client renders beat + HUD.

## 6. Error Handling & Degradation

- **Provider chain:** existing cost-ordered fallback (MiniMax first — free-tier, then OpenRouter cheap models).
- **Kiwix unreachable:** server boots in **curated-only mode** — beats ground only in almanac entries; knowledge checks draw from existing quiz infrastructure. Game fully playable, less encyclopedic.
- **LLM JSON invalid:** one repair pass, then template beat.
- **Cost caps:** ~400 output tokens/beat, ~80 per companion quip. Full run ≈ a few cents.

## 7. Testing

- **Unit (vitest):** run-engine transitions/scoring (deterministic, no mocks); wiki-tools with mocked fetch; zod schemas; Wave 0 provider-fix regressions (`providers.test.ts` already covers key-missing paths — extend for alias + new defaults).
- **Route tests (supertest):** full run lifecycle with stubbed LLM layer, matching existing `*-routes.test.ts` pattern.
- **E2E (Playwright):** happy path — start run → choice → knowledge check → retire, LLM stubbed.

## 8. Out of Scope (YAGNI)

- Multiplayer / leaderboards beyond local persistence.
- MCP server integration (revisit if adding more ZIM sources later).
- Full 115 GB Wikipedia ZIM.
- Android-specific work beyond what the existing Capacitor shell gives for free.
- Monetization, accounts, cloud sync.
