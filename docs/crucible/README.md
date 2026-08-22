# aOS Explorer — Taxonomy Scaling Crucible

> Pipeline to refactor the {a}OS Explorer's taxonomy from flat substrate lists
> to a **core-substrate + product-overlay** architecture that scales from 40 to 400+ products.

## Lanes

| Lane | Artifact | Status |
|------|----------|--------|
| **R1 — Taxonomy Audit** | [`R1_taxonomy_audit.md`](R1_taxonomy_audit.md) | ✅ R1:AUDITED |
| **R2 — Refactoring PRD** | [`R2_PRD_taxonomy_refactor.md`](R2_PRD_taxonomy_refactor.md) | ✅ R2:DESIGNED |
| **R3 — Product mPRDs** | [`R3_mPRD_template.md`](R3_mPRD_template.md) + per-product mPRDs | Template ready |
| **R4 — Implementation** | Code changes to `explorer.html` | Not started |

## Gate System

```
R1:AUDITED → R2:DESIGNED → R3:MAPPED → R4:IMPLEMENTED
```

## Problem Statement

The current prototype renders **named frameworks** (GSD, BMAD, Superpowers) as first-class substrates
alongside universal patterns (Workflow Engines, Agent Frameworks). This conflation:

1. **Breaks the canonical ontology** — the reference stack v1.0 defines substrates as generic tool
   categories, not branded products.
2. **Won't scale** — at 400 products, each stratum would need scrollbars for 50+ substrate entries.
3. **Hides commonality** — GSD's "Context Pack" and BMAD's "Persona Handoff" both decompose into
   primitives that belong in core orchestration substrates.
4. **Can't rank** — no mechanism to surface top-3 products per substrate/construct/stratum.

## Target Architecture

```
STRATUM (Stratum)
  └── CORE SUBSTRATE (universal pattern, ≤8 per stratum, stable)
        └── CONSTRUCT (abstract building block)
              └── PRIMITIVE (atomic unit)
                    └── PRODUCT OVERLAY (which products implement this, ranked by confidence)
```

Named frameworks become product overlays that **map onto** core substrates — shown as badges,
guide cards, and ranked lists — never as substrate entries themselves.
