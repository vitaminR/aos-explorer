---
title: Master Source Intelligence Library
type: product-intel-reference
updated: 2026-05-03
maintainer: nymil
---

# {a}OS Explorer — Master Source Intelligence Library

This is the full bench of sources used to evaluate and rank agentic AI products.
The `sources.md` file holds the curated active shortlist (Tier 1–3 for daily/weekly use).
This file is the reference library — add new sources here first, then promote to `sources.md` if they clear the bar.

**Reranking SOP**: Each source has a `reliability` score (1–5) and `last_checked` date. When doing a rerank run:
1. Pull the top 3 pro and top 3 con from this library for each product
2. Check if any sources are >90 days stale — flag for re-verification
3. Update `PRODUCT_SCORING[productId].sources` in `index.html`
4. You do NOT need to re-research sources — just re-sort by `reliability` and recency

---

## Tier A — Prominent Bench (curated, high signal)

These are the sources that appear in the product detail panel. Rotate based on recency and reliability.

| # | Name | URL | Type | Reliability (1–5) | Cadence | Last Checked |
|---|---|---|---|---|---|---|
| A1 | GitHub Stars / Trending (Python) | https://github.com/trending/python?since=daily | Community adoption | 5 | Daily | 2026-05-03 |
| A2 | HuggingFace Blog | https://huggingface.co/blog | OSS / model drops | 5 | Weekly | 2026-05-03 |
| A3 | StackOne AI Tools Landscape 2026 | https://www.stackone.com/blog/ai-agent-tools-landscape-2026/ | Landscape map | 4 | Monthly | 2026-05-03 |
| A4 | morphLLM Framework Tracker | https://www.morphllm.com/ai-agent-framework | Framework comparison | 4 | Monthly | 2026-05-03 |
| A5 | Google ADK Docs | https://google.github.io/adk-docs/ | Official SDK docs | 5 | On release | 2026-05-03 |
| A6 | TheNextWeb — AI Agents | https://thenextweb.com/news/google-cloud-next-ai-agents-agentic-era | Platform news | 4 | On publish | 2026-05-03 |
| A7 | Gartner Hype Cycle — Agentic AI | https://www.gartner.com/en/articles/hype-cycle-for-agentic-ai | Enterprise maturity | 4 | Annual | 2026-05-03 |
| A8 | Awesome AI Agents 2026 (GitHub) | https://github.com/caramaschiHG/awesome-ai-agents-2026 | Community curation | 4 | Monthly | 2026-05-03 |
| A9 | VentureBeat AI | https://venturebeat.com/category/ai/ | Enterprise coverage | 3 | Daily | 2026-05-03 |
| A10 | Product Hunt — AI Agents | https://www.producthunt.com/categories/ai-agents | Launch signals | 4 | Daily | 2026-05-03 |

---

## Tier B — Background Bench (large; use for specific product research)

Do not rotate these into product panels without checking recency first. Primary value: covering niche or vertical-specific tools.

| # | Name | URL | Type | Reliability | Cadence | Last Checked |
|---|---|---|---|---|---|---|
| B1 | AI Agent Store — This Week | https://aiagentstore.ai/ai-agent-news/this-week | Launch digest | 3 | Weekly | 2026-05-03 |
| B2 | The Agentic List 2026 | https://www.agentconference.com/agenticlist/2026 | Top 120 companies | 4 | Monthly | 2026-05-03 |
| B3 | The Rundown AI | https://www.therundown.ai | Daily digest | 3 | Daily | 2026-05-03 |
| B4 | ByteByteGo Newsletter | https://blog.bytebytego.com | Technical trends | 3 | Weekly | 2026-05-03 |
| B5 | Product Hunt — AI Coding Agents | https://www.producthunt.com/categories/ai-coding-agents | Coding tool launches | 4 | Daily | 2026-05-03 |
| B6 | Crescendo AI News | https://www.crescendo.ai/news/latest-ai-news-and-updates | Model breakthroughs | 3 | Daily | 2026-05-03 |
| B7 | Coruzant — Agentic AI News | https://coruzant.com/news/top-10-news-sites-for-agentic-ai-news-in-2026/ | Industry sources | 3 | Weekly | 2026-05-03 |
| B8 | GitHub — agno-agi/agno | https://github.com/agno-agi/agno | Repo signal | 5 | On commit | 2026-05-03 |
| B9 | GitHub — huggingface/smolagents | https://github.com/huggingface/smolagents | Repo signal | 5 | On commit | 2026-05-03 |
| B10 | GitHub — langchain-ai/langgraph | https://github.com/langchain-ai/langgraph | Repo signal | 5 | On commit | 2026-05-03 |
| B11 | GitHub — crewAIInc/crewAI | https://github.com/crewAIInc/crewAI | Repo signal | 5 | On commit | 2026-05-03 |
| B12 | GitHub — microsoft/semantic-kernel | https://github.com/microsoft/semantic-kernel | Repo signal | 5 | On commit | 2026-05-03 |
| B13 | GitHub — google/adk-python | https://github.com/google/adk-python | Repo signal | 5 | On commit | 2026-05-03 |
| B14 | GitHub — openai/openai-agents-python | https://github.com/openai/openai-agents-python | Repo signal | 5 | On commit | 2026-05-03 |
| B15 | fazm.ai — Open Source AI Projects | https://fazm.ai/blog/new-open-source-ai-projects-github-hugging-face-april-2026 | OSS tracking | 3 | Monthly | 2026-05-03 |
| B16 | HuggingFace AI Trends 2026 | https://huggingface.co/blog/aufklarer/ai-trends-2026-test-time-reasoning-reflective-agen | HF trends | 4 | Periodic | 2026-05-03 |
| B17 | LangSmith Docs | https://docs.smith.langchain.com | Product docs | 5 | On release | — |
| B18 | Langfuse Docs | https://langfuse.com/docs | Product docs | 5 | On release | — |
| B19 | Arize Phoenix GitHub | https://github.com/Arize-ai/phoenix | Repo signal | 4 | On commit | — |
| B20 | Helicone Docs | https://www.helicone.ai/docs | Product docs | 4 | On release | — |
| B21 | W&B Weave Docs | https://wandb.ai/site/weave | Product docs | 4 | On release | — |
| B22 | SiliconAngle AI Coverage | https://siliconangle.com/category/artificial-intelligence/ | Enterprise news | 3 | Daily | 2026-05-03 |
| B23 | A2A Protocol Docs | https://google.github.io/adk-docs/a2a/ | Protocol spec | 5 | On update | 2026-05-03 |
| B24 | MCP Docs | https://modelcontextprotocol.io | Protocol spec | 5 | On update | 2026-05-03 |
| B25 | Devin Docs (Cognition AI) | https://cognition.ai | Product docs | 4 | On release | — |

---

## Tier C — Specialist / Niche (use only for specific strata or verticals)

| # | Name | URL | Coverage | Reliability | Last Checked |
|---|---|---|---|---|---|
| C1 | OpenHands GitHub (AllHands-AI) | https://github.com/All-Hands-AI/OpenHands | L3 coding agents | 5 | — |
| C2 | SWE-Bench Leaderboard | https://www.swebench.com | L3 benchmark | 5 | — |
| C3 | LMSYS Chatbot Arena | https://chat.lmsys.org | L1 model eval | 5 | — |
| C4 | OpenLLM Leaderboard (HuggingFace) | https://huggingface.co/spaces/HuggingFaceH4/open_llm_leaderboard | L1 model bench | 5 | — |
| C5 | AgentBench Leaderboard | https://llmbench.ai/agentbench | L3/L4 agent eval | 4 | — |
| C6 | LlamaIndex Blog | https://www.llamaindex.ai/blog | L2 knowledge | 4 | — |
| C7 | Weaviate Blog | https://weaviate.io/blog | L2 vector DB | 4 | — |
| C8 | Pinecone Blog | https://www.pinecone.io/blog | L2 vector DB | 4 | — |
| C9 | LangChain Blog | https://blog.langchain.dev | L4 orchestration | 4 | — |
| C10 | CrewAI Blog | https://blog.crewai.com | L4 orchestration | 4 | — |

---

## Source Reranking SOP

### When to rerank
- Monthly: full pass across all Tier A sources
- On new product add: pick 3 pro + 3 con from Tier A/B that are most relevant
- On stale flag (>90 days): re-verify the specific source, update `last_checked`

### How to pick pro vs con for a product
- **Pro**: Source explicitly recommends, benchmarks favorably, high star count, or uses the product as reference architecture
- **Con**: Source omits when it should mention, notes lock-in/limitations, lower community adoption vs comparable peers, or enterprise analysts don't cite it
- **Neutral**: Background bench only — don't add neutral sources to the product panel (adds noise)

### Update process (no re-research needed)
1. Open `index.html`, search for `productId:` in `PRODUCT_SCORING`
2. Replace the `sources: [...]` array with updated entries from this library
3. Validate JS syntax via `node -e "new Function(scriptContent)"` 
4. Deploy via `/firePush`

---

## Run Log

| Date | Runner | Type | Output |
|---|---|---|---|
| 2026-05-03 | Claude Sonnet 4.6 | Hot Products Run | [run-2026-05-03.md](run-2026-05-03.md) |
