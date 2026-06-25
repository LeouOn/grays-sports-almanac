# Full Roadmap: Back to the Future — Complete Enhancement Plan

## TL;DR

> **Quick Summary**: Systematically address all gaps in the Time Traveler's Guide educational platform — code quality, UX polish, new features, and test coverage — across 6 phased waves.
>
> **Deliverables**:
> - Git repository initialized with clean history
> - 6 code quality fixes (duplicate routes, Zod validation, `as any` removal, request logging)
> - 9 UX enhancements (404, error boundary, toasts, mobile nav, loading skeletons, theme toggle, keyboard shortcuts, print CSS, URL state)
> - 8 new features (data viz, bookmarking, spaced repetition, progress tracking, data export, PWA)
> - Full test coverage for all untested pages + E2E tests
>
> **Estimated Effort**: Large
> **Parallel Execution**: YES — 6 waves
> **Critical Path**: Task 1 (Git) → Task 16 (DB Schema) → Task 20-22 (Features) → Task 27 (E2E) → F1-F4

---

## Context

### Original Request
"Let's see what is available and what we should add and implement" — User wants a full audit and roadmap to address all gaps in the project.

### Interview Summary
**Key Discussions**:
- Priority: Full roadmap — address all gaps systematically
- Deployment: Personal/localhost only (no multi-user auth, deployment, or CI/CD)
- Test strategy: Tests-after (build first, test later)
- Theme: Let the plan decide (dark-only acceptable; add light toggle)

**Research Findings**:
- Stack is modern and well-chosen: React 19, Vite 8, Tailwind 4, shadcn/ui base-nova, Express 5, AI SDK 6, Zod 4
- 101 tests pass, TypeScript compiles clean
- 50+ knowledge modules, 5 LLM providers, 11 lazy-loaded pages
- Only 6 shadcn components installed
- Knowledge base is modular (era → category → subcategory)

### Metis Review
**Identified Gaps** (addressed):
- Phase work sequentially (git → code quality → UX → features → tests): Incorporated into wave structure
- Design unified DB schema before spaced repetition/bookmarking/progress: Added as prerequisite Task 16
- PWA scope capped to manifest + icons + service worker (static assets only): Specified in task
- Spaced repetition capped to basic intervals (no full SM-2): Specified in task
- Keyboard shortcuts capped to 3-5 specific shortcuts: Specified in task
- Theme toggle via CSS variable swap only: Specified in task
- Print CSS sequenced after theme toggle: Task 14 depends on Task 12
- `as any` fixes isolated from feature work: Separate wave (Phase 2)

---

## Work Objectives

### Core Objective
Transform the Time Traveler's Guide from a solid MVP into a polished, feature-complete personal study platform by addressing all identified gaps in UX, features, code quality, and test coverage.

### Concrete Deliverables
- Git repo with clean initial commit and proper .gitignore
- 0 `as any` in non-provider code
- Zod validation on all API v1 POST endpoints
- Mobile-responsive navigation with hamburger menu
- Error boundary, 404 page, and toast notifications
- Loading skeletons on all 11 lazy pages
- Dark/light theme toggle
- Data visualization on Financial Almanac and Butterfly Calculator pages
- Bookmarking, basic spaced repetition, and progress tracking
- Data export (JSON + CSV)
- PWA manifest with service worker
- Tests for all 7+ untested pages + E2E smoke tests

### Definition of Done
- [ ] `npx tsc --noEmit` → 0 errors
- [ ] `npx vitest run` → ≥ 101 tests passing (baseline) with new tests added
- [ ] `npm run build` → successful production build
- [ ] `npm run lint` → 0 errors

### Must Have
- All existing 101 tests continue to pass
- TypeScript compiles clean after every task
- No breaking changes to existing API endpoints
- Mobile-responsive navigation
- Error boundary wrapping all page routes
- Toast notifications for user feedback
- Unified DB schema designed before any new feature tables
- Theme toggle using CSS variables only (no per-component changes)

### Must NOT Have (Guardrails)
- Multi-user authentication system (personal/localhost only)
- Deployment infrastructure (Docker, cloud configs)
- CI/CD pipeline
- Full SM-2 spaced repetition algorithm (basic intervals only)
- PWA offline LLM streaming support (static assets cache only)
- Keyboard shortcut registry system or help modal (just 3-5 hardcoded shortcuts)
- Per-component theme changes (CSS variable swap on `<html>` only)
- `as any` fixes in LLM provider adapter code (too risky, out of scope)
- Touching existing test files (add new tests, don't modify existing)
- Removing any existing features or pages

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: YES (vitest 4, happy-dom, testing-library, supertest)
- **Automated tests**: YES (Tests-after — build first, test later)
- **Framework**: vitest + happy-dom (frontend), supertest (backend)
- **New test tasks**: Wave 6 (Phase 5) — after all features built

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.omo/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright — Navigate, interact, assert DOM, screenshot
- **API/Backend**: Use Bash (curl) — Send requests, assert status + response fields
- **Build**: Use Bash — Run build commands, check output

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Phase 1: Git + Baseline — 2 tasks, all parallel):
├── Task 1: Git init + .gitignore + first commit [quick]
└── Task 2: Record test/build baseline [quick]

Wave 2 (Phase 2: Code Quality — 4 tasks, all parallel):
├── Task 3: Fix duplicate export routes in api-v1.ts [quick]
├── Task 4: Add Zod validation to API v1 POST endpoints [unspecified-high]
├── Task 5: Remove `as any` from non-provider server code [unspecified-high]
└── Task 6: Add request logging middleware to Express [quick]

Wave 3 (Phase 3: UX Polish — 9 tasks, mostly parallel):
├── Task 7: 404 catch-all route with themed page [quick]
├── Task 8: React error boundary wrapping app routes [quick]
├── Task 9: Toast notification system (shadcn sonner) [quick]
├── Task 10: Mobile responsive navigation [visual-engineering]
├── Task 11: Loading skeletons for 11 lazy pages [visual-engineering]
├── Task 12: Theme toggle (dark/light via CSS variables) [visual-engineering]
├── Task 13: Keyboard shortcuts (Escape, ?, B, Ctrl+K existing) [quick]
├── Task 14: Print CSS styles (depends: 12 theme toggle) [quick]
└── Task 15: URL state management for filters [unspecified-high]

Wave 4 (Phase 4a: Features Foundation — 4 tasks, mixed parallel):
├── Task 16: Unified DB schema design (spaced repetition + bookmarks + progress) [deep]
├── Task 17: Financial data visualization — line/area charts [visual-engineering]
├── Task 18: Butterfly risk radar/bar charts [visual-engineering]
└── Task 19: Data export (JSON + CSV) [unspecified-high]

Wave 5 (Phase 4b: Features Dependent — 4 tasks, dep on schema):
├── Task 20: Bookmarking/favorites system (depends: 16, 9) [unspecified-high]
├── Task 21: Spaced repetition scheduling (depends: 16) [deep]
├── Task 22: Progress tracking dashboard (depends: 16) [unspecified-high]
└── Task 23: PWA setup — manifest + icons + service worker [quick]

Wave 6 (Phase 5: Tests — 4 tasks, all parallel):
├── Task 24: Tests for 7 untested pages [unspecified-high]
├── Task 25: Quiz page tests (LLM stream mocking) [deep]
├── Task 26: Zod validation schema tests [quick]
└── Task 27: E2E test setup (Playwright) + critical path tests [deep]

Wave FINAL (After ALL tasks — 4 parallel reviews):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real manual QA (unspecified-high + playwright)
└── Task F4: Scope fidelity check (deep)
-> Present results -> Get explicit user okay

Critical Path: Task 1 → Task 16 → Task 20/21/22 → Task 27 → F1-F4 → user okay
Parallel Speedup: ~65% faster than sequential
Max Concurrent: 9 (Wave 3)
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|-----------|--------|------|
| 1 | — | 3-6 | 1 |
| 2 | — | all (baseline) | 1 |
| 3 | 1 | — | 2 |
| 4 | 1 | 26 | 2 |
| 5 | 1 | — | 2 |
| 6 | 1 | — | 2 |
| 7 | 1 | — | 3 |
| 8 | 1 | — | 3 |
| 9 | 1 | 20 | 3 |
| 10 | 1 | — | 3 |
| 11 | 1 | — | 3 |
| 12 | 1 | 14 | 3 |
| 13 | 1 | — | 3 |
| 14 | 12 | — | 3 |
| 15 | 1 | 17, 18 | 3 |
| 16 | 1 | 20, 21, 22 | 4 |
| 17 | 15 | — | 4 |
| 18 | 15 | — | 4 |
| 19 | 1 | — | 4 |
| 20 | 16, 9 | — | 5 |
| 21 | 16 | — | 5 |
| 22 | 16 | — | 5 |
| 23 | 1 | — | 5 |
| 24 | all features | — | 6 |
| 25 | all features | — | 6 |
| 26 | 4 | — | 6 |
| 27 | all features | — | 6 |

### Agent Dispatch Summary

- **Wave 1**: 2 — T1 → `quick`, T2 → `quick`
- **Wave 2**: 4 — T3 → `quick`, T4 → `unspecified-high`, T5 → `unspecified-high`, T6 → `quick`
- **Wave 3**: 9 — T7-T9 → `quick`, T10-T12 → `visual-engineering`, T13-T14 → `quick`, T15 → `unspecified-high`
- **Wave 4**: 4 — T16 → `deep`, T17-T18 → `visual-engineering`, T19 → `unspecified-high`
- **Wave 5**: 4 — T20, T22 → `unspecified-high`, T21 → `deep`, T23 → `quick`
- **Wave 6**: 4 — T24 → `unspecified-high`, T25 → `deep`, T26 → `quick`, T27 → `deep`
- **FINAL**: 4 — F1 → `oracle`, F2-F3 → `unspecified-high`, F4 → `deep`

---

## TODOs

- [x] 1. Initialize Git Repository + .gitignore

  **What to do**:
  - Create `.gitignore` with: `node_modules/`, `dist/`, `.env`, `*.db`, `*.db-shm`, `*.db-wal`, `*.log`, `*.stackdump`, `.omo/evidence/`, `.omo/run-continuation/`
  - Initialize git repo: `git init`
  - Stage all existing files (except ignored ones)
  - Create initial commit: `chore: initialize Time Traveler's Guide repository`
  - Verify `.env` is excluded, `data/athena.db` is excluded, `data/ingested/` IS included

  **Must NOT do**:
  - Do NOT commit `.env` file (contains API keys)
  - Do NOT commit SQLite database files
  - Do NOT commit `.omo/` working files (only `.omo/plans/` and `.omo/drafts/` are okay to commit)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 2)
  - **Parallel Group**: Wave 1
  - **Blocks**: Tasks 3-27 (all subsequent tasks)
  - **Blocked By**: None

  **References**:
  - `.env.example` — lists all env vars that must be excluded from git
  - `.gitignore` — does not exist yet, must be created

  **Acceptance Criteria**:
  - [ ] `.gitignore` file exists and contains patterns for node_modules, dist, .env, *.db, *.log
  - [ ] `git log --oneline -1` shows the initial commit
  - [ ] `git status` shows clean working tree
  - [ ] `git ls-files | Select-String ".env"` returns nothing (no .env committed)

  **QA Scenarios**:
  ```
  Scenario: Git repo is properly initialized
    Tool: Bash
    Preconditions: Working directory is project root
    Steps:
      1. Run `git log --oneline` — expect at least 1 commit
      2. Run `git ls-files .env` — expect empty output
      3. Run `git ls-files | Select-String "\.db"` — expect empty output
      4. Run `cat .gitignore` — expect to see node_modules, dist, .env, *.db patterns
    Expected Result: Repo initialized, secrets excluded, clean status
    Failure Indicators: .env or .db files appear in git ls-files
    Evidence: .omo/evidence/task-1-git-init.txt

  Scenario: .gitignore blocks sensitive files
    Tool: Bash
    Steps:
      1. Create a test file `test_secret.env` with content "KEY=test"
      2. Run `git status --short` — expect test_secret.env NOT listed
      3. Delete test_secret.env
    Expected Result: .env files are ignored by git
    Evidence: .omo/evidence/task-1-gitignore-blocks.txt
  ```

  **Commit**: YES
  - Message: `chore: initialize Time Traveler's Guide repository`
  - Files: `.gitignore`, all existing project files
  - Pre-commit: `npx tsc --noEmit && npx vitest run`

- [x] 2. Record Test + Build Baseline

  **What to do**:
  - Run `npx vitest run` and record exact output (test count, pass/fail)
  - Run `npx tsc --noEmit` and record clean compile
  - Run `npm run build` and record successful build
  - Save baseline numbers to `.omo/evidence/baseline.txt` for all subsequent tasks to verify against

  **Must NOT do**:
  - Do NOT modify any test files
  - Do NOT modify any source files

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 1)
  - **Parallel Group**: Wave 1
  - **Blocks**: All subsequent tasks (baseline reference)
  - **Blocked By**: None

  **References**:
  - `vite.config.ts:24-27` — vitest configuration (globals, happy-dom environment)

  **Acceptance Criteria**:
  - [ ] `.omo/evidence/baseline.txt` exists with recorded test count, build status, and tsc status
  - [ ] Baseline shows ≥ 101 tests passing and 0 TypeScript errors

  **QA Scenarios**:
  ```
  Scenario: Baseline recorded correctly
    Tool: Bash
    Steps:
      1. Run `cat .omo/evidence/baseline.txt`
      2. Verify it contains a test count ≥ 101
      3. Verify it contains "0 errors" or "clean" for TypeScript
    Expected Result: Baseline file with all metrics recorded
    Evidence: .omo/evidence/baseline.txt (self-referential)
  ```

  **Commit**: NO (evidence file, not code)

- [x] 3. Fix Duplicate Export Route Handlers in api-v1.ts

  **What to do**:
  - In `server/api-v1.ts`, there are TWO `GET /export` handlers (lines 452-471 and lines 500-510)
  - Keep the richer one (lines 452-471 with staticCount, ingestedEntries, export functionality) as `GET /export`
  - Remove the second duplicate (lines 489-510) which is simpler and overrides the first
  - Also keep the `/export-legacy` route but note it's redundant now — remove it entirely
  - Run tests to verify no regressions

  **Must NOT do**:
  - Do NOT change the export data format
  - Do NOT modify any other route handlers

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 4, 5, 6)
  - **Parallel Group**: Wave 2
  - **Blocks**: None
  - **Blocked By**: Task 1 (git init)

  **References**:
  **Pattern References**:
  - `server/api-v1.ts:452-471` — First (richer) GET /export handler with staticCount, ingestedEntries
  - `server/api-v1.ts:489-510` — Duplicate handlers that must be removed
  **Test References**:
  - `server/athena-routes.test.ts` — Test patterns for API route testing with supertest

  **Acceptance Criteria**:
  - [ ] `server/api-v1.ts` has exactly ONE `router.get('/export', ...)` handler
  - [ ] No `/export-legacy` route exists
  - [ ] `npx vitest run` passes all tests

  **QA Scenarios**:
  ```
  Scenario: Export endpoint returns full data
    Tool: Bash (curl)
    Preconditions: Server is running on port 3001
    Steps:
      1. `curl -s http://localhost:3001/api/v1/export | head -c 200`
      2. Verify response contains "modules" and "ingested" fields
    Expected Result: Single export endpoint returns rich data format
    Failure Indicators: 404, or response missing "ingested" field
    Evidence: .omo/evidence/task-3-export-fix.txt

  Scenario: No duplicate route handlers
    Tool: Bash
    Steps:
      1. `Select-String -Path server/api-v1.ts -Pattern "router\.get\('/export'" | Measure-Object`
      2. Expect exactly 1 match
    Expected Result: Exactly one export route handler
    Evidence: .omo/evidence/task-3-no-dupes.txt
  ```

  **Commit**: YES
  - Message: `fix(server): remove duplicate export route handlers in api-v1`
  - Files: `server/api-v1.ts`
  - Pre-commit: `npx vitest run`

- [x] 4. Add Zod Validation to API v1 POST Endpoints

  **What to do**:
  - Create `server/schemas.ts` with Zod schemas for POST request bodies:
    - `IngestSchema`: `{ module: z.enum([...8 modules]), entry: z.object({ id: z.string(), ... }) }`
    - `FetchSchema`: `{ source: z.enum(['wikipedia', 'wikidata']), query: z.string().min(1) }`
    - `ExploreSchema`: `{ query: z.string().min(1) }`
    - `BatchSchema`: `{ queries: z.array(z.string()).min(1).max(10) }`
    - `RestoreSchema`: `{ ingested: z.record(z.any()) }`
  - Apply validation middleware to each POST route in `createApiV1Router()`
  - Return 400 with validation error details on invalid input
  - Replace existing manual validation checks with schema validation

  **Must NOT do**:
  - Do NOT change the response format for valid requests
  - Do NOT modify GET endpoints
  - Do NOT add auth middleware

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 3, 5, 6)
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 26 (Zod validation tests)
  - **Blocked By**: Task 1

  **References**:
  **API/Type References**:
  - `server/api-v1.ts:422-449` — POST /ingest endpoint with current manual validation
  - `server/api-v1.ts:182-219` — POST /fetch endpoint
  - `server/api-v1.ts:222-293` — POST /explore endpoint
  - `server/api-v1.ts:296-331` — POST /batch endpoint
  - `server/api-v1.ts:474-486` — POST /restore endpoint
  **External References**:
  - Zod 4 docs: https://zod.dev — Zod is already a dependency at v4.4.3

  **Acceptance Criteria**:
  - [ ] `server/schemas.ts` exists with all 5 Zod schemas
  - [ ] POST /ingest returns 400 with `{ error: "Validation failed", details: [...] }` on invalid input
  - [ ] POST /fetch returns 400 on missing `source` or `query`
  - [ ] POST /batch returns 400 on empty `queries` array or >10 items
  - [ ] `npx vitest run` passes all tests

  **QA Scenarios**:
  ```
  Scenario: Ingest endpoint rejects invalid module
    Tool: Bash (curl)
    Preconditions: Server running on port 3001
    Steps:
      1. `curl -s -X POST http://localhost:3001/api/v1/ingest -H "Content-Type: application/json" -d "{\"module\":\"invalid\",\"entry\":{\"id\":\"test\"}}"`
      2. Verify response status is 400
      3. Verify response body contains "validation" or "invalid" error message
    Expected Result: 400 with validation error details
    Failure Indicators: 201/200 status, or no error message
    Evidence: .omo/evidence/task-4-zod-ingest.txt

  Scenario: Fetch endpoint rejects empty query
    Tool: Bash (curl)
    Steps:
      1. `curl -s -X POST http://localhost:3001/api/v1/fetch -H "Content-Type: application/json" -d "{\"source\":\"wikipedia\",\"query\":\"\"}"`
      2. Verify 400 status with validation error
    Expected Result: 400 with "query must be at least 1 character"
    Evidence: .omo/evidence/task-4-zod-fetch.txt

  Scenario: Batch endpoint rejects >10 queries
    Tool: Bash (curl)
    Steps:
      1. Send POST /batch with 11 query strings
      2. Verify 400 status
    Expected Result: 400 with "max 10" error
    Evidence: .omo/evidence/task-4-zod-batch.txt
  ```

  **Commit**: YES
  - Message: `feat(server): add Zod validation to API v1 POST endpoints`
  - Files: `server/schemas.ts`, `server/api-v1.ts`
  - Pre-commit: `npx vitest run`

- [x] 5. Remove `as any` from Non-Provider Server Code

  **What to do**:
  - In `server/api-v1.ts`, replace `any` type annotations with proper types:
    - `(e: any)` in filter callbacks → use a proper entry type (e.g., `Record<string, unknown>` or define an interface)
    - `(err: any)` in catch blocks → use `unknown` with type narrowing
    - `(r: any, i: number)` in map callbacks → type the response properly
  - In `server/index.ts`, replace `(err: unknown)` catch blocks that use `String(err)` properly (these are already typed)
  - Do NOT touch `server/index.ts` provider adapter code (lines 52-88) — LLM provider types are out of scope
  - Do NOT touch `vite.config.ts` (the `as any` there is a workaround for plugin types)

  **Must NOT do**:
  - Do NOT fix `as any` in LLM provider adapter code (`getModel`, provider config)
  - Do NOT fix `as any` in `vite.config.ts`
  - Do NOT change any runtime behavior

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 3, 4, 6)
  - **Parallel Group**: Wave 2
  - **Blocks**: None
  - **Blocked By**: Task 1

  **References**:
  **Pattern References**:
  - `server/api-v1.ts:17` — `MODULES` Record uses `any[]` for data, which propagates `any` to all callbacks
  - `server/api-v1.ts:339-369` — Filter callbacks with `(e: any)` patterns
  - `server/api-v1.ts:409-419` — More filter callbacks with `any`

  **Acceptance Criteria**:
  - [ ] `npx tsc --noEmit` shows 0 errors
  - [ ] `Select-String -Path server/api-v1.ts -Pattern "as any|: any" | Where-Object { $_.Line -notmatch "MODULES" }` returns only the `MODULES` declaration line
  - [ ] `npx vitest run` passes all tests

  **QA Scenarios**:
  ```
  Scenario: No `any` in server filter callbacks
    Tool: Bash
    Steps:
      1. `Select-String -Path server/api-v1.ts -Pattern "\(e: any\)"` — expect 0 matches
      2. `Select-String -Path server/api-v1.ts -Pattern "\(err: any\)"` — expect 0 matches
      3. `Select-String -Path server/api-v1.ts -Pattern "\(r: any\)"` — expect 0 matches
    Expected Result: Zero `any` annotations in filter/map callbacks
    Evidence: .omo/evidence/task-5-no-any.txt

  Scenario: TypeScript still compiles clean
    Tool: Bash
    Steps:
      1. `npx tsc --noEmit` — expect exit code 0, no errors
    Expected Result: Clean compile with proper types
    Evidence: .omo/evidence/task-5-tsc.txt
  ```

  **Commit**: YES
  - Message: `fix(server): replace `any` types with proper types in api-v1.ts`
  - Files: `server/api-v1.ts`
  - Pre-commit: `npx tsc --noEmit && npx vitest run`

- [x] 6. Add Request Logging Middleware to Express Server

  **What to do**:
  - Create `server/middleware.ts` with a lightweight request logger:
    - Log method, path, status code, and response time for each request
    - Use `console.log` with structured format: `[REQ] GET /api/v1/stats 200 12ms`
    - Skip logging for health check endpoint (`/api/health`)
  - Apply middleware in `server/index.ts` before routes: `app.use(requestLogger())`
  - Use Express 5 middleware pattern (async-compatible)

  **Must NOT do**:
  - Do NOT add external logging libraries (winston, pino, etc.)
  - Do NOT add request ID generation
  - Do NOT log request bodies (could contain API keys)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 3, 4, 5)
  - **Parallel Group**: Wave 2
  - **Blocks**: None
  - **Blocked By**: Task 1

  **References**:
  **Pattern References**:
  - `server/index.ts:29-31` — Health check endpoint (should be excluded from logging)
  - `server/index.ts:23-27` — Where middleware is currently applied (cors, express.json)

  **Acceptance Criteria**:
  - [ ] `server/middleware.ts` exists and exports a request logger function
  - [ ] `server/index.ts` imports and uses the middleware
  - [ ] `npx tsc --noEmit` → 0 errors
  - [ ] `npx vitest run` passes all tests

  **QA Scenarios**:
  ```
  Scenario: Requests are logged to console
    Tool: Bash (curl)
    Preconditions: Server running on port 3001
    Steps:
      1. `curl -s http://localhost:3001/api/v1/stats > $null`
      2. Check server console output for `[REQ] GET /api/v1/stats 200` line
    Expected Result: Log line appears with method, path, status, and timing
    Failure Indicators: No log output, or malformed log line
    Evidence: .omo/evidence/task-6-logging.txt
  ```

  **Commit**: YES
  - Message: `feat(server): add request logging middleware`
  - Files: `server/middleware.ts`, `server/index.ts`
  - Pre-commit: `npx tsc --noEmit && npx vitest run`

- [x] 7. Add 404 Catch-All Route with Themed Page

  **What to do**:
  - Create `src/pages/NotFound.tsx` with a themed 404 page:
    - Dark background matching the app's aesthetic
    - "Timeline Not Found" heading with a time-travel themed message
    - Link back to dashboard (`<Link to="/">`)
    - Display the attempted URL for reference
  - Add a catch-all route `<Route path="*">` at the end of routes in `App.tsx`
  - Include the 404 page in the lazy-loading pattern

  **Must NOT do**:
  - Do NOT modify existing routes
  - Do NOT add complex logic to the 404 page

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 8-15)
  - **Parallel Group**: Wave 3
  - **Blocks**: None
  - **Blocked By**: Task 1

  **References**:
  **Pattern References**:
  - `src/App.tsx:10-20` — Lazy loading pattern for pages
  - `src/App.tsx:466-479` — Route definitions in App component

  **Acceptance Criteria**:
  - [ ] `src/pages/NotFound.tsx` exists
  - [ ] Navigating to `/nonexistent-path` renders the 404 page (not a blank page)
  - [ ] 404 page contains a link to `/` that navigates home
  - [ ] `npx vitest run` passes all tests

  **QA Scenarios**:
  ```
  Scenario: Unknown route shows 404 page
    Tool: Playwright
    Steps:
      1. Navigate to `http://localhost:5173/this-does-not-exist`
      2. Assert page contains text "Not Found" or "Timeline"
      3. Assert a link to "/" exists on the page
    Expected Result: Themed 404 page with home link
    Failure Indicators: Blank page, or default browser 404
    Evidence: .omo/evidence/task-7-404-page.png

  Scenario: Valid routes still work
    Tool: Playwright
    Steps:
      1. Navigate to `http://localhost:5173/sports`
      2. Assert page loads sports almanac content (not 404)
    Expected Result: Sports page loads normally
    Evidence: .omo/evidence/task-7-valid-routes.png
  ```

  **Commit**: YES
  - Message: `feat(ux): add 404 catch-all route with themed page`
  - Files: `src/pages/NotFound.tsx`, `src/App.tsx`
  - Pre-commit: `npx vitest run`

- [x] 8. Add React Error Boundary Wrapping App Routes

  **What to do**:
  - Create `src/components/ErrorBoundary.tsx`:
    - Class component (React error boundaries require class components)
    - `getDerivedStateFromError` to catch errors
    - Fallback UI: themed error message with "Temporal Anomaly Detected" heading
    - "Return to Safety" button that resets error state and navigates to `/`
    - Log error to `console.error` for debugging
  - Wrap the `<Routes>` component in `App.tsx` with the error boundary
  - Write a test that renders a component that throws and verifies fallback UI is shown

  **Must NOT do**:
  - Do NOT wrap individual pages (wrap the entire Routes tree)
  - Do NOT add error reporting to external services

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 7, 9-15)
  - **Parallel Group**: Wave 3
  - **Blocks**: None
  - **Blocked By**: Task 1

  **References**:
  **Pattern References**:
  - `src/App.tsx:463-483` — App component with Routes that need wrapping
  **Test References**:
  - `src/components/PalaceHook.test.tsx` — Example component test pattern

  **Acceptance Criteria**:
  - [ ] `src/components/ErrorBoundary.tsx` exists as a class component
  - [ ] `App.tsx` wraps `<Routes>` with `<ErrorBoundary>`
  - [ ] Test file `src/components/ErrorBoundary.test.tsx` verifies fallback renders on error
  - [ ] `npx vitest run` passes all tests

  **QA Scenarios**:
  ```
  Scenario: Error boundary catches render errors
    Tool: Bash (vitest)
    Steps:
      1. Run `npx vitest run src/components/ErrorBoundary.test.tsx`
      2. Verify test passes — a throwing component triggers fallback UI
    Expected Result: Test passes, fallback UI is rendered instead of crash
    Evidence: .omo/evidence/task-8-error-boundary.txt

  Scenario: Normal pages render without error boundary interference
    Tool: Playwright
    Steps:
      1. Navigate to `http://localhost:5173/`
      2. Assert dashboard renders normally (no error boundary fallback)
    Expected Result: Dashboard loads, error boundary is invisible
    Evidence: .omo/evidence/task-8-normal-render.png
  ```

  **Commit**: YES
  - Message: `feat(ux): add React error boundary wrapping app routes`
  - Files: `src/components/ErrorBoundary.tsx`, `src/components/ErrorBoundary.test.tsx`, `src/App.tsx`
  - Pre-commit: `npx vitest run`

- [x] 9. Add Toast Notification System (shadcn Sonner)

  **What to do**:
  - Install `sonner` package: `npx shadcn@latest add sonner`
  - Add `<Toaster />` component to `App.tsx` Layout (inside the `<div className="min-h-screen">`)
  - Create a toast utility wrapper in `src/lib/toast.ts`:
    - `showSuccess(message)` — green toast for positive actions
    - `showError(message)` — red toast for errors
    - `showInfo(message)` — neutral informational toast
  - Apply toasts to these specific events:
    - Companion selection changed → `showSuccess("Companion changed to {name}")`
    - Search result clicked → no toast (navigation is sufficient)
    - Print button clicked → `showInfo("Sending dossier to printer...")`
    - Keyboard shortcut activated → no toast (visual feedback is the action itself)

  **Must NOT do**:
  - Do NOT add toasts to every click event (only the listed triggers)
  - Do NOT replace existing UI feedback with toasts

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 7, 8, 10-15)
  - **Parallel Group**: Wave 3
  - **Blocks**: Task 20 (bookmarking uses toast for save confirmation)
  - **Blocked By**: Task 1

  **References**:
  **Pattern References**:
  - `src/App.tsx:213-260` — Layout component where Toaster should be added
  **External References**:
  - shadcn/ui sonner: `npx shadcn@latest add sonner` — follows existing component pattern
  - `components.json` — shadcn config using base-nova style

  **Acceptance Criteria**:
  - [ ] `sonner` is in `package.json` dependencies
  - [ ] `src/components/ui/sonner.tsx` exists
  - [ ] `src/lib/toast.ts` exports `showSuccess`, `showError`, `showInfo`
  - [ ] `<Toaster />` renders in App layout
  - [ ] `npx vitest run` passes all tests

  **QA Scenarios**:
  ```
  Scenario: Toast appears on companion change
    Tool: Playwright
    Steps:
      1. Navigate to `http://localhost:5173/`
      2. Click companion button (the avatar/name button in header)
      3. Click "Select" on a different companion
      4. Assert a toast notification appears with the companion name
    Expected Result: Toast shows "Companion changed to {name}"
    Failure Indicators: No toast, or toast with wrong message
    Evidence: .omo/evidence/task-9-toast-companion.png

  Scenario: Error toast shows red styling
    Tool: Playwright
    Steps:
      1. Call `showError("Test error")` from browser console
      2. Assert toast appears with error styling
    Expected Result: Red-themed error toast
    Evidence: .omo/evidence/task-9-toast-error.png
  ```

  **Commit**: YES
  - Message: `feat(ux): add toast notification system with sonner`
  - Files: `src/components/ui/sonner.tsx`, `src/lib/toast.ts`, `src/App.tsx`, `package.json`
  - Pre-commit: `npx vitest run`

- [x] 10. Add Mobile Responsive Navigation

  **What to do**:
  - Create `src/components/MobileNav.tsx`:
    - Hamburger menu button visible on screens < `lg` breakpoint (replaces `hidden lg:flex` on desktop nav)
    - Slide-out drawer from left with all navigation links (same as desktop nav)
    - Companion button and search button in the drawer header
    - Close on route change and on Escape key
  - Update `App.tsx` Layout:
    - Replace `hidden lg:flex` nav with a pattern that shows mobile nav on small screens, desktop nav on large screens
    - Mobile: hamburger icon button → opens MobileNav drawer
    - Desktop: existing nav links (no change)
  - Use shadcn Sheet component for the drawer: `npx shadcn@latest add sheet`
  - Ensure dashboard cards are responsive (they already use `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)

  **Must NOT do**:
  - Do NOT change the desktop navigation layout
  - Do NOT add a bottom tab bar (use hamburger + drawer)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Mobile responsive navigation design

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 7-9, 11-15)
  - **Parallel Group**: Wave 3
  - **Blocks**: None
  - **Blocked By**: Task 1

  **References**:
  **Pattern References**:
  - `src/App.tsx:221-233` — Desktop nav with `hidden lg:flex` (needs mobile equivalent)
  - `src/App.tsx:234-260` — Header buttons (companion, search, print)
  **External References**:
  - shadcn Sheet: `npx shadcn@latest add sheet` — slide-out drawer pattern

  **Acceptance Criteria**:
  - [ ] `src/components/MobileNav.tsx` exists
  - [ ] `src/components/ui/sheet.tsx` exists
  - [ ] On viewport width < 1024px: hamburger button is visible, desktop nav is hidden
  - [ ] Clicking hamburger opens a drawer with all nav links
  - [ ] Clicking a nav link closes the drawer and navigates
  - [ ] `npx vitest run` passes all tests

  **QA Scenarios**:
  ```
  Scenario: Mobile navigation works on small screens
    Tool: Playwright
    Steps:
      1. Set viewport to 375x667 (iPhone SE)
      2. Navigate to `http://localhost:5173/`
      3. Assert hamburger/menu button is visible
      4. Click hamburger button
      5. Assert a drawer/panel appears with nav links for "Sports", "Finance", "Era", etc.
      6. Click "Sports" link
      7. Assert drawer closes and URL changes to /sports
    Expected Result: Hamburger → drawer → navigation works on mobile
    Failure Indicators: No hamburger visible, drawer doesn't open, links don't navigate
    Evidence: .omo/evidence/task-10-mobile-nav.png

  Scenario: Desktop navigation unchanged
    Tool: Playwright
    Steps:
      1. Set viewport to 1440x900
      2. Navigate to `http://localhost:5173/`
      3. Assert desktop nav links are visible (not hamburger)
    Expected Result: Same desktop nav as before
    Evidence: .omo/evidence/task-10-desktop-nav.png
  ```

  **Commit**: YES
  - Message: `feat(ux): add mobile responsive navigation with hamburger drawer`
  - Files: `src/components/MobileNav.tsx`, `src/App.tsx`, `src/components/ui/sheet.tsx`
  - Pre-commit: `npx vitest run`

- [x] 11. Add Loading Skeletons for 11 Lazy-Loaded Pages

  **What to do**:
  - Install skeleton component: `npx shadcn@latest add skeleton`
  - Create `src/components/PageSkeleton.tsx`:
    - A themed loading skeleton matching the dashboard card layout
    - Dark background with animated pulse placeholders
    - 3-4 skeleton "cards" in a grid to match the dashboard layout
  - Replace the generic `Loading module…` text in `App.tsx` `<Lazy>` component with `<PageSkeleton />`
  - Add page-specific skeletons for heavy pages:
    - `TemporalMapSkeleton` — timeline-style skeleton
    - `FinancialAlmanacSkeleton` — table-style skeleton
    - (Other pages can use the generic PageSkeleton)

  **Must NOT do**:
  - Do NOT add data-fetching (pages are already lazy-loaded, not data-fetched)
  - Do NOT over-engineer — generic skeleton is fine for most pages

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Loading state design

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 7-10, 12-15)
  - **Parallel Group**: Wave 3
  - **Blocks**: None
  - **Blocked By**: Task 1

  **References**:
  **Pattern References**:
  - `src/App.tsx:22-28` — Current `<Lazy>` wrapper with generic "Loading module…" text
  **External References**:
  - shadcn Skeleton: `npx shadcn@latest add skeleton`

  **Acceptance Criteria**:
  - [ ] `src/components/PageSkeleton.tsx` exists
  - [ ] `src/components/ui/skeleton.tsx` exists
  - [ ] Lazy loading shows skeleton cards instead of plain text
  - [ ] Skeleton has animated pulse effect
  - [ ] `npx vitest run` passes all tests

  **QA Scenarios**:
  ```
  Scenario: Skeleton shows during page load
    Tool: Playwright
    Steps:
      1. Navigate to `http://localhost:5173/`
      2. Throttle network to "Slow 3G" in browser context
      3. Click a module card (e.g., "Sports Almanac")
      4. Immediately assert skeleton elements are visible (before page loads)
    Expected Result: Animated skeleton placeholders appear during lazy load
    Failure Indicators: Plain "Loading module…" text, or blank page
    Evidence: .omo/evidence/task-11-skeletons.png
  ```

  **Commit**: YES
  - Message: `feat(ux): add loading skeletons for lazy-loaded pages`
  - Files: `src/components/PageSkeleton.tsx`, `src/components/ui/skeleton.tsx`, `src/App.tsx`
  - Pre-commit: `npx vitest run`

- [x] 12. Add Theme Toggle (Dark/Light via CSS Variables)

  **What to do**:
  - Check if shadcn/ui base-nova already defines CSS variables for light/dark themes in `src/index.css`
  - If not, add light theme CSS variables alongside existing dark theme variables
  - Create `src/components/ThemeToggle.tsx`:
    - Sun/Moon icon button (lucide-react)
    - Toggles `dark` class on `<html>` element
    - Persists preference to `localStorage` key `theme`
    - Respects `prefers-color-scheme` on first load (system preference)
    - Add inline script in `index.html` to prevent FOIT (flash of incorrect theme)
  - Add toggle button in the header, next to the search button
  - Add `@media print` note: Task 14 will handle print CSS that overrides dark theme

  **Must NOT do**:
  - Do NOT touch individual component styles — use CSS variables only
  - Do NOT add more than 2 themes (dark and light only)
  - Do NOT add a theme picker UI — simple toggle is sufficient

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Theme toggle and CSS variable design

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 7-11, 13, 15)
  - **Parallel Group**: Wave 3
  - **Blocks**: Task 14 (print CSS depends on theme variables)
  - **Blocked By**: Task 1

  **References**:
  **Pattern References**:
  - `src/index.css` — Current CSS with Tailwind and custom styles (check for existing CSS variables)
  - `src/App.tsx:234-260` — Header button area where toggle should be added
  **External References**:
  - Tailwind 4 dark mode: CSS-first configuration with `@variant dark`
  - shadcn/ui theming: Uses CSS variables for colors

  **Acceptance Criteria**:
  - [ ] `src/components/ThemeToggle.tsx` exists
  - [ ] Clicking toggle switches `<html>` class between `dark` and no class (or `light`)
  - [ ] Theme persists on page reload (localStorage)
  - [ ] All pages render correctly in both themes (no broken colors)
  - [ ] `npx vitest run` passes all tests

  **QA Scenarios**:
  ```
  Scenario: Theme toggle switches appearance
    Tool: Playwright
    Steps:
      1. Navigate to `http://localhost:5173/`
      2. Assert page has dark background
      3. Click theme toggle button (Sun/Moon icon)
      4. Assert background changes to light color
      5. Assert `<html>` classList changes
    Expected Result: Visual theme switches between dark and light
    Failure Indicators: No visual change, or broken layout
    Evidence: .omo/evidence/task-12-theme-toggle.png

  Scenario: Theme persists after reload
    Tool: Playwright
    Steps:
      1. Toggle to light theme
      2. Reload page
      3. Assert page still shows light theme
    Expected Result: Theme preference persists across reloads
    Evidence: .omo/evidence/task-12-theme-persist.png

  Scenario: System preference respected on first visit
    Tool: Playwright
    Steps:
      1. Clear localStorage
      2. Emulate `prefers-color-scheme: light`
      3. Navigate to app
      4. Assert light theme is active
    Expected Result: System preference determines initial theme
    Evidence: .omo/evidence/task-12-system-pref.png
  ```

  **Commit**: YES
  - Message: `feat(ux): add dark/light theme toggle with CSS variables`
  - Files: `src/components/ThemeToggle.tsx`, `src/App.tsx`, `src/index.css`, `index.html`
  - Pre-commit: `npx vitest run`

- [x] 13. Add Keyboard Shortcuts (Escape, ?, B, Ctrl+K)

  **What to do**:
  - Extend the existing keyboard handler in `App.tsx` Layout (currently only Ctrl+K for search)
  - Add these specific shortcuts:
    - `Escape` — Close any open modal (search, companion config)
    - `?` — Show a small tooltip/overlay listing active shortcuts (not a full modal, just a hint)
    - `B` — Toggle bookmark on current page content (will be wired to bookmarking system in Task 20; for now, show a toast "Bookmarks coming soon")
    - `Ctrl+K` — Already exists (search), no change needed
  - Shortcuts should only fire when NOT focused on an input/textarea (check `document.activeElement`)
  - Add a `<kbd>` hint in the search button tooltip showing available shortcuts

  **Must NOT do**:
  - Do NOT build a keyboard shortcut registry system
  - Do NOT add a dedicated help modal or settings page for shortcuts
  - Do NOT override browser default shortcuts

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 7-12, 14, 15)
  - **Parallel Group**: Wave 3
  - **Blocks**: None
  - **Blocked By**: Task 1

  **References**:
  **Pattern References**:
  - `src/App.tsx:181-190` — Existing Ctrl+K keyboard handler (extend this)
  - `src/App.tsx:268-328` — Search modal (Escape should close it)
  - `src/App.tsx:331-457` — Companion config modal (Escape should close it)

  **Acceptance Criteria**:
  - [ ] `Escape` closes search modal when open
  - [ ] `Escape` closes companion modal when open
  - [ ] `?` shows shortcut hint overlay
  - [ ] `B` shows "Bookmarks coming soon" toast (or bookmarks if Task 20 is done)
  - [ ] Shortcuts don't fire when typing in input fields
  - [ ] `npx vitest run` passes all tests

  **QA Scenarios**:
  ```
  Scenario: Escape closes open modals
    Tool: Playwright
    Steps:
      1. Navigate to `http://localhost:5173/`
      2. Press Ctrl+K to open search
      3. Assert search modal is visible
      4. Press Escape
      5. Assert search modal is closed
    Expected Result: Escape closes the search modal
    Evidence: .omo/evidence/task-13-escape-modal.png

  Scenario: Shortcuts don't fire in input fields
    Tool: Playwright
    Steps:
      1. Open search modal (Ctrl+K)
      2. Type "B" in the search input
      3. Assert no bookmark toast appears (B was typed, not shortcutted)
    Expected Result: B is typed into search field, not intercepted
    Evidence: .omo/evidence/task-13-input-no-shortcut.txt
  ```

  **Commit**: YES
  - Message: `feat(ux): add keyboard shortcuts (Escape, ?, B)`
  - Files: `src/App.tsx`
  - Pre-commit: `npx vitest run`

- [x] 14. Add Print CSS Styles

  **What to do**:
  - Add `@media print` rules to `src/index.css`:
    - Hide header nav, companion button, search button, print button
    - Hide any open modals/overlays
    - Set body to white background, black text
    - Override dark theme CSS variables for print context (regardless of active theme)
    - Expand full-width layout (remove container max-width)
    - Show page titles prominently
    - Add `page-break-inside: avoid` on card components
  - Add `print:hidden` class to interactive elements (buttons, nav, modals)
  - The print button in the header (`<Printer />`) already calls `window.print()` — this task just ensures it looks good

  **Must NOT do**:
  - Do NOT make every page perfectly print-ready (focus on readable output, not pixel-perfect)
  - Do NOT add a print preview feature

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on Task 12 theme toggle for CSS variable awareness)
  - **Parallel Group**: Wave 3 (sequential after Task 12)
  - **Blocks**: None
  - **Blocked By**: Task 12 (theme toggle — must know CSS variable names)

  **References**:
  **Pattern References**:
  - `src/App.tsx:253-259` — Print button that calls `window.print()`
  - `src/App.tsx:215-260` — Header that should be hidden in print
  - `src/index.css` — Where print CSS rules should be added

  **Acceptance Criteria**:
  - [ ] `src/index.css` contains `@media print` block
  - [ ] Print preview shows white background, black text
  - [ ] Navigation, buttons, and modals are hidden in print
  - [ ] Content is full-width in print
  - [ ] Works correctly regardless of active theme (dark or light)
  - [ ] `npx vitest run` passes all tests

  **QA Scenarios**:
  ```
  Scenario: Print CSS hides interactive elements
    Tool: Playwright
    Steps:
      1. Navigate to `http://localhost:5173/`
      2. Emulate print media: `page.emulateMedia({ media: 'print' })`
      3. Assert header nav is hidden (display: none)
      4. Assert body has white background
      5. Assert content text is black
    Expected Result: Clean print layout without interactive chrome
    Failure Indicators: Dark background, buttons visible, sidebar visible
    Evidence: .omo/evidence/task-14-print-css.png

  Scenario: Print works in both themes
    Tool: Playwright
    Steps:
      1. Set dark theme
      2. Emulate print media
      3. Assert white background (dark theme overridden for print)
      4. Set light theme
      5. Emulate print media
      6. Assert white background still
    Expected Result: Print always uses white/black regardless of theme
    Evidence: .omo/evidence/task-14-print-themes.png
  ```

  **Commit**: YES
  - Message: `feat(ux): add print CSS styles`
  - Files: `src/index.css`, `src/App.tsx` (add print:hidden classes)
  - Pre-commit: `npx vitest run`

- [x] 15. Add URL State Management for Filters

  **What to do**:
  - Create `src/hooks/useURLState.ts`:
    - Generic hook that syncs state to URL search params
    - `useURLState(key, defaultValue)` → reads from `?key=value`, writes back on change
    - Handles encoding/decoding of arrays (comma-separated) and primitives
    - Uses `window.history.replaceState` to avoid page reloads
  - Apply to pages with filters:
    - `TemporalMap.tsx` — sync era filter, search query to URL
    - `EraGuide.tsx` — sync selected era to URL
    - `ButterflyCalculator.tsx` — sync selected intervention to URL
  - When a page loads, read filters from URL; when user changes filters, update URL

  **Must NOT do**:
  - Do NOT add URL state to pages that don't have filters
  - Do NOT use a routing library for this (use native URLSearchParams)
  - Do NOT add URL state to the search overlay (it's a global modal, not a page filter)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 7-13)
  - **Parallel Group**: Wave 3
  - **Blocks**: Tasks 17, 18 (data viz pages will use URL state for chart filters)
  - **Blocked By**: Task 1

  **References**:
  **Pattern References**:
  - `src/pages/TemporalMap.tsx` — Has filter state that should sync to URL
  - `src/pages/EraGuide.tsx` — Has era selection that should persist
  - `src/pages/ButterflyCalculator.tsx` — Has intervention selection

  **Acceptance Criteria**:
  - [ ] `src/hooks/useURLState.ts` exists and exports the hook
  - [ ] Navigating to `/timeline?era=1980s` pre-selects the 1980s filter
  - [ ] Changing the era filter on Timeline updates the URL without page reload
  - [ ] `npx vitest run` passes all tests

  **QA Scenarios**:
  ```
  Scenario: URL state syncs with filters
    Tool: Playwright
    Steps:
      1. Navigate to `http://localhost:5173/timeline?era=1980s`
      2. Assert the 1980s era filter is selected in the UI
      3. Change the filter to "1990s" via UI interaction
      4. Assert URL updates to `?era=1990s` without page reload
    Expected Result: URL and filter state stay in sync
    Evidence: .omo/evidence/task-15-url-state.png

  Scenario: URL state survives page reload
    Tool: Playwright
    Steps:
      1. Navigate to `http://localhost:5173/timeline?era=1980s`
      2. Reload page
      3. Assert 1980s filter is still selected
    Expected Result: Filter state persists across reloads via URL
    Evidence: .omo/evidence/task-15-url-persist.png
  ```

  **Commit**: YES
  - Message: `feat(ux): add URL state management hook for page filters`
  - Files: `src/hooks/useURLState.ts`, `src/pages/TemporalMap.tsx`, `src/pages/EraGuide.tsx`, `src/pages/ButterflyCalculator.tsx`
  - Pre-commit: `npx vitest run`

- [x] 16. Design Unified DB Schema (Spaced Repetition + Bookmarks + Progress)

  **What to do**:
  - Design and implement SQLite schema in `server/db.ts` for three new features:
    - **Bookmarks table**: `id TEXT PK, module TEXT, entry_id TEXT, created_at TEXT, note TEXT`
    - **Spaced repetition table**: `id TEXT PK, topic TEXT, competence INTEGER, next_review TEXT, interval_days INTEGER, review_count INTEGER, last_reviewed TEXT`
    - **Progress tracking table**: `id TEXT PK, module TEXT, entries_viewed INTEGER, total_entries INTEGER, quiz_score INTEGER, quiz_total INTEGER, last_activity TEXT`
  - Create migration function `runFeatureMigrations(db: Database)` that creates all three tables with `CREATE TABLE IF NOT EXISTS`
  - Call migration in `server/index.ts` after `initAthenaDb()`
  - Create API routes for each table in a new `server/feature-routes.ts`:
    - `GET /api/features/bookmarks` — list all bookmarks
    - `POST /api/features/bookmarks` — add bookmark
    - `DELETE /api/features/bookmarks/:id` — remove bookmark
    - `GET /api/features/progress` — get all progress
    - `PUT /api/features/progress/:module` — update module progress
    - `GET /api/features/reviews` — get due reviews
    - `POST /api/features/reviews` — submit review result
  - Mount routes in `server/index.ts`

  **Must NOT do**:
  - Do NOT implement the full SM-2 algorithm (basic interval tracking only: each review multiplies interval by 2.0 if correct, resets to 1 if wrong)
  - Do NOT add user IDs (single-user localhost)
  - Do NOT modify existing tables

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 17-19, doesn't depend on them)
  - **Parallel Group**: Wave 4
  - **Blocks**: Tasks 20, 21, 22 (all depend on this schema)
  - **Blocked By**: Task 1

  **References**:
  **Pattern References**:
  - `server/db.ts` — Existing SQLite initialization and migration pattern
  - `server/db.ts:initAthenaDb()` — Table creation pattern to follow
  - `server/athena-routes.ts` — Route creation pattern with `createAthenaRoutes(db)`
  - `server/entry-registry.ts` — Entry registration pattern
  **Test References**:
  - `server/db.test.ts` — Existing DB test pattern with in-memory SQLite

  **Acceptance Criteria**:
  - [ ] `server/feature-routes.ts` exists with all 7 endpoints
  - [ ] `server/db.ts` has `runFeatureMigrations()` function
  - [ ] Server starts without errors (migrations run clean)
  - [ ] `curl http://localhost:3001/api/features/bookmarks` returns `[]` (empty, not 404)
  - [ ] `npx vitest run` passes all tests

  **QA Scenarios**:
  ```
  Scenario: Bookmarks CRUD works
    Tool: Bash (curl)
    Preconditions: Server running on port 3001
    Steps:
      1. `curl -s http://localhost:3001/api/features/bookmarks` → expect `[]`
      2. `curl -s -X POST http://localhost:3001/api/features/bookmarks -H "Content-Type: application/json" -d "{\"module\":\"sports\",\"entry_id\":\"super-bowl-iii\",\"note\":\"Key game\"}"` → expect 201 with bookmark object
      3. `curl -s http://localhost:3001/api/features/bookmarks` → expect array with 1 item
      4. Delete the bookmark by ID → expect 200
      5. `curl -s http://localhost:3001/api/features/bookmarks` → expect `[]`
    Expected Result: Full CRUD lifecycle works
    Failure Indicators: 404, 500, or data not persisting
    Evidence: .omo/evidence/task-16-bookmarks-crud.txt

  Scenario: Spaced repetition scheduling works
    Tool: Bash (curl)
    Steps:
      1. POST a review result for topic "sports" with isCorrect=true
      2. GET due reviews → assert topic appears with updated next_review date
      3. POST another review with isCorrect=false
      4. GET due reviews → assert interval was reset
    Expected Result: Interval increases on correct, resets on incorrect
    Evidence: .omo/evidence/task-16-srs-schedule.txt

  Scenario: Tables created without errors
    Tool: Bash
    Steps:
      1. Restart server and check for migration errors in console
      2. `curl -s http://localhost:3001/api/features/bookmarks` → expect 200 (not 500)
      3. `curl -s http://localhost:3001/api/features/reviews` → expect 200
      4. `curl -s http://localhost:3001/api/features/progress` → expect 200
    Expected Result: All endpoints respond 200 with empty arrays
    Evidence: .omo/evidence/task-16-tables-created.txt
  ```

  **Commit**: YES
  - Message: `feat(server): add unified DB schema and API routes for bookmarks, SRS, progress`
  - Files: `server/db.ts`, `server/feature-routes.ts`, `server/index.ts`
  - Pre-commit: `npx tsc --noEmit && npx vitest run`

- [x] 17. Add Financial Data Visualization — Line/Area Charts

  **What to do**:
  - Install `recharts` package: `npm install recharts`
  - Add a `FinancialChart` component to `src/pages/FinancialAlmanac.tsx`:
    - Line chart showing key financial metrics over time (stock indices, commodity prices)
    - X-axis: years (1970–2001), Y-axis: value
    - Tooltip on hover showing exact values
    - Toggle between different metrics (S&P 500, gold, oil, etc.)
    - Themed to match dark/light mode (use CSS variables for colors)
  - Use data from existing `src/data/finance.ts` — extract year/value pairs for charting
  - Respect URL state from Task 15 for pre-selecting chart filters

  **Must NOT do**:
  - Do NOT fetch external data for charts (use existing static data only)
  - Do NOT add complex chart interactions (zoom, pan, brush)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 16, 18, 19)
  - **Parallel Group**: Wave 4
  - **Blocks**: None
  - **Blocked By**: Task 15 (URL state hook)

  **References**:
  **Pattern References**:
  - `src/data/finance.ts` — Financial almanac data (extract chartable year/value pairs)
  - `src/pages/FinancialAlmanac.tsx` — Existing page where chart will be added
  **External References**:
  - Recharts docs: https://recharts.org/ — LineChart, AreaChart components

  **Acceptance Criteria**:
  - [ ] `recharts` in `package.json` dependencies
  - [ ] Financial Almanac page renders a line/area chart
  - [ ] Chart shows data points for at least 2 financial metrics
  - [ ] Tooltip displays values on hover
  - [ ] Chart renders correctly in both dark and light themes
  - [ ] `npx vitest run` passes all tests

  **QA Scenarios**:
  ```
  Scenario: Financial chart renders with data
    Tool: Playwright
    Steps:
      1. Navigate to `http://localhost:5173/finance`
      2. Assert a chart container (SVG or canvas) is visible
      3. Assert chart has visible data points/lines
      4. Hover over a data point
      5. Assert tooltip appears with a value
    Expected Result: Chart renders with interactive tooltips
    Evidence: .omo/evidence/task-17-finance-chart.png

  Scenario: Chart works in light theme
    Tool: Playwright
    Steps:
      1. Toggle to light theme
      2. Navigate to `/finance`
      3. Assert chart is readable (not invisible on white bg)
    Expected Result: Chart adapts to theme colors
    Evidence: .omo/evidence/task-17-finance-light.png
  ```

  **Commit**: YES
  - Message: `feat(viz): add financial data visualization with recharts`
  - Files: `src/pages/FinancialAlmanac.tsx`, `package.json`
  - Pre-commit: `npx vitest run`

- [x] 18. Add Butterfly Risk Visualization — Radar/Bar Charts

  **What to do**:
  - Add a `RiskVisualization` component to `src/pages/ButterflyCalculator.tsx`:
    - Horizontal bar chart showing risk factors (butterfly effect magnitude, detection risk, historical impact)
    - Color-coded bars (green → yellow → red based on risk level)
    - Radar/spider chart showing overall risk profile across dimensions
    - Summary score prominently displayed
  - Use recharts (already installed in Task 17)
  - Chart updates dynamically when user adjusts intervention parameters
  - Themed to match dark/light mode

  **Must NOT do**:
  - Do NOT add a complex risk simulation engine
  - Do NOT fetch external data

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 16, 17, 19)
  - **Parallel Group**: Wave 4
  - **Blocks**: None
  - **Blocked By**: Task 15 (URL state hook)

  **References**:
  **Pattern References**:
  - `src/pages/ButterflyCalculator.tsx` — Existing butterfly risk calculator page
  - `src/components/ButterflyImpact.tsx` — Existing butterfly impact component
  **External References**:
  - Recharts: BarChart, RadarChart components

  **Acceptance Criteria**:
  - [ ] Butterfly Calculator page renders a risk visualization chart
  - [ ] Chart updates when user adjusts parameters
  - [ ] Risk levels are color-coded (green/yellow/red)
  - [ ] Chart works in both themes
  - [ ] `npx vitest run` passes all tests

  **QA Scenarios**:
  ```
  Scenario: Risk chart renders and updates
    Tool: Playwright
    Steps:
      1. Navigate to `http://localhost:5173/butterfly`
      2. Assert risk visualization chart is visible
      3. Change an intervention parameter (e.g., select a different intervention)
      4. Assert chart updates with new risk values
    Expected Result: Chart renders and responds to input changes
    Evidence: .omo/evidence/task-18-butterfly-chart.png
  ```

  **Commit**: YES
  - Message: `feat(viz): add butterfly risk visualization charts`
  - Files: `src/pages/ButterflyCalculator.tsx`
  - Pre-commit: `npx vitest run`

- [x] 19. Add Data Export (JSON + CSV)

  **What to do**:
  - Add export endpoints to `server/api-v1.ts`:
    - `GET /api/v1/export/:module?format=csv` — Export a single module as CSV
    - Existing `GET /api/v1/export` already handles JSON (no change needed)
  - Create `src/lib/export.ts` utility:
    - `exportToCSV(data, filename)` — Converts array of objects to CSV and triggers download
    - `exportToJSON(data, filename)` — Triggers JSON file download
  - Add export buttons to pages with tabular data:
    - FinancialAlmanac — "Export CSV" button
    - SportsAlmanac — "Export CSV" button
    - TemporalMap — "Export JSON" button for timeline data
  - Use `Blob` + `URL.createObjectURL` for client-side download (no server needed for CSV)

  **Must NOT do**:
  - Do NOT add PDF export (too complex for this scope)
  - Do NOT add scheduled/auto exports

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 16, 17, 18)
  - **Parallel Group**: Wave 4
  - **Blocks**: None
  - **Blocked By**: Task 1

  **References**:
  **Pattern References**:
  - `server/api-v1.ts:452-471` — Existing JSON export endpoint
  - `src/pages/FinancialAlmanac.tsx` — Page where export button will be added
  - `src/pages/SportsAlmanac.tsx` — Page where export button will be added

  **Acceptance Criteria**:
  - [ ] `src/lib/export.ts` exports `exportToCSV` and `exportToJSON` functions
  - [ ] Financial Almanac has an "Export CSV" button
  - [ ] Clicking export downloads a file with correct data
  - [ ] CSV file has proper headers and comma-separated values
  - [ ] `npx vitest run` passes all tests

  **QA Scenarios**:
  ```
  Scenario: CSV export downloads correct file
    Tool: Playwright
    Steps:
      1. Navigate to `http://localhost:5173/finance`
      2. Click "Export CSV" button
      3. Assert a file download is triggered
      4. Read downloaded file content
      5. Assert first line is CSV headers, subsequent lines have data
    Expected Result: CSV file with headers and data rows
    Evidence: .omo/evidence/task-19-csv-export.txt

  Scenario: JSON export from existing endpoint
    Tool: Bash (curl)
    Steps:
      1. `curl -s http://localhost:3001/api/v1/export | head -c 500`
      2. Assert valid JSON with "modules" key
    Expected Result: JSON export still works
    Evidence: .omo/evidence/task-19-json-export.txt
  ```

  **Commit**: YES
  - Message: `feat: add data export (JSON + CSV) for knowledge modules`
  - Files: `src/lib/export.ts`, `src/pages/FinancialAlmanac.tsx`, `src/pages/SportsAlmanac.tsx`, `src/pages/TemporalMap.tsx`
  - Pre-commit: `npx vitest run`

- [x] 20. Add Bookmarking/Favorites System

  **What to do**:
  - Create `src/hooks/useBookmarks.ts`:
    - Hook that fetches bookmarks from `/api/features/bookmarks`
    - `toggleBookmark(module, entryId, note?)` — add or remove bookmark
    - `isBookmarked(module, entryId)` — check if entry is bookmarked
    - Returns bookmark list and loading state
  - Create `src/components/BookmarkButton.tsx`:
    - Bookmark icon (filled/outline) that toggles on click
    - Shows toast on bookmark add/remove (using toast from Task 9)
  - Add BookmarkButton to:
    - `RelatedEntries.tsx` — next to each entry card
    - Individual page entry cards (FinancialAlmanac, SportsAlmanac entries)
  - Wire the `B` keyboard shortcut (from Task 13) to bookmark current entry
  - Create `src/pages/Bookmarks.tsx` page listing all bookmarks with links back to entries
  - Add `/bookmarks` route to `App.tsx`

  **Must NOT do**:
  - Do NOT add bookmark folders or tags (flat list only)
  - Do NOT add bookmark sharing

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on Task 16 for API, Task 9 for toast)
  - **Parallel Group**: Wave 5
  - **Blocks**: None
  - **Blocked By**: Task 16 (bookmarks API), Task 9 (toast notifications)

  **References**:
  **API/Type References**:
  - `server/feature-routes.ts` (from Task 16) — Bookmarks CRUD endpoints
  **Pattern References**:
  - `src/hooks/useCompetency.ts` — Example hook pattern for data fetching
  - `src/components/RelatedEntries.tsx` — Where BookmarkButton will be added
  **Test References**:
  - `src/hooks/useCompetency.test.ts` — Hook test pattern

  **Acceptance Criteria**:
  - [ ] `src/hooks/useBookmarks.ts` exists with toggle and check functions
  - [ ] `src/components/BookmarkButton.tsx` renders bookmark icon
  - [ ] Clicking bookmark on an entry persists to server and shows toast
  - [ ] `/bookmarks` page lists all saved bookmarks with links
  - [ ] `npx vitest run` passes all tests

  **QA Scenarios**:
  ```
  Scenario: Bookmark an entry and verify persistence
    Tool: Playwright
    Steps:
      1. Navigate to `http://localhost:5173/sports`
      2. Click the bookmark icon on a sports entry
      3. Assert toast notification "Bookmarked" appears
      4. Navigate to `http://localhost:5173/bookmarks`
      5. Assert the bookmarked entry appears in the list
      6. Click the entry link → assert it navigates back to the entry
    Expected Result: Bookmark persists and appears on bookmarks page
    Evidence: .omo/evidence/task-20-bookmark-persist.png

  Scenario: Remove a bookmark
    Tool: Playwright
    Steps:
      1. Navigate to the bookmarked entry
      2. Click the bookmark icon again (now filled)
      3. Assert toast "Bookmark removed" appears
      4. Navigate to `/bookmarks` → assert entry is gone
    Expected Result: Bookmark removed from list
    Evidence: .omo/evidence/task-20-bookmark-remove.png
  ```

  **Commit**: YES
  - Message: `feat: add bookmarking/favorites system with persistence`
  - Files: `src/hooks/useBookmarks.ts`, `src/components/BookmarkButton.tsx`, `src/pages/Bookmarks.tsx`, `src/App.tsx`, `src/components/RelatedEntries.tsx`
  - Pre-commit: `npx vitest run`

- [x] 21. Add Spaced Repetition Scheduling (Basic Intervals)

  **What to do**:
  - Create `src/hooks/useSpacedRepetition.ts`:
    - Fetches due reviews from `/api/features/reviews`
    - `submitReview(topic, isCorrect)` — POSTs result, backend adjusts interval:
      - Correct: `interval_days *= 2.0`, `next_review = today + interval_days`
      - Incorrect: `interval_days = 1`, `next_review = tomorrow`
    - `getDueReviews()` — returns items where `next_review <= today`
    - Returns due count, review history, and submit function
  - Create `src/components/ReviewSession.tsx`:
    - Shows due review cards one at a time
    - User marks "Got it" or "Missed it"
    - Tracks session progress (X reviewed, Y correct)
  - Add a "Review Due" indicator on the dashboard (card or badge) linking to review session
  - Add `/review` route in `App.tsx` for the review session page
  - Wire the `evaluateAnswer` tool in the chat system to also create/update spaced repetition entries (so quiz performance feeds into the SRS)

  **Must NOT do**:
  - Do NOT implement full SM-2 algorithm (ease factor, super-memos)
  - Do NOT add card creation UI (reviews are auto-created from quiz performance)
  - Do NOT add review scheduling configuration

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on Task 16 for API)
  - **Parallel Group**: Wave 5
  - **Blocks**: None
  - **Blocked By**: Task 16 (reviews API)

  **References**:
  **API/Type References**:
  - `server/feature-routes.ts` (from Task 16) — Reviews endpoints: `GET /api/features/reviews`, `POST /api/features/reviews`
  **Pattern References**:
  - `src/hooks/useCompetency.ts` — Existing competency tracking hook (similar pattern)
  - `src/pages/Quiz.tsx` — Quiz page where evaluateAnswer is called (wire SRS integration)
  - `server/index.ts:301-313` — `evaluateAnswer` tool definition (add SRS side effect here)
  **Test References**:
  - `src/hooks/useCompetency.test.ts` — Hook test pattern

  **Acceptance Criteria**:
  - [ ] `src/hooks/useSpacedRepetition.ts` exists with `submitReview` and `getDueReviews`
  - [ ] `src/components/ReviewSession.tsx` renders due review cards
  - [ ] Correct answer doubles interval; incorrect resets to 1 day
  - [ ] `/review` route shows review session
  - [ ] Dashboard shows "Review Due" indicator when reviews are pending
  - [ ] `npx vitest run` passes all tests

  **QA Scenarios**:
  ```
  Scenario: Review session tracks correct/incorrect
    Tool: Playwright
    Steps:
      1. Ensure at least 1 review is due (POST to /api/features/reviews with past next_review)
      2. Navigate to `http://localhost:5173/review`
      3. Assert review card is shown with topic name
      4. Click "Got it"
      5. Assert progress counter updates (1 reviewed, 1 correct)
    Expected Result: Review session records correct answer and advances
    Evidence: .omo/evidence/task-21-review-correct.png

  Scenario: Incorrect answer resets interval
    Tool: Bash (curl)
    Steps:
      1. POST review with isCorrect=false for topic "test-topic"
      2. GET /api/features/reviews
      3. Assert interval_days is 1 for "test-topic"
    Expected Result: Interval reset to 1 day
    Evidence: .omo/evidence/task-21-interval-reset.txt
  ```

  **Commit**: YES
  - Message: `feat: add spaced repetition scheduling with basic interval tracking`
  - Files: `src/hooks/useSpacedRepetition.ts`, `src/components/ReviewSession.tsx`, `src/App.tsx`, `server/index.ts`
  - Pre-commit: `npx vitest run`

- [x] 22. Add Progress Tracking Dashboard

  **What to do**:
  - Create `src/hooks/useProgress.ts`:
    - Fetches progress from `/api/features/progress`
    - `updateProgress(module, entriesViewed, totalEntries)` — updates after page visits
    - Returns per-module progress and overall completion percentage
  - Create `src/pages/Progress.tsx`:
    - Grid of progress cards for each module (Sports, Finance, Era, Disasters, Tech, Medical, Safety, Blueprints)
    - Each card shows: module name, entries viewed / total, percentage bar, quiz score
    - Overall completion percentage at the top
    - Uses recharts (from Task 17) for a small progress donut/ring chart
  - Track page visits: when user views an entry, call `updateProgress` to increment `entries_viewed`
  - Add `/progress` route in `App.tsx`
  - Add "Progress" link in navigation

  **Must NOT do**:
  - Do NOT add achievements or badges (just progress tracking)
  - Do NOT add streak tracking or time-based metrics

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on Task 16 for API)
  - **Parallel Group**: Wave 5
  - **Blocks**: None
  - **Blocked By**: Task 16 (progress API)

  **References**:
  **API/Type References**:
  - `server/feature-routes.ts` (from Task 16) — Progress endpoints
  **Pattern References**:
  - `src/pages/BootstrapBlueprints.tsx` — Example page with progress-style UI
  - Dashboard card grid in `src/App.tsx:37-169` — Card layout pattern for progress page

  **Acceptance Criteria**:
  - [ ] `src/hooks/useProgress.ts` exists with progress fetching and updating
  - [ ] `src/pages/Progress.tsx` renders progress cards for all 8 modules
  - [ ] Each card shows entries viewed / total with a progress bar
  - [ ] Overall completion percentage is displayed
  - [ ] `/progress` route is accessible and linked from nav
  - [ ] `npx vitest run` passes all tests

  **QA Scenarios**:
  ```
  Scenario: Progress page shows module cards
    Tool: Playwright
    Steps:
      1. Navigate to `http://localhost:5173/progress`
      2. Assert 8 module progress cards are visible
      3. Assert each card has a module name and progress indicator
      4. Assert overall completion percentage is displayed
    Expected Result: Progress dashboard with all 8 modules
    Evidence: .omo/evidence/task-22-progress-page.png

  Scenario: Progress updates on entry view
    Tool: Bash (curl) + Playwright
    Steps:
      1. `curl -s http://localhost:3001/api/features/progress` → note current values
      2. Navigate to a knowledge page, view an entry
      3. `curl -s http://localhost:3001/api/features/progress` → assert entries_viewed incremented
    Expected Result: Viewing entries updates progress tracking
    Evidence: .omo/evidence/task-22-progress-update.txt
  ```

  **Commit**: YES
  - Message: `feat: add progress tracking dashboard with module completion`
  - Files: `src/hooks/useProgress.ts`, `src/pages/Progress.tsx`, `src/App.tsx`
  - Pre-commit: `npx vitest run`

- [x] 23. Add PWA Support — Manifest + Icons + Service Worker

  **What to do**:
  - Install vite-plugin-pwa: `npm install -D vite-plugin-pwa`
  - Create `public/pwa-icon-192.png` and `public/pwa-icon-512.png` (simple clock/time machine icons)
  - Configure `vite-plugin-pwa` in `vite.config.ts`:
    - `registerType: 'autoUpdate'` — auto-update service worker
    - `manifest` with app name "Time Traveler's Guide", short_name "TTG", theme colors
    - `workbox.runtimeCaching` for `/api/v1/` responses (cache-first with 1 hour expiry)
    - `devOptions.enabled: false` — disabled in dev mode to avoid HMR conflicts
  - Add `<link rel="manifest">` to `index.html` (plugin handles this automatically)
  - Verify Lighthouse PWA score ≥ 80

  **Must NOT do**:
  - Do NOT implement offline LLM streaming (impossible without local model)
  - Do NOT cache streaming chat responses
  - Do NOT enable service worker in development mode

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 20-22)
  - **Parallel Group**: Wave 5
  - **Blocks**: None
  - **Blocked By**: Task 1

  **References**:
  **Pattern References**:
  - `vite.config.ts` — Where PWA plugin configuration goes
  - `public/favicon.svg` — Existing favicon (reference for icon style)
  **External References**:
  - vite-plugin-pwa docs: https://vite-pwa-org.netlify.app/ — Configuration options

  **Acceptance Criteria**:
  - [ ] `vite-plugin-pwa` in devDependencies
  - [ ] `vite.config.ts` has PWA plugin configured with manifest
  - [ ] `public/pwa-icon-192.png` and `public/pwa-icon-512.png` exist
  - [ ] Build produces a service worker: `dist/sw.js` exists after `npm run build`
  - [ ] Service worker is NOT active in dev mode (`npm run dev:frontend`)
  - [ ] `npm run build` succeeds

  **QA Scenarios**:
  ```
  Scenario: PWA manifest is valid
    Tool: Bash
    Steps:
      1. Run `npm run build`
      2. Check `dist/manifest.webmanifest` exists
      3. Parse it and verify: name, short_name, icons array with 192 and 512 sizes
    Expected Result: Valid web manifest with icons
    Failure Indicators: No manifest file, or missing required fields
    Evidence: .omo/evidence/task-23-pwa-manifest.txt

  Scenario: Service worker not active in dev
    Tool: Playwright
    Steps:
      1. Start dev server: `npm run dev:frontend`
      2. Navigate to app
      3. Check `navigator.serviceWorker.controller` — should be null in dev
    Expected Result: No service worker in dev mode
    Evidence: .omo/evidence/task-23-no-sw-dev.txt
  ```

  **Commit**: YES
  - Message: `feat: add PWA support with manifest, icons, and service worker`
  - Files: `vite.config.ts`, `public/pwa-icon-192.png`, `public/pwa-icon-512.png`, `package.json`
  - Pre-commit: `npm run build`

- [x] 24. Add Tests for 7 Untested Pages

  **What to do**:
  - Write test files for the following pages that currently have no tests:
    - `src/pages/SafetyProtocols.test.tsx` — renders safety protocols, filter/search works
    - `src/pages/DisasterPrevention.test.tsx` — renders disaster entries, era filtering
    - `src/pages/TechTransfer.test.tsx` — renders tech transfer targets, category filtering
    - `src/pages/MedicalInterventions.test.tsx` — renders medical entries, risk level display
    - `src/pages/FinancialAlmanac.test.tsx` — renders financial data, chart renders (mock recharts)
    - `src/pages/SportsAlmanac.test.tsx` — renders sports entries, search filtering
    - `src/pages/EraGuide.test.tsx` — renders era guide data, era selection
  - Follow existing test patterns from `TemporalMap.test.tsx`, `BootstrapBlueprints.test.tsx`
  - Each test file should cover: renders without crashing, displays expected content, basic user interactions
  - Use happy-dom environment and testing-library (same as existing tests)

  **Must NOT do**:
  - Do NOT modify existing test files
  - Do NOT add E2E tests (that's Task 27)
  - Do NOT test recharts internals (mock them)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 25, 26, 27)
  - **Parallel Group**: Wave 6
  - **Blocks**: None
  - **Blocked By**: All feature tasks (tests must test the final state)

  **References**:
  **Test References**:
  - `src/pages/TemporalMap.test.tsx` — Example page test with user interactions
  - `src/pages/BootstrapBlueprints.test.tsx` — Example page test with filtering
  - `src/pages/ButterflyCalculator.test.tsx` — Example page test
  **Pattern References**:
  - `src/pages/SafetyProtocols.tsx` — Page to test
  - `src/pages/DisasterPrevention.tsx` — Page to test
  - `src/pages/TechTransfer.tsx` — Page to test
  - `src/pages/MedicalInterventions.tsx` — Page to test
  - `src/pages/FinancialAlmanac.tsx` — Page to test (now with charts)
  - `src/pages/SportsAlmanac.tsx` — Page to test
  - `src/pages/EraGuide.tsx` — Page to test

  **Acceptance Criteria**:
  - [ ] All 7 new test files exist
  - [ ] `npx vitest run` passes with ≥ 101 + new test count
  - [ ] Each test file has at least 2 tests (renders, basic interaction)
  - [ ] No test imports real API calls (all mocked)

  **QA Scenarios**:
  ```
  Scenario: All page tests pass
    Tool: Bash
    Steps:
      1. Run `npx vitest run`
      2. Assert 0 failures
      3. Assert test count increased from baseline (≥ 101 + ~21 new)
    Expected Result: All tests pass, new tests contribute to count
    Evidence: .omo/evidence/task-24-page-tests.txt
  ```

  **Commit**: YES
  - Message: `test: add tests for 7 untested pages`
  - Files: 7 new test files in `src/pages/`
  - Pre-commit: `npx vitest run`

- [x] 25. Add Quiz Page Tests (LLM Stream Mocking)

  **What to do**:
  - Write `src/pages/Quiz.test.tsx`:
    - Mock the chat API endpoint to avoid real LLM calls during tests
    - Test: renders quiz page with era/category selectors
    - Test: selecting era and category updates the UI
    - Test: sending a message displays it in the chat
    - Test: mock streaming response renders correctly
    - Test: evaluateAnswer tool call tracking
  - Use MSW (mock service worker) or simple fetch mock to intercept `/api/chat` calls
  - Follow patterns from `ChatAboutThis.test.tsx` for mocking AI responses

  **Must NOT do**:
  - Do NOT make real API calls to LLM providers in tests
  - Do NOT test AI response quality (only test UI behavior)

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 24, 26, 27)
  - **Parallel Group**: Wave 6
  - **Blocks**: None
  - **Blocked By**: All feature tasks

  **References**:
  **Test References**:
  - `src/components/ChatAboutThis.test.tsx` — Example of mocking chat API
  **Pattern References**:
  - `src/pages/Quiz.tsx` — Page to test
  - `server/index.ts:164-384` — Chat endpoint structure (for mocking)

  **Acceptance Criteria**:
  - [ ] `src/pages/Quiz.test.tsx` exists
  - [ ] Tests pass with mocked API responses (no real LLM calls)
  - [ ] At least 3 tests covering rendering, interaction, and mock response
  - [ ] `npx vitest run` passes all tests

  **QA Scenarios**:
  ```
  Scenario: Quiz tests pass without real API
    Tool: Bash
    Steps:
      1. Disconnect network (or ensure no API keys in env)
      2. Run `npx vitest run src/pages/Quiz.test.tsx`
      3. Assert all tests pass
    Expected Result: Tests pass with mocked responses only
    Evidence: .omo/evidence/task-25-quiz-tests.txt
  ```

  **Commit**: YES
  - Message: `test: add quiz page tests with LLM stream mocking`
  - Files: `src/pages/Quiz.test.tsx`
  - Pre-commit: `npx vitest run`

- [x] 26. Add Zod Validation Schema Tests

  **What to do**:
  - Write `server/schemas.test.ts`:
    - Test `IngestSchema`: valid input passes, invalid module rejected, missing id rejected
    - Test `FetchSchema`: valid wikipedia/wikidata passes, invalid source rejected, empty query rejected
    - Test `ExploreSchema`: valid query passes, empty query rejected
    - Test `BatchSchema`: valid array passes, empty array rejected, >10 items rejected
    - Test `RestoreSchema`: valid ingested object passes, missing field rejected
  - Test both success and failure cases for each schema

  **Must NOT do**:
  - Do NOT test API route handlers (only schemas)
  - Do NOT modify existing test files

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 24, 25, 27)
  - **Parallel Group**: Wave 6
  - **Blocks**: None
  - **Blocked By**: Task 4 (schemas must exist)

  **References**:
  **Test References**:
  - `server/db.test.ts` — Server-side test pattern
  - `server/athena-routes.test.ts` — Route test pattern with supertest
  **Pattern References**:
  - `server/schemas.ts` (from Task 4) — Zod schemas to test

  **Acceptance Criteria**:
  - [ ] `server/schemas.test.ts` exists
  - [ ] Each schema has at least 2 tests (valid + invalid)
  - [ ] `npx vitest run` passes all tests

  **QA Scenarios**:
  ```
  Scenario: Schema validation tests cover edge cases
    Tool: Bash
    Steps:
      1. Run `npx vitest run server/schemas.test.ts`
      2. Assert ≥ 10 tests pass (2+ per schema × 5 schemas)
    Expected Result: All schema validation tests pass
    Evidence: .omo/evidence/task-26-schema-tests.txt
  ```

  **Commit**: YES
  - Message: `test: add Zod validation schema tests`
  - Files: `server/schemas.test.ts`
  - Pre-commit: `npx vitest run`

- [x] 27. Add E2E Test Setup (Playwright) + Critical Path Tests

  **What to do**:
  - Install Playwright: `npm install -D @playwright/test`
  - Create `playwright.config.ts`:
    - Base URL: `http://localhost:5173`
    - Web server: start command `npm run dev`, timeout 30s
    - Browser: chromium only (for speed)
    - Test dir: `e2e/`
  - Create `e2e/smoke.spec.ts` with critical path tests:
    1. **Navigation**: Click through all 11 module cards from dashboard, verify each page loads
    2. **Search**: Open search (Ctrl+K), type "chernobyl", verify results appear, click result
    3. **Companion**: Open companion selector, switch companion, verify change persists
    4. **Bookmark**: Bookmark an entry, verify it appears on bookmarks page
    5. **Theme**: Toggle theme, verify change, reload, verify persistence
  - Add `"test:e2e": "playwright test"` to `package.json` scripts
  - Create `e2e/fixtures.ts` with shared test utilities (login if needed, navigation helpers)

  **Must NOT do**:
  - Do NOT write more than 5 E2E test scenarios
  - Do NOT test LLM chat responses in E2E (too flaky)
  - Do NOT add visual regression testing

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: [`playwright`]
    - `playwright`: Browser automation for E2E testing

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 24, 25, 26)
  - **Parallel Group**: Wave 6
  - **Blocks**: None
  - **Blocked By**: All feature tasks (E2E tests the final product)

  **References**:
  **External References**:
  - Playwright docs: https://playwright.dev/ — Configuration and test patterns
  **Pattern References**:
  - `src/App.tsx` — App layout and routes for navigation testing

  **Acceptance Criteria**:
  - [ ] `playwright.config.ts` exists
  - [ ] `e2e/smoke.spec.ts` exists with 5 test scenarios
  - [ ] `npx playwright test` passes all E2E tests
  - [ ] `package.json` has `test:e2e` script

  **QA Scenarios**:
  ```
  Scenario: E2E smoke tests pass
    Tool: Bash
    Steps:
      1. Run `npx playwright test e2e/smoke.spec.ts`
      2. Assert all 5 scenarios pass
      3. Assert HTML report is generated
    Expected Result: 5/5 E2E tests pass
    Failure Indicators: Any test times out or fails
    Evidence: .omo/evidence/task-27-e2e-results.txt
  ```

  **Commit**: YES
  - Message: `test: add Playwright E2E test setup with critical path tests`
  - Files: `playwright.config.ts`, `e2e/smoke.spec.ts`, `e2e/fixtures.ts`, `package.json`
  - Pre-commit: `npx vitest run`

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.
> Never mark F1-F4 as checked before getting user's okay.

- [x] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, curl endpoint, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .omo/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [x] F2. **Code Quality Review** — `unspecified-high`
  Run `tsc --noEmit` + linter + `vitest run`. Review all changed files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names (data/result/item/temp).
  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Tests [N pass/N fail] | Files [N clean/N issues] | VERDICT`

- [x] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
  Start from clean state. Execute EVERY QA scenario from EVERY task — follow exact steps, capture evidence. Test cross-task integration (features working together, not isolation). Test edge cases: empty state, invalid input, rapid actions. Save to `.omo/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [x] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff (git log/diff). Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance. Detect cross-task contamination: Task N touching Task M's files. Flag unaccounted changes.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

- **Task 1**: `chore: initialize git repository` - .gitignore, initial commit
- **Tasks 3-6**: `fix(server): code quality improvements` - api-v1.ts, validation, logging
- **Tasks 7-15**: `feat(ux): add [feature]` - per-feature commits
- **Tasks 16**: `feat(server): unified DB schema for new features` - db.ts schema
- **Tasks 17-23**: `feat: add [feature]` - per-feature commits
- **Tasks 24-27**: `test: add tests for [scope]` - per-test-file commits
- Each commit: `npm run build && npx vitest run` must pass first

---

## Success Criteria

### Verification Commands
```bash
npx tsc --noEmit        # Expected: 0 errors
npx vitest run          # Expected: ≥ 101 tests passing
npm run build           # Expected: successful build
npm run lint            # Expected: 0 errors
```

### Final Checklist
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] All tests pass (≥ 101 baseline + new tests)
- [ ] Git history is clean with meaningful commits
- [ ] Mobile navigation works on small screens
- [ ] Error boundary catches React crashes
- [ ] Toast notifications appear for user actions
- [ ] Theme toggle switches between dark and light
- [ ] Data visualization renders on Financial and Butterfly pages
- [ ] Bookmarks persist across page navigation
- [ ] Spaced repetition tracks review intervals
- [ ] PWA manifest and service worker are valid
- [ ] E2E tests cover critical user paths
