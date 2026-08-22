# {a}OS Explorer — Documentation

> The interactive taxonomy and comparison engine for the Agentic Operating System reference model.

---

## What is {a}OS Explorer?

{a}OS Explorer is a web application that lets you browse, compare, and understand AI products, frameworks, agents, workflows, and skills through the lens of a structured 7-stratum reference model.

Think of it as the **OSI model for the agentic era** — but interactive.

Instead of telling you what a product *claims* to do, {a}OS Explorer shows you:

- **Where it belongs** in the stack
- **What it overlaps** with other products
- **Which primitives and constructs** it actually touches
- **What gaps appear** when you compose systems together

---

## The {a}OS Reference Stack

The stack has **7 strata** (strata), from user-facing intent down to raw model infrastructure:

| Stratum | Name | Boundary Question |
|-------|------|-------------------|
| **S7** | Experience & Intent | What did the human actually want — and did they get it? |
| **S6** | Governance & Trust | Who approved this action and under which policy? |
| **S5** | Observability & Evaluation | How well did this work, and can we prove it? |
| **S4** | Orchestration & Decisioning | What happens next, in what order, with which agent? |
| **S3** | Execution & Interfaces | How does the agent act on the world? |
| **S2** | Knowledge & Memory | What does the system know, and how does it recall? |
| **S1** | Models & Infrastructure | What is the raw intelligence, and where does it run? |

### Cross-cutting Axes

Two axes cut across all strata:

- **Governance & Trust** — policy enforcement, identity, compliance, safety
- **Observability & Evaluation** — tracing, benchmarks, drift detection, SLOs

---

## Core Concepts

### Ontology Hierarchy

Every AI product or tool is classified through a 4-level hierarchy:

- **Stratum**
  - A top-level stratum in the stack
  - Example: `S4 Orchestration`
- **Substrate**
  - Tools, frameworks, or systems operating in that stratum
  - Example: `Workflow Engines`
- **Construct**
  - Meaningful artifacts or states produced by a substrate
  - Example: `execution_plan`, `agent_roster`
- **Primitive**
  - The smallest atomic unit inside a construct
  - Example: `task_id`, `retry_count`

### Multi-Residency Classification

Products can span **multiple strata**. For example, Azure AI Foundry has:

- **Primary stratum**: S1 (Models & Infrastructure)
- **Secondary strata**: S2, S3, S4

Every classification includes a **confidence score** and a **rationale** explaining why the product belongs there.

---

## Entity Types

The explorer supports multiple top-level entity types:

| Type | Description |
|------|-------------|
| **Products** | Commercial or open-source AI tools (Azure AI Foundry, CrewAI, Mem0) |
| **Frameworks** | Reference models and architectural taxonomies ({a}OS, alternative stacks) |
| **Agents** | Autonomous or semi-autonomous AI actors |
| **Workflows** | Orchestrated multi-step processes |
| **Skills** | Reusable capability modules |

---

## Agentic Organizational Patterns

As agentic systems mature, they develop internal structure that aligns with human org charts — not by imitation, but because the same functional requirements produce the same structural solutions.

The {a}OS reference model makes this visible:

| Tier | Human Role | {a}OS Stratum |
|------|-----------|---------------|
| Strategic | CEO — holds the mission, routes intent, coaches | S7 — Experience & Intent |
| Operational | COO — governs infrastructure, registry, memory | S6 — Governance & Trust |
| Domain | Department heads — own and execute within scope | S4 — Orchestration & Decisioning |
| Atomic | Individual contributors | S3 — Execution & Interfaces |

A well-architected agentic system has agents or policies at each tier. Most commercial platforms cover S3–S4. Few address S6–S7.

**[Full guide: Agentic Org Chart →](agentic-org-chart.md)**

---

## Documentation

| Document | Description |
|----------|-------------|
| [Getting Started](getting-started.md) | Setup, running locally, first exploration |
| [Classification Guide](classification-guide.md) | How products are placed into strata |
| [Agentic Org Chart](agentic-org-chart.md) | How multi-agent systems align with human organizational structures |
| [Design System](awesome-design.md) | Colour tokens, components, responsive breakpoints, nav architecture |

---

## How to Use the Explorer

### 1. Browse the Stack

The home screen shows the full 7-stratum stack. Click any stratum to expand it and see its substrates, constructs, and primitives. The UI unfolds in-place — no page navigation required.

### 2. Compare Products

Click the **+** button on any product card to add it to your compare basket (up to 4 items). Then open Compare mode to see a side-by-side breakdown of:

- Stratum coverage heatmap
- Axis roles
- Overlap and gap analysis
- Confidence and rationale

### 3. Filter

Use the left rail to filter by:

- Stratum
- Axis
- Vendor
- Deployment model (Cloud / Local / Hybrid)
- Open Source vs Proprietary
- Maturity level

### 4. Navigate with Keyboard

| Key | Action |
|-----|--------|
| `/` | Focus search bar |
| `1`–`7` | Jump to stratum S1–S7 |
| `↑` `↓` | Navigate between strata |
| `→` | Expand / drill deeper |
| `←` | Collapse / drill up |
| `c` | Toggle compare mode |
| `?` | Show all shortcuts |
| `Esc` | Close / collapse |

---

## Featured Products (MVP)

| Product | Vendor | Primary Stratum | Deployment | License |
|---------|--------|-----------------|------------|---------|
| Azure AI Foundry | Microsoft | S1 Models | Cloud | Proprietary |
| Kotana | Internal | S4 Orchestration | Hybrid | Proprietary |
| Paperclip | Internal | S7 Experience | Local | Proprietary |
| CrewAI | CrewAI Inc | S4 Orchestration | Cloud | Open Source |
| Mem0 | Mem0 AI | S2 Knowledge | Cloud | Open Source |
| LangGraph | LangChain | S4 Orchestration | Hybrid | Open Source |
| Azure AI Search | Microsoft | S2 Knowledge | Cloud | Proprietary |
| Open Policy Agent | CNCF | S6 Governance | Hybrid | Open Source |

---

## Interaction Modes

| Mode | Description |
|------|-------------|
| **Stack Mode** | Classic 7-stratum vertical view |
| **Accordion Mode** | Expand strata into substrate/construct/primitive rows |
| **Compare Mode** | Side-by-side comparison of 2–4 items |
| **Category Mode** | Toggle between Products, Frameworks, Agents, Workflows, Skills |
| **Map Mode** | Multi-stratum span view showing overlaps and coverage |
| **Axis Mode** | Show how Governance and Observability cut across selected items |

---

## Classification Methodology

Every placement in the explorer follows these rules:

1. **Evidence-backed** — Each classification has a rationale and optional source links
2. **Confidence-scored** — High (≥0.85), Medium (0.60–0.84), or Low (<0.60)
3. **Disputable** — If a classification is debatable, alternative interpretations are shown
4. **Multi-placement** — Products are never forced into a single stratum

---

## Architecture

### Data Model

```
Entity ──┬── Placement ──── Evidence
         ├── Capability
         ├── Construct Mapping
         └── Primitive Mapping
```

Each **Entity** (product/framework/agent/workflow/skill) has **Placements** linking it to strata and axes, with associated **Evidence** records for transparency.

---

## FAQ

**Q: Is this a product directory?**
No. It's a classification and comparison engine. Products are mapped to an ontology, not just listed.

**Q: Can I add my own products?**
Not in the MVP. Future phases will support submission pipelines.

**Q: How is {a}OS different from other AI frameworks?**
{a}OS provides 7 distinct strata with explicit boundary questions, multi-residency classification, and cross-cutting axes. Most alternatives collapse these strata into fewer, coarser categories.

**Q: What if I disagree with a classification?**
Every placement shows its confidence score and rationale. Disputed classifications are explicitly marked.

---

## Roadmap

### Current (MVP)

- [x] 7-stratum explorer with drilldown
- [x] 8 product classifications (Azure AI Foundry, Kotana, Paperclip, CrewAI, Mem0, LangGraph, Azure AI Search, Open Policy Agent)
- [x] Compare basket with stratum-coverage heatmap
- [x] Keyboard navigation (number keys, arrows, shortcuts)
- [x] Guided onboarding tour
- [x] Connected search with blank-slate empty state
- [x] Active filtering system (vendor, deployment, license) with blank-slate empty state
- [x] Axis toggle visual effects (Governance, Observability glow)
- [x] Tooltip definitions for vocabulary terms (PRD 6.5.5)
- [x] Progressive disclosure in detail panel (PRD 6.5.6)
- [x] Construct panels on S2, S3, S4, S7

### Next

- [ ] Product and stratum detail pages
- [ ] Framework comparison with translation matrix

### Future

- [ ] Saved comparison sets
- [ ] AI-assisted classification suggestions
- [ ] Team workspaces
- [ ] Public submission pipeline
- [ ] Scenario-based evaluation mode
