# VPAT 2.5 (Rev) — aOS Explorer — **SKELETON / NOT A CONFORMANCE CLAIM**

> **Read this first.** This is a *skeleton* produced from a single automated axe-core run
> (task-0305). It is **not** an Accessibility Conformance Report and must not be sent to a customer,
> agency, or procurement office in this state. Every row below is either measured by axe or marked
> **Not Evaluated**. No row has been filled in optimistically.
>
> **Why the honesty matters more than the paperwork.** A VPAT that overclaims is worse than no VPAT:
> it is a promise to a disabled user that the product will not keep, and procurement relies on it.
> Rows that automated tooling cannot decide are marked Not Evaluated on purpose.

| Field | Value |
|---|---|
| Product | aOS Explorer (`explorer.html`) |
| Report date | *(stamp when published — deliberately unstamped in the skeleton)* |
| Evaluation methods | Automated only: axe-core 4.12.1 via Playwright/Chrome, single run, `file://` load |
| Standards | Revised Section 508 (incorporates WCAG 2.0 AA by reference); rows below use **WCAG 2.1 AA** |
| Evaluated by | claude/Lenna (agent), task-0305 — **no human assistive-technology pass performed** |

## Automated baseline — first run, recorded as found

Command: `node tools/a11y/axe-508-check.mjs` · tags: `wcag2a, wcag2aa, wcag21a, wcag21aa, section508`

| Impact | Rules | Elements |
|---|---:|---:|
| **Critical** | **1** | **2** |
| Serious | 3 | 125 |
| Moderate | 0 | 0 |
| Minor | 0 | 0 |
| Passing rules | 26 | — |
| **Incomplete (needs a human)** | **1** | **90** |

**Critical (gate-blocking):**
- `aria-allowed-attr` — Elements must only use supported ARIA attributes. 2 elements, first `.axis-gov`.

**Serious:**
- `color-contrast` — **123 elements**, first `#filterType > .count`.
- `frame-title` — 1 element, `#embedPreviewFrame` (frame has no accessible name).
- `link-in-text-block` — 1 element, footer link to `docs.html` (distinguished by colour alone).

**Also observed:** 1 page error during the audit — `SyntaxError: Unexpected token '-'`. Not an
accessibility rule, but a script that fails may leave interactive content unbuilt, so some of the
page may not have been auditable at all.

**Nothing was fixed.** The order was explicit and it is also correct method: a gate whose first run
was pre-cleaned proves nothing about the gate.

## WCAG 2.1 Level A / AA — success criteria

Status vocabulary: **Supports** · **Partially Supports** · **Does Not Support** · **Not Applicable** ·
**Not Evaluated**. Automated tooling detects roughly a third of WCAG issues, so most rows below are
honestly **Not Evaluated** — that is the accurate state, not a gap in diligence.

| SC | Title | Level | Status | Basis |
|---|---|---|---|---|
| 1.1.1 | Non-text Content | A | Not Evaluated | axe checks for missing `alt`; it cannot judge whether alt text is *meaningful*. Human pass required. |
| 1.2.1–1.2.5 | Time-based Media | A/AA | Not Applicable *(provisional)* | No audio/video identified on `explorer.html`; confirm before publishing. |
| 1.3.1 | Info and Relationships | A | Not Evaluated | Partially machine-checkable; heading/landmark semantics need review. |
| 1.3.2 | Meaningful Sequence | A | Not Evaluated | Reading order requires a human/AT pass. |
| 1.3.3 | Sensory Characteristics | A | Not Evaluated | Not machine-detectable. |
| 1.3.4 | Orientation | AA | Not Evaluated | Needs responsive/orientation testing. |
| 1.3.5 | Identify Input Purpose | AA | Not Evaluated | Requires autocomplete audit. |
| 1.4.1 | Use of Color | A | **Does Not Support** | `link-in-text-block`: footer link distinguished by colour alone (1 element). |
| 1.4.3 | Contrast (Minimum) | AA | **Does Not Support** | `color-contrast`: **123 elements** below threshold; a further **90 nodes incomplete**. |
| 1.4.4 | Resize Text | AA | Not Evaluated | Requires zoom testing to 200%. |
| 1.4.5 | Images of Text | AA | Not Evaluated | Not machine-detectable. |
| 1.4.10 | Reflow | AA | Not Evaluated | Requires 320px viewport testing. |
| 1.4.11 | Non-text Contrast | AA | Not Evaluated | UI-component contrast not covered by this run. |
| 1.4.12 | Text Spacing | AA | Not Evaluated | Requires override testing. |
| 1.4.13 | Content on Hover or Focus | AA | Not Evaluated | Requires interaction testing. |
| 2.1.1 | Keyboard | A | Not Evaluated | **Highest-priority human check.** Not covered by axe. |
| 2.1.2 | No Keyboard Trap | A | Not Evaluated | Not covered by axe. |
| 2.1.4 | Character Key Shortcuts | A | Not Evaluated | Requires shortcut audit. |
| 2.2.1 | Timing Adjustable | A | Not Evaluated | — |
| 2.2.2 | Pause, Stop, Hide | A | Not Evaluated | Page has animation; needs review. |
| 2.3.1 | Three Flashes | A | Not Evaluated | — |
| 2.4.1 | Bypass Blocks | A | Not Evaluated | Skip-link presence not confirmed. |
| 2.4.2 | Page Titled | A | Supports | axe `document-title` among the 26 passing rules. |
| 2.4.3 | Focus Order | A | Not Evaluated | Requires human pass. |
| 2.4.4 | Link Purpose (In Context) | A | Not Evaluated | Needs human judgement. |
| 2.4.5 | Multiple Ways | AA | Not Evaluated | — |
| 2.4.6 | Headings and Labels | AA | Not Evaluated | Descriptiveness is not machine-checkable. |
| 2.4.7 | Focus Visible | AA | Not Evaluated | Requires human pass. |
| 2.5.1–2.5.4 | Pointer / Motion | A | Not Evaluated | Requires interaction testing. |
| 2.5.3 | Label in Name | A | Not Evaluated | — |
| 3.1.1 | Language of Page | A | Supports | axe `html-has-lang` among the passing rules. |
| 3.1.2 | Language of Parts | AA | Not Evaluated | — |
| 3.2.1–3.2.4 | Predictable | A/AA | Not Evaluated | — |
| 3.3.1–3.3.4 | Input Assistance | A/AA | Not Evaluated | — |
| 4.1.2 | Name, Role, Value | A | **Does Not Support** | `aria-allowed-attr` (**critical**, 2 elements) and `frame-title` (1 element, `#embedPreviewFrame`). |
| 4.1.3 | Status Messages | AA | Not Evaluated | Live-region usage not audited. |

## What would make this a real VPAT

1. Clear the **critical** `aria-allowed-attr` violation — it is the gate.
2. Work the **123 colour-contrast** elements; measure, do not eyeball. The house Argus tooling
   already measures painted contrast and is the right instrument.
3. Resolve the **90 incomplete** contrast nodes — axe explicitly could not decide these.
4. Run a **human keyboard + screen-reader pass**. 2.1.1, 2.1.2, 2.4.3 and 2.4.7 are the criteria a
   blind or motor-impaired user meets first, and *none* of them are covered by any automated run.
5. Investigate the page `SyntaxError` — unbuilt content cannot be audited.
6. Only then replace **Not Evaluated** rows with evidenced statuses, and stamp a report date.
