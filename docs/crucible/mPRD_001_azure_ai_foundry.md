# mPRD-001: Azure AI Foundry — Product-to-Substrate Mapping

> **Status:** COMPLETE
> **Date:** 2026-04-12
> **Product Key:** `af`
> **Priority:** P0 (widest coverage, enterprise anchor)

---

## Product Identity

| Field | Value |
|-------|-------|
| **Product Key** | `af` |
| **Product Name** | Azure AI Foundry |
| **Type** | product |
| **Vendor** | Microsoft |
| **Canonical Reference** | <https://learn.microsoft.com/en-us/azure/ai-studio/> |

---

## Substrate Mappings

| Layer | Substrate | Relevance | Constructs Touched | Evidence |
|-------|-----------|-----------|-------------------|----------|
| L7 | Intent Parsers & UX | 0.70 | `intent_object`, `session_context` | AI Foundry portal + Playground chat UI; Agent Service threads expose session context |
| L6 | Safety & Content Filters | 0.90 | `filter_id`, `taxonomy_version`, `action_on_match`, `confidence_threshold` | Azure AI Content Safety — real-time text/image moderation with configurable severity thresholds |
| L6 | Identity & Access | 0.60 | — | Azure RBAC + Managed Identity for model endpoints; not a standalone IAM product |
| L5 | Tracing & Logging | 0.75 | `span_id`, `parent_span_id`, `operation_name`, `duration_ms` | Prompt flow tracing, Azure Monitor integration, OpenTelemetry-compatible spans |
| L5 | Eval Frameworks | 0.80 | — | Built-in evaluation runs with judge models (groundedness, relevance, coherence metrics) |
| L4 | Workflow Engines | 0.85 | `execution_plan`, `step_graph`, `state_checkpoint` | Prompt flow DAG orchestration — multi-step flows with branching, parallel nodes, state |
| L4 | Agent Frameworks | 0.70 | `agent_roster`, `task_assignment` | Azure AI Agent Service — multi-agent with tool use, threads, and file-search |
| L4 | Routing & Planning | 0.55 | — | Model catalog with endpoint routing; no native cost-aware router yet |
| L3 | Tool Registries & MCP | 0.60 | `tool_manifest` | Agent Service function/tool definitions; Bing grounding as built-in tool |
| L3 | External APIs | 0.50 | — | REST endpoints for chat completions, embeddings, batch inference |
| L2 | RAG Pipelines & Search | 0.85 | — | Azure AI Search integration (hybrid retrieval, semantic ranking, vector search) |
| L2 | Embedding Stores | 0.70 | — | Azure OpenAI text-embedding models + AI Search vector indexes |
| L1 | Foundation Models | 0.95 | — | Model catalog: OpenAI GPT-4o/o3, Llama, Mistral, Phi, Cohere — primary value prop |
| L1 | Compute & Serving | 0.90 | — | Managed compute endpoints, provisioned throughput, serverless deployments |
| L1 | Training & Fine-tuning | 0.75 | — | Fine-tuning for GPT-4o, Phi, Llama; distillation workflows |

---

## Primitive-Level Guides

### Workflow Engines (L4)

| Primitive | Product Feature | Implementation Guide | Confidence |
|-----------|----------------|---------------------|------------|
| `step_graph` | Prompt flow | Define multi-step orchestration as a DAG of LLM/Python/tool nodes in Prompt flow. Each node is a step; edges are data connections. | 0.90 |
| `node_list` | Prompt flow nodes | Each Prompt flow node has a type (llm, python, tool), inputs, outputs. Nodes execute in topological order. | 0.88 |
| `edge_list` | Prompt flow connections | Data flows between nodes via named connections. Branch conditions use Python nodes returning routing keys. | 0.85 |
| `execution_plan` | Prompt flow runtime | The runtime resolves the DAG, handles parallelism, and manages state across nodes. Batch mode for evaluation. | 0.85 |
| `state_checkpoint` | Prompt flow variants | Variants snapshot prompt/model config at a point for A/B testing. Not a full checkpoint system. | 0.60 |

### Agent Frameworks (L4)

| Primitive | Product Feature | Implementation Guide | Confidence |
|-----------|----------------|---------------------|------------|
| `agent_id` | Agent Service agents | Each agent has a unique ID, model assignment, and instruction set. Created via REST API or SDK. | 0.85 |
| `capability_tags` | Agent tools | Agents declare tool capabilities (code_interpreter, file_search, function) at creation time. | 0.82 |
| `status_enum` | Thread run status | Runs have statuses: queued, in_progress, requires_action, completed, failed, expired. Poll or stream. | 0.88 |
| `agent_roster` | Multi-agent | Create multiple agents with different models/instructions. Route tasks by capability. No native crew pattern yet. | 0.65 |
| `task_assignment` | Thread runs | Create a run on a thread with a specific agent. The agent processes the thread's messages. | 0.85 |

### Safety & Content Filters (L6)

| Primitive | Product Feature | Implementation Guide | Confidence |
|-----------|----------------|---------------------|------------|
| `filter_id` | Content Safety resource | Each Content Safety resource has configurable filter configurations per category (hate, violence, sexual, self-harm). | 0.90 |
| `taxonomy_version` | Category taxonomy | Microsoft maintains versioned category taxonomies. Current: v2 with 4 main categories + jailbreak detection. | 0.85 |
| `action_on_match` | Severity thresholds | Configure per-category severity thresholds (0–7). Action: allow, warn, or block based on threshold. | 0.90 |
| `confidence_threshold` | Detection confidence | Each flagged item returns a severity score. Set threshold for automated blocking vs. human review. | 0.88 |

### Tracing & Logging (L5)

| Primitive | Product Feature | Implementation Guide | Confidence |
|-----------|----------------|---------------------|------------|
| `span_id` | Prompt flow tracing | Each node execution produces a span with unique ID. OpenTelemetry-compatible. Viewable in AI Foundry portal. | 0.82 |
| `parent_span_id` | Trace hierarchy | Spans nest: flow → node → LLM call → tool call. Parent-child relationships enable distributed trace graphs. | 0.80 |
| `operation_name` | Span names | Named by node type + node name. Custom Python nodes can add sub-spans. | 0.78 |
| `duration_ms` | Latency tracking | Each span records start/end timestamps. Portal shows latency breakdown per node. Exportable to Azure Monitor. | 0.85 |

---

## Product-Origin Constructs

Azure AI Foundry doesn't originate novel constructs in the {a}OS ontology — it implements standard
patterns. Its primary contribution is the breadth of coverage across 5+ layers from a single platform.

| Construct Name | Core Substrate Home | Primitives | Notes |
|---------------|--------------------|-----------|----|
| (none — implements standard patterns) | — | — | Primary value is breadth, not novel construct patterns |

---

## Ranking Signals

| Signal | Value | Notes |
|--------|-------|-------|
| **Overall confidence** | 0.92 | High — well-documented enterprise platform |
| **Primary layer** | L1 Models & Infrastructure | Model hosting/inference is the core value prop |
| **Layer coverage** | 5/7 (L1, L2, L4, L5, L6) + touches L3, L7 | Broadest coverage of any single product in the catalog |
| **Community traction** | High | Enterprise adoption (Azure customer base), growing open-source Prompt flow SDK |
| **Unique capability** | Unified model catalog + orchestration + safety in one portal | Only platform combining model serving, prompt flow orchestration, content safety, and evaluation in a single management surface |

---

## Machine-Readable Output

```js
// Add to PRODUCT_DETAILS['af']
substrate_mappings: [
  { substrate_id: "l1-foundation-models", relevance: 0.95, constructs_touched: [] },
  { substrate_id: "l1-compute-serving", relevance: 0.90, constructs_touched: [] },
  { substrate_id: "l1-training-finetuning", relevance: 0.75, constructs_touched: [] },
  { substrate_id: "l2-rag-pipelines", relevance: 0.85, constructs_touched: [] },
  { substrate_id: "l2-embedding-stores", relevance: 0.70, constructs_touched: [] },
  { substrate_id: "l3-tool-registries", relevance: 0.60, constructs_touched: ["tool_manifest"] },
  { substrate_id: "l3-external-apis", relevance: 0.50, constructs_touched: [] },
  { substrate_id: "l4-workflow-engines", relevance: 0.85, constructs_touched: ["execution_plan", "step_graph", "state_checkpoint"] },
  { substrate_id: "l4-agent-frameworks", relevance: 0.70, constructs_touched: ["agent_roster", "task_assignment"] },
  { substrate_id: "l4-routing-planning", relevance: 0.55, constructs_touched: [] },
  { substrate_id: "l5-tracing-logging", relevance: 0.75, constructs_touched: ["span_id", "parent_span_id", "operation_name", "duration_ms"] },
  { substrate_id: "l5-eval-frameworks", relevance: 0.80, constructs_touched: [] },
  { substrate_id: "l6-safety-content-filters", relevance: 0.90, constructs_touched: ["filter_id", "taxonomy_version", "action_on_match", "confidence_threshold"] },
  { substrate_id: "l6-identity-access", relevance: 0.60, constructs_touched: [] },
  { substrate_id: "l7-intent-parsers", relevance: 0.70, constructs_touched: ["intent_object", "session_context"] },
],
```

---

## Verification

- [x] All substrate mappings have evidence (inline descriptions)
- [x] Relevance scores justified by product capability depth
- [x] Primitive guides are actionable (specific API/SDK references)
- [x] No duplicate substrate mappings
- [x] Coverage matches PRODUCT_DETAILS.primary/secondary declarations
