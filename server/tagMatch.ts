// Tag-based cross-module matching. Used by the server (palace-link) to find
// related entries across data modules by intersecting tag sets. Returns the
// top-scoring entry by `tags ∩ entry.tags` count, excluding the calling entry
// (when provided).
//
// Each project data module has its own shape (different "title" and
// "description" field names, optional tags). We project everything to a
// common `MatchableEntry` so the matching logic stays simple.
//
import { eraGuideData } from '../src/data/era-guide.js';
import { disasterAlmanac } from '../src/data/disasters.js';
import { sportsAlmanac } from '../src/data/sports.js';
import { engineeringData } from '../src/data/engineering.js';
import { techTransferTargets } from '../src/data/tech-transfer.js';
import { blueprintsData } from '../src/data/blueprints.js';
import { medicalInterventions } from '../src/data/medical.js';
import { financialAlmanac } from '../src/data/finance.js';
import { safetyProtocols } from '../src/data/safety.js';

export interface MatchableEntry {
  id: string;
  title: string;
  description: string;
  tags: string[];
  module: string;
}

function project(
  module: string,
  id: string,
  title: string,
  description: string,
  tags: string[] | undefined
): MatchableEntry {
  return { id, title, description, tags: tags ?? [], module };
}

// All entries, projected into MatchableEntry shape. Built once at module
// load time. Each module maps to a different "title"/"description" field.
// `engineeringData` entries now carry real `tags` and participate in matching.
const ALL_ENTRIES: readonly MatchableEntry[] = [
  ...disasterAlmanac.map((e) => project('disasters', e.id, e.event, e.cause, e.tags)),
  ...sportsAlmanac.map((e) => project('sports', e.id, e.event, e.notableDetails, e.tags)),
  ...engineeringData.map((e) => project('engineering', e.id, e.conceptName, e.description, e.tags)),
  ...techTransferTargets.map((e) => project('tech-transfer', e.id, e.concept, e.description, e.tags)),
  ...blueprintsData.map((e) => project('blueprints', e.id, e.title, e.description, e.tags)),
  ...medicalInterventions.map((e) => project('medical', e.id, e.condition, e.description, e.tags)),
  ...financialAlmanac.map((e) => project('finance', e.id, e.event, e.notableDetails, e.tags)),
  ...safetyProtocols.map((e) => project('safety', e.id, e.title, e.description, e.tags)),
  ...eraGuideData.map((e) => project('era-guide', e.id, `${e.item} (${e.era})`, e.advice, e.tags)),
];

export function findBestTagMatch(
  tags: string[],
  excludeId?: string
): MatchableEntry | null {
  const tagSet = new Set(tags);
  let best: MatchableEntry | null = null;
  let bestScore = 0;
  for (const entry of ALL_ENTRIES) {
    if (entry.id === excludeId) continue;
    const score = entry.tags.filter((t) => tagSet.has(t)).length;
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }
  return bestScore > 0 ? best : null;
}
