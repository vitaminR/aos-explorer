# PRD: {a}OS Explorer — Phase 2: Product Catalog Expansion

**Status:** Phase 2a Done · Phase 2b/2c Draft  
**Date:** 2026-04-08 (Phase 2a closeout: 2026-05-23)  
**Owner:** nymil  
**Depends on:** Phase 1 prototype (explorer.html — 8 products, 7 strata, 2 axes)

---

## Phase 2a Completion Note — 2026-05-23

Phase 2a ("Taxonomy visible end-to-end") shipped:

- **Data quality**: Audited both `data/products.json` (37 entries) and the live `PRODUCT_DETAILS` inline catalog in `explorer.html` (51 entries). Type coverage was already 100% in both sources before this pass — no fills were required. Vocabularies differ by design: `products.json` uses taxonomy values (`platform`, `framework`, `infrastructure`, `model-api`, `tool`, `agent`, `skill`, `model`); `PRODUCT_DETAILS` uses entity-class values (`product`, `framework`, `tool`, `agent`, `skill`, `mcp`, `workflow`, `model`).
- **UI surface**: Added a type badge on every product card in `explorer.html`. Badge is injected at DOMContentLoaded by reading `PRODUCT_DETAILS[id].type` (with `card.dataset.type` fallback), labeled via `ENTITY_TYPE_LABELS`, and colored per type (framework/agent/tool/skill/mcp/workflow/model/product). The existing left-rail Type filter (All / Products / Tools / Frameworks / Workflows / Agents / Skills / MCPs) was already wired and unchanged.
- **Label map extended**: `ENTITY_TYPE_LABELS` now also covers the taxonomy vocabulary (`platform`, `infrastructure`, `model-api`, `model`) so future PRODUCT_DETAILS entries that carry those values render cleanly.
- **One reconciliation note (deferred to 2b)**: `cursor` is `product` in `PRODUCT_DETAILS` vs `platform` in `products.json`. Left as-is for this pass — PRODUCT_DETAILS is the live source and "product" is the entity-class catch-all there. Phase 2b should harmonize the two vocabularies (single source of truth).

**Deferred to Phase 2b**:

- Compare-matrix "Type" row
- Single source of truth between `products.json` and `PRODUCT_DETAILS` (vocab + ID convention)
- Adding the new high-priority products listed in Section 4
- Section 6.3 Compare Matrix Type column
- Section 6.4 search highlighting of type strings

---

## 1. Problem Statement

The Phase 1 prototype ships with 8 products. Three strata have **zero** primary-mapped products (S5, S3), and S1/S7 each have only one vendor. This makes the explorer feel like a demo rather than a reference catalog. The product list also mixes platforms, frameworks, components, and internal tools without classification — making it harder for users to compare like-for-like.

## 2. Goals

| # | Goal | Metric |
|---|---|---|
| G1 | Fill every stratum with ≥2 primary products | 0→2+ for S5, S3; 1→2+ for S1, S7 |
| G2 | Introduce product-type taxonomy | Every product tagged with exactly 1 type |
| G3 | Add ≥12 new products (total ≥20) | Right rail product count |
| G4 | Maintain confidence scoring rigor | Every new product has full CONFIDENCE_META |
| G5 | Keep compare matrix useful at scale | Type filter, stratum filter functional |

## 3. Product Type Taxonomy

Every product gets exactly one `type`:

| Type | Definition | Icon | Examples |
|---|---|---|---|
| **Platform** | Hosted service, managed infra, multi-capability | ☁️ | Azure AI Foundry, AWS Bedrock |
| **Framework** | Installable orchestration/agent/dev library | ⚙️ | CrewAI, LangGraph, BMAD, AutoGen |
| **Component** | Single-purpose building block or API | 🧩 | Mem0, OPA, Guardrails AI |
| **CLI / Tool** | Command-line tool or developer utility | 🔧 | MCP CLI, Promptfoo, Braintrust |
| **Harness** | Eval/test/benchmark harness | 🧪 | Promptfoo, Braintrust, RAGAS |
| **Internal** | Org-specific product | 🏠 | Kotana, Paperclip |

## 4. Coverage Plan — Target Products by Stratum

### S7 Experience & Intent (🔴 Gap: no external products)

| Candidate | Type | Rationale |
|---|---|---|
| **Vercel AI SDK** | Framework | Chat/streaming UI primitives for agent UX |
| **Chainlit** | Framework | Open-source copilot/chat UI framework |
| **Gradio** | Framework | Rapid ML demo UIs, widely used for agent frontends |
| **CopilotKit** | Framework | React-based copilot UI framework for agent apps |

### S6 Governance & Trust (🟡 Gap: only OPA)

| Candidate | Type | Rationale |
|---|---|---|
| **Guardrails AI** | Component | LLM output validation, structural guarantees |
| **NeMo Guardrails** | Component | NVIDIA's programmable guardrail stratum |
| **LlamaGuard** | Component | Meta's safety classifier for LLM I/O |
| **Pangea** | Platform | Security APIs (AuthZ, audit, redaction) for AI apps |

### S5 Observability & Evaluation (🔴🔴 Gap: zero primary products)

| Candidate | Type | Rationale |
|---|---|---|
| **LangSmith** | Platform | LangChain's tracing + eval + monitoring platform |
| **Braintrust** | Harness | Eval platform with logging, scoring, comparison |
| **Promptfoo** | CLI / Tool | CLI for LLM prompt testing and evaluation |
| **Arize Phoenix** | Platform | Open-source LLM observability + traces |
| **Langfuse** | Platform | Open-source tracing, analytics, eval for LLM apps |
| **RAGAS** | Harness | RAG evaluation framework (faithfulness, relevance) |

### S4 Orchestration & Decisioning (🟢 Add 2-3)

| Candidate | Type | Rationale |
|---|---|---|
| **BMAD Method** | Framework | AI-driven agile dev framework, 12+ specialized agents |
| **AutoGen** | Framework | Microsoft's multi-agent conversation framework |
| **Semantic Kernel** | Framework | Microsoft's AI orchestration SDK (.NET/Python) |
| **Haystack** | Framework | deepset's end-to-end NLP/RAG pipeline builder |
| **Temporal** | Platform | Durable workflow execution for agent pipelines |

### S3 Execution & Interfaces (🔴🔴 Gap: zero primary products)

| Candidate | Type | Rationale |
|---|---|---|
| **Model Context Protocol (MCP)** | Component | Anthropic's standard for tool/context integration |
| **Composio** | Platform | 250+ tool integrations for AI agents |
| **E2B** | Platform | Cloud sandboxes for AI code execution |
| **Browserbase** | Platform | Headless browser infrastructure for AI agents |
| **Toolhouse** | Platform | Tool execution and orchestration for LLMs |

### S2 Knowledge & Memory (🟡 Add 1-2)

| Candidate | Type | Rationale |
|---|---|---|
| **Pinecone** | Platform | Managed vector database, widely used for RAG |
| **Weaviate** | Platform | Open-source vector DB with hybrid search |
| **Zep** | Component | Memory stratum for AI assistants (long-term recall) |
| **LlamaIndex** | Framework | Data framework for LLM knowledge pipelines |

### S1 Models & Infrastructure (🔴 Gap: only Azure)

| Candidate | Type | Rationale |
|---|---|---|
| **OpenAI Platform** | Platform | GPT models, Assistants API, fine-tuning |
| **AWS Bedrock** | Platform | Multi-model managed inference (Claude, Llama, etc.) |
| **Google Vertex AI** | Platform | Gemini models, managed ML + serving |
| **Ollama** | CLI / Tool | Local model runner, widely used for dev/testing |
| **Groq** | Platform | Ultra-fast inference (LPU), growing ecosystem |
| **Together AI** | Platform | Open-source model hosting + fine-tuning |

## 5. Implementation Phases

### Phase 2a — Taxonomy + 12 High-Priority Adds

Priority: fill empty strata first (S5, S3), then S1, S7, S6.

**12-product shortlist (one research batch):**

1. LangSmith (S5)
2. Langfuse (S5)
3. Promptfoo (S5)
4. MCP (S3)
5. Composio (S3)
6. E2B (S3)
7. OpenAI Platform (S1)
8. Ollama (S1)
9. BMAD Method (S4)
10. Guardrails AI (S6)
11. Chainlit (S7)
12. Pinecone (S2)

**Code changes:**

- Add `type` field to `PRODUCT_DETAILS` (all existing + new)
- Add type badge rendering on product cards
- Add "Type" filter in left rail
- Add product cards + confidence metadata for each new entry
- Update compare matrix to show type
- Update strata-dots + substrate product-dots for new entries

### Phase 2b — Extended Catalog (8 more)

AutoGen, Vercel AI SDK, NeMo Guardrails, Arize Phoenix, AWS Bedrock, LlamaIndex, Zep, Browserbase

### Phase 2c — Community / Phase 3 Prep

- Import from YAML/JSON instead of inline JS
- Enable community product submissions
- Add product detail pages (not just right-rail cards)

## 6. UI Changes

### 6.1 Product Card — Type Badge

Small colored pill below the vendor line:

```
Azure AI Foundry
Microsoft · Cloud · Proprietary
☁️ Platform                          <-- new
[strata dots]
```

### 6.2 Left Rail — Type Filter

Add under existing Filters section:

```
Filters
  🏢 Vendor      [All]
  ☁  Deployment  [All]
  🔓 License     [All]
  🏷  Type        [All]    <-- new: cycles Platform/Framework/Component/CLI/Harness/Internal
```

### 6.3 Compare Matrix — Type Column

Add "Type" as a new row in the detailed comparison table.

### 6.4 Search

Product type should be searchable (typing "framework" highlights all frameworks).

## 7. Confidence Scoring — Required for Every New Product

Each new product MUST have:

- `PRODUCT_DETAILS` entry (name, vendor, deployment, license, primary, secondary, axisRoles, confidence, rationale)
- `CONFIDENCE_META` entry (4 factors with scores + descriptions, evidence string, risks array)

Research protocol for each product:

1. Official docs / GitHub repo
2. Independent reviews / benchmark comparisons
3. Stack overlap analysis against existing products
4. Axis role assessment (Governance involvement, Observability involvement)

## 8. Non-Goals (Phase 2)

- No backend / database — still a single HTML file
- No product submission form
- No live API data / GitHub star counts
- No pricing comparison
- No agent/skill mode content (still "Coming in Phase 2" pills)

---

## Appendix: Perplexity Research Queries

See companion file: `Perplexity_Research_Queries.md`
