# Layer 0 Easter Egg Documentation

## Overview

The {a}OS Explorer now includes a hidden **Layer 0: Meta/Sovereignty** stratum that reveals core agentic concepts when triggered via search.

## Trigger Words

Search for any of these terms to unlock Layer 0:

- `layer 0`
- `stratum 0`
- `sovereignty`

## What Gets Revealed

When Layer 0 is triggered:

1. **L0 Stratum Card** appears in the main stack (platinum/silver color, dashed border)
2. **Auto-expands** to show 5 meta-concepts:
   - **Harness** — assembled agent bundle: model + tools + memory + orchestration + policy
   - **Persona** — agent identity, voice, role, and behavioral directives
   - **Stack** — complete 7-layer configuration for a domain
   - **Pattern** — repeatable orchestration choreographies (ReAct, CoT, etc.)
   - **Covenant** — formal pledge of capabilities, performance, and safety guarantees

3. All 5 concepts are tagged with aliases including the trigger words (`layer 0`, `stratum 0`, `sovereignty`)

## Implementation Details

### Data Layer (concepts.json)

- New concepts added: `stack`, `persona`, `pattern`, `config`, `covenant`
- All marked with `"strata": ["L0"]` and `"hidden": true`, `"easterEgg": true`
- Aliases include trigger words at concept level for search matching

### UI Layer (prototype.html)

- L0 stratum card added to HTML (before L7) with `display: none` by default
- Styled with platinum color (`#9ca3af`) and dashed border to indicate "secret"
- Contains 5 construct chips representing the meta-concepts

### Logic Layer (prototype.html)

- Easter egg trigger logic in `applySearchAndFilters()`
- Detects any of the 3 trigger phrases in search input
- Shows/hides L0 card and auto-expands on match
- Highlights with `.search-hit` styling when triggered

## Search Example

**Before search:** L0 is invisible

```
User types: "layer 0"
```

**After search:**

- L0 card appears in the stack view
- Card automatically expands
- Concept matches show the 5 meta-concepts
- Search suggestion panel guides to Layer 0 constructs

## Color Scheme

- **L0 color:** `#9ca3af` (platinum/gray)
- **L0 glow:** `rgba(156, 163, 175, 0.12)`
- **Visual indicator:** Dashed border + 🔓 emoji in stratum number

## Future Enhancements

- Add more easter egg modes (e.g., "hidden", "debug", "omniscient")
- Create L0-specific product mappings for meta-tools (APScheduler, Supervisor, etc.)
- Add animation on Layer 0 reveal (shimmer, pulse, unlock sound)
- Create "Sovereignty" axis band for L0
