# Content Generation Prompts

Prompts to expand the almanac's curated content. Each prompt produces a JSON array
of entries matching the exact TypeScript schema for one module — paste the array
straight into the corresponding `export const` in `src/data/<file>.ts`.

**How to use:** feed one prompt to any capable LLM, then merge the returned JSON
into the matching `src/data/<file>.ts` array (or a new file), run
`pnpm generate:knowledge` to rebuild the quiz knowledge base, and re-verify with
`pnpm test`.

---

## Shared rules (every prompt inherits these)

1. **Historical accuracy is non-negotiable.** Every date, score, name, location,
   and price must be real and verifiable. Do NOT fabricate events, winners, or
   figures to fill space. If you are not certain of a fact, either look it up or
   skip the entry. A wrong entry is worse than no entry.
2. **Time-travel framing.** Each entry must be useful to someone preparing to
   travel to the 1950s–2000s with foreknowledge — write the *why-it-matters* and
   *what-a-traveler-should-do* fields with that in mind, in the app's existing
   voice (confident, practical, slightly wry, never breaking the fiction).
3. **Exact schema.** Output a JSON array of objects using ONLY the listed field
   names and ONLY the listed enum values. No extra fields, no comments, no
   markdown fences around the JSON unless asked.
4. **No duplicates.** Do not repeat anything already present in the module. If
   you cannot see the existing list, ask for it first, or deliberately target an
   under-covered niche (the prompts below name specific gaps to aim for).
5. **Batch size.** Generate 10–20 entries per run; more makes review harder.
6. **IDs.** Use kebab-case IDs (`sports-1980-miracle-on-ice`), stable and unique.

---

## 1. Sports Almanac — `src/data/sports.ts`

Schema:
```
{ id, year, sport, event, winner, loser, score?, odds?, notableDetails,
  region, country?, venue?, playerOfTheTournament?, tags? }
sport: Football | Baseball | Boxing | Horse Racing | Basketball | Hockey
     | Soccer | Olympics | F1 | Tennis | Cricket
region: US | Europe | Asia | South America | Africa | Oceania
```

Prompt:
> You are filling a time traveler's sports almanac covering 1950–2001. Generate
> 15 historically significant games, championships, upsets, or records that a
> traveler with foreknowledge could profit from. Prioritize: (a) famous upsets
> with long odds, (b) iconic individual performances, (c) non-US sports that a
> US-centric list would miss. For each entry give the exact schema fields. The
> `notableDetails` must explain the specific bet a traveler would place and why
> it is a sure thing; `odds` should be the real (or reasonable estimate of the)
> betting line; `score` the final score. Verify every winner, loser, year, and
> score. Do not duplicate existing entries. Output a JSON array only.

---

## 2. Financial Almanac — `src/data/finance.ts`

Schema:
```
{ id, date, year, category, event, direction, peakPrice?, troughPrice?,
  entrySignal, exitSignal, maxLeverage, notableDetails, tags? }
category: Market Crash | Commodity | IPO | Currency | Real Estate
direction: up | down
```

Prompt:
> You are filling a time traveler's financial almanac covering 1950–2001. Generate
> 15 high-conviction market moves a traveler could trade with foreknowledge:
> crashes, commodity spikes, landmark IPOs, currency events, real-estate booms.
> For each, provide the schema fields. `entrySignal`/`exitSignal` must name the
> observable trigger and the top/trough signal a trader would use; `maxLeverage`
> a realistic instrument; `direction` the net move. Prioritize non-US events
> (Japan's bubble, UK, emerging markets) alongside US ones. Verify dates, prices,
> and direction against real history. Do not duplicate existing entries. JSON only.

---

## 3. Era Integration Guide — `src/data/era-guide.ts`

Schema:
```
{ id?, category, era, item, description, advice, tags? }
category: Slang | Prices | Tech Constraints | Fashion | Identity
era: 1970s | 1980s | 1990s | 2000s
```

Prompt:
> You are filling an era-integration guide that teaches a time traveler how to
> blend in during 1970s–2000s. Generate 15 entries — slang terms, everyday prices,
> tech constraints, fashion, or identity norms — a traveler would need to not
> blow their cover. Spread across all four eras and five categories. `item` is a
> short label, `description` the concrete fact (with the real era-appropriate
> price or usage), `advice` a one-line actionable tip for the traveler. Verify
> era-appropriateness. Do not duplicate existing entries. JSON only.

---

## 4. Disaster Prevention — `src/data/disasters.ts`

Schema:
```
{ id, date, year, category, event, location, casualties, cause, intervention,
  deliveryMethod, butterflyRisk, estimatedLivesSaved, tags?,
  butterflyCascade?, historicalConfidence? }
category: Aviation | Industrial | Natural | Terrorism | Public Health
butterflyRisk: Low | Medium | High | Extreme
historicalConfidence?: high | medium | low | contested
```

Prompt:
> You are filling a disaster-prevention dossier for a time traveler. Generate 12
> real, preventable tragedies between 1950–2001 where a low-profile intervention
> could have saved lives. For each: `cause` the root cause, `intervention` the
> specific minimal action, `deliveryMethod` how a traveler would deliver the
> warning/change anonymously, `butterflyRisk` an honest estimate, and
> `estimatedLivesSaved` a realistic range. Set `historicalConfidence` per how
> well-documented the event is. Include `butterflyCascade` only where you know
> concrete downstream effects. Verify facts. Do not duplicate existing entries. JSON only.

---

## 5. Technology Transfer — `src/data/tech-transfer.ts`

Schema:
```
{ id, concept, description, optimalYear, targetRecipient, recipientContext,
  deliveryMethod, estimatedImpact, butterflyRisk, infrastructureReadiness, tags? }
butterflyRisk: Low | Medium | High
```

Prompt:
> You are filling a technology-transfer playbook: which modern ideas to seed, to
> whom, and when, to accelerate good tech between 1950–2001. Generate 12 concepts
> NOT already covered. For each: `optimalYear` the earliest year the recipient
> could actually use it, `targetRecipient` a specific person/org/industry,
> `deliveryMethod` the realistic anonymous channel (patent, letter, prototype),
> `infrastructureReadiness` why the era could build it, `estimatedImpact` a
> concrete measure, `butterflyRisk` honest. Prefer verifiable real-world transfer
> moments over pure science fiction. Do not duplicate existing entries. JSON only.

---

## 6. Medical Interventions — `src/data/medical.ts`

Schema:
```
{ id, condition, description, optimalYear, targetRecipient, deliveryMethod,
  estimatedLivesSaved, butterflyRisk, details, tags? }
butterflyRisk: Low | Medium | High | Extreme
```

Prompt:
> You are filling a medical-interventions dossier: treatments a time traveler
> could seed early to save lives between 1950–2001. Generate 12 conditions NOT
> already covered. For each: `description` the condition and its historical toll,
> `optimalYear` the earliest the intervention was feasible, `targetRecipient`
> who to reach, `deliveryMethod` the realistic channel, `estimatedLivesSaved` a
> grounded range, `butterflyRisk` honest, `details` the specific intervention
> (drug, protocol, device). Medical facts must be accurate. Do not duplicate
> existing entries. JSON only.

---

## 7. Safety & Dead Drops — `src/data/safety.ts`

Schema:
```
{ id, category, title, description, protocol, eraNote, tags? }
category: Identity | Banking | Housing | Medical | Communication | Dead Drops
```

Prompt:
> You are filling a safety-protocol manual for a time traveler operating across
> 1950s–2000s. Generate 12 protocols across the six categories, especially
> Identity, Banking, and Dead Drops (commonly under-covered). `protocol` is the
> step-by-step method, `eraNote` what changes about it by era (no ATMs, no IDs,
> paper trails, payphones), `description` the problem it solves. Keep it
> practical and era-accurate — no anachronisms. Do not duplicate existing
> entries. JSON only.

---

## 8. Bootstrap Blueprints — `src/data/blueprints.ts`

Schema:
```
{ id, title, category, difficulty, historicalEra, description, keyPrinciples[],
  materialsRequired[], tolerances, stepByStepGuide, chronoImpact, tags? }
category: Semiconductors | Machine Tooling | Electronics | Materials & Chemistry
difficulty: Basic | Intermediate | Advanced
```

Prompt:
> You are filling a set of bootstrap blueprints: preserved specs a time traveler
> could use to rebuild foundational technology from scratch. Generate 8 blueprints
> NOT already covered. Each `stepByStepGuide` must be a real, buildable Markdown
> procedure using era-appropriate materials (`materialsRequired`) and realistic
> `tolerances`; `keyPrinciples` the physics/engineering principles; `chronoImpact`
> what enabling this early would change; `difficulty` and `historicalEra` honest.
> Technical content must be correct — if you cannot specify it precisely, skip it.
> Do not duplicate existing entries. JSON only.

---

## 9. Engineering Specifications — `src/data/engineering.ts`

Schema:
```
{ id, era, subDomain, conceptName, description, keySpecs{...},
  provenance{ sourceUrl, sourceSite, confidence, extractedAt }, tags? }
era: 1950s | 1960s | 1970s | 1980s | 1990s | 2000s
subDomain: cnc_machining | semiconductors | metallurgy | aerospace | telecommunications
confidence: high | medium | low | estimated
```

Prompt:
> You are filling an engineering-spec database: era-accurate capabilities of key
> manufacturing/technology domains. Generate 12 specs NOT already covered. For
> each, `keySpecs` must be concrete, correct values for that era (e.g. transistor
> count, machining tolerance, bandwidth) as a flat object of string values.
> `provenance.sourceUrl`/`sourceSite` must be REAL, checkable sources; set
> `confidence` accordingly and `extractedAt` to an ISO date. If you cannot cite a
> real source for a number, mark `confidence: estimated` and omit the URL.
> Do not duplicate existing entries. JSON only.

---

## 10. Places to Live — `src/data/places-to-live.ts`

Schema:
```
{ id, city, country, decade, costOfLivingIndex, qualityOfLifeScore,
  politicalStability, highlights[], cautions[], bestFor[], tags? }
decade: 1970s | 1980s | 1990s | 2000s
politicalStability: Stable | Turbulent | Authoritarian | Transitional
```

Prompt:
> You are filling a relocation guide: where a time traveler could quietly live
> well in 1970s–2000s. Generate 12 cities NOT already covered, across regions.
> `costOfLivingIndex` (1–100, lower = cheaper) and `qualityOfLifeScore` (1–100,
> higher = better) must be internally consistent and era-accurate;
> `politicalStability` honest for that decade; `highlights` 2–3 pros, `cautions`
> 1–2 cons, `bestFor` 1–3 audience tags. Do not duplicate existing entries. JSON only.

---

## 11. Places to Visit — `src/data/places-to-visit.ts`

Schema:
```
{ id, name, location, decade, category, description, bestTimeToVisit,
  costTier, tags? }
decade: 1970s | 1980s | 1990s | 2000s
category: Natural Wonder | Historical Site | Cultural Event | Architectural Marvel
        | Music/Arts Scene | Urban Experience
costTier: Budget | Moderate | Expensive | Luxury
```

Prompt:
> You are filling a travel guide of moments worth visiting in 1970s–2000s —
> a destination at its PEAK in a specific decade. Generate 12 destinations NOT
> already covered. `description` must be evocative and time-specific (why THIS
> decade, not just why this place); `bestTimeToVisit` a specific season/month;
> `costTier` realistic. Avoid anachronisms (e.g. no "before the tourists" claims
> that are false). Do not duplicate existing entries. JSON only.

---

## 12. World Events — `src/data/world-events.ts`

Schema:
```
{ id, year, region, country, category, event, significance, tags? }
region: Americas | Europe | Asia | Africa | Middle East
category: Geopolitical | Economic | Cultural | Scientific | Social
```

Prompt:
> You are filling a world-events timeline (1950–2001) that a time traveler must
> know to avoid saying the wrong thing. Generate 15 events NOT already covered.
> Prioritize Africa, Middle East, and Asia (commonly under-covered) and
> Scientific/Cultural events (not just wars). `significance` must state why a
> traveler needs to know it and what to say/avoid. Verify years and countries.
> Do not duplicate existing entries. JSON only.
