# Athena Broader Integration — Design Spec

> **Date:** 2026-06-03
> **Status:** Awaiting user review
> **Project:** `backtothefuture` — Time Traveler's Guide learning app
> **Goal:** Extend Athena's presence from "default companion with prompt" into a memory-palace-building guide that actively helps the user link knowledge across domains, retain content through mnemonics, and adapt its voice to the user's competency.

---

## 1. Context (decisions already made)

Through brainstorming, the following are locked in:

- **Phase scope**: Phase 1 (light touch everywhere) + a subset of Phase 2. The subset is **#2 cross-topic connections**, **#1 mnemonics on data pages**, **#4 tier-aware quiz feedback**. **#3 periodic reactivation is deferred to v2**.
- **LLM call strategy (Q3)**: **B — Smart hybrid**. Greeting + search context = templated (no LLM). Mnemonics, cross-topic connections, and quiz reactions = fresh LLM calls, cached after first generation.
- **Cache strategy**: localStorage keyed by `(userName, routeId, dataVersion)` with a 7-day TTL. Cache key prefix scheme: `tt-palace-{mode}-{routeId}`.
- **Provider routing**: Stick with the existing `COMPANION_PROVIDER_FALLBACK = ['minimax', 'zhipu', 'deepseek', 'google']`. No new providers.
- **Server surface**: Add **one new endpoint** `/api/companion/palace-link` for runtime cross-topic synthesis (the only feature that genuinely needs a runtime LLM call). The existing `/api/companion/comment` is **unchanged** — `CompanionThought` keeps working as-is. Mnemonics and quiz reactions are precomputed and live entirely on the client (imported from `athena-static.json`).

**What is NOT changing**: Athena's prompt (`athena.ts`), the seed preferences (`athena-preferences.ts`), `CompanionContext` state shape, the existing `CompanionThought` call signature, `useCompetency` semantics. The integration is additive — it slots new components and a new mode flag into the existing pipeline.

---

## 2. Architecture

The new pieces compose on top of the existing companion pipeline. The pattern is: **one new endpoint** (`/api/companion/palace-link`) for the only feature requiring a runtime LLM call (cross-topic synthesis), three **new React components** that follow the existing `CompanionThought` pattern, and a **localStorage cache helper** for that one runtime-LLM feature. Mnemonics and quiz reactions are precomputed at build time and imported as static JSON on the client — they never touch the server.

```
[USER ACTION]
   │
   ├── Visits data page ───────────────► <CompanionThought>    (existing — unchanged)
   │                                     <PalaceHook>          (NEW — precomputed, sync)
   │                                     <RelatedEntries>      (existing — unchanged)
   │                                     <PalaceLink>          (NEW — runtime LLM, cached)
   │
   ├── Submits Quiz answer ────────────► Existing post-answer feedback
   │                                     <AthenaQuizReaction>  (NEW — precomputed, sync)
   │
   └── Loads dashboard / search ───────► Templated (no LLM, no change)

[SERVER]
   • /api/companion/comment    (UNCHANGED — serves CompanionThought)
   • /api/companion/palace-link (NEW — runtime LLM, server-side tag-hash cache)
     Request:  { tags, contextItem, companionName, companionPrompt, provider, userName }
     Response: { connection, targetEntryId }

[CLIENT CACHE]
   Only palace-link uses localStorage. Keys: tt-palace-palace-link:{userNameSlug}:{routeId}
   TTL: 7 days. LRU eviction on quota exceeded.
```

The new endpoint is the architectural seam. The precomputed features (PalaceHook, AthenaQuizReaction) are pure client-side lookups — no API surface, no async, no cache to manage.

---

## 3. Server Changes

### 3.1 `mode` discriminator (deprecated — precomputed lookups only)

> **Note**: After self-review, the `mode` discriminator on `/api/companion/comment` was simplified. The runtime LLM call for cross-topic synthesis moved to its own endpoint (`/api/companion/palace-link`, see Section 3.3). The remaining `palace-hook` and `quiz-reaction` modes are precomputed lookups (no LLM call), so the `MODE_INSTRUCTIONS` map is no longer needed.

The existing endpoint at `server/index.ts` accepts a JSON body of shape `{ companionName, companionPrompt, contextItem, provider }`. **No changes** to this endpoint. The precomputed lookup modes (`palace-hook`, `quiz-reaction`) are handled **client-side** by importing `src/data/athena-static.json` directly — the server is not involved in those flows at all.

This means: `/api/companion/comment` continues to serve `CompanionThought` exactly as before. The server does not need to know about palace modes.

### 3.2 (Removed: was `MODE_INSTRUCTIONS` map)

This section previously described a `MODE_INSTRUCTIONS` map that prepended mode-specific instructions to the LLM system prompt. After self-review, the precomputed design eliminates the need for runtime mode instructions at all — mnemonics and quiz reactions are pre-generated and bundled at build time. The runtime LLM call (for `palace-link` only) lives at a dedicated endpoint with its own focused prompt (see Section 3.3 step 5).

### 3.3 New endpoint: `POST /api/companion/palace-link`

This is the only feature that requires a runtime LLM call (because cross-topic connections depend on the user's current page context, which can't be pre-computed for all possible tag combinations). Dedicated endpoint to keep its request/response shape clean and allow its own server-side cache.

- **Request body**:
  ```typescript
  {
    tags: string[];             // tags from the current entry
    contextItem: string;        // title/description for the LLM
    companionName: string;      // "Athena"
    companionPrompt: string;    // the (already userName-interpolated) Athena prompt
    provider?: ProviderId;      // optional, default = fallback chain
    userName?: string;          // for server-side cache key
  }
  ```
- **Response**:
  ```typescript
  { connection: string; targetEntryId: string; }
  ```
- **Behavior**:
  1. Compute `tagsHash = sha1(tags.sort().join('|'))`.
  2. Check in-memory `palaceLinkCache`. If hit, return immediately.
  3. Server-side tag-match across all 8 data modules (reuses same logic as `RelatedEntries`).
  4. Pick the top non-excluded entry by `tags ∩ entry.tags` count.
  5. Call LLM with focused prompt (prepended to `companionPrompt`):
     ```
     You are Athena. Two entries share these tags: [shared tags].
     Entry A: {contextItem}
     Entry B: {target.title} — {target.description}
     Write ONE sentence (under 30 words) showing how these connect as memory hooks.
     Speak in Athena's voice — direct, warm, opinionated. No fluff.
     ```
  6. Cache result by `tagsHash`. Return `{ connection, targetEntryId }`.
  7. On error after all fallbacks: return `{ connection: '', targetEntryId: '' }`.
- **Provider**: existing fallback chain `['minimax', 'zhipu', 'deepseek', 'google']`.
- **Server-side cache**: in-memory `Map<string, { connection, targetEntryId }>`, LRU eviction at 1000 entries, key = `sha1(sortedTags.join('|'))`.

### 3.4 No other server changes

- No new provider config
- No new env vars
- Provider fallback chain unchanged
- One new endpoint added: see Section 3.4

---

## 4. New Client Files

### 4.1 `src/lib/palaceCache.ts` (cache helper)

A thin localStorage wrapper. **Only used for `palace-link` mode** (the one feature that makes a runtime LLM call). `palace-hook` and `quiz-reaction` are precomputed and use no client cache.

```typescript
// Only palace-link uses client cache now; the type is a single value, not a union.
export type PalaceLinkCacheKey = string;  // tt-palace-palace-link:{userNameSlug}:{routeId}

interface CacheEntry<T> {
  value: T;
  storedAt: number; // ms epoch
}

const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function getCachedPalaceLink<T>(userName: string, routeId: string): T | null;
export function setCachedPalaceLink<T>(userName: string, routeId: string, value: T): void;
export function clearPalaceCache(): void;  // for testing / "reset palace" (all entries)
```

**Storage shape**: localStorage keys `tt-palace-palace-link:{userNameSlug}:{routeId}`. Value is JSON `{ value, storedAt }`. Read returns `null` if missing, malformed, or older than `TTL_MS`.

**userNameSlug**: lowercase, alphanumeric + dashes only, to keep keys filesystem-safe.

### 4.2 `src/components/PalaceLink.tsx`

A 1-sentence cross-topic connection synthesis. Renders below `RelatedEntries` on data pages.

```typescript
interface PalaceLinkProps {
  contextItem: string;       // the current data page (e.g., 'Malthus')
  relatedEntries: {          // the output of RelatedEntries
    module: string;
    entries: { id: string; title: string; tags: string[] }[];
  };
  routeId: string;            // e.g., 'malthus-essay' — used in cache key
}
```

**Render flow**:
1. On mount, read cache via `getCachedPalace<string>('palace-link', userName, routeId)`.
2. If hit, render the cached sentence in a card matching the `CompanionThought` visual style but smaller (less visual weight — it's a "by the way" line, not a main commentary).
3. If miss, POST `/api/companion/palace-link` with `{ tags, contextItem, companionName, companionPrompt, provider, userName }`. The server does its own tag-match against all data modules, picks the top non-excluded entry, calls the LLM with a focused cross-topic prompt, and returns `{ connection, targetEntryId }`.
4. On success, cache and render. On error, render nothing (silent — this is a low-priority enhancement; data pages must not break if Athena can't speak).

**Visual**: A single line, italic, with the Athena avatar (small) on the left, in a more muted color than the main `CompanionThought` so it doesn't compete. No "thinking" spinner — the page is usable without it; PalaceLink appears after a brief delay.

**When to use**: On any data page that has `RelatedEntries` with at least one cross-module match. The page passes `relatedEntries` and the page's own title/content to the component.

### 4.3 `src/components/PalaceHook.tsx`

A 1-line mnemonic that lives as a **sibling** of `CompanionThought` on data pages (mounted just above it). Pure precomputed lookup — no LLM call, no network, no cache.

```typescript
interface PalaceHookProps {
  routeId: string;  // entry.id, used to look up the precomputed mnemonic
}
```

**Render flow**:
1. Synchronously look up `athenaStatic.mnemonics[routeId]` (imported from `src/data/athena-static.json` at build time).
2. If found, render the mnemonic as a small italic line with a "Hook:" prefix.
3. If `routeId` is not in the static bank, render nothing (silent — never block the page).

**Visual**: Small italic line, indigo-400 accent, with a "Hook:" prefix. Renders above the main `CompanionThought` card (adjacent, not inside it — see Section 5.1 for the sibling-component rationale).

**Important**: PalaceHook is purely a build-time data read. No LLM call, no API call, no cache. Generated once at build via `scripts/precompute-athena.ts` and committed to the repo.

### 4.4 `src/components/AthenaQuizReaction.tsx`

Tier-aware post-answer commentary in the Quiz flow. Reads `useCompetency` and surfaces a single precomputed sentence keyed by (quiz tier, competency bracket, topic). No LLM call, no API call, no cache — pure build-time data lookup.

```typescript
interface AthenaQuizReactionProps {
  topic: string;             // competency key, e.g., 'history'
  scoreAfter: number;        // 0–100, the post-answer score (drives bracket)
  isCorrect: boolean;
  tier: 1 | 2 | 3;           // quiz tier (Recall / Judgment / Roleplay)
}
```

**Render flow**:
1. Compute `competencyBracket` from `scoreAfter`:
   - `scoreAfter < 40` → `'low'`
   - `40 ≤ scoreAfter < 70` → `'mid'`
   - `scoreAfter ≥ 70` → `'high'`
2. Look up `athenaStatic.quizReactions[`${tier}:${bracket}:${topic.toLowerCase()}`]` (imported at build time).
3. If not found, fall back to `athenaStatic.quizReactions[`${tier}:${bracket}:generic`]` (a per-tier generic reaction).
4. If still not found, render nothing (silent — should not happen if precompute ran correctly).
5. Render the reaction below the existing post-answer feedback in a small Athena panel.

**Visual**: Matches the existing post-answer feedback style (same card layout, smaller font). Athena's voice. Renders synchronously (no delay) because the data is local.

**Why a separate component (not extending the existing feedback)**: The existing post-answer feedback is templated (`Correct!` / `Try again`). Athena's reaction is a separate, optional layer. Templated feedback stays as a fast, reliable baseline; Athena's reaction adds the memory-palace benefit.

---

## 5. Modified Files

### 5.1 `src/components/CompanionThought.tsx`

**No changes.** The existing component is unmodified. `PalaceHook` is a **sibling** component that the page mounts alongside (just above `CompanionThought`), not a child or wrapper. This keeps `CompanionThought`'s call signature stable for the existing tests/callers. `PalaceHook` is purely a build-time data read (synchronous import of `athena-static.json`), so there is no async interaction with `CompanionThought`.

### 5.2 Data pages (8 of them)

Every data page that already mounts `<CompanionThought contextItem={...} />` AND has at least one related entry in `RelatedEntries` gets two new lines:

```tsx
<CompanionThought contextItem={item.summary} />
<PalaceHook contextItem={item.summary} routeId={item.id} />
<RelatedEntries tags={item.tags} excludeId={item.id} />
<PalaceLink
  contextItem={item.summary}
  relatedEntries={relatedEntriesData}   // need to capture RelatedEntries output
  routeId={item.id}
/>
```

**Affected pages** (based on `src/App.tsx` lazy routes and `RelatedEntries` usage):
- `src/pages/Wars.tsx`
- `src/pages/Disasters.tsx`
- `src/pages/Innovations.tsx`
- `src/pages/SportsAlmanac.tsx`
- `src/pages/Philosophy.tsx`
- `src/pages/Engineering.tsx`
- (any other data page using `<RelatedEntries>` — to be confirmed by `grep RelatedEntries` during implementation)

**Required refactor**: `RelatedEntries` currently renders its own list and discards the data. For `PalaceLink` to receive the matched entries, `RelatedEntries` needs to either (a) expose a callback `onMatch(entries)` that fires once matches are computed, or (b) be refactored to return data and let the parent render. **Recommended: (a)** — minimal change, preserves the visual.

**Decision deferred to implementation**: The exact data flow for `relatedEntries` to reach `PalaceLink` is an implementation detail. The spec just requires that `PalaceLink` receives a list of `{ module, entries: [{id, title, tags}] }` shaped like what `RelatedEntries` already computes internally.

### 5.3 `src/pages/Quiz.tsx`

Insert `<AthenaQuizReaction ... />` below the existing post-answer feedback. The component reads from `useCompetency` directly via context (it does not need to be passed in as a prop — the page does not need to know about it). Required props: `topic`, `questionId`, `scoreAfter`, `isCorrect`. All are available in the existing answer-handling code path.

**Important**: AthenaQuizReaction does not call `updateCompetency` — that's already handled by the existing Quiz flow. The component only reads competency state.

### 5.4 `server/index.ts`

Add the new `/api/companion/palace-link` handler (Section 3.3) with its own in-memory cache. The existing `/api/companion/comment` handler is unchanged.

The new handler is a self-contained Express route:

```typescript
const palaceLinkCache = new Map<string, { connection: string; targetEntryId: string }>();
const PALACE_LINK_CACHE_MAX = 1000;
const palaceLinkSha1 = (s: string) => /* crypto.createHash('sha1').update(s).digest('hex') */;

app.post('/api/companion/palace-link', async (req, res) => {
  const { tags, contextItem, companionName, companionPrompt, provider, userName } = req.body;
  if (!Array.isArray(tags) || typeof contextItem !== 'string') {
    return res.status(400).json({ error: 'tags[] and contextItem required' });
  }
  const hash = palaceLinkSha1([...tags].sort().join('|'));
  if (palaceLinkCache.has(hash)) return res.json(palaceLinkCache.get(hash));

  const target = findBestTagMatch(tags); // shared helper with RelatedEntries
  if (!target) return res.json({ connection: '', targetEntryId: '' });

  const result = await callProviderChain({
    companionName,
    companionPrompt,
    contextItem: `Tags: [${tags.join(', ')}]\nEntry A: ${contextItem}\nEntry B: ${target.title} — ${target.description}\nWrite ONE sentence showing how they connect.`,
    provider,
  });
  const out = { connection: result.comment || '', targetEntryId: target.id };

  if (palaceLinkCache.size >= PALACE_LINK_CACHE_MAX) {
    const firstKey = palaceLinkCache.keys().next().value;
    if (firstKey) palaceLinkCache.delete(firstKey);
  }
  palaceLinkCache.set(hash, out);
  return res.json(out);
});
```

No other handler changes. The existing `/api/companion/comment` route continues to serve `CompanionThought` exactly as before.

---

## 6. Data Structures

### 6.1 Cache entry shape

```typescript
interface PalaceCacheEntry<T> {
  value: T;
  storedAt: number;  // Date.now() at write time
}
```

Stored as JSON. Read returns `null` if `Date.now() - storedAt > TTL_MS` (7 days).

### 6.2 Cache key type (palace-link only)

```typescript
// in src/lib/palaceCache.ts
// Only palace-link uses the client-side cache.
// palace-hook and quiz-reaction are precomputed and don't need runtime caching.
export type PalaceMode = 'palace-link';
```

The type is exported as `'palace-link'` (a single-element union) to keep the API surface honest — the other modes are precomputed and have no cache entries. The function signatures use this type to prevent accidental misuse.

### 6.3 (No server-side mode union needed)

Unlike the original design draft, the server does **not** modify `/api/companion/comment` with a `mode` discriminator. The existing endpoint is untouched. The new `/api/companion/palace-link` endpoint is a separate route with its own request/response shape. No `MODE_INSTRUCTIONS` map is needed.

---

## 7. Caching Strategy

| Mode | Cache key | TTL | Invalidation |
|---|---|---|---|
| palace-link (client) | `tt-palace-palace-link-{userNameSlug}-{routeId}` | 7 days | User clicks "regenerate" (not in v1; defer) |
| palace-link (server) | in-memory `Map<sha1(sortedTags), {connection, targetEntryId}>` | Process lifetime | LRU at 1000 entries |
| palace-hook | (no client cache — precomputed) | n/a | n/a — rebuild at build time |
| quiz-reaction | (no client cache — precomputed) | n/a | n/a — rebuild at build time |

**UserName invalidation**: If the user changes their traveler name, all palace caches become stale (they were generated for the old name's voice). The cache key includes userNameSlug, so the new name gets fresh entries and the old ones linger harmlessly. A `clearPalaceCache()` helper exists for explicit reset (e.g., a future "reset my palace" button).

**Cache size guard**: Each entry is <500 bytes. Even with 50 cached entries per user, that's ~25 KB — well within localStorage limits. No LRU eviction needed in v1.

---

## 8. UI / UX Rules

- **Silent failure**: If any palace component fails (LLM error, timeout, network), the page renders without it. No toast, no error UI. The data page is the primary content; palace features are additive delight.
- **No loading spinners for palace-link/palace-hook** (only for the main `CompanionThought`, which already has one). The palace features appear after a brief delay without blocking the rest of the page.
- **AthenaQuizReaction shows a thinking state** because Quiz users are waiting and a small delay is acceptable in that flow.
- **No new modals, no new settings**. The Traveler Name and companion choice are unchanged. Palace features are "invisible infrastructure" — the user experiences them as Athena being more helpful, not as new UI to configure.
- **Visual hierarchy**: `CompanionThought` (main commentary) > `PalaceHook` (mnemonic as sibling above) > `PalaceLink` (cross-topic aside below). Color and size scale down the list.

---

## 9. Future Work (Parking Lot)

- **#3 periodic reactivation**: weekly prompts for entries visited but not revisited. Needs a scheduler (e.g., localStorage timestamp + useEffect on dashboard mount). Deferred from v1.
- **"Reset my palace" button**: call `clearPalaceCache()` from the companion settings modal. Trivial to add; deferred from v1.
- **Cross-session memory consolidation**: Athena takes notes at session end, writes into `athena-preferences.ts` (or a sibling file). Spec'd previously; still out of scope.
- **Per-page "regenerate palace" buttons**: a small refresh icon on `PalaceLink` and `PalaceHook` to bust the cache. Useful but not essential for v1.
- **AthenaQuizReaction tier display**: show the competency score next to Athena's reaction so the user understands the framing. Cosmetic.

---

## 10. Testing Strategy

### 10.1 Unit tests

- `src/lib/palaceCache.test.ts` (new): round-trip, TTL expiration, userName slug sanitization, malformed-JSON recovery, `clearPalaceCache` behavior, quota-exceeded eviction.
- `src/components/PalaceLink.test.tsx` (new): renders cached value on hit, calls `/api/companion/palace-link` on miss with correct body shape, renders silently on error, no spinner.
- `src/components/PalaceHook.test.tsx` (new): synchronously looks up `athenaStatic.mnemonics[routeId]`; renders nothing if routeId is not in the static bank; no async behavior.
- `src/components/AthenaQuizReaction.test.tsx` (new): computes the right bracket from `scoreAfter`; looks up the right precomputed reaction by `(tier, bracket, topic)`; falls back to `generic` key for missing topic; no async behavior.
- `server/index.test.ts` (extend existing or new): `/api/companion/palace-link` returns 400 on missing `tags[]`; caches results by `sha1(sortedTags)`; LRU evicts at 1000 entries; returns empty on provider all-fail; existing `/api/companion/comment` is unchanged.

### 10.2 Manual smoke tests

- Open the app, visit a data page (e.g., `/wars/vietnam`). Confirm:
  - `CompanionThought` renders as before
  - `PalaceHook` appears above with a precomputed mnemonic (synchronous, no network)
  - `PalaceLink` appears below `RelatedEntries` with a cross-topic connection (network call on first visit, cached after)
  - Open devtools → Application → localStorage: confirm one cache entry written under `tt-palace-palace-link:*`
- Refresh the page: `PalaceHook` and `CompanionThought` render instantly (no network); `PalaceLink` renders instantly from cache (no new network call). DevTools Network tab shows zero new requests.
- Start a Quiz, answer a question. Confirm `AthenaQuizReaction` appears with a sentence in Athena's voice. Answer another question on the same topic: confirm a different reaction (different bracket = different precomputed key).
- Clear `tt-palace-*` from localStorage, refresh: only `PalaceLink` re-fetches (the only client-cached feature). `PalaceHook` and `AthenaQuizReaction` continue to render from the precomputed JSON.
- Switch to Doc/Marty/Biff active companion: confirm `PalaceLink` still appears (uses the active companion's prompt for the cross-topic call) but the tone shifts. `PalaceHook` and `AthenaQuizReaction` are precomputed in Athena's voice and will still sound like Athena regardless of active companion (acceptable for v1).
- Manually break `/api/companion/palace-link` (return 500): confirm `PalaceLink` renders nothing after timeout (silent fail). `PalaceHook`, `AthenaQuizReaction`, and the rest of the page are unaffected.

### 10.3 Verification before completion

Per project convention, the implementation plan should include a "Run lint and build" step:
- `npm run lint` — clean
- `npm run build` — succeeds
- `npm test` — all tests pass including new palace tests
- Manual smoke test of the data page + quiz flow

**Pre-existing issues to note (out of scope, not blockers)**: `Quiz.tsx` type errors and `disasters.ts`/`tech-transfer.ts` data file errors are pre-existing and were excluded from the previous Athena default spec. The new spec does not fix them and should not regress them.

---

## 11. Open Questions

These are design-time unknowns that the implementation plan can resolve:

1. **Should `PalaceLink` also surface an Athena "thinking" state?** Decision in v1: **no**, to keep visual weight low. Revisit if users miss the cue.
2. **Should the cache be per-user-name or per-device?** Currently per-user-name (cached under the current name). A user who switches name "A" → "B" → "A" will get fresh-then-stale behavior. Acceptable for v1.
3. **Should `AthenaQuizReaction` work for non-Athena companions?** Currently the reactions are precomputed in Athena's voice, so they always sound like Athena regardless of the active companion. If you want companion-specific reactions, we'd need to either: (a) precompute reactions for every companion (3-4× the build-time LLM calls), or (b) generate them at runtime (regresses the "0 LLM calls per quiz answer" design). Defer to v2.
4. **What's the right sentence length for `palace-link`?** The endpoint's focused prompt says ≤30 words. Implementation may surface that the LLM overshoots. If it does, tighten the server prompt or post-process server-side. Defer the post-processing decision.
5. **What happens if a data page has no related entries?** `PalaceLink` does not render (no cross-topic target to connect to). `PalaceHook` still renders (precomputed, doesn't need a target). The page is unchanged from the existing experience in that edge case.
6. **Build-time precompute failure mode**: current spec says the build fails loud if `athena-static.json` is missing entries. Is that too strict? An alternative is to log a warning and fall back to runtime LLM calls. Decision deferred to the implementation plan — for now, **fail-loud** is the spec contract.
