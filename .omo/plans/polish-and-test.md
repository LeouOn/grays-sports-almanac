# Polish & Test Plan

## Goal
Close the test coverage gaps and fix the functional issues (offline, perf, a11y) identified by the explore agents. Tests first as a safety net, then functional fixes.

## Context
- 265 tests / 45 files currently passing
- 0 tsc errors
- Explore agents identified ~10 test gaps + ~5 functional issues

---

## Wave 1: Server + Hook Tests (T1-T3)

### T1. Server test gaps
- [x] 1. Create `server/feature-routes.test.ts` — bookmarks/progress/reviews endpoints (supertest + :memory: DB)
- [x] 2. Create `server/tagMatch.test.ts` — cross-module tag intersection, exclude-self
- [x] 3. Create `server/providers.test.ts` — getModel per provider, missing-API-key error

### T2. Hook test gaps
- [x] 4. Create `src/hooks/useBookmarks.test.ts` — toggleBookmark, isBookmarked, deleteBookmark
- [x] 5. Create `src/hooks/useProgress.test.ts` — fetch, updateProgress, overallPercentage
- [x] 6. Create `src/hooks/useSpacedRepetition.test.ts` — dueReviews, submitReview
- [x] 7. Create `src/hooks/useURLState.test.ts` — searchParams get/set/delete

### T3. Companion system tests
- [x] 8. Create `src/context/CompanionContext.test.tsx` — provider fallback, template interpolation, IDB migration trigger
- [x] 9. Create `src/services/companionIO.test.ts` — JSON import/export validation, downloadBlob

---

## Wave 2: Component + Page Tests (T4-T5)

### T4. Component tests
- [x] 10. Create `src/components/CompanionGallery.test.tsx` — CRUD + search + import/export flow
- [x] 11. Create `src/components/CompanionEditor.test.tsx` — form validation + preview chat
- [x] 12. Create `src/components/ReviewSession.test.tsx` — spaced repetition card flip + submit

### T5. Weak page test improvements
- [x] 13. Beef up `src/pages/DisasterPrevention.test.tsx` — assert specific disaster entries render
- [x] 14. Beef up `src/pages/MedicalInterventions.test.tsx` — assert specific intervention entries
- [x] 15. Beef up `src/pages/TechTransfer.test.tsx` — assert specific tech entries
- [x] 16. Beef up `src/pages/SafetyProtocols.test.tsx` — assert specific protocol entries

### T6. A11y test extension
- [x] 17. Extend `src/__tests__/a11y.test.tsx` — axe scan for all 18 pages (not just Dashboard)

---

## Wave 3: Functional Fixes (T7-T9)

### T7. Offline fixes
- [x] 18. Wire `knowledgeCache.ts` into page data loaders — IDB fallback when offline
- [x] 19. Add offline write queue to `useBookmarks.ts` — queue toggles, retry on reconnect

### T8. Perf fixes
- [x] 20. Wire `captureVitals()` into `main.tsx` (PROD-only guard)
- [x] 21. Wire `checkVersionAndInvalidate` into app entry — clear caches on version bump

---

## Final Verification Wave (MANDATORY)

- [x] F1. Plan Compliance Audit — `oracle`
- [x] F2. Code Quality Review — `unspecified-high`
- [x] F3. Real Manual QA — `unspecified-high` (+ `playwright`)
- [x] F4. Scope Fidelity Check — `deep`

---

## Success Criteria
- `npx tsc --noEmit` → 0 errors
- `npx vitest run` → 320+ tests pass (up from 265)
- `npx vite build` → succeeds
- Offline bookmark toggle works when navigator.onLine is false
- Pages fall back to IDB cache when network fails
- web-vitals reports in production build

---

## Notes
- Tests test CURRENT behavior first (safety net), then functional fixes in Wave 3
- All new test files follow existing patterns (vitest.setup.ts mocks, fake-indexeddb, etc.)
- Functional fixes must not break existing 265 tests
