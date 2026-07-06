# Comprehensive Polish Plan

> **Goal**: Address all 8 remaining improvements identified in the previous
> session. Grouped into 3 waves by dependency and priority.
>
> **Status**: Waves 1-2 complete. Wave 3 in progress.

---

## Wave 1: Foundation (Visual QA + Performance + PWA)

### 1.1 Visual QA with Playwright
- Load the app at mobile viewport (375x812 — iPhone 13)
- Screenshot every page (18 routes)
- Check for console errors, layout overflow, missing content
- Verify detail modals open and close
- Verify search modal works
- Verify MobileNav grouped drawer works
- **Deliverable**: Screenshots in `.playwright-mcp/` + issue list

### 1.2 Performance: Lazy-load heavy modules
- Engineering page renders 22 items at once — add `IntersectionObserver` or
  simple pagination (show 12, "Load more" button)
- WorldEvents renders 151 items — same pattern (show 30, "Load more")
- PlacesToLive renders 90 items — same pattern (show 24, "Load more")
- PlacesToVisit renders 60 items — same pattern (show 24, "Load more")
- SportsAlmanac table — already has overflow-x-auto, no change needed
- **Deliverable**: 4 pages with "Load more" pagination, faster initial render

### 1.3 PWA install prompt
- Detect `beforeinstallprompt` event (Chrome/Android)
- Show a dismissible banner: "Install Time Traveler's Guide for offline access"
- On click, call `deferredPrompt.prompt()`
- On dismiss, set localStorage flag to not show again for 7 days
- On iOS (no beforeinstallprompt), show instructions: "Tap Share → Add to Home Screen"
- **Deliverable**: `src/components/InstallPrompt.tsx` + test

---

## Wave 2: UX Polish (Companion Editor + Dashboard)

### 2.1 Companion editor polish
- Add inline help text for each field:
  - Name: "This is how the companion introduces themselves"
  - Description: "A short summary shown in the companion gallery"
  - Prompt: "The system prompt that defines the companion's personality. Be specific about tone, knowledge, and behavior."
- Add 3 preset templates (quick-fill buttons):
  - "Historian" — serious, factual, cites sources
  - "Comedian" — witty, uses anachronistic jokes
  - "Mentor" — patient, encouraging, asks Socratic questions
- Add character count on the prompt field (min 50, max 2000)
- **Deliverable**: Updated CompanionEditor.tsx with help text + presets

### 2.2 Dashboard quick-stats widget
- Add a "Your Progress" card at the top of the dashboard showing:
  - Modules viewed (X/12)
  - Quiz competency score (average across all topics)
  - Bookmarks saved
  - Reviews due (from spaced repetition)
- Compact horizontal layout (4 stats in a row on desktop, 2x2 on mobile)
- Only show if user has any activity (hide for brand-new users)
- **Deliverable**: Stats widget in App.tsx Dashboard component

---

## Wave 3: Resilience (Offline + Content)

### 3.1 Offline indicator
- When `useOnlineStatus` reports offline:
  - Show a small badge on the Quiz nav link: "Offline"
  - Show a tooltip on disabled features: "Requires connection"
  - In the Quiz page, show "You're offline — messages will queue and send when you reconnect" (already implemented)
- When online, show nothing (clean UI)
- **Deliverable**: Offline badges on affected nav items

### 3.2 Content expansion (Round 2)
- Expand `blueprints.ts` from 4 to 10+ entries:
  - Electromagnetic telegraph
  - Photography (daguerreotype)
  - Telegraph relay system
  - Steam turbine
  - Internal combustion engine
  - Reinforced concrete
- Expand `finance.ts` with more 1970s-2000s events (target: 50+)
- Expand `disasters.ts` with more preventable events (target: 50+)
- Expand `era-guide.ts` with more slang/prices/tech entries (target: 70+)
- **Deliverable**: 4 data files expanded with historically accurate entries

---

## Success Criteria
- `npx tsc --noEmit` → 0 errors
- `npm run lint` → 0 errors
- `npx vitest run` → 570+ tests pass
- `npx vite build` → succeeds
- Visual QA: 0 console errors on any page
- Performance: initial render < 2s on all pages (no more than 30 items on screen)
- PWA: install prompt appears on Chrome/Android
