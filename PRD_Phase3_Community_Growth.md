# PRD: {a}OS Explorer — Phase 3: Community & Viral Growth

**Status:** Active  
**Date:** 2026-04-15  
**Owner:** nymil  
**Domain:** [aos7.tech](https://aos7.tech) (live on Firebase Hosting)  
**Depends on:** Phase 2 product expansion (PRD_Phase2_Product_Expansion.md)

---

## 0. Executive Summary

Phase 3 transforms {a}OS Explorer from a solo-built static prototype into a
community-powered, crowdsourced AI tool directory with viral distribution.
Based on 7 deep-research passes (Perplexity sonar-pro), we have a concrete
playbook across crowdsourcing, reviews, taxonomy, collaboration, gamification,
incentives, and viral growth mechanics.

**North Star metric:** 1,000 indexed tools and 5,000 monthly active users by Day 90.

---

## 1. Problem Statement

The prototype at aos7.tech indexes ~40 products in a static HTML file.
No one can contribute, review, rate, or share tools. There is no growth
engine, no retention loop, and no reason for a visitor to come back tomorrow.

## 2. Goals

| # | Goal | Metric | Phase |
|---|------|--------|-------|
| G1 | Enable community tool submissions | ≥100 community-submitted tools | 3a |
| G2 | Ship review & rating system | ≥50 reviews on top tools | 3a |
| G3 | Launch crowdsourced taxonomy governance | 3+ community taxonomy edits/week | 3b |
| G4 | Add gamification layer | 50+ users with XP > 0 | 3b |
| G5 | Execute 90-day viral launch | 5,000 MAU, k-factor ≥ 0.5 | 3c |
| G6 | Establish contributor incentive model | Public Founders Pool page live | 3c |

---

## 3. Architecture Decision: Static → Lightweight Backend

### Current: Single HTML file on Firebase Hosting

### Target: Firebase All-In-One (Auth + Firestore + Hosting)

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Frontend** | Static HTML/JS on Firebase Hosting | Keep what works, add progressive JS |
| **Database** | Cloud Firestore | Free tier: 1 GiB storage, 50K reads/day, 20K writes/day |
| **Auth** | Firebase Auth (GitHub OAuth provider) | Our users ARE developers, GitHub = identity |
| **Image/Asset storage** | Firebase Storage | Product logos, user avatars; free 5 GB |
| **Hosting** | Firebase Hosting (aos7.tech) | Already live, free tier sufficient |
| **Backend logic** | Firebase Security Rules + Cloud Functions (if needed) | Rate limiting, spam detection, webhook handlers |

**Why Firebase all-in-one (no Supabase):**

- Already deployed — aos7.tech is on Firebase Hosting today
- One console, one project, one billing account
- Firebase Auth + Firestore free tier covers our scale for months
- Firestore Security Rules = no custom backend needed
- JS SDK works in a static HTML page (CDN include)

---

## 4. Feature Specifications

### 4.1 Community Tool Submissions (G1) — Phase 3a

**Research basis:** Query 1 (Crowdsourced Tool Collection)

#### User Flow

1. User clicks "Submit a Tool" button (visible on every page)
2. GitHub OAuth login (Firebase Auth)
3. Form: name, URL, description, type (Platform/Framework/Component/CLI/Harness), primary stratum, secondary strata, license, deployment model
4. Submission enters `pending` queue
5. Reviewer (rep ≥ 500 XP) approves/rejects with comment
6. Approved → appears on site, submitter gets 50 XP

#### Data Model (Firestore collection: `tool_submissions`)

```js
// Document ID: auto-generated
{
  name: string,           // required
  url: string,            // required, unique index
  description: string,    // 20-500 chars
  type: "platform" | "framework" | "component" | "cli" | "harness",
  primaryLayer: string,   // required
  license: string | null,
  deployment: string | null,
  submittedBy: string,    // Firebase Auth UID
  status: "pending" | "approved" | "rejected",  // default: "pending"
  reviewerId: string | null,
  reviewNote: string | null,
  createdAt: Timestamp,
  reviewedAt: Timestamp | null
}
```

#### Anti-spam

- GitHub OAuth required (no anonymous submissions)
- Rate limit: max 5 submissions per user per day
- Duplicate URL detection (unique constraint on `url`)
- Manual review queue for first 3 months

---

### 4.2 Review & Rating System (G2) — Phase 3a

**Research basis:** Query 2 (Review & Rating Systems)

#### Rating Schema

- **Overall:** 1-5 stars
- **Sliders (0-10):** Ease of Use, Features/Capability, Documentation Quality
- **Text fields:** Pros (required, 20-500 chars), Cons (required, 20-500 chars)
- **Optional:** Use case description, team size

#### Constraints

- One review per product per user (upsert)
- Must be authenticated (GitHub OAuth)
- Rate limit: max 3 reviews per day per user per IP
- Reviews visible after 24h moderation window (auto-approve after 24h if no flags)

#### Data Model (Firestore collection: `reviews`)

```js
// Document ID: auto-generated
// Composite index on (productId, userId) for uniqueness enforcement
{
  productId: string,      // matches products.json `id`
  userId: string,         // Firebase Auth UID
  stars: number,          // 1-5
  easeOfUse: number,      // 0-10
  features: number,       // 0-10
  docsQuality: number,    // 0-10
  pros: string,           // 20-500 chars
  cons: string,           // 20-500 chars
  useCase: string | null,
  teamSize: string | null,
  status: "pending" | "approved" | "flagged" | "hidden",  // default: "pending"
  createdAt: Timestamp
}
```

---

### 4.3 Community Taxonomy Governance (G3) — Phase 3b

**Research basis:** Query 3 (Community Taxonomy/Reclassification)

#### Role Ladder

| Role | XP Threshold | Can Do |
|------|-------------|--------|
| Viewer | 0 | Browse, search |
| Contributor | 0 (authed) | Submit tools, write reviews |
| Proposer | 200 XP | Propose taxonomy edits (new categories, reclassifications) |
| Reviewer | 500 XP | Vote on proposals, approve tool submissions |
| Admin | Manual grant | Override, merge categories, ban users |

#### Taxonomy Proposal Flow

1. Proposer creates a proposal: "Move Tool X from L4 to L5" or "Create new sub-category: RAG Frameworks"
2. 72-hour review window
3. Requires 3 net upvotes from Reviewers to merge
4. Auto-merge after 7 days if no opposition and ≥1 upvote
5. Disputes (< 50% consensus) escalate to Admin queue

#### Data Model (Firestore collection: `taxonomy_proposals`)

```js
// Document ID: auto-generated
{
  proposedBy: string,     // Firebase Auth UID
  type: "reclassify" | "new_category" | "merge" | "rename",
  targetId: string | null,  // product or category slug
  description: string,
  currentValue: string | null,
  proposedValue: string,
  status: "open" | "approved" | "rejected" | "escalated",  // default: "open"
  createdAt: Timestamp,
  closesAt: Timestamp       // createdAt + 7 days
}
```

---

### 4.4 Gamification System (G4) — Phase 3b

**Research basis:** Query 5 (Developer Gamification)

#### XP Table

| Action | XP | Conditions |
|--------|----|------------|
| Submit a tool (approved) | +50 | +10 bonus if 3+ tags included |
| Write a review (approved) | +20 | +5 per upvote on review (cap 50) |
| Taxonomy proposal (merged) | +30 | — |
| Vote on proposal | +5 | — |
| Daily login streak | +10/day | 1.5x multiplier at 7-day streak |
| First Review badge earned | +25 | One-time |
| Refer a new contributor | +40 | Referee must submit 1 approved tool |

#### Level Curve

Logarithmic: `XP_for_level(N) = 100 × 1.5^(N-1)`

| Level | XP Required | Cumulative |
|-------|-------------|------------|
| 1 | 100 | 100 |
| 2 | 150 | 250 |
| 3 | 225 | 475 |
| 5 | 506 | 1,519 |
| 10 | 2,563 | 11,688 |

#### Core Badges (10)

| Badge | Requirement | Icon |
|-------|-------------|------|
| Toolsmith | 10 approved tool submissions | 🔧 |
| Critic | 50 approved reviews | ✍️ |
| Taxonomist | 100 merged taxonomy edits | 🏷️ |
| Streak Master | 30-day login streak | 🔥 |
| Early Adopter | Account created in first 90 days | 🌅 |
| MVP | Top 10% contributors (monthly) | 🏆 |
| Scout | First to review 5 new tools | 🔍 |
| Mentor | 10 helpful flags on reviews | 🎓 |
| Architect | Proposed 5 accepted reclassifications | 📐 |
| Founder | In Founders Pool | 👑 |

#### Anti-Gaming

- 80% approval gate: XP only awarded for approved contributions
- Decay: -5% XP per week of inactivity (floor at level XP, never lose a level)
- Peer-nominated badges (MVP) use community vote, not self-claim
- Flagged/hidden content = XP clawback

#### Data Model (Firestore collection: `user_profiles`)

```js
// Document ID: Firebase Auth UID
{
  username: string,       // unique (enforced via Cloud Function or client check)
  avatarUrl: string | null,
  xp: number,             // default: 0
  level: number,          // default: 0
  streakDays: number,     // default: 0
  lastActive: Timestamp,
  badges: string[],       // default: []
  role: "contributor" | "proposer" | "reviewer" | "admin",  // default: "contributor"
  createdAt: Timestamp
}
```

---

### 4.5 Incentive & Compensation Model (G6) — Phase 3c

**Research basis:** Query 6 (Incentive/Compensation Models)

#### Principles (from research)

1. **Retroactive, not prospective** — never promise specific dollar amounts
2. **Non-monetary hooks first** — reputation, badges, governance power, portfolio credit
3. **Transparent tracking** — public contribution dashboard (SourceCred-style)
4. **Legal safety** — aspirational language only

#### Founders Pool

> "High-impact contributors join the public Founders Pool. Pool members are
> eligible for pro-rata distributions from future revenue, grants, or funding
> events. No fixed amounts are guaranteed — distributions are purely
> discretionary and retroactive."

**Eligibility:** Level 5+ AND 3+ approved contributions AND 30+ days active

**Public page:** `/founders` — lists all pool members with contribution stats, join date, and rank. No dollar amounts ever shown.

#### Contribution Weights (for future distribution math)

| Action | Weight |
|--------|--------|
| Tool submission (approved) | 5 |
| Review (approved) | 2 |
| Taxonomy proposal (merged) | 3 |
| Bug report (confirmed) | 1 |
| Referral (active user) | 4 |

---

### 4.6 Viral Growth Engine (G5) — Phase 3c

**Research basis:** Query 7 (Viral Growth Mechanics)

#### Embeddable Widget (Primary Viral Loop)

Free widget for OSS repos and docs:

```html
<iframe src="https://aos7.tech/embed/crewai" width="300" height="120"></iframe>
```

Shows: product card + rating + stratum position. Links back to aos7.tech.
Every embed = free backlink + SEO + brand impression.

#### Share Mechanics

- "Share this tool" button on every product card → Twitter/LinkedIn/copy link
- Auto-generated og:image per product (dynamic, shows name + stratum + rating)
- Contributor profile pages are shareable (portfolio use case)

#### SEO Strategy

- Individual HTML pages per tool (SSG from products.json) → long-tail keywords
- Schema.org Product markup for rich snippets
- Target keywords: "[tool name] alternatives", "best AI agent frameworks 2026"
- Sitemap.xml auto-generated

---

## 5. The 90-Day Launch Plan

### Days 1-30: Foundation (Phase 3a)

| Week | Milestone | Key Deliverables |
|------|-----------|-----------------|
| 1 | Firebase Auth + Firestore setup | GitHub OAuth working, user collection, basic profile page |
| 2 | Tool submission flow | Form, pending queue, admin approval UI |
| 3 | Review & rating system | Stars, sliders, pros/cons, moderation queue |
| 4 | Pre-launch polish | og:image, CONTRIBUTING.md, 1k email waitlist started |

### Days 31-60: Community (Phase 3b)

| Week | Milestone | Key Deliverables |
|------|-----------|-----------------|
| 5 | Gamification v1 | XP tracking, levels, 5 core badges, profile page |
| 6 | Taxonomy governance | Proposal flow, voting, role ladder |
| 7 | Launch prep | Seed 100+ community tools, 50+ reviews, testers |
| 8 | **LAUNCH DAY** | PH + HN + Reddit + Twitter + Newsletters |

### Days 61-90: Growth (Phase 3c)

| Week | Milestone | Key Deliverables |
|------|-----------|-----------------|
| 9 | Embeddable widget | Widget system, embed pages, backlink tracking |
| 10 | Founders Pool | Public page, contribution weights, eligibility |
| 11 | SEO push | Individual tool pages (SSG), sitemap, schema markup |
| 12 | Second wave | v1.1 announcement, contests, newsletter features |

---

## 6. Launch Day Playbook (Day ~56)

### T-7 days

- [ ] Finalize PH page (video, GIFs, description)
- [ ] Email 500+ waitlist: "Launching next week"
- [ ] DM 20 dev influencers with preview link
- [ ] Queue Reddit posts for r/SideProject, r/artificial, r/MachineLearning

### Launch Day (T+0)

- **12:01 AM PST:** Product Hunt goes live
- **12:15 AM:** Tweet from main + personal accounts
- **7 AM PST:** Post "Show HN: {a}OS Explorer — The OSI Model for AI"
- **8 AM:** Reddit cross-posts go live
- **9 AM-12 PM:** Respond to every PH comment, HN comment, Reddit comment
- **12 PM:** Share early metrics tweet ("200 upvotes in 6 hours")
- **3 PM:** Email waitlist: "We're live! Help us hit #1"
- **6 PM:** Post LinkedIn article (for non-dev audience)
- **11 PM:** Day 1 recap tweet with screenshots

### T+7: Second Wave Prep

- [ ] Publish "What we learned launching" blog post
- [ ] Submit to dev newsletters (TLDR, Software Lead Weekly)
- [ ] Announce v1.1 with user-requested feature

---

## 7. Tech Debt & Migration Path

| From | To | When |
|------|-----|------|
| Single explorer.html | Multi-page static site | Phase 3a Week 1 |
| Inline JS product data | Firestore `products` collection | Phase 3a Week 2 |
| No auth | GitHub OAuth (Firebase Auth) | Phase 3a Week 1 |
| Manual deploys | GitHub Actions CI/CD | Phase 3a Week 1 |
| Firebase Hosting only | Firebase Hosting + Firestore + Auth | Phase 3a Week 1 |

---

## 8. Non-Goals (Phase 3)

- No paid tier / monetization (free-only for first 6 months)
- No native mobile app
- No real-time chat / Discord integration (use GitHub Discussions)
- No AI-powered features yet (recommendation engine is Phase 4)
- No self-hosted option

---

## 9. Risks

| Risk | Mitigation |
|------|-----------|
| Spam submissions | GitHub OAuth + rate limits + moderation queue |
| Gaming the XP system | 80% approval gate + decay + clawback |
| Legal exposure from "Founders Pool" language | Aspirational only, no dollar amounts, legal review before launch |
| Low initial contribution volume | Seed with 100+ agent tools ourselves before launch |
| SEO takes months | Supplement with paid channels (PH, newsletters) for early traffic |

---

## 10. Research Sources

All findings from Perplexity sonar-pro deep research (April 2026):

1. **Crowdsourced Tool Collection** — seed strategy, PR workflow, growth inflection
2. **Review & Rating Systems** — G2/Capterra patterns, weekend-shippable spec
3. **Community Taxonomy** — Wikipedia/SO/OSM governance models
4. **Wikipedia-style Collaboration** — Notion-like DB vs wiki comparison matrix
5. **Developer Gamification** — GitHub/SO/Dev.to/freeCodeCamp patterns, anti-backfire
6. **Incentive/Compensation** — Gitcoin/SourceCred/bounties, ethical framework
7. **Viral Growth Mechanics** — PH/HN/Reddit/Twitter/SEO/newsletter playbooks

---

## Appendix A: Daily Task Queue (Sick-Day Mode)

> **Instructions:** Do ONE task per day. Each is ≤30 minutes of YOUR effort.
> I (Copilot) will do the heavy lifting when you come back.
> Check off when done. Skip to the next if blocked.

### Week 1: Setup & Auth

- [ ] **Day 1 `🧑 HUMAN` (~5 min, one session):** All console setup in one shot:
  1. Firebase Console → aos-explorer → **Authentication** → Sign-in method → Enable **GitHub**. Note the callback URL it shows.
  2. github.com/settings/developers → **New OAuth App** → paste the callback URL → copy Client ID + Client Secret back into Firebase.
  3. Firebase Console → **Firestore Database** → Create database → Start in test mode → `us-east1`.
- [ ] **Day 2 `🤖 AGENT`:** Provision Firestore indexes/rules via CLI (`firebase init firestore` + `firebase deploy --only firestore`). Wire up Firebase Auth + Firestore in the frontend code. Deploy to aos7.tech. *(No new keys needed — same Firebase project.)*
- [ ] **Day 3 `🧑 HUMAN`:** Test: visit aos7.tech, click "Sign In", complete GitHub OAuth, see your name. Confirm it works or report what broke.
- [ ] **Day 4 `🤖 AGENT`:** Build the tool submission form mockup. `🧑 HUMAN:` Approve or request changes.

### Week 2: Submissions

- [ ] **Day 5 `🤖 AGENT`:** Build the submission form + pending queue. `🧑 HUMAN:` Submit 3 test tools yourself and screenshot any bugs.
- [ ] **Day 6 `🤖 AGENT`:** Fix bugs + draft CONTRIBUTING.md. `🧑 HUMAN:` Approve or tweak the draft.
- [ ] **Day 7 `🧑 HUMAN`:** Seed day: submit 10 real AI tools using the form (pick from Phase 2 PRD candidate list). Copy-paste from their websites.
- [ ] **Day 8 `🧑 HUMAN`:** Seed day 2: submit 10 more tools.
- [ ] **Day 9 `🤖 AGENT`:** Build moderation/approval UI. `🧑 HUMAN:` Approve 5 of your test submissions.

### Week 3: Reviews

- [ ] **Day 10 `🤖 AGENT`:** Ship the review form. `🧑 HUMAN:` Write 3 reviews on tools you actually know. Screenshot any UX issues.
- [ ] **Day 11 `🤖 AGENT`:** Fix reported issues. `🧑 HUMAN:` Verify fixes + write 2 more reviews.
- [ ] **Day 12 `🧑 HUMAN`:** Write a 1-paragraph "How to write a good review" guide. I'll put it in the review form as a tooltip.
- [ ] **Day 13:** REST DAY. Sleep.
- [ ] **Day 14 `🧑 HUMAN`:** Quick check: look at the site, see if reviews show up correctly on product cards. Thumbs up or list issues.

### Week 4: Polish & Pre-launch

- [ ] **Day 15 `🤖 AGENT`:** Add og:image meta tags (dynamic per product). `🧑 HUMAN:` Share a product page link on Twitter/Slack and check the preview card looks right.
- [ ] **Day 16 `🤖 AGENT`:** Draft the launch tweet + add analytics (Plausible or GA — tell me which). `🧑 HUMAN:` Post the tweet.
- [ ] **Day 17 `🧑 HUMAN`:** Write 3 bullet points for the Product Hunt page. I'll format the rest.
- [ ] **Day 18 `🧑 HUMAN`:** Final pre-Phase-3b review. Look at the site. List your top 3 annoyances. I'll fix them.

### Weeks 5-8: I'll queue these when we finish Week 4

The pattern continues: **you do lightweight review/seed/approve tasks, I build features and fix bugs between your check-ins.**
