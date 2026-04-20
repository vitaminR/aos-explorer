# PRD: {a}OS Explorer — Features T1–T19

**Status:** Draft
**Date:** 2026-04-17
**Owner:** nymil
**Scope:** Product-level intent, goals, and user value for T1–T19. See `SPEC_T1-T19.md` for implementation detail.

---

## 0. Executive Summary

Nineteen features that together turn {a}OS Explorer from a static taxonomy reference into **the canonical, interactive, community-powered standard for understanding the agentic AI stack**.

Features are grouped into four tiers by strategic role:

| Tier | Role | Features |
|------|------|----------|
| **Tier 1** — Signature differentiators | What no other directory has | T1, T2, T3, T4, T5 |
| **Tier 2** — Engagement & entertainment | Why users come back | T6, T7, T8, T9, T10 |
| **Tier 3** — Standard-setting credibility | Why other tools cite us | T11, T12, T13, T14, T15 |
| **Tier 4** — Community & viral | How we grow | T16, T17, T18, T19 |

**Build order (from prior decisions):** T3 → T4 → T16 → T18 → T14 → T11 → T13 → T15 → T12 → fix test baseline → auth + credits → T2 → T6 → T5 → T7 → T8 → T9 → T10 → T17 → T19 → T1.

---

## Tier 1 — Signature Differentiators

---

### T1 — Capability Demo (canonical task runner)

**Status:** Deferred (needs sandboxed compute; not first)

**Problem:** Users read marketing copy, not proof. "Can this tool actually do X?" is never answered by a directory.

**User story:** As an architect comparing Browserbase / E2B / MCP-style tool adapters, I click "Try canonical task" and the explorer runs the same predefined task (open webpage → extract title → take screenshot → return JSON) against each, showing which succeeded, setup effort, rough latency, and what capability class the tool best fits.

**Goals:**

- G1: Every eligible product has at least one canonical task
- G2: Task runs are sandboxed, rate-limited, and free within a daily cap
- G3: Users can compare results of the same task across ≥2 products side-by-side

**Non-goals:** Running user-authored code; general-purpose agent eval; claims of production SLAs.

**Success metric:** ≥20% of Compare users click "Try canonical task" at least once; <1% sandbox abuse rate.

**Dependencies:** Auth (T2 stack), credits ledger, sandbox infra (Firebase Cloud Functions + ephemeral container or third-party sandbox API).

**Risks:** Cost creep, vendor rate-limits, abuse vectors, legal ambiguity of automated vendor probing.

---

### T2 — Ask the Standard (LLM features with credits)

**Status:** Scoped, not first (requires auth + billing)

**Problem:** Users often know what they need in plain English ("RAG over 10k legal PDFs") but the directory forces them to hand-filter.

**User story:** As a small-team operator I type my use case, and the Standard ranks my catalog of products by fit, with a reasoning card per pick. I spend credits; free tier covers casual use.

**Goals:**

- G1: Signed-in users get 20 free credits, refilling at 2/day
- G2: Common queries (quick answer = 1 credit; fit analysis = 5 credits; stack critique = 3 credits)
- G3: Stripe-backed credit packs and monthly Pro later
- G4: No raw tokens exposed to user — credits only

**Non-goals:** Multi-turn chat UI; code execution; training on user data.

**Success metric:** ≥1 LLM interaction per signed-in user per week; credit-refill retention ≥30% week over week.

**Dependencies:** Firebase Auth, Firestore ledger collection, rate limiting, Stripe (phase 2), a vetted system prompt that cites the {a}OS taxonomy.

**Risks:** LLM cost runaway, prompt injection, hallucinated product facts, regulatory on payments.

---

### T3 — Build Your Own Stack (Stack Builder)

**Status:** **NEXT TO BUILD** ✅

**Problem:** The real job-to-be-done isn't "find a tool" — it's "pick the 5 tools that together cover my system."

**User story:** As a developer I click "Build Stack" in the nav, drag products into a 7-layer column, and export to draw.io / Mermaid / shareable URL (`aos7.tech/stack/<id>`) so I can drop it into my architecture doc.

**Goals:**

- G1: Drag/drop products into any of L1–L7
- G2: Compare basket → "Send to Stack Builder" preserves selection
- G3: Stack → shareable public URL (read-only for anon; editable for owner)
- G4: Export formats: PNG, SVG, Mermaid, draw.io XML, JSON
- G5: Mini gap analysis in builder ("Your stack is strong in L1–L4, weak in L5–L6.") — lightweight T4 hook

**Non-goals:** Real-time multiplayer editing (phase 2); cost estimation; auto-recommend entire stacks (that's T2).

**Success metric:** ≥500 public stacks created in first 90 days; ≥3 export clicks per 10 stack creations; ≥10% of shared URLs click back to explorer.

**Dependencies:** Firestore (for shared stacks), Firebase Auth (to own/edit), SVG export lib, Mermaid lib.

**Risks:** Shared-URL abuse (spam stacks), layout ugliness at large stack counts, DnD accessibility.

---

### T4 — Gap Map (ecosystem maturity heatmap)

**Status:** Build after T3 (shares insights surface)

**Problem:** Architects don't know where the ecosystem is mature vs thin. This info exists only in scattered blogs.

**User story:** As a CTO I open the Insights page, see a heatmap where rows are use-cases (Code agent, Customer support agent, RAG assistant, SMB ops copilot, etc.) and columns are L1–L7. Color = ecosystem maturity. I see at a glance "governance is thin for code agents" and bookmark the page.

**Goals:**

- G1: 7 seed use-case rows × 7 strata columns = 49 cells, all hand-scored 0–3
- G2: Each cell expands to show top 3 products at that intersection
- G3: Public page (`/insights/gap-map`) — shareable, screenshot-friendly, no login required
- G4: Mini version embedded in T3 Stack Builder advisor ("you're thin in L5/L6")

**Non-goals:** Real-time auto-scoring from catalog (phase 2); predictive scoring; global market sizing.

**Success metric:** Gap Map gets screenshotted into ≥20 external articles/posts in first 6 months; ≥5% of Explorer sessions visit Insights page.

**Dependencies:** Manual scoring rubric; static JSON store for v1.

**Risks:** Scoring subjectivity; vendors lobby for rating changes; stale data perception.

---

### T5 — Time Machine (versioned catalog history)

**Status:** Yes, but snapshots-only (not event-log)

**Problem:** The field moves so fast that "this catalog as of Jan 2024" is genuinely useful context — for talks, decks, educational history.

**User story:** As an educator I scrub a slider from Jan 2024 → today and watch strata fill in with products as they appeared, with confidence ratings evolving.

**Goals:**

- G1: Snapshots at ≥quarterly cadence (`catalog-snapshots/2026-Q1.json`, etc.)
- G2: Slider scrubs between snapshots with smooth visual transitions
- G3: Per-product "added YYYY-MM-DD" tag visible on detail panel

**Non-goals:** Event-level edit history; arbitrary date granularity; diff viewer.

**Success metric:** Feature is demoed in ≥5 external talks/screenshots; ≥3% of sessions interact with the slider.

**Dependencies:** Release tagging discipline; minor storage (few KB × few snapshots).

**Risks:** Snapshots drift from reality between releases; visual perf on low-end devices.

---

## Tier 2 — Engagement & Entertainment

---

### T6 — Roast My Stack

**Problem:** Shareable artifacts need humor to spread. A dry analysis doesn't.

**User story:** On my built stack I click "Roast my stack" and Claude/GPT returns a 4-paragraph, witty, senior-staff-engineer critique in the voice of someone who's seen too many architectures. I screenshot it, post it, people click back.

**Goals:**

- G1: One-click from Stack Builder; LLM call with a carefully-tuned system prompt
- G2: Output is punchy (≤250 words), concrete (cites specific layers), and funny (uses "agent debt", "boundary leak", "tool sprawl" vocabulary)
- G3: Share card auto-generated (PNG) with stack + roast

**Non-goals:** Insulting real vendors; abusive tone; profanity.

**Success metric:** ≥30% of finished stacks trigger a roast; ≥15% of roasts get shared externally; content-policy violations <0.5%.

**Dependencies:** T2 LLM infra; content moderation; share-card renderer.

**Risks:** Tone drift into mean-spirited territory; vendor complaints; LLM jailbreaks.

---

### T7 — Daily Boundary Leak

**Problem:** No reason to come back tomorrow.

**User story:** I visit aos7.tech in the morning and see a rotating "Today's failure mode" card — a 3:11pm-timestamped micro-story naming an anti-pattern (e.g., "agent debt", "boundary leak", "capability drift"). I skim it in 30 seconds.

**Goals:**

- G1: Rotating card on homepage; new content every calendar day
- G2: Library of 365 pre-written stories (1-year cushion)
- G3: Permalink per story (`/leak/2026-04-17`) — each one SEO-indexed
- G4: RSS/email subscription (phase 2)

**Non-goals:** User-submitted stories (community phase); video; long-form essays.

**Success metric:** ≥20% daily return rate on logged-in users; ≥50 stories shared externally in first 90 days.

**Dependencies:** 365-story library; daily rotation script; SEO per story.

**Risks:** Library feels repetitive; tone mismatch with serious users; stories feel dated.

---

### T8 — Compare-as-Dialogue

**Problem:** Side-by-side compare tables are boring and rarely re-read.

**User story:** I pick LangGraph and CrewAI and click "Dialogue mode". An animated Slack-style conversation unfolds between the two "voices" debating a concrete use case. I watch, laugh, share.

**Goals:**

- G1: Two products → 8–12 message dialogue, animated
- G2: Each message tagged with which product's "voice" it is
- G3: Generated by LLM from product metadata + use-case seed
- G4: "Export as image" creates a Slack-style PNG

**Non-goals:** Real vendor voices; speech audio; more than 2 participants.

**Success metric:** ≥10% of Compare sessions trigger Dialogue mode; ≥5% of dialogues shared.

**Dependencies:** T2 LLM infra; animation library; canvas-to-PNG rendering.

**Risks:** Dialogues feel AI-slop; tone issues; misrepresenting vendors.

---

### T9 — Power Mode (keyboard-first navigation)

**Problem:** Engineers read sites with their hands on the keyboard. Mouse-only UX reads "built for execs".

**User story:** I press `Cmd-K` for a command palette, `/` for search, `1–7` to jump to a stratum, `J/K` to walk products, `?` to see all shortcuts. I can do everything without touching the mouse.

**Goals:**

- G1: Full shortcut map, discoverable via `?`
- G2: Command palette with fuzzy search over products, strata, primitives, concepts
- G3: Screen-reader a11y parity with mouse UX
- G4: Visible focus ring and skip-to-content

**Non-goals:** Vim mode (too nerdy); macro recording.

**Success metric:** ≥15% of power users (defined: ≥5 sessions/week) use at least one shortcut per session.

**Dependencies:** None (vanilla JS is fine).

**Risks:** Shortcut conflicts; mobile UX regressions.

---

### T10 — Cinematic Micro-Interactions

**Problem:** Site looks good. It doesn't feel *alive*.

**User story:** Adding a product to Compare produces a subtle confetti burst + spring animation. Opening a product card has a subtle physics-based ease. Optional ambient hum (default muted) gives the site a signature vibe.

**Goals:**

- G1: Confetti on add-to-compare (configurable, accessible)
- G2: Spring-based card opens (reduced-motion aware)
- G3: Ambient audio toggle (default off, persisted choice)

**Non-goals:** Heavy 3D scenes; anything that blocks rendering.

**Success metric:** Qualitative — mentioned in ≥3 external reviews/tweets as "feels premium".

**Dependencies:** Motion library; tiny audio asset.

**Risks:** Motion-sickness violations; audio autoplay complaints; perf regressions.

---

## Tier 3 — Standard-Setting Credibility

---

### T11 — Canonical Taxonomy API

**Problem:** To be cited as a standard, we must be machine-readable.

**User story:** An agent developer writes `GET aos7.tech/api/v1/strata/l4` and gets JSON describing L4: name, definition, primitives, example products. They bake our taxonomy into their docs.

**Goals:**

- G1: Public, CORS-open, rate-limited API
- G2: Endpoints: `/strata`, `/strata/:id`, `/products`, `/products/:id`, `/primitives`, `/concepts`, `/concepts/:slug`
- G3: Versioned (`/api/v1/...`); deprecation policy
- G4: OpenAPI spec published

**Non-goals:** User-authored data mutation via API (phase 2); auth-gated routes.

**Success metric:** ≥50 unique API consumers (by IP/UA) within 90 days; at least 3 external projects cite the API in their docs.

**Dependencies:** Firebase Cloud Functions or static CDN with JSON files.

**Risks:** Scraping abuse; API drift vs UI; breaking changes.

---

### T12 — MCP Server for Catalog

**Problem:** AI agents (Claude Desktop, Cursor, etc.) should be able to query the catalog from *inside* their runtime.

**User story:** In Claude Desktop I add the aos7.tech MCP server. I ask, "find me an L5 eval platform with an open-source license," and Claude queries our MCP tool, gets structured results, and answers with citations.

**Goals:**

- G1: Hosted MCP server at `aos7.tech/mcp`
- G2: Tools: `search_products`, `get_stratum`, `get_primitive`, `compare_products`
- G3: Signed-in users can get a personal MCP URL (phase 2)

**Non-goals:** Write operations; full LLM chat via MCP.

**Success metric:** ≥100 MCP server installations in first 90 days; feature listed in public MCP registries.

**Dependencies:** T11 API; MCP server framework.

**Risks:** MCP protocol churn; abuse via runaway agent queries.

---

### T13 — Agent-Readable Product Cards

**Problem:** Each product detail page should expose its data in a format LLMs and agents can consume directly.

**User story:** An agent crawls `aos7.tech/product/crewai/card.json` and gets a structured card with schema, confidence, strata, concepts, citations. Tools like Cursor can embed the card in their own docs.

**Goals:**

- G1: `llms.txt` at root (lists all important URLs)
- G2: Per-product `card.json` at `/product/:id/card.json`
- G3: Schema published (`aos7-card` schema v1)
- G4: OpenGraph + JSON-LD for humans & search engines

**Non-goals:** Arbitrary card customization; HTML-in-JSON weirdness.

**Success metric:** At least 5 external sites embed aos7-cards in their docs within 6 months.

**Dependencies:** Static export pipeline.

**Risks:** Schema churn; stale cards.

---

### T14 — Versioned Taxonomy Releases

**Problem:** Treating the taxonomy as a living product (vs a frozen doc) is the entire legitimacy play.

**User story:** I watch aos7.tech on GitHub. When v1.1 ships, I read the changelog: "added L5.3 Eval Harness", "deprecated L3.7 Agent Shim", "split L1 Models from L1 Infrastructure". Every academic paper can cite `{a}OS v1.1`.

**Goals:**

- G1: Semver-style releases (`v1.0`, `v1.1.0`, `v2.0.0`)
- G2: Changelog per release, published on GitHub Releases + `/changelog` page
- G3: Each release tagged + archived as immutable JSON
- G4: API versioned to releases

**Non-goals:** Monthly forced releases; breaking changes without deprecation.

**Success metric:** ≥1 taxonomy release per quarter; ≥10 external papers cite versioned releases within 1 year.

**Dependencies:** Release discipline; changelog automation.

**Risks:** Release fatigue; community debate on version bumps.

---

### T15 — Citation Widget

**Problem:** Academics can't easily cite us.

**User story:** On any product or stratum page I click "Cite this" and get BibTeX, APA, and markdown-link formats in a modal. I paste it into my paper.

**Goals:**

- G1: Widget on every canonical page
- G2: Formats: BibTeX, APA 7, MLA, Chicago, Markdown link, plain URL
- G3: Citation includes version tag (T14) and access date

**Non-goals:** EndNote/Zotero direct export (phase 2).

**Success metric:** ≥100 clicks/month within 6 months; ≥5 published papers cite the format.

**Dependencies:** T14 versioning; small JS component.

**Risks:** Format bugs in citation strings.

---

## Tier 4 — Community & Viral

---

### T16 — Weekly "New in aOS7"

**Problem:** Retention loop.

**User story:** Every Monday I get a 1-screen email: "3 new products added, 2 confidence bumps, 1 stratum refinement, 1 roast of the week." I click one, return to the site.

**Goals:**

- G1: Weekly auto-generated email from Firestore diffs
- G2: Public archive at `/weekly/YYYY-WW`
- G3: RSS feed
- G4: One "editor's pick" stack shared per week

**Non-goals:** Daily email; paid newsletter (yet).

**Success metric:** ≥30% open rate; ≥5% click-through; ≥2% conversion from new subscriber → returning session.

**Dependencies:** Email provider; diff script; T14 versioning.

**Risks:** Spam filters; email burnout.

---

### T17 — Reviewer Reputation

**Problem:** Crowdsourced reviews only work if reviewers accrue identity.

**User story:** I leave 10 thoughtful reviews, earn a silver ring on my avatar, and my future reviews carry more weight in sorting.

**Goals:**

- G1: Reputation tiers (Bronze/Silver/Gold) based on review count + upvote ratio
- G2: Public profile per user (`/u/:handle`)
- G3: Tier shown on reviews and in product detail
- G4: Abuse reporting and removal flow

**Non-goals:** Paid verification; financial incentives (phase 3c).

**Success metric:** ≥50 users reach Silver within 6 months of launch.

**Dependencies:** Firebase Auth (GitHub), Firestore, moderation tooling.

**Risks:** Brigading, sybil attacks.

---

### T18 — Embed This Stack Widget

**Problem:** Best distribution is user-made backlinks.

**User story:** I embed my built stack (T3) into my blog via an `<iframe>` snippet, or as a static SVG. It keeps the aos7.tech brand + a "view on aos7" CTA.

**Goals:**

- G1: `<iframe>` with sandboxed embed
- G2: Static PNG/SVG fallback
- G3: Attribution link enforced
- G4: Analytics on embed impressions

**Non-goals:** Interactive embed that needs auth.

**Success metric:** ≥200 external embeddings within 90 days; ≥5% click-back rate.

**Dependencies:** T3 Stack Builder.

**Risks:** Iframe-sandbox breaches; stale stacks on 3rd-party sites.

---

### T19 — Public Disagreement Log

**Problem:** Directories that hide debate feel propagandistic. Surfacing disagreement builds trust.

**User story:** Two reviewers classify Temporal differently (L4 primary vs L3 primary). The product detail page shows both classifications and the debate. I trust the site more.

**Goals:**

- G1: When classifications diverge by ≥1 stratum, show conflict banner
- G2: "Why this is debated" explainer per conflict
- G3: Community vote (tiebreaker signals; no brigading)
- G4: Resolution log (which side prevailed + reasoning)

**Non-goals:** Public flame wars; anonymous disagreement.

**Success metric:** ≥30 conflicts surfaced in first year; qualitative mentions of "honesty" in reviews/posts.

**Dependencies:** Reviewer system, reputation.

**Risks:** Manipulation; vendor-side lobbying.

---

## Cross-Cutting Principles

1. **Taxonomy as product.** Every feature reinforces that {a}OS is a living, versioned standard, not a marketing page.
2. **Credits, not tokens.** Users never see the LLM plumbing.
3. **Shareable surfaces.** Every feature should produce a screenshot-able artifact.
4. **Agent-readable.** Every feature should have an API or JSON endpoint.
5. **Honest disagreement.** Do not hide debate — surface it.
6. **Keyboard first.** Power users run the site.
7. **Green test baseline.** Every feature ships with Playwright E2E coverage.

---

## Dependency Graph (abridged)

```
T11 Taxonomy API  ──┬──> T12 MCP Server
                    └──> T13 Agent Cards
T14 Versioning  ────┬──> T15 Citation
                    └──> T16 Weekly Digest

Auth + Credits  ────┬──> T2  Ask the Standard
                    ├──> T6  Roast My Stack
                    ├──> T8  Compare-as-Dialogue
                    └──> T1  Capability Demo

T3 Stack Builder  ──┬──> T4  Gap Map mini-advisor
                    ├──> T6  Roast target
                    ├──> T18 Embed widget
                    └──> T16 Weekly editor's pick
```

---
