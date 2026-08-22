# Stratum 0 Easter Egg Documentation

## Overview

The {a}OS Explorer now includes a hidden **Stratum 0: Meta/Sovereignty** stratum that reveals core agentic concepts when triggered via search.

## Trigger Words

Search for any of these terms to unlock Stratum 0:

- `stratum 0`
- `stratum 0`
- `sovereignty`

## What Gets Revealed

When Stratum 0 is triggered:

1. **S0 Stratum Card** appears in the main stack (platinum/silver color, dashed border)
2. **Auto-expands** to show 5 meta-concepts:
   - **Harness** — assembled agent bundle: model + tools + memory + orchestration + policy
   - **Persona** — agent identity, voice, role, and behavioral directives
   - **Stack** — complete 7-stratum configuration for a domain
   - **Pattern** — repeatable orchestration choreographies (ReAct, CoT, etc.)
   - **Covenant** — formal pledge of capabilities, performance, and safety guarantees

3. All 5 concepts are tagged with aliases including the trigger words (`stratum 0`, `stratum 0`, `sovereignty`)

## Implementation Details

### Data Stratum (concepts.json)

- New concepts added: `stack`, `persona`, `pattern`, `config`, `covenant`
- All marked with `"strata": ["S0"]` and `"hidden": true`, `"easterEgg": true`
- Aliases include trigger words at concept level for search matching

### UI Stratum (explorer.html)

- S0 stratum card added to HTML (before S7) with `display: none` by default
- Styled with platinum color (`#9ca3af`) and dashed border to indicate "secret"
- Contains 5 construct chips representing the meta-concepts

### Logic Stratum (explorer.html)

- Easter egg trigger logic in `applySearchAndFilters()`
- Detects any of the 3 trigger phrases in search input
- Shows/hides S0 card and auto-expands on match
- Highlights with `.search-hit` styling when triggered

## Search Example

**Before search:** S0 is invisible

```
User types: "stratum 0"
```

**After search:**

- S0 card appears in the stack view
- Card automatically expands
- Concept matches show the 5 meta-concepts
- Search suggestion panel guides to Stratum 0 constructs

## Color Scheme

- **S0 color:** `#9ca3af` (platinum/gray)
- **S0 glow:** `rgba(156, 163, 175, 0.12)`
- **Visual indicator:** Dashed border + 🔓 emoji in stratum number

## The Agentic Org Chart Lives at Stratum 0

Stratum 0 is where organizational structure in agentic systems becomes visible. The five meta-concepts map directly to the roles that emerge in any mature multi-agent system:

| S0 Concept | What it governs | Org chart alignment |
|---|---|---|
| **Persona** | Agent identity, voice, role, behavioral directives | The individual in a role — CEO, COO, department head |
| **Covenant** | Formal pledge of capabilities, performance, safety guarantees | The job description and accountability contract |
| **Harness** | Assembled agent bundle: model + tools + memory + orchestration + policy | The full resource package a role operates with |
| **Stack** | Complete 7-stratum configuration for a domain | The department's full operational footprint |
| **Pattern** | Repeatable orchestration choreographies | Standard operating procedures |

When you see a CEO-equivalent agent (strategic stratum, S7), it is a **Persona** with a **Covenant** that routes intent. When you see a COO-equivalent (operational stratum, S6), it is a **Persona** with a **Harness** that governs infrastructure. The org chart is not a metaphor — it is a direct consequence of how Stratum 0 concepts compose.

> A multi-agent system without a sovereign Persona at S7 is a set of departments with no CEO. It will produce work. It will not produce alignment.

**See also:** [Agentic Org Chart — docs/agentic-org-chart.md](docs/agentic-org-chart.md)

---

## Future Enhancements

- Add more easter egg modes (e.g., "hidden", "debug", "omniscient")
- Create S0-specific product mappings for meta-tools (APScheduler, Supervisor, etc.)
- Add animation on Stratum 0 reveal (shimmer, pulse, unlock sound)
- Create "Sovereignty" axis band for S0
- Add "Orchestrator hierarchy" as an S0 concept — the organizational pattern itself as a classifiable meta-primitive
