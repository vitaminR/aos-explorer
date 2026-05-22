# mPRD-003 — UI/UX Improvements Backlog (Prototype)

> **Status:** IMPLEMENTED — all 15 items shipped in explorer.html + docs.html
> **Scope:** `explorer.html`, `docs.html`

Captured during the header-responsiveness pass. All items implemented.

---

## U1 — Overflow menu (`⋯`) for low-priority nav ✅

**Problem:** 7 nav-action buttons crowd the header even when collapsed to
icons. History, What's New, and Share are infrequent.
**Proposal:** Add a `More` menu that absorbs those three below 1280 px and
restores them above it.
**Acceptance:** Under 1280 px, only Compare / Build Stack / Insights / Docs /
Changelog + `⋯` remain visible; menu opens on click, dismisses on `Esc`.

## U2 — Single-letter fallback under mode-pill emojis ✅

**Problem:** When mode-pills collapse to emoji, distinguishing 🧩 🛠️ 🔄 🤖
🎯 🔌 🏆 is slow without a tooltip.
**Proposal:** Render a 9 px single-letter tag (`P F W A S M ★`) in the
bottom-right of each collapsed pill (CSS `::after` with `data-letter`).
**Acceptance:** Letter visible in compact + tiny nav states; hidden on active
pill to avoid redundancy.

## U3 — Hide Compare badge when empty ✅

**Problem:** `⚖ Compare 0` adds visual noise before any product is selected.
**Proposal:** `display: none` on `#compareBadge` when `data-count="0"`; keep
the DOM node for JS updates.
**Acceptance:** Badge appears only when ≥1 item is in the compare set.

## U4 — Disambiguate History vs. What's New ✅

**Problem:** Two time-oriented buttons (Time Machine and Weekly Digest) are
easily confused.
**Proposal:** Rename: `History` → `Time Machine`, `What's New` → `Weekly`.
Or consolidate into one `Timeline` button with two tabs.
**Acceptance:** User tests (3/3) correctly identify each feature from label.

## U5 — Left-rail axis toggles need visual state ✅

**Problem:** "Axes" toggles in the left rail don't clearly show active vs.
inactive (both use similar dim text).
**Proposal:** Solid accent underline when active + aria-pressed state.
**Acceptance:** Active axis is visually distinct at a glance.

## U6 — Breadcrumb disappears on mobile with no replacement ✅

**Problem:** At ≤640 px the breadcrumb is hidden (`display: none`), losing
location context.
**Proposal:** Replace with a compact "L7 › Strata" pill row fixed under the
header on mobile only.
**Acceptance:** Current stratum and mode always visible on mobile.

## U7 — Search bar expand on focus is jumpy ✅

**Problem:** The `flex-basis` animation can push adjacent nav buttons
off-screen briefly mid-transition.
**Proposal:** Use `position: absolute` overlay expansion on focus (search bar
grows *over* the header, not pushing siblings).
**Acceptance:** No layout thrash when focusing/blurring the search input.

## U8 — Keyboard shortcut discoverability ✅

**Problem:** `/` focus-search and `Ctrl+K` palette are hidden when the badge
is removed (mobile) or when header is compact.
**Proposal:** `?` opens a shortcut legend modal; list key bindings on the
Docs page too.
**Acceptance:** Shortcut legend accessible via keyboard from any state.

## U9 — Right rail panel scroll lock ✅

**Problem:** On tall pages, scrolling the main canvas also scrolls the right
rail — users lose context.
**Proposal:** `position: sticky` with `overflow-y: auto` on the right rail so
it scrolls independently once content exceeds viewport.
**Acceptance:** Right rail stays pinned while scrolling strata.

## U10 — Insight gaps visual hierarchy ✅

**Problem:** The Insights (Ecosystem Gap Map) view uses the same chip
treatment as every other list; gaps vs. mature substrates don't pop.
**Proposal:** Heatmap background (red → green) per substrate card with a
legend key.
**Acceptance:** Mature/thin areas distinguishable pre-attentively.

## U11 — Stack-builder drop zone feedback ✅

**Problem:** In `build.html`, the layer drop zones highlight
uniformly during drag, making it hard to tell which layer is valid for the
dragged product.
**Proposal:** Green outline on valid layers, red on invalid, based on product
strata mappings.
**Acceptance:** Invalid drops are rejected with a toast; outline matches.

## U12 — docs.html in-page navigation ✅

**Problem:** `docs.html` is a long single page without a TOC or back-to-top.
**Proposal:** Floating TOC on the left, back-to-top button bottom-right.
**Acceptance:** Jump to any section in ≤2 clicks; back-to-top always visible
after scrolling 400 px.

## U13 — Time Machine scrubber tooltip ✅

**Problem:** The slider shows a small snapshot label but not the date of the
snapshot until selected.
**Proposal:** Hover tooltip on slider thumb showing snapshot date +
taxonomy version.
**Acceptance:** Hover any slider position; tooltip appears within 100 ms.

## U14 — Mobile FAB "Suggest a product" ✅

**Problem:** Declared in CSS (`.suggest-fab { display: none; }`) but never
wired up.
**Proposal:** Either implement the FAB (show on mobile, open suggest modal)
or remove the dead CSS.
**Acceptance:** No dead selectors; mobile users have a clear path to
contribute.

## U15 — Active filter bar — persistent clear ✅

**Problem:** The "Clear all" affordance is only visible when filters are
active, but can be missed in long filter lists.
**Proposal:** Sticky inside the filter bar with keyboard shortcut
(`Shift+Esc`).
**Acceptance:** Clear-all reachable by keyboard and discoverable visually.

---

## Prioritization

| Priority | Items            | Rationale                                      |
| -------- | ---------------- | ---------------------------------------------- |
| P0       | U1, U3, U14      | Visible bugs / dead CSS / overflow risk.       |
| P1       | U2, U4, U6, U12  | Readability and nav clarity.                   |
| P2       | U5, U7, U9, U13  | Polish, state feedback, small DX wins.         |
| P3       | U8, U10, U11, U15 | Larger feature-shaped work.                   |

Promote P0 items into their own mPRD + mSPEC in the next pass.
