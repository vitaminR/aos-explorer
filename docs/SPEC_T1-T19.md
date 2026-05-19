# SPEC: {a}OS Explorer — Features T1–T19

**Status:** Draft
**Date:** 2026-04-17
**Owner:** nymil
**Companion doc:** `PRD_T1-T19.md`
**Scope:** Technical implementation, data models, API surfaces, test coverage. Groups of dependent specs are marked.

---

## 0. Shared Infrastructure Assumptions

| Concern | Choice |
|---------|--------|
| Hosting | Firebase Hosting (aos7.tech, live) |
| Auth | Firebase Auth (GitHub provider primary) |
| DB | Cloud Firestore |
| Storage | Firebase Storage |
| Functions | Firebase Cloud Functions (Node 20) |
| Static API | JSON on Hosting + edge-cached |
| Payments | Stripe (phase 2 only) |
| LLM | OpenAI `gpt-4o-mini` for cheap paths, `gpt-4o` for premium |
| LLM budget guardrail | Per-user credits ledger (see T2) |
| Test framework | Playwright (E2E), Vitest (unit) |
| Deploy | `npx firebase-tools deploy --only hosting` (existing `/firePush` skill) |

**Global naming:**

- Routes: kebab-case (`/build-stack`, `/insights/gap-map`)
- Firestore collections: snake_case (`tool_submissions`)
- API paths: `/api/v1/<resource>`

---

## T1 — Capability Demo

**Dependencies:** T2 credits, sandbox infra.

### Data model (Firestore)

```ts
// collection: capability_tasks
{
  id: "browser-extract-title",
  title: "Extract page title",
  category: "browser",
  eligibleProductTypes: ["platform", "component"],
  eligibleStrata: ["l3"],
  inputSchema: { url: "string" },
  expectedOutput: { title: "string" },
  costCredits: 2,
  timeoutSec: 30
}

// collection: task_runs
{
  id: uuid,
  taskId: "browser-extract-title",
  productId: "browserbase",
  userId: uid,
  input: { url: "https://example.com" },
  output: { title: "Example Domain" } | null,
  error: string | null,
  latencyMs: number,
  status: "success" | "timeout" | "error",
  createdAt: Timestamp
}
```

### Execution

- Cloud Function `runCapabilityTask(taskId, productId, input)` — spins up an ephemeral container or calls vendor sandbox.
- Hard cap: 30s wall, 50MB memory, no outbound except vendor endpoint.
- Results cached 24h per (taskId, productId, input-hash).

### API

- `POST /api/v1/capability/run` — requires auth, spends credits.
- `GET /api/v1/capability/runs?product=:id` — public recent runs (redacted).

### Tests

- Unit: input validator, credit decrement on success/failure.
- E2E: run browser-extract-title against two products, assert latency + result shown; assert credit balance decremented.

---

## T2 — Ask the Standard (LLM + Credits)

**Dependencies:** Firebase Auth, Firestore, Stripe (phase 2).

### Data model (Firestore)

```ts
// collection: users
{
  uid,
  handle,           // GitHub login
  createdAt,
  credits: number,           // current balance
  lifetimeCreditsEarned: number,
  lifetimeCreditsSpent: number,
  lastDailyRefillAt: Timestamp,
  plan: "free" | "pro"
}

// collection: credit_transactions
{
  id: uuid,
  uid,
  delta: number,                         // +20 signup, -5 fit, +2 daily
  reason: "signup_bonus" | "daily_refill" | "purchase" | "fit_analysis" | "roast" | "dialogue" | "capability_task",
  createdAt: Timestamp,
  relatedEntityId?: string               // stackId, runId, etc.
}

// collection: llm_logs
{
  id, uid, promptHash, model, tokensIn, tokensOut, costUsd,
  feature: "fit" | "roast" | "dialogue" | "capability",
  createdAt
}
```

### Cloud Functions

- `onUserCreate` → seed 20 credits, log `signup_bonus` transaction.
- `dailyRefill` (cron 00:00 UTC) → top users up to 20 credits/day refill (capped at 20 balance).
- `spendCredits(uid, amount, reason)` → atomic transaction; fail if insufficient.
- `invokeLLM(feature, input)` → checks credits, calls OpenAI, logs, returns.

### Credit prices

| Feature | Cost |
|---------|-----:|
| Quick answer (T2 mini) | 1 |
| Fit analysis (T2 full) | 5 |
| Roast My Stack (T6) | 3 |
| Dialogue (T8) | 4 |
| Capability task (T1) | 2–10 |

### System prompt (fit analysis, sketch)

```
You are the {a}OS Standard — an agentic reference ontology.
Taxonomy: L1 Models & Infrastructure, L2 Knowledge & Memory,
L3 Execution & Interfaces, L4 Orchestration & Decisioning,
L5 Observability & Evaluation, L6 Governance & Trust,
L7 Experience & Intent.

The user's need: {user_input}
Catalog (JSON): {catalog_slice}

Rank the top 5 products by fit. For each:
- One-line reason.
- Which strata it covers for this need.
- One honest caveat.
Return JSON.
```

### API

- `POST /api/v1/standard/ask` — requires auth, spends credits, returns JSON.

### Tests

- Unit: credit math (atomic spend), prompt injection guard.
- E2E: user with 20 credits asks question, gets top-5, balance = 15.

---

## T3 — Stack Builder

**Status:** Next to build. **No auth required for v1** (save-anon uses local storage + opt-in "claim" after login).

### Data model (Firestore)

```ts
// collection: stacks
{
  id: shortId,              // 8-char base62 (e.g. "k3gF92aQ")
  ownerUid: string | null,  // null = anonymous
  title: string,            // e.g. "RAG for legal PDFs"
  layers: {
    l1: string[], l2: string[], l3: string[], l4: string[],
    l5: string[], l6: string[], l7: string[]
  },                        // product ids per layer
  tags: string[],
  visibility: "public" | "unlisted",
  createdAt, updatedAt,
  forkOf: string | null,
  gapAnalysis: {            // computed server-side on save
    strongLayers: string[],
    weakLayers: string[],
    score: number           // 0-100
  }
}
```

### Routes

- `/build-stack` — builder (drag/drop)
- `/stack/:id` — shared read-only view
- `/stack/:id/edit` — owner only

### Nav change

Primary nav:

```
Explore · Compare · Build Stack · Insights · Docs
```

### UX

- 7-column grid (L1–L7), each column a drop zone
- Left sidebar: product picker (searchable, filtered)
- Top bar: title input, "Send from Compare basket", Save/Share, Export menu
- Right sidebar: mini gap analysis (hook into T4)

### Export formats

| Format | Method |
|--------|--------|
| PNG | `html2canvas` → blob download |
| SVG | Render layers as SVG manually |
| Mermaid | Template: `graph TD; L7[L7] --> L6[L6] ...` |
| draw.io XML | Template with stratum cells |
| JSON | Serialize `stacks` doc |

### Shareable URL

- 8-char `shortId` (no auth needed to view)
- OpenGraph image auto-generated from stack render

### API

- `POST /api/v1/stacks` — create (anon allowed)
- `GET /api/v1/stacks/:id` — public read
- `PATCH /api/v1/stacks/:id` — owner only
- `POST /api/v1/stacks/:id/fork` — create new stack cloned from existing

### Tests

- E2E: drag product from picker → L4 column → save → visit shared URL → same products present.
- E2E: Compare basket → "Send to Stack Builder" → products prefilled.
- E2E: export → PNG/Mermaid download produces non-empty file.
- E2E: gap analysis shows "weak" label when entire layer empty.

---

## T4 — Gap Map

**Dependencies:** None for v1 (hand-scored).

### Data model (static JSON)

`/data/gap-map.json`:

```json
{
  "version": "2026.04",
  "rows": [
    { "id": "code-agent", "label": "Code agent" },
    { "id": "customer-support", "label": "Customer support agent" },
    { "id": "rag-assistant", "label": "RAG assistant" },
    { "id": "smb-ops", "label": "SMB operations copilot" },
    { "id": "enterprise-copilot", "label": "Secure enterprise assistant" },
    { "id": "workflow-automation", "label": "Workflow automation agent" },
    { "id": "research-agent", "label": "Research agent" }
  ],
  "cells": {
    "code-agent": {
      "l1": { "score": 3, "topProducts": ["openai","bedrock"], "note": "Commoditized." },
      "l2": { "score": 2, "topProducts": ["mem0","zep"], "note": "Growing." },
      "l3": { "score": 3, "topProducts": ["mcp","e2b"], "note": "Mature sandboxes." },
      "l4": { "score": 3, "topProducts": ["bmad","autogen"], "note": "Many frameworks." },
      "l5": { "score": 1, "topProducts": ["promptfoo"], "note": "Nascent." },
      "l6": { "score": 1, "topProducts": [], "note": "Governance thin." },
      "l7": { "score": 2, "topProducts": ["vercel-ai"], "note": "UX evolving." }
    }
  }
}
```

Scoring rubric (0–3):

- 0 = no credible coverage
- 1 = emerging, <3 serious options
- 2 = several credible options, some production use
- 3 = mature, widely-deployed

### Route

- `/insights/gap-map` — full grid, clickable cells
- `/insights/gap-map/:useCaseId/:strataId` — cell detail

### Rendering

- 7×7 grid, CSS grid
- Cell color interpolated from rubric
- Click → popover with top products + note
- Mini version in Stack Builder ("you're weak in L5")

### API

- `GET /api/v1/insights/gap-map` — static JSON served

### Tests

- E2E: grid renders 49 cells.
- E2E: click code-agent × L4 → popover shows BMAD.
- E2E: mini version in builder reflects empty layers correctly.

---

## T5 — Time Machine (Snapshots)

**Dependencies:** T14 versioning.

### Data model

- Snapshots live at `/data/snapshots/YYYY-QN.json`
- Each snapshot is a frozen copy of the catalog at that point
- Manifest at `/data/snapshots/index.json`:

```json
{ "snapshots": [
  { "id": "2024-Q1", "label": "Jan 2024", "url": "/data/snapshots/2024-Q1.json" },
  { "id": "2026-Q2", "label": "Apr 2026", "url": "/data/snapshots/2026-Q2.json" }
]}
```

### UX

- Top-of-page slider: `◀ 2024-Q1 ─── 2026-Q2 ▶`
- Scrubbing replaces the in-memory catalog + re-renders strata/products
- "Live" mode (default) = latest
- URL `#t=2024-Q1` deep-links to that snapshot

### Tests

- E2E: set slider to 2024-Q1 → only Jan-2024-era products visible.
- E2E: deep-link `#t=2024-Q1` → correct snapshot loaded.

---

## T6 — Roast My Stack

**Dependencies:** T2 credits, T3 stack.

### Cloud Function

`roastStack(stackId) → { roast: string, shareCardUrl: string }`

System prompt:

```
You are a senior staff engineer who has reviewed 100 agent architectures.
Write a 150–250 word roast of this stack.
Be witty, concrete, cite specific strata, use the vocabulary:
"agent debt", "boundary leak", "tool sprawl", "capability drift".
End with one kind observation. No profanity. No ad-hominem.
Stack: {stack_json}
```

Content moderation:

- OpenAI moderation endpoint pre-return
- Flag rate-limit: ≤3 roasts/day per user

### Share card

- 1200×630 PNG generated via server-side puppeteer
- Shows stack + top 40 words of roast + aos7.tech brand

### Tests

- E2E: create stack → click Roast → modal shows text ≤250 words → share card URL returns 200.

---

## T7 — Daily Boundary Leak

### Data model

`/data/leaks/index.json`:

```json
{ "stories": [
  { "slug": "agent-debt-311pm", "title": "Agent debt at 3:11pm", "body": "...", "publishDate": "2026-04-17" }
]}
```

### Rotation

- Home-page card shows story where `publishDate <= today`, sorted by date desc, top 1.
- Per-story permalink `/leak/:slug`

### SEO

- Each permalink has full OG tags + JSON-LD Article schema.

### Tests

- E2E: homepage renders today's story.
- E2E: /leak/agent-debt-311pm renders correct title + OG tag.

---

## T8 — Compare-as-Dialogue

**Dependencies:** T2.

### Cloud Function

`generateDialogue(productAId, productBId, useCase) → messages[]`

System prompt:

```
Write an 8–12 message Slack-style dialogue between {productA.name}
and {productB.name} debating this use case: {useCase}.
Each voice reflects the product's actual strengths.
Format: JSON array of {speaker, text}.
Keep it fair. No vendor bashing. Concrete, witty, engineering tone.
```

### UI

- Animated message stream (reveal one at a time, 400ms interval)
- Speaker avatars use stratum color of their primary strata
- "Export as image" → PNG of full thread

### Tests

- E2E: dialogue button with 2 products → messages appear sequentially.
- E2E: export PNG → downloaded file size > 10KB.

---

## T9 — Power Mode

### Shortcuts

| Key | Action |
|-----|--------|
| `Cmd/Ctrl-K` | Command palette |
| `/` | Focus search |
| `1`–`7` | Jump to stratum L1–L7 |
| `J` / `K` | Next/prev product in current view |
| `G` then `S` | Go to Stack Builder |
| `G` then `I` | Go to Insights |
| `?` | Show shortcut reference modal |
| `Esc` | Close overlay / blur input |

### Implementation

- Single global keydown listener, ignores inputs/contenteditable
- Command palette: `<dialog>` element, fuzzy search via `fuse.js`

### Tests

- E2E: press `?` → help modal visible.
- E2E: press `3` → page scrolls with L3 in view.
- E2E: `Cmd-K` → palette focused; type "crew" → CrewAI top result.

---

## T10 — Cinematic Micro-Interactions

### Implementation

- `canvas-confetti` on add-to-compare (respects `prefers-reduced-motion`)
- Spring `transition` on card open via CSS `cubic-bezier(.2,.9,.3,1.2)`
- Ambient hum: 30s loop, muted default, toggle in footer; persists to localStorage

### Tests

- E2E: add-to-compare → confetti canvas created.
- E2E: reduced-motion media query forced on → no confetti canvas.

---

## T11 — Canonical Taxonomy API

### Endpoints

```
GET  /api/v1/strata
GET  /api/v1/strata/:id            // l1..l7
GET  /api/v1/products
GET  /api/v1/products/:id
GET  /api/v1/primitives
GET  /api/v1/primitives/:slug
GET  /api/v1/concepts
GET  /api/v1/concepts/:slug
GET  /api/v1/taxonomy/version
```

### Response shape (example)

```json
GET /api/v1/strata/l4
{
  "version": "v1.1",
  "id": "l4",
  "label": "Orchestration & Decisioning",
  "definition": "...",
  "primitives": [...],
  "exampleProducts": ["crewai", "autogen", "langgraph"]
}
```

### CORS + rate limits

- CORS: `*`
- Rate limit: 60 req/min per IP (Cloud Function middleware)

### OpenAPI

- Published at `/api/v1/openapi.json`
- Swagger UI at `/api/docs`

### Tests

- Unit: each endpoint returns expected shape.
- E2E: fetch with `Origin: https://example.com` → 200 + CORS headers.

---

## T12 — MCP Server

**Dependencies:** T11.

### Endpoint

`https://aos7.tech/mcp` (SSE) + `wss://aos7.tech/mcp-ws`

### Tools exposed

```ts
{
  "search_products": {
    input: { query: string, stratum?: string, license?: string },
    output: Product[]
  },
  "get_stratum": { input: { id: "l1".."l7" }, output: Stratum },
  "get_primitive": { input: { slug: string }, output: Primitive },
  "compare_products": { input: { ids: string[] }, output: ComparisonMatrix }
}
```

### Auth

- Public, rate-limited by IP (30 req/min)
- Phase 2: per-user MCP URLs for higher limits

### Tests

- Integration test: MCP client calls `search_products{query:"eval"}` → returns ≥3 L5 products.

---

## T13 — Agent-Readable Cards

### Files

- `/llms.txt` at site root — lists key URLs
- `/product/:id/card.json` per product

### Card schema (aos7-card v1)

```json
{
  "$schema": "https://aos7.tech/schema/aos7-card-v1.json",
  "id": "crewai",
  "name": "CrewAI",
  "vendor": "CrewAI Inc",
  "type": "framework",
  "strata": { "primary": "l4", "secondary": ["l3"] },
  "confidence": 0.9,
  "license": "Open Source",
  "deployment": "Cloud",
  "citations": [{ "title": "CrewAI Docs", "url": "..." }],
  "taxonomyVersion": "v1.1",
  "updated": "2026-04-15"
}
```

### Tests

- E2E: fetch `/llms.txt` → includes `/product/crewai/card.json`.
- E2E: fetch card.json → validates against schema.

---

## T14 — Versioned Taxonomy Releases

### Release shape

- SemVer: `v1.0.0`, `v1.1.0`, `v2.0.0`
- GitHub Release per version with JSON asset (`aos7-taxonomy-v1.1.0.json`)
- Page `/changelog` auto-generated from `CHANGELOG.md`

### Deprecation policy

- No strata removal without ≥1 version deprecation window
- Product removal = marked `status: "deprecated"`, kept in catalog

### Tests

- E2E: `/changelog` renders latest 10 releases.
- E2E: `/api/v1/taxonomy/version` returns current SemVer.

---

## T15 — Citation Widget

### Component

```html
<aos7-cite entity="product/crewai"></aos7-cite>
```

### Formats

```
BibTeX:   @misc{aos7_crewai_v1_1, ...}
APA 7:    nymil (2026). CrewAI [Entry]. {a}OS Standard v1.1. https://aos7.tech/product/crewai
MLA:      ...
Chicago:  ...
Markdown: [CrewAI — {a}OS v1.1](https://aos7.tech/product/crewai)
Plain:    https://aos7.tech/product/crewai
```

### Tests

- Unit: each format produces valid string for given entity.
- E2E: click Cite on CrewAI → modal shows 6 formats; click copy → clipboard receives text.

---

## T16 — Weekly "New in aOS7"

**Dependencies:** T14, auth for subscribers.

### Generation

- Cloud Function `generateWeekly()` (cron Mon 09:00 UTC)
- Computes diff between last-week and this-week snapshots
- Template: HTML email + public `/weekly/:yyyy-ww` page + RSS item
- Editor's pick stack manually chosen (admin override field in Firestore)

### Data model

```ts
// collection: weekly_issues
{
  id: "2026-16",
  publishAt: Timestamp,
  additions: string[],
  confidenceChanges: [{ productId, before, after }],
  taxonomyNotes: string,
  editorsPickStackId: string,
  subscriberCount: number
}

// collection: subscribers
{ uid, email, subscribedAt, unsubscribedAt }
```

### Tests

- E2E: `/weekly/2026-16` renders.
- Integration: generateWeekly() on seeded diff produces correct additions list.

---

## T17 — Reviewer Reputation

**Dependencies:** Firebase Auth, Phase 3 reviews.

### Tiers

| Tier | Threshold |
|------|-----------|
| Bronze | ≥5 approved reviews |
| Silver | ≥15 approved reviews AND upvote ratio ≥70% |
| Gold | ≥50 approved reviews AND upvote ratio ≥80% AND ≥3 helpful taxonomy edits |

### Data model

```ts
// users collection — extend:
{
  tier: "none" | "bronze" | "silver" | "gold",
  approvedReviewCount: number,
  upvoteRatio: number,  // 0..1
  taxonomyEditCount: number
}
```

### UI

- Avatar ring color matches tier (bronze/silver/gold)
- Profile page `/u/:handle` shows tier, reviews, stacks

### Tests

- Unit: tier promotion on crossing thresholds.
- E2E: reach Silver → avatar ring renders silver class.

---

## T18 — Embed This Stack Widget

**Dependencies:** T3.

### Snippet

```html
<!-- aos7 stack embed -->
<iframe src="https://aos7.tech/embed/stack/k3gF92aQ"
        width="800" height="500" frameborder="0"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin"></iframe>
```

### Fallback

- `https://aos7.tech/embed/stack/:id.svg` → static SVG
- `https://aos7.tech/embed/stack/:id.png` → static PNG (1200×630)

### Attribution

- Enforced footer in iframe: "Built on aos7.tech" with link

### Tests

- E2E: /embed/stack/:id returns HTML with attribution.
- E2E: .svg endpoint returns valid SVG with viewBox.

---

## T19 — Public Disagreement Log

**Dependencies:** T17 reviews.

### Data model

```ts
// collection: classification_conflicts
{
  productId,
  conflicts: [
    { userId, proposedPrimary: "l4", proposedSecondary: ["l3"], reason }
  ],
  status: "open" | "resolved",
  resolution: { primary: "l4", rationale: "..." } | null,
  openedAt, resolvedAt
}
```

### Detection

- Firestore trigger: when two approved reviews disagree on primary stratum, open conflict doc.

### UI

- Product detail page: "⚠ This classification is debated" banner when open
- `/disagreements` page lists all open/resolved conflicts

### Tests

- Integration: create 2 disagreeing reviews → conflict doc created.
- E2E: product with open conflict shows banner.

---

## Test Coverage Matrix

| Feature | Unit | E2E | Integration | Notes |
|---------|:----:|:---:|:-----------:|-------|
| T1 | ✔ | ✔ | ✔ | Sandbox container |
| T2 | ✔ | ✔ | ✔ | Credit atomicity |
| T3 | ✔ | ✔ | — | DnD, export formats |
| T4 | — | ✔ | — | Static JSON |
| T5 | — | ✔ | — | Slider scrub |
| T6 | ✔ | ✔ | ✔ | Moderation filter |
| T7 | — | ✔ | — | Daily rotation |
| T8 | ✔ | ✔ | ✔ | PNG export |
| T9 | ✔ | ✔ | — | Shortcuts |
| T10 | ✔ | ✔ | — | Reduced-motion |
| T11 | ✔ | ✔ | — | CORS, OpenAPI |
| T12 | — | — | ✔ | MCP client |
| T13 | ✔ | ✔ | — | Schema validation |
| T14 | — | ✔ | ✔ | Release pipeline |
| T15 | ✔ | ✔ | — | Citation formats |
| T16 | — | ✔ | ✔ | Cron + email |
| T17 | ✔ | ✔ | — | Tier promotion |
| T18 | — | ✔ | — | Iframe + SVG |
| T19 | — | ✔ | ✔ | Conflict detection |

---

## Rollout Checklist (per feature)

For every feature ship:

1. PRD delta approved
2. Spec written in this file
3. Data model + migration plan (if Firestore)
4. Unit + E2E tests green
5. Firebase Security Rules updated
6. API contract updated (if applicable)
7. OpenGraph + SEO tags (if new route)
8. Analytics events added (feature usage, errors)
9. README updated
10. Deploy via `/firePush` skill

---
