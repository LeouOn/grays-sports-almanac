// Registry of the 12 content modules the Wikipedia-grounded generator can fill.
// Each zod schema mirrors the module's TS interface in src/data/*.ts EXACTLY
// (same fields, same enums, optionals as .optional()) so validated entries slot
// into the existing arrays after human review with no type changes.
// Prompts are copied verbatim from docs/content-prompts.md (sections 1-12).
import { z } from 'zod';

const sportsSchema = z.object({
  id: z.string(),
  year: z.number().int(),
  sport: z.enum(['Football','Baseball','Boxing','Horse Racing','Basketball','Hockey','Soccer','Olympics','F1','Tennis','Cricket']),
  event: z.string(),
  winner: z.string(),
  loser: z.string(),
  score: z.string().optional(),
  odds: z.string().optional(),
  notableDetails: z.string(),
  region: z.enum(['US','Europe','Asia','South America','Africa','Oceania']),
  country: z.string().optional(),
  venue: z.string().optional(),
  playerOfTheTournament: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const financeSchema = z.object({
  id: z.string(),
  date: z.string(),
  year: z.number().int(),
  category: z.enum(['Market Crash','Commodity','IPO','Currency','Real Estate']),
  event: z.string(),
  direction: z.enum(['up','down']),
  peakPrice: z.string().optional(),
  troughPrice: z.string().optional(),
  entrySignal: z.string(),
  exitSignal: z.string(),
  maxLeverage: z.string(),
  notableDetails: z.string(),
  tags: z.array(z.string()).optional(),
});

const eraGuideSchema = z.object({
  id: z.string().optional(),
  category: z.enum(['Slang','Prices','Tech Constraints','Fashion','Identity']),
  era: z.enum(['1970s','1980s','1990s','2000s']),
  item: z.string(),
  description: z.string(),
  advice: z.string(),
  tags: z.array(z.string()).optional(),
});

const disastersSchema = z.object({
  id: z.string(),
  date: z.string(),
  year: z.number().int(),
  category: z.enum(['Aviation','Industrial','Natural','Terrorism','Public Health']),
  event: z.string(),
  location: z.string(),
  casualties: z.string(),
  cause: z.string(),
  intervention: z.string(),
  deliveryMethod: z.string(),
  butterflyRisk: z.enum(['Low','Medium','High','Extreme']),
  estimatedLivesSaved: z.string(),
  tags: z.array(z.string()).optional(),
  butterflyCascade: z.array(z.string()).optional(),
  historicalConfidence: z.enum(['high','medium','low','contested']).optional(),
});

const techTransferSchema = z.object({
  id: z.string(),
  concept: z.string(),
  description: z.string(),
  optimalYear: z.number().int(),
  targetRecipient: z.string(),
  recipientContext: z.string(),
  deliveryMethod: z.string(),
  estimatedImpact: z.string(),
  butterflyRisk: z.enum(['Low','Medium','High']),
  infrastructureReadiness: z.string(),
  tags: z.array(z.string()).optional(),
});

const medicalSchema = z.object({
  id: z.string(),
  condition: z.string(),
  description: z.string(),
  optimalYear: z.number().int(),
  targetRecipient: z.string(),
  deliveryMethod: z.string(),
  estimatedLivesSaved: z.string(),
  butterflyRisk: z.enum(['Low','Medium','High','Extreme']),
  details: z.string(),
  tags: z.array(z.string()).optional(),
});

const safetySchema = z.object({
  id: z.string(),
  category: z.enum(['Identity','Banking','Housing','Medical','Communication','Dead Drops']),
  title: z.string(),
  description: z.string(),
  protocol: z.string(),
  eraNote: z.string(),
  tags: z.array(z.string()).optional(),
});

const blueprintsSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.enum(['Semiconductors','Machine Tooling','Electronics','Materials & Chemistry']),
  difficulty: z.enum(['Basic','Intermediate','Advanced']),
  historicalEra: z.string(),
  description: z.string(),
  keyPrinciples: z.array(z.string()),
  materialsRequired: z.array(z.string()),
  tolerances: z.string(),
  stepByStepGuide: z.string(),
  chronoImpact: z.string(),
  tags: z.array(z.string()).optional(),
});

const confidenceSchema = z.preprocess(
  (v) => {
    if (typeof v !== 'string') return v;
    const s = v.trim().toLowerCase();
    // Models invent synonyms ("accurate", "verified"). Rather than guessing
    // intent, an unrecognized value degrades to "estimated" - the enum's
    // semantic meaning for unquantified trustworthiness.
    return (['high', 'medium', 'low', 'estimated'] as const).includes(s as 'high') ? s : 'estimated';
  },
  z.enum(['high', 'medium', 'low', 'estimated']),
);

const engineeringSchema = z.object({
  id: z.string(),
  era: z.enum(['1950s','1960s','1970s','1980s','1990s','2000s']),
  subDomain: z.enum(['cnc_machining','semiconductors','metallurgy','aerospace','telecommunications']),
  conceptName: z.string(),
  description: z.string(),
  keySpecs: z.record(z.string()),
  provenance: z.object({
    sourceUrl: z.string(),
    sourceSite: z.string(),
    confidence: confidenceSchema,
    extractedAt: z.string(),
  }),
  tags: z.array(z.string()).optional(),
});

const placesToLiveSchema = z.object({
  id: z.string(),
  city: z.string(),
  country: z.string(),
  decade: z.enum(['1970s','1980s','1990s','2000s']),
  costOfLivingIndex: z.number().int().min(1).max(100),
  qualityOfLifeScore: z.number().int().min(1).max(100),
  politicalStability: z.enum(['Stable','Turbulent','Authoritarian','Transitional']),
  highlights: z.array(z.string()),
  cautions: z.array(z.string()),
  bestFor: z.array(z.string()),
  tags: z.array(z.string()).optional(),
});

const placesToVisitSchema = z.object({
  id: z.string(),
  name: z.string(),
  location: z.string(),
  decade: z.enum(['1970s','1980s','1990s','2000s']),
  category: z.enum(['Natural Wonder','Historical Site','Cultural Event','Architectural Marvel','Music/Arts Scene','Urban Experience']),
  description: z.string(),
  bestTimeToVisit: z.string(),
  costTier: z.enum(['Budget','Moderate','Expensive','Luxury']),
  tags: z.array(z.string()).optional(),
});

const worldEventsSchema = z.object({
  id: z.string(),
  year: z.number().int(),
  region: z.enum(['Americas','Europe','Asia','Africa','Middle East']),
  country: z.string(),
  category: z.enum(['Geopolitical','Economic','Cultural','Scientific','Social']),
  event: z.string(),
  significance: z.string(),
  tags: z.array(z.string()).optional(),
});

export interface ContentModule {
  id: string;
  schema: z.ZodTypeAny;
  prompt: string;
  gapHint: string;
  existingIds: () => string[];
  existingTitles: () => string[];
  existingYears: () => number[];
}

// Module registry. `prompt` is sourced from docs/content-prompts.md (copy the
// "Prompt:" paragraph for that numbered module). Keep them concise — one
// short paragraph each, no extra rules here (the gap hint handles the gap-focus,
// and the runtime system prompt in generate-content.ts handles tool usage).
export const MODULES: Record<string, ContentModule> = {
  sports: {
    id: 'sports',
    schema: sportsSchema,
    gapHint: 'Prefer non-US events, non-US sports (Soccer, Hockey, Cricket), and iconic upsets. Avoid duplicating the US-heavy existing set.',
    prompt: 'You are filling a time traveler\'s sports almanac covering 1950–2001. Generate 15 historically significant games, championships, upsets, or records that a traveler with foreknowledge could profit from. Prioritize: (a) famous upsets with long odds, (b) iconic individual performances, (c) non-US sports that a US-centric list would miss. For each entry give the exact schema fields. The `notableDetails` must explain the specific bet a traveler would place and why it is a sure thing; `odds` should be the real (or reasonable estimate of the) betting line; `score` the final score. Verify every winner, loser, year, and score. Do not duplicate existing entries. Output a JSON array only.',
    existingIds: () => [],
    existingTitles: () => [],
    existingYears: () => [],
  },
  finance: {
    id: 'finance',
    schema: financeSchema,
    gapHint: 'GAP: zero entries in 1950s/1960s; only 2 in 2000s. Prioritize those eras alongside US events.',
    prompt: 'You are filling a time traveler\'s financial almanac covering 1950–2001. Generate 15 high-conviction market moves a traveler could trade with foreknowledge: crashes, commodity spikes, landmark IPOs, currency events, real-estate booms. For each, provide the schema fields. `entrySignal`/`exitSignal` must name the observable trigger and the top/trough signal a trader would use; `maxLeverage` a realistic instrument; `direction` the net move. Prioritize non-US events (Japan\'s bubble, UK, emerging markets) alongside US ones. Verify dates, prices, and direction against real history. Do not duplicate existing entries. JSON only.',
    existingIds: () => [],
    existingTitles: () => [],
    existingYears: () => [],
  },
  'era-guide': {
    id: 'era-guide',
    schema: eraGuideSchema,
    gapHint: 'GAP: 1990s/2000s weak; Fashion only 6, Slang only 7. Spread across all four eras and five categories.',
    prompt: 'You are filling an era-integration guide that teaches a time traveler how to blend in during 1970s–2000s. Generate 15 entries — slang terms, everyday prices, tech constraints, fashion, or identity norms — a traveler would need to not blow their cover. Spread across all four eras and five categories. `item` is a short label, `description` the concrete fact (with the real era-appropriate price or usage), `advice` a one-line actionable tip for the traveler. Verify era-appropriateness. Do not duplicate existing entries. JSON only.',
    existingIds: () => [],
    existingTitles: () => [],
    existingYears: () => [],
  },
  disasters: {
    id: 'disasters',
    schema: disastersSchema,
    gapHint: 'GAP: only 4 entries in 1990s and 2 in 2000s. Diversify across categories and eras.',
    prompt: 'You are filling a disaster-prevention dossier for a time traveler. Generate 12 real, preventable tragedies between 1950–2001 where a low-profile intervention could have saved lives. For each: `cause` the root cause, `intervention` the specific minimal action, `deliveryMethod` how a traveler would deliver the warning/change anonymously, `butterflyRisk` an honest estimate, and `estimatedLivesSaved` a realistic range. Set `historicalConfidence` per how well-documented the event is. Include `butterflyCascade` only where you know concrete downstream effects. Verify facts. Do not duplicate existing entries. JSON only.',
    existingIds: () => [],
    existingTitles: () => [],
    existingYears: () => [],
  },
  'tech-transfer': {
    id: 'tech-transfer',
    schema: techTransferSchema,
    gapHint: 'Cover diverse optimalYears across the full 1950-2001 range; prefer verifiable real transfer moments.',
    prompt: 'You are filling a technology-transfer playbook: which modern ideas to seed, to whom, and when, to accelerate good tech between 1950–2001. Generate 12 concepts NOT already covered. For each: `optimalYear` the earliest year the recipient could actually use it, `targetRecipient` a specific person/org/industry, `deliveryMethod` the realistic anonymous channel (patent, letter, prototype), `infrastructureReadiness` why the era could build it, `estimatedImpact` a concrete measure, `butterflyRisk` honest. Prefer verifiable real-world transfer moments over pure science fiction. Do not duplicate existing entries. JSON only.',
    existingIds: () => [],
    existingTitles: () => [],
    existingYears: () => [],
  },
  medical: {
    id: 'medical',
    schema: medicalSchema,
    gapHint: 'Diversify across the 1950-2001 range. Medical facts must be accurate.',
    prompt: 'You are filling a medical-interventions dossier: treatments a time traveler could seed early to save lives between 1950–2001. Generate 12 conditions NOT already covered. For each: `description` the condition and its historical toll, `optimalYear` the earliest the intervention was feasible, `targetRecipient` who to reach, `deliveryMethod` the realistic channel, `estimatedLivesSaved` a grounded range, `butterflyRisk` honest, `details` the specific intervention (drug, protocol, device). Medical facts must be accurate. Do not duplicate existing entries. JSON only.',
    existingIds: () => [],
    existingTitles: () => [],
    existingYears: () => [],
  },
  safety: {
    id: 'safety',
    schema: safetySchema,
    gapHint: 'GAP: especially under-cover Identity, Banking, Dead Drops. protocol step-by-step, eraNote what changes by era.',
    prompt: 'You are filling a safety-protocol manual for a time traveler operating across 1950s–2000s. Generate 12 protocols across the six categories, especially Identity, Banking, and Dead Drops (commonly under-covered). `protocol` is the step-by-step method, `eraNote` what changes about it by era (no ATMs, no IDs, paper trails, payphones), `description` the problem it solves. Keep it practical and era-accurate — no anachronisms. Do not duplicate existing entries. JSON only.',
    existingIds: () => [],
    existingTitles: () => [],
    existingYears: () => [],
  },
  blueprints: {
    id: 'blueprints',
    schema: blueprintsSchema,
    gapHint: 'GAP: only 8 entries. Cover all four categories.',
    prompt: 'You are filling a set of bootstrap blueprints: preserved specs a time traveler could use to rebuild foundational technology from scratch. Generate 8 blueprints NOT already covered. Each `stepByStepGuide` must be a real, buildable Markdown procedure using era-appropriate materials (`materialsRequired`) and realistic `tolerances`; `keyPrinciples` the physics/engineering principles; `chronoImpact` what enabling this early would change; `difficulty` and `historicalEra` honest. Technical content must be correct — if you cannot specify it precisely, skip it. Do not duplicate existing entries. JSON only.',
    existingIds: () => [],
    existingTitles: () => [],
    existingYears: () => [],
  },
  engineering: {
    id: 'engineering',
    schema: engineeringSchema,
    gapHint: 'CRITICAL GAP: ZERO entries in 1980s, 1990s, 2000s. Prioritize those eras. keySpecs must be era-accurate (real transistor counts, machining tolerances, bandwidths). provenance must cite a real source URL or mark confidence=estimated and omit URL.',
    prompt: 'You are filling an engineering-spec database: era-accurate capabilities of key manufacturing/technology domains. Generate 12 specs NOT already covered. For each, `keySpecs` must be concrete, correct values for that era (e.g. transistor count, machining tolerance, bandwidth) as a flat object of string values. `provenance.sourceUrl`/`sourceSite` must be REAL, checkable sources; set `confidence` accordingly and `extractedAt` to an ISO date. If you cannot cite a real source for a number, mark `confidence: estimated` and omit the URL. Do not duplicate existing entries. JSON only.',
    existingIds: () => [],
    existingTitles: () => [],
    existingYears: () => [],
  },
  'places-to-live': {
    id: 'places-to-live',
    schema: placesToLiveSchema,
    gapHint: 'Diversify across decades 1970s-2000s and all four political-stability categories.',
    prompt: 'You are filling a relocation guide: where a time traveler could quietly live well in 1970s–2000s. Generate 12 cities NOT already covered, across regions. `costOfLivingIndex` (1–100, lower = cheaper) and `qualityOfLifeScore` (1–100, higher = better) must be internally consistent and era-accurate; `politicalStability` honest for that decade; `highlights` 2–3 pros, `cautions` 1–2 cons, `bestFor` 1–3 audience tags. Do not duplicate existing entries. JSON only.',
    existingIds: () => [],
    existingTitles: () => [],
    existingYears: () => [],
  },
  'places-to-visit': {
    id: 'places-to-visit',
    schema: placesToVisitSchema,
    gapHint: 'GAP: 1990s/2000s weak (8 each). description must be decade-specific. Avoid anachronisms.',
    prompt: 'You are filling a travel guide of moments worth visiting in 1970s–2000s — a destination at its PEAK in a specific decade. Generate 12 destinations NOT already covered. `description` must be evocative and time-specific (why THIS decade, not just why this place); `bestTimeToVisit` a specific season/month; `costTier` realistic. Avoid anachronisms (e.g. no "before the tourists" claims that are false). Do not duplicate existing entries. JSON only.',
    existingIds: () => [],
    existingTitles: () => [],
    existingYears: () => [],
  },
  'world-events': {
    id: 'world-events',
    schema: worldEventsSchema,
    gapHint: 'GAP: Africa/Middle East/Asia underrepresented. significance must say what a traveler needs to know + what to say/avoid.',
    prompt: 'You are filling a world-events timeline (1950–2001) that a time traveler must know to avoid saying the wrong thing. Generate 15 events NOT already covered. Prioritize Africa, Middle East, and Asia (commonly under-covered) and Scientific/Cultural events (not just wars). `significance` must state why a traveler needs to know it and what to say/avoid. Verify years and countries. Do not duplicate existing entries. JSON only.',
    existingIds: () => [],
    existingTitles: () => [],
    existingYears: () => [],
  },
};

export function setModuleExistence(modId: string, ids: string[], titles: string[], years: number[]): void {
  const m = MODULES[modId];
  if (!m) throw new Error(`unknown module: ${modId}`);
  m.existingIds = () => ids;
  m.existingTitles = () => titles;
  m.existingYears = () => years;
}

export const MODULE_KEYS = Object.keys(MODULES);
