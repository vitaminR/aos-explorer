# {a}OS Explorer — Three-Speed Knowledge Scaffold

> **Decision-first, content-second.**
> The primary purpose is vendor evaluation and stack selection.
> The secondary purpose is content export for LinkedIn / external reuse.

## Architecture

Three data tiers, each with its own volatility, review cadence, and schema.

```
data/
├── concepts.json               ← Tier A (stable)
├── products.json               ← Tier B (medium)
├── evidence/
│   ├── ev-bmad-001.json        ← Tier C (fast)
│   ├── ev-gsd-001.json
│   └── ev-langgraph-001.json
├── schemas/
│   ├── concept.schema.json
│   ├── product.schema.json
│   ├── evidence.schema.json
│   └── queue-item.schema.json
├── policies/
│   └── refresh-policy.json     ← Review cadence + scoring
├── queues/
│   └── refresh-queue.json      ← Pending review items
├── concepts.generated.js       ← AUTO-GENERATED (do not edit)
└── README.md                   ← You are here
```

## Tier A — Concept Cards (Stable)

| Property       | Value                                |
| -------------- | ------------------------------------ |
| File           | `concepts.json`                      |
| Schema         | `schemas/concept.schema.json`        |
| Review cadence | Quarterly                            |
| Auto-refresh   | No — human approval required         |
| Change risk    | High (downstream pages + products)   |

Concept cards are the taxonomy backbone. Each concept maps to one or more strata (L1–L7) and axes (Governance, Observability, etc.). Concepts are referenced by product cards and rendered as standalone HTML pages in `../concepts/`.

### How to add a concept

1. Add an entry to `concepts.json` with `"status": "seed"` and at minimum: `slug`, `name`, `shortDefinition`.
2. Run `python scripts/build_concepts.py` to generate the concept page and JS shim.
3. Add to the refresh queue if the explainer needs research.

### Content reuse hook

- `shortDefinition` → LinkedIn hook / card headline
- `explainer` → Post body or thread opener
- `antiPatterns[0]` → Hot-take / contrarian opener
- `mitigations[0]` → Resolution / recommendation

## Tier B — Product Cards (Medium Volatility)

| Property       | Value                                 |
| -------------- | ------------------------------------- |
| File           | `products.json`                       |
| Schema         | `schemas/product.schema.json`         |
| Review cadence | Monthly                               |
| Auto-refresh   | No — human approval required          |
| Change risk    | Medium (placements, confidence)       |

Product cards carry placement metadata, confidence scores, and concept mappings. Each product links to one or more evidence packets. The prototype UI renders products from `PRODUCT_DETAILS` in `explorer.html` — product cards here are the structured source of truth that will eventually replace inline definitions.

### How to add a product

1. Add an entry to `products.json` with `"status": "active"`.
2. Create a stub evidence packet in `evidence/` (see Tier C).
3. Ensure `conceptMappings` point to valid slugs in `concepts.json`.
4. Add refresh queue item if evidence is incomplete.

### Content reuse hook

- `rationale` → LinkedIn comparison post body
- `conceptMappings[].why` → "Why X is the best at Y" micro-claim
- `confidence` → Trust signal for recommendations

## Tier C — Evidence Packets (Fast-Changing)

| Property       | Value                                |
| -------------- | ------------------------------------ |
| Directory      | `evidence/`                          |
| Schema         | `schemas/evidence.schema.json`       |
| Review cadence | On-demand (TTL-based, default 90d)   |
| Auto-refresh   | Yes (future agents)                  |
| Change risk    | Low (replaceable, scoped to product) |

Evidence packets are volatile, replaceable observations. Each backs a product placement or concept claim. They expire after their TTL and get replaced, not edited.

### How to add evidence

1. Create `evidence/ev-<productId>-<seq>.json` using the schema.
2. Set `status: "stub"` if claims are empty.
3. Reference the ID in the parent product's `evidenceIds` array.
4. If the evidence is a stub, add a queue item with reason `"stub-evidence"`.

### Content reuse hook

- `claims[].claim` → LinkedIn factoid / supporting evidence
- `summary` → Research note for post background
- `sourceUrl` → Citation / "source" link in posts

## Refresh System

### Policy (`policies/refresh-policy.json`)

Defines per-tier review cadence, trigger conditions, and scoring weights.

Priority formula:

```
priority = (demand × 0.25) + (strategicImportance × 0.20)
         + (volatility × 0.25) + (confidenceDecay × 0.15)
         + ((1 - trustLevel) × 0.15)
```

Thresholds: `urgent ≥ 0.8` · `soon ≥ 0.6` · `backlog ≥ 0.4` · `skip < 0.2`

### Queue (`queues/refresh-queue.json`)

Items waiting for review. Sorted by priority descending. Currently processed manually; future agents will consume this queue.

### How to request a refresh

1. Add an item to `refresh-queue.json` with a unique `rq-NNN` ID.
2. Set `targetType` (concept / product / evidence) and `targetId`.
3. Compute priority using the scoring formula or estimate it.
4. Set `status: "pending"`.

## Validation

Run the scaffold integrity checker:

```bash
python scripts/validate_scaffold.py
```

This checks:

- All concept slugs are unique, all aliases are collision-free
- All product `conceptMappings` point to valid concept slugs
- All product `evidenceIds` reference existing evidence files
- All evidence `productId` values match a product in `products.json`
- All queue `targetId` values resolve to a real concept, product, or evidence
- No orphan evidence files (not referenced by any product)
- Schema field presence (required fields per tier)

## Decision-Making Flow (Primary)

```
Concept Card (what is it?)
    ↓
Product Cards (who does it?)
    ↓
Evidence Packets (proof it works)
    ↓
Refresh Queue (what's stale?)
    ↓
Decision: pick / drop / revisit
```

## Content Export Flow (Secondary)

```
Concept Card → shortDefinition + antiPattern → LinkedIn hook
Product Card → rationale + conceptMapping.why → comparison post
Evidence → claims + sourceUrl → cited factoid thread
```

No generators tonight. The hooks above are field-level — any content pipeline can read `concepts.json` / `products.json` and extract the right fields.
