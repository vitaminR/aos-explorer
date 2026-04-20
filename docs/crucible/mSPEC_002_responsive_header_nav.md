# mSPEC-002 — Responsive Header Navigation (implementation spec)

> **Linked mPRD:** `mPRD_002_responsive_header_nav.md`

## Breakpoint ladder

| Range            | Mode pills      | Nav actions     | Search bar                        | Notes                                  |
| ---------------- | --------------- | --------------- | --------------------------------- | -------------------------------------- |
| ≥1900 px         | Full labels     | Full labels     | `clamp(220, 30vw, 380)` px        | "Roomy" layout.                        |
| 1101–1900 px     | Emoji-only[^1]  | Icon-only       | same                              | Was 1440 px; raised to 1900 in v1.     |
| 641–1100 px      | Emoji-only      | Icon-only       | `flex 0 1 140`, expand on focus   | Golden Path pill also collapses.       |
| ≤1024 px         | Smaller pills   | 30 px buttons   | `flex 0 1 120`, expand on focus   | Left rail narrows to 160 px.           |
| ≤640 px          | Horizontal scroll row of emojis | 28 px icons | `flex 1 1 0` (takes remainder)    | Docs, Share, breadcrumb hidden.        |

[^1]: Active mode pill and the Golden Path pill keep their text label for
scanability; others show emoji only with a `title=` tooltip.

## DOM contract (unchanged)

Each header control declares:

```html
<button class="nav-action" data-emoji="⚖️" title="Compare — …">
  <span class="nav-icon">⚖</span>
  <span class="nav-label">Compare</span>
  <span class="badge">0</span>
</button>
```

- `.nav-icon` is the collapsed-state glyph.
- `.nav-label` is the expanded-state text.
- `data-emoji` is a CSS-only fallback that renders via `::before` when the
  label is hidden (used by mode-pills, which have no inner markup).
- `title` is the always-available tooltip for accessibility when collapsed.

## CSS changes (v1)

1. `@media (max-width: 1440px)` → `@media (max-width: 1900px)` for the
   compact-nav block.
2. `placeholder` attribute on `#searchInput` shortened to `Search…`.
3. Added `title` on `#searchInput` preserving the full descriptive text.

## JS contract (unchanged)

`syncHeaderResponsiveness()` still runs on:

- window `resize`
- header `ResizeObserver`
- mode switches (`renderHint → syncHeaderResponsiveness`)

It adds `.compact-nav` / `.tiny-nav` when `scrollWidth > clientWidth + 4`.

## v2 — overflow-menu spec (not yet implemented)

### HTML

```html
<div class="nav-overflow" data-open="false">
  <button class="nav-action" aria-haspopup="menu" aria-expanded="false"
          title="More" data-emoji="⋯">
    <span class="nav-icon">⋯</span>
    <span class="nav-label">More</span>
  </button>
  <div class="nav-overflow-menu" role="menu" hidden>
    <!-- cloned buttons injected here when width < threshold -->
  </div>
</div>
```

### Trigger

- When `window.innerWidth < 1280`: move History, What's New, Share into the
  overflow menu.
- When `window.innerWidth ≥ 1280`: restore them to their original slots in
  source order.

### Behavior

- Click / `Space` / `Enter` on `⋯` toggles the menu.
- `Esc` or click-outside closes.
- First focusable item receives focus on open.
- `aria-expanded` on the trigger syncs with `[data-open]`.

### Single-letter fallback (mode-pills)

Add a `data-letter` attribute:

```html
<button class="mode-pill" data-emoji="🧩" data-letter="P" data-label="Products">
```

In the compact media queries:

```css
.header.compact-nav .mode-pill:not(.active)::after {
  content: attr(data-letter);
  font-size: 9px;
  color: var(--text-quaternary);
  position: absolute;
  bottom: 1px;
  right: 2px;
}
```

## Test matrix

| Viewport | Expected |
| -------- | -------- |
| 1920×1080 | All labels visible, no clipping, History fully shown. |
| 1600×900  | Mode pills + nav actions collapsed to icons, Golden Path labeled. |
| 1366×768  | Same as 1600, search retains ≥220 px. |
| 1024×768  | Left rail narrows, search shrinks to 120 px, expands on focus. |
| 640×960   | Mobile row, mode-pills horizontally scrollable. |
| 360×780   | Mobile row, Docs/Share hidden, breadcrumb hidden. |

## Regression guards

- `validate.py` must not emit *new* warnings above the 403 baseline.
- `tests/` Playwright specs for `prototype.html` should add a visual-diff case
  for the 1440, 1600, and 1920 viewports (v2 work).
