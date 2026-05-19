# Perplexity Research Queries — {a}OS Explorer Phase 2

Run these in order. Each query targets a specific stratum gap.
Copy/paste directly into Perplexity (sonar-pro recommended).

---

## Batch 1: L5 Observability (CRITICAL — zero products)

### Query 1 — LLM Observability Landscape

```
What are the top LLM observability and tracing platforms in 2025-2026? Compare LangSmith, Langfuse, Arize Phoenix, Helicone, and Weights & Biases Weave. For each, provide: deployment model (cloud/self-hosted/hybrid), license (open source vs proprietary), primary capabilities (tracing, eval, monitoring, cost tracking), pricing tier, and notable production users. Focus on agentic AI use cases, not just simple LLM calls.
```

### Query 2 — LLM Evaluation Frameworks

```
What are the best LLM evaluation frameworks and harnesses as of 2026? Compare Promptfoo, Braintrust, RAGAS, DeepEval, and Giskard. For each: is it a CLI tool, library, or platform? What metrics does it measure (faithfulness, relevance, hallucination, latency)? Is it open source? How does it integrate with RAG pipelines and multi-agent workflows? Include GitHub stars and recent activity.
```

---

## Batch 2: L3 Execution & Interfaces (CRITICAL — zero products)

### Query 3 — MCP and Tool Integration

```
What is the Model Context Protocol (MCP) by Anthropic and how does it compare to other tool-integration standards for LLM agents? Compare MCP with Composio, Toolhouse, and LangChain Tools. For each, cover: what it standardizes (tool discovery, execution, context passing), deployment model, number of integrations, adoption by major agent frameworks (CrewAI, LangGraph, AutoGen), and current limitations. Include links to official docs.
```

### Query 4 — AI Code Execution Sandboxes

```
Compare E2B, Browserbase, Modal, and Fly.io for AI agent code execution in 2026. For each: what type of sandbox (VM, container, browser, microVM)? Is it purpose-built for AI agents or general compute? Pricing model? SDK languages? How do they handle tool execution, file I/O, and long-running processes? Which agent frameworks integrate natively?
```

---

## Batch 3: L1 Models & Infrastructure (only 1 vendor)

### Query 5 — Model Serving Platforms

```
Compare the major model serving and inference platforms for agentic AI as of 2026: OpenAI Platform (API), AWS Bedrock, Google Vertex AI, Groq, Together AI, Fireworks AI, and Replicate. For each: which foundation models are available? What's the deployment model? Do they support fine-tuning? What are their unique differentiators (speed, cost, model variety, enterprise features)? Focus on multi-model orchestration capabilities relevant to agentic workflows.
```

### Query 6 — Local Model Running

```
What are the best tools for running LLMs locally in 2026? Compare Ollama, LM Studio, llama.cpp, vLLM, and LocalAI. For each: supported model formats (GGUF, GGML, safetensors), GPU requirements, API compatibility (OpenAI-compatible?), ease of setup, and how they integrate with agent frameworks like CrewAI, LangGraph, or Semantic Kernel. Which are most popular for development and testing vs production self-hosting?
```

---

## Batch 4: L6 Governance & Trust (only OPA)

### Query 7 — AI Guardrails and Safety

```
Compare the leading AI guardrail and safety frameworks in 2026: Guardrails AI, NVIDIA NeMo Guardrails, LlamaGuard (Meta), Rebuff, and LLM Guard. For each: what does it guard against (hallucination, toxicity, PII leakage, prompt injection, off-topic responses)? Is it a library, API, or model? Open-source? How does it integrate into an agentic pipeline (pre-call, post-call, or both)? What's the performance overhead?
```

### Query 8 — AI Identity and Security APIs

```
What platforms provide security APIs specifically for AI applications in 2026? Look at Pangea, Permit.io, and Auth0/Okta AI Gateway. What do they offer for agentic AI: AuthZ for tool calls, audit trails for agent actions, PII redaction, credential vaults for agent-to-API communication? How do they compare to using OPA directly?
```

---

## Batch 5: L7 Experience & Intent (no external products)

### Query 9 — Copilot/Chat UI Frameworks

```
What are the best open-source frameworks for building AI copilot and chat UIs in 2026? Compare Chainlit, CopilotKit, Vercel AI SDK, Open WebUI, and Gradio. For each: what type of UI (chat, copilot, dashboard)? What language/framework (React, Python, etc.)? Does it support streaming, tool-use rendering, multi-turn conversations, and agent state visualization? GitHub stars and recent activity?
```

---

## Batch 6: L4 Orchestration (add BMAD + fill gaps)

### Query 10 — Agent Frameworks Comparison 2026

```
Compare the top multi-agent AI frameworks as of 2026: CrewAI, LangGraph, AutoGen (Microsoft), BMAD Method, Semantic Kernel, Haystack (deepset), and Mastra. For each: what's the core abstraction (crews, graphs, conversations, workflows)? Language support? Does it include built-in memory, tool execution, and human-in-the-loop? Open source license? How do they overlap and where do they differentiate? Include GitHub stars.
```

### Query 11 — Workflow / Durable Execution for AI

```
How are durable execution platforms like Temporal, Inngest, and Hatchet being used for AI agent orchestration in 2026? What problems do they solve that pure agent frameworks (CrewAI, LangGraph) don't — reliability, retries, long-running workflows, state persistence? Are there AI-native features or just general workflow engines adapted for AI? Compare their agent-specific capabilities.
```

---

## Batch 7: L2 Knowledge & Memory (add 1-2)

### Query 12 — Vector Databases for RAG

```
Compare the top vector databases for RAG and agentic AI in 2026: Pinecone, Weaviate, Chroma, Qdrant, Milvus, and pgvector. For each: managed vs self-hosted? Hybrid search support (vector + keyword)? Filtering capabilities? Pricing model? Which agent frameworks have native integrations? What's their differentiator for agentic use cases (multi-tenant, real-time updates, metadata filtering)?
```

---

## Usage Notes

- Run Batch 1-2 first (fill critical gaps at L5 and L3)
- For each query, extract: name, vendor/org, deployment, license, primary stratum, secondary strata, axis roles, evidence basis, and risk flags
- Save raw Perplexity responses — they become the `evidence` field in CONFIDENCE_META
- Flag any product that spans 3+ strata — those need careful primary/secondary analysis
