# Classification Guide

## How Products Are Classified in {a}OS Explorer

Every product, framework, agent, workflow, or skill in the {a}OS Explorer is classified against the canonical 7-stratum reference model. This document explains how classifications work and how to interpret them.

---

## The Classification Model

Each entity receives:

| Field | Description |
|-------|-------------|
| **Primary Stratum** | The single layer where the product delivers its core value |
| **Secondary Strata** | Additional layers the product touches with meaningful capability |
| **Axis Roles** | Whether the product contributes to Governance & Trust or Observability & Evaluation |
| **Capabilities** | Named features mapped to specific strata |
| **Constructs Produced** | Artifacts or state objects the product creates or manages |
| **Primitives Touched** | Atomic units within constructs the product reads or writes |
| **Confidence Score** | 0.0–1.0 indicating classification certainty |
| **Rationale** | Human-readable explanation of the classification |
| **Evidence** | Optional links, quotes, or documentation supporting the placement |

---

## Confidence Levels

| Level | Score Range | Visual | Meaning |
|-------|-------------|--------|---------|
| **High** | ≥ 0.85 | Green badge | Strong evidence, clear primary layer, multiple corroborating sources |
| **Medium** | 0.60 – 0.84 | Yellow badge | Reasonable placement, may have secondary interpretations |
| **Low** | < 0.60 | Red dashed badge | Disputed or emerging product, placement may change |

---

## Example: Azure AI Foundry

```
Primary:     L1 Models & Infrastructure
Secondary:   L2 (Knowledge), L3 (Execution), L4 (Orchestration)
Confidence:  0.92 (High)
Rationale:   Built on Microsoft.CognitiveServices. Model hosting and
             inference is the core value prop; prompt flow, search,
             and agent capabilities are secondary strata.
```

**Why L1 is primary**: Azure AI Foundry's foundational product is model hosting, deployment, and inference endpoints. Everything else (RAG search, prompt flow orchestration) builds on top of that.

**Why L2–L4 are secondary**: Features like Azure AI Search (L2), prompt flow (L4), and tool-calling (L3) are meaningful but are not the product's primary value.

---

## Example: CrewAI

```
Primary:     L4 Orchestration & Decisioning
Secondary:   L3 (Execution)
Confidence:  0.90 (High)
Rationale:   Multi-agent crew framework focused on orchestrating agent
             collaboration and task delegation.
```

**Why L4 is primary**: CrewAI's entire architecture is about multi-agent coordination — defining crews, assigning tasks, managing delegation.

**Why L3 is secondary**: Agents execute tools and APIs, so there's clear L3 presence, but it's subordinate to the orchestration core.

---

## Example: Routa (first-party — workspace delivery orchestrator)

```
Primary:     L5 Orchestration & Decisioning
Secondary:   L6 (Governance), L4 (Memory), L3 (Execution), L2 (Platform),
             L1 (Data), L7 (Mission)
Confidence:  0.75 (Medium)
Rationale:   File-based agentic delivery orchestrator living inside 0.agentic.
             Core value is the 6-lane task state machine (backlog → todo →
             dev → review → done | blocked) and the 7-item deterministic
             review gate. Spans all seven strata. Shipped 2026-05-21.
```

**Confidence breakdown** (from `explorer.html` CONFIDENCE_META):
- Evidence Quality: 0.7 (internal docs only, no external benchmarks)
- Strata Alignment: 0.85 (L5/L6 well-evidenced; broader secondaries plausible)
- Differentiation: 0.8 (file-based control plane is meaningful vs heavier orchestrators)
- Maturity: 0.6 (first slice shipped 2026-05-21; provider adapters beyond OpenCode unvalidated)

**Why L5 is primary**: Routa's entire architecture is task orchestration — allocating sessions, routing work to specialist adapters, enforcing lane transitions, and dispatching the review gate.

**Why L6 is strong secondary**: The review gate (`gate.py`), policy YAMLs (`evidence-required`, `deletion-safety`, `file-budget`, `test-required`), and the PRD/SPEC/Ticket hierarchy are all Governance artifacts living at L6.

**Why L4 is secondary**: Traces, Paperclip sessions, EMA events, and the `artifacts/` store are memory and capture artifacts at L4.

**Why L3 is secondary**: Adapters (`opencode`, `claude-code`, `codex`, `continue-dev`) are the execution interface to provider runtimes.

**Why L1–L2 are secondary**: The `.agentic-orchestrator/` YAML files and `git` worktrees are L1 data; the `codepro_tools.agentic` CLI package is L2 platform.

**Why L7 is touched**: Routa tasks ladder up to Goals (G1–G4) via the meta delivery stack — every PRD that spawns Routa tickets is anchored to a Goal.

**The meta delivery stack** (how Routa maps across all 7 strata):

| Stratum | Role |
|---------|------|
| L7 Mission | Goal (G1/G2/G3/G4) drives the PRD |
| L6 Governance | PRD → SPEC → Policies → Gate → Traces |
| L5 Orchestration | Routa board → task → lane → specialist |
| L4 Memory | Paperclip + EMA capture layer (below the stack) |
| L3 Execution | Adapters: opencode (active), claude-code / codex / continue-dev (stub) |
| L2 Platform | `agentic` CLI + `codepro_tools.agentic` Python package |
| L1 Data | `.agentic-orchestrator/` YAML files + JSONL traces + git |

---

## Multi-Residency Rules

1. **Every product gets exactly one primary stratum** — this is where its core value proposition lives
2. **Products can have zero or more secondary strata** — these are meaningful but non-primary capabilities
3. **The UI never forces exclusivity** — a product spanning 5 layers is shown spanning 5 layers
4. **Primary placement is always visually stronger** than secondary (e.g., full opacity vs dimmed)

---

## Disputed Classifications

When classification is uncertain:

- The confidence score will be **Medium or Low**
- The rationale will note the **alternative interpretation**
- Future versions will support explicit **dispute annotations** from reviewers

Example: A product classified as L4 (Orchestration) primary might have a note like:
> "Could be argued as L3 (Execution) primary if tool-calling is considered the core loop rather than multi-step planning."

---

## How to Read the Compare View

When comparing 2–4 products:

- **Layer coverage heatmap** — which strata each product touches, color-coded by confidence
- **Axis roles** — which cross-cutting concerns each product addresses
- **Overlap table** — shared constructs and primitives across selected products
- **Gap summary** — strata and capabilities none of the selected products cover
