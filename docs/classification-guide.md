# Classification Guide

## How Products Are Classified in {a}OS Explorer

Every product, framework, agent, workflow, or skill in the {a}OS Explorer is classified against the canonical 7-stratum reference model. This document explains how classifications work and how to interpret them.

---

## The Classification Model

Each entity receives:

| Field | Description |
|-------|-------------|
| **Primary Stratum** | The single stratum where the product delivers its core value |
| **Secondary Strata** | Additional strata the product touches with meaningful capability |
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
| **High** | ≥ 0.85 | Green badge | Strong evidence, clear primary stratum, multiple corroborating sources |
| **Medium** | 0.60 – 0.84 | Yellow badge | Reasonable placement, may have secondary interpretations |
| **Low** | < 0.60 | Red dashed badge | Disputed or emerging product, placement may change |

---

## Example: Azure AI Foundry

```
Primary:     S1 Models & Infrastructure
Secondary:   S2 (Knowledge), S3 (Execution), S4 (Orchestration)
Confidence:  0.92 (High)
Rationale:   Built on Microsoft.CognitiveServices. Model hosting and
             inference is the core value prop; prompt flow, search,
             and agent capabilities are secondary strata.
```

**Why S1 is primary**: Azure AI Foundry's foundational product is model hosting, deployment, and inference endpoints. Everything else (RAG search, prompt flow orchestration) builds on top of that.

**Why S2–S4 are secondary**: Features like Azure AI Search (S2), prompt flow (S4), and tool-calling (S3) are meaningful but are not the product's primary value.

---

## Example: CrewAI

```
Primary:     S4 Orchestration & Decisioning
Secondary:   S3 (Execution)
Confidence:  0.90 (High)
Rationale:   Multi-agent crew framework focused on orchestrating agent
             collaboration and task delegation.
```

**Why S4 is primary**: CrewAI's entire architecture is about multi-agent coordination — defining crews, assigning tasks, managing delegation.

**Why S3 is secondary**: Agents execute tools and APIs, so there's clear S3 presence, but it's subordinate to the orchestration core.

---

## Example: Routa (first-party — workspace delivery orchestrator)

```
Primary:     S5 Orchestration & Decisioning
Secondary:   S6 (Governance), S4 (Memory), S3 (Execution), S2 (Platform),
             S1 (Data), S7 (Mission)
Confidence:  0.75 (Medium)
Rationale:   File-based agentic delivery orchestrator living inside 0.agentic.
             Core value is the 6-lane task state machine (backlog → todo →
             dev → review → done | blocked) and the 7-item deterministic
             review gate. Spans all seven strata. Shipped 2026-05-21.
```

**Confidence breakdown** (from `explorer.html` CONFIDENCE_META):
- Evidence Quality: 0.7 (internal docs only, no external benchmarks)
- Strata Alignment: 0.85 (S5/S6 well-evidenced; broader secondaries plausible)
- Differentiation: 0.8 (file-based control plane is meaningful vs heavier orchestrators)
- Maturity: 0.6 (first slice shipped 2026-05-21; provider adapters beyond OpenCode unvalidated)

**Why S5 is primary**: Routa's entire architecture is task orchestration — allocating sessions, routing work to specialist adapters, enforcing lane transitions, and dispatching the review gate.

**Why S6 is strong secondary**: The review gate (`gate.py`), policy YAMLs (`evidence-required`, `deletion-safety`, `file-budget`, `test-required`), and the PRD/SPEC/Ticket hierarchy are all Governance artifacts living at S6.

**Why S4 is secondary**: Traces, Paperclip sessions, EMA events, and the `artifacts/` store are memory and capture artifacts at S4.

**Why S3 is secondary**: Adapters (`opencode`, `claude-code`, `codex`, `continue-dev`) are the execution interface to provider runtimes.

**Why S1–S2 are secondary**: The `.agentic-orchestrator/` YAML files and `git` worktrees are S1 data; the `codepro_tools.agentic` CLI package is S2 platform.

**Why S7 is touched**: Routa tasks ladder up to Goals (G1–G4) via the meta delivery stack — every PRD that spawns Routa tickets is anchored to a Goal.

**The meta delivery stack** (how Routa maps across all 7 strata):

| Stratum | Role |
|---------|------|
| S7 Mission | Goal (G1/G2/G3/G4) drives the PRD |
| S6 Governance | PRD → SPEC → Policies → Gate → Traces |
| S5 Orchestration | Routa board → task → lane → specialist |
| S4 Memory | Paperclip + EMA capture stratum (below the stack) |
| S3 Execution | Adapters: opencode (active), claude-code / codex / continue-dev (stub) |
| S2 Platform | `agentic` CLI + `codepro_tools.agentic` Python package |
| S1 Data | `.agentic-orchestrator/` YAML files + JSONL traces + git |

---

## Multi-Residency Rules

1. **Every product gets exactly one primary stratum** — this is where its core value proposition lives
2. **Products can have zero or more secondary strata** — these are meaningful but non-primary capabilities
3. **The UI never forces exclusivity** — a product spanning 5 strata is shown spanning 5 strata
4. **Primary placement is always visually stronger** than secondary (e.g., full opacity vs dimmed)

---

## Disputed Classifications

When classification is uncertain:

- The confidence score will be **Medium or Low**
- The rationale will note the **alternative interpretation**
- Future versions will support explicit **dispute annotations** from reviewers

Example: A product classified as S4 (Orchestration) primary might have a note like:
> "Could be argued as S3 (Execution) primary if tool-calling is considered the core loop rather than multi-step planning."

---

## How to Read the Compare View

When comparing 2–4 products:

- **Stratum coverage heatmap** — which strata each product touches, color-coded by confidence
- **Axis roles** — which cross-cutting concerns each product addresses
- **Overlap table** — shared constructs and primitives across selected products
- **Gap summary** — strata and capabilities none of the selected products cover
