// Lazy data loader with in-memory caching + IndexedDB offline fallback.
//
// Each knowledge dataset is dynamically imported on first use so the
// initial bundle only ships the code/data actually needed for the first
// rendered page. Once a dataset is loaded, its promise is cached, so
// subsequent loads (revisiting a page, or running the global archive
// search) resolve on the next microtask without re-fetching.
//
// On successful network load the dataset is also written to IndexedDB via
// the knowledge cache (fire-and-forget, so it never blocks the render).
// If the network load fails — for example because the user is offline or
// the dynamic import throws — each loader transparently falls back to the
// IndexedDB cache so pages still render with their last-known data.
//
// Type-only imports below are erased at compile time and do NOT pull the
// data modules into the initial bundle — only the dynamic `import()` calls
// inside each loader function do, and those are code-split by Vite/Rollup.
import type { SportsEvent } from './sports';
import type { DisasterEvent } from './disasters';
import type { EngineeringSpec } from './engineering';
import type { EraGuideEntry } from './era-guide';
import type { TechTransferTarget } from './tech-transfer';
import type { FinancialEvent } from './finance';
import type { MedicalIntervention } from './medical';
import type { BootstrapBlueprint } from './blueprints';
import type { SafetyProtocol } from './safety';
import type { WorldEvent } from './world-events';
import type { RelocationDestination } from './places-to-live';
import type { TouristDestination } from './places-to-visit';
import {
  cacheKnowledge,
  getCachedKnowledge,
  clearCache as clearKnowledgeCache,
} from '@/services/knowledgeCache';

// Cache of in-flight / resolved data promises, keyed by module name.
// Storing the promise (not the value) means concurrent callers share a
// single load and there's no TOCTOU race.
const cache = new Map<string, Promise<unknown>>();

// Tracks which module keys have already been pushed to the IDB cache
// during the lifetime of this loader, so repeat calls don't issue
// redundant writes. Cleared by `clearDataCache()`.
const idbCached = new Set<string>();

/**
 * Wrap a network-loading factory with:
 *  - in-memory memoization (concurrent callers share one network load);
 *  - fire-and-forget IDB write on success (so the next visit works offline);
 *  - IDB read fallback on failure (so pages still render offline).
 *
 * If both the network load AND the IDB cache miss, the original network
 * error is rethrown so callers can show their normal error UI.
 */
function withOfflineFallback<T>(
  key: string,
  factory: () => Promise<T>,
): Promise<T> {
  let cached = cache.get(key) as Promise<T> | undefined;
  if (!cached) {
    cached = factory();
    cache.set(key, cached);
  }
  return cached.then(
    (data) => {
      if (!idbCached.has(key)) {
        idbCached.add(key);
        // Fire-and-forget — IDB write is an optimization, not the critical
        // path. If the write fails, allow a retry on the next load.
        void cacheKnowledge(key, data as unknown[]).catch(() => {
          idbCached.delete(key);
        });
      }
      return data;
    },
    async (networkErr: unknown) => {
      const fromIdb = await getCachedKnowledge(key);
      if (fromIdb !== null) {
        return fromIdb as T;
      }
      throw networkErr;
    },
  );
}

export function loadSports(): Promise<SportsEvent[]> {
  return withOfflineFallback('sports', async () => (await import('./sports')).sportsAlmanac);
}

export function loadDisasters(): Promise<DisasterEvent[]> {
  return withOfflineFallback('disasters', async () => (await import('./disasters')).disasterAlmanac);
}

export function loadEngineering(): Promise<EngineeringSpec[]> {
  return withOfflineFallback('engineering', async () => (await import('./engineering')).engineeringData);
}

export function loadEraGuide(): Promise<EraGuideEntry[]> {
  return withOfflineFallback('era-guide', async () => (await import('./era-guide')).eraGuideData);
}

export function loadTechTransfer(): Promise<TechTransferTarget[]> {
  return withOfflineFallback('tech-transfer', async () => (await import('./tech-transfer')).techTransferTargets);
}

export function loadFinance(): Promise<FinancialEvent[]> {
  return withOfflineFallback('finance', async () => (await import('./finance')).financialAlmanac);
}

export function loadMedical(): Promise<MedicalIntervention[]> {
  return withOfflineFallback('medical', async () => (await import('./medical')).medicalInterventions);
}

export function loadBlueprints(): Promise<BootstrapBlueprint[]> {
  return withOfflineFallback('blueprints', async () => (await import('./blueprints')).blueprintsData);
}

export function loadSafety(): Promise<SafetyProtocol[]> {
  return withOfflineFallback('safety', async () => (await import('./safety')).safetyProtocols);
}

export function loadWorldEvents(): Promise<WorldEvent[]> {
  return withOfflineFallback('worldEvents', async () => (await import('./world-events')).worldEvents);
}

export function loadPlacesToLive(): Promise<RelocationDestination[]> {
  return withOfflineFallback('placesToLive', async () => (await import('./places-to-live')).relocationDestinations);
}

export function loadPlacesToVisit(): Promise<TouristDestination[]> {
  return withOfflineFallback('placesToVisit', async () => (await import('./places-to-visit')).touristDestinations);
}

/**
 * Drop every cached dataset — both the in-memory promise cache and the
 * IndexedDB knowledge store. Useful for tests that need to assert against
 * a fresh load, or to reclaim memory when datasets are no longer needed.
 */
export function clearDataCache(): void {
  cache.clear();
  idbCached.clear();
  // Fire-and-forget the IDB clear; callers don't need to await it.
  void clearKnowledgeCache().catch(() => {});
}
