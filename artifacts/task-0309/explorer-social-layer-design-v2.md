# task-0309 — Explorer Social Layer Design v2 (grounded bridge to PRD Phase 3)

**Author:** cid (Commander hands-on, night op 2026-08-02)
**Supersedes:** gemini-2 draft `artifacts/task-0309/explorer-social-layer-design.md` (branch `task-0309-social-design`), disqualified for designing against a Next.js/shadcn stack this repo does not use.
**Verify everything cited here with:** `git grep -n <symbol>` at branch point `origin/main @ 9880c69`.

---

## 1. The key finding: most of this design already exists and is founder-authored

Tonight's founder directive ("make the site social, easy contribution, save stuff to accounts")
is **Phase 3 of the founder's own PRD**: `PRD_Phase3_Community_Growth.md` (2026-04-15, Status: Active).
That PRD already made the architecture decision (§3): **static HTML on Firebase Hosting +
Firebase Auth + Cloud Firestore, no new framework**. This design doc therefore does NOT
re-decide architecture. It adopts the PRD and maps the delta between the PRD and the code
that exists today, sliced into tasks 0310/0311/0312.

## 2. Ground truth — what is already in the repo (verified, file:line)

| Capability | State | Evidence |
|---|---|---|
| Firebase Hosting (static, `public: "."`) | LIVE | `firebase.json:2-3` |
| Firestore security rules, default-deny catch-all | WRITTEN | `firestore.rules:79-81` |
| Tools submissions (pending status, admin approve) | RULES ONLY | `firestore.rules:15-23` |
| Reviews (pending status, owner update) | RULES ONLY | `firestore.rules:26-36` |
| User profiles (owner-only, no delete) | RULES | `firestore.rules:39-47` |
| Vote aggregates + per-user vote records | RULES + UI | `firestore.rules:50-66`, `js/firebase-community.js:362` (`togglePanelVote`) |
| Email waitlist | RULES + UI | `firestore.rules:69-75`, `js/firebase-community.js:42` (`submitWaitlist`) |
| Auth (Google + GitHub sign-in, auth menu) | IMPLEMENTED | `js/firebase-auth.js`, `js/firebase-community.js:27-37` |
| Referral capture (`?ref=`) | IMPLEMENTED | `js/firebase-community.js:21-25` |
| Stratum watchlist (a "save" primitive) | **IMPLEMENTED BUT BROKEN** | see §3 bug |
| Module wired into the page | YES | `explorer.html:38828` loads `js/firebase-community.js` |

## 3. Bug found during this design pass (report, not silently fix)

`js/firebase-community.js:437` (`_firestoreToggleWatch`) and `:427` read/write a
**`watchlists`** collection. That collection has **no match block in `firestore.rules`**,
so the catch-all at `firestore.rules:79-81` denies every read/write. The watch-a-stratum
feature is silently dead against production rules. Fix belongs to task-0310 (it IS the
save-to-account foundation); rules addition below.

## 4. Data model delta (only what is missing)

Keep every existing collection as ruled. Add:

```
// ─── Watchlists / saved items (task-0310) ─
// Doc ID: "{uid}_{itemId}". Owner-only, mirrors user_votes pattern.
match /watchlists/{docId} {
  allow read: if request.auth != null && resource.data.uid == request.auth.uid;
  allow create: if request.auth != null
    && request.resource.data.uid == request.auth.uid
    && request.resource.data.keys().hasAll(['uid', 'itemId', 'itemType', 'savedAt']);
  allow delete: if request.auth != null && resource.data.uid == request.auth.uid;
  allow update: if false;
}
// ─── Activity feed (task-0312) ─
// Written ONLY by admin/moderation action (approve), public read.
match /activity/{eventId} {
  allow read: if true;
  allow create, update, delete: if isAdmin();
}
```

`itemType in {tool, stratum, view}` covers "save stuff" generically. No new PII anywhere:
profile stays uid + display handle; email only via the existing waitlist opt-in
(anything beyond = FOUNDER DECISION, per ticket rails).

## 5. Build slices (what each ticket actually does now)

**task-0310 — accounts + saves (smallest real gap):**
1. Add `watchlists` rules block (above) — this alone un-breaks the existing watch feature.
2. Generalize `_firestoreToggleWatch` to tools/views (itemType field), add a "Saved"
   panel listing the user's watchlist docs on sign-in.
3. AC: sign-in/out on preview channel; save/unsave + saved list persists per account;
   axe-508 zero new criticals (branch from `cid/a11y-aria-critical-fix @ 2bb6270` so the
   cleared criticals stay cleared); Argus AA numbers for new UI.

**task-0311 — contribution + moderation (rules exist, UI does not):**
1. Suggest-a-tool form (signed-in) writing `tools` docs with `status: 'pending'`,
   `submittedBy: uid` — exactly what `firestore.rules:17-20` already enforces.
   Origin/vendor field REQUIRED (ally-only gate happens at review).
2. Admin review view (isAdmin) to flip `pending -> approved` / reject; approval also
   writes an `activity` event (feeds 0312).
3. Nothing renders publicly unless `status == 'approved'` — already rule-enforced
   (`firestore.rules:16`); the UI must simply never query pending as public. QA charter
   asserts this adversarially.

**task-0312 — return hooks (needs 0310 auth + 0311 approvals):**
1. Recent-activity strip on the Explorer reading the `activity` collection (real,
   approval-generated events only — honest empty state when none).
2. Stars = the existing `votes`/`user_votes` pair (`firestore.rules:50-66`), surfaced on
   tool cards. One vote per user per item is already the doc-ID design.

## 6. What I deliberately did NOT include

- No Cloud Functions yet (PRD lists them as "if needed"; nothing above requires one —
  moderation is a ruled client view. Rate limiting can ride rules quotas first).
- No gamification/XP (PRD Phase 3b; not in tonight's tickets).
- No new pages/frameworks; everything progressive-JS on the existing static file, which
  is the PRD's own §3 decision.
- No prod deploy: preview channels only, prod is founder-gated (night-op rail).

## 7. Accessibility (WCAG AA) — all five signed-in surfaces

This section satisfies AC3's a11y requirement. All new UI introduced by tasks 0310–0312 must
meet WCAG 2.1 AA. Specific requirements per surface:

### 7.1 Sign-in surface (task-0310)

- **Button copy/voice:** "Sign in with Google" / "Sign in with GitHub" — named by provider for
  screenreader clarity; no "Click here" or icon-only buttons.
- **Focus management:** on auth modal open, focus moves to the first interactive element
  (sign-in heading or first button); on close/dismiss, focus returns to the trigger element.
- **Error state:** auth failure rendered as an ARIA `role="alert"` region — never a silent
  visual-only flash. Error copy names the failure: "Sign-in failed. Try again or use a
  different account."
- **Contrast:** all text and interactive affordances ≥ 4.5:1 against background (body);
  large text/icons ≥ 3:1. Verify with axe-508 (zero new criticals, per task-0305 baseline).
- **Empty-vs-zero state:** sign-in surface has no numeric state. N/A.

### 7.2 Saved / bookmarks list surface (task-0310)

- **Empty state (zero items saved):** render an explicit empty state — never a blank panel or
  `$0`-equivalent silence. Copy: "Nothing saved yet — star any tool or stratum to see it here."
  This copy is screenreader-readable and is not a loading spinner left in place.
- **Zero-vs-loading distinction:** while the watchlist fetch is in-flight, render a skeleton
  or "Loading saved items…" status, not the empty-state copy. Once resolved with zero results,
  swap to the empty-state message. These are two distinct states and must not be merged.
- **List semantics:** saved items rendered as `<ul>/<li>` (or equivalent ARIA `role="list"`)
  with each item having a visible label and a named remove affordance ("Remove from saved",
  not an unlabeled `×`).
- **Contrast / interactive affordances:** same AA floor as §7.1.

### 7.3 Contribution form surface (task-0311)

- **Form labels:** every input has an explicit `<label for="…">` (or `aria-label` for icon-only
  controls). No placeholder-only labeling — placeholder disappears on focus and fails
  screenreaders.
- **Required fields:** marked with both a visual indicator (`*`) and `aria-required="true"`.
  The legend or a page-level note explains that `*` means required.
- **Inline validation:** errors rendered adjacent to the field they describe, linked via
  `aria-describedby`, and surfaced in an ARIA live region so screenreader users hear the error
  without manually scanning the form. Error copy is actionable: "Tool name is required."
  not "Invalid input."
- **Submit-success state:** on successful submission, render a confirmation message in an
  `aria-live="polite"` region. Copy: "Your suggestion was submitted and is pending review."
  Do not silently redirect or clear the form.
- **Empty-vs-zero:** the ally-only origin/vendor field must never auto-fill or auto-populate —
  it must be explicitly entered. An empty submission is blocked at the rules layer and at the
  form layer (disabled Submit when required fields are unfilled).

### 7.4 Moderation view surface (task-0311)

- **Scope:** admin-only surface (`isAdmin()` rule). A11y requirements apply equally — admins
  may use assistive technology.
- **Table / list semantics:** pending submissions rendered as a proper `<table>` (with `<th>`
  headers and `scope` attributes) or an accessible `role="list"` pattern — not a grid of `<div>`s
  with no semantic structure.
- **Action buttons:** approve / reject actions labeled by submission, not just "Approve" in a
  column. Pattern: `aria-label="Approve: <tool name>"`. Prevents ambiguous repetitive labels.
- **Status feedback:** approve/reject action result announced via `aria-live="polite"`. Copy:
  "Tool '<name>' approved." / "Tool '<name>' rejected." — never silent.
- **Empty state (no pending submissions):** explicit copy: "No submissions pending review."
  Never a blank table or zero-row rendered silently.

### 7.5 Activity feed surface (task-0312)

- **Empty state (no approved activity yet):** render an honest empty state — not a hidden
  section, not a zero-count badge. Copy: "No recent activity yet — approved contributions
  appear here." This avoids the empty-vs-zero failure where a blank feed reads as
  "nothing happened" versus "not loaded" versus "nothing exists yet."
- **Feed semantics:** activity events rendered as `<ul>/<li>` with each event containing a
  visible timestamp and human-readable description. Timestamps in `<time datetime="…">` for
  machine-readability.
- **No fabricated activity:** the feed shows ONLY admin-approved events (§5, task-0312).
  An honest zero state is preferable to synthetic filler. This is both a privacy-minimal
  requirement and an a11y voice requirement — screenreader users should not encounter
  fabricated or test data in production.
- **Contrast / interactive affordances:** same AA floor as §7.1.

### 7.6 Cross-cutting requirements (all five surfaces)

| Requirement | Standard | How verified |
|---|---|---|
| Text contrast ≥ 4.5:1 (body) / ≥ 3:1 (large/icons) | WCAG 2.1 AA 1.4.3 / 1.4.11 | axe-508 zero new criticals + Argus-measured AA per task-0305 baseline |
| Keyboard navigable, no keyboard trap | WCAG 2.1 AA 2.1.1 / 2.1.2 | Manual tab-walk on preview channel |
| Focus visible on all interactive elements | WCAG 2.1 AA 2.4.7 | axe-508 + visual QA |
| All images / icons have text alternatives | WCAG 2.1 AA 1.1.1 | axe-508 |
| No content flashes > 3× per second | WCAG 2.1 AA 2.3.1 | Design-time rule (no animation beyond static JS patterns) |
| Error identification in text | WCAG 2.1 AA 3.3.1 | axe-508 + QA charter |
| Labels / instructions for inputs | WCAG 2.1 AA 3.3.2 | axe-508 |

**Ally-only gate (cross-cutting):** the contribution form origin/vendor field (task-0311) is
the ally-only enforcement point. A11y does not relax this gate — an accessible form that accepts
non-ally submissions is still a rules violation. The Firestore rule is the authoritative check;
the form label and help text make the requirement legible to the contributor.

**Privacy-minimal (cross-cutting):** no new PII surfaces are introduced in these five UIs.
Display names are uid-derived handles; email is waitlist-only opt-in. Any expansion beyond
that is a FOUNDER DECISION per ticket rails (flagged, not decided here).

## 8. Review gates before implementation

1. Setzer (Security-LT): adversarial pass on §4 rules delta (prove default-deny survives;
   attack the moderation path; PII minimization check). Trigger: this doc posted.
2. Shinra (Quality-LT): QA charter alignment (already ordered).
3. A11y section (§7) is design-time; implementation verification is axe-508 zero new criticals
   + Argus AA on preview channel per task-0310/0311/0312 ACs.
4. Commander acceptance recorded on the ticket, THEN 0310 implementation may start.
