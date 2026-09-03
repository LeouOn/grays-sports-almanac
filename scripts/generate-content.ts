#!/usr/bin/env tsx
// Wikipedia-grounded content generator. Per module, the LLM gets wikiSearch/wikiRead
// tools and a module-specific prompt; it reads live Wikipedia (Kiwix) first, then
// drafts almanac entries grounded in the article text. Output is staged to
// data/generated/ for human review - never auto-merged.
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { generateText, stepCountIs, type LanguageModelV2 } from 'ai';
import { z, type ZodTypeAny } from 'zod';
import { KiwixClient, createWikiTools } from '../server/wiki-tools.js';
import { getModel, type ProviderId } from '../server/providers.js';
import { MODULES, MODULE_KEYS, setModuleExistence } from './content-modules.js';
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
function arg(name: string, def?: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  if (i < 0) return def;
  return process.argv[i + 1];
}
const MODULE = arg('module');
if (!MODULE || !MODULE_KEYS.includes(MODULE)) {
  console.error(`Usage: tsx scripts/generate-content.ts --module <mod> [--eras <e1,e2,...>] [--count <N>] [--out <path>]`);
  console.error(`  modules: ${MODULE_KEYS.join(', ')}`);
  console.error('  Requires: KIWIX_URL (default http://localhost:8080) + KIWIX_ZIM + an LLM API key');
  process.exit(1);
}
const ERAS = (arg('eras') ?? '').split(',').map(s => s.trim()).filter(Boolean);
const COUNT = parseInt(arg('count', '8')!, 10);
const OUT = arg('out') ?? path.join('data', 'generated', `${MODULE}-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);

// ----- Load existing data for dedup -----
const existing = {
  sports:              { ids: sportsAlmanac.map(e => e.id),                         titles: sportsAlmanac.map(e => e.event),         years: sportsAlmanac.map(e => e.year) },
  finance:             { ids: financialAlmanac.map(e => e.id),                      titles: financialAlmanac.map(e => e.event),      years: financialAlmanac.map(e => e.year) },
  'era-guide':         { ids: eraGuideData.map(e => e.id ?? '').filter(Boolean),     titles: eraGuideData.map(e => e.item),           years: eraGuideData.map(() => 0) },
  disasters:           { ids: disasterAlmanac.map(e => e.id),                        titles: disasterAlmanac.map(e => e.event),       years: disasterAlmanac.map(e => e.year) },
  'tech-transfer':     { ids: techTransferTargets.map(e => e.id),                     titles: techTransferTargets.map(e => e.concept),  years: techTransferTargets.map(e => e.optimalYear) },
  medical:             { ids: medicalInterventions.map(e => e.id),                   titles: medicalInterventions.map(e => e.condition), years: medicalInterventions.map(e => e.optimalYear) },
  safety:              { ids: safetyProtocols.map(e => e.id),                        titles: safetyProtocols.map(e => e.title),       years: safetyProtocols.map(() => 0) },
  blueprints:          { ids: blueprintsData.map(e => e.id),                         titles: blueprintsData.map(e => e.title),         years: blueprintsData.map(() => 0) },
  engineering:         { ids: engineeringData.map(e => e.id),                        titles: engineeringData.map(e => e.conceptName),  years: engineeringData.map(e => Number((e.era || '').replace(/\D/g, '')) || 0) },
  'places-to-live':    { ids: relocationDestinations.map(e => e.id),                  titles: relocationDestinations.map(e => `${e.city}, ${e.country}`), years: relocationDestinations.map(e => Number((e.decade || '').replace(/\D/g, '')) || 0) },
  'places-to-visit':   { ids: touristDestinations.map(e => e.id),                     titles: touristDestinations.map(e => e.name),     years: touristDestinations.map(e => Number((e.decade || '').replace(/\D/g, '')) || 0) },
  'world-events':      { ids: worldEvents.map(e => e.id),                            titles: worldEvents.map(e => e.event),            years: worldEvents.map(e => e.year) },
} as const;
const e = (existing as Record<string, { ids: string[]; titles: string[]; years: number[] }>)[MODULE];
setModuleExistence(MODULE, e.ids, e.titles, e.years);

// ----- Kiwix + LLM -----
const kiwix = new KiwixClient();
if (!(await kiwix.ping())) {
  console.error('Kiwix not reachable. Start: data/bin/kiwix/kiwix-serve.exe --port=8080 data/zim/<zim>');
  process.exit(2);
}
const model: LanguageModelV2 = (() => {
  const chain: ProviderId[] = (process.env.RUN_PROVIDER
    ? [process.env.RUN_PROVIDER as ProviderId, 'minimax', 'openrouter']
    : ['minimax', 'openrouter']) as ProviderId[];
  for (const pid of chain) {
    try { return getModel(pid); } catch { /* try next */ }
  }
  throw new Error('no run model available - set RUN_PROVIDER or provide API keys');
})();
const wikiTools = createWikiTools(kiwix);

// ----- Generation -----
// The doc prompts reference "the schema fields" abstractly, so render the
// module's zod schema into a concrete field list the model can follow.
function schemaFieldSpec(schema: ZodTypeAny): string {
  const shape = (schema as z.ZodObject<z.ZodRawShape>).shape;
  return Object.entries(shape)
    .map(([name, def]) => {
      const optional = def.isOptional();
      let inner: z.ZodTypeAny = def;
      while (inner instanceof z.ZodOptional) inner = inner.unwrap();
      let type: string;
      if (inner instanceof z.ZodEnum) {
        type = `one of ${inner.options.map(o => `"${String(o)}"`).join(' | ')}`;
      } else if (inner instanceof z.ZodNumber) {
        type = 'integer number';
      } else if (inner instanceof z.ZodArray) {
        type = 'array of strings';
      } else if (inner instanceof z.ZodRecord) {
        type = 'flat object of string keys to string values';
      } else if (inner instanceof z.ZodObject) {
        type = `object with exactly these fields: ${Object.keys(inner.shape).join(', ')}`;
      } else {
        type = 'string';
      }
      return `  ${name}${optional ? ' (optional)' : ''}: ${type}`;
    })
    .join('\n');
}

const mod = MODULES[MODULE]!;
const eraClause = ERAS.length ? `\nFocus strictly on these eras: ${ERAS.join(', ')}.` : '';
const system = `${mod.prompt}\n\nGap-focus for this module: ${mod.gapHint}${eraClause}\n\nSCHEMA for every ${MODULE} entry - use EXACTLY these fields (required unless marked optional; NO extra fields):\n${schemaFieldSpec(mod.schema)}\nThe id field is required: kebab-case, unique, prefixed like "${MODULE}-<year-or-era>-<short-slug>".\n\nIMPORTANT: Use the wikiSearch and wikiRead tools FIRST. Search the local Wikipedia for real articles relevant to this era/module, then read at least 2-3 of them to ground your facts. Tool budget: at most 3 wikiSearch and 4 wikiRead calls total - after that, STOP calling tools and write the final answer. Cite no sources in the output entries themselves (sources are recorded separately); just produce facts you are confident are in the articles you read.\n\nOUTPUT FORMAT: Reply with ONLY a JSON array of entry objects (no markdown fences, no commentary). Each object must use ONLY the schema fields for the ${MODULE} module - no extras. Generate exactly ${COUNT} high-quality entries.`;
const userPrompt = `Generate ${COUNT} entries for the ${MODULE} module${ERAS.length ? ', eras ' + ERAS.join(', ') : ''}. Existing entry count: ${mod.existingIds().length} (use these only as anti-examples - do not duplicate or paraphrase). Verify every fact before writing. Reply with the JSON array only.`;

let parsedRaw: unknown = null;
try {
  const res = await generateText({
    model,
    tools: wikiTools,
    stopWhen: stepCountIs(24),
    maxOutputTokens: 8000,
    // Reasoning models can loop on tool calls past the prompt budget; force
    // tools off after step 12 so the model must write its final answer.
    prepareStep: ({ stepNumber }) =>
      stepNumber >= 12 ? { toolChoice: { type: 'none' } } : {},
    system,
    prompt: userPrompt,
  });
  // Some providers (e.g. MiniMax) inline <think>...</think> reasoning in the
  // final text - strip it before locating the JSON payload.
  const stripThink = (s: string) => s.replace(/<think>[\s\S]*<\/think>/g, '').trim();
  const text = stripThink(res.text);
  // Reasoning models sometimes end on a pure-think step; the answer may live in
  // an earlier step, so scan all step texts before giving up.
  const allStepsText = stripThink(res.steps.map(s => s.text).join('\n'));
  const haystack = text || allStepsText;
  // Find the JSON array in the final text
  const m = haystack.match(/\[[\s\S]*\]/);
  try {
    parsedRaw = m ? JSON.parse(m[0]) : JSON.parse(haystack);
  } catch (err) {
    console.error(`Could not parse JSON from model output (steps=${res.steps.length}, finish=${res.finishReason}). First 300 chars:`);
    console.error(haystack.slice(0, 300));
    throw err;
  }
} catch (err) {
  console.error('Generation failed:', err instanceof Error ? err.message : err);
  process.exit(3);
}
if (!Array.isArray(parsedRaw)) {
  console.error('LLM did not return a JSON array.');
  process.exit(4);
}

const validated: unknown[] = [];
let rejected = 0;
let rejectSample = '';
const rejectedSamples: { entry: unknown; issues: string[] }[] = [];
for (const item of parsedRaw) {
  const r = (mod.schema as ZodTypeAny).safeParse(item);
  if (r.success) validated.push(r.data);
  else {
    rejected += 1;
    const issues = r.error.issues.slice(0, 3).map(i => `${i.path.join('.') || '(root)'}: ${i.message}`);
    if (!rejectSample) rejectSample = issues[0] ?? '';
    if (rejectedSamples.length < 5) rejectedSamples.push({ entry: item, issues });
  }
}
if (rejected > 0) console.error(`rejected ${rejected}/${parsedRaw.length} entries; first issue - ${rejectSample}`);

const existingIdSet = new Set(mod.existingIds());
const existingTitleSet = new Set(mod.existingTitles().map(t => t.toLowerCase()));
let deduped = 0;
const entries = validated.filter((e: any) => {
  if (!e) return false;
  if (e.id && existingIdSet.has(e.id)) { deduped++; return false; }
  const titleField = (['event','item','title','concept','condition','name','conceptName'] as const).find(k => typeof e[k] === 'string');
  if (titleField && existingTitleSet.has((e[titleField] as string).toLowerCase())) { deduped++; return false; }
  return true;
});

const sources: { articlePath: string; title: string; snippet: string }[] = [];

mkdirSync(path.dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify({
  module: MODULE,
  eras: ERAS,
  generatedAt: new Date().toISOString(),
  schemaVersion: 1,
  counts: { generated: parsedRaw.length, validated: validated.length, rejected, deduped },
  entries,
  rejectedSamples,
  sources,
}, null, 2));

console.log(`module: ${MODULE}`);
console.log(`eras:   ${ERAS.length ? ERAS.join(',') : '(module default)'}`);
console.log(`count:  ${COUNT}`);
console.log(`output: ${OUT}`);
console.log(`counts: generated=${parsedRaw.length} validated=${validated.length} rejected=${rejected} deduped=${deduped}`);
