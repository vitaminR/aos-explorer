## Impeccable — design quality gate

Impeccable (https://impeccable.style) is the design anti-pattern guard for this repo. It prevents AI-generated UIs from defaulting to the Inter-font / purple-gradient / nested-card pattern.

**Install (run once per machine):**
```
npx skills add pbakaus/impeccable
```

**Pre-deploy gate — always run before any `firebase deploy`:**
```
npx impeccable detect prototype.html --json
```
If the JSON output contains any `severity: "critical"` entries, fix them before deploying. Medium/low are warnings only.

**Design commands — use when generating or revising UI in this repo:**
- `/impeccable audit` — full anti-pattern scan with explanations
- `/impeccable polish` — targeted rework of the worst offenders
- `/impeccable colorize` — OKLCH-aware color system check
- `/impeccable typeset` — typography hierarchy fix
- `/impeccable layout` — spatial rhythm and grid check

**Core design rules for this repo (from Impeccable reference files):**

Typography: Use a font stack with personality. No Inter for body + Inter for headings. Establish a clear type scale with meaningful size ratios (1.25× or 1.333×). Line-height 1.5–1.6 for body, tighter for headings.

Color: Use OKLCH for all colors. Contrast minimum 4.5:1 for body text, 3:1 for large text. No purple-to-blue gradient hero. Brand color should appear in one dominant role, not everywhere.

Spatial: 4px base unit. Consistent spacing scale (4/8/12/16/24/32/48/64). No arbitrary pixel values. Sections breathe — min 64px vertical padding. Cards use 24px inner padding minimum.

Motion: Only animate transform and opacity (GPU-composited). Durations 150–300ms for UI, 400–600ms for page transitions. Use ease-out for enters, ease-in for exits.

Anti-patterns to never introduce:
- Glowing/neon border on every card
- Drop shadow on text
- Gradient text on body copy
- 5+ font weights in a single view
- Nested cards (card inside card inside card)
- Skeleton screens that match nothing in the actual loaded state
- Hero metric numbers with no context

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- For cross-module "how does X relate to Y" questions, prefer `graphify query "<question>"`, `graphify path "<A>" "<B>"`, or `graphify explain "<concept>"` over grep — these traverse the graph's EXTRACTED + INFERRED edges instead of scanning files
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)
