// Global archive search.
//
// Search pulls from every knowledge dataset, so it depends on all of them.
// To keep that data out of the initial bundle, datasets are loaded lazily
// through `../data/loader` (which caches each module after first load). The
// first search therefore awaits a one-time data load; every search after
// that resolves from cache with no extra network cost.
//
// Call `preloadSearchData()` when the search UI opens to warm the cache so
// the user's first keystroke feels instant.
import {
  loadSports,
  loadFinance,
  loadEraGuide,
  loadDisasters,
  loadTechTransfer,
  loadMedical,
  loadSafety,
  loadBlueprints,
  loadWorldEvents,
  loadPlacesToLive,
  loadPlacesToVisit,
  loadEngineering,
} from '../data/loader';

export interface SearchResult {
  module:
    | 'Sports'
    | 'Finance'
    | 'Era Guide'
    | 'Disasters'
    | 'Tech'
    | 'Medical'
    | 'Safety'
    | 'Blueprints'
    | 'World Events'
    | 'Places to Live'
    | 'Places to Visit'
    | 'Engineering';
  title: string;
  subtitle: string;
  description: string;
  link: string;
  year?: number;
}

/**
 * Warm every dataset the archive searches across. Safe to call repeatedly;
 * the loader caches each module after its first load, so repeat calls are
 * effectively free. Intended to be fired when the search modal opens.
 */
export function preloadSearchData(): Promise<unknown[]> {
  return Promise.all([
    loadSports(),
    loadFinance(),
    loadEraGuide(),
    loadDisasters(),
    loadTechTransfer(),
    loadMedical(),
    loadSafety(),
    loadBlueprints(),
    loadWorldEvents(),
    loadPlacesToLive(),
    loadPlacesToVisit(),
    loadEngineering(),
  ]);
}

export async function searchAll(query: string): Promise<SearchResult[]> {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();

  // Load (or read from cache) every dataset in parallel.
  const [
    sportsAlmanac,
    financialAlmanac,
    eraGuideData,
    disasterAlmanac,
    techTransferTargets,
    medicalInterventions,
    safetyProtocols,
    blueprintsData,
    worldEvents,
    placesToLive,
    placesToVisit,
    engineering,
  ] = await Promise.all([
    loadSports(),
    loadFinance(),
    loadEraGuide(),
    loadDisasters(),
    loadTechTransfer(),
    loadMedical(),
    loadSafety(),
    loadBlueprints(),
    loadWorldEvents(),
    loadPlacesToLive(),
    loadPlacesToVisit(),
    loadEngineering(),
  ]);

  const results: SearchResult[] = [];

  // 1. Sports
  sportsAlmanac.forEach(e => {
    if (
      e.event.toLowerCase().includes(q) ||
      e.winner.toLowerCase().includes(q) ||
      e.loser.toLowerCase().includes(q) ||
      e.sport.toLowerCase().includes(q) ||
      (e.notableDetails && e.notableDetails.toLowerCase().includes(q))
    ) {
      results.push({
        module: 'Sports',
        title: `${e.event} (${e.year})`,
        subtitle: `${e.sport} · Winner: ${e.winner} · Score: ${e.score || 'N/A'}`,
        description: e.notableDetails,
        link: '/sports',
        year: e.year
      });
    }
  });

  // 2. Finance
  financialAlmanac.forEach(e => {
    if (
      e.event.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.notableDetails.toLowerCase().includes(q) ||
      e.entrySignal.toLowerCase().includes(q) ||
      e.exitSignal.toLowerCase().includes(q)
    ) {
      results.push({
        module: 'Finance',
        title: `${e.event} (${e.year})`,
        subtitle: `${e.category} · Entry: ${e.entrySignal}`,
        description: e.notableDetails,
        link: '/finance',
        year: e.year
      });
    }
  });

  // 3. Era Guide
  eraGuideData.forEach(e => {
    if (
      e.item.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.advice.toLowerCase().includes(q)
    ) {
      results.push({
        module: 'Era Guide',
        title: `${e.item} (${e.era})`,
        subtitle: `${e.category} · Advice: ${e.advice.substring(0, 80)}...`,
        description: e.description,
        link: '/era-guide'
      });
    }
  });

  // 4. Disasters
  disasterAlmanac.forEach(e => {
    if (
      e.event.toLowerCase().includes(q) ||
      e.cause.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.intervention.toLowerCase().includes(q)
    ) {
      results.push({
        module: 'Disasters',
        title: `${e.event} (${e.date})`,
        subtitle: `${e.location} · Lives at Stake: ${e.estimatedLivesSaved}`,
        description: e.cause,
        link: '/disasters',
        year: e.year
      });
    }
  });

  // 5. Tech Transfer
  techTransferTargets.forEach(e => {
    if (
      e.concept.toLowerCase().includes(q) ||
      e.targetRecipient.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.deliveryMethod.toLowerCase().includes(q) ||
      e.estimatedImpact.toLowerCase().includes(q)
    ) {
      results.push({
        module: 'Tech',
        title: `${e.concept} (Optimal: ${e.optimalYear})`,
        subtitle: `Recipient: ${e.targetRecipient} · Impact: ${e.estimatedImpact}`,
        description: e.description,
        link: '/tech-transfer',
        year: e.optimalYear
      });
    }
  });

  // 6. Medical
  medicalInterventions.forEach(e => {
    if (
      e.condition.toLowerCase().includes(q) ||
      e.targetRecipient.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.deliveryMethod.toLowerCase().includes(q) ||
      e.details.toLowerCase().includes(q)
    ) {
      results.push({
        module: 'Medical',
        title: `${e.condition} (Optimal: ${e.optimalYear})`,
        subtitle: `Recipient: ${e.targetRecipient} · Lives Saved: ${e.estimatedLivesSaved}`,
        description: e.description,
        link: '/medical',
        year: e.optimalYear
      });
    }
  });

  // 7. Safety
  safetyProtocols.forEach(e => {
    if (
      e.title.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.protocol.toLowerCase().includes(q) ||
      e.eraNote.toLowerCase().includes(q)
    ) {
      results.push({
        module: 'Safety',
        title: e.title,
        subtitle: `${e.category} · Note: ${e.eraNote}`,
        description: e.description,
        link: '/safety'
      });
    }
  });

  // 8. Blueprints
  blueprintsData.forEach(e => {
    if (
      e.title.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.keyPrinciples.some(p => p.toLowerCase().includes(q)) ||
      e.materialsRequired.some(m => m.toLowerCase().includes(q)) ||
      e.stepByStepGuide.toLowerCase().includes(q)
    ) {
      results.push({
        module: 'Blueprints',
        title: e.title,
        subtitle: `${e.category} · Difficulty: ${e.difficulty} · Tolerances: ${e.tolerances}`,
        description: e.description,
        link: '/blueprints'
      });
    }
  });

  // 9. World Events
  worldEvents.forEach(e => {
    if (
      e.event.toLowerCase().includes(q) ||
      e.country.toLowerCase().includes(q) ||
      e.significance.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.region.toLowerCase().includes(q) ||
      (e.tags && e.tags.some(t => t.toLowerCase().includes(q)))
    ) {
      results.push({
        module: 'World Events',
        title: `${e.event} (${e.year})`,
        subtitle: `${e.region} · ${e.country} · ${e.category}`,
        description: e.significance,
        link: '/world-events',
        year: e.year
      });
    }
  });

  // 10. Places to Live
  placesToLive.forEach(e => {
    if (
      e.city.toLowerCase().includes(q) ||
      e.country.toLowerCase().includes(q) ||
      e.decade.toLowerCase().includes(q) ||
      e.politicalStability.toLowerCase().includes(q) ||
      e.highlights.some(h => h.toLowerCase().includes(q)) ||
      e.cautions.some(c => c.toLowerCase().includes(q)) ||
      e.bestFor.some(b => b.toLowerCase().includes(q)) ||
      (e.tags && e.tags.some(t => t.toLowerCase().includes(q)))
    ) {
      results.push({
        module: 'Places to Live',
        title: `${e.city}, ${e.country} (${e.decade})`,
        subtitle: `Stability: ${e.politicalStability} · Cost: ${e.costOfLivingIndex} · QoL: ${e.qualityOfLifeScore}`,
        description: `Best for ${e.bestFor.join(', ')}. ${e.highlights.join(' ')}`,
        link: '/places-to-live'
      });
    }
  });

  // 11. Places to Visit
  placesToVisit.forEach(e => {
    if (
      e.name.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.decade.toLowerCase().includes(q) ||
      e.bestTimeToVisit.toLowerCase().includes(q) ||
      e.costTier.toLowerCase().includes(q) ||
      (e.tags && e.tags.some(t => t.toLowerCase().includes(q)))
    ) {
      results.push({
        module: 'Places to Visit',
        title: `${e.name} (${e.decade})`,
        subtitle: `${e.location} · ${e.category} · Best: ${e.bestTimeToVisit}`,
        description: e.description,
        link: '/places-to-visit'
      });
    }
  });

  // 12. Engineering
  engineering.forEach(e => {
    const keySpecsText = Object.values(e.keySpecs).join(' ').toLowerCase();
    const tagText = (e.tags ?? []).join(' ').toLowerCase();
    if (
      e.conceptName.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      keySpecsText.includes(q) ||
      e.subDomain.toLowerCase().includes(q) ||
      e.era.toLowerCase().includes(q) ||
      tagText.includes(q)
    ) {
      results.push({
        module: 'Engineering',
        title: e.conceptName,
        subtitle: `${e.era} · ${e.subDomain} · Confidence: ${e.provenance.confidence}`,
        description: e.description,
        link: '/engineering'
      });
    }
  });

  return results.slice(0, 20); // Cap at 20 results for performance
}
