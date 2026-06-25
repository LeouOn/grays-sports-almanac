// Accessibility testing setup.
//
// Pattern: register the axe matchers on Vitest's `expect` here so the
// `toHaveNoViolations` matcher is available in every test file without
// per-file imports. Combined with the `axe()` helper exported from
// `vitest-axe`, any rendered component can be audited for WCAG/ARIA
// violations in a unit test:
//
//   const { container } = render(<App />);
//   const results = await axe(container);
//   expect(results).toHaveNoViolations();
//
// This file is registered in vite.config.ts under `test.setupFiles`.
//
// Note: `vitest-axe/extend-expect` only contributes TypeScript types (its
// runtime build is empty in vitest-axe@0.1.0), so we register the matchers
// explicitly via `expect.extend(matchers)` below for the runtime behavior.
import { expect, vi } from 'vitest';
import * as matchers from 'vitest-axe/matchers';
import 'vitest-axe/extend-expect';

expect.extend(matchers);

// ---------------------------------------------------------------------------
// Data loader mock.
//
// `src/data/loader.ts` dynamically imports each knowledge dataset so the
// production initial bundle only ships the data a page actually needs. In
// tests we don't care about code-splitting — we want every page component to
// render with its real data synchronously on the first render, exactly as it
// did before lazy-loading was introduced (otherwise every page test would
// have to become async).
//
// To achieve that, each loader is replaced with a function returning a
// *synchronously-resolving thenable*. When component code does
// `loadX().then(setData)`, the thenable invokes `setData` synchronously
// inside the passive effect, and React's `act()` wrapper flushes the
// resulting re-render before `render()` returns — so synchronous
// `screen.getByText(...)` assertions in existing tests keep working
// unchanged.
vi.mock('@/data/loader', async () => {
  const sports = (await import('./src/data/sports')).sportsAlmanac;
  const disasters = (await import('./src/data/disasters')).disasterAlmanac;
  const engineering = (await import('./src/data/engineering')).engineeringData;
  const eraGuide = (await import('./src/data/era-guide')).eraGuideData;
  const techTransfer = (await import('./src/data/tech-transfer')).techTransferTargets;
  const finance = (await import('./src/data/finance')).financialAlmanac;
  const medical = (await import('./src/data/medical')).medicalInterventions;
  const blueprints = (await import('./src/data/blueprints')).blueprintsData;
  const safety = (await import('./src/data/safety')).safetyProtocols;
  const worldEvents = (await import('./src/data/world-events')).worldEvents;
  const placesToLive = (await import('./src/data/places-to-live')).relocationDestinations;
  const placesToVisit = (await import('./src/data/places-to-visit')).touristDestinations;

  // Build a thenable that resolves its value synchronously when `.then` (or
  // `.catch`/`.finally`) is invoked, so chained callbacks run within the
  // same tick instead of on the microtask queue.
  const syncThenable = <T,>(value: T) => ({
    then: (onFulfilled?: (v: T) => unknown) => {
      if (onFulfilled) onFulfilled(value);
      return syncThenable(value);
    },
    catch: () => syncThenable(value),
    finally: () => syncThenable(value),
  });

  return {
    loadSports: () => syncThenable(sports),
    loadDisasters: () => syncThenable(disasters),
    loadEngineering: () => syncThenable(engineering),
    loadEraGuide: () => syncThenable(eraGuide),
    loadTechTransfer: () => syncThenable(techTransfer),
    loadFinance: () => syncThenable(finance),
    loadMedical: () => syncThenable(medical),
    loadBlueprints: () => syncThenable(blueprints),
    loadSafety: () => syncThenable(safety),
    loadWorldEvents: () => syncThenable(worldEvents),
    loadPlacesToLive: () => syncThenable(placesToLive),
    loadPlacesToVisit: () => syncThenable(placesToVisit),
    clearDataCache: vi.fn(),
  };
});

