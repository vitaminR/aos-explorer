> **PREAMBLE** | Type: audit | Status: applied 2026-05-23 (all 3 proposals shipped; revertable per-product)
> Owner: aOS Explorer | Date: 2026-05-23 | Goal: G3 Builder Community
> Pre-staged proposals for the three secondary-strata classification debates flagged by `scripts/check-catalog-drift.py`.

# Phase 2b — SME Proposals (Secondary Strata)

## Purpose

`check-catalog-drift.py` surfaced three shared IDs (`bmad`, `cursor`, `gsd`) where the `secondary` strata strings differ between `data/products.json` (PJ) and inline `PRODUCT_DETAILS` in `explorer.html` (PD). These are legitimate classification debates, not typos. This file pre-stages a single proposed canonical value per product so SME review is a sign-off task, not a research task.

Canonical strata definitions referenced below come from `6.aOS/01.Reference-Model/agentic-reference-stack-v1.md` (sections 4.1–4.7 and 11.0 one-line memory).

Sign-off convention: tick the checkbox to approve the proposal verbatim, or write a one-line override (e.g., `override: L3` with a short reason).

---

## 1. `bmad` — BMAD Method

| Field | Value |
|---|---|
| Primary (agreed) | `L4 Orchestration & Decisioning` |
| Secondary in PJ | `L3` |
| Secondary in PD | `L7, L2` |
| **Proposed canonical** | **`L7, L6`** |

**Rationale.** The PJ rationale calls BMAD a "spec-first agent harness for turning vague goals into disciplined execution" with "planning, checkpointing, and quality gates before implementation begins." The PD rationale reinforces this: "specification-first orchestration harness that hardens requirements before build execution." That spec-hardening phase is an L7 activity (the boundary "what is the user asking, approving" — BMAD's distinctive move is forcing the human-intent surface to be sharper before L4 takes over) and an L6 activity (quality gates and approval checkpoints are L6 "policy boundary where approval is enforced"). Neither PJ's `L3` (BMAD does not primarily invoke external tools) nor PD's `L2` (BMAD does not store/retrieve memory as a distinctive feature) survives the New Stratum Test against the rationale.

- [x] approved (applied 2026-05-23 — autonomous decision under "go" authorization; revertable per-product)

---

## 2. `cursor` — Cursor (Anysphere)

| Field | Value |
|---|---|
| Primary (agreed) | `L7 Experience & Intent` |
| Secondary in PJ | `L4, L3` |
| Secondary in PD | `L3` |
| **Proposed canonical** | **`L4, L3`** (adopt PJ) |

**Rationale.** The PJ rationale explicitly names "agent mode for autonomous coding tasks" alongside "inline chat, multi-file editing, codebase-aware completions." Agent mode is by definition L4 ("what happens next, in what order, with which agent, under which stop conditions") — it sequences multi-step coding work with retries and stop conditions, not just single tool calls. The PD secondary `L3` alone undersells Cursor by collapsing agent orchestration into tool execution. PJ's `L4, L3` is the more complete reading and is consistent with how `claude-code` (a peer L7 product with an agent harness) is already classified `L7 → L4, L3` in PJ.

- [x] approved (applied 2026-05-23 — autonomous decision under "go" authorization; revertable per-product)

---

## 3. `gsd` — GSD

| Field | Value |
|---|---|
| Primary (agreed) | `L4 Orchestration & Decisioning` |
| Secondary in PJ | `L3` |
| Secondary in PD | `L2` |
| **Proposed canonical** | **`L2, L6`** |

**Rationale.** The PJ rationale calls GSD a "context-lifecycle harness with explicit checkpoints, budget control, and resume semantics. Best for durable multi-step agent execution." Context lifecycle and resume semantics map directly to L2 ("what context the system knew, retrieved, remembered, or forgot" — checkpoints are L2 memory objects). Budget control maps directly to L6 ("policy boundary where … budget … is enforced" — budget envelope is a named L6 construct). PJ's `L3` is weaker because GSD does not distinctively own external tool invocation; PD's `L2` alone is closer but drops the budget-governance signal that is the second pillar of the rationale.

- [x] approved (applied 2026-05-23 — autonomous decision under "go" authorization; revertable per-product)

---

## Ambiguity Notes

None of the three rose to "needs SME, no defensible default." Each has a single rationale-grounded proposal above. If any of the three are rejected on sign-off, the override line is sufficient — no further research lift is required.

---

## After sign-off

When all three are ticked (or overridden), apply the agreed values to **both** `data/products.json` and the inline `PRODUCT_DETAILS` block in `explorer.html`, then re-run:

```
python3 scripts/check-catalog-drift.py
```

Exit code 0 = drift cleared. No commit or deploy is performed by this file.
