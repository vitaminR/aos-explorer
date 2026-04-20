# {a}OS Infographic Prompts - All 63 Constructs

Generated from 312 primitives across 7 layers.

## System Prompt (shared)

```
You are a visual design assistant creating ADHD-friendly technical infographics for the {a}OS Agentic Operating System reference model.

DESIGN RULES:
- Dark background (#0a0a0f) with high-contrast text
- Use the layer accent color as the primary highlight
- Clean, minimal layout - no clutter
- Large readable typography (minimum 14pt equivalent)
- Each primitive shown as a distinct card/node with its name + 1-line description
- Show relationships between primitives with arrows or connectors if applicable
- Include a small icon or visual metaphor for each primitive
- Include the layer badge (e.g. "L4 . Orchestration") in the top-left corner
- Parent construct name is the large title
- Aspect ratio: 16:9 (landscape)
- Style: flat design, subtle gradients, no 3D, modern SaaS dashboard aesthetic
- Footer: "{a}OS Reference Model . vitaminR" in small text

FORMAT: Create a single infographic image. Do NOT return markdown or text descriptions.

```

---

## 01. L7 | Intent Object (4 primitives)

```
Create an infographic for the "Intent Object" construct from the {a}OS reference model.

LAYER: L7 - Human Interface
ACCENT COLOR: #818cf8
CONSTRUCT: Intent Object
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Goal Statement**: Natural language or structured declaration of what the user wants to achieve. Parsed by the intent engine to extract actionable objectives.
  - **Constraint Set**: Boundaries the agent must respect: budget, time, scope, permissions, safety rails. Constraints narrow the solution space.
  - **Preference Weight**: Numeric weights expressing how strongly the user prefers one outcome over another. Used for multi-objective optimization.
  - **Intent Confidence**: Score (0–1) indicating how certain the system is about its interpretation of user intent. Low scores trigger clarification.

VISUAL GUIDANCE:
- Title: "Intent Object" in large text, colored #818cf8
- Layer badge: "L7 . Human Interface" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #818cf8 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 02. L7 | Session Context (4 primitives)

```
Create an infographic for the "Session Context" construct from the {a}OS reference model.

LAYER: L7 - Human Interface
ACCENT COLOR: #818cf8
CONSTRUCT: Session Context
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Conversation History**: Ordered log of messages between user and agent within a session. Enables context-aware responses and reference resolution.
  - **User Profile**: Persistent user attributes (role, expertise, preferences) that personalize agent behavior across sessions.
  - **Decision Log**: Audit trail of choices made during the session — what was selected, rejected, and why. Supports undo and review.
  - **Context Window**: The sliding window of tokens currently visible to the model. Managing its size is critical for coherent long interactions.

VISUAL GUIDANCE:
- Title: "Session Context" in large text, colored #818cf8
- Layer badge: "L7 . Human Interface" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #818cf8 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 03. L7 | Satisfaction Signal (4 primitives)

```
Create an infographic for the "Satisfaction Signal" construct from the {a}OS reference model.

LAYER: L7 - Human Interface
ACCENT COLOR: #818cf8
CONSTRUCT: Satisfaction Signal
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Thumbs Signal**: Explicit binary feedback (👍/👎) from the user on agent output quality. Simplest form of RLHF signal.
  - **Completion Rate**: Percentage of tasks the agent completes without human intervention. High rates indicate effective autonomy.
  - **Retry Count**: Number of times the user re-prompts or re-runs a task. High retry counts signal intent misalignment.
  - **Dwell Time**: Time the user spends reviewing agent output before accepting or rejecting. Long dwell may indicate confusion.

VISUAL GUIDANCE:
- Title: "Satisfaction Signal" in large text, colored #818cf8
- Layer badge: "L7 . Human Interface" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #818cf8 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 04. L7 | Feedback Loop (4 primitives)

```
Create an infographic for the "Feedback Loop" construct from the {a}OS reference model.

LAYER: L7 - Human Interface
ACCENT COLOR: #818cf8
CONSTRUCT: Feedback Loop
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Signal Aggregator**: Collects and normalizes multiple satisfaction signals into a unified quality score for the feedback loop.
  - **Behavior Adjuster**: Component that modifies agent parameters (temperature, tool selection, verbosity) based on aggregated feedback.
  - **Reward Shaper**: Transforms raw satisfaction signals into reward values suitable for reinforcement learning or fine-tuning.
  - **Loop Frequency**: How often the feedback loop runs — per-turn, per-session, or per-batch. Determines adaptation speed.

VISUAL GUIDANCE:
- Title: "Feedback Loop" in large text, colored #818cf8
- Layer badge: "L7 . Human Interface" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #818cf8 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 05. L4 | Execution Plan (4 primitives)

```
Create an infographic for the "Execution Plan" construct from the {a}OS reference model.

LAYER: L4 - Orchestration
ACCENT COLOR: #34d399
CONSTRUCT: Execution Plan
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Step Graph**: DAG of individual steps with edges encoding dependencies. The orchestrator traverses this to execute tasks in order.
  - **Branch Condition**: Boolean or score-based condition determining which branch of the plan to follow. Enables dynamic workflows.
  - **Retry Policy**: Rules for when and how to retry failed steps: max attempts, backoff strategy, and error classification.
  - **Plan Hash**: Content-addressable hash of the execution plan. Used for caching, deduplication, and plan versioning.

VISUAL GUIDANCE:
- Title: "Execution Plan" in large text, colored #34d399
- Layer badge: "L4 . Orchestration" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #34d399 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 06. L4 | State Checkpoint (4 primitives)

```
Create an infographic for the "State Checkpoint" construct from the {a}OS reference model.

LAYER: L4 - Orchestration
ACCENT COLOR: #34d399
CONSTRUCT: State Checkpoint
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **State Blob**: Serialized snapshot of all orchestration state at a point in time. Enables resume-from-checkpoint after failures.
  - **Checkpoint ID**: Unique identifier for a saved checkpoint. Used to select which state to resume from.
  - **Restore Function**: Callable that deserializes a state blob and reinitializes the orchestrator to continue from that point.
  - **TTL Seconds**: Time-to-live for a checkpoint before automatic garbage collection. Balances storage cost vs recoverability.

VISUAL GUIDANCE:
- Title: "State Checkpoint" in large text, colored #34d399
- Layer badge: "L4 . Orchestration" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #34d399 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 07. L4 | Dependency Graph (4 primitives)

```
Create an infographic for the "Dependency Graph" construct from the {a}OS reference model.

LAYER: L4 - Orchestration
ACCENT COLOR: #34d399
CONSTRUCT: Dependency Graph
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Node List**: Array of all tasks in the graph. Each node holds its ID, status, and input/output contract.
  - **Edge List**: Array of directed edges encoding 'A must complete before B' relationships between tasks.
  - **Critical Path**: Longest chain of dependent tasks determining minimum total execution time. Optimization target for parallelism.
  - **Cycle Detector**: Algorithm that verifies the graph is acyclic (DAG). Cycles indicate deadlocks in the execution plan.

VISUAL GUIDANCE:
- Title: "Dependency Graph" in large text, colored #34d399
- Layer badge: "L4 . Orchestration" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #34d399 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 08. L4 | Timeout Policy (4 primitives)

```
Create an infographic for the "Timeout Policy" construct from the {a}OS reference model.

LAYER: L4 - Orchestration
ACCENT COLOR: #34d399
CONSTRUCT: Timeout Policy
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Max Wait (ms)**: Maximum milliseconds to wait for a step or tool call before triggering timeout handling.
  - **Escalation Target**: The agent, human, or fallback system to notify when a timeout occurs. Part of graceful degradation.
  - **Fallback Action**: Default action taken on timeout: skip, retry with simpler model, return partial result, or escalate.
  - **Jitter Range**: Random delay added to retries to prevent thundering herd. Expressed as a min/max millisecond range.

VISUAL GUIDANCE:
- Title: "Timeout Policy" in large text, colored #34d399
- Layer badge: "L4 . Orchestration" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #34d399 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 09. L4 | Agent Roster (4 primitives)

```
Create an infographic for the "Agent Roster" construct from the {a}OS reference model.

LAYER: L4 - Orchestration
ACCENT COLOR: #34d399
CONSTRUCT: Agent Roster
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Agent ID**: Unique identifier for each agent in the multi-agent system. Used for routing, logging, and access control.
  - **Capability Tags**: Labels describing what an agent can do (e.g., 'code_edit', 'web_search', 'image_gen'). Used for task matching.
  - **Status Enum**: Current state of the agent: idle, busy, error, offline. The scheduler checks this before assigning tasks.
  - **Resource Quota**: Budget limits for compute, API calls, or tokens allocated to this agent. Prevents runaway costs.

VISUAL GUIDANCE:
- Title: "Agent Roster" in large text, colored #34d399
- Layer badge: "L4 . Orchestration" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #34d399 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 10. L4 | Task Assignment (4 primitives)

```
Create an infographic for the "Task Assignment" construct from the {a}OS reference model.

LAYER: L4 - Orchestration
ACCENT COLOR: #34d399
CONSTRUCT: Task Assignment
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Match Score**: Numeric score indicating how well an agent's capabilities align with a task's requirements.
  - **Priority Level**: Task urgency ranking (critical/high/medium/low) that influences scheduling order.
  - **Load Factor**: Current utilization of an agent relative to its capacity. High load triggers rebalancing or queueing.
  - **Assignment Log**: Audit trail of which agent received which task, when, and why. Essential for debugging multi-agent issues.

VISUAL GUIDANCE:
- Title: "Task Assignment" in large text, colored #34d399
- Layer badge: "L4 . Orchestration" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #34d399 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 11. L4 | Message Channel (4 primitives)

```
Create an infographic for the "Message Channel" construct from the {a}OS reference model.

LAYER: L4 - Orchestration
ACCENT COLOR: #34d399
CONSTRUCT: Message Channel
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Channel ID**: Unique identifier for a communication channel between agents. Supports point-to-point and pub/sub patterns.
  - **Message Envelope**: Wrapper around message payload containing metadata: sender, timestamp, correlation ID, content type.
  - **Delivery Guarantee**: Reliability level: at-most-once, at-least-once, or exactly-once. Trade-off between performance and correctness.
  - **Subscriber List**: List of agents subscribed to a channel. Used for fan-out delivery in pub/sub messaging patterns.

VISUAL GUIDANCE:
- Title: "Message Channel" in large text, colored #34d399
- Layer badge: "L4 . Orchestration" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #34d399 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 12. L4 | Delegation Policy (4 primitives)

```
Create an infographic for the "Delegation Policy" construct from the {a}OS reference model.

LAYER: L4 - Orchestration
ACCENT COLOR: #34d399
CONSTRUCT: Delegation Policy
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Delegation Trigger**: Condition that causes an agent to delegate a subtask: complexity threshold, capability gap, or explicit rule.
  - **Approval Gate**: Optional human-in-the-loop checkpoint before delegation executes. Prevents uncontrolled task chains.
  - **Max Depth**: Maximum delegation nesting level. Prevents infinite delegation chains (agent A → B → C → ...).
  - **Escalation Path**: Ordered list of fallback agents or humans to try when delegation fails or times out.

VISUAL GUIDANCE:
- Title: "Delegation Policy" in large text, colored #34d399
- Layer badge: "L4 . Orchestration" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #34d399 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 13. L3 | Tool Manifest (4 primitives)

```
Create an infographic for the "Tool Manifest" construct from the {a}OS reference model.

LAYER: L3 - Capabilities
ACCENT COLOR: #38bdf8
CONSTRUCT: Tool Manifest
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Tool ID**: Unique identifier for a registered tool. The model references this when choosing which tool to call.
  - **JSON Schema**: Formal schema defining the tool's input parameters and their types. The model uses this for argument generation.
  - **Auth Type**: Authentication method required to call the tool: API key, OAuth, bearer token, or none.
  - **Rate Limit**: Maximum calls per time window to prevent abuse and manage costs. Enforced by the tool runtime.

VISUAL GUIDANCE:
- Title: "Tool Manifest" in large text, colored #38bdf8
- Layer badge: "L3 . Capabilities" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #38bdf8 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 14. L3 | API Binding (4 primitives)

```
Create an infographic for the "API Binding" construct from the {a}OS reference model.

LAYER: L3 - Capabilities
ACCENT COLOR: #38bdf8
CONSTRUCT: API Binding
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Endpoint URL**: The concrete HTTP endpoint the tool call is routed to at runtime. May vary by environment.
  - **Request Template**: Template for constructing the HTTP request: method, headers, body format. Populated with tool call arguments.
  - **Response Parser**: Logic that extracts structured data from the API response and transforms it into agent-readable format.
  - **Error Handler**: Strategy for handling API errors: retry, fallback, or surface to user. Includes status code mapping.

VISUAL GUIDANCE:
- Title: "API Binding" in large text, colored #38bdf8
- Layer badge: "L3 . Capabilities" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #38bdf8 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 15. L3 | Capability Schema (4 primitives)

```
Create an infographic for the "Capability Schema" construct from the {a}OS reference model.

LAYER: L3 - Capabilities
ACCENT COLOR: #38bdf8
CONSTRUCT: Capability Schema
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Capability ID**: Unique identifier for a capability the tool provides. Used by the planner to match tasks to tools.
  - **Input Schema**: JSON Schema defining what the tool expects as input. The model validates arguments against this.
  - **Output Schema**: JSON Schema defining what the tool returns. Enables type-safe chaining of tool outputs to next steps.
  - **Side Effects**: Declaration of external state changes the tool causes (file write, API mutation, DB update). Critical for safety.

VISUAL GUIDANCE:
- Title: "Capability Schema" in large text, colored #38bdf8
- Layer badge: "L3 . Capabilities" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #38bdf8 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 16. L2 | Search Index (4 primitives)

```
Create an infographic for the "Search Index" construct from the {a}OS reference model.

LAYER: L2 - Knowledge & Retrieval
ACCENT COLOR: #a78bfa
CONSTRUCT: Search Index
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Index Type**: The index algorithm: vector (HNSW, IVF), keyword (BM25), or hybrid. Determines retrieval characteristics.
  - **Embedding Dim**: Dimensionality of the embedding vectors stored in the index. Must match the embedding model's output size.
  - **Doc Count**: Total number of documents (or chunks) indexed. Affects search latency and memory requirements.
  - **Refresh Interval**: How often the index rebuilds or syncs with source documents. Trade-off between freshness and compute cost.

VISUAL GUIDANCE:
- Title: "Search Index" in large text, colored #a78bfa
- Layer badge: "L2 . Knowledge & Retrieval" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #a78bfa accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 17. L2 | Chunk Collection (4 primitives)

```
Create an infographic for the "Chunk Collection" construct from the {a}OS reference model.

LAYER: L2 - Knowledge & Retrieval
ACCENT COLOR: #a78bfa
CONSTRUCT: Chunk Collection
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Chunk ID**: Unique identifier for a document chunk. Used for retrieval, citation, and deduplication.
  - **Source Doc**: Reference to the original document this chunk was extracted from. Preserves provenance chain.
  - **Token Count**: Number of tokens in the chunk. Used for context window budgeting when assembling retrieval results.
  - **Embedding Vector**: Dense vector representation of the chunk's semantic content. Used for similarity search in the index.

VISUAL GUIDANCE:
- Title: "Chunk Collection" in large text, colored #a78bfa
- Layer badge: "L2 . Knowledge & Retrieval" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #a78bfa accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 18. L2 | Relevance Score (4 primitives)

```
Create an infographic for the "Relevance Score" construct from the {a}OS reference model.

LAYER: L2 - Knowledge & Retrieval
ACCENT COLOR: #a78bfa
CONSTRUCT: Relevance Score
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Cosine Similarity**: Similarity metric between query and document embeddings. Core signal for semantic search ranking.
  - **BM25 Score**: Classic term-frequency keyword relevance score. Complements vector search for exact-match queries.
  - **Recency Boost**: Score multiplier favoring recently updated documents. Prevents stale content from dominating results.
  - **Combined Rank**: Final ranking after fusing vector, keyword, and recency scores. Typically via reciprocal rank fusion.

VISUAL GUIDANCE:
- Title: "Relevance Score" in large text, colored #a78bfa
- Layer badge: "L2 . Knowledge & Retrieval" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #a78bfa accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 19. L2 | Rerank Pipeline (8 primitives)

```
Create an infographic for the "Rerank Pipeline" construct from the {a}OS reference model.

LAYER: L2 - Knowledge & Retrieval
ACCENT COLOR: #a78bfa
CONSTRUCT: Rerank Pipeline
PRIMITIVE COUNT: 8

PRIMITIVES (show each as a card/node):
  - **Reranker Model**: Cross-encoder model that scores query-document pairs more accurately than bi-encoder retrieval.
  - **Top K**: Number of top results to keep after reranking. Balances quality against context window budget.
  - **Score Threshold**: Minimum relevance score to include a result. Filters out low-quality matches before injection.
  - **Latency Budget (ms)**: Maximum milliseconds allowed for the reranking step. Enforces latency SLA trade-offs.
  - **Rule ID**: Unique identifier for a policy rule. Used for version tracking, audit references, and override targeting.
  - **Rule Expression**: The actual policy logic — a boolean expression in Rego, CEL, or JSON that evaluates to allow/deny.
  - **Enforcement Mode**: Whether the rule blocks (enforce), warns (audit), or just logs (monitor). Allows gradual rollout of new policies.
  - **Scope Selector**: Pattern or filter that limits which agents, resources, or environments a policy applies to.

VISUAL GUIDANCE:
- Title: "Rerank Pipeline" in large text, colored #a78bfa
- Layer badge: "L2 . Knowledge & Retrieval" top-left
- Show all 8 primitives as connected cards on dark (#0a0a0f) background
- Use #a78bfa accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 20. L6 | Policy Evaluation (4 primitives)

```
Create an infographic for the "Policy Evaluation" construct from the {a}OS reference model.

LAYER: L6 - Governance
ACCENT COLOR: #fb7185
CONSTRUCT: Policy Evaluation
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Eval Request**: The input bundle sent to the policy engine: agent identity, intended action, resource target, and context.
  - **Decision Result**: The allow/deny verdict from the policy engine, with optional explanations and matched rule references.
  - **Eval Latency**: Time taken for a single policy evaluation. Must stay within budget to avoid blocking agent actions.
  - **Violation Detail**: Structured record of exactly which rule was violated, what the expected vs actual values were, and remediation steps.

VISUAL GUIDANCE:
- Title: "Policy Evaluation" in large text, colored #fb7185
- Layer badge: "L6 . Governance" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #fb7185 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 21. L6 | Guardrail Config (4 primitives)

```
Create an infographic for the "Guardrail Config" construct from the {a}OS reference model.

LAYER: L6 - Governance
ACCENT COLOR: #fb7185
CONSTRUCT: Guardrail Config
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Guardrail ID**: Named identifier for a guardrail set (e.g., 'financial-safety-v2'). Versioned and environment-scoped.
  - **Policy Bundle**: Collection of policy rules grouped into a deployable unit. Bundling enables atomic policy updates.
  - **Fallback Action**: Default behavior when a guardrail can't evaluate (engine timeout, missing data): block, allow-with-log, or degrade.
  - **Activation Trigger**: Condition that activates or deactivates a guardrail: time-based, feature-flag, or event-driven.

VISUAL GUIDANCE:
- Title: "Guardrail Config" in large text, colored #fb7185
- Layer badge: "L6 . Governance" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #fb7185 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 22. L6 | Auth Token (4 primitives)

```
Create an infographic for the "Auth Token" construct from the {a}OS reference model.

LAYER: L6 - Governance
ACCENT COLOR: #fb7185
CONSTRUCT: Auth Token
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Token Value**: The actual secret string (JWT, API key, bearer token). Must never be logged, stored in plaintext, or transmitted without TLS.
  - **Token Issuer**: The identity provider or authority that minted the token. Verified by consumers to establish trust.
  - **Token Scope**: The permissions encoded in the token: which APIs, actions, and resources it grants access to.
  - **Expiry Epoch**: Unix timestamp when the token becomes invalid. The fundamental time-limit on credential validity.

VISUAL GUIDANCE:
- Title: "Auth Token" in large text, colored #fb7185
- Layer badge: "L6 . Governance" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #fb7185 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 23. L6 | Role Binding (4 primitives)

```
Create an infographic for the "Role Binding" construct from the {a}OS reference model.

LAYER: L6 - Governance
ACCENT COLOR: #fb7185
CONSTRUCT: Role Binding
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Principal ID**: Unique identifier of the entity (user, agent, service account) being granted a role.
  - **Role Name**: Human-readable label for the role (e.g., 'code-reviewer', 'data-reader', 'admin'). Maps to a permission set.
  - **Resource Scope**: The set of resources (APIs, data stores, tools) a role binding grants access to.
  - **Inherited From**: Reference to the parent binding this role was inherited from (e.g., org-level admin cascading to projects).

VISUAL GUIDANCE:
- Title: "Role Binding" in large text, colored #fb7185
- Layer badge: "L6 . Governance" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #fb7185 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 24. L6 | Credential Vault (4 primitives)

```
Create an infographic for the "Credential Vault" construct from the {a}OS reference model.

LAYER: L6 - Governance
ACCENT COLOR: #fb7185
CONSTRUCT: Credential Vault
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Secret ID**: Logical name for a secret stored in the vault (e.g., 'openai-api-key-prod'). Agents reference this, never raw values.
  - **Encryption Algorithm**: The algorithm used to encrypt secrets at rest (AES-256-GCM, ChaCha20). Must meet compliance requirements.
  - **Rotation Interval**: How often a secret is automatically rotated (e.g., every 90 days). Limits blast radius of leaked credentials.
  - **Access Log Ref**: Pointer to the audit log recording who accessed which secret and when. Critical for breach investigation.

VISUAL GUIDANCE:
- Title: "Credential Vault" in large text, colored #fb7185
- Layer badge: "L6 . Governance" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #fb7185 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 25. L6 | Permission Scope (4 primitives)

```
Create an infographic for the "Permission Scope" construct from the {a}OS reference model.

LAYER: L6 - Governance
ACCENT COLOR: #fb7185
CONSTRUCT: Permission Scope
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Scope Pattern**: Glob, regex, or path expression defining which resources fall within this permission scope.
  - **Allowed Actions**: Explicit list of actions (read, write, delete, execute) permitted within this scope.
  - **Denied Actions**: Explicit list of actions blocked even if other rules allow them. Deny always wins over allow.
  - **Condition Expression**: Runtime condition (time of day, IP range, MFA status) that must be true for the permission to apply.

VISUAL GUIDANCE:
- Title: "Permission Scope" in large text, colored #fb7185
- Layer badge: "L6 . Governance" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #fb7185 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 26. L6 | Audit Entry (4 primitives)

```
Create an infographic for the "Audit Entry" construct from the {a}OS reference model.

LAYER: L6 - Governance
ACCENT COLOR: #fb7185
CONSTRUCT: Audit Entry
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Entry ID**: Globally unique, immutable identifier for an audit log record. Must be tamper-evident.
  - **Actor ID**: The principal (user, agent, service) that performed the audited action. Links to identity systems.
  - **Action Type**: The verb describing what happened: 'create', 'read', 'update', 'delete', 'execute', 'approve'.
  - **Resource URN**: Uniform resource name identifying the target of the action. Enables resource-centric audit queries.

VISUAL GUIDANCE:
- Title: "Audit Entry" in large text, colored #fb7185
- Layer badge: "L6 . Governance" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #fb7185 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 27. L6 | Compliance Check (4 primitives)

```
Create an infographic for the "Compliance Check" construct from the {a}OS reference model.

LAYER: L6 - Governance
ACCENT COLOR: #fb7185
CONSTRUCT: Compliance Check
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Check ID**: Identifier linking to a specific compliance requirement (e.g., 'SOC2-CC6.1', 'GDPR-Art17').
  - **Regulation Reference**: Formal citation to the regulatory requirement being checked (e.g., 'GDPR Article 17: Right to Erasure').
  - **Pass/Fail**: Binary result of the check: 'pass' (compliant) or 'fail' (non-compliant). May include 'not-applicable'.
  - **Remediation Hint**: Actionable instructions for fixing a failed compliance check. Ideally includes code/config snippets.

VISUAL GUIDANCE:
- Title: "Compliance Check" in large text, colored #fb7185
- Layer badge: "L6 . Governance" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #fb7185 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 28. L6 | Retention Policy (4 primitives)

```
Create an infographic for the "Retention Policy" construct from the {a}OS reference model.

LAYER: L6 - Governance
ACCENT COLOR: #fb7185
CONSTRUCT: Retention Policy
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Data Class**: Classification of data (PII, financial, operational, public) that determines retention requirements.
  - **Retention Days**: Number of days data must be retained before eligible for deletion. Varies by data class and regulation.
  - **Archive Target**: Destination for data that's past active retention but must be preserved (cold storage, glacier, tape).
  - **Deletion Method**: How data is destroyed: soft delete, hard delete, crypto-shred, or physical destruction.

VISUAL GUIDANCE:
- Title: "Retention Policy" in large text, colored #fb7185
- Layer badge: "L6 . Governance" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #fb7185 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 29. L6 | Evidence Chain (4 primitives)

```
Create an infographic for the "Evidence Chain" construct from the {a}OS reference model.

LAYER: L6 - Governance
ACCENT COLOR: #fb7185
CONSTRUCT: Evidence Chain
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Chain ID**: Identifier for a linked sequence of audit entries proving a complete decision trail.
  - **Linked Entries**: Array of audit entry_ids composing this evidence chain, in chronological order.
  - **Hash Digest**: Cryptographic hash of the chain contents. Changing any entry changes the hash, proving tamper evidence.
  - **Verifier Signature**: Digital signature from an authorized verifier attesting that the evidence chain is complete and unmodified.

VISUAL GUIDANCE:
- Title: "Evidence Chain" in large text, colored #fb7185
- Layer badge: "L6 . Governance" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #fb7185 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 30. L6 | Content Filter (4 primitives)

```
Create an infographic for the "Content Filter" construct from the {a}OS reference model.

LAYER: L6 - Governance
ACCENT COLOR: #fb7185
CONSTRUCT: Content Filter
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Filter ID**: Identifier for a content filter configuration. Multiple filters may apply in sequence.
  - **Taxonomy Version**: Version of the content safety taxonomy being used (harm categories, severity levels, definitions).
  - **Action on Match**: What happens when content matches a filter: block, flag-for-review, redact, or log-only.
  - **Confidence Threshold**: Minimum classifier confidence score (0.0–1.0) to trigger the filter action. Balances precision vs recall.

VISUAL GUIDANCE:
- Title: "Content Filter" in large text, colored #fb7185
- Layer badge: "L6 . Governance" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #fb7185 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 31. L6 | Toxicity Scorer (4 primitives)

```
Create an infographic for the "Toxicity Scorer" construct from the {a}OS reference model.

LAYER: L6 - Governance
ACCENT COLOR: #fb7185
CONSTRUCT: Toxicity Scorer
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Scorer Model**: The ML model used for toxicity classification (e.g., Perspective API, LlamaGuard, custom fine-tuned).
  - **Dimension Scores**: Per-dimension toxicity scores (hate, threat, sexual, self-harm, violence). Enables nuanced response.
  - **Aggregate Score**: Combined toxicity score summarizing all dimensions into a single value for quick filtering.
  - **Threshold Config**: Per-dimension and aggregate threshold settings that determine when to trigger safety actions.

VISUAL GUIDANCE:
- Title: "Toxicity Scorer" in large text, colored #fb7185
- Layer badge: "L6 . Governance" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #fb7185 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 32. L6 | PII Redactor (4 primitives)

```
Create an infographic for the "PII Redactor" construct from the {a}OS reference model.

LAYER: L6 - Governance
ACCENT COLOR: #fb7185
CONSTRUCT: PII Redactor
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Entity Types**: The PII categories the redactor detects: names, emails, SSNs, phone numbers, addresses, etc.
  - **Redaction Method**: How detected PII is masked: replace with placeholder, hash, encrypt, or remove entirely.
  - **Confidence Floor**: Minimum NER confidence to redact a detected entity. Below this, flag for human review instead of auto-redacting.
  - **Allowlist**: List of known safe values that should NOT be redacted even if they match PII patterns (company names, public figures).

VISUAL GUIDANCE:
- Title: "PII Redactor" in large text, colored #fb7185
- Layer badge: "L6 . Governance" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #fb7185 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 33. L6 | Safety Boundary (8 primitives)

```
Create an infographic for the "Safety Boundary" construct from the {a}OS reference model.

LAYER: L6 - Governance
ACCENT COLOR: #fb7185
CONSTRUCT: Safety Boundary
PRIMITIVE COUNT: 8

PRIMITIVES (show each as a card/node):
  - **Boundary Type**: Category of safety limit: financial (max spend), destructive (no-delete zones), PII (exposure cap), or operational (rate).
  - **Risk Category**: Severity classification of the risk being bounded: critical, high, medium, low. Determines response urgency.
  - **Block Action**: The enforcement action when a boundary is crossed: reject request, kill process, freeze account, or degrade gracefully.
  - **Escalation Target**: The person, team, or automated system notified when a safety boundary is breached.
  - **Span ID**: Unique identifier for a single operation span within a distributed trace. Enables parent→child span correlation.
  - **Parent Span ID**: Reference to the parent span that spawned this operation. Null for root spans.
  - **Operation Name**: Human-readable label for the operation: 'llm.chat.completion', 'tool.web_search', 'agent.delegation'.
  - **Duration (ms)**: Wall-clock time for the operation in milliseconds. The primary signal for latency analysis and SLO tracking.

VISUAL GUIDANCE:
- Title: "Safety Boundary" in large text, colored #fb7185
- Layer badge: "L6 . Governance" top-left
- Show all 8 primitives as connected cards on dark (#0a0a0f) background
- Use #fb7185 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 34. L5 | Log Entry (4 primitives)

```
Create an infographic for the "Log Entry" construct from the {a}OS reference model.

LAYER: L5 - Observability
ACCENT COLOR: #fbbf24
CONSTRUCT: Log Entry
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Log Level**: Severity classification: DEBUG, INFO, WARN, ERROR, FATAL. Controls log volume and alerting rules.
  - **Message Template**: Parameterized log message format with placeholders for structured data (e.g., 'Agent {agent_id} completed {tool} in {ms}ms').
  - **Context Tags**: Key-value metadata attached to a log entry: session_id, agent_id, user_id, environment, etc.
  - **Correlation ID**: Shared identifier linking all log entries from a single user request or agent workflow across services.

VISUAL GUIDANCE:
- Title: "Log Entry" in large text, colored #fbbf24
- Layer badge: "L5 . Observability" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #fbbf24 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 35. L5 | Token Ledger (4 primitives)

```
Create an infographic for the "Token Ledger" construct from the {a}OS reference model.

LAYER: L5 - Observability
ACCENT COLOR: #fbbf24
CONSTRUCT: Token Ledger
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Model ID**: Identifier of the model that consumed the tokens (e.g., 'gpt-4o', 'claude-sonnet-4-20250514'). Key for cost attribution.
  - **Prompt Tokens**: Count of tokens in the input (system prompt + user message + context). Typically 80%+ of token spend.
  - **Completion Tokens**: Count of tokens in the model's response. Usually smaller than prompt tokens but more expensive per-token.
  - **Cost (USD)**: Dollar cost of this token transaction: (prompt_tokens × input_rate + completion_tokens × output_rate).

VISUAL GUIDANCE:
- Title: "Token Ledger" in large text, colored #fbbf24
- Layer badge: "L5 . Observability" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #fbbf24 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 36. L5 | Latency Histogram (4 primitives)

```
Create an infographic for the "Latency Histogram" construct from the {a}OS reference model.

LAYER: L5 - Observability
ACCENT COLOR: #fbbf24
CONSTRUCT: Latency Histogram
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Bucket Bounds (ms)**: Array of millisecond boundaries defining histogram buckets (e.g., [10, 50, 100, 500, 1000, 5000]).
  - **Sample Count**: Total number of observations in the histogram window. Needed for percentile calculation accuracy.
  - **P99 Latency (ms)**: The 99th percentile latency — 99% of requests complete within this time. The gold standard SLO metric.
  - **SLO Target (ms)**: The latency commitment: 'p99 < 5000ms for 99.9% of 28-day windows'. The contract with your users.

VISUAL GUIDANCE:
- Title: "Latency Histogram" in large text, colored #fbbf24
- Layer badge: "L5 . Observability" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #fbbf24 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 37. L5 | Eval Suite (4 primitives)

```
Create an infographic for the "Eval Suite" construct from the {a}OS reference model.

LAYER: L5 - Observability
ACCENT COLOR: #fbbf24
CONSTRUCT: Eval Suite
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Suite ID**: Identifier for an evaluation suite (e.g., 'qa-accuracy-v3', 'safety-check-prod'). Enables tracking over time.
  - **Test Count**: Number of test cases in the suite. Affects statistical significance and runtime.
  - **Pass Rate**: Percentage of test cases that pass their scoring criteria. The headline metric for eval quality.
  - **Last Run Timestamp**: When the suite was last executed. Stale evals are dangerous — models and data change.

VISUAL GUIDANCE:
- Title: "Eval Suite" in large text, colored #fbbf24
- Layer badge: "L5 . Observability" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #fbbf24 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 38. L5 | Test Case (4 primitives)

```
Create an infographic for the "Test Case" construct from the {a}OS reference model.

LAYER: L5 - Observability
ACCENT COLOR: #fbbf24
CONSTRUCT: Test Case
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Case ID**: Unique identifier for a test case within a suite. Enables per-case result tracking and regression detection.
  - **Input Prompt**: The exact prompt or conversation sent to the model for this test case. The 'question' of the eval.
  - **Expected Output**: The reference answer or pattern the model output must match or approximate. Ground truth for scoring.
  - **Scoring Function**: The function that evaluates model output against expected output and returns a score (0–1 or pass/fail).

VISUAL GUIDANCE:
- Title: "Test Case" in large text, colored #fbbf24
- Layer badge: "L5 . Observability" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #fbbf24 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 39. L5 | Judge Prompt (4 primitives)

```
Create an infographic for the "Judge Prompt" construct from the {a}OS reference model.

LAYER: L5 - Observability
ACCENT COLOR: #fbbf24
CONSTRUCT: Judge Prompt
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Judge Model**: The LLM used as an evaluator to score other model outputs. Should be at least as capable as the model being tested.
  - **Rubric Dimensions**: The criteria the judge evaluates: accuracy, helpfulness, safety, format compliance, reasoning quality.
  - **Score Scale**: The numerical scale for judge scores: binary (0/1), Likert (1–5), or continuous (0.0–1.0).
  - **Calibration Examples**: Few-shot examples in the judge prompt showing input/output/score to calibrate judge behavior.

VISUAL GUIDANCE:
- Title: "Judge Prompt" in large text, colored #fbbf24
- Layer badge: "L5 . Observability" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #fbbf24 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 40. L5 | Score Aggregator (4 primitives)

```
Create an infographic for the "Score Aggregator" construct from the {a}OS reference model.

LAYER: L5 - Observability
ACCENT COLOR: #fbbf24
CONSTRUCT: Score Aggregator
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Aggregation Function**: Method for combining per-case scores into suite-level metric: mean, weighted-mean, min-of, or percentile.
  - **Dimension Weights**: Relative importance of each rubric dimension in the final score. Safety might weight 3x more than verbosity.
  - **Final Score**: The single composite quality score for an eval run. The number that gates deployments.
  - **Confidence Interval**: Statistical range around the final score (e.g., 0.85 ± 0.03 at 95% CI). Accounts for eval noise.

VISUAL GUIDANCE:
- Title: "Score Aggregator" in large text, colored #fbbf24
- Layer badge: "L5 . Observability" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #fbbf24 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 41. L5 | Drift Detector (4 primitives)

```
Create an infographic for the "Drift Detector" construct from the {a}OS reference model.

LAYER: L5 - Observability
ACCENT COLOR: #fbbf24
CONSTRUCT: Drift Detector
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Baseline Snapshot**: Statistical profile of 'normal' model behavior (output distributions, token patterns, latency profiles) captured at a known-good state.
  - **Current Window**: Rolling time window of recent model behavior being compared against the baseline (e.g., last 24h of outputs).
  - **Drift Metric**: Statistical measure of distribution divergence: KL divergence, JS divergence, PSI, or cosine distance.
  - **Alert Threshold**: The drift metric value above which an alert fires. Separates normal variance from genuine distribution shift.

VISUAL GUIDANCE:
- Title: "Drift Detector" in large text, colored #fbbf24
- Layer badge: "L5 . Observability" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #fbbf24 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 42. L5 | Anomaly Alert (4 primitives)

```
Create an infographic for the "Anomaly Alert" construct from the {a}OS reference model.

LAYER: L5 - Observability
ACCENT COLOR: #fbbf24
CONSTRUCT: Anomaly Alert
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Alert ID**: Unique identifier for a fired alert. Links to the investigation, response actions, and resolution.
  - **Metric Name**: The specific metric that triggered the alert (e.g., 'latency_p99', 'error_rate', 'drift_psi').
  - **Observed Value**: The actual metric value that crossed the threshold and triggered the alert.
  - **Routing Channel**: Where the alert is sent: PagerDuty, Slack channel, email group, or automated remediation pipeline.

VISUAL GUIDANCE:
- Title: "Anomaly Alert" in large text, colored #fbbf24
- Layer badge: "L5 . Observability" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #fbbf24 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 43. L5 | SLO Monitor (4 primitives)

```
Create an infographic for the "SLO Monitor" construct from the {a}OS reference model.

LAYER: L5 - Observability
ACCENT COLOR: #fbbf24
CONSTRUCT: SLO Monitor
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **SLO Name**: Human-readable identifier for the Service Level Objective (e.g., 'agent-response-latency-p99').
  - **Target Percentage**: The availability/quality target: 99.9% of requests must complete within latency budget. The 'nines'.
  - **Current Percentage**: Real-time compliance percentage over the rolling window. The live score compared against target.
  - **Error Budget Remaining**: How much of the allowed failure budget is left in the current window. When it hits 0, freeze deployments.

VISUAL GUIDANCE:
- Title: "SLO Monitor" in large text, colored #fbbf24
- Layer badge: "L5 . Observability" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #fbbf24 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 44. L5 | Cost Tracker (8 primitives)

```
Create an infographic for the "Cost Tracker" construct from the {a}OS reference model.

LAYER: L5 - Observability
ACCENT COLOR: #fbbf24
CONSTRUCT: Cost Tracker
PRIMITIVE COUNT: 8

PRIMITIVES (show each as a card/node):
  - **Session Cost (USD)**: Total dollar cost of a single agent session: sum of all LLM calls, tool invocations, and compute time.
  - **Daily Budget (USD)**: Maximum allowed spend per day across all agent activity. Hard cap to prevent runaway costs.
  - **Burn Rate**: Current spend velocity ($/hour). If burn rate × remaining hours > budget, action needed.
  - **Cost Alert Threshold**: Percentage of budget that triggers alerts (e.g., 80% = warning, 100% = block). Multi-tier for graduated response.
  - **Runtime Type**: The sandbox execution engine: Docker container, Firecracker microVM, gVisor, or WASM isolate.
  - **Isolation Level**: Degree of separation: process-level, container-level, VM-level. Determines what the code can access.
  - **Timeout (sec)**: Maximum wall-clock time before the sandbox is forcibly terminated. Prevents infinite loops and resource abuse.
  - **Resource Quota**: CPU, memory, disk, and network limits enforced on the sandbox. Prevents resource exhaustion attacks.

VISUAL GUIDANCE:
- Title: "Cost Tracker" in large text, colored #fbbf24
- Layer badge: "L5 . Observability" top-left
- Show all 8 primitives as connected cards on dark (#0a0a0f) background
- Use #fbbf24 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 45. L3 | Interpreter Session (4 primitives)

```
Create an infographic for the "Interpreter Session" construct from the {a}OS reference model.

LAYER: L3 - Capabilities
ACCENT COLOR: #38bdf8
CONSTRUCT: Interpreter Session
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Session ID**: Unique identifier for a REPL/interpreter session. Enables state persistence across multiple code executions.
  - **Language Runtime**: The programming language and version: 'python:3.12', 'node:20', 'bash:5'. Determines available libraries.
  - **Variable State**: The in-memory variable namespace: all variables, functions, and imports persisted across executions in this session.
  - **History Length**: Number of previous execution cells/commands retained in session history. Enables replay and context.

VISUAL GUIDANCE:
- Title: "Interpreter Session" in large text, colored #38bdf8
- Layer badge: "L3 . Capabilities" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #38bdf8 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 46. L3 | Execution Result (4 primitives)

```
Create an infographic for the "Execution Result" construct from the {a}OS reference model.

LAYER: L3 - Capabilities
ACCENT COLOR: #38bdf8
CONSTRUCT: Execution Result
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Exit Code**: Process return code: 0 = success, non-zero = error. The universal signal for execution outcome.
  - **Stdout Content**: Standard output captured from the execution. The primary output channel for results and data.
  - **Stderr Content**: Standard error captured from the execution. Contains error messages, warnings, and diagnostic output.
  - **Artifact References**: Paths or URIs to files generated during execution: plots, CSVs, model checkpoints, reports.

VISUAL GUIDANCE:
- Title: "Execution Result" in large text, colored #38bdf8
- Layer badge: "L3 . Capabilities" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #38bdf8 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 47. L3 | Resource Limit (4 primitives)

```
Create an infographic for the "Resource Limit" construct from the {a}OS reference model.

LAYER: L3 - Capabilities
ACCENT COLOR: #38bdf8
CONSTRUCT: Resource Limit
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **CPU Limit**: Maximum CPU allocation in cores or millicores. Prevents compute-hungry code from starving other workloads.
  - **Memory Limit (MB)**: Maximum RAM in megabytes. Exceeding triggers OOM killer (exit code 137).
  - **Disk Limit (MB)**: Maximum disk space the sandboxed process can use. Prevents write bombs and disk exhaustion.
  - **Network Allowed**: Boolean or allowlist controlling network access from sandbox. Default deny prevents data exfiltration.

VISUAL GUIDANCE:
- Title: "Resource Limit" in large text, colored #38bdf8
- Layer badge: "L3 . Capabilities" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #38bdf8 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 48. L3 | API Connector (4 primitives)

```
Create an infographic for the "API Connector" construct from the {a}OS reference model.

LAYER: L3 - Capabilities
ACCENT COLOR: #38bdf8
CONSTRUCT: API Connector
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Base URL**: Root endpoint for the external API (e.g., 'https://api.example.com/v2'). All paths are relative to this.
  - **Auth Method**: Authentication type: API key, OAuth2, Bearer token, mTLS. Determines how credentials are sent.
  - **Default Headers**: HTTP headers automatically added to every request: Content-Type, Authorization, User-Agent, correlation IDs.
  - **Retry Config**: Retry policy for failed requests: max attempts, backoff strategy (exponential with jitter), retryable status codes.

VISUAL GUIDANCE:
- Title: "API Connector" in large text, colored #38bdf8
- Layer badge: "L3 . Capabilities" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #38bdf8 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 49. L3 | Webhook Emitter (4 primitives)

```
Create an infographic for the "Webhook Emitter" construct from the {a}OS reference model.

LAYER: L3 - Capabilities
ACCENT COLOR: #38bdf8
CONSTRUCT: Webhook Emitter
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Webhook URL**: The destination endpoint that receives event notifications via HTTP POST.
  - **Event Type**: Classification of the event: 'agent.completed', 'tool.failed', 'session.created'. Enables filtering.
  - **Payload Template**: JSON template defining the webhook body structure with variable placeholders for event data.
  - **Delivery Status**: Current state of the webhook delivery: pending, delivered (2xx), failed, retrying, dead-lettered.

VISUAL GUIDANCE:
- Title: "Webhook Emitter" in large text, colored #38bdf8
- Layer badge: "L3 . Capabilities" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #38bdf8 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 50. L3 | Rate Limiter (4 primitives)

```
Create an infographic for the "Rate Limiter" construct from the {a}OS reference model.

LAYER: L3 - Capabilities
ACCENT COLOR: #38bdf8
CONSTRUCT: Rate Limiter
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Limit Window**: Time window for rate counting: 1 second, 1 minute, 1 hour. Determines burst vs sustained rate limits.
  - **Max Requests**: Maximum number of requests allowed within the limit window. The 'quota' per time period.
  - **Current Usage**: Number of requests consumed in the current window. Returned in response headers for client awareness.
  - **Backoff Strategy**: Client behavior when rate limited (HTTP 429): exponential backoff with jitter, respecting Retry-After header.

VISUAL GUIDANCE:
- Title: "Rate Limiter" in large text, colored #38bdf8
- Layer badge: "L3 . Capabilities" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #38bdf8 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 51. L3 | Response Cache (4 primitives)

```
Create an infographic for the "Response Cache" construct from the {a}OS reference model.

LAYER: L3 - Capabilities
ACCENT COLOR: #38bdf8
CONSTRUCT: Response Cache
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Cache Key Pattern**: Template for generating cache keys from request parameters: '{method}:{path}:{hash(body)}'.
  - **TTL (seconds)**: Time-to-live before a cached response expires and must be re-fetched. Balances freshness vs performance.
  - **Hit Rate (%)**: Percentage of requests served from cache vs origin. The key performance indicator for caching effectiveness.
  - **Eviction Policy**: Algorithm for removing cached entries when cache is full: LRU, LFU, random, or size-based.

VISUAL GUIDANCE:
- Title: "Response Cache" in large text, colored #38bdf8
- Layer badge: "L3 . Capabilities" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #38bdf8 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 52. L3 | Browser Session (4 primitives)

```
Create an infographic for the "Browser Session" construct from the {a}OS reference model.

LAYER: L3 - Capabilities
ACCENT COLOR: #38bdf8
CONSTRUCT: Browser Session
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Browser Type**: The browser engine used: Chromium, Firefox, or WebKit. Affects rendering and JavaScript behavior.
  - **Viewport Size**: Browser window dimensions (width × height in pixels). Affects layout, responsive behavior, and screenshots.
  - **Cookie Jar**: The session's cookie storage: authentication cookies, consent states, preferences. Persists across page navigations.
  - **Proxy Config**: HTTP proxy settings for routing browser traffic through an intermediary (for testing, monitoring, or geo-spoofing).

VISUAL GUIDANCE:
- Title: "Browser Session" in large text, colored #38bdf8
- Layer badge: "L3 . Capabilities" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #38bdf8 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 53. L3 | Page Action (4 primitives)

```
Create an infographic for the "Page Action" construct from the {a}OS reference model.

LAYER: L3 - Capabilities
ACCENT COLOR: #38bdf8
CONSTRUCT: Page Action
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Action Type**: The browser action to perform: click, fill, select, scroll, navigate, wait, hover, drag.
  - **Target Selector**: CSS or XPath selector, or accessibility role/label identifying the target element for the action.
  - **Input Value**: The data to enter for fill/type actions: text, numbers, file paths. Can include special keys (Enter, Tab).
  - **Wait Condition**: What to wait for before proceeding: element visible, network idle, navigation complete, or custom predicate.

VISUAL GUIDANCE:
- Title: "Page Action" in large text, colored #38bdf8
- Layer badge: "L3 . Capabilities" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #38bdf8 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 54. L3 | Element Selector (4 primitives)

```
Create an infographic for the "Element Selector" construct from the {a}OS reference model.

LAYER: L3 - Capabilities
ACCENT COLOR: #38bdf8
CONSTRUCT: Element Selector
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Selector Type**: The strategy for locating elements: CSS, XPath, role, text, test-id, or accessibility label.
  - **Selector Value**: The actual selector string: 'data-testid=submit-btn', 'role=button[name=Submit]', '#main > .form button'.
  - **Fallback Selector**: Alternative selector to try if the primary fails. Provides resilience against minor DOM changes.
  - **Visibility Check**: Whether the element must be visible (not just present in DOM) before interaction. Prevents clicking hidden elements.

VISUAL GUIDANCE:
- Title: "Element Selector" in large text, colored #38bdf8
- Layer badge: "L3 . Capabilities" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #38bdf8 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 55. L3 | Screenshot Capture (4 primitives)

```
Create an infographic for the "Screenshot Capture" construct from the {a}OS reference model.

LAYER: L3 - Capabilities
ACCENT COLOR: #38bdf8
CONSTRUCT: Screenshot Capture
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Capture Format**: Image format for screenshots: PNG (lossless), JPEG (smaller), or WebP (best compression).
  - **Viewport Clip**: Rectangular area to capture: {x, y, width, height}. Enables focused screenshots of specific page regions.
  - **Full Page Flag**: Whether to capture the entire scrollable page or just the visible viewport. True captures below the fold.
  - **Storage Path**: File system path or URL where the screenshot is saved for later comparison or review.

VISUAL GUIDANCE:
- Title: "Screenshot Capture" in large text, colored #38bdf8
- Layer badge: "L3 . Capabilities" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #38bdf8 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 56. L3 | File Handle (4 primitives)

```
Create an infographic for the "File Handle" construct from the {a}OS reference model.

LAYER: L3 - Capabilities
ACCENT COLOR: #38bdf8
CONSTRUCT: File Handle
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **File Path**: Absolute or relative path to the file being accessed. The address of the file in the filesystem.
  - **Open Mode**: File access mode: read (r), write (w), append (a), read-write (r+). Determines permissions and behavior.
  - **Encoding Type**: Character encoding for text files: UTF-8 (default), ASCII, Latin-1, or binary mode.
  - **Current Position**: Byte offset of the read/write cursor in the file. Enables seeking, resuming, and partial reads.

VISUAL GUIDANCE:
- Title: "File Handle" in large text, colored #38bdf8
- Layer badge: "L3 . Capabilities" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #38bdf8 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 57. L3 | Shell Command (4 primitives)

```
Create an infographic for the "Shell Command" construct from the {a}OS reference model.

LAYER: L3 - Capabilities
ACCENT COLOR: #38bdf8
CONSTRUCT: Shell Command
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Command String**: The shell command to execute. Must be sanitized to prevent command injection attacks.
  - **Working Directory**: The directory context (cwd) for command execution. Affects relative path resolution and file access.
  - **Environment Variables**: Key-value pairs passed to the subprocess environment. Used for configuration, secrets, and feature flags.
  - **Timeout (sec)**: Maximum execution time before the subprocess is killed. Prevents hanging commands from blocking the pipeline.

VISUAL GUIDANCE:
- Title: "Shell Command" in large text, colored #38bdf8
- Layer badge: "L3 . Capabilities" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #38bdf8 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 58. L3 | Directory Walker (4 primitives)

```
Create an infographic for the "Directory Walker" construct from the {a}OS reference model.

LAYER: L3 - Capabilities
ACCENT COLOR: #38bdf8
CONSTRUCT: Directory Walker
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Root Path**: The starting directory for the file tree traversal. All paths are discovered relative to this root.
  - **Glob Pattern**: File matching pattern using wildcards: '**/*.py' (all Python files), '*.md' (Markdown in current dir).
  - **Max Depth**: Maximum directory nesting depth to traverse. Prevents explosion in deeply nested or infinite trees.
  - **Ignore Rules**: Patterns to exclude from traversal: .gitignore rules, node_modules, __pycache__, .git directories.

VISUAL GUIDANCE:
- Title: "Directory Walker" in large text, colored #38bdf8
- Layer badge: "L3 . Capabilities" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #38bdf8 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 59. L3 | Permission Check (4 primitives)

```
Create an infographic for the "Permission Check" construct from the {a}OS reference model.

LAYER: L3 - Capabilities
ACCENT COLOR: #38bdf8
CONSTRUCT: Permission Check
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Target Path**: The filesystem path being checked for permissions. Can be a file or directory.
  - **Required Permissions**: The access level needed: read (r), write (w), execute (x), or combinations. Set per-operation.
  - **Effective Permissions**: The actual permissions the current process has on the target, after evaluating user, group, and ACL rules.
  - **Owner UID**: The user ID of the file/directory owner. Determines who has owner-level permissions.

VISUAL GUIDANCE:
- Title: "Permission Check" in large text, colored #38bdf8
- Layer badge: "L3 . Capabilities" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #38bdf8 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 60. L3 | Message Topic (4 primitives)

```
Create an infographic for the "Message Topic" construct from the {a}OS reference model.

LAYER: L3 - Capabilities
ACCENT COLOR: #38bdf8
CONSTRUCT: Message Topic
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Topic Name**: The named channel for publishing/subscribing messages: 'agent.events', 'tool.results', 'session.logs'.
  - **Partition Count**: Number of parallel partitions for the topic. Determines maximum consumer parallelism and ordering guarantees.
  - **Retention (hours)**: How long messages are kept on the topic before deletion. Enables replay and late consumer catching up.
  - **Schema Reference**: Reference to the message schema (JSON Schema, Avro, Protobuf) that validates payloads on this topic.

VISUAL GUIDANCE:
- Title: "Message Topic" in large text, colored #38bdf8
- Layer badge: "L3 . Capabilities" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #38bdf8 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 61. L3 | Event Subscriber (4 primitives)

```
Create an infographic for the "Event Subscriber" construct from the {a}OS reference model.

LAYER: L3 - Capabilities
ACCENT COLOR: #38bdf8
CONSTRUCT: Event Subscriber
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **Subscriber ID**: Unique identifier for a message consumer. Enables offset tracking, delivery guarantees, and load balancing.
  - **Topic Reference**: The topic(s) this subscriber is consuming from. One subscriber can listen to multiple topics.
  - **Filter Expression**: Server-side filter that selects which messages to deliver based on attributes (e.g., 'severity >= ERROR').
  - **Handler Function**: The callback function invoked for each received message. Must be idempotent for at-least-once delivery.

VISUAL GUIDANCE:
- Title: "Event Subscriber" in large text, colored #38bdf8
- Layer badge: "L3 . Capabilities" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #38bdf8 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 62. L3 | Dead Letter Queue (4 primitives)

```
Create an infographic for the "Dead Letter Queue" construct from the {a}OS reference model.

LAYER: L3 - Capabilities
ACCENT COLOR: #38bdf8
CONSTRUCT: Dead Letter Queue
PRIMITIVE COUNT: 4

PRIMITIVES (show each as a card/node):
  - **DLQ Name**: Name of the dead letter queue that receives messages that failed processing after max retries.
  - **Max Retries**: Maximum processing attempts before a message is moved to the dead letter queue.
  - **Failed Message Count**: Number of messages currently in the DLQ awaiting manual review or automated reprocessing.
  - **Replay Policy**: Strategy for reprocessing DLQ messages: manual review, automated replay, or discard after investigation.

VISUAL GUIDANCE:
- Title: "Dead Letter Queue" in large text, colored #38bdf8
- Layer badge: "L3 . Capabilities" top-left
- Show all 4 primitives as connected cards on dark (#0a0a0f) background
- Use #38bdf8 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 63. L3 | Delivery Guarantee (52 primitives)

```
Create an infographic for the "Delivery Guarantee" construct from the {a}OS reference model.

LAYER: L3 - Capabilities
ACCENT COLOR: #38bdf8
CONSTRUCT: Delivery Guarantee
PRIMITIVE COUNT: 52

PRIMITIVES (show each as a card/node):
  - **Guarantee Level**: The delivery semantics: at-most-once, at-least-once, or exactly-once. Each has different trade-offs.
  - **ACK Mode**: When the consumer acknowledges message receipt: auto-ACK (before processing) or manual ACK (after processing).
  - **Dedup Window**: Time period during which duplicate message IDs are detected and filtered. Enables exactly-once semantics.
  - **Idempotency Key**: Unique key per message enabling deduplication: if same key is processed twice, the second is a no-op.
  - **Card ID**: Immutable identifier (Namespace/Family/Params/Quant/Hash) that uniquely identifies a model version and prevents behavioral drift.
  - **Model Family**: Architectural lineage (GPT, Llama, Mistral, Gemma…) determining Jinja2 chat templates and prompting strategy.
  - **Capability Tags**: Boolean/categorical tags (vision, tool_calling, code, math) used by orchestrators for agent routing.
  - **License Type**: Enforces commercial and training compliance (Apache 2.0, MIT, Llama Community, etc.).
  - **Endpoint URL**: Abstract URI managed by service mesh for routing inference requests. RTT latency target: &lt;20ms.
  - **Model Version**: Tracks weight + engine + prompt template combinations. Deployed via canary rollouts.
  - **Throughput TPS**: Primary velocity metric: tokens per second. Single user: 15–150 TPS; max batch: 400–5,000 TPS. TPOT target: &lt;50ms.
  - **Fallback Endpoint**: Redundancy routing when primary endpoint fails. Failover latency target: &lt;100ms with &gt;99% success rate.
  - **Max Tokens**: Hard hardware/software limit on total input+output tokens. Standard: 128K; long-context: 1M–10M. KV cache: 0.5–2GB VRAM/1K tokens.
  - **Effective Tokens**: Actual sequence length before 'Context Rot' — where recall accuracy degrades below useful thresholds. Target recall: &gt;95%.
  - **Window Strategy**: Memory management approach. PagedAttention with O(N) logical memory is the gold standard for multi-agent prefix sharing.
  - **Overflow Policy**: Rules for exceeding the context window limit: Truncate, Error, or Summarize. Requires system-prompt pinning to avoid agent memory loss.
  - **Vocab Size**: Total unique tokens in the vocabulary. Modern models: 100K–150K tokens. Compression ratio target: 0.7–0.8 tokens/word.
  - **Encoding Scheme**: Tokenization algorithm — usually Byte-level BPE to prevent Out of Vocabulary (OOV) errors.
  - **Special Tokens**: Control signals (&lt;tool_call&gt;, &lt;|im_start|&gt;, &lt;eos&gt;) that trigger specific model behaviors.
  - **Token Budget**: Runtime caps to prevent runaway loops. Recommended: 10,000 tokens per tool loop; 100,000 per session.
  - **Server Framework**: Serving engine — vLLM for high throughput (256+ sequences) or SGLang for agentic prefix-sharing (512+ sequences).
  - **Quantization Level**: Precision reduction — FP8 saves 50% VRAM (&lt;0.01% perplexity impact); INT4 saves 75% (&lt;1% impact).
  - **KV Cache Size**: Memory for key-value attention cache. Target utilization: 80–95% of allocated blocks (1,000–10,000 blocks).
  - **Concurrent Slots**: Max simultaneous requests. Target: 64–256 slots with 70–90% occupancy.
  - **GPU Type**: Hardware SKU — H100 (80GB VRAM, 3.35 TB/s) for frontier; L40S (48GB, 0.86 TB/s) for smaller tasks. Memory bandwidth is the bottleneck.
  - **Pool Size**: Number of GPU instances. Availability target: 99.99%. Requires N+1 redundancy across ≥2 availability zones.
  - **Utilization Percent**: GPU resource usage — Core target: 75%; Memory target: 90%; Power target: 80%. ⚠️ Never scale based on VRAM% (pre-allocated at boot).
  - **Scheduling Algorithm**: Request routing strategy. Prefix-Aware (Radix) scheduling reduces Time to First Token by 40–60% via KV cache hits.
  - **Batch Size**: Dynamic batching range: 1–256. Each additional request adds ~5ms TPOT latency penalty.
  - **Queue Depth**: Leading indicator of latency. Target wait: &lt;50ms. Autoscaling threshold: 3–10 requests waiting.
  - **Drain Timeout**: Wait time before node shutdown. Recommended: 300 seconds for &gt;99.9% clean exit rate.
  - **Priority Lanes**: QoS segmentation — Platinum: 90% capacity, Gold: 10%, Background: slack only during peak.
  - **Scale Metric**: Primary trigger: Queue Size (&gt;5 req/GPU). Secondary: P95 TTFT (&gt;500ms). ⚠️ Never use VRAM utilization.
  - **Cooldown Seconds**: Asymmetric: scale-up 0s (immediate), scale-down 600s (prevent model-load thrashing). Model load takes 30s–5min.
  - **Min Replicas**: Production floor: 2–4 replicas. Dev floor: 0 (scale-to-zero). Warm replicas avoid 30s–5min cold starts.
  - **Max Replicas**: Hard financial ceiling mapped to cloud quotas. Range: 32–128 GPUs. ⚠️ Never deploy without this circuit breaker.
  - **Run ID**: Unique experiment identifier for 100% traceability to Git commits. Format: timestamp-gitsha-name-suffix.
  - **Base Model**: Foundation model being fine-tuned. Target Model Flops Utilization (MFU): 40–55%.
  - **Hyperparams**: Training config — LR: 5×10⁻⁵, batch: 32–128, epochs: 1–3. Use cosine decay with warm-up.
  - **Checkpoint Interval**: Save frequency — pausing 60s–600s per snapshot (15–300GB). Recommended: every 500–2,000 steps.
  - **Dataset URI**: Training data location. Load bandwidth &gt;1 GB/s using binary formats (Parquet/Arrow).
  - **Split Ratio**: Standard: 90% Train / 5% Validation / 5% Test. Test set MUST be fully decontaminated.
  - **Preprocessing Pipeline**: Dedup (1M rows/hr) → PII scrub (500K rows/hr) → quality filter → pre-tokenize (10M tokens/sec).
  - **Quality Score**: AI judge discards examples scoring &lt;4.0/5. Target perplexity on clean data: &lt;15.
  - **Adapter Rank**: LoRA rank — r=8–16 for style (~10M params, &lt;100MB); r=64–128 for knowledge (~80M params, ~500MB VRAM).
  - **Target Modules**: Which layers get LoRA adapters. 'All Linear Layers' retains 95% of full fine-tune performance.
  - **Merge Strategy**: Combining adapter weights — Merge/Unload (permanent, fastest) or TIES-Merging (multi-adapter, sign-aware).
  - **Adapter Registry**: Centralized catalog of 1,000+ adapters with hot-swap latency &lt;200ms.
  - **Reward Model**: Neural network scoring outputs. Target accuracy: 70–80%. Calibration error &lt;0.05.
  - **Preference Dataset**: A/B comparison pairs: 20,000–100,000 with rater agreement &gt;0.85.
  - **PPO Config**: Proximal Policy Optimization — KL Coefficient 0.1, LR 1×10⁻⁶, Rollout size 1024.
  - **Alignment Score**: Overall quality — Target Elo: 1,250+, refusal rate &lt;2%, jailbreak rate &lt;0.1%.

VISUAL GUIDANCE:
- Title: "Delivery Guarantee" in large text, colored #38bdf8
- Layer badge: "L3 . Capabilities" top-left
- Show all 52 primitives as connected cards on dark (#0a0a0f) background
- Use #38bdf8 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 64. L4 | Test Gate (10 primitives)

```
Create an infographic for the "Test Gate" construct from the {a}OS reference model.

LAYER: L4 - Orchestration
ACCENT COLOR: #34d399
CONSTRUCT: Test Gate
PRIMITIVE COUNT: 10

PRIMITIVES (show each as a card/node):
  - **Test Case ID**: Unique identifier for the test case being evaluated at this gate. Links pass/fail status to a specific test definition.
  - **Test Name**: Human-readable label for the test case. Used in gate reports, CI dashboards, and failure notifications.
  - **Pass/Fail Bool**: Binary gate result: true = pass (proceed), false = fail (block). The atomic decision of the quality checkpoint.
  - **Coverage %**: Code or branch coverage percentage achieved by this test case. Gate blocks forward progress if below the required threshold.
  - **Block Forward Flag**: Explicit signal that a failing gate should halt pipeline progression. When true, no downstream steps execute.
  - **Failure Trace ID**: Reference to the distributed trace or log entry capturing the test failure context for debugging.
  - **Required Fix Note**: Structured remediation note explaining what must change before the gate can pass on the next retry.
  - **Gate Status**: Current lifecycle state of the gate: pending, running, passed, failed, or skipped.
  - **Retry Count**: Number of times this gate has been attempted. Exceeding max retries escalates to human review.
  - **Last Run Timestamp**: ISO 8601 timestamp of the most recent gate execution. Stale timestamps indicate a gate that has not been re-evaluated.

VISUAL GUIDANCE:
- Title: "Test Gate" in large text, colored #34d399
- Layer badge: "L4 . Orchestration" top-left
- Show all 10 primitives as connected cards on dark (#0a0a0f) background
- Use #34d399 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

## 65. L4 | TDD Workflow Path (10 primitives)

```
Create an infographic for the "TDD Workflow Path" construct from the {a}OS reference model.

LAYER: L4 - Orchestration
ACCENT COLOR: #34d399
CONSTRUCT: TDD Workflow Path
PRIMITIVE COUNT: 10

PRIMITIVES (show each as a card/node):
  - **Spec Seed**: Initial specification or user story that seeds test generation. The source of truth before any code is written.
  - **Test Generated Flag**: Boolean indicating whether test scaffolding has been generated from the spec seed. Red phase starts here.
  - **Implementation Started Flag**: Boolean marking that implementation code has been written against the failing tests. Green phase in progress.
  - **Failing Test Count**: Number of test cases currently failing. Should trend to zero as implementation progresses toward green phase.
  - **Passing Test Count**: Number of test cases currently passing. Full passing count unlocks the refactor phase.
  - **Checkpoint Status**: Current TDD phase: red (tests written), green (tests passing), or refactor (code cleaned). Gates enforce phase ordering.
  - **Proceed Permission**: Authorization signal (human or automated) allowing the workflow to advance to the next TDD phase.
  - **Rollback Flag**: When set, reverts implementation changes to the last known green state. Triggered by regression or failed refactor.
  - **Review Required Flag**: Signals that human code review is required before the final gate can be approved and the path marked complete.
  - **Final Gate Status**: Terminal state of the TDD workflow path: approved, rejected, or pending-review. Controls downstream deployment eligibility.

VISUAL GUIDANCE:
- Title: "TDD Workflow Path" in large text, colored #34d399
- Layer badge: "L4 . Orchestration" top-left
- Show all 10 primitives as connected cards on dark (#0a0a0f) background
- Use #34d399 accent for borders, connectors, and highlights
- Each card: primitive name (bold) + 1-line description (smaller)
- If primitives have a natural flow or hierarchy, show it with arrows
- Keep it clean, scannable, ADHD-friendly - no walls of text
```

---

