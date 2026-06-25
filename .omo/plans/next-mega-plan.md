# Next Mega-Plan: Quality, Performance, Offline & Companion Customization

## TL;DR

> **Quick Summary**: Take the Time Traveler's Guide from "feature complete" to "production-quality personal app" by adding WCAG 2.1 AA accessibility, performance optimization, offline reading mode, and a full companion customization system.
>
> **Deliverables**:
> - WCAG 2.1 AA accessibility (axe-core tests, skip links, ARIA, focus, contrast, keyboard)
> - Performance optimization (bundle analyzer, lazy data loading, recharts code split)
> - Offline reading mode (IndexedDB knowledge cache, read-only bookmarks, offline banner)
> - Companion customization (multi-save, prompt editor, preview chat, JSON import/export)
>
> **Estimated Effort**: XL (35 implementation tasks + 4 final verification)
> **Parallel Execution**: YES — 10 waves
> **Critical Path**: A1 → P1 → O1 → C2 → F1-F4
> **Test Strategy**: Mixed — TDD for logic (IndexedDB, CRUD, cache layer), tests-after for UI

---

## Context

### Original Request
"awesome let's work for new things that we can work on here" — User wants to add new value beyond the 27-task roadmap that just completed.

### Interview Summary

**Key Decisions**:
- **Accessibility**: WCAG 2.1 AA — axe-core automated + manual screen reader verification + skip links + ARIA + focus management + contrast audit + keyboard-only test pass
- **Performance**: Targeted — lazy-load knowledge data files + bundle analyzer (skip recharts lazy, no aggressive prefetching)
- **Offline mode**: Knowledge entries (static data) cached + bookmark read-only view (no offline writes)
- **Companion customization**: Full — multi-save + IndexedDB + prompt editor + preview chat + JSON import/export
- **Test strategy**: Mixed — TDD for logic (IndexedDB layer, CRUD services), tests-after for UI

**Research Findings**:
- Current state: 152 tests pass, 0 tsc errors, build succeeds, 31/31 roadmap tasks complete
- Bundle: index chunk 512KB, CartersianChart 316KB, Quiz 216KB, multiple 30-70KB page chunks
- Data files: 8 modules, largest `sports.ts` (739 lines), `disasters.ts` (573), `engineering.ts` (469), `era-guide.ts` (345)
- PWA: vite-plugin-pwa configured, runtime caching for `/api/v1/*` (CacheFirst, 1hr), dev-disabled
- CompanionContext: Currently has single custom slot (customName/customPrompt in localStorage), needs upgrade to multi-save with IndexedDB

### Metis Review

**Identified Gaps** (addressed):
- Accessibility tests must be in CI to prevent regression: Incorporated as A1 (axe-core runner)
- Bundle analyzer output should be tracked over time: P5 (bundle size budget)
- IndexedDB migration from localStorage needs explicit task: C3 (migration)
- Offline writes deferred per user decision, but sync queue stub for future: O7 (sync status indicator)
- Test strategy split prevents TDD overhead on visual work: Confirmed in Wave structure

---

## Work Objectives

### Core Objective
Elevate the Time Traveler's Guide from a working personal study platform to a polished, accessible, performant, and customizable experience across four dimensions: quality (accessibility), performance (load speed), offline (data availability), and personalization (companion customization).

### Concrete Deliverables

**Accessibility (A1-A11, 11 tasks)**
- axe-core automated tests in vitest pipeline
- Skip-to-content links
- ARIA labels on all interactive components
- Focus management in modals (companion config, search)
- Color contrast audit + fixes
- Live regions for toasts and dynamic content
- Heading hierarchy audit
- Form labels on all inputs
- Keyboard-only navigation test pass
- Screen reader manual verification
- Reduced motion preference support

**Performance (P1-P6, 6 tasks)**
- rollup-plugin-visualizer bundle analyzer
- Lazy-loaded knowledge data per page
- Code-split recharts on first chart view
- Bundle size budget enforcement
- Initial load metrics baseline
- Performance verification (Lighthouse, Core Web Vitals)

**Offline Mode (O1-O7, 7 tasks)**
- IndexedDB wrapper with schema migrations
- Knowledge cache layer (cache-on-first-view)
- Bookmark read-only sync service
- Cache invalidation strategy
- Offline detection hook + banner UI
- Service worker update for data caching
- Sync status indicator

**Companion Customization (C1-C11, 11 tasks)**
- IndexedDB schema for custom companions
- Companion CRUD service (TDD)
- localStorage → IndexedDB migration
- Multi-save gallery component
- Prompt editor with avatar + style tags
- Preview-in-chat test flow
- Extended active companion selector UI
- JSON import/export
- Companion search/filter
- Companion delete confirmation

### Definition of Done
- [ ] `npx tsc --noEmit` → 0 errors
- [ ] `npx vitest run` → ≥ 152 tests pass + new tests added (target: ~200)
- [ ] `npx vite build` → successful production build
- [ ] `npm run analyze` → bundle analyzer report generated
- [ ] No axe-core violations in automated tests
- [ ] Lighthouse Accessibility score ≥ 95
- [ ] All existing 152 tests still pass (zero regressions)

### Must Have
- Zero WCAG 2.1 AA violations detected by axe-core
- Bundle size budget enforced (initial chunk ≤ 350KB)
- Offline mode works for browsing all knowledge entries
- Multi-save custom companions persist across browser sessions
- All existing features continue to work unchanged

### Must NOT Have (Guardrails)
- No breaking changes to existing routes or APIs
- No regression in existing 152 tests
- No new top-level dependencies without justification (axe-core, idb, rollup-plugin-visualizer are approved)
- No cloud sync / user accounts (personal/local only, matches existing architecture)
- No complete UI overhaul (incremental improvements only)
- No changes to LLM provider logic (companion prompts only)
- No removal of localStorage-based companion code without migration path

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: YES (vitest 4, happy-dom, testing-library, supertest)
- **Automated tests**: YES (Mixed — TDD for logic, tests-after for UI)
- **Framework**: vitest + happy-dom + axe-core (new) + jsdom (for IndexedDB if needed)
- **TDD scope**: IndexedDB wrapper, cache services, CRUD services, URL state logic, axe-core test runner
- **Tests-after scope**: UI components, accessibility audit fixes, visual elements

### QA Policy
Every task MUST include agent-executed QA scenarios (see TODO template below).
Evidence saved to `.omo/evidence/next-mega-plan/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright (playwright skill) — Navigate, interact, assert DOM, screenshot, axe-core scan
- **TUI/CLI**: Use interactive_bash (tmux) — Run command, send keystrokes, validate output
- **API/Backend**: Use Bash (curl) — Send requests, assert status + response fields
- **Library/Module**: Use Bash (bun/node REPL) — Import, call functions, compare output
- **IndexedDB**: Use happy-dom polyfill or fake-indexeddb — Verify CRUD operations, persistence

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Accessibility Foundation - 4 tasks, all parallel):
├── A1: Install axe-core + vitest-axe [quick]
├── A2: Add skip links to App layout [quick]
├── A3: Focus trap audit in modals [quick]
└── A4: Heading hierarchy audit [quick]

Wave 2 (Accessibility Polish - 4 tasks, all parallel):
├── A5: ARIA labels audit on interactive components [unspecified-high]
├── A6: Color contrast audit + fixes [visual-engineering]
├── A7: Form labels on all inputs [quick]
└── A8: Live regions for toasts + dynamic content [quick]

Wave 3 (Accessibility Verification - 3 tasks, mostly sequential):
├── A9: Keyboard navigation test pass [unspecified-high]
├── A10: Screen reader manual verification [unspecified-high + playwright]
└── A11: Reduced motion preference support [visual-engineering]

Wave 4 (Performance Foundation - 3 tasks, parallel after A1 for bundle context):
├── P1: Bundle analyzer setup (rollup-plugin-visualizer) [quick]
├── P2: Lazy-load knowledge data files per page [unspecified-high]
└── P3: Initial load metrics baseline [quick]

Wave 5 (Performance Optimization - 3 tasks, parallel after P1+P2):
├── P4: Code-split recharts on first chart view [unspecified-high]
├── P5: Bundle size budget enforcement [quick]
└── P6: Performance verification (Lighthouse, Core Web Vitals) [unspecified-high + playwright]

Wave 6 (Offline Data Layer - 4 tasks, TDD, sequential within wave):
├── O1: IndexedDB wrapper + schema migrations [deep]
├── O2: Knowledge cache service (cache-on-first-view) [deep]
├── O3: Bookmark read-only sync service [deep]
└── O4: Cache invalidation strategy [deep]

Wave 7 (Offline UI - 3 tasks, parallel after O1-O3):
├── O5: Offline detection hook + banner UI [unspecified-high]
├── O6: Service worker update for data caching [quick]
└── O7: Sync status indicator [quick]

Wave 8 (Companion Data Layer - 4 tasks, TDD, sequential within wave):
├── C1: IndexedDB schema for custom companions [deep]
├── C2: Companion CRUD service [deep]
├── C3: Migration from localStorage to IndexedDB [unspecified-high]
└── C4: Active companion selector logic [deep]

Wave 9 (Companion UI - 4 tasks, parallel after C1-C4):
├── C5: Multi-save companion gallery component [visual-engineering]
├── C6: Prompt editor component (textarea + style tags + avatar) [visual-engineering]
├── C7: Preview-in-chat test flow [unspecified-high]
└── C8: Extended active companion selector UI [visual-engineering]

Wave 10 (Companion Advanced - 3 tasks, parallel after C5-C8):
├── C9: JSON import/export [unspecified-high]
├── C10: Companion search/filter [quick]
└── C11: Companion delete confirmation [quick]

Wave FINAL (After ALL tasks — 4 parallel reviews):
├── F1: Plan Compliance Audit [oracle]
├── F2: Code Quality Review [unspecified-high]
├── F3: Real Manual QA [unspecified-high + playwright]
└── F4: Scope Fidelity Check [deep]
-> Present results -> Get explicit user okay

Critical Path: A1 → P1 → O1 → C2 → F1-F4 → user okay
Parallel Speedup: ~65% faster than sequential
Max Concurrent: 4 (Waves 1-2, 5, 7, 9, 10)
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|-----------|--------|------|
| A1 | — | A5, A9, A10, P5 | 1 |
| A2 | — | A9 | 1 |
| A3 | — | A7 | 1 |
| A4 | — | A9 | 1 |
| A5 | A1 | — | 2 |
| A6 | — | — | 2 |
| A7 | A3 | — | 2 |
| A8 | — | — | 2 |
| A9 | A1, A2, A4 | — | 3 |
| A10 | A5, A7, A8 | — | 3 |
| A11 | — | — | 3 |
| P1 | — | P5 | 4 |
| P2 | — | P4 | 4 |
| P3 | P1 | — | 4 |
| P4 | P2 | P6 | 5 |
| P5 | A1, P1 | P6 | 5 |
| P6 | P4, P5 | — | 5 |
| O1 | — | O2, O3, O5, C1 | 6 |
| O2 | O1 | O5, O7 | 6 |
| O3 | O1 | O5, O7 | 6 |
| O4 | O1, O2 | O7 | 6 |
| O5 | O1, O2, O3 | — | 7 |
| O6 | O1 | — | 7 |
| O7 | O2, O3, O4 | — | 7 |
| C1 | O1 | C2, C3, C5 | 8 |
| C2 | C1 | C3, C4, C5, C8, C11 | 8 |
| C3 | C1, C2 | C5, C8 | 8 |
| C4 | C2 | C8 | 8 |
| C5 | C1, C2 | C7, C9, C10, C11 | 9 |
| C6 | C2 | C7, C9 | 9 |
| C7 | C5, C6 | — | 9 |
| C8 | C3, C4 | C10 | 9 |
| C9 | C5, C6 | — | 10 |
| C10 | C5, C8 | — | 10 |
| C11 | C2, C5 | — | 10 |

### Agent Dispatch Summary
- **Wave 1**: 4 — A1, A2, A3, A4 → `quick`
- **Wave 2**: 4 — A5 → `unspecified-high`, A6 → `visual-engineering`, A7, A8 → `quick`
- **Wave 3**: 3 — A9, A10 → `unspecified-high + playwright`, A11 → `visual-engineering`
- **Wave 4**: 3 — P1 → `quick`, P2 → `unspecified-high`, P3 → `quick`
- **Wave 5**: 3 — P4 → `unspecified-high`, P5 → `quick`, P6 → `unspecified-high + playwright`
- **Wave 6**: 4 — O1-O4 → `deep`
- **Wave 7**: 3 — O5 → `unspecified-high`, O6, O7 → `quick`
- **Wave 8**: 4 — C1, C2, C4 → `deep`, C3 → `unspecified-high`
- **Wave 9**: 4 — C5, C6, C8 → `visual-engineering`, C7 → `unspecified-high`
- **Wave 10**: 3 — C9 → `unspecified-high`, C10, C11 → `quick`
- **FINAL**: 4 — F1 → `oracle`, F2, F3 → `unspecified-high`, F4 → `deep`

---

## TODOs

> Implementation + Test = ONE Task. Never separate.
> EVERY task MUST have: Recommended Agent Profile + Parallelization info + QA Scenarios.
> **A task WITHOUT QA Scenarios is INCOMPLETE. No exceptions.**
> **FORMAT**: Task labels MUST use bare numbers: `1.`, `2.`, `3.` — NOT `T1.`, `Task 1.`, `Phase 1:`.
> Final Verification Wave labels MUST use `F1.`, `F2.`, etc.
>
> **TEST STRATEGY**: Mixed — TDD for logic (IndexedDB, CRUD, cache), tests-after for UI.

- [x] 1. Install axe-core + setup vitest-axe (A1)

  **What to do**:
  - Install `axe-core` and `vitest-axe` as dev dependencies
  - Create `vitest.setup.ts` to extend `expect` with `toHaveNoViolations` matcher
  - Update `vite.config.ts` to include the setup file in test config
  - Add a smoke test file `src/__tests__/a11y.test.tsx` that renders the Dashboard component and asserts no axe violations
  - Document the pattern in plan comments so future component tests can import `toHaveNoViolations`

  **Must NOT do**:
  - Do NOT modify existing test files
  - Do NOT change the production build output
  - Do NOT add axe-core to production dependencies (dev only)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with A2, A3, A4)
  - **Parallel Group**: Wave 1
  - **Blocks**: A5, A9, A10, P5
  - **Blocked By**: None

  **References**:
  **Pattern References**:
  - `vite.config.ts:57-61` — vitest config (test environment, exclude patterns)
  - `src/components/ErrorBoundary.test.tsx` — existing test pattern using `render` + assertions

  **External References**:
  - vitest-axe docs: https://github.com/chaabi-dev/vitest-axe — matcher setup
  - axe-core rules: https://github.com/dequelabs/axe-core/blob/develop/doc/rules.md

  **Acceptance Criteria**:
  - [ ] `axe-core` and `vitest-axe` in `devDependencies` in package.json
  - [ ] `vitest.setup.ts` extends `expect` with `toHaveNoViolations`
  - [ ] `vite.config.ts` includes `setupFiles: ['./vitest.setup.ts']`
  - [ ] `src/__tests__/a11y.test.tsx` exists with Dashboard smoke test
  - [ ] `npx vitest run src/__tests__/a11y.test.tsx` passes

  **QA Scenarios**:
  ```
  Scenario: axe-core smoke test passes on Dashboard
    Tool: Bash (vitest)
    Steps:
      1. Run `npx vitest run src/__tests__/a11y.test.tsx`
      2. Verify test passes (Dashboard renders with no axe violations)
    Expected Result: Test passes, Dashboard has zero accessibility violations
    Evidence: .omo/evidence/next-mega-plan/task-1-axe-smoke.txt
  ```

  **Commit**: YES
  - Message: `feat(a11y): install axe-core and vitest-axe setup`
  - Files: `package.json`, `vitest.setup.ts`, `vite.config.ts`, `src/__tests__/a11y.test.tsx`
  - Pre-commit: `npx vitest run`

- [x] 2. Add skip-to-content links to App layout (A2)

  **What to do**:
  - Add a visually-hidden skip link as the first focusable element in `App.tsx` Layout
  - Use CSS `:focus` styles to make it visible when focused (Tailwind: `sr-only focus:not-sr-only`)
  - Link anchors to main content area (add `id="main-content"` and `tabIndex={-1}` to the main container)
  - Style: dark background, white text, prominent border, top-left positioning
  - Test: Tab from page load — skip link should be the first focusable element

  **Must NOT do**:
  - Do NOT change the existing layout structure
  - Do NOT add multiple skip links (one is sufficient)
  - Do NOT remove existing keyboard shortcuts

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with A1, A3, A4)
  - **Parallel Group**: Wave 1
  - **Blocks**: A9
  - **Blocked By**: None

  **References**:
  **Pattern References**:
  - `src/App.tsx:213-260` — Layout component (header structure)
  - `src/index.css` — existing Tailwind/CSS variables for theme-aware styling

  **Acceptance Criteria**:
  - [ ] Skip link is the first focusable element in DOM order
  - [ ] Skip link is visually hidden until focused
  - [ ] Activating skip link jumps focus to `#main-content`
  - [ ] Works in both dark and light themes

  **QA Scenarios**:
  ```
  Scenario: Skip link works on Tab from page load
    Tool: Playwright
    Steps:
      1. Navigate to `http://localhost:5173/`
      2. Press Tab once
      3. Assert skip link is visible (has focus styles)
      4. Press Enter
      5. Assert focus moved to main content (focus indicator visible on main)
    Expected Result: Skip link appears on Tab, activates to jump to content
    Evidence: .omo/evidence/next-mega-plan/task-2-skip-link.png
  ```

  **Commit**: YES
  - Message: `feat(a11y): add skip-to-content link for keyboard navigation`
  - Files: `src/App.tsx`, `src/index.css`
  - Pre-commit: `npx vitest run`

- [x] 3. Audit and fix focus traps in modals (A3)

  **What to do**:
  - Audit existing modals: search modal (Ctrl+K), companion config modal
  - Add focus trap: Tab/Shift+Tab should cycle within the modal when open
  - Move focus to first interactive element when modal opens
  - Restore focus to triggering element when modal closes
  - Add `role="dialog"` and `aria-modal="true"` to modal containers
  - Add `aria-labelledby` pointing to modal title

  **Must NOT do**:
  - Do NOT change the visual design of modals
  - Do NOT remove existing Escape key handler
  - Do NOT add focus trap to non-modal elements (toasts, dropdowns are fine)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with A1, A2, A4)
  - **Parallel Group**: Wave 1
  - **Blocks**: A7
  - **Blocked By**: None

  **References**:
  **Pattern References**:
  - `src/App.tsx:268-328` — Search modal (has Escape handler, needs focus trap)
  - `src/App.tsx:331-497` — Companion config modal (larger, needs focus trap)

  **External References**:
  - focus-trap-react: https://github.com/focus-trap/focus-trap-react — drop-in React focus trap
  - OR custom implementation with `useEffect` + `keydown` listener

  **Acceptance Criteria**:
  - [ ] Search modal traps focus when open
  - [ ] Companion config modal traps focus when open
  - [ ] Focus returns to trigger button when modal closes
  - [ ] `role="dialog"` and `aria-modal="true"` present on modal containers
  - [ ] Existing Escape-to-close still works

  **QA Scenarios**:
  ```
  Scenario: Focus trapped in search modal
    Tool: Playwright
    Steps:
      1. Navigate to `http://localhost:5173/`
      2. Press Ctrl+K to open search modal
      3. Tab repeatedly (10+ times)
      4. Assert focus stays within modal (doesn't escape to page)
      5. Press Escape to close
      6. Assert focus returns to Ctrl+K button
    Expected Result: Focus cycles within modal, returns to trigger on close
    Evidence: .omo/evidence/next-mega-plan/task-3-focus-trap.png
  ```

  **Commit**: YES
  - Message: `feat(a11y): add focus trap and ARIA dialog semantics to modals`
  - Files: `src/App.tsx`
  - Pre-commit: `npx vitest run`

- [x] 4. Audit and fix heading hierarchy (A4)

  **What to do**:
  - Audit all pages and components for heading hierarchy (h1 → h2 → h3, no skipped levels)
  - Each page should have exactly ONE h1 (the page title)
  - Section headings should use h2, sub-sections h3, etc.
  - Fix any violations found (likely in: Dashboard cards, page headers, modal titles)
  - Use semantic heading elements, not just styled divs

  **Must NOT do**:
  - Do NOT change the visual styling of headings (use existing classes)
  - Do NOT remove existing page titles
  - Do NOT add multiple h1s to a single page

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with A1, A2, A3)
  - **Parallel Group**: Wave 1
  - **Blocks**: A9
  - **Blocked By**: None

  **References**:
  **Pattern References**:
  - `src/pages/*.tsx` — all page files (11 lazy-loaded pages)
  - `src/App.tsx:38-170` — Dashboard with module cards (CardTitle is h3, but no h1 on Dashboard)

  **Acceptance Criteria**:
  - [ ] Every page has exactly one h1
  - [ ] Heading levels don't skip (h1 → h2 → h3, no h1 → h3)
  - [ ] Dashboard has h1 (currently uses h2 "Welcome, Traveler")
  - [ ] No empty heading elements

  **QA Scenarios**:
  ```
  Scenario: Each page has proper heading hierarchy
    Tool: Playwright + axe-core
    Steps:
      1. Navigate to each of: /, /sports, /finance, /era-guide, /disasters, /tech-transfer, /medical, /butterfly, /safety, /quiz, /timeline, /blueprints, /bookmarks, /review, /progress
      2. Assert exactly one h1 per page
      3. Assert heading levels are sequential (no skips)
    Expected Result: All 15 pages have proper h1 + sequential headings
    Evidence: .omo/evidence/next-mega-plan/task-4-heading-hierarchy.txt
  ```

  **Commit**: YES
  - Message: `fix(a11y): correct heading hierarchy across all pages`
  - Files: `src/pages/*.tsx`, `src/App.tsx` (Dashboard)
  - Pre-commit: `npx vitest run`

- [x] 5. ARIA labels audit on interactive components (A5)

  **What to do**:
  - Run axe-core scan on every page and identify components missing ARIA labels
  - Add `aria-label` or `aria-labelledby` to: icon-only buttons (close, search, theme toggle, menu), toggle buttons (bookmark), icon links
  - Add `aria-describedby` where helpful (form inputs with help text)
  - Ensure all `<button>` elements have accessible names (text content or aria-label)
  - Ensure all `<a>` elements have accessible names
  - All custom interactive divs/spans should have `role` and `aria-label`

  **Must NOT do**:
  - Do NOT add redundant ARIA labels where text content already provides the name
  - Do NOT change the visual design
  - Do NOT add ARIA to decorative elements

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with A6, A7, A8)
  - **Parallel Group**: Wave 2
  - **Blocks**: A10
  - **Blocked By**: A1 (needs axe-core to scan)

  **References**:
  **Pattern References**:
  - `src/components/MobileNav.tsx` — hamburger menu button (needs aria-label)
  - `src/components/ThemeToggle.tsx` — theme toggle (needs aria-label and aria-pressed)
  - `src/components/BookmarkButton.tsx` — bookmark toggle (needs aria-pressed state)
  - `src/App.tsx:234-260` — header buttons (search, print, companion)

  **Acceptance Criteria**:
  - [ ] All icon-only buttons have `aria-label`
  - [ ] All toggle buttons have `aria-pressed` reflecting state
  - [ ] axe-core reports zero "button-name" or "link-name" violations
  - [ ] Screen reader announces button purposes correctly

  **QA Scenarios**:
  ```
  Scenario: All interactive elements have accessible names
    Tool: Playwright + axe-core
    Steps:
      1. Run axe-core scan on every route
      2. Assert zero "button-name", "link-name", or "aria-allowed-attr" violations
      3. Manually inspect icon buttons in DevTools accessibility tree
    Expected Result: Zero ARIA-related axe violations
    Evidence: .omo/evidence/next-mega-plan/task-5-aria-audit.txt
  ```

  **Commit**: YES
  - Message: `fix(a11y): add ARIA labels to all interactive components`
  - Files: `src/components/*.tsx`, `src/App.tsx`, `src/pages/*.tsx`
  - Pre-commit: `npx vitest run`

- [x] 6. Color contrast audit + fixes (A6)

  **What to do**:
  - Run axe-core color-contrast scan on every page in both dark and light themes
  - Identify text elements that fail WCAG AA contrast (4.5:1 for normal text, 3:1 for large text)
  - Update CSS variables in `src/index.css` to fix contrast issues (adjust --color-text-muted, etc.)
  - Common culprits: `text-neutral-400`, `text-neutral-500`, `text-neutral-600` on dark backgrounds
  - Verify fix in both themes — light theme may need different adjustments
  - Document any intentional low-contrast uses (decorative only)

  **Must NOT do**:
  - Do NOT change the visual design intent (keep dark theme aesthetic)
  - Do NOT fix contrast by removing text or making elements invisible
  - Do NOT use color-only to convey information (add icons/text where needed)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES (with A5, A7, A8)
  - **Parallel Group**: Wave 2
  - **Blocks**: None
  - **Blocked By**: None

  **References**:
  **Pattern References**:
  - `src/index.css` — CSS variables for colors
  - `tailwind.config.js` (if exists) or Tailwind 4 config — color tokens

  **External References**:
  - WCAG AA contrast: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
  - Color contrast checker: https://webaim.org/resources/contrastchecker/

  **Acceptance Criteria**:
  - [ ] axe-core reports zero "color-contrast" violations on all pages
  - [ ] Both dark and light themes pass AA contrast
  - [ ] No regression in visual design (text remains readable, not overly bright)

  **QA Scenarios**:
  ```
  Scenario: All text meets WCAG AA contrast
    Tool: Playwright + axe-core
    Steps:
      1. For each route, run axe-core color-contrast scan in both dark and light themes
      2. Assert zero violations
      3. Visual inspection: text remains readable, not washed out
    Expected Result: Zero contrast violations in both themes
    Evidence: .omo/evidence/next-mega-plan/task-6-contrast.txt
  ```

  **Commit**: YES
  - Message: `fix(a11y): fix color contrast violations for WCAG AA`
  - Files: `src/index.css`, `tailwind.config.*` (if exists)
  - Pre-commit: `npx vitest run`

- [x] 7. Form labels on all inputs (A7)

  **What to do**:
  - Audit all `<input>`, `<textarea>`, `<select>` elements across the app
  - Add visible `<label>` elements OR `aria-label` attributes where visible labels are inappropriate
  - Ensure label/input association: `htmlFor` on label matches `id` on input, or wrapping `<label>` element
  - Add `aria-required="true"` for required fields
  - Add `aria-invalid="true"` and error message association for validation errors
  - Inputs to check: search modal input, companion config inputs (name, prompt, provider), quiz selectors, progress filters

  **Must NOT do**:
  - Do NOT remove placeholder text (it can supplement labels)
  - Do NOT use placeholder as the only label
  - Do NOT change input behavior or validation

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with A5, A6, A8)
  - **Parallel Group**: Wave 2
  - **Blocks**: A10
  - **Blocked By**: A3 (modals need labels before audit)

  **References**:
  **Pattern References**:
  - `src/App.tsx:268-328` — Search modal input
  - `src/components/ui/input.tsx` — base input component
  - `src/components/ui/textarea.tsx` — base textarea component (if exists)
  - `src/pages/Quiz.tsx` — quiz selectors

  **Acceptance Criteria**:
  - [ ] All inputs have associated labels or aria-label
  - [ ] Required fields marked with aria-required
  - [ ] Invalid fields marked with aria-invalid + error description
  - [ ] axe-core reports zero "label" violations

  **QA Scenarios**:
  ```
  Scenario: All form inputs have accessible labels
    Tool: Playwright + axe-core
    Steps:
      1. Open search modal — assert input has label
      2. Open companion config — assert name and prompt inputs have labels
      3. Navigate to quiz — assert selectors have labels
      4. Run axe-core form-label scan on all pages
    Expected Result: Zero label violations, all inputs announced correctly
    Evidence: .omo/evidence/next-mega-plan/task-7-form-labels.txt
  ```

  **Commit**: YES
  - Message: `fix(a11y): add accessible labels to all form inputs`
  - Files: `src/App.tsx`, `src/pages/Quiz.tsx`, `src/components/ui/input.tsx`
  - Pre-commit: `npx vitest run`

- [x] 8. Live regions for toasts + dynamic content (A8)

  **What to do**:
  - Add `aria-live="polite"` region to toast container so screen readers announce notifications
  - Add `aria-live="polite"` to "Review Due" badge on Dashboard (so changes are announced)
  - Add `aria-live="polite"` to search results count
  - Add `aria-busy="true"` during async operations (loading states)
  - Use `role="status"` for non-critical updates, `role="alert"` for critical errors
  - Ensure live regions are present in the DOM BEFORE content updates (not added dynamically)

  **Must NOT do**:
  - Do NOT use `aria-live="assertive"` unless truly urgent (toasts should be polite)
  - Do NOT add live regions to rapidly-changing content (causes screen reader spam)
  - Do NOT change the visual toast notification design

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with A5, A6, A7)
  - **Parallel Group**: Wave 2
  - **Blocks**: A10
  - **Blocked By**: None

  **References**:
  **Pattern References**:
  - `src/App.tsx:532` — `<Toaster theme="dark" />` — needs aria-live wrapper
  - `src/App.tsx:49-62` — "Review Due" badge on Dashboard — needs aria-live
  - `src/components/ui/sonner.tsx` — Sonner toast library config

  **External References**:
  - ARIA live regions: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions
  - Sonner accessibility: https://sonner.emilkowal.ski/ — check if it has built-in a11y

  **Acceptance Criteria**:
  - [ ] Toast container has `aria-live="polite"`
  - [ ] Dashboard "Review Due" badge has `aria-live="polite"`
  - [ ] Loading states announce via `aria-busy`
  - [ ] Screen reader test: trigger toast, verify it's announced

  **QA Scenarios**:
  ```
  Scenario: Toasts are announced by screen readers
    Tool: Playwright + manual NVDA/VoiceOver test
    Steps:
      1. Trigger a toast notification (bookmark add/remove)
      2. Verify aria-live region is present in DOM
      3. Visual inspection: toast appears with correct content
      4. Note: automated screen reader testing is limited; manual verification in A10
    Expected Result: aria-live region exists, toasts render correctly
    Evidence: .omo/evidence/next-mega-plan/task-8-live-regions.txt
  ```

  **Commit**: YES
  - Message: `feat(a11y): add ARIA live regions for dynamic content announcements`
  - Files: `src/App.tsx`, `src/components/ui/sonner.tsx`
  - Pre-commit: `npx vitest run`

- [x] 9. Keyboard navigation test pass (A9)

  **What to do**:
  - Manually test every page using keyboard only (no mouse)
  - Document any unreachable elements or broken tab order
  - Create `e2e/keyboard.spec.ts` with automated keyboard navigation tests:
    - Tab order matches visual order on each page
    - All interactive elements reachable via Tab
    - Shift+Tab works in reverse
    - Enter/Space activates buttons
    - Arrow keys work in radio groups, menus, tabs
    - Escape closes modals (already exists, verify)
  - Fix any issues found during testing
  - Add `tabIndex` management where needed

  **Must NOT do**:
  - Do NOT add `tabIndex={0}` to non-interactive elements (anti-pattern)
  - Do NOT remove existing keyboard shortcuts
  - Do NOT add `outline: none` without replacement focus styles

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: [`playwright`]

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on A1, A2, A4)
  - **Parallel Group**: Wave 3 (sequential after A1, A2, A4)
  - **Blocks**: None
  - **Blocked By**: A1 (axe-core), A2 (skip links), A4 (headings)

  **References**:
  **Pattern References**:
  - `e2e/smoke.spec.ts` — existing E2E test patterns
  - `src/App.tsx:181-190` — existing keyboard shortcut handler

  **Acceptance Criteria**:
  - [ ] `e2e/keyboard.spec.ts` exists with keyboard navigation tests
  - [ ] All pages pass keyboard-only navigation
  - [ ] Tab order is logical on every page
  - [ ] All interactive elements reachable via keyboard
  - [ ] No keyboard traps (except intentional modal focus traps)

  **QA Scenarios**:
  ```
  Scenario: Keyboard-only navigation works on all pages
    Tool: Playwright (e2e/keyboard.spec.ts)
    Steps:
      1. For each route, load page, press Tab repeatedly, assert focus moves through interactive elements in logical order
      2. Press Shift+Tab, assert reverse order
      3. Press Enter on focused button, assert action triggers
      4. Press Escape in modal, assert modal closes
    Expected Result: All keyboard interactions work correctly
    Evidence: .omo/evidence/next-mega-plan/task-9-keyboard.txt
  ```

  **Commit**: YES
  - Message: `test(a11y): add keyboard navigation E2E tests`
  - Files: `e2e/keyboard.spec.ts`
  - Pre-commit: `npx playwright test`

- [x] 10. Screen reader manual verification (A10)

  **What to do**:
  - Manually test app with NVDA (Windows) or VoiceOver (Mac)
  - Test scenarios:
    - Navigate to Dashboard, verify all module cards are announced with title + description
    - Open search modal with Ctrl+K, verify search input is focused and announced
    - Type in search, verify results count is announced
    - Open companion config, verify all form fields are announced with labels
    - Toggle theme, verify state change is announced
    - Add/remove bookmark, verify toast is announced
    - Navigate to bookmarks page, verify all bookmarks are listed
    - Open review session, verify topic + interval are announced
  - Document any issues found and fix them
  - Create `docs/a11y-screen-reader-test.md` with test results

  **Must NOT do**:
  - Do NOT skip testing on at least one major screen reader
  - Do NOT mark task complete without actual screen reader testing
  - Do NOT add workarounds that confuse screen readers (e.g., `aria-hidden` on focusable elements)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: [`playwright`]

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on A5, A7, A8)
  - **Parallel Group**: Wave 3 (sequential after A5, A7, A8)
  - **Blocks**: None
  - **Blocked By**: A5 (ARIA labels), A7 (form labels), A8 (live regions)

  **References**:
  **Pattern References**:
  - `docs/` directory (if exists) for documentation patterns
  - All pages and components tested in A5-A8

  **External References**:
  - NVDA download: https://www.nvaccess.org/download/
  - VoiceOver guide: https://support.apple.com/guide/voiceover/welcome/mac
  - WebAIM screen reader testing: https://webaim.org/articles/screenreader_testing/

  **Acceptance Criteria**:
  - [ ] Manual screen reader test completed on at least one reader (NVDA or VoiceOver)
  - [ ] `docs/a11y-screen-reader-test.md` documents test results
  - [ ] All issues found are fixed
  - [ ] No critical screen reader barriers remain

  **QA Scenarios**:
  ```
  Scenario: Screen reader announces all content correctly
    Tool: Manual NVDA/VoiceOver + Playwright (for verification)
    Steps:
      1. Start screen reader
      2. Navigate through each page using screen reader navigation keys
      3. Verify all content is announced correctly
      4. Test interactive elements (buttons, forms, modals)
      5. Document findings in docs/a11y-screen-reader-test.md
    Expected Result: All content accessible via screen reader
    Evidence: .omo/evidence/next-mega-plan/task-10-screen-reader.md
  ```

  **Commit**: YES
  - Message: `docs(a11y): document screen reader test results`
  - Files: `docs/a11y-screen-reader-test.md`
  - Pre-commit: `npx vitest run`

- [x] 11. Reduced motion preference support (A11)

  **What to do**:
  - Add `@media (prefers-reduced-motion: reduce)` CSS rules to disable animations
  - Disable: page transitions, toast slide-in animations, chart animations, accordion animations
  - Replace animated transitions with instant state changes for users who prefer reduced motion
  - Add `motion-safe:` and `motion-reduce:` Tailwind variants where appropriate
  - Test: toggle OS reduced motion setting, verify animations are disabled
  - Document the pattern in `src/index.css` comments

  **Must NOT do**:
  - Do NOT disable ALL animations (some are functional, e.g., loading spinners)
  - Do NOT remove animations entirely (only respect user preference)
  - Do NOT change the visual design for users without reduced motion preference

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES (with A9, A10)
  - **Parallel Group**: Wave 3
  - **Blocks**: None
  - **Blocked By**: None

  **References**:
  **Pattern References**:
  - `src/index.css` — global styles, add `@media (prefers-reduced-motion: reduce)` block
  - `src/components/ui/skeleton.tsx` — animated pulse skeleton
  - `src/components/ui/sonner.tsx` — toast animations

  **External References**:
  - prefers-reduced-motion: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
  - WCAG 2.3.3 Animation from Interactions: https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html

  **Acceptance Criteria**:
  - [ ] `@media (prefers-reduced-motion: reduce)` block in `src/index.css`
  - [ ] Animations disabled when user prefers reduced motion
  - [ ] Functional animations (loading spinners) remain
  - [ ] Test: toggle OS setting, verify behavior changes

  **QA Scenarios**:
  ```
  Scenario: Reduced motion preference disables animations
    Tool: Playwright
    Steps:
      1. Emulate `prefers-reduced-motion: reduce` in browser context
      2. Navigate to a page with animations
      3. Assert animations are disabled (no transitions, instant state changes)
      4. Emulate `prefers-reduced-motion: no-preference`
      5. Assert animations work normally
    Expected Result: Animations respect user preference
    Evidence: .omo/evidence/next-mega-plan/task-11-reduced-motion.png
  ```

  **Commit**: YES
  - Message: `feat(a11y): respect prefers-reduced-motion for accessibility`
  - Files: `src/index.css`
  - Pre-commit: `npx vitest run`

- [x] 12. Bundle analyzer setup (P1)

  **What to do**:
  - Install `rollup-plugin-visualizer` as dev dependency
  - Configure in `vite.config.ts` to generate HTML report on build
  - Add `"analyze": "vite build --mode analyze"` script to package.json
  - Generate initial report and save to `.omo/evidence/next-mega-plan/bundle-baseline.html`
  - Document current bundle sizes: index chunk, CartersianChart, Quiz, page chunks
  - Set baseline target: index chunk ≤ 350KB (currently 512KB)

  **Must NOT do**:
  - Do NOT add the analyzer to production builds (only analyze mode)
  - Do NOT commit the generated HTML report (add to .gitignore)
  - Do NOT change the existing build configuration

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with P2, P3)
  - **Parallel Group**: Wave 4
  - **Blocks**: P5, P6
  - **Blocked By**: None

  **References**:
  **Pattern References**:
  - `vite.config.ts:1-62` — current Vite config
  - `package.json` — current scripts

  **External References**:
  - rollup-plugin-visualizer: https://github.com/btd/rollup-plugin-visualizer — installation and config

  **Acceptance Criteria**:
  - [ ] `rollup-plugin-visualizer` in devDependencies
  - [ ] `vite.config.ts` has analyzer configured for analyze mode
  - [ ] `npm run analyze` generates HTML report
  - [ ] Report saved to `.omo/evidence/next-mega-plan/bundle-baseline.html`
  - [ ] Baseline sizes documented (index, CartersianChart, Quiz, pages)

  **QA Scenarios**:
  ```
  Scenario: Bundle analyzer generates report
    Tool: Bash
    Steps:
      1. Run `npm run analyze`
      2. Verify report file exists
      3. Open report, identify largest chunks
      4. Document baseline sizes in task notes
    Expected Result: Report generated, baseline established
    Evidence: .omo/evidence/next-mega-plan/task-12-bundle-analyzer.txt
  ```

  **Commit**: YES
  - Message: `feat(perf): add bundle analyzer with baseline report`
  - Files: `vite.config.ts`, `package.json`, `.gitignore`
  - Pre-commit: `npm run analyze`

- [x] 13. Lazy-load knowledge data files per page (P2)

  **What to do**:
  - Convert eager imports of knowledge data files to dynamic imports
  - Files to lazy-load: `src/data/sports.ts` (739 lines), `disasters.ts` (573), `engineering.ts` (469), `era-guide.ts` (345), `tech-transfer.ts` (312), `finance.ts` (274), `medical.ts` (249), `blueprints.ts` (183), `safety.ts` (150)
  - Create `src/data/loader.ts` with `loadSports()`, `loadDisasters()`, etc. functions that use dynamic import
  - Update each page component to use the loader instead of eager import
  - Show loading state while data loads (use existing `PageSkeleton` or similar)
  - Cache loaded data in memory to avoid re-fetching on re-render

  **Must NOT do**:
  - Do NOT change the data file structure
  - Do NOT break existing search functionality (search may need to access all data)
  - Do NOT add new dependencies

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with P1, P3)
  - **Parallel Group**: Wave 4
  - **Blocks**: P4, P6
  - **Blocked By**: None

  **References**:
  **Pattern References**:
  - `src/data/sports.ts:1-739` — largest data file (eagerly imported)
  - `src/data/disasters.ts:1-573` — second largest
  - `src/data/engineering.ts:1-469` — third largest
  - `src/pages/SportsAlmanac.tsx` — example page that imports data eagerly
  - `src/lib/search.ts` — search function (may need special handling)

  **Acceptance Criteria**:
  - [ ] `src/data/loader.ts` exists with dynamic import functions
  - [ ] All 9 data files lazy-loaded via loader
  - [ ] Pages show loading state while data loads
  - [ ] Data cached in memory after first load
  - [ ] Initial bundle size reduced (verify with bundle analyzer)
  - [ ] All existing tests pass (search may need updating)

  **QA Scenarios**:
  ```
  Scenario: Data lazy-loads on page visit
    Tool: Bash + Playwright
    Steps:
      1. Run `npm run analyze` — verify initial bundle smaller
      2. Navigate to /sports — verify data loads (page shows entries)
      3. Navigate away and back — verify instant load (cached)
      4. Run `npx vitest run` — verify all tests pass
    Expected Result: Smaller initial bundle, data loads on demand, cached
    Evidence: .omo/evidence/next-mega-plan/task-13-lazy-data.txt
  ```

  **Commit**: YES
  - Message: `feat(perf): lazy-load knowledge data files per page`
  - Files: `src/data/loader.ts`, `src/pages/*.tsx`
  - Pre-commit: `npx vitest run && npm run analyze`

- [x] 14. Initial load metrics baseline (P3)

  **What to do**:
  - Measure initial page load metrics using Lighthouse or Web Vitals
  - Capture baseline metrics:
    - First Contentful Paint (FCP)
    - Largest Contentful Paint (LCP)
    - Time to Interactive (TTI)
    - Total Blocking Time (TBT)
    - Cumulative Layout Shift (CLS)
  - Save baseline report to `.omo/evidence/next-mega-plan/perf-baseline.json`
  - Document baseline in task notes
  - Set target improvements: LCP < 2.5s, TTI < 3.5s, CLS < 0.1
  - Add `web-vitals` package as dev dependency for measurement

  **Must NOT do**:
  - Do NOT make optimization changes in this task (baseline only)
  - Do NOT commit the Lighthouse HTML report
  - Do NOT skip measurement in both dev and production builds

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with P1, P2)
  - **Parallel Group**: Wave 4
  - **Blocks**: P6
  - **Blocked By**: P1 (needs bundle analyzer context)

  **References**:
  **Pattern References**:
  - `.omo/evidence/baseline.txt` — existing baseline file from previous roadmap

  **External References**:
  - web-vitals: https://github.com/GoogleChrome/web-vitals — npm package
  - Lighthouse CLI: https://github.com/GoogleChrome/lighthouse#using-the-cli

  **Acceptance Criteria**:
  - [ ] `web-vitals` in devDependencies
  - [ ] Baseline metrics captured: FCP, LCP, TTI, TBT, CLS
  - [ ] Report saved to `.omo/evidence/next-mega-plan/perf-baseline.json`
  - [ ] Target improvements documented
  - [ ] Measured in production build (not dev)

  **QA Scenarios**:
  ```
  Scenario: Baseline metrics captured
    Tool: Bash (Lighthouse CLI)
    Steps:
      1. Build production: `npx vite build`
      2. Serve production build
      3. Run Lighthouse on http://localhost:5173
      4. Extract FCP, LCP, TTI, TBT, CLS
      5. Save to perf-baseline.json
    Expected Result: Baseline metrics recorded for comparison
    Evidence: .omo/evidence/next-mega-plan/task-14-perf-baseline.json
  ```

  **Commit**: YES
  - Message: `chore(perf): capture initial load metrics baseline`
  - Files: `package.json`, `.omo/evidence/next-mega-plan/perf-baseline.json`
  - Pre-commit: `npx vitest run`

- [x] 15. Code-split recharts on first chart view (P4)

  **What to do**:
  - Identify all recharts usage: `FinancialChart.tsx`, `RiskVisualization.tsx`, `Progress.tsx`
  - Convert eager `import` from 'recharts' to dynamic `lazy()` import
  - Create wrapper components: `LazyFinancialChart`, `LazyRiskVisualization`, `LazyProgressChart`
  - Show loading state (skeleton or spinner) while recharts loads
  - Cache loaded recharts module (Vite handles this via dynamic import)
  - Verify: initial bundle no longer includes recharts, charts still work

  **Must NOT do**:
  - Do NOT remove recharts functionality
  - Do NOT change chart visual design
  - Do NOT break existing chart tests (may need to mock lazy recharts)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with P5, P6)
  - **Parallel Group**: Wave 5
  - **Blocks**: P6
  - **Blocked By**: P2 (lazy data patterns established)

  **References**:
  **Pattern References**:
  - `src/components/FinancialChart.tsx` — uses recharts (AreaChart)
  - `src/components/RiskVisualization.tsx` — uses recharts (BarChart, RadarChart)
  - `src/pages/Progress.tsx` — uses recharts (PieChart)
  - `src/App.tsx:30-36` — existing lazy loading pattern for pages

  **Acceptance Criteria**:
  - [ ] recharts loaded via dynamic import in all 3 components
  - [ ] Loading state shown while charts load
  - [ ] Initial bundle excludes recharts (verify with analyzer)
  - [ ] All existing chart tests pass
  - [ ] Charts render correctly (manual verification)

  **QA Scenarios**:
  ```
  Scenario: Recharts lazy-loads on chart view
    Tool: Bash + Playwright
    Steps:
      1. Run `npm run analyze` — verify recharts in separate chunk
      2. Navigate to /finance — verify chart loads with loading state
      3. Navigate to /butterfly — verify risk viz loads
      4. Navigate to /progress — verify donut chart loads
      5. Run `npx vitest run` — verify all tests pass
    Expected Result: Smaller initial bundle, charts lazy-load, all tests pass
    Evidence: .omo/evidence/next-mega-plan/task-15-lazy-recharts.txt
  ```

  **Commit**: YES
  - Message: `feat(perf): code-split recharts for smaller initial bundle`
  - Files: `src/components/FinancialChart.tsx`, `src/components/RiskVisualization.tsx`, `src/pages/Progress.tsx`
  - Pre-commit: `npx vitest run && npm run analyze`

- [x] 16. Bundle size budget enforcement (P5)

  **What to do**:
  - Add bundle size check script that fails CI if chunks exceed budget
  - Set budgets:
    - Initial chunk (index): ≤ 350KB (currently 512KB)
    - CartersianChart chunk: ≤ 350KB
    - Quiz chunk: ≤ 250KB
    - Each page chunk: ≤ 100KB
    - Total initial load: ≤ 500KB
  - Create `scripts/check-bundle-size.mjs` that parses build output and checks against budgets
  - Add `"check:bundle": "node scripts/check-bundle-size.mjs"` to package.json
  - Add to vitest pre-commit or separate CI step

  **Must NOT do**:
  - Do NOT set unrealistic budgets that cause constant failures
  - Do NOT skip the check in dev mode
  - Do NOT change the build configuration

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with P4, P6)
  - **Parallel Group**: Wave 5
  - **Blocks**: P6
  - **Blocked By**: A1 (axe-core), P1 (analyzer setup)

  **References**:
  **Pattern References**:
  - `.omo/evidence/baseline.txt` — existing baseline
  - `package.json` — existing scripts

  **Acceptance Criteria**:
  - [ ] `scripts/check-bundle-size.mjs` exists and checks budgets
  - [ ] `npm run check:bundle` script in package.json
  - [ ] Budgets documented in script
  - [ ] Script passes after P2 and P4 optimizations
  - [ ] Script fails if budget exceeded (test by temporarily lowering budget)

  **QA Scenarios**:
  ```
  Scenario: Bundle size budget enforced
    Tool: Bash
    Steps:
      1. Run `npm run build`
      2. Run `npm run check:bundle`
      3. Verify all budgets pass
      4. Temporarily lower index budget to 100KB
      5. Run check again — verify it fails with clear error
      6. Restore budget
    Expected Result: Budget check works, fails on violation
    Evidence: .omo/evidence/next-mega-plan/task-16-bundle-budget.txt
  ```

  **Commit**: YES
  - Message: `feat(perf): add bundle size budget enforcement script`
  - Files: `scripts/check-bundle-size.mjs`, `package.json`
  - Pre-commit: `npm run check:bundle`

- [x] 17. Performance verification (P6)

  **What to do**:
  - Re-measure performance metrics after P2 and P4 optimizations
  - Compare against baseline from P3
  - Verify improvements meet targets:
    - LCP < 2.5s (target improvement)
    - TTI < 3.5s
    - CLS < 0.1
  - Generate before/after comparison report
  - Save to `.omo/evidence/next-mega-plan/perf-after.json`
  - Document any remaining bottlenecks

  **Must NOT do**:
  - Do NOT skip comparison against baseline
  - Do NOT make further optimizations in this task (verification only)
  - Do NOT change measurement methodology from P3

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: [`playwright`]

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on P4, P5)
  - **Parallel Group**: Wave 5 (sequential after P4, P5)
  - **Blocks**: None
  - **Blocked By**: P4 (lazy recharts), P5 (budget enforcement)

  **References**:
  - `.omo/evidence/next-mega-plan/perf-baseline.json` — baseline from P3
  - P3 task — measurement methodology

  **Acceptance Criteria**:
  - [ ] Post-optimization metrics captured
  - [ ] Comparison report generated (before vs after)
  - [ ] Targets met or documented why not
  - [ ] Report saved to `.omo/evidence/next-mega-plan/perf-after.json`

  **QA Scenarios**:
  ```
  Scenario: Performance improved after optimizations
    Tool: Bash (Lighthouse) + Playwright
    Steps:
      1. Build production
      2. Serve and run Lighthouse
      3. Compare metrics to baseline
      4. Generate comparison report
      5. Verify LCP, TTI, CLS meet targets
    Expected Result: Metrics improved or targets documented
    Evidence: .omo/evidence/next-mega-plan/task-17-perf-verification.json
  ```

  **Commit**: YES
  - Message: `chore(perf): verify performance improvements after optimizations`
  - Files: `.omo/evidence/next-mega-plan/perf-after.json`
  - Pre-commit: `npx vitest run`

- [x] 18. IndexedDB wrapper + schema migrations (O1) [TDD]

  **What to do**:
  - Install `idb` package (lightweight IndexedDB wrapper by Jake Archibald)
  - Create `src/lib/idb.ts` with:
    - `openDB()` function with schema versioning
    - Database name: `time-traveler-guide`
    - Version 1 schema:
      - Store: `knowledge` (keyPath: `id`, indexes: `module`, `type`)
      - Store: `bookmarks_cache` (keyPath: `id`)
    - TypeScript types for all stores
    - Migration system: `upgrade()` callback for version changes
  - Write tests FIRST (TDD): `src/lib/idb.test.ts`
    - Test: open DB, create stores
    - Test: CRUD operations on knowledge store
    - Test: CRUD operations on bookmarks_cache store
    - Test: migration from v1 to v2 (mock)
    - Test: close DB connection
  - Use `fake-indexeddb` for tests

  **Must NOT do**:
  - Do NOT use raw IndexedDB API (idb wrapper only)
  - Do NOT store sensitive data (API keys, tokens)
  - Do NOT skip the schema versioning system

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (foundational)
  - **Parallel Group**: Wave 6 (sequential, must complete first)
  - **Blocks**: O2, O3, O5, C1
  - **Blocked By**: None

  **References**:
  **Pattern References**:
  - `src/lib/` directory — existing utility patterns

  **External References**:
  - idb library: https://github.com/jakearchibald/idb — minimal IndexedDB wrapper
  - fake-indexeddb: https://github.com/dumbmatter/fakeIndexedDB — IndexedDB mock for tests

  **Acceptance Criteria**:
  - [ ] `idb` in dependencies
  - [ ] `fake-indexeddb` in devDependencies
  - [ ] `src/lib/idb.ts` exists with `openDB()`, types, migration system
  - [ ] `src/lib/idb.test.ts` exists with CRUD and migration tests
  - [ ] All tests pass
  - [ ] TypeScript clean

  **QA Scenarios**:
  ```
  Scenario: IndexedDB wrapper works with CRUD operations
    Tool: Bash (vitest)
    Steps:
      1. Run `npx vitest run src/lib/idb.test.ts`
      2. Verify all tests pass
      3. Verify migration system works
      4. Verify TypeScript types are correct
    Expected Result: All IndexedDB operations work correctly in tests
    Evidence: .omo/evidence/next-mega-plan/task-18-idb-wrapper.txt
  ```

  **Commit**: YES
  - Message: `feat(offline): add IndexedDB wrapper with schema migrations`
  - Files: `src/lib/idb.ts`, `src/lib/idb.test.ts`, `package.json`
  - Pre-commit: `npx vitest run`

- [x] 19. Knowledge cache service - cache-on-first-view (O2) [TDD]

  **What to do**:
  - Create `src/services/knowledgeCache.ts` with:
    - `cacheKnowledge(module: string, entries: KnowledgeEntry[])` — store entries in IndexedDB
    - `getCachedKnowledge(module: string)` — retrieve from cache
    - `isCached(module: string)` — check if module is cached
    - `getCacheStats()` — return cache size, entry count
  - Integrate with `src/data/loader.ts` (from P2):
    - On first load, cache entries to IndexedDB
    - On subsequent loads, check cache first, fallback to network/data
  - Write tests FIRST (TDD): `src/services/knowledgeCache.test.ts`
    - Test: cache entries, retrieve them
    - Test: cache hit returns immediately
    - Test: cache miss triggers fetch
    - Test: cache stats accurate
  - Handle quota exceeded errors gracefully

  **Must NOT do**:
  - Do NOT cache API responses (only static knowledge data)
  - Do NOT block UI on cache writes (async)
  - Do NOT evict cache automatically (manual or on quota error)

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on O1)
  - **Parallel Group**: Wave 6 (sequential after O1)
  - **Blocks**: O5, O7
  - **Blocked By**: O1 (IndexedDB wrapper)

  **References**:
  **Pattern References**:
  - `src/data/loader.ts` — from P2, integration point
  - `src/lib/idb.ts` — from O1, underlying storage

  **Acceptance Criteria**:
  - [ ] `src/services/knowledgeCache.ts` exists with cache operations
  - [ ] `src/services/knowledgeCache.test.ts` exists with comprehensive tests
  - [ ] Integration with data loader works
  - [ ] All tests pass
  - [ ] Cache hit/miss logic correct

  **QA Scenarios**:
  ```
  Scenario: Knowledge cache works with cache-on-first-view
    Tool: Bash (vitest) + Playwright
    Steps:
      1. Run `npx vitest run src/services/knowledgeCache.test.ts`
      2. Verify all tests pass
      3. Manual test: load /sports, verify entries cached
      4. Go offline, reload /sports, verify entries still load from cache
    Expected Result: Cache works correctly, offline access works
    Evidence: .omo/evidence/next-mega-plan/task-19-knowledge-cache.txt
  ```

  **Commit**: YES
  - Message: `feat(offline): add knowledge cache service with cache-on-first-view`
  - Files: `src/services/knowledgeCache.ts`, `src/services/knowledgeCache.test.ts`, `src/data/loader.ts`
  - Pre-commit: `npx vitest run`

- [x] 20. Bookmark read-only sync service (O3) [TDD]

  **What to do**:
  - Create `src/services/bookmarkSync.ts` with:
    - `syncBookmarks()` — fetch from server, cache to IndexedDB (read-only)
    - `getCachedBookmarks()` — retrieve from cache
    - `isCached()` — check if bookmarks are cached
    - `clearCache()` — manual cache invalidation
  - Sync strategy:
    - On app load (if online), fetch bookmarks from server, update cache
    - If offline, show cached bookmarks with "offline" indicator
    - No offline writes (per user decision)
  - Write tests FIRST (TDD): `src/services/bookmarkSync.test.ts`
    - Test: online sync updates cache
    - Test: offline returns cached data
    - Test: cache invalidation works
    - Test: network errors handled gracefully

  **Must NOT do**:
  - Do NOT allow offline bookmark writes (read-only per user decision)
  - Do NOT block UI on sync (background sync)
  - Do NOT store sensitive data in cache

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on O1)
  - **Parallel Group**: Wave 6 (sequential after O1)
  - **Blocks**: O5, O7
  - **Blocked By**: O1 (IndexedDB wrapper)

  **References**:
  **Pattern References**:
  - `src/hooks/useBookmarks.ts` — existing bookmark hook (fetch from server)
  - `src/lib/idb.ts` — from O1

  **Acceptance Criteria**:
  - [ ] `src/services/bookmarkSync.ts` exists with sync operations
  - [ ] `src/services/bookmarkSync.test.ts` exists with tests
  - [ ] Read-only offline access works
  - [ ] Online sync updates cache
  - [ ] All tests pass

  **QA Scenarios**:
  ```
  Scenario: Bookmark read-only sync works
    Tool: Bash (vitest) + Playwright
    Steps:
      1. Run `npx vitest run src/services/bookmarkSync.test.ts`
      2. Verify all tests pass
      3. Manual: add bookmark online, verify cached
      4. Go offline, navigate to /bookmarks, verify bookmark visible
      5. Try to add bookmark offline — verify it's blocked or queued (read-only)
    Expected Result: Read-only offline bookmark access works
    Evidence: .omo/evidence/next-mega-plan/task-20-bookmark-sync.txt
  ```

  **Commit**: YES
  - Message: `feat(offline): add bookmark read-only sync service`
  - Files: `src/services/bookmarkSync.ts`, `src/services/bookmarkSync.test.ts`
  - Pre-commit: `npx vitest run`

- [x] 21. Cache invalidation strategy (O4) [TDD]

  **What to do**:
  - Create `src/services/cacheInvalidation.ts` with:
    - `invalidateStaleEntries()` — remove entries older than threshold (e.g., 7 days)
    - `invalidateByModule(module: string)` — clear specific module cache
    - `clearAllCaches()` — nuclear option for testing/debugging
    - `getCacheAge(module: string)` — return age of cached data
  - Add timestamp tracking: store `cachedAt` field with each entry
  - Auto-invalidate on app version bump (check `package.json` version)
  - Write tests FIRST (TDD): `src/services/cacheInvalidation.test.ts`
    - Test: stale entries removed
    - Test: module-specific invalidation
    - Test: all caches cleared
    - Test: age calculation correct

  **Must NOT do**:
  - Do NOT invalidate during active reads (race condition)
  - Do NOT delete data that hasn't been refreshed (user may be offline)
  - Do NOT skip the timestamp tracking system

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on O1, O2)
  - **Parallel Group**: Wave 6 (sequential after O1, O2)
  - **Blocks**: O7
  - **Blocked By**: O1 (IndexedDB), O2 (knowledge cache)

  **References**:
  **Pattern References**:
  - `package.json` — version field for invalidation trigger
  - `src/services/knowledgeCache.ts` — from O2

  **Acceptance Criteria**:
  - [ ] `src/services/cacheInvalidation.ts` exists
  - [ ] `src/services/cacheInvalidation.test.ts` exists with tests
  - [ ] Timestamp tracking implemented
  - [ ] Auto-invalidation on version bump
  - [ ] All tests pass

  **QA Scenarios**:
  ```
  Scenario: Cache invalidation works correctly
    Tool: Bash (vitest) + Playwright
    Steps:
      1. Run `npx vitest run src/services/cacheInvalidation.test.ts`
      2. Verify all tests pass
      3. Manual: cache data, change version, reload, verify cache cleared
      4. Manual: cache data, wait for stale threshold, verify auto-invalidation
    Expected Result: Cache invalidation works correctly
    Evidence: .omo/evidence/next-mega-plan/task-21-cache-invalidation.txt
  ```

  **Commit**: YES
  - Message: `feat(offline): add cache invalidation strategy with timestamp tracking`
  - Files: `src/services/cacheInvalidation.ts`, `src/services/cacheInvalidation.test.ts`
  - Pre-commit: `npx vitest run`

- [x] 22. Offline detection hook + banner UI (O5)

  **What to do**:
  - Create `src/hooks/useOnlineStatus.ts`:
    - Returns `boolean` (true = online, false = offline)
    - Listens to `online` and `offline` window events
    - Updates state immediately when connection changes
  - Create `src/components/OfflineBanner.tsx`:
    - Fixed-position banner at top of page
    - Shows "You're offline. Showing cached content." message
    - Yellow/amber color scheme (warning, not error)
    - Dismissible (user can hide it)
    - Only shows when offline
  - Add `<OfflineBanner />` to `App.tsx` Layout
  - Integrate with bookmark sync: show "offline" indicator on bookmarks page when offline
  - Add tests: `src/hooks/useOnlineStatus.test.ts`

  **Must NOT do**:
  - Do NOT show error styling (this is informational, not an error)
  - Do NOT block functionality when offline (allow browsing cached content)
  - Do NOT change the existing toast notification system

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with O6, O7)
  - **Parallel Group**: Wave 7
  - **Blocks**: None
  - **Blocked By**: O1 (IndexedDB), O2 (knowledge cache), O3 (bookmark sync)

  **References**:
  **Pattern References**:
  - `src/App.tsx` — Layout component (add banner)
  - `src/hooks/` — existing hook patterns

  **Acceptance Criteria**:
  - [ ] `src/hooks/useOnlineStatus.ts` exists with event listeners
  - [ ] `src/components/OfflineBanner.tsx` exists with warning styling
  - [ ] Banner shows when offline, hides when online
  - [ ] Banner is dismissible
  - [ ] Tests pass

  **QA Scenarios**:
  ```
  Scenario: Offline banner appears when connection lost
    Tool: Playwright
    Steps:
      1. Navigate to `http://localhost:5173/`
      2. Set browser context to offline
      3. Assert offline banner appears
      4. Set browser context back to online
      5. Assert banner disappears
    Expected Result: Banner appears/disappears based on connection
    Evidence: .omo/evidence/next-mega-plan/task-22-offline-banner.png
  ```

  **Commit**: YES
  - Message: `feat(offline): add offline detection hook and banner UI`
  - Files: `src/hooks/useOnlineStatus.ts`, `src/hooks/useOnlineStatus.test.ts`, `src/components/OfflineBanner.tsx`, `src/App.tsx`
  - Pre-commit: `npx vitest run`

- [x] 23. Service worker update for data caching (O6)

  **What to do**:
  - Update `vite.config.ts` VitePWA configuration:
    - Add runtime caching for knowledge data endpoints
    - Use `StaleWhileRevalidate` strategy for data freshness
    - Add cache name: `knowledge-cache`
    - Set expiration: 7 days, max 100 entries
  - Update service worker to handle IndexedDB integration:
    - On fetch, check IndexedDB cache first
    - Fallback to network
    - Update cache on successful fetch
  - Test: verify service worker registers and caches correctly
  - Add `workbox-background-sync` for failed requests (optional, for future)

  **Must NOT do**:
  - Do NOT cache POST requests (only GET)
  - Do NOT cache streaming responses (chat)
  - Do NOT change existing API caching (keep current `/api/v1/*` cache)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with O5, O7)
  - **Parallel Group**: Wave 7
  - **Blocks**: None
  - **Blocked By**: O1 (IndexedDB)

  **References**:
  **Pattern References**:
  - `vite.config.ts:14-42` — current PWA configuration
  - vite-plugin-pwa docs: https://vite-pwa-org.netlify.app/

  **Acceptance Criteria**:
  - [ ] `vite.config.ts` has updated runtime caching config
  - [ ] Service worker includes IndexedDB integration
  - [ ] Build produces updated `dist/sw.js`
  - [ ] Knowledge data cached on fetch
  - [ ] All existing tests pass

  **QA Scenarios**:
  ```
  Scenario: Service worker caches knowledge data
    Tool: Bash + Playwright
    Steps:
      1. Run `npx vite build`
      2. Verify `dist/sw.js` exists and includes new caching logic
      3. Serve production build
      4. Navigate to /sports, verify data cached
      5. Go offline, reload, verify data still loads
    Expected Result: Service worker caches and serves data offline
    Evidence: .omo/evidence/next-mega-plan/task-23-sw-update.txt
  ```

  **Commit**: YES
  - Message: `feat(offline): update service worker for data caching`
  - Files: `vite.config.ts`
  - Pre-commit: `npx vite build && npx vitest run`

- [x] 24. Sync status indicator (O7)

  **What to do**:
  - Create `src/components/SyncStatusIndicator.tsx`:
    - Shows current sync state: "Synced", "Syncing...", "Offline", "Sync failed"
    - Small icon + text, positioned in header or footer
    - Color-coded: green (synced), blue (syncing), yellow (offline), red (failed)
  - Integrate with bookmark sync service:
    - Show "Syncing..." during `syncBookmarks()`
    - Show "Synced" after successful sync
    - Show "Offline" when network unavailable
    - Show "Sync failed" on error with retry button
  - Add timestamp: "Last synced 5 minutes ago"
  - Add tests for sync state transitions

  **Must NOT do**:
  - Do NOT block UI on sync (show non-intrusive indicator)
  - Do NOT show technical error messages to users
  - Do NOT add to every page (only relevant pages: bookmarks, dashboard)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with O5, O6)
  - **Parallel Group**: Wave 7
  - **Blocks**: None
  - **Blocked By**: O2 (knowledge cache), O3 (bookmark sync), O4 (cache invalidation)

  **References**:
  **Pattern References**:
  - `src/services/bookmarkSync.ts` — from O3, sync state source
  - `src/App.tsx:234-260` — header buttons (add indicator here)

  **Acceptance Criteria**:
  - [ ] `src/components/SyncStatusIndicator.tsx` exists
  - [ ] Shows correct state based on sync status
  - [ ] Color-coded appropriately
  - [ ] Added to relevant pages
  - [ ] All tests pass

  **QA Scenarios**:
  ```
  Scenario: Sync status indicator reflects current state
    Tool: Playwright
    Steps:
      1. Navigate to /bookmarks
      2. Verify indicator shows "Synced" or "Syncing..."
      3. Go offline, verify indicator shows "Offline"
      4. Go back online, verify indicator shows "Syncing..." then "Synced"
    Expected Result: Indicator accurately reflects sync state
    Evidence: .omo/evidence/next-mega-plan/task-24-sync-indicator.png
  ```

  **Commit**: YES
  - Message: `feat(offline): add sync status indicator component`
  - Files: `src/components/SyncStatusIndicator.tsx`, `src/pages/Bookmarks.tsx`
  - Pre-commit: `npx vitest run`

- [x] 25. IndexedDB schema for custom companions (C1) [TDD]

  **What to do**:
  - Update `src/lib/idb.ts` (from O1) to add new store:
    - Store: `custom_companions` (keyPath: `id`, indexes: `name`, `createdAt`)
    - Schema fields: `id`, `name`, `prompt`, `avatar` (emoji), `styleTags` (array), `createdAt`, `updatedAt`
  - Add migration to version 2 schema
  - Write tests FIRST (TDD): `src/lib/idb.test.ts` (update existing)
    - Test: custom_companions store exists in v2 schema
    - Test: migration from v1 to v2 preserves data
    - Test: CRUD operations on custom_companions store
    - Test: indexes work correctly (query by name)

  **Must NOT do**:
  - Do NOT break existing IndexedDB schema (v1 must still work)
  - Do NOT store sensitive data in companion prompts
  - Do NOT skip migration testing

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on O1)
  - **Parallel Group**: Wave 8 (sequential, must complete first)
  - **Blocks**: C2, C3, C5
  - **Blocked By**: O1 (IndexedDB wrapper)

  **References**:
  **Pattern References**:
  - `src/lib/idb.ts` — from O1, extend with new store
  - `src/context/CompanionContext.tsx:43-45` — current customPrompt storage

  **Acceptance Criteria**:
  - [ ] `custom_companions` store added to IndexedDB schema
  - [ ] Migration from v1 to v2 works
  - [ ] Tests pass (existing + new)
  - [ ] TypeScript types for new store

  **QA Scenarios**:
  ```
  Scenario: Custom companions store works with migration
    Tool: Bash (vitest)
    Steps:
      1. Run `npx vitest run src/lib/idb.test.ts`
      2. Verify all tests pass
      3. Verify migration from v1 to v2 preserves data
      4. Verify CRUD operations on custom_companions store
    Expected Result: Schema migration works, new store functional
    Evidence: .omo/evidence/next-mega-plan/task-25-companion-schema.txt
  ```

  **Commit**: YES
  - Message: `feat(companion): add IndexedDB schema for custom companions`
  - Files: `src/lib/idb.ts`, `src/lib/idb.test.ts`
  - Pre-commit: `npx vitest run`

- [x] 26. Companion CRUD service (C2) [TDD]

  **What to do**:
  - Create `src/services/companionService.ts` with:
    - `createCompanion(companion: CompanionInput)` — create new custom companion
    - `getCompanion(id: string)` — retrieve by ID
    - `listCompanions()` — list all custom companions
    - `updateCompanion(id: string, updates: Partial<Companion>)` — update existing
    - `deleteCompanion(id: string)` — delete companion
    - `searchCompanions(query: string)` — search by name or style tags
  - TypeScript types: `CustomCompanion`, `CompanionInput`
  - Write tests FIRST (TDD): `src/services/companionService.test.ts`
    - Test: create, read, update, delete operations
    - Test: search functionality
    - Test: validation (required fields, duplicate names allowed)
    - Test: error handling

  **Must NOT do**:
  - Do NOT allow duplicate names (enforce uniqueness or warn user)
  - Do NOT skip input validation (prompt length, required fields)
  - Do NOT store companions in localStorage (IndexedDB only)

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on C1)
  - **Parallel Group**: Wave 8 (sequential after C1)
  - **Blocks**: C3, C4, C5, C8, C11
  - **Blocked By**: C1 (companion schema)

  **References**:
  **Pattern References**:
  - `src/lib/idb.ts` — from O1, C1
  - `src/context/CompanionContext.tsx` — current companion structure

  **Acceptance Criteria**:
  - [ ] `src/services/companionService.ts` exists with CRUD operations
  - [ ] `src/services/companionService.test.ts` exists with comprehensive tests
  - [ ] All CRUD operations work
  - [ ] Search functionality works
  - [ ] All tests pass

  **QA Scenarios**:
  ```
  Scenario: Companion CRUD service works correctly
    Tool: Bash (vitest)
    Steps:
      1. Run `npx vitest run src/services/companionService.test.ts`
      2. Verify all CRUD operations work
      3. Verify search returns correct results
      4. Verify validation catches invalid inputs
    Expected Result: All CRUD operations work correctly
    Evidence: .omo/evidence/next-mega-plan/task-26-companion-crud.txt
  ```

  **Commit**: YES
  - Message: `feat(companion): add companion CRUD service with IndexedDB`
  - Files: `src/services/companionService.ts`, `src/services/companionService.test.ts`
  - Pre-commit: `npx vitest run`

- [x] 27. Migration from localStorage to IndexedDB (C3)

  **What to do**:
  - Create `src/services/companionMigration.ts`:
    - `migrateFromLocalStorage()` — read existing customName/customPrompt from localStorage
    - Create a "Migrated Companion" entry in IndexedDB with the old data
    - Remove localStorage entries after successful migration
    - Handle migration errors gracefully (don't block app load)
  - Integrate into `CompanionContext`:
    - On app load, check if migration needed
    - Run migration asynchronously (don't block UI)
    - Show toast notification: "Your custom companion has been upgraded"
  - Add tests: `src/services/companionMigration.test.ts`

  **Must NOT do**:
  - Do NOT delete localStorage data until migration succeeds
  - Do NOT block app load on migration
  - Do NOT skip migration if IndexedDB unavailable

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on C1, C2)
  - **Parallel Group**: Wave 8 (sequential after C1, C2)
  - **Blocks**: C5, C8
  - **Blocked By**: C1 (schema), C2 (CRUD service)

  **References**:
  **Pattern References**:
  - `src/context/CompanionContext.tsx:39-59` — current localStorage usage
  - `src/services/companionService.ts` — from C2

  **Acceptance Criteria**:
  - [ ] `src/services/companionMigration.ts` exists
  - [ ] Migration runs on app load
  - [ ] localStorage cleaned up after migration
  - [ ] Error handling for IndexedDB unavailable
  - [ ] Tests pass

  **QA Scenarios**:
  ```
  Scenario: Migration from localStorage to IndexedDB works
    Tool: Playwright + Bash
    Steps:
      1. Set custom companion in localStorage
      2. Reload app
      3. Verify migration ran (companion in IndexedDB)
      4. Verify localStorage cleared
      5. Verify custom companion still selectable
    Expected Result: Migration successful, no data loss
    Evidence: .omo/evidence/next-mega-plan/task-27-migration.txt
  ```

  **Commit**: YES
  - Message: `feat(companion): migrate custom companions from localStorage to IndexedDB`
  - Files: `src/services/companionMigration.ts`, `src/services/companionMigration.test.ts`, `src/context/CompanionContext.tsx`
  - Pre-commit: `npx vitest run`

- [x] 28. Active companion selector logic (C4) [TDD]

  **What to do**:
  - Create `src/services/activeCompanionSelector.ts` with:
    - `getActiveCompanion()` — returns currently active companion
    - `setActiveCompanion(id: string)` — set active companion (can be default or custom)
    - `getActiveCompanionId()` — returns active companion ID
    - Persist active selection to localStorage (small data, doesn't need IndexedDB)
  - Update `CompanionContext` to use this service instead of direct localStorage access
  - Support both default companions (Athena, Biff, Doc) and custom companions
  - Write tests FIRST (TDD): `src/services/activeCompanionSelector.test.ts`
    - Test: get/set active companion
    - Test: persistence across page reloads
    - Test: switching between default and custom companions

  **Must NOT do**:
  - Do NOT break existing companion selection (Athena/Biff/Doc must still work)
  - Do NOT change the active companion data structure
  - Do NOT store active selection in IndexedDB (localStorage is fine for single value)

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on C2)
  - **Parallel Group**: Wave 8 (sequential after C2)
  - **Blocks**: C8
  - **Blocked By**: C2 (CRUD service)

  **References**:
  **Pattern References**:
  - `src/context/CompanionContext.tsx:27-29` — current activeId logic
  - `src/services/companionService.ts` — from C2

  **Acceptance Criteria**:
  - [ ] `src/services/activeCompanionSelector.ts` exists
  - [ ] `src/services/activeCompanionSelector.test.ts` exists
  - [ ] `CompanionContext` uses new service
  - [ ] Default + custom companions both selectable
  - [ ] All tests pass

  **QA Scenarios**:
  ```
  Scenario: Active companion selection works for default and custom
    Tool: Bash (vitest) + Playwright
    Steps:
      1. Run `npx vitest run src/services/activeCompanionSelector.test.ts`
      2. Manual: select default companion, reload, verify still selected
      3. Manual: select custom companion, reload, verify still selected
    Expected Result: Active companion selection works correctly
    Evidence: .omo/evidence/next-mega-plan/task-28-active-selector.txt
  ```

  **Commit**: YES
  - Message: `feat(companion): add active companion selector service`
  - Files: `src/services/activeCompanionSelector.ts`, `src/services/activeCompanionSelector.test.ts`, `src/context/CompanionContext.tsx`
  - Pre-commit: `npx vitest run`

- [x] 29. Multi-save companion gallery component (C5)

  **What to do**:
  - Create `src/pages/CompanionGallery.tsx`:
    - Grid view of all custom companions (cards with avatar, name, style tags)
    - "New Companion" button at top
    - Each card has: avatar emoji, name, style tags, edit button, delete button, "Set Active" button
    - Empty state: "Create your first custom companion"
    - Search/filter input at top
  - Add `/companions` route to `App.tsx`
  - Add "Companions" link in navigation
  - Style: match existing dark theme, card-based layout

  **Must NOT do**:
  - Do NOT change the existing companion config modal (keep it for quick edits)
  - Do NOT remove default companions from gallery (only show custom)
  - Do NOT add pagination (assume small number of custom companions)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES (with C6, C7, C8)
  - **Parallel Group**: Wave 9
  - **Blocks**: C7, C9, C10, C11
  - **Blocked By**: C1 (schema), C2 (CRUD service)

  **References**:
  **Pattern References**:
  - `src/pages/Bookmarks.tsx` — existing page with card layout
  - `src/pages/Progress.tsx` — existing page with grid layout
  - `src/context/CompanionContext.tsx` — companion data structure

  **Acceptance Criteria**:
  - [ ] `src/pages/CompanionGallery.tsx` exists with card grid
  - [ ] `/companions` route added to App.tsx
  - [ ] Navigation link added
  - [ ] Empty state shown when no custom companions
  - [ ] Cards show avatar, name, style tags
  - [ ] Edit/delete/set-active buttons work

  **QA Scenarios**:
  ```
  Scenario: Companion gallery displays all custom companions
    Tool: Playwright
    Steps:
      1. Navigate to `/companions`
      2. Assert gallery renders with all custom companions
      3. Assert empty state if no companions
      4. Click "New Companion" button
      5. Assert navigation to editor (or modal opens)
    Expected Result: Gallery displays correctly, navigation works
    Evidence: .omo/evidence/next-mega-plan/task-29-gallery.png
  ```

  **Commit**: YES
  - Message: `feat(companion): add multi-save companion gallery page`
  - Files: `src/pages/CompanionGallery.tsx`, `src/App.tsx`
  - Pre-commit: `npx vitest run`

- [x] 30. Prompt editor component (C6)

  **What to do**:
  - Create `src/components/CompanionEditor.tsx`:
    - Form fields: name (text input), prompt (textarea), avatar (emoji picker or text input), style tags (multi-select or chips)
    - Validation: name required, prompt required (min 10 chars), avatar optional
    - Save button: creates new or updates existing companion
    - Cancel button: discards changes
    - Delete button (when editing existing)
    - Preview button: opens chat preview (integrates with C7)
  - Use existing shadcn components: Input, Textarea, Button, Card
  - Match dark theme styling

  **Must NOT do**:
  - Do NOT allow empty prompts (validation required)
  - Do NOT auto-save (explicit save action only)
  - Do NOT change the existing companion config modal (this is a new dedicated editor)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES (with C5, C7, C8)
  - **Parallel Group**: Wave 9
  - **Blocks**: C7, C9
  - **Blocked By**: C2 (CRUD service)

  **References**:
  **Pattern References**:
  - `src/components/ui/input.tsx` — base input component
  - `src/components/ui/textarea.tsx` — base textarea component
  - `src/context/CompanionContext.tsx:331-497` — existing companion config modal (reference for fields)

  **Acceptance Criteria**:
  - [ ] `src/components/CompanionEditor.tsx` exists
  - [ ] All form fields present with validation
  - [ ] Save creates/updates companion
  - [ ] Delete removes companion
  - [ ] Preview button opens chat preview

  **QA Scenarios**:
  ```
  Scenario: Companion editor creates new companion
    Tool: Playwright
    Steps:
      1. Navigate to `/companions`
      2. Click "New Companion"
      3. Fill form: name, prompt, avatar, style tags
      4. Click Save
      5. Assert companion appears in gallery
    Expected Result: New companion created and visible
    Evidence: .omo/evidence/next-mega-plan/task-30-editor.png
  ```

  **Commit**: YES
  - Message: `feat(companion): add prompt editor component`
  - Files: `src/components/CompanionEditor.tsx`
  - Pre-commit: `npx vitest run`

- [x] 31. Preview-in-chat test flow (C7)

  **What to do**:
  - Create `src/components/CompanionPreviewChat.tsx`:
    - Chat interface using the current companion's prompt
    - User can send messages, see AI responses (uses existing chat endpoint)
    - Limited to 3-5 messages (preview only, not full chat)
    - "Close Preview" button to exit
  - Integrate into `CompanionEditor` (from C6): "Preview" button opens this
  - Use temporary companion context (doesn't affect active selection)
  - Style: match existing chat UI

  **Must NOT do**:
  - Do NOT save preview messages to conversation history
  - Do NOT change the active companion during preview
  - Do NOT allow unlimited messages (preview only)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with C5, C6, C8)
  - **Parallel Group**: Wave 9
  - **Blocks**: None
  - **Blocked By**: C5 (gallery), C6 (editor)

  **References**:
  **Pattern References**:
  - `src/pages/Quiz.tsx` — existing chat interface (uses useChat from AI SDK)
  - `src/components/ChatAboutThis.tsx` — chat component pattern

  **Acceptance Criteria**:
  - [ ] `src/components/CompanionPreviewChat.tsx` exists
  - [ ] Preview chat works with custom companion prompt
  - [ ] Limited to 3-5 messages
  - [ ] Close button exits preview
  - [ ] Doesn't affect active companion

  **QA Scenarios**:
  ```
  Scenario: Preview chat works with custom companion
    Tool: Playwright
    Steps:
      1. Navigate to `/companions`
      2. Click "New Companion", fill form
      3. Click "Preview" button
      4. Send a test message
      5. Verify AI responds using custom prompt
      6. Close preview
    Expected Result: Preview chat works, AI responds with custom personality
    Evidence: .omo/evidence/next-mega-plan/task-31-preview-chat.png
  ```

  **Commit**: YES
  - Message: `feat(companion): add preview-in-chat test flow`
  - Files: `src/components/CompanionPreviewChat.tsx`, `src/components/CompanionEditor.tsx`
  - Pre-commit: `npx vitest run`

- [x] 32. Extended active companion selector UI (C8)

  **What to do**:
  - Update `src/components/CompanionSelector.tsx` (or create if doesn't exist):
    - Shows default companions (Athena, Biff, Doc) + custom companions
    - Active companion highlighted
    - Quick switch between companions
    - Link to `/companions` gallery for full management
  - Integrate into `CompanionContext` UI (header button or modal)
  - Style: dropdown or grid, match existing design
  - Show avatar + name for each companion

  **Must NOT do**:
  - Do NOT remove existing companion config modal (this is an extension)
  - Do NOT break existing companion selection logic
  - Do NOT add complex animations (keep simple)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES (with C5, C6, C7)
  - **Parallel Group**: Wave 9
  - **Blocks**: C10
  - **Blocked By**: C3 (migration), C4 (selector logic)

  **References**:
  **Pattern References**:
  - `src/App.tsx:331-497` — existing companion config modal
  - `src/context/CompanionContext.tsx` — companion data

  **Acceptance Criteria**:
  - [ ] Extended selector shows default + custom companions
  - [ ] Active companion highlighted
  - [ ] Switching companions works
  - [ ] Link to gallery present
  - [ ] Styled consistently with existing UI

  **QA Scenarios**:
  ```
  Scenario: Extended selector shows all companions
    Tool: Playwright
    Steps:
      1. Open companion selector (header button)
      2. Assert default companions visible
      3. Assert custom companions visible
      4. Switch to a custom companion
      5. Verify active companion changed
    Expected Result: Selector shows all companions, switching works
    Evidence: .omo/evidence/next-mega-plan/task-32-extended-selector.png
  ```

  **Commit**: YES
  - Message: `feat(companion): add extended selector showing default and custom companions`
  - Files: `src/components/CompanionSelector.tsx`, `src/App.tsx`
  - Pre-commit: `npx vitest run`

- [x] 33. JSON import/export for companions (C9)

  **What to do**:
  - Create `src/services/companionIO.ts`:
    - `exportCompanions()` — return JSON string of all custom companions
    - `exportCompanion(id)` — return JSON string of single companion
    - `importCompanions(json: string)` — parse and import companions
    - Handle import errors: invalid JSON, schema mismatch, duplicate IDs
  - Add UI buttons in `CompanionGallery` (from C5):
    - "Export All" button → downloads JSON file
    - "Import" button → file picker → imports companions
  - Add UI buttons in `CompanionEditor` (from C6):
    - "Export" button for single companion
    - "Import from JSON" option in "New Companion" flow
  - Validate imported data with Zod schema (reuse existing schemas pattern)

  **Must NOT do**:
  - Do NOT overwrite existing companions on import (prompt user)
  - Do NOT import invalid JSON silently (show clear error)
  - Do NOT store companions in JSON files (IndexedDB only, JSON is for transfer)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with C10, C11)
  - **Parallel Group**: Wave 10
  - **Blocks**: None
  - **Blocked By**: C5 (gallery), C6 (editor)

  **References**:
  **Pattern References**:
  - `src/lib/export.ts` — existing export utility (CSV/JSON pattern)
  - `src/services/companionService.ts` — from C2, import/export functions

  **Acceptance Criteria**:
  - [ ] `src/services/companionIO.ts` exists with import/export functions
  - [ ] Export downloads valid JSON file
  - [ ] Import accepts valid JSON, rejects invalid
  - [ ] UI buttons present in gallery and editor
  - [ ] Tests pass

  **QA Scenarios**:
  ```
  Scenario: Companion import/export works correctly
    Tool: Playwright
    Steps:
      1. Create a custom companion
      2. Click "Export All" — verify JSON file downloads
      3. Clear all custom companions
      4. Click "Import" — select exported JSON file
      5. Verify companion restored
      6. Test invalid JSON — verify error message
    Expected Result: Import/export works, invalid data handled gracefully
    Evidence: .omo/evidence/next-mega-plan/task-33-import-export.txt
  ```

  **Commit**: YES
  - Message: `feat(companion): add JSON import/export for sharing`
  - Files: `src/services/companionIO.ts`, `src/pages/CompanionGallery.tsx`, `src/components/CompanionEditor.tsx`
  - Pre-commit: `npx vitest run`

- [x] 34. Companion search/filter (C10)

  **What to do**:
  - Add search input to `CompanionGallery` (from C5):
    - Search by name (case-insensitive, partial match)
    - Search by style tags (match any tag)
  - Add filter options:
    - "All", "Default only", "Custom only" filter buttons
    - Style tag filter (multi-select chips)
  - Real-time search (update as user types)
  - Show result count: "Showing 3 of 5 companions"
  - Empty state when no matches: "No companions match your search"

  **Must NOT do**:
  - Do NOT add debouncing (real-time is fine for small dataset)
  - Do NOT change the existing card layout
  - Do NOT add complex search syntax (simple substring match)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with C9, C11)
  - **Parallel Group**: Wave 10
  - **Blocks**: None
  - **Blocked By**: C5 (gallery), C8 (selector)

  **References**:
  **Pattern References**:
  - `src/pages/Bookmarks.tsx` — existing search pattern
  - `src/components/RelatedEntries.tsx` — existing search/filter UI

  **Acceptance Criteria**:
  - [ ] Search input added to gallery
  - [ ] Filter buttons work (All/Default/Custom)
  - [ ] Style tag filter works
  - [ ] Real-time search updates results
  - [ ] Result count displayed
  - [ ] Empty state shown when no matches

  **QA Scenarios**:
  ```
  Scenario: Companion search and filter work correctly
    Tool: Playwright
    Steps:
      1. Navigate to `/companions`
      2. Create 3 companions with different names and tags
      3. Type in search box — verify results filter
      4. Click "Custom only" filter — verify only custom shown
      5. Select style tag filter — verify results update
    Expected Result: Search and filter work correctly
    Evidence: .omo/evidence/next-mega-plan/task-34-search-filter.png
  ```

  **Commit**: YES
  - Message: `feat(companion): add search and filter to companion gallery`
  - Files: `src/pages/CompanionGallery.tsx`
  - Pre-commit: `npx vitest run`

- [x] 35. Companion delete confirmation (C11)

  **What to do**:
  - Add delete confirmation dialog in `CompanionGallery` (from C5):
    - Click delete button → show confirmation modal
    - Modal: "Delete [companion name]? This cannot be undone."
    - Buttons: "Cancel", "Delete"
    - Delete button is destructive (red styling)
  - Add delete confirmation in `CompanionEditor` (from C6):
    - Same confirmation pattern when deleting from editor
  - Use existing shadcn Dialog or AlertDialog component
  - Show toast after deletion: "Companion deleted"
  - If deleted companion was active, switch to default (Athena)

  **Must NOT do**:
  - Do NOT allow undo (confirmation is the safety net)
  - Do NOT delete without confirmation
  - Do NOT break the active companion selection (switch to default if needed)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with C9, C10)
  - **Parallel Group**: Wave 10
  - **Blocks**: None
  - **Blocked By**: C2 (CRUD service), C5 (gallery)

  **References**:
  **Pattern References**:
  - `src/components/ui/dialog.tsx` — existing dialog component (if exists)
  - `src/components/ui/alert-dialog.tsx` — existing alert dialog (if exists)
  - `src/lib/toast.ts` — toast notifications

  **Acceptance Criteria**:
  - [ ] Delete confirmation modal shows before deletion
  - [ ] Cancel button closes modal without deleting
  - [ ] Delete button removes companion
  - [ ] Toast notification appears after deletion
  - [ ] If active companion deleted, switch to default

  **QA Scenarios**:
  ```
  Scenario: Companion delete requires confirmation
    Tool: Playwright
    Steps:
      1. Navigate to `/companions`
      2. Click delete button on a companion
      3. Assert confirmation modal appears
      4. Click Cancel — verify companion still exists
      5. Click delete again, click Delete — verify companion removed
      6. Verify toast notification appears
    Expected Result: Delete confirmation works, accidental deletion prevented
    Evidence: .omo/evidence/next-mega-plan/task-35-delete-confirm.png
  ```

  **Commit**: YES
  - Message: `feat(companion): add delete confirmation dialog`
  - Files: `src/pages/CompanionGallery.tsx`, `src/components/CompanionEditor.tsx`
  - Pre-commit: `npx vitest run`

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.
> Never mark F1-F4 as checked before getting user's okay.

- [x] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, curl endpoint, run command). For each "Must NOT Have": search codebase for forbidden patterns. Check evidence files exist in `.omo/evidence/next-mega-plan/`. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [x] F2. **Code Quality Review** — `unspecified-high`
  Run `tsc --noEmit` + linter + `vitest run`. Review all changed files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop patterns.
  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Tests [N pass/N fail] | Files [N clean/N issues] | VERDICT`

- [x] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
  Start from clean state. Execute EVERY QA scenario from EVERY task — follow exact steps, capture evidence. Test cross-task integration (accessibility + performance + offline + companion working together). Test edge cases. Save to `.omo/evidence/next-mega-plan/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [x] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff. Verify 1:1 — everything in spec was built, nothing beyond spec was built. Check "Must NOT do" compliance. Detect cross-task contamination.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

- **A1-A4 (Wave 1)**: `feat(a11y): foundation - axe-core, skip links, focus, headings`
- **A5-A8 (Wave 2)**: `feat(a11y): polish - ARIA labels, contrast, forms, live regions`
- **A9-A11 (Wave 3)**: `feat(a11y): verification - keyboard, screen reader, motion`
- **P1-P3 (Wave 4)**: `feat(perf): bundle analyzer + lazy data + metrics baseline`
- **P4-P6 (Wave 5)**: `feat(perf): recharts split + bundle budget + verification`
- **O1-O4 (Wave 6)**: `feat(offline): IndexedDB + knowledge cache + bookmark sync + invalidation`
- **O5-O7 (Wave 7)**: `feat(offline): UI - banner + service worker + sync indicator`
- **C1-C4 (Wave 8)**: `feat(companion): IndexedDB schema + CRUD + migration + selector`
- **C5-C8 (Wave 9)**: `feat(companion): UI - gallery + editor + preview + extended selector`
- **C9-C11 (Wave 10)**: `feat(companion): advanced - import/export + search + delete`

---

## Success Criteria

### Verification Commands
```bash
npx tsc --noEmit                    # Expected: 0 errors
npx vitest run                      # Expected: ≥ 152 tests passing + new
npx vite build                      # Expected: successful build, smaller index chunk
npm run analyze                     # Expected: bundle analyzer report
npx playwright test                 # Expected: all E2E + axe-core tests pass
npx lighthouse http://localhost:5173 # Expected: Accessibility ≥ 95, Performance ≥ 90
```

### Final Checklist
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] All tests pass (≥ 152 baseline + new tests added)
- [ ] Git history is clean with meaningful commits
- [ ] Zero axe-core violations
- [ ] Bundle analyzer shows initial chunk ≤ 350KB
- [ ] Offline mode works for all knowledge entries
- [ ] Multi-save companions persist correctly
- [ ] All accessibility fixes verified manually
- [ ] Performance metrics meet targets