# {a}OS Explorer

**The OSI model for AI** — a vendor-neutral 7-layer reference taxonomy for agentic AI systems.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![Products Mapped](https://img.shields.io/badge/products%20mapped-40%2B-orange)
![Strata](https://img.shields.io/badge/strata-7-blueviolet)
![Zero Dependencies](https://img.shields.io/badge/dependencies-zero-brightgreen)

<p align="center">
  <img src="docs/assets/aos-explorer-preview.png" alt="{a}OS Explorer" width="800" />
</p>

## What is this?

The AI ecosystem has 500+ products competing across overlapping domains. **{a}OS Explorer** gives you a shared vocabulary to cut through the noise:

- **7 Strata** — from L1 Models & Infrastructure to L7 Experience & Intent
- **Top 40+ products** mapped across the full stack — frameworks, agents, MCPs, platforms
- **Side-by-side comparison** with gap analysis — see what's covered and what's missing
- **Golden Path builds** — curated best-in-class stacks for common use cases
- **Confidence scoring** — every mapping is scored and dated, not just claimed

> Think of it as: **if the OSI model existed for the agentic AI era, this is what it would look like.**

## The 7-Stratum Model

| Stratum | Name | What lives here |
|:-------:|------|----------------|
| **L7** | Experience & Intent | Chat UIs, IDE extensions, voice interfaces, intent routing |
| **L6** | Governance & Trust | Policy enforcement, compliance, audit trails, guardrails |
| **L5** | Observability & Evaluation | Tracing, evals, cost metering, drift detection |
| **L4** | Orchestration & Decisioning | Agent loops, DAGs, routers, planning, human-in-the-loop |
| **L3** | Execution & Interfaces | Tool calling, code interpreters, API connectors, MCPs |
| **L2** | Knowledge & Memory | RAG, vector stores, context management, long-term memory |
| **L1** | Models & Infrastructure | LLMs, embeddings, fine-tuning, serving, compute |

## Quick Start

No build step. No dependencies. Just open the file:

```bash
# Clone and open
git clone https://github.com/vitaminR/aos-explorer.git
cd aos-explorer
open index.html    # macOS
start index.html   # Windows
xdg-open index.html # Linux
```

Or visit the **[Live Explorer](https://vitaminr.github.io/aos-explorer/)** (GitHub Pages — coming soon).

## Features

- **Zero dependencies** — single HTML file, pure vanilla JS/CSS
- **Cascading filters** — filter by stratum, substrate, construct, axis, deployment type
- **Product lens** — click any product to see its full stack coverage
- **Compare mode** — add up to 4 products, get a gap analysis matrix
- **Golden Path builds** — curated stacks for agentic coding, RAG pipelines, and more
- **Deep linking** — share any filtered view via URL
- **Keyboard navigation** — j/k to browse, / to search, ? for shortcuts
- **Print-friendly** — clean reference output for architecture reviews
- **Confidence scores** — every product mapping includes a confidence rating and assessment date

## Who is this for?

| Role | How you'll use it |
|------|------------------|
| **AI Architects** | Map your stack, find gaps, compare alternatives |
| **Engineering Leaders** | Evaluate vendors against a shared framework |
| **DevRel / Product** | Understand where your product sits in the ecosystem |
| **Students / Career Changers** | Learn the full AI stack, not just the model layer |
| **IT Professionals** | Translate AI hype into architectural decisions |

## Contributing

The taxonomy is community-driven. Here's how to help:

- **Add a product** — [Open an issue](https://github.com/vitaminR/aos-explorer/issues/new?template=product-suggestion.md) with the product name and where you think it maps
- **Correct a mapping** — [Open an issue](https://github.com/vitaminR/aos-explorer/issues/new?template=mapping-correction.md) if a product is miscategorized
- **Suggest a stratum change** — major taxonomy changes go through [Discussions](https://github.com/vitaminR/aos-explorer/discussions)

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## The {a}OS Reference Model

{a}OS (Agentic Operating System) is a vendor-neutral reference model for classifying AI systems. It was created to solve a simple problem: **there was no shared vocabulary for talking about where AI products actually fit in the stack.**

The OSI model gave networking a common language. {a}OS does the same for agentic AI.

- **Stratum** — a horizontal layer (like an OSI layer)
- **Substrate** — a capability group within a stratum (like a protocol family)
- **Construct** — a specific artifact or pattern (like a protocol)
- **Primitive** — an atomic building block (like a packet field)

## Roadmap

- [x] 7-stratum model with 40+ products
- [x] Side-by-side comparison with gap analysis
- [x] Golden Path curated builds
- [x] Confidence scoring
- [ ] GitHub Pages deployment
- [ ] Community-submitted product mappings via PR
- [ ] API for programmatic taxonomy access
- [ ] Vendor-verified badges
- [ ] Embeddable stratum widget for product READMEs

## Related

- [{a}OS Documentation](docs.html) — full reference for the 7-stratum model
- [initiate.work](https://initiate.work) — consulting and advisory for agentic AI architecture

## License

[MIT](LICENSE) — use it, fork it, map your stack.
