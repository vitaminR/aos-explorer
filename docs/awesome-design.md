# {a}OS Explorer — Design System

> Living reference for every visual pattern, component, and responsive behaviour in `explorer.html`.

---

## 1. Colour Tokens

### Backgrounds

| Token | Value | Use |
|-------|-------|-----|
| `--bg-base` | `rgb(8, 10, 12)` | Page floor |
| `--bg-card` | `rgb(14, 16, 20)` | Card resting state |
| `--bg-card-hover` | `rgb(20, 22, 28)` | Card :hover |
| `--bg-surface` | `rgb(18, 20, 26)` | Input fields, pills, elevated regions |
| `--bg-elevated` | `rgb(24, 26, 34)` | Modals, tooltips, highest-z surfaces |

### Text

| Token | Value | Use |
|-------|-------|-----|
| `--text-primary` | `rgba(255,255,255, 0.9)` | Headings, body copy |
| `--text-secondary` | `rgba(255,255,255, 0.6)` | Descriptions, secondary labels |
| `--text-tertiary` | `rgba(255,255,255, 0.4)` | Placeholders, helper text |
| `--text-quaternary` | `rgba(255,255,255, 0.2)` | Disabled, ghost text |

### Accent

| Token | Value | Use |
|-------|-------|-----|
| `--accent-indigo` | `#818cf8` | Primary action colour, links, badges |
| `--accent-blue` | `#60a5fa` | Secondary accent, info states |
| `--accent-gradient` | `linear-gradient(135deg, #94a3b8, #e2e8f0)` | Logo text fill |
| `--glow-indigo` | `rgba(129, 140, 248, 0.15)` | Focus rings, active pills |

### Stratum Colours (L1–L7)

Each layer has a solid colour and a glow variant:

| Layer | Colour | Glow |
|-------|--------|------|
| L7 Experience | `#c75a00` | `rgba(199, 90, 0, 0.12)` |
| L6 Governance | `#e15759` | `rgba(225, 87, 89, 0.12)` |
| L5 Observability | `#b07aa1` | `rgba(176, 122, 161, 0.12)` |
| L4 Orchestration | `#59a14f` | `rgba(89, 161, 79, 0.12)` |
| L3 Execution | `#edc948` | `rgba(237, 201, 72, 0.12)` |
| L2 Knowledge | `#22d3ee` | `rgba(34, 211, 238, 0.12)` |
| L1 Models | `#1e40af` | `rgba(30, 64, 175, 0.12)` |

### Card Highlight Ring

Used when a card is keyboard-focused or basket-highlighted:

| Token | Value |
|-------|-------|
| `--card-highlight-ring` | `rgba(129, 140, 248, 0.82)` |
| `--card-highlight-border` | `rgba(129, 140, 248, 0.38)` |
| `--card-highlight-glow` | `rgba(99, 102, 241, 0.22)` |
| `--card-highlight-surface` | `rgba(129, 140, 248, 0.08)` |

### Borders

| Token | Value |
|-------|-------|
| `--border` | `rgba(255,255,255, 0.06)` |
| `--border-hover` | `rgba(255,255,255, 0.12)` |

---

## 2. Typography

| Property | Value |
|----------|-------|
| Font family | `Inter`, system-ui fallback |
| Weights used | 300 (light), 400 (regular), 500 (medium), 600 (semi-bold), 700 (bold) |
| Logo size | 18 px (desktop), 16 px (tablet), 14 px (mobile) |
| Body / card text | 12–13 px |
| Section headings | 14–16 px |
| Stratum names | 13–14 px, weight 600 |

---

## 3. Layout

### Page Grid

```
.app-layout  =  grid-template-columns: 240px  1fr  280px
```

| Breakpoint | Columns |
|------------|---------|
| > 1100 px | `240px 1fr 280px` |
| ≤ 1100 px | `200px 1fr 260px` |
| ≤ 1024 px | `160px 1fr 220px` |
| ≤ 640 px | `1fr` (single column, rails collapse) |

### Header

```
.header  =  flex | gap: 20px | height: 64px | sticky top: 0
            glass: rgba(8,10,12, 0.8) + backdrop-filter: blur(20px)
```

Children (left → right):

1. **`.logo`** — `flex-shrink: 0`, gradient text
2. **`.search-bar`** — `flex: 1`, max-width 400 px, expands on focus
3. **`.mode-pills`** — 7 filter buttons, `flex: 0 1 auto; overflow: hidden`
4. **`.compare-basket-btn`** — `flex-shrink: 0`
5. **`.docs-link`** — `flex-shrink: 0`
6. **`.share-btn`** — `flex-shrink: 0`

---

## 4. Responsive Behaviour

### Adaptive Nav (3-stage responsive)

The header nav collapses in three stages — driven by CSS media queries with a JS-based `syncHeaderResponsiveness()` as a supplementary detection layer.

| Stage | Trigger | Effect |
|-------|---------|--------|
| **Normal** | > 1440 px | Full text labels on pills and action buttons |
| **Compact** | ≤ 1440 px (CSS) or `.compact-nav` (JS) | Pills collapse to 34 px emoji-only icons; action buttons collapse to 36 px icon-only |
| **Tiny** | ≤ 1100 px (CSS) or `.tiny-nav` (JS) | Pills hidden entirely; search bar expands |
| **Mobile** | ≤ 640 px | Header wraps, search goes full-width on row 2, pills become scrollable row |

### CSS Classes Applied by JS

| Class | Effect |
|-------|--------|
| `.compact-nav` | Emoji-only pills (via `data-emoji`), icon-only `.nav-action` buttons (via `data-emoji`) |
| `.tiny-nav` | Hides `.mode-pills` entirely |
| `.search-priority` | Expands search bar (`flex-basis: clamp(300px, 48vw, 640px)`) |

### Key Flex Rules (Nav Bar Stability)

These prevent layout overflow and ensure the JS overflow-detection actually triggers:

| Selector | Rule | Why |
|----------|------|-----|
| `.logo` | `flex-shrink: 0` | Prevents logo text from truncating |
| `.mode-pills` | `flex: 0 1 auto; min-width: 0; overflow: hidden` | Pills shrink gracefully instead of pushing siblings out |
| `.compare-basket-btn` | `flex-shrink: 0; white-space: nowrap` | Button stays fully visible |
| `.docs-link` | `flex-shrink: 0; white-space: nowrap` | Link stays fully visible |
| `.share-btn` | `flex-shrink: 0; white-space: nowrap` | Button stays fully visible |

### Breakpoint Summary

| Width | Nav | Grid | Notes |
|-------|-----|------|-------|
| > 1440 px | Full labels | 240 / 1fr / 280 | Default desktop |
| ≤ 1440 px | Compact (emoji-only) | 240 / 1fr / 280 | CSS media query triggers compact |
| ≤ 1100 px | Tiny (pills hidden) | 200 / 1fr / 260 | Grid also narrows |
| ≤ 1024 px | Tiny | 160 / 1fr / 220 | Tablet refinements |
| ≤ 640 px | Wrapped + scrollable | 1fr | Mobile single-column |

---

## 5. Components

### Mode Pills (`.mode-pill`)

Category filter buttons in the header.

| State | Background | Border | Text |
|-------|-----------|--------|------|
| Default | transparent | transparent | `--text-tertiary` |
| Hover | `--bg-surface` | transparent | `--text-secondary` |
| Active | `--glow-indigo` | `rgba(129,140,248, 0.2)` | `--accent-indigo` |
| Disabled | transparent (opacity 0.3) | — | — |

Each pill has a `data-emoji` attribute for compact mode rendering.

### Product Cards

| Property | Value |
|----------|-------|
| Background | `--bg-card` → `--bg-card-hover` on hover |
| Border | `--border` → `--border-hover` on hover |
| Border-radius | 14 px |
| Padding | 18 px |
| Transition | `all 0.25s` |

Highlights (`keyboard-focused`, `compare-highlight`) use the `--card-highlight-*` ring tokens.

### Compare Basket Button (`.compare-basket-btn`)

| Property | Value |
|----------|-------|
| Background | `--bg-surface` |
| Border | `--border` |
| Border-radius | 10 px |
| Padding | 8 px 16 px |
| Badge | `--accent-indigo` background, white text, 10 px border-radius pill |

### Share Button (`.share-btn`)

| Property | Value |
|----------|-------|
| Background | transparent |
| Border | `1px solid --border` |
| Border-radius | 8 px |
| Padding | 6 px 14 px |
| Hover | `--accent-indigo` text + border |

### Search Bar (`.search-bar`)

| Property | Value |
|----------|-------|
| Max-width | 400 px (default), 640 px (focus / search-priority) |
| Input radius | 10 px |
| Focus ring | `--accent-indigo` border + `--glow-indigo` box-shadow (3 px) |
| Keyboard shortcut | `⌘K` badge, top-right inside input |

### Breadcrumb (`.breadcrumb`)

| Property | Value |
|----------|-------|
| Background | `--bg-surface` |
| Border-radius | 10 px |
| Font size | 12 px |
| Separator | `›` character in `--text-quaternary` |

---

## 6. Animations & Effects

### Aurora Background

Three gaussian blobs (`filter: blur(120px)`, opacity 0.07) drift on a 20 s infinite loop (`aurora-drift` keyframes). Purely decorative — `pointer-events: none`, `z-index: 0`.

### Transitions

| Element | Duration | Easing |
|---------|----------|--------|
| Cards (all) | 0.25 s | ease |
| Pills, nav-actions | 0.2 s | ease |
| Search bar flex | 0.24 s | ease |
| Header glass | — (static backdrop-filter) | — |

### Hover Effects

- Cards: background + border colour shift, subtle `translateY(-1px)` lift
- Pills: background fade-in + text colour shift
- Buttons: border and text colour transitions to `--accent-indigo`

---

## 7. Spacing Scale

Follows an 8-point base with 4-point tweaks:

| Size | Use |
|------|-----|
| 4 px | Pill gap (compact, mobile) |
| 6 px | Compact pill padding, small gaps |
| 8 px | Card inner gaps, mobile header gap |
| 12 px | Compact header gap, tablet padding |
| 16 px | Rail padding, inline padding |
| 18 px | Card padding |
| 20 px | Default header gap, main canvas padding |
| 24 px | Header horizontal padding |

---

## 8. Accessibility

| Feature | Implementation |
|---------|---------------|
| Keyboard nav | `1`–`7` jumps to strata, `/` focuses search, `c` toggles compare |
| Focus rings | `--card-highlight-ring` glow on keyboard-focused cards |
| ARIA | Buttons have `aria-label` and `role` attributes |
| Colour contrast | Text tokens maintain ≥ 4.5:1 against `--bg-base` |
| Reduced motion | No `prefers-reduced-motion` override yet (TODO) |

---

## 9. Nav Bar Fix History (April 2026)

### Problem

Header nav truncated the logo ("{a}OS Explor"), overflowed the "Golden Path" pill, and cramped action buttons at viewport widths below ~1600 px.

### Root Cause

1. **JS detection bug**: `syncHeaderResponsiveness()` uses `scrollWidth > clientWidth` to toggle compact/tiny classes, but flexbox children **shrink** to fit — so overflow never triggers.
2. **CSS duplication**: ~94 lines of duplicate CSS (search-bar, mode-pills, compare-basket-btn) existed between two `/* ===== BREADCRUMB ===== */` comments, causing selector conflicts and silent style overrides.

### Fixes Applied

| # | Change | Effect |
|---|--------|--------|
| 1 | Removed duplicate CSS block (~94 lines) | Eliminated selector conflicts |
| 2 | `.logo { flex-shrink: 0 }` | Logo never truncates |
| 3 | `.mode-pills { flex: 0 1 auto; min-width: 0; overflow: hidden }` | Pills shrink gracefully within bounds |
| 4 | `.compare-basket-btn { flex-shrink: 0; white-space: nowrap }` | Button stays whole |
| 5 | `.share-btn { flex-shrink: 0; white-space: nowrap }` | Button stays whole |
| 6 | `.docs-link { flex-shrink: 0; white-space: nowrap }` | Link stays whole |
| 7 | CSS media queries at 1440 px / 1100 px | Reliable compact/tiny fallbacks independent of JS |
