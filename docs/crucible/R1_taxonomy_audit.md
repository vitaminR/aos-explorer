# R1 — Taxonomy Audit

> **Status:** COMPLETE
> **Date:** 2026-04-12
> **Auditor:** aOS-Explorer Orchestrator
> **Source:** `90.aOS-Explorer/explorer.html` (31 substrate-items) + `6.aOS/01.Reference-Model/agentic-reference-stack-v1.md`

---

## 1. Current Substrate Inventory

### L7 — Experience & Intent (3 substrates)

| # | Substrate Name | Classification | Products Mapped | Has Constructs | Has Primitives |
|---|---------------|----------------|-----------------|----------------|----------------|
| 1 | Intent Parsers & UX | **CORE** | AF, PC, CI, aE | ✅ 4 | ✅ |
| 2 | Generative UI | **CORE** | V0, LV | ❌ | ❌ |
| 3 | Human-in-the-Loop Controls | **CORE** | GS | ❌ | ❌ |

**Verdict:** Clean. All 3 are universal patterns. No named products as substrates.

---

### L6 — Governance & Trust (4 substrates)

| # | Substrate Name | Classification | Products Mapped | Has Constructs | Has Primitives |
|---|---------------|----------------|-----------------|----------------|----------------|
| 1 | Policy Engines | **CORE** | OPA | ✅ | ✅ |
| 2 | Identity & Access | **CORE** | — | ✅ | ✅ |
| 3 | Audit & Compliance | **CORE** | — | ✅ | ✅ |
| 4 | Safety & Content Filters | **CORE** | AF | ✅ | ✅ |

**Verdict:** Clean. All 4 are universal patterns. Products appear as badges only.

---

### L5 — Observability & Evaluation (3 substrates)

| # | Substrate Name | Classification | Products Mapped | Has Constructs | Has Primitives |
|---|---------------|----------------|-----------------|----------------|----------------|
| 1 | Tracing & Logging | **CORE** | — | ✅ | ✅ |
| 2 | Eval Frameworks | **CORE** | — | ✅ | ✅ |
| 3 | Drift & Anomaly Detection | **CORE** | — | ✅ | ✅ |

**Verdict:** Clean. All generic patterns.

---

### L4 — Orchestration & Decisioning (8 substrates) ⚠️ PROBLEM LAYER

| # | Substrate Name | Classification | Products Mapped | Has Constructs | Has Primitives |
|---|---------------|----------------|-----------------|----------------|----------------|
| 1 | Workflow Engines | **CORE** | AF, HM | ✅ 3 | ✅ |
| 2 | Agent Frameworks | **CORE** | CW, LG | ✅ 4 | ✅ |
| 3 | Routing & Planning | **CORE** | — | ❌ | ❌ |
| 4 | Scheduling & Triggers | **CORE** | — | ❌ | ❌ |
| 5 | Retry & Recovery | **CORE** | — | ❌ | ❌ |
| 6 | GSD — Speed-First Orchestration | ⛔ **NAMED PRODUCT** | GD | ✅ 3 | ✅ (32 prims) |
| 7 | BMAD Method — Spec-First Orchestration | ⛔ **NAMED PRODUCT** | BM | ✅ 3 | ✅ (32 prims) |
| 8 | Superpowers — TDD-Constrained Harness | ⛔ **NAMED PRODUCT** | SP | ✅ 3 | ✅ (30 prims) |

**Verdict: 3 of 8 substrates are named products, not universal patterns.**

This is the only layer with the product-as-substrate anti-pattern.

#### Overlap Analysis (Named Products → Core Substrates)

| Named Product | Its Constructs | Should Map To (Core Substrate) |
|--------------|----------------|-------------------------------|
| GSD → Context Pack | `active_task_id`, `repo_slice`, `context_budget_pct` | **Workflow Engines** (state management constructs) |
| GSD → State File Set | `checkpoint_id`, `resume_token`, `handoff_note` | **Retry & Recovery** + **Workflow Engines** |
| GSD → Lifecycle Checkpoint | `trigger_threshold_pct`, `rollback_point`, `retry_policy` | **Retry & Recovery** |
| BMAD → Product Requirement Doc | `requirement_id`, `acceptance_criteria_line`, `priority_rank` | New core substrate: **Specification & Requirements** or overlay on **Workflow Engines** |
| BMAD → Persona Handoff Packet | `persona_name`, `handoff_from`, `handoff_to` | **Agent Frameworks** (delegation_policy construct) |
| BMAD → Requirement Matrix | `feature_id`, `implementation_status`, `approval_status` | **Workflow Engines** (plan/graph constructs) |
| Superpowers → Test Gate | `pass_fail_bool`, `block_forward_flag`, `gate_status` | New core substrate: **Quality Gates & Verification** or axis concern |
| Superpowers → tmux Session | `session_id`, `command_string`, `exit_code` | **L3 — Code Execution** (not even L4) |
| Superpowers → TDD Workflow Path | `spec_seed`, `failing_test_count`, `final_gate_status` | **Quality Gates & Verification** or **Workflow Engines** |

---

### L3 — Execution & Interfaces (6 substrates)

| # | Substrate Name | Classification | Products Mapped | Has Constructs | Has Primitives |
|---|---------------|----------------|-----------------|----------------|----------------|
| 1 | Tool Registries & MCP | **CORE** | EX | ✅ | ✅ |
| 2 | Code Execution | **CORE** | — | ✅ | ✅ |
| 3 | External APIs | **CORE** | — | ✅ | ✅ |
| 4 | Browser & UI Automation | **CORE** | — | ✅ | ✅ |
| 5 | File & OS Interfaces | **CORE** | — | ✅ | ✅ |
| 6 | Message Queues & Events | **CORE** | — | ✅ | ✅ |

**Verdict:** Clean. All generic patterns.

---

### L2 — Knowledge & Memory (4 substrates)

| # | Substrate Name | Classification | Products Mapped | Has Constructs | Has Primitives |
|---|---------------|----------------|-----------------|----------------|----------------|
| 1 | RAG Pipelines & Search | **CORE** | — | ✅ | ✅ |
| 2 | Memory Systems | **CORE** | — | ✅ | ✅ |
| 3 | Knowledge Graphs | **CORE** | — | ✅ | ✅ |
| 4 | Embedding Stores | **CORE** | — | ✅ | ✅ |

**Verdict:** Clean. All generic patterns.

---

### L1 — Models & Infrastructure (3 substrates)

| # | Substrate Name | Classification | Products Mapped | Has Constructs | Has Primitives |
|---|---------------|----------------|-----------------|----------------|----------------|
| 1 | Foundation Models | **CORE** | AF | ✅ | ✅ |
| 2 | Compute & Serving | **CORE** | — | ✅ | ✅ |
| 3 | Training & Fine-tuning | **CORE** | — | ✅ | ✅ |

**Verdict:** Clean. All generic patterns.

---

## 2. Summary Statistics

| Metric | Count |
|--------|-------|
| Total substrates in prototype | 31 |
| Core (universal patterns) | **28** |
| Named products masquerading as substrates | **3** (all in L4) |
| Total products in `PRODUCT_DETAILS` | **43+** |
| Product types: product/framework/tool/agent/mcp/workflow/skill | 7 entity types |
| Substrates with constructs + primitives | 19 of 31 (61%) |
| Substrates with no drilldown (label-only) | 12 of 31 (39%) |

---

## 3. Scaling Projections

### Current State (43 products)

- L4 already has **8 substrates** (3 are named products)
- If every L4-primary product got its own substrate: CrewAI, LangGraph, GSD, BMAD, Superpowers, gstack, Shipyard, Agent Skills, Agent CI/CD = **9 named product substrates** + 5 core = 14 total

### At 100 Products

- ~25+ would touch L4 (orchestration is the densest layer)
- Following current pattern: **25+ substrate entries** in one accordion
- Scroll required, zero signal/noise separation

### At 400 Products

- ~80-100 would touch L4
- Every layer would need scrollbars
- Product discovery becomes impossible without search
- No way to answer "what's the best orchestration framework?" at a glance

---

## 4. Scale-Ready Architecture Requirements

### 4.1 Core Substrates Must Be Universal Patterns

- Max **≤8 substrates per layer** (currently respected except L4's named products)
- Each substrate = a category of capability, not a product brand
- Products **map onto** substrates as overlays, not **become** substrates

### 4.2 Product-to-Substrate Mapping (Overlay Model)

- Each product declares which substrates it touches (already in `PRODUCT_DETAILS.primary/secondary`)
- Products appear as ranked badges within the substrate they touch
- Clicking a product badge shows its guide for that specific substrate's constructs/primitives

### 4.3 Top-3 Ranking System

- Each substrate shows its **top 3 products** by `confidence` score (already available in PRODUCT_DETAILS)
- "Show all N products" expands the full list
- Layer-level summary: top 3 products across all substrates in that layer
- Cross-ontology: global leaderboard of products by total coverage (how many strata they touch meaningfully)

### 4.4 Named Product Constructs → Core Construct Children

- GSD's 3 constructs (Context Pack, State File Set, Lifecycle Checkpoint) → merge into Workflow Engines + Retry & Recovery
- BMAD's 3 constructs (PRD, Persona Handoff, Requirement Matrix) → merge into Workflow Engines + Agent Frameworks
- Superpowers' 3 constructs (Test Gate, tmux Session, TDD Path) → merge into new "Quality Gates" substrate + L3 Code Execution
- Each primitive retains its `product_origin` tag so the product guide system still works

### 4.5 UI Patterns for Scale

| Pattern | Purpose | Threshold |
|---------|---------|-----------|
| **Ranked badges** | Show top-3 products per substrate | Always |
| **Collapsible groups** | Group substrates by sub-category if >6 | >6 per layer |
| **Product count chip** | "24 products" badge on each layer header | Always |
| **Searchable product list** | Full-text search across products | >50 products |
| **"Show all" expansion** | Expand beyond top-3 | On click |
| **Layer leaderboard** | Top 3 overall products for this layer | On layer header |

---

## 5. Recommended Core Substrate Set (Post-Refactor)

### L7 — Experience & Intent (3 → 3, no change)

1. Intent Parsers & UX
2. Generative UI
3. Human-in-the-Loop Controls

### L6 — Governance & Trust (4 → 4, no change)

1. Policy Engines
2. Identity & Access
3. Audit & Compliance
4. Safety & Content Filters

### L5 — Observability & Evaluation (3 → 3, no change)

1. Tracing & Logging
2. Eval Frameworks
3. Drift & Anomaly Detection

### L4 — Orchestration & Decisioning (8 → 6, refactored)

1. Workflow Engines *(absorbs GSD Context Pack, GSD State File Set, BMAD Requirement Matrix)*
2. Agent Frameworks *(absorbs BMAD Persona Handoff)*
3. Routing & Planning
4. Scheduling & Triggers
5. Retry & Recovery *(absorbs GSD Lifecycle Checkpoint)*
6. Quality Gates & Verification *(NEW — absorbs Superpowers Test Gate, TDD Workflow Path)*

**Removed as substrates:** GSD, BMAD, Superpowers → become product overlays

### L3 — Execution & Interfaces (6 → 6, no change)

1. Tool Registries & MCP
2. Code Execution *(absorbs Superpowers tmux Session)*
3. External APIs
4. Browser & UI Automation
5. File & OS Interfaces
6. Message Queues & Events

### L2 — Knowledge & Memory (4 → 4, no change)

1. RAG Pipelines & Search
2. Memory Systems
3. Knowledge Graphs
4. Embedding Stores

### L1 — Models & Infrastructure (3 → 3, no change)

1. Foundation Models
2. Compute & Serving
3. Training & Fine-tuning

**Post-refactor total: 29 core substrates (down from 31). Stable ceiling.**

---

## 6. Gate: R1:AUDITED ✅

**Finding:** Only L4 has the named-product-as-substrate anti-pattern (3 instances).
All other layers are clean. The fix is surgical: reclassify GSD/BMAD/Superpowers as product
overlays, absorb their constructs into core substrates, and add one new core substrate
("Quality Gates & Verification").

**Next:** R2 — PRD for the taxonomy refactor (UI patterns, data model changes, migration plan).
