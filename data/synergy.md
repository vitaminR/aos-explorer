# {a}OS Tool Synergy Matrix (task-0304)

Every edge is a native integration between two primary picks of the 2026-08 whitepaper,
tagged with the wire it rides. Machine readable source: data/synergy.json.

25 tools, 25 verified edges, wires: MCP, OTel GenAI, AG-UI, HTTP, Python API, OpenAI-compatible API, runtime.

| From | To | Wire | What it gives us | Source |
|---|---|---|---|---|
| Docling (L2) | LlamaIndex (L2) | Python API | Docling document reader ships as a native LlamaIndex integration, so parsed PDFs and office docs flow straight into indexing | https://docs.llamaindex.ai/en/stable/examples/data_connectors/DoclingReaderDemo/ |
| LlamaIndex (L2) | Qdrant (L2) | Python API | LlamaIndex ships a first party Qdrant vector store integration | https://docs.llamaindex.ai/en/stable/examples/vector_stores/QdrantIndexDemo/ |
| Mem0 (L2) | Qdrant (L2) | Python API | Mem0 supports Qdrant as its vector store backend | https://docs.mem0.ai/components/vectordbs/dbs/qdrant |
| Mem0 (L2) | SQLite (L2) | Python API | Mem0 keeps its history store in SQLite by default | https://docs.mem0.ai/open-source/overview |
| llama.cpp (L1) | LiteLLM Proxy (L1) | OpenAI-compatible API | llama.cpp serves an OpenAI style endpoint that LiteLLM routes as a provider, giving the free local lane a place in the gateway | https://docs.litellm.ai/docs/providers/openai_compatible |
| LiteLLM Proxy (L1) | Langfuse (L5) | OTel GenAI | LiteLLM logs every routed call to Langfuse via its logging integration, so gateway traffic lands in the trace store | https://docs.litellm.ai/docs/observability/langfuse_integration |
| LiteLLM Proxy (L1) | Open Policy Agent (L6) | HTTP | LiteLLM pre call hooks can consult an external policy endpoint before a request is allowed through | https://docs.litellm.ai/docs/proxy/call_hooks |
| LLM Guard (L6) | LiteLLM Proxy (L1) | HTTP | LiteLLM's guardrails framework runs LLM Guard scans on requests passing through the proxy | https://docs.litellm.ai/docs/proxy/guardrails/quick_start |
| Langfuse (L5) | DeepEval (L5) | Python API | Eval runs read traced generations and write scores back, connecting judgment to the trace store | https://langfuse.com/docs/scores/overview |
| DeepEval (L5) | LiteLLM Proxy (L1) | OpenAI-compatible API | DeepEval judge models point at any OpenAI compatible endpoint, so the gateway serves the judges too | https://deepeval.com/guides/guides-using-custom-llms |
| Pydantic AI (L4) | LiteLLM Proxy (L1) | OpenAI-compatible API | Pydantic AI talks to OpenAI compatible providers, so typed agents ride the same gateway and OAuth lanes | https://ai.pydantic.dev/models/openai/ |
| Pydantic AI (L4) | Langfuse (L5) | OTel GenAI | Pydantic AI emits OpenTelemetry instrumentation that lands in any OTLP endpoint including Langfuse | https://ai.pydantic.dev/logfire/ |
| FastMCP (L3) | Claude Code (L4) | MCP | FastMCP servers expose Python orchestration as tools any MCP client, including Claude Code and the fleet, can call | https://gofastmcp.com/getting-started/welcome |
| Playwright MCP (L3) | Claude Code (L4) | MCP | The official Playwright MCP server lets agents drive the same browser stack the ghost tour walks trust | https://github.com/microsoft/playwright-mcp |
| Composio (L3) | Claude Code (L4) | MCP | Composio's integration catalog surfaces as MCP tool servers for agent clients | https://docs.composio.dev/docs/mcp-overview |
| Dagu (L4) | Claude Code (L4) | MCP | Dagu ships a built in MCP server so agents can inspect and trigger scheduled jobs | https://docs.dagu.cloud/features/interfaces/mcp |
| gVisor (L3) | FastMCP (L3) | runtime | gVisor's runsc hardens the container runtime that tool servers and agent-run code execute inside | https://gvisor.dev/docs/user_guide/quick_start/docker/ |
| Hatchet (L4) | Pydantic AI (L4) | Python API | Durable workflow steps wrap agent calls, so a crashed overnight loop resumes from its last completed step | https://docs.hatchet.run/home |
| Infisical (L6) | LiteLLM Proxy (L1) | runtime | Machine secrets inject as environment variables into the gateway and services, so keys stop living in files | https://infisical.com/docs/integrations/platforms/docker |
| Open Policy Agent (L6) | Claude Code (L4) | HTTP | Orchestration asks OPA for an allow or deny decision over plain HTTP before risky tool calls | https://www.openpolicyagent.org/docs/latest/rest-api/ |
| CopilotKit (L7) | assistant-ui (L7) | AG-UI | AG-UI is the shared wire for agent to UI events; CopilotKit is its reference implementation and assistant-ui speaks it | https://docs.ag-ui.com/introduction |
| assistant-ui (L7) | LiteLLM Proxy (L1) | OpenAI-compatible API | The chat UI streams from any OpenAI compatible backend, which the gateway provides | https://www.assistant-ui.com/docs/getting-started |
| Pipecat (L7) | llama.cpp (L1) | Python API | Voice pipelines call local models for the offline lane, keeping the assistive voice loop alive with zero network | https://docs.pipecat.ai/server/services/supported-services |
| Healthchecks.io (L5) | Dagu (L4) | HTTP | Scheduled jobs ping their check on completion; silence becomes an external page instead of an unnoticed death | https://healthchecks.io/docs/monitoring_cron_jobs/ |
| FalkorDB (L2) | Mem0 (L2) | Python API | Graph memory backends connect the runtime knowledge graph to agent memory for relationship aware recall | https://docs.mem0.ai/open-source/graph_memory/overview |
