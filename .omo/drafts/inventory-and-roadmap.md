# Draft: Project Inventory & Enhancement Roadmap

## Project Overview
**Back to the Future** — "Time Traveler's Guide" — an interactive educational platform themed around time travel preparation (1950s–2001). Built with React + Vite + TypeScript frontend, Express + SQLite + AI SDK backend.

## Current State

### Health Check
- **TypeScript**: Clean compile (0 errors)
- **Tests**: 101/101 passing across 22 test files
- **Lint**: Configured (eslint)
- **Build**: Working (vite + tsc)

---

## WHAT EXISTS (Inventory)

### Frontend (React 19 + Vite 8 + Tailwind 4 + shadcn/ui)
- **11 pages** (all lazy-loaded):
  1. Dashboard (home)
  2. Sports Almanac
  3. Financial Almanac
  4. Era Integration Guide
  5. Disaster Prevention
  6. Tech Transfer
  7. Medical Interventions
  8. Butterfly Risk Calculator
  9. Safety & Dead Drops
  10. Quiz (LLM-powered)
  11. Temporal Strategy Map
  12. Bootstrap Blueprints

- **8 custom components**:
  - AthenaCommentary, AthenaQuizReaction, ButterflyImpact
  - ChatAboutThis, CompanionThought
  - PalaceHook, PalaceLink, RelatedEntries

- **6 shadcn/ui components**: accordion, button, card, input, table, tabs

- **Hooks**: useCompetency
- **Context**: CompanionContext (multi-companion system)
- **Lib**: blueprints, eraExpansion, inflation, search, utils
- **Data**: 50+ knowledge module files, companions, athena-static.json

### Backend (Express 5 + SQLite + Vercel AI SDK 6)
- **5 LLM providers**: Google Gemini, DeepSeek, Zhipu, MiniMax, OpenRouter
- **3-tier AI training system**:
  - Tier 1: Factual recall with spaced repetition + evaluateAnswer tool
  - Tier 2: Situational judgment with Suspicion Meter
  - Tier 3: Dungeon Master interactive fiction with session notes + NPCs
- **REST API v1**: Full CRUD, federated search, Wikipedia/Wikidata integration
- **Knowledge generation**: Scripts to precompute and generate knowledge base
- **Companion system**: Configurable AI companions with provider fallback chain
- **Palace Link**: Cross-topic memory synthesis endpoint
- **SQLite**: Session persistence, entry registry, quiz reactions

### Test Infrastructure
- Vitest 4 + happy-dom + testing-library + supertest
- 22 test files, 101 tests
- Coverage: server routes, DB, entry registry, search, inflation, blueprints, era expansion, components, hooks

---

## WHAT'S MISSING (Gaps & Opportunities)

### Critical Infrastructure
1. **No git repo** — not initialized
2. **No CI/CD** — no GitHub Actions, no automated testing pipeline
3. **No deployment config** — no Docker, no cloud setup
4. **No auth system** — optional API key only, no user accounts

### UX Gaps
5. **No mobile navigation** — nav hidden on small screens (`hidden lg:flex`)
6. **No responsive mobile experience** — dashboard cards may overflow
7. **No print CSS** — print button exists but no @media print styles
8. **No error boundary** — React crashes would be unhandled
9. **No loading skeletons** — only generic "Loading module..." text
10. **No keyboard shortcuts** — only Ctrl+K for search
11. **No 404 page** — no catch-all route
12. **No toast/notification system** — no feedback for user actions

### Feature Opportunities
13. **Data visualization** — no charts for financial data, timeline, butterfly scores
14. **Progressive Web App** — no offline support, no service worker
15. **URL state management** — filters/selections not persisted to URL params
16. **Real-time collaboration** — no WebSocket for shared sessions
17. **Data export formats** — API has JSON but no CSV/PDF export for offline study
18. **Bookmarking/favorites** — no way to save entries for quick access
19. **Spaced repetition algorithm** — useCompetency exists but no real SRS scheduling
20. **Achievement/gamification system** — no progress tracking or badges
21. **Timeline visualization** — TemporalMap exists but could use interactive D3/chart

### Backend Gaps
22. **No rate limiting** — API endpoints unprotected from abuse
23. **No request validation (Zod)** — Zod is a dependency but not used on API routes
24. **No request logging** — no structured logging middleware
25. **No health monitoring** — basic /health exists but no metrics
26. **No caching headers** — no HTTP caching for static knowledge data
27. **No WebSocket** — streaming is one-way (SSE-like)

### Code Quality
28. **Missing page tests** — 7 pages have no tests (Quiz, SafetyProtocols, DisasterPrevention, TechTransfer, MedicalInterventions, FinancialAlmanac, SportsAlmanac)
29. **No E2E tests** — only unit/integration
30. **`as any` usage** — API routes use `any` extensively
31. **Duplicate export routes** — api-v1.ts has duplicate GET /export handlers
32. **No error boundary tests** — no test for crash recovery

### Polish & Performance
33. **No image optimization** — no lazy loading, no WebP
34. **No bundle analysis** — no size tracking
35. **No code-splitting strategy** — pages are lazy but data modules are not
36. **No dark/light toggle** — dark theme only (by design?)

---

## Research Findings

### Tech Stack Assessment
- Stack is modern and well-chosen (React 19, Vite 8, AI SDK 6, Express 5, Zod 4)
- shadcn/ui base-nova style provides good foundation
- Tailwind 4 with CSS-first config is latest approach
- SQLite is appropriate for single-server knowledge store

### Patterns Observed
- Lazy loading pattern is well-implemented
- Companion system is extensible (custom companions via prompt)
- Knowledge base architecture is modular (era → category → subcategory)
- API v1 is RESTful with proper OpenAPI spec and Swagger UI

---

## User Decisions (Confirmed)
- **Priority**: Full roadmap — address all gaps systematically
- **Deployment**: Personal / localhost only
- **Theme**: Let the plan decide (dark-only is acceptable, add light if it makes sense)

## Deprioritized (Personal/localhost)
- User auth system (API key is sufficient)
- Rate limiting (single user)
- Deployment config / Docker / cloud
- CI/CD pipeline (git init still valuable)

## Test Strategy Decision
- **Infrastructure exists**: YES (vitest 4, happy-dom, testing-library, supertest)
- **Automated tests**: YES (tests-after — build first, test later)
- **Agent-Executed QA**: ALWAYS (mandatory for all tasks)

## Architectural Decisions (from Metis Consultation)
- Phase the work sequentially: Git → Code Quality → UX Polish → Features → Tests
- Design unified DB schema (spaced repetition + bookmarks + progress) BEFORE any feature tasks
- PWA scope: manifest + icons + service worker (static assets cache only, disabled in dev)
- Spaced repetition: basic interval tracking (no full SM-2 algorithm)
- Keyboard shortcuts: 3-5 specific shortcuts only, no registry/help modal
- Theme toggle: CSS variable swap on `<html>` only, no per-component changes
- Print CSS: must come AFTER theme toggle (override dark variables for print)
- `as any` fixes: isolated from feature work, cap to non-provider code
- Loading skeletons: specify which pages/components in task
- Toast events: specify which triggers in task
- Data visualization: specific chart type + data source + page location per task
- E2E flows: specific list of 3-8 user flows

## Non-Blocking Optional Input
- Which features user is most excited about (doesn't gate planning — all included)

## Scope Boundaries
- INCLUDE: UX polish, feature additions, test coverage, code quality, git setup, theme decision
- EXCLUDE: Multi-user auth, deployment infrastructure, CI/CD pipeline
