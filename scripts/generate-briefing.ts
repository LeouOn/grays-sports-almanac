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

function betsSection(era: Era, maxItems: number): Section {
  const items = sportsAlmanac
    .filter(e => byYear(e.year, era))
    .sort((a, b) => a.year - b.year)
    .slice(0, maxItems)
    .map(e => `- **${e.event} (${e.year})** — ${e.winner} over ${e.loser}${e.score ? `, ${e.score}` : ''}. ${e.notableDetails}`);
  return { title: "Bets You Can't Lose", body: items.join('\n') };
}

function marketSection(era: Era, maxItems: number): Section {
  const items = financialAlmanac
    .filter(e => byYear(e.year, era))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, maxItems)
    .map(e => `- **${e.event} (${e.date})** — ${e.direction === 'up' ? 'Rising' : 'Falling'}. Entry: ${e.entrySignal} Exit: ${e.exitSignal}. ${e.notableDetails}`);
  return { title: 'Market Moves', body: items.join('\n') };
}

function headlinesSection(era: Era, maxItems: number): Section {
  const items = worldEvents
    .filter(e => byYear(e.year, era))
    .sort((a, b) => a.year - b.year)
    .slice(0, maxItems)
    .map(e => `- **${e.event} (${e.year}, ${e.country})** — ${e.significance}`);
  return { title: 'Headlines You\'ll Live Through', body: items.join('\n') };
}

function disastersSection(era: Era, maxItems: number): Section {
  const items = disasterAlmanac
    .filter(e => byYear(e.year, era))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, maxItems)
    .map(e => `- **${e.event} (${e.date}, ${e.location})** — Cause: ${e.cause}. Play: ${e.intervention} (risk: ${e.butterflyRisk})`);
  return { title: 'Disasters to Watch', body: items.join('\n') };
}

function medicalSection(era: Era, maxItems: number): Section {
  const items = medicalInterventions
    .filter(e => byYear(e.optimalYear, era))
    .sort((a, b) => a.optimalYear - b.optimalYear)
    .slice(0, maxItems)
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

function techTransferSection(era: Era, maxItems: number): Section {
  const items = techTransferTargets
    .filter(e => byYear(e.optimalYear, era))
    .sort((a, b) => a.optimalYear - b.optimalYear)
    .slice(0, maxItems)
    .map(e => `- **${e.concept} (deliver by ${e.optimalYear})** — ${e.description} Recipient: ${e.targetRecipient}. Impact: ${e.estimatedImpact} (risk: ${e.butterflyRisk}).`);
  return { title: 'Knowledge Worth a Fortune', body: items.join('\n') };
}

function placesToLiveSection(era: Era, maxItems: number): Section {
  const items = relocationDestinations
    .filter(e => e.decade === era)
    .slice(0, maxItems)
    .map(e => `- **${e.city}, ${e.country}** — stability: ${e.politicalStability}. Highlights: ${e.highlights.join('; ')}. Watch out: ${e.cautions.join('; ')}.`);
  return { title: 'Where to Stay', body: items.join('\n') };
}

function placesToVisitSection(era: Era, maxItems: number): Section {
  const items = touristDestinations
    .filter(e => e.decade === era)
    .slice(0, maxItems)
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

// ----- Show sections -----
// Host-facing material. Selection/shuffling is deterministic (era-string hash).
// allow: SIZE_OK — single-file exporter per project convention; every section
// is a small builder over the same Section contract.

/** FNV-1a string hash — stable ordering across runs. */
function hashStr(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Clamp text to ~n words; ellipsized when cut, otherwise untouched. */
function clipWords(s: string, n: number): string {
  const words = s.replace(/\s+/g, ' ').trim().split(' ');
  if (words.length <= n) return words.join(' ');
  return `${words.slice(0, n).join(' ').replace(/[,;:.!?]+$/, '')}…`;
}

/** clipWords plus a single terminal period (the ellipsis replaces it when cut). */
function clipSentence(s: string, n: number): string {
  const clipped = clipWords(s, n);
  return clipped.endsWith('…') ? clipped : `${clipped.replace(/\.+$/, '')}.`;
}

/** Price tokens ("$1.19", "$0.90") lifted out of an era-guide description. */
function priceTokens(description: string): string[] {
  return description.match(/\$[\d,]+(?:\.\d+)?/g) ?? [];
}

function numbersSection(era: Era): Section {
  const sports = sportsAlmanac.filter(e => byYear(e.year, era)).sort((a, b) => a.year - b.year);
  const finance = financialAlmanac.filter(e => byYear(e.year, era)).sort((a, b) => a.date.localeCompare(b.date));
  const prices = eraGuideData.filter(e => e.era === era && e.category === 'Prices');

  interface StatLine { text: string; priority: number; group: number; order: number }
  const candidates: StatLine[] = [];
  sports.forEach((e, order) => {
    const tail = `${e.score ? ` ${e.score}` : ''}${e.odds ? ` (${e.odds})` : ''}`;
    candidates.push({
      text: `${e.year} ${e.event}: ${e.winner} d. ${e.loser}${tail}.`,
      priority: (e.odds ? 3 : 0) + (e.score ? 2 : 0),
      group: 0,
      order,
    });
  });
  finance.forEach((e, order) => {
    const price = e.peakPrice ?? e.troughPrice;
    candidates.push({
      text: `${e.year} ${e.event}: ${e.direction}${price ? `, ${price}` : ''}.`,
      priority: price ? 3 : 1,
      group: 1,
      order,
    });
  });
  prices.forEach((e, order) => {
    const costs = priceTokens(e.description);
    const span = costs.length >= 2 ? `${costs[0]} → ${costs[costs.length - 1]}` : costs[0] ?? e.description;
    candidates.push({
      text: `${era} ${e.item}: ${span}.`,
      priority: Math.min(costs.length, 2) + 1,
      group: 2,
      order,
    });
  });
  if (!candidates.length) return { title: 'Numbers to Drop', body: '' };

  // ~30-line cap: keep the richest lines (odds/prices/scores first), then
  // present the survivors back in scan order per group.
  const kept = candidates
    .sort((a, b) => b.priority - a.priority || a.group - b.group || a.order - b.order)
    .slice(0, 29)
    .sort((a, b) => a.group - b.group || a.order - b.order);

  const worlds = worldEvents.filter(e => byYear(e.year, era)).length;
  const count = `${sports.length} championship outcomes, ${finance.length} market moves, ${worlds} world events in this decade`;
  return { title: 'Numbers to Drop', body: [count, ...kept.map(l => l.text)].join('\n') };
}

/** Month/season plus a year for the places quiz question. */
function visitWhen(bestTime: string, decade: string): string {
  return /\d{4}/.test(bestTime) ? bestTime : `${bestTime} ${Number.parseInt(decade, 10) + 5}`;
}

function quizSection(era: Era): Section {
  interface QuizItem { id: string; bucket: number; line: string }
  const items: QuizItem[] = [];

  for (const e of sportsAlmanac.filter(e => byYear(e.year, era))) {
    const question = e.score
      ? `Who won the ${e.event} in ${e.year}, and what was the score?`
      : `Who won the ${e.event} in ${e.year}?`;
    const answer = `${e.winner} over ${e.loser}${e.score ? `, ${e.score}` : ''}.`;
    items.push({ id: `s:${e.id}`, bucket: 0, line: `- **Q:** ${question} **A:** ${answer}` });
  }
  for (const e of financialAlmanac.filter(e => byYear(e.year, era))) {
    items.push({
      id: `f:${e.id}`,
      bucket: 1,
      line: `- **Q:** In ${e.year}, which way did ${e.event} move and why? **A:** ${e.direction}. ${clipSentence(e.notableDetails, 20)}`,
    });
  }
  for (const e of eraGuideData.filter(e => e.era === era && e.category === 'Prices')) {
    items.push({
      id: `p:${e.item}`,
      bucket: 2,
      line: `- **Q:** What did a ${e.item} cost in the ${era}? **A:** ${clipSentence(e.description, 20)}`,
    });
  }
  for (const e of touristDestinations.filter(e => e.decade === era)) {
    items.push({
      id: `v:${e.id}`,
      bucket: 3,
      line: `- **Q:** Where should a traveler be in ${visitWhen(e.bestTimeToVisit, e.decade)} and why? **A:** ${e.name}: ${clipSentence(e.description, 20)}`,
    });
  }
  if (!items.length) return { title: 'The Quiz Bank', body: '' };

  const MAX = 18;
  const quota = [Math.round(MAX * 0.4), 4, 4, 4];
  const shuffled = items
    .map(item => ({ item, k: hashStr(`${era}:${item.id}`) }))
    .sort((a, b) => a.k - b.k)
    .map(x => x.item);
  const picked: QuizItem[] = [];
  const filled = [0, 0, 0, 0];
  // Pass 1 fills bucket quotas (~40/20/20/20); pass 2 tops up eras that are
  // missing a whole bucket (e.g. no era-guide prices before the 1970s).
  for (const topUp of [false, true]) {
    for (const item of shuffled) {
      if (picked.length >= MAX) break;
      if (picked.includes(item)) continue;
      if (!topUp && filled[item.bucket] >= quota[item.bucket]) continue;
      picked.push(item);
      filled[item.bucket]++;
    }
  }
  return { title: 'The Quiz Bank', body: picked.map(p => p.line).join('\n') };
}

function cheatSheetSection(era: Era): Section {
  const sports = sportsAlmanac.filter(e => byYear(e.year, era));
  const finance = financialAlmanac.filter(e => byYear(e.year, era));
  const events = worldEvents.filter(e => byYear(e.year, era)).sort((a, b) => a.year - b.year);
  const guide = eraGuideData.filter(e => e.era === era);
  const disasters = disasterAlmanac.filter(e => byYear(e.year, era)).sort((a, b) => a.date.localeCompare(b.date));
  const homes = relocationDestinations
    .filter(e => e.decade === era)
    .sort((a, b) => b.qualityOfLifeScore - a.qualityOfLifeScore
      || a.costOfLivingIndex - b.costOfLivingIndex
      || a.city.localeCompare(b.city));

  // "Most surprising detail" pool, longest first — powers the free pick and
  // substitutes for categories the era has no data for.
  interface Detail { key: string; line: string }
  const pool: Detail[] = [
    ...sports.map(e => ({ key: `s:${e.id}`, line: `${e.event} (${e.year}): ${e.notableDetails}` })),
    ...finance.map(e => ({ key: `f:${e.id}`, line: `${e.event} (${e.year}): ${e.notableDetails}` })),
    ...events.map(e => ({ key: `w:${e.id}`, line: `${e.event} (${e.year}, ${e.country}): ${e.significance}` })),
  ].sort((a, b) => b.line.length - a.line.length || a.key.localeCompare(b.key));
  const used = new Set<string>();
  const surprise = (): string => {
    const next = pool.find(d => !used.has(d.key));
    if (!next) return '';
    used.add(next.key);
    return next.line;
  };

  const byDetail = (a: { notableDetails: string }, b: { notableDetails: string }) =>
    b.notableDetails.length - a.notableDetails.length;
  const oddsFavorLoser = (odds: string, winner: string, loser: string): boolean => {
    const tokens = odds.split(/[^A-Za-z0-9]+/).filter(t => t.length >= 3);
    return tokens.some(t => loser.includes(t) && !winner.includes(t));
  };

  const facts: string[] = [];

  const upsets = sports.filter(e => e.odds && oddsFavorLoser(e.odds, e.winner, e.loser)).sort(byDetail);
  const upset = upsets[0] ?? [...sports].sort(byDetail)[0];
  if (upset) {
    used.add(`s:${upset.id}`);
    facts.push(`${upset.year}: ${upset.winner} shocked ${upset.loser}${upset.score ? `, ${upset.score}` : ''}${upset.odds ? ` (${upset.odds})` : ''}.`);
  } else facts.push(surprise());

  const move = [...finance].sort(byDetail)[0];
  if (move) {
    used.add(`f:${move.id}`);
    const price = move.peakPrice ?? move.troughPrice;
    facts.push(`${move.event} (${move.year}): went ${move.direction}${price ? ` — ${price}` : ''}.`);
  } else facts.push(surprise());

  const anchor = guide.find(e => e.category === 'Prices' && /gas/i.test(e.item))
    ?? guide.find(e => e.category === 'Prices' && /bread/i.test(e.item));
  if (anchor) facts.push(`${anchor.item}, ${era}: ${anchor.description}`);
  else facts.push(surprise());

  const slang = guide.find(e => e.category === 'Slang');
  if (slang) facts.push(`Slang to deploy: ${slang.item} — ${slang.description}`);
  else facts.push(surprise());

  const headline = events[0];
  if (headline) {
    used.add(`w:${headline.id}`);
    facts.push(`${headline.year}: ${headline.event} (${headline.country}) — ${headline.significance}`);
  } else facts.push(surprise());

  const disaster = disasters[0];
  if (disaster) facts.push(`${disaster.event}, ${disaster.year} (${disaster.location}) — ${disaster.casualties}.`);
  else facts.push(surprise());

  const home = homes[0];
  if (home) facts.push(`Best base: ${home.city}, ${home.country} — ${home.highlights.join('; ')}.`);
  else facts.push(surprise());

  const constraint = guide.find(e => e.category === 'Tech Constraints');
  if (constraint) facts.push(`${constraint.item}: ${constraint.description}`);
  else facts.push(surprise());

  facts.push('Sign-off: trust the almanac, blend in, place small bets first.');
  facts.push(surprise());

  const body = facts
    .filter(f => f)
    .map((f, i) => `${i + 1}. **${clipWords(f, 25)}**`)
    .join('\n');
  return { title: 'Era Cheat Sheet', body };
}

// ----- Assembly -----
function renderBriefing(era: Era, listCap: number): string {
  const sections: Section[] = [
    sceneSection(era),
    numbersSection(era),
    betsSection(era, listCap),
    marketSection(era, listCap),
    headlinesSection(era, listCap),
    disastersSection(era, listCap),
    medicalSection(era, listCap),
    engineeringSection(era),
    techTransferSection(era, listCap),
    placesToLiveSection(era, listCap),
    placesToVisitSection(era, listCap),
    safetySection(),
    blueprintsSection(),
    quizSection(era),
    cheatSheetSection(era),
  ];
  const compiled = new Date().toISOString().slice(0, 10);
  const lines: string[] = [
    `# ${era} Time Traveler's Briefing`,
    '',
    `*Compiled ${compiled}. Purpose: pre-departure orientation for a traveler with foreknowledge, heading to ${era}. Grounded in the archive's curated entries.*`,
    '',
    `> A note for your hosts: everything in this briefing is real, documented history. Play it straight - two knowledgeable voices walking a well-prepared traveler into the ${era}. The traveler already knows how it all turns out; the craft is acting naturally, blending in, and never letting on how much they know.`,
    '',
    '## For the Show',
    '',
    '*How to read this briefing on air:* You are two hosts preparing a traveler who departs tomorrow. One of you is **The Archivist** — cautious, obsessed with blending in and butterfly risk. The other is **The Bookie** — greedy, dizzy with foreknowledge, always chasing the next lock. Play the tension. When one of you cites a number from this briefing, the other should challenge or riff on it. Do NOT read lists aloud — pick favorites and argue about them.',
    '',
  ];
  for (const s of sections) {
    if (!s.body) continue;
    lines.push(`## ${s.title}`, '', s.body, '');
  }
  lines.push('## Final Words', '', 'Trust the almanac. Blend in. Small bets first.', '');
  return lines.join('\n');
}

function buildBriefing(era: Era): string {
  let md = renderBriefing(era, Number.POSITIVE_INFINITY);
  const BUDGET = 74_500;
  if (md.length > BUDGET) {
    // Dense eras (the 1970s archive alone exceeds 73k): binary-search the
    // largest per-section item cap whose briefing fits the budget.
    let lo = 4;
    let hi = 200;
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      if (renderBriefing(era, mid).length <= BUDGET) lo = mid;
      else hi = mid - 1;
    }
    md = renderBriefing(era, lo);
  }
  return md;
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
