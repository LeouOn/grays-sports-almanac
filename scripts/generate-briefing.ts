#!/usr/bin/env tsx
// NotebookLM briefing-book exporter. Compiles the archive's curated entries into
// a per-era markdown "traveler's briefing" formatted for upload to NotebookLM
// (notebooklm.google.com), where it serves as the source for two-host podcast
// Audio Overviews. Output is generated (not curated) - data/briefings/ is gitignored.
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { sportsAlmanac } from '../src/data/sports.js';
import { financialAlmanac } from '../src/data/finance.js';
import { eraGuideData } from '../src/data/era-guide.js';
import { disasterAlmanac } from '../src/data/disasters.js';
import { techTransferTargets } from '../src/data/tech-transfer.js';
import { medicalInterventions } from '../src/data/medical.js';
import { safetyProtocols } from '../src/data/safety.js';
import { blueprintsData } from '../src/data/blueprints.js';
import { engineeringData } from '../src/data/engineering.js';
import { relocationDestinations } from '../src/data/places-to-live.js';
import { touristDestinations } from '../src/data/places-to-visit.js';
import { worldEvents } from '../src/data/world-events.js';

// ----- CLI -----
const ERAS = ['1950s', '1960s', '1970s', '1980s', '1990s', '2000s'] as const;
type Era = (typeof ERAS)[number];

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i < 0 ? undefined : process.argv[i + 1];
}

const eraArg = arg('era');
if (!eraArg || !([...ERAS, 'all'] as string[]).includes(eraArg)) {
  console.error('Usage: tsx scripts/generate-briefing.ts --era <1950s|1960s|1970s|1980s|1990s|2000s|all>');
  console.error('Writes a NotebookLM-ready briefing book to data/briefings/<era>-travelers-briefing.md');
  console.error('See docs/podcasts.md for the full podcast workflow.');
  process.exit(1);
}

const erasToWrite: Era[] = eraArg === 'all' ? [...ERAS] : [eraArg as Era];

// ----- Era filters -----
const byYear = (year: number, era: Era): boolean => `${Math.floor(year / 10) * 10}s` === era;

// ----- Section builders -----
// Each returns { title, body }; a section with an empty body is skipped.
interface Section {
  title: string;
  body: string;
}

function sceneSection(era: Era): Section {
  const entries = eraGuideData.filter(e => e.era === era);
  const groups = ['Prices', 'Slang', 'Tech Constraints', 'Fashion', 'Identity'] as const;
  const parts: string[] = [];
  for (const group of groups) {
    const items = entries.filter(e => e.category === group);
    if (!items.length) continue;
    parts.push(`### ${group}`);
    parts.push(...items.map(e => `- **${e.item}** — ${e.description} *Advice: ${e.advice}*`));
  }
  return { title: 'The Scene', body: parts.join('\n') };
}

function betsSection(era: Era): Section {
  const items = sportsAlmanac
    .filter(e => byYear(e.year, era))
    .sort((a, b) => a.year - b.year)
    .map(e => `- **${e.event} (${e.year})** — ${e.winner} over ${e.loser}${e.score ? `, ${e.score}` : ''}. ${e.notableDetails}`);
  return { title: "Bets You Can't Lose", body: items.join('\n') };
}

function marketSection(era: Era): Section {
  const items = financialAlmanac
    .filter(e => byYear(e.year, era))
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(e => `- **${e.event} (${e.date})** — ${e.direction === 'up' ? 'Rising' : 'Falling'}. Entry: ${e.entrySignal} Exit: ${e.exitSignal}. ${e.notableDetails}`);
  return { title: 'Market Moves', body: items.join('\n') };
}

function headlinesSection(era: Era): Section {
  const items = worldEvents
    .filter(e => byYear(e.year, era))
    .sort((a, b) => a.year - b.year)
    .map(e => `- **${e.event} (${e.year}, ${e.country})** — ${e.significance}`);
  return { title: 'Headlines You\'ll Live Through', body: items.join('\n') };
}

function disastersSection(era: Era): Section {
  const items = disasterAlmanac
    .filter(e => byYear(e.year, era))
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(e => `- **${e.event} (${e.date}, ${e.location})** — Cause: ${e.cause}. Play: ${e.intervention} (risk: ${e.butterflyRisk})`);
  return { title: 'Disasters to Watch', body: items.join('\n') };
}

function medicalSection(era: Era): Section {
  const items = medicalInterventions
    .filter(e => byYear(e.optimalYear, era))
    .sort((a, b) => a.optimalYear - b.optimalYear)
    .map(e => `- **${e.condition} (act by ${e.optimalYear})** — ${e.description} Lives at stake: ${e.estimatedLivesSaved} (risk: ${e.butterflyRisk}).`);
  return { title: 'Lives to Save', body: items.join('\n') };
}

function engineeringSection(era: Era): Section {
  const items = engineeringData
    .filter(e => e.era === era)
    .map(e => {
      const specs = Object.entries(e.keySpecs).map(([k, v]) => `${k}=${v}`).join('; ');
      return `- **${e.conceptName}** — ${e.description} Specs: ${specs}.`;
    });
  return { title: 'Tech of the Day', body: items.join('\n') };
}

function techTransferSection(era: Era): Section {
  const items = techTransferTargets
    .filter(e => byYear(e.optimalYear, era))
    .sort((a, b) => a.optimalYear - b.optimalYear)
    .map(e => `- **${e.concept} (deliver by ${e.optimalYear})** — ${e.description} Recipient: ${e.targetRecipient}. Impact: ${e.estimatedImpact} (risk: ${e.butterflyRisk}).`);
  return { title: 'Knowledge Worth a Fortune', body: items.join('\n') };
}

function placesToLiveSection(era: Era): Section {
  const items = relocationDestinations
    .filter(e => e.decade === era)
    .map(e => `- **${e.city}, ${e.country}** — stability: ${e.politicalStability}. Highlights: ${e.highlights.join('; ')}. Watch out: ${e.cautions.join('; ')}.`);
  return { title: 'Where to Stay', body: items.join('\n') };
}

function placesToVisitSection(era: Era): Section {
  const items = touristDestinations
    .filter(e => e.decade === era)
    .map(e => `- **${e.name}** (${e.location}) — ${e.description} Best time: ${e.bestTimeToVisit}.`);
  return { title: 'Worth a Detour', body: items.join('\n') };
}

// Era-spanning modules get a condensed presence in every briefing.
// Round-robin across categories so the sample isn't all one topic.

/** First step of a numbered protocol, as a single line. */
function firstStep(protocol: string): string {
  const steps = protocol.split(/\s+\d+\.\s+/);
  return (steps[0] ?? protocol).replace(/^\d+\.\s*/, '').trim();
}

function roundRobin<T extends { category: string }>(items: T[], max: number): T[] {
  const byCategory = new Map<string, T[]>();
  for (const item of items) {
    const list = byCategory.get(item.category) ?? [];
    list.push(item);
    byCategory.set(item.category, list);
  }
  const picked: T[] = [];
  let added = true;
  while (picked.length < max && added) {
    added = false;
    for (const list of byCategory.values()) {
      const next = list.shift();
      if (next) {
        picked.push(next);
        added = true;
        if (picked.length >= max) break;
      }
    }
  }
  return picked;
}

function safetySection(): Section {
  const items = roundRobin(safetyProtocols, 8)
    .map(e => `- **${e.title}** — ${firstStep(e.protocol)}`);
  return { title: 'Staying Safe', body: items.join('\n') };
}

function blueprintsSection(): Section {
  const items = roundRobin(blueprintsData, 5)
    .map(e => `- **${e.title} (${e.difficulty})** — ${e.description}`);
  return { title: 'Build It Yourself', body: items.join('\n') };
}

// ----- Assembly -----
function buildBriefing(era: Era): string {
  const sections: Section[] = [
    sceneSection(era),
    betsSection(era),
    marketSection(era),
    headlinesSection(era),
    disastersSection(era),
    medicalSection(era),
    engineeringSection(era),
    techTransferSection(era),
    placesToLiveSection(era),
    placesToVisitSection(era),
    safetySection(),
    blueprintsSection(),
  ];
  const compiled = new Date().toISOString().slice(0, 10);
  const lines: string[] = [
    `# ${era} Time Traveler's Briefing`,
    '',
    `*Compiled ${compiled}. Purpose: pre-departure orientation for a traveler with foreknowledge, heading to ${era}. Grounded in the archive's curated entries.*`,
    '',
    `> A note for your hosts: everything in this briefing is real, documented history. Play it straight - two knowledgeable voices walking a well-prepared traveler into the ${era}. The traveler already knows how it all turns out; the craft is acting naturally, blending in, and never letting on how much they know.`,
    '',
  ];
  for (const s of sections) {
    if (!s.body) continue;
    lines.push(`## ${s.title}`, '', s.body, '');
  }
  lines.push('## Final Words', '', 'Trust the almanac. Blend in. Small bets first.', '');
  return lines.join('\n');
}

// ----- Write -----
const outDir = path.join('data', 'briefings');
mkdirSync(outDir, { recursive: true });
for (const era of erasToWrite) {
  const md = buildBriefing(era);
  const out = path.join(outDir, `${era}-travelers-briefing.md`);
  writeFileSync(out, md);
  const sectionCount = (md.match(/^## /gm) ?? []).length;
  console.log(`wrote ${out} — ${sectionCount} sections, ${md.length} chars`);
}
