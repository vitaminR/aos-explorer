# mPRD-002 — Responsive Header Navigation

> **Status:** IMPLEMENTED (initial pass)
> **File touched:** `explorer.html`
> **Related:** `mSPEC_002_responsive_header_nav.md`

## Problem

The top header stuffs 15+ interactive elements on one row: logo + search + 7 mode
pills + 7 nav actions (Compare, Build Stack, Insights, Docs, Changelog, History,
What's New, Share). On common desktop widths (1440–1920 px) the search
placeholder was truncated ("Search products, s…") and trailing buttons such as
**History** were clipped off-screen.

## Goals

1. Never clip a header control at any supported viewport (≥320 px).
2. Progressive collapse: full labels → icon-only → hidden (with overflow menu).
3. Keep the active mode pill legible at all widths.
4. Keep search usable (≥120 px visible) at every breakpoint.
5. Signal affordances with tooltip fallbacks whenever labels collapse.

## Non-goals

- Total redesign of the header (color/theme changes are out of scope).
- Replacing the command palette (`Ctrl+K`).

## Scope — v1 (this pass)

- Raised the compact-nav breakpoint from `1440px` to `1900px` so nav-action
  labels collapse to icons earlier and prevent overflow on 1440–1920 px screens.
- Shortened the input `placeholder` from
  `Search products, strata, constructs…` to `Search…`, moved the long version
  into the `title` attribute for hover discovery.
- Kept existing `≤1100px`, `≤1024px`, and `≤640px` tiers untouched.
- Leaned on existing JS `syncHeaderResponsiveness()` overflow watcher as a
  second line of defense.

## Scope — v2 (follow-up)

- Overflow menu (`⋯`) that collects low-priority actions (History, What's New,
  Share) when width < 1280 px.
- Keyboard-shortcut legend surfaced in an always-reachable help modal.
- Single-letter label fallback for mode pills (`P / F / W / A / S / M / ★`)
  rendered *under* the emoji, so collapsed state stays scannable without a
  tooltip.

## Acceptance criteria (v1)

- [x] Header renders without horizontal overflow at 1280, 1366, 1440, 1600,
      1920 px.
- [x] Search input shows readable placeholder at all desktop widths.
- [x] `validate.py` passes with no new issues above the 403-baseline.
- [x] Active mode pill still shows its text label at every breakpoint.

## Risks

- Raising the collapse breakpoint shrinks the visual affordance window where
  labels are visible. Mitigation: `title=` tooltips on every pill and nav
  button remain in place.
