> **PREAMBLE** | Type: audit | Status: applied 2026-05-23 (all 3 proposals shipped; revertable per-product)
> Owner: aOS Explorer | Date: 2026-05-23 | Goal: G3 Builder Community
> Pre-staged proposals for the three secondary-strata classification debates flagged by `scripts/check-catalog-drift.py`.

# Phase 2b — SME Proposals (Secondary Strata)

## Purpose

`check-catalog-drift.py` surfaced three shared IDs (`bmad`, `cursor`, `gsd`) where the `secondary` strata strings differ between `data/products.json` (PJ) and inline `PRODUCT_DETAILS` in `explorer.html` (PD). These are legitimate classification debates, not typos. This file pre-stages a single proposed canonical value per product so SME review is a sign-off task, not a research task.

Canonical strata definitions referenced below come from `6.aOS/01.Reference-Model/agentic-reference-stack-v1.md` (sections 4.1–4.7 and 11.0 one-line memory).

Sign-off convention: tick the checkbox to approve the proposal verbatim, or write a one-line override (e.g., `override: S3` with a short reason).

---

## 1. `bmad` — BMAD Method

| Field | Value |
|---|---|
| Primary (agreed) | `S4 Orchestration & Decisioning` |
| Secondary in PJ | `S3` |
| Secondary in PD | `S7, S2` |
| **Proposed canonical** | **`S7, S6`** |

**Rationale.** The PJ rationale calls BMAD a "spec-first agent harness for turning vague goals into disciplined execution" with "planning, checkpointing, and quality gates before implementation begins." The PD rationale reinforces this: "specification-first orchestration harness that hardens requirements before build execution." That spec-hardening phase is an S7 activity (the boundary "what is the user asking, approving" — BMAD's distinctive move is forcing the human-intent surface to be sharper before S4 takes over) and an S6 activity (quality gates and approval checkpoints are S6 "policy boundary where approval is enforced"). Neither PJ's `S3` (BMAD does not primarily invoke external tools) nor PD's `S2` (BMAD does not store/retrieve memory as a distinctive feature) survives the New Stratum Test against the rationale.

- [x] approved (applied 2026-05-23 — autonomous decision under "go" authorization; revertable per-product)

---

## 2. `cursor` — Cursor (Anysphere)

| Field | Value |
|---|---|
| Primary (agreed) | `S7 Experience & Intent` |
| Secondary in PJ | `S4, S3` |
| Secondary in PD | `S3` |
| **Proposed canonical** | **`S4, S3`** (adopt PJ) |

**Rationale.** The PJ rationale explicitly names "agent mode for autonomous coding tasks" alongside "inline chat, multi-file editing, codebase-aware completions." Agent mode is by definition S4 ("what happens next, in what order, with which agent, under which stop conditions") — it sequences multi-step coding work with retries and stop conditions, not just single tool calls. The PD secondary `S3` alone undersells Cursor by collapsing agent orchestration into tool execution. PJ's `S4, S3` is the more complete reading and is consistent with how `claude-code` (a peer S7 product with an agent harness) is already classified `S7 → S4, S3` in PJ.

- [x] approved (applied 2026-05-23 — autonomous decision under "go" authorization; revertable per-product)

---

## 3. `gsd` — GSD

| Field | Value |
|---|---|
| Primary (agreed) | `S4 Orchestration & Decisioning` |
| Secondary in PJ | `S3` |
| Secondary in PD | `S2` |
| **Proposed canonical** | **`S2, S6`** |

**Rationale.** The PJ rationale calls GSD a "context-lifecycle harness with explicit checkpoints, budget control, and resume semantics. Best for durable multi-step agent execution." Context lifecycle and resume semantics map directly to S2 ("what context the system knew, retrieved, remembered, or forgot" — checkpoints are S2 memory objects). Budget control maps directly to S6 ("policy boundary where … budget … is enforced" — budget envelope is a named S6 construct). PJ's `S3` is weaker because GSD does not distinctively own external tool invocation; PD's `S2` alone is closer but drops the budget-governance signal that is the second pillar of the rationale.

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
