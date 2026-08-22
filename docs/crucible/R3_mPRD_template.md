# R3 — mPRD Template: Product-to-Substrate Mapping

> **Usage:** Copy this template for each product. Fill in the substrate mappings.
> **Output:** Machine-readable `substrate_mappings` array for `PRODUCT_DETAILS` enhancement.
> **Naming:** `mPRD_<NNN>_<product_key>.md` (e.g., `mPRD_001_azure_ai_foundry.md`)

---

## Product Identity

| Field | Value |
|-------|-------|
| **Product Key** | `<key from PRODUCT_DETAILS>` |
| **Product Name** | |
| **Type** | product / framework / tool / agent / mcp / workflow / skill |
| **Vendor** | |
| **Canonical Reference** | URL to official docs |

---

## Substrate Mappings

For each core substrate this product touches, fill in one row.
`relevance` is 0.0–1.0 (how central this substrate is to the product's value prop).

| Stratum | Substrate | Relevance | Constructs Touched | Evidence |
|-------|-----------|-----------|-------------------|----------|
| S7 | Intent Parsers & UX | | | |
| S7 | Generative UI | | | |
| S7 | Human-in-the-Loop Controls | | | |
| S6 | Policy Engines | | | |
| S6 | Identity & Access | | | |
| S6 | Audit & Compliance | | | |
| S6 | Safety & Content Filters | | | |
| S5 | Tracing & Logging | | | |
| S5 | Eval Frameworks | | | |
| S5 | Drift & Anomaly Detection | | | |
| S4 | Workflow Engines | | | |
| S4 | Agent Frameworks | | | |
| S4 | Routing & Planning | | | |
| S4 | Scheduling & Triggers | | | |
| S4 | Retry & Recovery | | | |
| S4 | Quality Gates & Verification | | | |
| S3 | Tool Registries & MCP | | | |
| S3 | Code Execution | | | |
| S3 | External APIs | | | |
| S3 | Browser & UI Automation | | | |
| S3 | File & OS Interfaces | | | |
| S3 | Message Queues & Events | | | |
| S2 | RAG Pipelines & Search | | | |
| S2 | Memory Systems | | | |
| S2 | Knowledge Graphs | | | |
| S2 | Embedding Stores | | | |
| S1 | Foundation Models | | | |
| S1 | Compute & Serving | | | |
| S1 | Training & Fine-tuning | | | |

**Instructions:** Delete rows where relevance = 0 (product doesn't touch that substrate).
Keep only substrates where the product has meaningful capability.

---

## Primitive-Level Guides

For each substrate this product touches, provide implementation guidance at the primitive level.

### [Substrate Name] (L?)

| Primitive | Product Feature | Implementation Guide | Confidence |
|-----------|----------------|---------------------|------------|
| `<primitive_key>` | | | 0.0–1.0 |

*(Repeat this section for each substrate the product touches.)*

---

## Product-Origin Constructs

If this product **originates** a construct pattern (like GSD originates "Context Pack"),
list them here. These will get `product_origin` tags in the UI.

| Construct Name | Core Substrate Home | Primitives | Notes |
|---------------|--------------------|-----------|----|
| | | | |

---

## Ranking Signals

| Signal | Value | Notes |
|--------|-------|-------|
| **Overall confidence** | 0.0–1.0 | From PRODUCT_DETAILS |
| **Primary stratum** | L? | |
| **Stratum coverage** | ?/7 | How many strata touched meaningfully |
| **Community traction** | Low / Medium / High | GitHub stars, enterprise adoption |
| **Unique capability** | | What does this product do that no other does? |

---

## Verification

- [ ] All substrate mappings have evidence URLs
- [ ] Relevance scores are justified (not just guessed)
- [ ] Primitive guides are actionable (not just "use the API")
- [ ] Product-origin constructs are correctly attributed
- [ ] No duplicate substrate mappings

---

## Machine-Readable Output

Paste this into the `PRODUCT_DETAILS[key]` enhancement:

```js
substrate_mappings: [
  // { substrate_id: "l4-workflow-engines", relevance: 0.95, constructs_touched: ["execution_plan", "step_graph"] },
],
```
