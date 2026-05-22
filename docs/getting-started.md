# Getting Started with {a}OS Explorer

## Quick Start

1. Open `explorer.html` in your browser
2. The guided tour will walk you through the interface
3. Click any stratum (layer) to expand it
4. Explore substrates and constructs inside each layer
5. Click product cards on the right to see classification details

## Understanding What You See

### The Stack

The central canvas shows the {a}OS reference stack — 7 horizontal layers stacked vertically from L7 (top, user-facing) to L1 (bottom, infrastructure).

Each layer has:

- A **color-coded indicator** on the left edge
- A **layer number** (L1–L7)
- A **name** describing its domain
- A **boundary question** — the key question that layer answers
- A **substrate count** showing how many sub-components exist

### Product Cards (Right Panel)

Each product card shows:

- **Name and vendor**
- **Strata dots** — a 7-bar mini-chart where lit bars = strata the product touches
- **Span label** — how many strata and which is primary
- **Confidence badge** — green (high), yellow (medium), red (low)

Click any card to see the full classification rationale in the detail panel below.

### The Left Rail

- **Strata** — click any stratum name to jump to it in the stack
- **Axes** — toggle Governance & Trust or Observability & Evaluation overlays
- **Filters** — narrow down by vendor, deployment model, license type

## Keyboard Navigation

Press `?` at any time to see the full shortcut list. The most useful:

- **`/`** — jump to search
- **`1` through `7`** — jump directly to a stratum
- **`Esc`** — collapse everything and reset

## What's Next

After familiarizing yourself with the prototype:

1. Try expanding L4 (Orchestration) and compare the products that overlap there
2. Add 2–3 products to the compare basket using the `+` buttons
3. Click through different mode pills to see the intended interaction patterns
4. Read the [full documentation](index.md) for API concepts and classification methodology
