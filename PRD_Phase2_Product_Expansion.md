# PRD: {a}OS Explorer — Phase 2: Product Catalog Expansion

**Status:** Draft  
**Date:** 2026-04-08  
**Owner:** nymil  
**Depends on:** Phase 1 prototype (prototype.html — 8 products, 7 strata, 2 axes)

---

## 1. Problem Statement

The Phase 1 prototype ships with 8 products. Three strata have **zero** primary-mapped products (L5, L3), and L1/L7 each have only one vendor. This makes the explorer feel like a demo rather than a reference catalog. The product list also mixes platforms, frameworks, components, and internal tools without classification — making it harder for users to compare like-for-like.

## 2. Goals

| # | Goal | Metric |
|---|---|---|
| G1 | Fill every stratum with ≥2 primary products | 0→2+ for L5, L3; 1→2+ for L1, L7 |
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
| **Internal** | Org-specific product | 🏠 | Hermes, Paperclip |

## 4. Coverage Plan — Target Products by Stratum

### L7 Experience & Intent (🔴 Gap: no external products)

| Candidate | Type | Rationale |
|---|---|---|
| **Vercel AI SDK** | Framework | Chat/streaming UI primitives for agent UX |
| **Chainlit** | Framework | Open-source copilot/chat UI framework |
| **Gradio** | Framework | Rapid ML demo UIs, widely used for agent frontends |
| **CopilotKit** | Framework | React-based copilot UI framework for agent apps |

### L6 Governance & Trust (🟡 Gap: only OPA)

| Candidate | Type | Rationale |
|---|---|---|
| **Guardrails AI** | Component | LLM output validation, structural guarantees |
| **NeMo Guardrails** | Component | NVIDIA's programmable guardrail layer |
| **LlamaGuard** | Component | Meta's safety classifier for LLM I/O |
| **Pangea** | Platform | Security APIs (AuthZ, audit, redaction) for AI apps |

### L5 Observability & Evaluation (🔴🔴 Gap: zero primary products)

| Candidate | Type | Rationale |
|---|---|---|
| **LangSmith** | Platform | LangChain's tracing + eval + monitoring platform |
| **Braintrust** | Harness | Eval platform with logging, scoring, comparison |
| **Promptfoo** | CLI / Tool | CLI for LLM prompt testing and evaluation |
| **Arize Phoenix** | Platform | Open-source LLM observability + traces |
| **Langfuse** | Platform | Open-source tracing, analytics, eval for LLM apps |
| **RAGAS** | Harness | RAG evaluation framework (faithfulness, relevance) |

### L4 Orchestration & Decisioning (🟢 Add 2-3)

| Candidate | Type | Rationale |
|---|---|---|
| **BMAD Method** | Framework | AI-driven agile dev framework, 12+ specialized agents |
| **AutoGen** | Framework | Microsoft's multi-agent conversation framework |
| **Semantic Kernel** | Framework | Microsoft's AI orchestration SDK (.NET/Python) |
| **Haystack** | Framework | deepset's end-to-end NLP/RAG pipeline builder |
| **Temporal** | Platform | Durable workflow execution for agent pipelines |

### L3 Execution & Interfaces (🔴🔴 Gap: zero primary products)

| Candidate | Type | Rationale |
|---|---|---|
| **Model Context Protocol (MCP)** | Component | Anthropic's standard for tool/context integration |
| **Composio** | Platform | 250+ tool integrations for AI agents |
| **E2B** | Platform | Cloud sandboxes for AI code execution |
| **Browserbase** | Platform | Headless browser infrastructure for AI agents |
| **Toolhouse** | Platform | Tool execution and orchestration for LLMs |

### L2 Knowledge & Memory (🟡 Add 1-2)

| Candidate | Type | Rationale |
|---|---|---|
| **Pinecone** | Platform | Managed vector database, widely used for RAG |
| **Weaviate** | Platform | Open-source vector DB with hybrid search |
| **Zep** | Component | Memory layer for AI assistants (long-term recall) |
| **LlamaIndex** | Framework | Data framework for LLM knowledge pipelines |

### L1 Models & Infrastructure (🔴 Gap: only Azure)

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

Priority: fill empty strata first (L5, L3), then L1, L7, L6.

**12-product shortlist (one research batch):**

1. LangSmith (L5)
2. Langfuse (L5)
3. Promptfoo (L5)
4. MCP (L3)
5. Composio (L3)
6. E2B (L3)
7. OpenAI Platform (L1)
8. Ollama (L1)
9. BMAD Method (L4)
10. Guardrails AI (L6)
11. Chainlit (L7)
12. Pinecone (L2)

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
