# Screen Reader Testing Guide

This document describes how to verify the **Time Traveler's Guide** works with
screen readers. It is the manual counterpart to the automated checks in
`src/__tests__/a11y.test.tsx` and the keyboard E2E tests. Automated tests can
prove markup is present (aria-labels, roles, focus traps); only a human with a
real screen reader can prove the experience is *usable*.

> **Who can run this:** Any developer or QA engineer. No prior screen reader
> experience required — the key commands below are everything you need.
>
> **Time required:** ~45–60 minutes for a full pass.

---

## How to use this document

1. Install ONE screen reader (NVDA on Windows, or VoiceOver on macOS) per the
   [Prerequisites](#prerequisites) section.
2. Start the dev server: `npm run dev` (default http://localhost:5173/).
3. Work through every scenario in [Test Scenarios](#test-scenarios) in order.
4. For each scenario, fill in the **Result** checkbox and **Notes** field.
5. When all scenarios are complete, fill in [Last Verified](#last-verified).
6. Commit the filled-in document (or attach it to the release/a11y audit) as
   WCAG 2.1 AA conformance evidence.

A scenario **fails** if any of its *Expected* bullets is not met. Record the
failure in Notes with: what was announced, what was expected, and the screen
reader + browser version.

---

## Prerequisites

### Start the application

```bash
npm install
npm run dev
```

The app is served at **http://localhost:5173/**. Use a Chromium-based browser
(Chrome or Edge) or Firefox for NVDA; Safari for VoiceOver. Test in **one
browser per screen reader** — results can differ across browsers.

### NVDA (Windows)

NVDA is free, open source, and the most widely used screen reader for Windows
testing.

1. Download from **https://www.nvaccess.org/download/**.
2. Install with default settings (accept the desktop shortcut).
3. Start NVDA: **Ctrl+Alt+N** (or launch from the Start Menu).
4. While NVDA is running, the following key commands are available. (The
   "NVDA" key is **Insert** by default on desktop layouts, or **Caps Lock** on
   laptop layouts.)

   | Action | Shortcut |
   |---|---|
   | Start / stop reading from here | NVDA+Down Arrow (browse) / NVDA+A |
   | Next element | Down Arrow |
   | Previous element | Up Arrow |
   | Navigate by heading | H (next), Shift+H (previous) |
   | Navigate by heading level 1-6 | 1 – 6 |
   | Navigate by link | K |
   | Navigate by form field | F |
   | Navigate by button | B |
   | Jump to next focusable | Tab |
   | Read current line | NVDA+Up Arrow (or NVDA+L) |
   | Read current focus | NVDA+Tab |
   | Open elements list (headings/links/forms) | NVDA+F7 |
   | Stop speech | Ctrl |
   | Quit NVDA | NVDA+Q then Enter |

5. **Tip:** Open the NVDA Speech Viewer (**NVDA menu → Tools → Speech
   Viewer**) to see a text log of everything NVDA speaks. This makes it far
   easier to record exact announcements in the Notes fields.

### VoiceOver (macOS)

VoiceOver is built into macOS — no install required.

1. Enable: **Cmd+F5** (or *System Settings → Accessibility → VoiceOver*).
2. The VoiceOver modifier (**VO**) is **Ctrl+Option** by default. You can also
   use **Caps Lock** as the VO key (*System Settings → Accessibility →
   VoiceOver → Open VoiceOver Utility → General*).

   | Action | Shortcut |
   |---|---|
   | Start reading | VO+A |
   | Next element | VO+Right Arrow |
   | Previous element | VO+Left Arrow |
   | Navigate by heading | VO+Cmd+H |
   | Navigate by link | VO+Cmd+L |
   | Navigate by form control | VO+Cmd+J |
   | Navigate by button | (use VO+Right Arrow, or the Rotor set to Buttons) |
   | Read current element | VO+F3 |
   | Read current focus | VO+F |
   | Open the Rotor | VO+U (then choose Headings/Links/Form Controls) |
   | Interact with a group/dialog | VO+Shift+Down Arrow |
   | Stop interacting | VO+Shift+Up Arrow |
   | Stop speech | Ctrl |

3. **Tip:** Turn on the **Caption Panel** (*VoiceOver Utility → Speech →
   "Show VoiceOver cursor" / Caption Panel*) to see a transcript of speech
   output, useful for recording exact announcements.

> **Note on other screen readers:** JAWS (Windows) and TalkBack (Android) are
> not required for this guide, but the app targets WCAG 2.1 AA, so it should
> work in them too. If you have access, repeating key scenarios in JAWS is
> valuable.

---

## App context (what you are testing)

The Time Traveler's Guide is a single-page React app with:

- A **dashboard** (`/`) listing 11 module cards.
- **11 module pages** (Sports, Finance, Era Guide, Disasters, Tech Transfer,
  Medical, Butterfly Calculator, Safety, Timeline, Blueprints, Quiz).
- A **Bookmarks** page (`/bookmarks`) for saved entries.
- A **Progress** dashboard (`/progress`) with a donut chart and per-module
  progress bars.
- A **Review Session** (`/review`) for spaced-repetition study.
- Two **modal dialogs**: Global Search (**Ctrl+K**) and Companion Settings.
- A **shortcut hint** popover (**?** key) and a **theme toggle**.

Key accessibility features already implemented (from the A-series work):

| Feature | Where |
|---|---|
| Skip-to-main-content link | First focusable element on every page |
| `aria-label` on every icon-only / ambiguous button | Header, modals, cards |
| Visible `<label>` + `htmlFor` on every form input | Companion modal, search |
| Focus trap + focus restore in modals | `useModalFocus` hook |
| `role="dialog"` + `aria-modal="true"` on overlays | Search, Companion modals |
| `aria-live="polite"` for dynamic content | Review-due badge, search result count, toasts |
| Clean heading hierarchy (one `h1` per page) | All pages |
| `aria-pressed` on the theme toggle | Header |

---

## Test Scenarios

Run every scenario. Leave checkboxes **blank** until you have personally
verified the behavior — do **not** pre-mark anything as Pass.

### Scenario 1 — Dashboard Navigation

**Route:** `/`

**Steps:**
1. Navigate to http://localhost:5173/.
2. As the page loads, press **Tab**. The first announced element should be the
   skip link: *"Skip to main content, link"*.
3. Press **Enter** on the skip link. Verify focus moves to the main content
   region and the screen reader announces the main landmark.
4. Navigate by heading (**H** in NVDA, **VO+Cmd+H** in VoiceOver). The first
   heading announced must be the `h1`: *"Welcome, Traveler."*
5. Read the subtitle. Verify the departure description is read in order after
   the h1.
6. If a Review-due badge is present, verify it is announced via the live
   region: *"Review Due, N topics waiting"*.
7. Continue navigating by heading. Verify each module card title (e.g.
   *"🏈 Sports Almanac"*, *"📈 Financial Almanac"*) and its description are
   read together.
8. Tab to a card's "View Almanac" / "Take the Quiz" link. Verify it is
   announced as a link with its text.

**Expected:**
- Skip link is the first focusable element and works.
- Exactly one `h1` ("Welcome, Traveler.") on the page.
- Reading order is logical: h1 → subtitle → review badge (if any) → cards.
- Every card has a readable title and a discoverable action link.

**Result:** [ ] Pass [ ] Fail — Notes:

---

### Scenario 2 — Global Search Modal (Ctrl+K)

**Route:** any page

**Steps:**
1. Press **Ctrl+K** (or **Cmd+K** on macOS).
2. Verify the dialog is announced (e.g. *"Search the Archive, dialog"* or
   *"Search the archive, edit"* — NVDA reads the `aria-labelledby` heading +
   the focused input).
3. Verify focus is on the search input. NVDA/VoiceOver should say *"Search
   the archive, edit, blank"*.
4. Type **chernobyl**. Verify a live-region announcement reports the result
   count: *"N results found for chernobyl"* (or *"No results found"*).
5. Navigate the result list with **Down Arrow** / **Tab**. Each result should
   announce its title, year badge, subtitle, and description.
6. Press **Escape**. Verify the dialog closes and a "dialog closed" cue is
   spoken.
7. Verify focus **returns to the Search button** in the header (the trigger).
   Press Tab once — the next element after the search button should be
   announced (focus is not lost).

**Expected:**
- Dialog role and label announced on open.
- Focus lands in the input on open.
- Result count is announced as the user types (live region, `aria-atomic`).
- Escape closes the dialog; focus is restored to the trigger button.

**Result:** [ ] Pass [ ] Fail — Notes:

---

### Scenario 3 — Companion Configuration Modal

**Route:** any page

**Steps:**
1. Navigate (Tab or by button) to the **Companion button** in the header.
   Verify it announces the active companion, e.g. *"Open companion settings.
   Active companion: Athena, button"*.
2. Press **Enter** to open the dialog.
3. Verify *"Time Travel Companion, dialog"* is announced (via
   `aria-labelledby="companion-modal-title"`).
4. Tab through the form. Each input must announce its label:
   - *"Traveler Name, edit"* (bound to `#companion-user-name`).
5. Navigate to the companion list. Each companion row should announce the
   companion name, description, and an "Active" or "Select" button.
6. Select the **Custom** companion. Verify the inline sub-form appears and
   its fields are announced with labels:
   - *"Companion Name, edit"* (`#companion-custom-name`)
   - *"Companion Prompt / Persona Description, edit, multi line"*
     (`#companion-custom-prompt`).
7. Type a few characters in the prompt textarea. Verify the change is tracked
   (re-read the field with NVDA+Tab / VO+F to confirm the new value).
8. Tab to the AI provider buttons (MiniMax / Zhipu / DeepSeek / Gemini).
   Verify each announces as a button with its name; the active one should
   indicate its state.
9. Press **Escape**. Verify the dialog closes and focus returns to the
   Companion trigger button.

**Expected:**
- Every input has a programmatic label (read together with the field).
- Focus is trapped inside the dialog (Tab cycles within the dialog only).
- The custom companion's conditional sub-fields are announced when revealed.
- Escape closes the dialog and restores focus to the trigger.

**Result:** [ ] Pass [ ] Fail — Notes:

---

### Scenario 4 — Theme Toggle

**Route:** any page

**Steps:**
1. Tab to the **Theme toggle** button in the header.
2. Verify the button announces its **state** via `aria-pressed` and a dynamic
   `aria-label`. In dark mode: *"Switch to light theme, toggle button,
   pressed"*. In light mode: *"Switch to dark theme, toggle button, not
   pressed"*.
3. Press **Enter** (or Space) to toggle. Verify the visual theme changes.
4. Re-read the focused button. Verify the announcement now reflects the new
   state (pressed ↔ not pressed, and the label flips).

**Expected:**
- `aria-pressed` reflects the current theme (true = dark).
- `aria-label` describes the *target* state ("Switch to light/dark theme").
- Toggling updates the announcement on the same focusable element.

**Result:** [ ] Pass [ ] Fail — Notes:

---

### Scenario 5 — Knowledge Module Page Browsing (Sports Almanac)

**Route:** `/sports` (repeat with `/finance`, `/era-guide`, etc. as time allows)

**Steps:**
1. Navigate to `/sports`.
2. Verify the page `h1` is announced first when navigating by heading (e.g.
   *"Sports Almanac"*).
3. Navigate by heading through the page. Verify section headings and entry
   titles form a logical hierarchy (no skipped levels).
4. Navigate to the search/filter input on the page. Verify it announces a
   label (e.g. *"Filter by team or year, edit"*).
5. Type a query (e.g. a team name). Verify the filtered list updates and the
   result changes are perceivable (either live-region announcement or by
   re-reading the list).
6. Open an entry detail (accordion, expandable, or detail view). Verify the
   expanded content is announced and the heading is reachable.

**Expected:**
- One `h1` per page; heading levels increase without skipping.
- Search/filter input has a label.
- Entry content (and any bookmark button on the entry) is reachable.

**Result:** [ ] Pass [ ] Fail — Notes:

---

### Scenario 6 — Bookmarks (Empty + Populated)

**Route:** `/bookmarks`

**Steps (empty state):**
1. Clear localStorage (DevTools → Application → Local Storage → clear), then
   navigate to `/bookmarks`.
2. Verify the `h1` *"📑 Bookmarks"* is announced.
3. Verify the empty-state message is announced: *"No bookmarks yet."* and the
   guidance line, plus an *"Explore Modules"* link.

**Steps (populated state):**
4. Navigate to any module page (e.g. `/sports`), open an entry, and activate
   the bookmark button. Verify a toast is announced via the live region, e.g.
   *"Bookmarked"*.
5. Navigate to `/bookmarks`. Verify the count line is announced (e.g. *"3
   saved entries across all modules."*).
6. Navigate to a bookmark card. Verify each card announces the module label,
   entry id, optional note, and date.
7. Verify the two action buttons per card are announced by their
   `aria-label`s:
   - *"Open `<module>` module, link"*
   - *"Remove bookmark `<entry_id>`, button"*
8. Activate "Remove bookmark". Verify the *"Bookmark removed"* toast is
   announced and the card disappears from the list.

**Expected:**
- Both empty and populated states are reachable and announced.
- Bookmark add/remove actions produce live-region toast announcements.
- Action buttons have descriptive `aria-label`s (not just "X" / icon names).

**Result:** [ ] Pass [ ] Fail — Notes:

---

### Scenario 7 — Review Session

**Route:** `/review`

> Note: this scenario requires at least one due review. If none are due, the
> app shows a *"No Reviews Due"* card — test that the (visually hidden,
> `sr-only`) `h1` *"Review Session"* is still announced, then create review
> items before re-testing.

**Steps:**
1. Navigate to `/review`.
2. Verify the `h1` *"Review Session"* is announced when navigating by
   heading (it is visually hidden via `sr-only` but must still be spoken).
3. Verify the topic name (card title) and metadata are announced: last
   reviewed date, interval in days, and review count.
4. Verify the progress text *"X of Y"* is announced.
5. Activate **Got it** (or **Missed it**). Verify the next card appears and
   that the progress indicator updates (re-read the *"X of Y"* text).
6. Complete the session. Verify the *"Session Complete"* card is announced
   with reviewed/correct/accuracy statistics.

**Expected:**
- The `sr-only` `h1` is announced (screen readers receive it even though it
  is not visually rendered).
- Topic, metadata, and progress are all reachable.
- Submitting an answer advances the session perceptibly.

**Result:** [ ] Pass [ ] Fail — Notes:

---

### Scenario 8 — Progress Dashboard

**Route:** `/progress`

**Steps:**
1. Navigate to `/progress`.
2. Verify the `h1` *"Mission Progress"* is announced.
3. Verify the overall percentage is announced as text (e.g. *"42%"* in the
   donut center, or via the subtitle *"42% of all entries explored across N
   modules."*).
4. Navigate the module cards. For each card verify the announced text
   includes: module label, *"X / Y entries"*, the percentage, and (if
   present) the quiz score and last-activity date.
5. Navigate to the donut chart (Recharts SVG). Verify the screen reader does
   **not** read meaningless SVG noise, or that it announces something
   meaningful. If the chart is not understandable, record this as a **Known
   Limitation** rather than an automatic failure (see
   [Known Limitations](#known-limitations)).
6. Verify each card's *"Open module →"* link is announced as a link.

**Expected:**
- `h1` and overall percentage are reachable as text.
- Module progress numbers (entries, percent, quiz, activity) are announced.
- Charts do not produce confusing announcements.

**Result:** [ ] Pass [ ] Fail — Notes:

---

### Scenario 9 — Quiz / LLM Testing Module

**Route:** `/quiz`

**Steps:**
1. Navigate to `/quiz`.
2. Verify the page `h1` is announced (e.g. *"LLM Testing Module"* or the quiz
   title).
3. Read the question and answer choices. Verify each choice is announced as a
   focusable control (button/radio) with its text.
4. Select an answer. Verify the selection is announced and, on submit, the
   feedback (correct/incorrect, explanation) is announced via live region.
5. Advance through questions. Verify progress (e.g. *"Question X of Y"*) is
   announced.
6. At the end, verify the score/result summary is announced.

**Expected:**
- Questions and choices are fully reachable and announced.
- Answer feedback and final score are announced (live regions).

**Result:** [ ] Pass [ ] Fail — Notes:

---

### Scenario 10 — Shortcut Hint Popover (?) & Print

**Route:** any page

**Steps:**
1. Ensure no input is focused, then press **?**.
2. Verify the *"Keyboard Shortcuts"* popover is announced and reachable.
3. Read the shortcut list. Verify each row announces the action and its key
   (Ctrl+K, Esc, B, ?).
4. Press **Escape**. Verify the popover closes.
5. Navigate to the **Print Guide** button. Verify its `aria-label`
   *"Print guide"* is announced. Activating it opens the browser print
   dialog — verify the print dialog opens (you can cancel it).

**Expected:**
- Shortcut popover announces as a labeled region; its contents are reachable.
- Print button has a descriptive label.

**Result:** [ ] Pass [ ] Fail — Notes:

---

### Scenario 11 — 404 / Not Found

**Route:** `/this-page-does-not-exist`

**Steps:**
1. Navigate to a non-existent route.
2. Verify the `NotFound` page announces an `h1` and an explanatory message.
3. Verify any "return home" link is announced and focusable.

**Expected:**
- Error page is announced with a clear heading; recovery link is reachable.

**Result:** [ ] Pass [ ] Fail — Notes:

---

## Regression Testing

Run **all scenarios above** after any change that touches:

- Modal focus traps (Search, Companion Settings) — re-run Scenarios 2 & 3.
- ARIA live regions (toasts, review-due badge, search result count) — re-run
  Scenarios 2, 6, 7, 9.
- Heading hierarchy on any page — re-run Scenario 1 and the relevant page
  scenario.
- Form inputs / labels (Companion modal, filters) — re-run Scenarios 3 & 5.
- The `useModalFocus` hook or `ErrorBoundary`.

A full pass is recommended before each release tagged for accessibility
review.

---

## Known Limitations

These are documented shortcomings that do **not** automatically fail a
scenario. If a tester observes one of these, note it under the scenario and
move on:

- **Sonner toasts** are announced via `aria-live="polite"`. Very rapid
  successive toasts (e.g. batch bookmarking) may overlap or truncate. The
  last toast always wins.
- **Recharts charts** (Progress donut, Financial Almanac charts,
  Butterfly risk viz) are SVG-based. Screen readers may announce them as
  "image" or "graphic" without the underlying data. Numeric values are
  always also rendered as visible text near the chart, so verify the text is
  announced even if the SVG is not.
- **Decorative emoji** in card titles (🏈 📈 🕰️ …) may be announced as
  "football", "chart increasing", etc. This is usually acceptable and
  improves scan-ability. If an emoji is announced as an unwanted "image",
  verify the surrounding text label still conveys meaning.
- **The shortcut hint popover** (`?` key) is a floating panel, not a true
  dialog. It does not trap focus; Escape dismisses it. This is intentional
  and low-risk.
- **Lazy-loaded routes** show a `PageSkeleton` while code-split chunks load.
  On slow connections the skeleton's presence (rather than the page `h1`)
  may be announced briefly. Verify the real `h1` is announced once loaded.

---

## Troubleshooting common issues during testing

| Symptom | Likely cause | Where to look |
|---|---|---|
| Button announced as "button" with no name | Missing `aria-label` or text | `src/App.tsx`, the component |
| Input announced as "edit" with no label | Missing `<label htmlFor>` or `aria-label` | The page/modal |
| Escape does not close the dialog | Key handler / `useModalFocus` regression | `src/hooks/useModalFocus.ts` |
| Focus lost after dialog closes | Focus-restore logic regression | `src/hooks/useModalFocus.ts` |
| Live region never announces | `aria-live` region not in DOM at mount time | The component rendering the region |
| Two `h1`s on a page | Stray `<h1>` in a child component | The page + its children |

---

## Last Verified

Fill in when a full pass is complete.

- **Date:** ___________
- **Tester:** ___________
- **Screen reader & version:** ___________ (e.g. NVDA 2024.1, VoiceOver 14.x)
- **Browser & OS:** ___________ (e.g. Chrome 125 / Windows 11, Safari 17 / macOS 14)
- **App version / commit:** ___________
- **Overall result:** [ ] All scenarios pass [ ] Failures recorded below

### Failure log (if any)

| Scenario | What was announced | What was expected | Severity |
|---|---|---|---|
| | | | |
| | | | |

### Notes

___________

---

## Appendix: Quick reference — what to listen for

| Element | Expected announcement (approx.) |
|---|---|
| Skip link | *"Skip to main content, link"* |
| `h1` (any page) | The single page title |
| Search button | *"Search the archive, button"* |
| Companion button | *"Open companion settings. Active companion: \<name\>, button"* |
| Theme toggle | *"Switch to \<target\> theme, toggle button, pressed/not pressed"* |
| Print button | *"Print guide, button"* |
| Search dialog open | *"Search the Archive, dialog"* + input focused |
| Search result count | *"N results found for \<query\>"* (live) |
| Review-due badge | *"Review Due, N topics waiting"* (live) |
| Toast (success) | The success message, e.g. *"Bookmarked"* (live, polite) |
| Bookmark remove | *"Remove bookmark \<entry_id\>, button"* |
| Review `h1` | *"Review Session"* (visually hidden, still announced) |
| Progress `h1` | *"Mission Progress"* |
