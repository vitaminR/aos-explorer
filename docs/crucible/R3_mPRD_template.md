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

| Layer | Substrate | Relevance | Constructs Touched | Evidence |
|-------|-----------|-----------|-------------------|----------|
| L7 | Intent Parsers & UX | | | |
| L7 | Generative UI | | | |
| L7 | Human-in-the-Loop Controls | | | |
| L6 | Policy Engines | | | |
| L6 | Identity & Access | | | |
| L6 | Audit & Compliance | | | |
| L6 | Safety & Content Filters | | | |
| L5 | Tracing & Logging | | | |
| L5 | Eval Frameworks | | | |
| L5 | Drift & Anomaly Detection | | | |
| L4 | Workflow Engines | | | |
| L4 | Agent Frameworks | | | |
| L4 | Routing & Planning | | | |
| L4 | Scheduling & Triggers | | | |
| L4 | Retry & Recovery | | | |
| L4 | Quality Gates & Verification | | | |
| L3 | Tool Registries & MCP | | | |
| L3 | Code Execution | | | |
| L3 | External APIs | | | |
| L3 | Browser & UI Automation | | | |
| L3 | File & OS Interfaces | | | |
| L3 | Message Queues & Events | | | |
| L2 | RAG Pipelines & Search | | | |
| L2 | Memory Systems | | | |
| L2 | Knowledge Graphs | | | |
| L2 | Embedding Stores | | | |
| L1 | Foundation Models | | | |
| L1 | Compute & Serving | | | |
| L1 | Training & Fine-tuning | | | |

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
| **Primary layer** | L? | |
| **Layer coverage** | ?/7 | How many layers touched meaningfully |
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
