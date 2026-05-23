> **PREAMBLE** | Type: PRD | Status: draft (awaiting user sign-off)
> Owner: nymil | Date: 2026-05-23 | Goal: G3 Builder Community
> Phase 2c — End the dual-catalog drift by establishing a single source of truth (SSoT) for product metadata that the live UI reads.

# PRD: {a}OS Explorer — Phase 2c: Catalog Single-Source-of-Truth Reconciliation

**Status:** Draft — opinionated, every decision flagged A/B/C for fast review
**Date:** 2026-05-23
**Owner:** nymil
**Depends on:** Phase 2b reconciliation audit (`audit/phase2b-catalog-reconciliation.md`), `scripts/check-catalog-drift.py` guardrail
**Out of scope:** filter UI redesign, evidence schema changes, brand or "Golden Path" renames

---

## 1. Problem Statement

The aOS Explorer maintains **two parallel product catalogs** that drift independently:

| Catalog | Location | Count | Role |
|---|---|---|---|
| `PRODUCT_DETAILS` | `explorer.html` inline JS (~line 13928) | 51 | **LIVE** — what the UI reads |
| `products.json` | `data/products.json` | 37 | Static file, **NOT** read by the live UI |

This is not a hypothetical risk. On **2026-05-23** commit `a6d62de` ("fix(taxonomy)") corrected the canonical stratum names for `aosnaming`, `fallow`, and `routa` — but **only patched `products.json`**, the catalog the UI never reads. End-users continued to see the old non-canonical stratum names until Phase 2b manually propagated those three fixes to `PRODUCT_DETAILS`. Every taxonomy edit today carries a coin-flip risk of landing in the dead catalog.

Additional concrete drift documented in the Phase 2b audit:

- 9 shared IDs; 7 mismatches (1 type, 3 primary strata, 3 secondary strata)
- 42 PD-only entries (live but no static-data backing)
- 28 PJ-only entries (static data, never rendered)
- 3 dual-ID duplicates with hard rename constraints: `claudecode`/`claude-code`, `hermesagent`/`hermes-agent`, `hermesmodel`/`hermes-model`
- Two non-overlapping type vocabularies (PD: 8 entity-class terms; PJ: 10 taxonomy terms with `platform`, `infrastructure`, `model-api`)

The guardrail script `scripts/check-catalog-drift.py` ships red today by design — Phase 2c is what makes it green sustainably.

## 2. Goal

**One canonical catalog file. The live UI reads it. Drift becomes structurally impossible.**

Success looks like:

1. A single JSON file is the source of truth for every product the UI renders.
2. `explorer.html` consumes that file at load time (or at build time) — never via a hand-maintained inline duplicate.
3. `scripts/check-catalog-drift.py` exits `0` and stays green.
4. Every URL anchor that resolved before 2c still resolves after 2c (no rename damage).

## 3. Decision Points (user picks A / B / C)

Each subsection ends with a **Recommendation** and a one-line **Trade-off** so the user can override quickly.

### 3.1 Which catalog wins as canonical?

| Option | Pros | Cons |
|---|---|---|
| **A. `data/products.json` wins** | Already has `$comment`, `schemaVersion`, evidence IDs, clean schema; designed as data, not code | Smaller (37 vs 51) — must absorb 42 PD-only entries |
| B. `PRODUCT_DETAILS` inline wins | Already has all 51 live entries; zero data-loss risk | Inline JS is not authorable as data; defeats the purpose of an SSoT |
| C. New third file (e.g. `data/catalog.v2.json`) | Clean break, freedom to redesign | Triple-catalog interim; highest churn |

**Recommendation: A.** `products.json` is the only one of the three that was *designed* to be the source of truth (schemaVersion, $comment, evidence IDs). The 42-entry backfill is mechanical, not creative.
**Trade-off:** A larger one-time migration than B, but B forecloses the entire goal.

### 3.2 How does the live UI consume the canonical file?

| Option | Pros | Cons |
|---|---|---|
| **A. `fetch('/data/products.json')` on DOMContentLoaded** | Simplest; works for static hosting; one source on disk and in the browser | Requires UI to handle async load; small first-paint cost |
| B. Build step inlines JSON → `explorer.html` at deploy time | Zero runtime change; identical perf to today | Requires a build pipeline; reintroduces a "compiled" inline copy that *looks* editable but isn't |
| C. Server-side render | Most flexible | Adds a server; violates current static-hosting posture |

**Recommendation: A.** Matches the project's no-backend posture, eliminates build-step ceremony, and the inline copy literally cannot drift if it does not exist.
**Trade-off:** Live UI shows a brief skeleton until JSON loads (sub-100ms on local). Acceptable; mitigate with a tiny loading state.

### 3.3 Aliasing strategy for the 3 dual-ID duplicates

Hard rule: **no ID renames** (URL anchors + search depend on them). The canonical entry must keep working under BOTH historical IDs.

| Option | Shape | Pros | Cons |
|---|---|---|---|
| **A. `aliases: []` array on canonical entry** | `{ "id": "claudecode", "aliases": ["claude-code"], … }` | One row of truth; aliases resolve at lookup time | Lookup helper must check aliases |
| B. Canonical + deprecated stub entries | Two rows; stub has `deprecated: true, canonical: "claudecode"` | Explicit; surfaces in audits | Two rows can drift again |
| C. Server-side 301 redirects on the anchor | URL-level fix | Decouples data from URL handling | Requires server (violates 3.2-A) |

**Recommendation: A** with PD-style ID (`claudecode`, `hermesagent`, `hermesmodel`) as canonical and PJ-style as alias. PD-style is the one currently live in the UI; preserving live IDs minimizes anchor risk.
**Trade-off:** A small `resolveProductId(id)` helper is required in the UI. ~10 lines.

### 3.4 Unified type vocabulary

Today: PD has 8, PJ has 10, 6 overlap. Proposing a unified 9-term set that covers every existing entry without forcing reclassification of well-known categories.

**Proposed unified vocabulary (9):**

| Type | Replaces | Definition |
|---|---|---|
| `platform` | PD `product` (when hosted/managed) | Hosted service, managed multi-capability |
| `framework` | (shared) | Installable orchestration / agent / dev library |
| `tool` | (shared) | Single-purpose utility or CLI |
| `agent` | (shared) | Autonomous or semi-autonomous executor |
| `skill` | (shared) | Reusable capability primitive |
| `mcp` | (PD only) | MCP server / Model Context Protocol surface |
| `workflow` | (PD only) | Pipeline / recipe / template |
| `model` | (shared, absorbs PJ `model-api`) | LLM weights or hosted inference endpoint |
| `infrastructure` | (PJ only) | Datastore, vector DB, observability backend, secrets |

**Retired:**

- PD `product` → split to `platform` (if hosted) or stays distinct only for first-party `kotana`, `paperclip`, `aosexplorer` (see Open Q).
- PJ `model-api` → folds into `model`.

**Recommendation: above 9-term set.**
**Trade-off:** 28 PJ-only and 42 PD-only entries need a single-field type re-tag; mechanical, scriptable, low-risk because the live UI's type filter already accepts all 9 (the labels map already covers them after Phase 2a).

### 3.5 Migration order

| Option | Order | Pros | Cons |
|---|---|---|---|
| **A. Shared-first → PJ-only → PD-only** | Fix the 9 shared IDs in canonical file, then render the 28 PJ orphans, then backfill the 42 PD-only into canonical | Lowest user-visible risk per step; UI grows monotonically | Slowest visible progress |
| B. Backfill PD-only first | Get the canonical file to 51+ before UI cutover | UI cutover is one big bang | Big-bang risk |
| C. Drop-first cleanup | Cull anything unowned before UI cutover | Smallest canonical file | Visible regressions if anything gets culled wrong |

**Recommendation: A.** For each of the 28 PJ-only entries, do a **render-or-drop** call (recommend default = render, since these are real industry products like Pinecone, Bedrock, Vault). For each of the 42 PD-only entries, **backfill into canonical with the existing PD field values verbatim**, then re-validate with the guardrail.

## 4. Non-Goals (Phase 2c)

- Not changing the explorer's filter UI (left rail, badges, search).
- Not redesigning the evidence schema or `CONFIDENCE_META` shape.
- Not adding new products (that's Phase 2d / 3).
- Not renaming the {a}OS brand or "Golden Path."
- Not wiring the guardrail into CI (separate ops ticket).
- Not building a product-submission flow.

## 5. Phased Rollout

| Phase | Milestone | Exit Criteria |
|---|---|---|
| **2c.1 — Consolidate** | Canonical = `data/products.json`. Backfill 42 PD-only entries; merge/alias the 3 dual-ID duplicates; apply unified type vocabulary; resolve render-or-drop on 28 PJ-only entries. | `products.json` contains every ID currently rendered live; `check-catalog-drift.py` exits 0; inline `PRODUCT_DETAILS` still present (untouched). |
| **2c.2 — UI Cutover** | `explorer.html` loads `data/products.json` via fetch on DOMContentLoaded; adds `resolveProductId()` helper for aliases; removes the inline `PRODUCT_DETAILS` constant. | Live UI byte-equivalent to pre-cutover snapshot for every existing card; all URL anchors resolve; no console errors. |
| **2c.3 — Cleanup** | Delete inline `PRODUCT_DETAILS`; document SSoT in `docs/`; update `check-catalog-drift.py` to verify "inline catalog does not exist" rather than "inline and json agree." | Repo grep for `PRODUCT_DETAILS = {` returns zero hits in `explorer.html`; doc page published. |

## 6. Verification

A 2c-complete repo must pass all four:

1. `python3 scripts/check-catalog-drift.py` exits `0`.
2. Snapshot diff: render every product card before and after cutover; **byte-equivalent HTML** for the card body (allow whitespace tolerance).
3. URL-anchor sweep: enumerate every `#id` anchor referenced by the pre-cutover page; assert every one resolves to a visible card post-cutover (covers the alias requirement for the 3 dual-IDs).
4. Visual smoke: Playwright run of existing E2E suite passes unchanged.

## 7. Open Questions (explicit sign-off needed)

- **Q1 (3.1):** Confirm `data/products.json` as canonical — OR override to B/C?
- **Q2 (3.2):** Confirm `fetch()` on load — OR prefer build-step inline?
- **Q3 (3.3):** Confirm PD-style IDs (`claudecode`, `hermesagent`, `hermesmodel`) win as canonical, slug-style become aliases — OR flip it?
- **Q4 (3.4):** Confirm the 9-term unified vocabulary — and specifically:
  - 4a. Should first-party tools (`kotana`, `paperclip`, `aosexplorer`, `kotanaagent`) keep a distinct `product` type, or fold into `platform`/`tool`?
  - 4b. Is `infrastructure` a keeper, or should Pinecone/Vault/Grafana be reclassified to `platform`?
  - 4c. Is the `mcp` type strong enough to keep, or should the 6 PD `mcp*` entries become `tool` with a tag?
- **Q5 (3.5):** Default for render-or-drop on the 28 PJ-only entries: render-all (recommended) OR drop-all-and-restore-by-request?
- **Q6 (Phase 2c.2):** Acceptable to ship a brief loading skeleton (~100ms) on first paint, or must the UI block until JSON resolves?
- **Q7 (Verification):** Is Playwright the right gate for "byte-equivalent UI," or do we want a separate snapshot script?
- ~~**Q8 (Section 5.f from Phase 2b audit):** Should the `routa` prose fix in `CONFIDENCE_META` (line ~16352) land in 2c.1 or stay deferred?~~ Already shipped 2026-05-23 in commit `6089308` (out-of-band cleanup).

---

## Appendix A: Field Mismatch Summary (from Phase 2b audit, for reference)

Already shipped in 2b + 2026-05-23 cleanup (do not redo): `aosnaming.primary`, `fallow.primary`, `routa.primary+secondary` patched in PD; `cursor.type` patched in PJ; `routa` `CONFIDENCE_META` prose at explorer.html ~16352 patched (commit `6089308`); 3 secondary-strata SME debates resolved and applied to both catalogs per `audit/phase2b-sme-proposals.md`.

Still red after 2b (carried into 2c.1):

- `bmad.secondary`: PD `L7, L2` vs PJ `L3` — SME call.
- `cursor.secondary`: PD `L3` vs PJ `L4, L3` — SME call.
- `gsd.secondary`: PD `L2` vs PJ `L3` — SME call.

These three should be resolved as part of 2c.1 consolidation. They are the smallest remaining drift but block the guardrail from going green.

## Appendix B: Hard Constraints (do not violate)

- No ID renames. Anchors and search are stable.
- No brand renames. {a}OS stays {a}OS. "Golden Path" only describes Meta Builds.
- No framework churn. Next.js 15 + TS + Tailwind + Framer Motion stay put.
- No auto-deploy from this PRD's commits; build and validate locally first.
