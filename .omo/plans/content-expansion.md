# Content Expansion: Sports, World, Places to Live, Places to Visit

## TL;DR

> **Quick Summary**: Expand the Time Traveler's Guide content with international + deeper sports, a new world events module, a relocation guide (places to live), and a temporal tourism guide (places to visit). Four new data modules + one extended module + four new pages.
>
> **Deliverables**:
> - Extended `src/data/sports.ts` — international sports (World Cup, Olympics, F1, tennis) + depth (player stats, venues)
> - New `src/data/world-events.ts` — geopolitical/economic/cultural events by region per decade
> - New `src/data/places-to-live.ts` — cost of living, quality of life, politics by city/decade
> - New `src/data/places-to-visit.ts` — tourist destinations, world's fairs, concerts, natural wonders per era
> - 4 new pages with filter/search
> - Updated search + navigation
>
> **Estimated Effort**: Medium (12 implementation tasks + 4 final verification)
> **Parallel Execution**: YES — 4 waves
> **Critical Path**: Data files → Pages → Tests → F1-F4
> **Test Strategy**: Tests-after for content/UI, TDD for any logic-heavy code (search, filters)

---

## Context

### Original Request
"let's continue to add more things, evaluate and see better sports things and also work about different parts of the world, ideal places to live in each decade etc. where to travel to specifically"

### Interview Summary

**Key Decisions**:
- **Sports (1c)**: Go global AND go deeper — add World Cup, Olympics, cricket, rugby, tennis Grand Slams, F1; add depth to existing US sports (player stats, venue info)
- **World (2b)**: NEW module — world events by region per decade (geopolitical shifts, economic miracles, cultural movements)
- **Places to live (3c)**: NEW relocation guide — economics, politics, culture, housing by city/decade
- **Places to visit (4c)**: NEW temporal tourism guide — destinations, world's fairs, concerts, natural wonders per era

**Current State**:
- 214 tests pass, 0 tsc errors
- Existing data: sports (739 lines, US-only), finance, era-guide, disasters, tech-transfer, medical, safety, blueprints, engineering
- Existing lazy loader: `src/data/loader.ts` with 9 load functions
- Existing search: `src/lib/search.ts` (async, supports all data)
- Existing page patterns: card grids, search, filters (e.g., CompanionGallery, Progress)

### Metis Review

**Identified Gaps** (addressed):
- New data modules need to follow the same TS interface pattern as existing ones for search integration
- Each new page should support filtering by decade + region/category
- Lazy loading must be extended for the 4 new data sources
- Navigation needs 4 new routes added
- Search index must include the 4 new data types
- Existing tests (sports.test.tsx, etc.) must keep passing after sports.ts extension

---

## Work Objectives

### Core Objective
Add four rich content areas to the Time Traveler's Guide: enhanced sports (global + depth), world events, places to live, and places to visit. Each gets its own data module, lazy loader, and page with filtering.

### Concrete Deliverables

**Wave 1 — Data (4 tasks, all parallel)**
- Extend `src/data/sports.ts` with international sports + new fields
- New `src/data/world-events.ts` (~300-500 lines)
- New `src/data/places-to-live.ts` (~300-500 lines)
- New `src/data/places-to-visit.ts` (~300-500 lines)

**Wave 2 — Loaders (4 tasks, all parallel)**
- Extend `src/data/loader.ts` with 4 new load functions
- Update `src/lib/search.ts` to include new data types

**Wave 3 — Pages (4 tasks, all parallel)**
- Extend `src/pages/SportsAlmanac.tsx` with international/region filter
- New `src/pages/WorldEvents.tsx` — `/world-events` route
- New `src/pages/PlacesToLive.tsx` — `/places-to-live` route
- New `src/pages/PlacesToVisit.tsx` — `/places-to-visit` route

**Wave 4 — Integration (3 tasks)**
- Update `src/App.tsx` — add 4 new routes + nav links
- Update `src/components/MobileNav.tsx` — add 4 new mobile nav links
- Add tests for new pages and search integration

**Final Wave — F1-F4**
- Plan compliance, code quality, manual QA, scope fidelity

### Definition of Done
- [ ] `npx tsc --noEmit` → 0 errors
- [ ] `npx vitest run` → 214+ tests pass (baseline + new content tests)
- [ ] `npx vite build` → succeeds
- [ ] `node scripts/check-bundle-size.mjs` → passes
- [ ] All 4 new data modules lazy-loaded (no bundle bloat)
- [ ] All 4 new pages accessible via search

### Must Have
- International sports coverage (at least 5 sports: World Cup, Olympics, F1, tennis, cricket)
- World events data spanning 1970s-2001 across at least 3 regions (Americas, Europe, Asia)
- Places-to-live data with at least 5 cities per decade
- Places-to-visit data with at least 5 destinations per decade
- Search works across all 4 new data types
- All new pages lazy-loaded via existing pattern
- No regressions in existing 214 tests

### Must NOT Have (Guardrails)
- No breaking changes to existing data interfaces (extend, don't break)
- No new top-level dependencies
- No cloud sync / user accounts
- No changes to LLM provider logic
- No removal of existing content
- No changes to existing routes (only additions)

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: YES (vitest 4, happy-dom, testing-library, supertest, axe-core)
- **Automated tests**: YES — Tests-after for content pages (they're display-heavy, hard to TDD); TDD for search/filter logic
- **New test files**: Each new page gets a test file following existing patterns
- **Existing tests**: Must continue to pass (214 baseline)

### QA Policy
- Use Playwright to verify each new page loads and filtering works
- Verify search returns results across all 4 new data types
- Verify navigation includes all 4 new routes
- Save evidence to `.omo/evidence/content-expansion/`

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Data - 4 tasks, all parallel):
├── T1: Extend sports.ts with international + depth [unspecified-high]
├── T2: Create world-events.ts [unspecified-high]
├── T3: Create places-to-live.ts [unspecified-high]
└── T4: Create places-to-visit.ts [unspecified-high]

Wave 2 (Loaders - 4 tasks, all parallel after T1-T4):
├── T5: Extend loader.ts with 4 new load functions [quick]
├── T6: Update search.ts to include new data types [unspecified-high]
├── T7: Add TypeScript types for new data shapes [quick]
└── T8: Add content expansion to athena-preferences [quick]

Wave 3 (Pages - 4 tasks, all parallel after T5-T6):
├── T9:  Extend SportsAlmanac with international/region filter [visual-engineering]
├── T10: Create WorldEvents page + /world-events route [visual-engineering]
├── T11: Create PlacesToLive page + /places-to-live route [visual-engineering]
└── T12: Create PlacesToVisit page + /places-to-visit route [visual-engineering]

Wave 4 (Integration - 3 tasks, after T9-T12):
├── T13: Update App.tsx with 4 new routes + nav [quick]
├── T14: Update MobileNav with 4 new links [quick]
└── T15: Add tests for new pages + search [unspecified-high]

Wave FINAL (After ALL tasks — 4 parallel reviews):
├── F1: Plan Compliance Audit [oracle]
├── F2: Code Quality Review [unspecified-high]
├── F3: Real Manual QA [unspecified-high + playwright]
└── F4: Scope Fidelity Check [deep]

Critical Path: T1-T4 → T5-T6 → T9-T12 → T13-T15 → F1-F4
Parallel Speedup: ~50% faster than sequential
Max Concurrent: 4 (Waves 1, 2, 3)
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|-----------|--------|------|
| T1 | — | T5, T6, T9, T15 | 1 |
| T2 | — | T5, T6, T10, T15 | 1 |
| T3 | — | T5, T6, T11, T15 | 1 |
| T4 | — | T5, T6, T12, T15 | 1 |
| T5 | T1, T2, T3, T4 | T9, T10, T11, T12 | 2 |
| T6 | T1, T2, T3, T4 | T9, T10, T11, T12, T15 | 2 |
| T7 | T1, T2, T3, T4 | T9, T10, T11, T12 | 2 |
| T8 | — | T9, T10, T11, T12 | 2 |
| T9 | T5, T6 | T13 | 3 |
| T10 | T5, T6 | T13 | 3 |
| T11 | T5, T6 | T13 | 3 |
| T12 | T5, T6 | T13 | 3 |
| T13 | T9, T10, T11, T12 | — | 4 |
| T14 | T13 | — | 4 |
| T15 | T1, T2, T3, T4, T6 | — | 4 |

### Agent Dispatch Summary
- **Wave 1**: 4 — T1-T4 → `unspecified-high` (content data work)
- **Wave 2**: 4 — T5, T7, T8 → `quick`; T6 → `unspecified-high`
- **Wave 3**: 4 — T9-T12 → `visual-engineering`
- **Wave 4**: 3 — T13, T14 → `quick`; T15 → `unspecified-high`
- **FINAL**: 4 — F1 → `oracle`; F2, F3 → `unspecified-high`; F4 → `deep`

---

## TODOs

- [x] 1. Extend sports.ts with international + depth (T1)

  **What to do**:
  - Extend `src/data/sports.ts` SportsEvent interface to support international sports
  - Add new fields: `region: 'US' | 'Europe' | 'Asia' | 'South America' | 'Africa' | 'Oceania'`, `country?: string`, `venue?: string`, `playerOfTheTournament?: string`
  - Add international events:
    - **World Cup (Soccer)**: 1978 Argentina, 1982 Italy, 1986 Argentina, 1990 W. Germany, 1994 Brazil, 1998 France
    - **Olympics**: 1976 Montreal, 1980 Moscow, 1984 LA, 1988 Seoul, 1992 Barcelona, 1996 Atlanta, 2000 Sydney
    - **F1 World Championship**: 1975-2001 champions (Fangio, Hunt, Lauda, Prost, Senna, Schumacher, Häkkinen, Schumacher, etc.)
    - **Tennis Grand Slams**: Wimbledon, US Open, French Open, Australian Open winners 1970-2001
    - **Cricket World Cup**: 1975, 1979, 1983, 1987, 1992, 1996, 1999
  - Add depth to US sports: venue info (stadium, city), key player stats, draft strategy context
  - Keep all existing US events unchanged (extend, don't break)
  - Each new entry follows existing SportsEvent interface

  **Must NOT do**:
  - Do NOT remove or change existing US sports entries
  - Do NOT change the existing SportsEvent field types (only add optional fields)
  - Do NOT break existing sports.test.tsx

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []
  - **Parallelization**: Wave 1, parallel with T2, T3, T4
  - **Blocks**: T5, T6, T9, T15

  **References**:
  - `src/data/sports.ts:1-12` — current SportsEvent interface
  - `src/data/sports.ts:14-757` — existing US events (do not modify existing entries)

  **Acceptance Criteria**:
  - [ ] SportsEvent interface extended with `region` (required), `country?`, `venue?`, `playerOfTheTournament?` fields
  - [ ] All existing US events have `region: 'US'`
  - [ ] At least 5 international sports categories with events
  - [ ] World Cup: 6+ events (1978-1998)
  - [ ] Olympics: 7+ events (1976-2000)
  - [ ] F1: 25+ champions (1975-2001)
  - [ ] Tennis: 40+ Grand Slam winners across 4 tournaments
  - [ ] Cricket World Cup: 7 events
  - [ ] Each entry has `notableDetails` and at least one new field where applicable

  **QA Scenarios**:
  ```
  Scenario: International sports data loads correctly
    Tool: Bash (vitest) + manual review
    Steps:
      1. Run `npx vitest run src/pages/SportsAlmanac.test.tsx` (or similar) — verify still passes
      2. Open SportsAlmanac page, verify international events render
      3. Filter by "International" — verify only non-US events show
    Expected Result: Both US and international sports visible, filter works
    Evidence: .omo/evidence/content-expansion/task-1-sports-extension.txt
  ```

  **Commit**: `feat(data): extend sports with international events (World Cup, Olympics, F1, tennis, cricket)`

- [x] 2. Create world-events.ts (T2)

  **What to do**:
  - Create `src/data/world-events.ts`
  - Define `WorldEvent` interface: `id`, `year`, `region`, `country`, `category` ('Geopolitical' | 'Economic' | 'Cultural' | 'Scientific' | 'Social'), `event`, `significance`, `tags?`
  - Create `worldEvents` array with 50+ events spanning 1970-2001
  - Coverage requirements:
    - **Americas**: Fall of Saigon, Iran hostage crisis, Panama invasion, NAFTA, Zapatista uprising
    - **Europe**: Fall of Berlin Wall, Soviet collapse, Yugoslav wars, Maastricht Treaty, EU formation, Chernobyl, Bhopal
    - **Asia**: Tiananmen Square, Japanese asset bubble, Asian financial crisis, Hong Kong handover, Indian economic liberalization
    - **Africa**: End of apartheid, Ethiopian famine, Rwanda genocide, Somalia intervention
    - **Middle East**: Iranian Revolution, Gulf War, Oslo Accords, Camp David, Saddam Hussein
  - Each event: year, region, country, category, event name, significance (why it matters for a time traveler), tags

  **Must NOT do**:
  - Do NOT duplicate events already in `disasters.ts` (keep distinct focus)
  - Do NOT include events before 1970 or after 2001
  - Do NOT add events without historical accuracy

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []
  - **Parallelization**: Wave 1, parallel with T1, T3, T4
  - **Blocks**: T5, T6, T10, T15

  **References**:
  - `src/data/sports.ts:1-12` — interface pattern reference
  - `src/data/disasters.ts` — existing data file pattern (avoid duplication)

  **Acceptance Criteria**:
  - [ ] `WorldEvent` interface defined
  - [ ] `worldEvents` array has 50+ events
  - [ ] Events span 1970-2001
  - [ ] At least 10 events per region (Americas, Europe, Asia, Africa, Middle East)
  - [ ] At least 3 categories per region
  - [ ] Each event has `significance` field explaining time-travel relevance

  **QA Scenarios**:
  ```
  Scenario: World events data is complete and typed
    Tool: Bash (tsc + grep)
    Steps:
      1. Run `npx tsc --noEmit` — 0 errors
      2. Grep: `(Get-Content src\data\world-events.ts | Measure-Object -Line).Lines` > 200
      3. Grep: count of "category:" instances >= 50
    Expected Result: File compiles, has 50+ events
    Evidence: .omo/evidence/content-expansion/task-2-world-events.txt
  ```

  **Commit**: `feat(data): add world events module (50+ events, 5 regions, 5 categories)`

- [x] 3. Create places-to-live.ts (T3)

  **What to do**:
  - Create `src/data/places-to-live.ts`
  - Define `RelocationDestination` interface: `id`, `city`, `country`, `decade` ('1970s' | '1980s' | '1990s' | '2000s'), `costOfLivingIndex` (1-100, lower = cheaper), `qualityOfLifeScore` (1-100, higher = better), `politicalStability` ('Stable' | 'Turbulent' | 'Authoritarian' | 'Transitional'), `highlights` (pros), `cautions` (cons), `bestFor` (e.g., "Tech workers", "Artists", "Families"), `tags?`
  - Create `relocationDestinations` array with 20+ destinations spanning 1970-2001
  - Coverage:
    - 1970s: San Francisco (tech boom), Tokyo (miracle economy), Munich (Wirtschaftswunder), São Paulo (miracle), Tehran (pre-revolution)
    - 1980s: Singapore (Asian tiger), Bangalore (IT emergence), Hong Kong (british handover approaching), Dublin (Celtic tiger begins)
    - 1990s: Prague (post-communist boom), Tallinn (digital first), Barcelona (Olympics boom), Bangalore (IT boom)
    - 2000s: Dubai (construction boom), Shanghai (WTO entry), Tallinn (EU member), Seoul (hallyu begins)
  - Each destination covers all 4 decades where applicable (a city existed throughout)

  **Must NOT do**:
  - Do NOT include destinations with incomplete data
  - Do NOT make political judgments — stick to facts
  - Do NOT overlap with places-to-visit (this is for living, that is for visiting)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []
  - **Parallelization**: Wave 1, parallel with T1, T2, T4
  - **Blocks**: T5, T6, T11, T15

  **References**:
  - `src/data/sports.ts:1-12` — interface pattern
  - `src/pages/Progress.tsx` — card grid + progress bar pattern for displaying

  **Acceptance Criteria**:
  - [ ] `RelocationDestination` interface defined
  - [ ] `relocationDestinations` array has 20+ entries
  - [ ] At least 5 cities covered
  - [ ] Each city covers applicable decades
  - [ ] Each entry has costOfLivingIndex, qualityOfLifeScore, politicalStability
  - [ ] Each entry has highlights, cautions, bestFor

  **QA Scenarios**:
  ```
  Scenario: Relocation data is complete
    Tool: Bash (tsc + verification)
    Steps:
      1. `npx tsc --noEmit` — 0 errors
      2. Verify at least 5 unique cities in the data
      3. Verify each entry has all required fields
    Expected Result: File compiles, 20+ entries with complete data
    Evidence: .omo/evidence/content-expansion/task-3-relocation.txt
  ```

  **Commit**: `feat(data): add places-to-live relocation guide (20+ cities, 4 decades)`

- [x] 4. Create places-to-visit.ts (T4)

  **What to do**:
  - Create `src/data/places-to-visit.ts`
  - Define `TouristDestination` interface: `id`, `name`, `location` (city/country), `decade` ('1970s' | '1980s' | '1990s' | '2000s'), `category` ('Natural Wonder' | 'Historical Site' | 'Cultural Event' | 'Architectural Marvel' | 'Music/Arts Scene' | 'Urban Experience'), `description`, `bestTimeToVisit`, `costTier` ('Budget' | 'Moderate' | 'Expensive' | 'Luxury'), `tags?`
  - Create `touristDestinations` array with 25+ destinations
  - Coverage:
    - **1970s**: Apollo moon landing sites, Expo '70 Osaka, Summer of Love locations, Studio 54 NYC, Munich Olympics sites
    - **1980s**: Berlin Wall (before fall), Live Aid venues, World's Fair sites, Christo wrapping of Pont Neuf, Mt. St. Helens
    - **1990s**: Berlin Wall fall locations, Hong Kong handover ceremony, Mandela inauguration, Woodstock '94, Prague Velvet Revolution sites
    - **2000s**: Sydney Olympics, 9/11 memorial (if appropriate), Doha/Mumbai emerging, Dubai construction sites, Y2K celebrations
  - Each entry: evocative description, best time, cost tier, why it matters for a time traveler

  **Must NOT do**:
  - Do NOT include places that no longer exist without noting their historical nature
  - Do NOT overlap with places-to-live (this is for visiting, that is for living)
  - Do NOT include insensitive entries (e.g., disaster tourism)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []
  - **Parallelization**: Wave 1, parallel with T1, T2, T3
  - **Blocks**: T5, T6, T12, T15

  **References**:
  - `src/data/sports.ts:1-12` — interface pattern
  - `src/pages/CompanionGallery.tsx` — card grid with tags pattern

  **Acceptance Criteria**:
  - [ ] `TouristDestination` interface defined
  - [ ] `touristDestinations` array has 25+ entries
  - [ ] At least 5 categories represented
  - [ ] At least 5 entries per decade
  - [ ] Each entry has all required fields

  **QA Scenarios**:
  ```
  Scenario: Tourism data is complete
    Tool: Bash (tsc + verification)
    Steps:
      1. `npx tsc --noEmit` — 0 errors
      2. Verify entries across all 4 decades
      3. Verify at least 5 categories present
    Expected Result: 25+ entries, 4 decades, 5 categories
    Evidence: .omo/evidence/content-expansion/task-4-tourism.txt
  ```

  **Commit**: `feat(data): add places-to-visit temporal tourism guide (25+ destinations)`

- [x] 5. Extend loader.ts with 3 new load functions (T5)

  **What to do**:
  - Extend `src/data/loader.ts` with 3 new dynamic import functions: `loadWorldEvents()`, `loadPlacesToLive()`, `loadPlacesToVisit()`
  - Each uses the same cache Map pattern as existing loaders
  - Sports international events are already in `sports.ts` (extended by T1) — no new loader needed for sports, just ensure the existing `loadSports()` picks up the new entries

  **Must NOT do**:
  - Do NOT change existing loader signatures
  - Do NOT break the existing data loading pattern

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  - **Parallelization**: Wave 2, parallel with T6, T7, T8
  - **Blocks**: T9, T10, T11, T12

  **Acceptance Criteria**:
  - [ ] `loadWorldEvents()` added to loader.ts
  - [ ] `loadPlacesToLive()` added to loader.ts
  - [ ] `loadPlacesToVisit()` added to loader.ts
  - [ ] All 3 use the same cache pattern
  - [ ] `npx tsc --noEmit` → 0 errors

  **QA Scenarios**:
  ```
  Scenario: New loaders work correctly
    Tool: Bash (tsc)
    Steps:
      1. `npx tsc --noEmit` — 0 errors
      2. Verify all 12 load functions exist (9 original + 3 new)
    Expected Result: All loaders defined and typed
    Evidence: .omo/evidence/content-expansion/task-5-loaders.txt
  ```

  **Commit**: `feat(loader): add world events, places-to-live, places-to-visit loaders`

- [x] 6. Update search.ts to include new data types (T6)

  **What to do**:
  - Update `src/lib/search.ts` to search across the 3 new data types
  - Add `searchWorldEvents(query)`, `searchPlacesToLive(query)`, `searchPlacesToVisit(query)` functions
  - Update `searchAll()` to include results from all 3 new data types
  - Update `GroupedSearchResults` type to include new result groups: `World Events`, `Places to Live`, `Places to Visit`
  - Case-insensitive matching across all relevant text fields
  - Results grouped by type

  **Must NOT do**:
  - Do NOT change existing search behavior for sports/finance/etc.
  - Do NOT break the async pattern

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []
  - **Parallelization**: Wave 2, parallel with T5, T7, T8
  - **Blocks**: T9, T10, T11, T12, T15

  **Acceptance Criteria**:
  - [ ] `searchWorldEvents(query)` function added
  - [ ] `searchPlacesToLive(query)` function added
  - [ ] `searchPlacesToVisit(query)` function added
  - [ ] `searchAll()` returns results from all 3 new types
  - [ ] Results grouped by type
  - [ ] `npx tsc --noEmit` → 0 errors

  **QA Scenarios**:
  ```
  Scenario: Search returns results from all new data types
    Tool: Bash (vitest) + manual
    Steps:
      1. `npx vitest run src/lib/search.test.ts` — verify still passes
      2. Search for "Berlin" — should return world events + places to visit
      3. Search for "Tokyo" — should return places to live + places to visit
    Expected Result: Cross-data search works
    Evidence: .omo/evidence/content-expansion/task-6-search.txt
  ```

  **Commit**: `feat(search): include world events, places-to-live, places-to-visit in search`

- [x] 7. Add shared TypeScript types (T7)

  **What to do**:
  - Ensure `src/data/world-events.ts`, `places-to-live.ts`, `places-to-visit.ts` export their interfaces (already done in T2-T4 if using `export interface`)
  - Re-export from `src/data/loader.ts` or `src/data/index.ts` for convenience
  - Add shared union types if helpful: `type Region = 'US' | 'Europe' | 'Asia' | 'South America' | 'Africa' | 'Oceania'`, `type Decade = '1970s' | '1980s' | '1990s' | '2000s'`

  **Must NOT do**:
  - Do NOT create redundant types
  - Do NOT change existing type definitions

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  - **Parallelization**: Wave 2, parallel with T5, T6, T8
  - **Blocks**: T9, T10, T11, T12

  **Acceptance Criteria**:
  - [ ] All new data interfaces accessible from `src/data/`
  - [ ] `Region` and `Decade` types defined and reused
  - [ ] `npx tsc --noEmit` → 0 errors

  **QA Scenarios**:
  ```
  Scenario: Types are properly exported
    Tool: Bash (tsc)
    Steps:
      1. `npx tsc --noEmit` — 0 errors
    Expected Result: All types compile
    Evidence: .omo/evidence/content-expansion/task-7-types.txt
  ```

  **Commit**: `feat(types): ensure new content types are properly exported`

- [x] 8. Update athena preferences for new content (T8)

  **What to do**:
  - Update `src/data/companions/athena-preferences.ts` to reference new content in chat responses
  - Update `formatPreferences()` to optionally mention the new content areas
  - Keep changes minimal — just add awareness, not deep integration

  **Must NOT do**:
  - Do NOT break existing preferences
  - Do NOT change the Preferences interface destructuring in unrelated ways

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  - **Parallelization**: Wave 2, parallel with T5, T6, T7
  - **Blocks**: None directly (nice-to-have)

  **Acceptance Criteria**:
  - [ ] Athena preferences acknowledge new content
  - [ ] `npx vitest run src/data/companions/athena-preferences.test.ts` → passes
  - [ ] `npx tsc --noEmit` → 0 errors

  **QA Scenarios**:
  ```
  Scenario: Athena preferences compile and include new content
    Tool: Bash (vitest)
    Steps:
      1. `npx vitest run src/data/companions/athena-preferences.test.ts` — passes
    Expected Result: Preferences compile and format correctly
    Evidence: .omo/evidence/content-expansion/task-8-preferences.txt
  ```

  **Commit**: `feat(companion): acknowledge new content in athena preferences`

- [x] 9. Extend SportsAlmanac with international/region filter (T9)

  **What to do**:
  - Update `src/pages/SportsAlmanac.tsx` to add region/international filter UI
  - Add filter chips: "All", "US", "International"
  - Use the new `region` field from extended SportsEvent interface
  - When "US" selected: show only `region: 'US'`
  - When "International" selected: show only `region !== 'US'`
  - Update the page header to reflect international coverage
  - Keep existing functionality (search, table view) working

  **Must NOT do**:
  - Do NOT remove existing US sports display
  - Do NOT break the existing sports test

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]
  - **Parallelization**: Wave 3, parallel with T10, T11, T12
  - **Blocks**: T13

  **Acceptance Criteria**:
  - [ ] Filter chips visible at top of page
  - [ ] "All" shows all events
  - [ ] "US" shows only US events
  - [ ] "International" shows only non-US events
  - [ ] Search still works with filter
  - [ ] `npx vitest run src/pages/SportsAlmanac.test.tsx` → passes

  **QA Scenarios**:
  ```
  Scenario: International filter works
    Tool: Playwright
    Steps:
      1. Navigate to /sports
      2. Click "International" filter
      3. Verify only non-US events shown
      4. Click "US" filter
      5. Verify only US events shown
    Expected Result: Filter works correctly
    Evidence: .omo/evidence/content-expansion/task-9-sports-filter.png
  ```

  **Commit**: `feat(pages): add international/region filter to SportsAlmanac`

- [x] 10. Create WorldEvents page + /world-events route (T10)

  **What to do**:
  - Create `src/pages/WorldEvents.tsx` with:
    - Page title: "World Events"
    - Filter controls: region (dropdown), category (dropdown), decade (chips)
    - Card grid displaying world events
    - Each card: year, region, country, category, event name, significance, tags
    - Empty state when no matches
  - Add to App.tsx as route (deferred — T13 adds routes)
  - Create `src/pages/WorldEvents.test.tsx` with basic render tests
  - Use the existing `loadWorldEvents()` loader

  **Must NOT do**:
  - Do NOT add the route to App.tsx in this task (T13 does it)
  - Do NOT modify existing pages

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]
  - **Parallelization**: Wave 3, parallel with T9, T11, T12
  - **Blocks**: T13

  **Acceptance Criteria**:
  - [ ] `src/pages/WorldEvents.tsx` exists
  - [ ] Filter controls present (region, category, decade)
  - [ ] Card grid renders events
  - [ ] Empty state shown when no matches
  - [ ] Test file exists
  - [ ] `npx tsc --noEmit` → 0 errors
  - [ ] `npx vitest run src/pages/WorldEvents.test.tsx` → passes

  **QA Scenarios**:
  ```
  Scenario: WorldEvents page renders and filters work
    Tool: Playwright (after T13 adds route) + Bash (vitest)
    Steps:
      1. `npx vitest run src/pages/WorldEvents.test.tsx` — passes
      2. (After route added) Navigate to /world-events, verify page loads
      3. Filter by region "Europe", verify only European events shown
    Expected Result: Page works correctly
    Evidence: .omo/evidence/content-expansion/task-10-world-events.png
  ```

  **Commit**: `feat(pages): add WorldEvents page with filters`

- [x] 11. Create PlacesToLive page + /places-to-live route (T11)

  **What to do**:
  - Create `src/pages/PlacesToLive.tsx` with:
    - Page title: "Places to Live"
    - Filter controls: decade (chips), political stability (dropdown)
    - Card grid displaying relocation destinations
    - Each card: city, country, decade, cost-of-living bar, quality-of-life bar, political stability badge, highlights, cautions, bestFor
    - Use the existing Progress card pattern for visual consistency
  - Create `src/pages/PlacesToLive.test.tsx` with basic render tests
  - Use the existing `loadPlacesToLive()` loader

  **Must NOT do**:
  - Do NOT add the route to App.tsx in this task (T13 does it)
  - Do NOT modify existing pages

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]
  - **Parallelization**: Wave 3, parallel with T9, T10, T12
  - **Blocks**: T13

  **Acceptance Criteria**:
  - [ ] `src/pages/PlacesToLive.tsx` exists
  - [ ] Filter controls present (decade, political stability)
  - [ ] Card grid with all required fields
  - [ ] Test file exists
  - [ ] `npx tsc --noEmit` → 0 errors
  - [ ] `npx vitest run src/pages/PlacesToLive.test.tsx` → passes

  **QA Scenarios**:
  ```
  Scenario: PlacesToLive page renders and filters work
    Tool: Playwright (after T13 adds route) + Bash (vitest)
    Steps:
      1. `npx vitest run src/pages/PlacesToLive.test.tsx` — passes
      2. (After route added) Navigate to /places-to-live, verify page loads
      3. Filter by decade "1990s", verify only 1990s destinations shown
    Expected Result: Page works correctly
    Evidence: .omo/evidence/content-expansion/task-11-places-to-live.png
  ```

  **Commit**: `feat(pages): add PlacesToLive relocation page`

- [x] 12. Create PlacesToVisit page + /places-to-visit route (T12)

  **What to do**:
  - Create `src/pages/PlacesToVisit.tsx` with:
    - Page title: "Places to Visit"
    - Filter controls: decade (chips), category (dropdown)
    - Card grid displaying tourist destinations
    - Each card: name, location, decade, category badge, description, best time, cost tier, tags
  - Create `src/pages/PlacesToVisit.test.tsx` with basic render tests
  - Use the existing `loadPlacesToVisit()` loader

  **Must NOT do**:
  - Do NOT add the route to App.tsx in this task (T13 does it)
  - Do NOT modify existing pages

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]
  - **Parallelization**: Wave 3, parallel with T9, T10, T11
  - **Blocks**: T13

  **Acceptance Criteria**:
  - [ ] `src/pages/PlacesToVisit.tsx` exists
  - [ ] Filter controls present (decade, category)
  - [ ] Card grid with all required fields
  - [ ] Test file exists
  - [ ] `npx tsc --noEmit` → 0 errors
  - [ ] `npx vitest run src/pages/PlacesToVisit.test.tsx` → passes

  **QA Scenarios**:
  ```
  Scenario: PlacesToVisit page renders and filters work
    Tool: Playwright (after T13 adds route) + Bash (vitest)
    Steps:
      1. `npx vitest run src/pages/PlacesToVisit.test.tsx` — passes
      2. (After route added) Navigate to /places-to-visit, verify page loads
      3. Filter by category "Natural Wonder", verify only natural wonders shown
    Expected Result: Page works correctly
    Evidence: .omo/evidence/content-expansion/task-12-places-to-visit.png
  ```

  **Commit**: `feat(pages): add PlacesToVisit temporal tourism page`

- [x] 13. Update App.tsx with 4 new routes + nav links (T13)

  **What to do**:
  - Update `src/App.tsx` to add 4 new lazy imports and routes
  - Routes: `/world-events`, `/places-to-live`, `/places-to-visit`
  - Note: SportsAlmanac already exists at `/sports` — T9 extended it
  - Add 3 new nav links in the desktop nav area (Sports already has a link)
  - Use existing route + Lazy pattern

  **Must NOT do**:
  - Do NOT change existing routes
  - Do NOT change the nav link order drastically (add new ones, don't reorganize)
  - Do NOT break the lazy loading pattern

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  - **Parallelization**: Wave 4, after T9-T12
  - **Blocks**: T14

  **Acceptance Criteria**:
  - [ ] 3 new routes added: `/world-events`, `/places-to-live`, `/places-to-visit`
  - [ ] 3 new nav links visible in desktop nav
  - [ ] `npx tsc --noEmit` → 0 errors
  - [ ] `npx vitest run` → all tests pass

  **QA Scenarios**:
  ```
  Scenario: New routes work
    Tool: Playwright
    Steps:
      1. Navigate to /world-events — verify page loads
      2. Navigate to /places-to-live — verify page loads
      3. Navigate to /places-to-visit — verify page loads
      4. Verify nav links are visible
    Expected Result: All 3 new routes accessible
    Evidence: .omo/evidence/content-expansion/task-13-routes.png
  ```

  **Commit**: `feat(integration): add routes for world-events, places-to-live, places-to-visit`

- [x] 14. Update MobileNav with 3 new links (T14)

  **What to do**:
  - Update `src/components/MobileNav.tsx` to add 3 new mobile nav links
  - Match the desktop nav additions from T13

  **Must NOT do**:
  - Do NOT change existing mobile nav links
  - Do NOT break the drawer layout

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  - **Parallelization**: Wave 4, after T13

  **Acceptance Criteria**:
  - [ ] 3 new links added to mobile nav
  - [ ] Drawer still works
  - [ ] `npx tsc --noEmit` → 0 errors

  **QA Scenarios**:
  ```
  Scenario: Mobile nav has new links
    Tool: Playwright (mobile viewport)
    Steps:
      1. Set viewport to 375x667
      2. Open hamburger menu
      3. Verify 3 new links present
    Expected Result: Mobile nav has new links
    Evidence: .omo/evidence/content-expansion/task-14-mobile-nav.png
  ```

  **Commit**: `feat(integration): add 3 new links to mobile nav`

- [x] 15. Add tests for new pages + search integration (T15)

  **What to do**:
  - Update `src/lib/search.test.ts` to test new search functions
  - Verify each new page test file exists and passes
  - Add integration tests: search across all 3 new data types
  - Add tests for filter logic in each new page
  - Ensure existing 214 tests still pass

  **Must NOT do**:
  - Do NOT modify existing test files (other than adding new test cases)
  - Do NOT break existing tests

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []
  - **Parallelization**: Wave 4, after T9-T12

  **Acceptance Criteria**:
  - [ ] `src/lib/search.test.ts` updated with tests for 3 new search functions
  - [ ] All 3 new page test files pass
  - [ ] All 214 existing tests still pass
  - [ ] `npx vitest run` → 220+ tests pass (214 + new)
  - [ ] `npx tsc --noEmit` → 0 errors

  **QA Scenarios**:
  ```
  Scenario: All new content tested
    Tool: Bash (vitest)
    Steps:
      1. `npx vitest run` — verify 220+ tests pass
      2. `npx tsc --noEmit` — verify 0 errors
    Expected Result: All tests pass
    Evidence: .omo/evidence/content-expansion/task-15-tests.txt
  ```

  **Commit**: `test: add tests for new content modules and search integration`

---

## Final Verification Wave (MANDATORY)

> 4 review agents run in PARALLEL. ALL must APPROVE.

- [x] F1. **Plan Compliance Audit** — `oracle`
- [x] F2. **Code Quality Review** — `unspecified-high`
- [x] F3. **Real Manual QA** — `unspecified-high` (+ `playwright`)
- [x] F4. **Scope Fidelity Check** — `deep`

---

## Commit Strategy

- **T1-T4 (Wave 1)**: `feat(data): add international sports, world events, places-to-live, places-to-visit`
- **T5-T8 (Wave 2)**: `feat(loader): add 4 new lazy loaders + search integration`
- **T9-T12 (Wave 3)**: `feat(pages): add WorldEvents, PlacesToLive, PlacesToVisit + extended SportsAlmanac`
- **T13-T15 (Wave 4)**: `feat(integration): add routes, nav, tests for new content`

---

## Success Criteria

### Verification Commands
```bash
npx tsc --noEmit                    # 0 errors
npx vitest run                      # 214+ tests pass
npx vite build                      # Succeeds
node scripts/check-bundle-size.mjs  # All chunks within budget
```

### Final Checklist
- [ ] All 4 new data modules exist and follow existing patterns
- [ ] All 4 new pages accessible and functional
- [ ] Search returns results from all new data types
- [ ] Navigation includes all 4 new routes
- [ ] No regressions in existing 214 tests
- [ ] All 4 final-wave reviewers APPROVE