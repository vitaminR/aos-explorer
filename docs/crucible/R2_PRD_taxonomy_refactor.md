# R2 — PRD: Taxonomy Refactor & Product Overlay System

> **Status:** DESIGNED
> **Date:** 2026-04-12
> **Depends on:** R1_taxonomy_audit.md (R1:AUDITED ✅)
> **Canonical ref:** `6.aOS/01.Reference-Model/agentic-reference-stack-v1.md`

---

## 1. Problem

The {a}OS Explorer prototype renders named agentic frameworks (GSD, BMAD, Superpowers) as first-class
substrates in L4, violating the canonical reference stack's design rule:

> *"Products do not live in only one place. Every product gets primary stratum, secondary strata,
> axis roles if applicable."* — Reference Stack v1.0, Rule 2.2

At 43 products this is manageable. At 400 it produces unusable scroll-heavy menus with no
ranking signal. The taxonomy conflates **what a pattern is** (substrate) with **who implements it**
(product).

---

## 2. Goals

| # | Goal | Metric |
|---|------|--------|
| G1 | Core substrates are stable universal patterns | ≤8 per layer, no branded names |
| G2 | Products are ranked overlays, not structural elements | Top-3 visible by default per substrate |
| G3 | UI scales to 400 products without scrollbar hell | No substrate list exceeds viewport without collapse |
| G4 | Top-3 leaderboard works at every ontology level | Layer, substrate, construct each show ranked products |
| G5 | Named product constructs/primitives preserved | Zero data loss from GSD/BMAD/SP constructs |

---

## 3. Non-Goals

- Redesigning the 7-layer model itself
- Changing the canonical reference stack v1.0
- Building a backend/database (prototype remains self-contained HTML)
- Adding new products (that's R3)

---

## 4. Data Model Changes

### 4.1 Current Model

```
prototype.html (HTML)
  └── substrate-item (flat list per layer, some are products)
        └── construct-panel
              └── primitive-panel

PRODUCT_DETAILS (JS object)
  └── per product: { name, type, vendor, primary, secondary, confidence, ... }

PRIMITIVE_PRODUCT_GUIDES (JS object)
  └── per primitive: [{ product, title, guide, evidence }]
```

### 4.2 Target Model

```
CORE_SUBSTRATES (NEW JS object)
  └── per substrate: {
        id, name, layer, icon, desc,
        constructs: [{
          id, name, icon,
          primitives: [string],
          product_origins: { primitive_key: [product_key] }
        }]
      }

PRODUCT_DETAILS (enhanced)
  └── per product: {
        ...existing fields...,
        substrate_mappings: [{
          substrate_id,
          relevance: 0-1,          // ranking signal
          constructs_touched: [],   // which constructs they map to
        }]
      }

PRODUCT_RANKINGS (COMPUTED at load time)
  └── per substrate: top-N products sorted by relevance × confidence
  └── per layer: top-N products across all substrates
  └── global: top-N products by coverage breadth
```

### 4.3 Migration: Named Products → Overlays

| Current Substrate | Action | Constructs Move To |
|-------------------|--------|-------------------|
| GSD (l4s-gsd) | **Remove** as substrate | Context Pack → Workflow Engines; State File Set → Workflow Engines; Lifecycle Checkpoint → Retry & Recovery |
| BMAD (l4s-bmad) | **Remove** as substrate | PRD → Workflow Engines; Persona Handoff → Agent Frameworks; Requirement Matrix → Workflow Engines |
| Superpowers (l4s-sp) | **Remove** as substrate | Test Gate → Quality Gates (NEW); tmux Session → L3 Code Execution; TDD Workflow Path → Quality Gates (NEW) |

Each migrated construct gains a `product_origin` tag (e.g., `"origin": "gsd"`) so the
product overlay system can show "This construct pattern is implemented by GSD, Claude Code,
OpenHands..." with relevant guides.

---

## 5. UI Design

### 5.1 Substrate → Product Badge Bar (existing, formalized)

Each substrate header already shows product dots. Formalize:

```
┌─────────────────────────────────────────────────────┐
│ 🔧 Workflow Engines                                 │
│   DAG runners, state machines, orchestration graphs │
│                                    [AF] [HM] [+5]  │
└─────────────────────────────────────────────────────┘
```

- Show **top 3** product dots by ranking
- `[+N]` chip expands to full product list

### 5.2 Layer Header → Top-3 Products

```
┌──────────────────────────────────────────────────────────┐
│ L4  Orchestration & Decisioning                          │
│     What happens next, in what order, with which agent?  │
│     6 substrates · 24 primitives · TOP: [AF] [CW] [LG]  │
└──────────────────────────────────────────────────────────┘
```

### 5.3 Construct-Level Product Origin Tags

When a construct has `product_origin`, show a subtle tag:

```
┌─────────────────────────────────────────┐
│ 📦 Context Pack         ← from GSD     │
│   Primitives: active_task_id, ...       │
│   Also in: Claude Code, OpenHands       │
└─────────────────────────────────────────┘
```

### 5.4 "Leaderboard" Panel (New)

Optional floating panel or tab that shows:

| Rank | Product | Layers Touched | Avg Confidence | Type |
|------|---------|---------------|---------------|------|
| 1 | Azure AI Foundry | 5/7 | 0.92 | product |
| 2 | Claude Code | 5/7 | 0.92 | agent |
| 3 | CrewAI | 2/7 | 0.90 | framework |

### 5.5 Scale Thresholds

| Products in Substrate | UI Behavior |
|----------------------|-------------|
| 0-3 | Show all product dots |
| 4-6 | Show top 3 + `[+N]` chip |
| 7-15 | Show top 3 + `[+N]` → dropdown |
| 16+ | Show top 3 + `[+N]` → searchable dropdown |

---

## 6. New Core Substrate: Quality Gates & Verification

**Justification:** Superpowers' Test Gate and TDD Workflow Path represent a universal pattern
(quality checks that block forward progress). This pattern appears in virtually every serious
agentic framework — CrewAI has eval gates, LangGraph has conditional edges for validation,
Azure AI Foundry has prompt flow evaluation nodes.

**Definition:** The verification boundary where quality checks, test execution, and gate
evaluations block or allow pipeline progression.

**Constructs:**

- `test_gate` — pass/fail checkpoint before proceeding (from Superpowers)
- `eval_checkpoint` — LLM-judged quality check
- `approval_gate` — human sign-off point (overlaps L7 HITL)
- `tdd_workflow` — test-first progression harness (from Superpowers)

**This is NOT a testing framework substrate.** It's the pattern of "is this output good enough
to continue?" which is distinct from L5's "how well did the system perform overall?"

---

## 7. Implementation Plan (feeds R4)

### Phase 1: Data Model Migration

1. Create `CORE_SUBSTRATES` JS object from existing HTML structure
2. Add `substrate_mappings` to each `PRODUCT_DETAILS` entry
3. Add `product_origin` tags to migrated constructs
4. Compute `PRODUCT_RANKINGS` at page load

### Phase 2: HTML Restructure (L4 Only)

1. Remove GSD, BMAD, Superpowers substrate-items from L4
2. Add "Quality Gates & Verification" as new substrate
3. Migrate construct/primitive panels to their new parent substrates
4. Update substrate count badge ("8 substrates" → "6 substrates")

### Phase 3: UI Enhancements

1. Implement top-3 product badge bar on all substrates
2. Add `[+N]` expansion for overflow products
3. Add layer-level top-3 in stratum header
4. Add `product_origin` tag display on migrated constructs

### Phase 4: Leaderboard (Optional)

1. Global product ranking panel
2. Per-layer product ranking
3. Cross-ontology "coverage breadth" metric

---

## 8. mPRD Strategy (feeds R3)

Each major product family gets a mini-PRD that maps its capabilities to core substrates:

| mPRD | Product | Priority | Why |
|------|---------|----------|-----|
| mPRD-001 | Azure AI Foundry | P0 | Highest coverage (5/7 layers), enterprise anchor |
| mPRD-002 | LangChain / LangGraph | P0 | Most popular open-source L4 framework |
| mPRD-003 | CrewAI | P1 | Multi-agent orchestration leader |
| mPRD-004 | GSD | P1 | Already mapped, needs reclassification |
| mPRD-005 | BMAD | P1 | Already mapped, needs reclassification |
| mPRD-006 | Superpowers | P1 | Already mapped, needs reclassification |
| mPRD-007 | Claude Code | P1 | Cross-layer agent (L4+L7+L3+L2+L1) |
| mPRD-008 | Cursor IDE | P2 | L7 primary, growing L3 presence |
| mPRD-009 | Open Policy Agent | P2 | L6 governance anchor |
| mPRD-010 | Devin | P2 | Autonomous agent reference point |

Each mPRD follows `R3_mPRD_template.md` and produces machine-readable `substrate_mappings`
that feed directly into the `PRODUCT_DETAILS` enhancement.

---

## 9. Success Criteria

| Criteria | Test |
|----------|------|
| No named products as substrates | `grep "substrate-name" prototype.html` returns 0 branded names |
| Core substrates ≤8 per layer | Manual count |
| Top-3 visible per substrate | Visual check at each substrate |
| GSD/BMAD/SP constructs preserved | All 94 primitives still present in the DOM |
| validate.py passes | No new issues from refactor |
| Zero data loss | Product guides still render for migrated primitives |

---

## 10. Gate: R2:DESIGNED ✅

Ready for R3 (product mPRDs) and R4 (implementation).
