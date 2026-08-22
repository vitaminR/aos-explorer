> **PREAMBLE** | Type: audit | Status: active
> Owner: aOS Explorer | Date: 2026-05-23 | Goal: G3 Builder Community
> Phase 2b read-only reconciliation of the two parallel product catalogs.

# Phase 2b — Catalog Reconciliation Audit

## TL;DR

The aOS Explorer maintains **two parallel product catalogs** that drift independently:

| Catalog | Location | Count | Role |
|---|---|---|---|
| **PRODUCT_DETAILS** | `explorer.html` (inline JS, ~line 13928) | 51 | **LIVE** — what the UI actually reads |
| **products.json** | `data/products.json` | 37 | Static data file — NOT read by the live UI |

- **Shared IDs**: 9
- **PRODUCT_DETAILS-only**: 42 (live in UI, no products.json backing)
- **products.json-only**: 28 (orphaned data the UI never shows)
- **Field mismatches on shared IDs**: 7 total
  - 1 `type` (cursor) — fixed this commit
  - 3 `primary` strata (aosnaming, fallow, routa) — fixed this commit
  - 3 `secondary` strata (bmad, cursor, gsd) — surfaced by the new guardrail; **deferred to human review** (legitimate classification debates, not auto-fixable)

The `a6d62de` "fix(taxonomy)" commit on 2026-05-23 only patched products.json. The live UI is still showing the **old non-canonical stratum names** for `aosnaming`, `fallow`, and `routa`. Phase 2b propagates those three fixes to PRODUCT_DETAILS and harmonizes the `cursor` type.

---

## 1. Shared IDs (9)

| ID | PD type | PJ type | PD primary | PJ primary | Status | Action |
|---|---|---|---|---|---|---|
| `aosnaming` | skill | skill | `S6 Trust & Governance` | `S6 Governance & Trust` | PRIMARY mismatch | **MERGE-TO-PRODUCTS_JSON** (canonical) — patch PD primary to `S6 Governance & Trust` |
| `bmad` | framework | framework | (match) | (match) | OK | KEEP-BOTH |
| `clawmem` | tool | tool | (match) | (match) | OK | KEEP-BOTH |
| `crewai` | framework | framework | (match) | (match) | OK | KEEP-BOTH |
| `cursor` | product | platform | `S7 Experience & Intent` | `S7 Experience & Intent` | TYPE mismatch | **MERGE-TO-PRODUCT_DETAILS** — patch PJ `cursor.type` to `product` (PD is live; PD vocab does not use `platform`) |
| `fallow` | tool | tool | `S5 Evaluation & Quality` | `S5 Observability & Evaluation` | PRIMARY mismatch | **MERGE-TO-PRODUCTS_JSON** (canonical) — patch PD primary to `S5 Observability & Evaluation` |
| `gsd` | framework | framework | (match) | (match) | OK | KEEP-BOTH |
| `langgraph` | framework | framework | (match) | (match) | OK | KEEP-BOTH |
| `routa` | agent | agent | `S5 Orchestration` (sec: `S6, S4, S3, S2, S1, S7`) | `S4 Orchestration & Decisioning` (sec: `S7, S6, S5, S3, S2, S1`) | PRIMARY + SECONDARY mismatch | **MERGE-TO-PRODUCTS_JSON** (canonical) — patch PD primary to `S4 Orchestration & Decisioning` and secondary to `S7, S6, S5, S3, S2, S1` |

> Note on `routa`: explorer.html also references `S5 orchestration` inside the `CONFIDENCE_META` rationale `desc` field (line ~16352). That is human-readable prose, not a structured stratum field, so it is **out of scope** for Phase 2b — flag for a follow-up copy fix.

> Note on `cursor`: the type-vocabulary divergence is broader than this one row. PD uses `product / framework / tool / agent / skill / mcp / workflow / model`. PJ adds `platform / infrastructure / model-api`. A workspace-wide vocabulary harmonization is **deferred to a separate PRD** (see "Deferred items" below).

---

## 2. PRODUCT_DETAILS-only IDs (42 — live in UI, no products.json backing)

These IDs render in the live UI from inline JS only. They are orphans from the perspective of the static data file. None should be deleted; this is a data-hygiene backlog item.

| ID | type | name | Recommendation |
|---|---|---|---|
| `af` | product | Azure AI Foundry | MERGE-TO-PRODUCTS_JSON (deferred — backlog) |
| `agentskills` | framework | Agent Skills | MERGE-TO-PRODUCTS_JSON (deferred) |
| `aider` | agent | Aider | MERGE-TO-PRODUCTS_JSON (deferred) |
| `aosexplorer` | tool | {a}OS Explorer | MERGE-TO-PRODUCTS_JSON (deferred — first-party) |
| `azuresearch` | tool | Azure AI Search | MERGE-TO-PRODUCTS_JSON (deferred) |
| `blader` | tool | Blader Humanizer | MERGE-TO-PRODUCTS_JSON (deferred) |
| `claudecode` | agent | Claude Code | **CONFLICT** with PJ `claude-code` (platform). See deferred items. |
| `cline` | agent | Cline | MERGE-TO-PRODUCTS_JSON (deferred) |
| `codeburn` | tool | CodeBurn | MERGE-TO-PRODUCTS_JSON (deferred) |
| `devin` | agent | Devin | MERGE-TO-PRODUCTS_JSON (deferred) |
| `examcp` | tool | Exa MCP | MERGE-TO-PRODUCTS_JSON (deferred) |
| `gitingest` | tool | Git Ingest | MERGE-TO-PRODUCTS_JSON (deferred) |
| `gstack` | framework | gstack | MERGE-TO-PRODUCTS_JSON (deferred) |
| `hermesagent` | agent | Hermes Agent | **CONFLICT** with PJ `hermes-agent`. See deferred items. |
| `hermesmodel` | model | Hermes (Model Series) | **CONFLICT** with PJ `hermes-model`. See deferred items. |
| `kotana` | product | Kotana | MERGE-TO-PRODUCTS_JSON (deferred — first-party) |
| `kotanaagent` | product | Kotana Agent | MERGE-TO-PRODUCTS_JSON (deferred — first-party) |
| `lovable` | tool | Lovable | MERGE-TO-PRODUCTS_JSON (deferred) |
| `mcpbrave` | mcp | Brave Search MCP | MERGE-TO-PRODUCTS_JSON (deferred) |
| `mcpfs` | mcp | Filesystem MCP | MERGE-TO-PRODUCTS_JSON (deferred) |
| `mcpgithub` | mcp | GitHub MCP | MERGE-TO-PRODUCTS_JSON (deferred) |
| `mcpmemory` | mcp | Memory MCP | MERGE-TO-PRODUCTS_JSON (deferred) |
| `mcppg` | mcp | PostgreSQL MCP | MERGE-TO-PRODUCTS_JSON (deferred) |
| `mcpplaywright` | mcp | Playwright MCP | MERGE-TO-PRODUCTS_JSON (deferred) |
| `mem0` | tool | Mem0 | MERGE-TO-PRODUCTS_JSON (deferred) |
| `opa` | framework | Open Policy Agent | MERGE-TO-PRODUCTS_JSON (deferred) |
| `openhands` | agent | OpenHands | MERGE-TO-PRODUCTS_JSON (deferred) |
| `paperclip` | product | Paperclip | MERGE-TO-PRODUCTS_JSON (deferred — first-party) |
| `shipyard` | framework | Shipyard | MERGE-TO-PRODUCTS_JSON (deferred) |
| `skapi` / `skdb` / `skperf` / `skreview` / `sksecurity` / `sktesting` | skill | various | MERGE-TO-PRODUCTS_JSON (deferred — patterns) |
| `superpowers` | framework | Superpowers | MERGE-TO-PRODUCTS_JSON (deferred) |
| `sweagent` | agent | SWE-agent | MERGE-TO-PRODUCTS_JSON (deferred) |
| `v0` | tool | v0 | MERGE-TO-PRODUCTS_JSON (deferred) |
| `wfcicd` / `wfeval` / `wfhuman` / `wfrag` | workflow | various | MERGE-TO-PRODUCTS_JSON (deferred — patterns; also: PJ schema has no `workflow` type) |

---

## 3. products.json-only IDs (28 — orphaned, never rendered by UI)

These rows live in the static data file but are invisible to users today. Every taxonomy edit here has zero user-visible effect until the catalogs are unified.

| ID | type | name | Recommendation |
|---|---|---|---|
| `autogen` | framework | AutoGen | MERGE-TO-PRODUCT_DETAILS (deferred — backlog) |
| `aws-bedrock` | platform | Amazon Bedrock | MERGE-TO-PRODUCT_DETAILS (deferred) |
| `azure-openai` | platform | Azure OpenAI Service | MERGE-TO-PRODUCT_DETAILS (deferred) |
| `chatgpt` | platform | ChatGPT | MERGE-TO-PRODUCT_DETAILS (deferred) |
| `chromadb` | infrastructure | ChromaDB | MERGE-TO-PRODUCT_DETAILS (deferred) |
| `claude-api` | model-api | Claude API | MERGE-TO-PRODUCT_DETAILS (deferred) |
| `claude-code` | platform | Claude Code | **CONFLICT** with PD `claudecode` (agent). See deferred items. |
| `claude-desktop` | platform | Claude Desktop | MERGE-TO-PRODUCT_DETAILS (deferred) |
| `dspy` | framework | DSPy | MERGE-TO-PRODUCT_DETAILS (deferred) |
| `gemini-api` | model-api | Gemini API | MERGE-TO-PRODUCT_DETAILS (deferred) |
| `github-copilot` | platform | GitHub Copilot | MERGE-TO-PRODUCT_DETAILS (deferred) |
| `grafana` | infrastructure | Grafana | MERGE-TO-PRODUCT_DETAILS (deferred) |
| `guardrails-ai` | framework | Guardrails AI | MERGE-TO-PRODUCT_DETAILS (deferred) |
| `hermes-agent` | agent | Hermes Agent | **CONFLICT** with PD `hermesagent`. See deferred items. |
| `hermes-model` | model | Hermes (Model Series) | **CONFLICT** with PD `hermesmodel`. See deferred items. |
| `ibm-watsonx` | platform | IBM watsonx.ai | MERGE-TO-PRODUCT_DETAILS (deferred) |
| `langchain` | framework | LangChain | MERGE-TO-PRODUCT_DETAILS (deferred) |
| `langsmith` | platform | LangSmith | MERGE-TO-PRODUCT_DETAILS (deferred) |
| `llamaindex` | framework | LlamaIndex | MERGE-TO-PRODUCT_DETAILS (deferred) |
| `nemo-guardrails` | framework | NeMo Guardrails | MERGE-TO-PRODUCT_DETAILS (deferred) |
| `openai-api` | model-api | OpenAI API | MERGE-TO-PRODUCT_DETAILS (deferred) |
| `openai-assistants` | platform | OpenAI Assistants API | MERGE-TO-PRODUCT_DETAILS (deferred) |
| `opentelemetry` | framework | OpenTelemetry | MERGE-TO-PRODUCT_DETAILS (deferred) |
| `pinecone` | infrastructure | Pinecone | MERGE-TO-PRODUCT_DETAILS (deferred) |
| `prometheus` | infrastructure | Prometheus | MERGE-TO-PRODUCT_DETAILS (deferred) |
| `semantic-kernel` | framework | Semantic Kernel | MERGE-TO-PRODUCT_DETAILS (deferred) |
| `vault` | infrastructure | HashiCorp Vault | MERGE-TO-PRODUCT_DETAILS (deferred) |
| `vertex-ai` | platform | Vertex AI | MERGE-TO-PRODUCT_DETAILS (deferred) |

---

## 4. Phase 2b actions (shipped this commit)

| # | File | Change | Risk |
|---|---|---|---|
| 1 | `explorer.html` | `aosnaming.primary` → `S6 Governance & Trust` | low (string in inline JS) |
| 2 | `explorer.html` | `fallow.primary` → `S5 Observability & Evaluation` | low |
| 3 | `explorer.html` | `routa.primary` → `S4 Orchestration & Decisioning`; `secondary` → `S7, S6, S5, S3, S2, S1` | low |
| 4 | `data/products.json` | `cursor.type` → `product` | low (single field) |
| 5 | `scripts/check-catalog-drift.py` | NEW — guardrail script that fails if shared IDs disagree on `type`/`primary`/`secondary` | additive |

All other reconciliation items are **deferred to human review** (see below).

---

## 5. Deferred items — risky, require human review

### 5a. Type-vocabulary harmonization (workspace-wide)

PD vocab: `product, framework, tool, agent, skill, mcp, workflow, model` (8)
PJ vocab: `framework, platform, tool, agent, skill, mcp, workflow, model, infrastructure, model-api` (10)

The non-overlapping types (`product`, `platform`, `infrastructure`, `model-api`) represent a real conceptual disagreement, not a typo. Picking one vocabulary requires a small PRD and almost certainly a re-classification pass over the 28 PJ-only and 42 PD-only entries.

### 5b. Duplicate-with-different-IDs conflicts

Three products appear in both catalogs under slug-style vs camelCase IDs, with different `type` choices:

| Product | PD id (live) | PJ id (orphan) | Notes |
|---|---|---|---|
| Claude Code | `claudecode` (agent) | `claude-code` (platform) | Most awkward — both type and ID disagree |
| Hermes Agent | `hermesagent` (agent) | `hermes-agent` (agent) | Same type; ID style differs |
| Hermes Model | `hermesmodel` (model) | `hermes-model` (model) | Same type; ID style differs |

Renaming any ID is **explicitly forbidden by Phase 2b constraints** (URL anchors / search). Deferred to a follow-up PRD that decides an ID-style convention and ships URL redirects.

### 5c. Backfilling 42 PD-only entries into products.json

High value but high volume. Should be batched per product family (mcp, workflow, skill, agent…) so reviewers can spot-check classifications.

### 5d. Pruning / promoting 28 PJ-only entries

These were authored before the live UI was wired to PD only. They may be legitimately interesting (Pinecone, Vault, Bedrock) but ship invisible today. Each needs a render-or-drop decision.

### 5e. Secondary-strata mismatches on shared IDs (caught by guardrail)

The new `check-catalog-drift.py` surfaced three additional `secondary` disagreements that were not in scope for Phase 2b's "safest fixes only" cut:

| ID | PRODUCT_DETAILS (live) | products.json | Notes |
| --- | --- | --- | --- |
| `bmad` | `S7, S2` | `S3` | Genuine classification debate — does BMAD touch UX (S7) + Knowledge (S2), or Tooling (S3)? |
| `cursor` | `S3` | `S4, S3` | Whether Cursor's agent mode warrants S4 Orchestration secondary is a real product call |
| `gsd` | `S2` | `S3` | S2 Knowledge vs S3 Tooling — needs SME |

These are deferred — they require taxonomy SME review, not a clerical merge. They will keep `check-catalog-drift.py` red until resolved (which is the desired behavior; the guardrail is doing its job).

### 5f. `routa` rationale text in `CONFIDENCE_META`

`explorer.html` line ~16352 has `desc: "S5 orchestration via lane state machine…"`. Stratum number is now wrong (canonical = S4). Out of scope for Phase 2b (prose, not a structured field); flag for a copy-fix commit.

---

## 6. Guardrail

`scripts/check-catalog-drift.py` was added so this class of drift fails loudly the next time it happens. It compares the 9 shared IDs and exits non-zero if any of `type`, `primary`, or `secondary` disagree. Not wired into CI; run on demand or before deploys.

```bash
python3 scripts/check-catalog-drift.py
```
