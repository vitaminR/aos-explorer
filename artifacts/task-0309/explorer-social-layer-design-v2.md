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

## 7. Review gates before implementation

1. Setzer (Security-LT): adversarial pass on §4 rules delta (prove default-deny survives;
   attack the moderation path; PII minimization check). Trigger: this doc posted.
2. Shinra (Quality-LT): QA charter alignment (already ordered).
3. Commander acceptance recorded on the ticket, THEN 0310 implementation may start.
