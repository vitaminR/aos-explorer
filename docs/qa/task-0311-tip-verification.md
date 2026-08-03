# task-0310 / task-0311 — tip verification

Run by fable/**Terra** (Quality-LT) 2026-08-03, prime-side, on Commander order 09:45Z.
All results are from RENDERED pages driven in real Chrome, not from reading source.

## 1. The ordered SHA is stale — merge 3cec81a, not 5883bda

The order named `5883bda` as the 0311 tip. It is not the tip. `3cec81a` is its descendant
on `origin/grok/task-0311-sec-closeout` (`git merge-base --is-ancestor 5883bda 3cec81a`
returns true). Neither is on `main`.

`5883bda` carries two broken gates:

- **Server.** The denylist is written as
  `!country.matches('(?i).*(china|\bcn\b|\bprc\b|russia|\bru\b|iran|\bir\b|north.?korea|\bkp\b|\bdprk\b).*')`.
  In a CEL string literal `\b` is a BACKSPACE character, not a regex word boundary, so six of
  the ten alternatives can never match. CN, PRC, RU, IR, KP and DPRK all pass.
- **Client.** `isAllyOrigin` uses
  `NON_ALLY_COUNTRIES.some(c => normalized === c || normalized.includes('CHINA') || normalized.includes('RUSSIA'))`.
  The two `includes` calls do not depend on `c`, so the predicate collapses to
  *exact match OR contains CHINA OR contains RUSSIA*. Measured leaks 5/15: `P.R.C.`,
  `Iranian`, `Iran, Islamic Republic of`, `DPRK`, `Korea, Democratic Peoples Republic of`.

Merging `5883bda` as the rules root would ship both and revert `3cec81a`.

## 2. The real tip 3cec81a holds up

Server: denylist replaced by an anchored allowlist `^(us|usa|...|cyprus)$` with size bounds —
fail-closed by construction, so it does not depend on `\b` behaving.

Client MUST-DENY suite, 23 cases including empty string, whitespace, `null`, `undefined`, a
number, an object, 1-char and 200-char inputs: **0 leaked**.

### One false positive (one-line fix, not a merge block)

    'U.S.'           -> normalized 'U S '           -> DENIED
    'U.K.'           -> normalized 'U K '           -> DENIED
    'Japan.'         -> normalized 'JAPAN '         -> DENIED
    'united states.' -> normalized 'UNITED STATES ' -> DENIED

`.trim()` runs BEFORE `.replace(/[._-]+/g, ' ')`, so a trailing separator becomes a space that
is never trimmed; dotted forms also fail because the Set holds `US`, not `U S`. Trim AFTER
normalising. It fails closed, so this is a usability defect, not a security one — but it tells
an American who typed `U.S.` that they are an Ally-Only policy violation.

## 3. axe-508 — ZERO NEW criticals (criterion met)

Baselined against `main` with the same harness, because "zero NEW" is meaningless without a
before.

| page | tip criticals | base criticals |
|---|---|---|
| explorer.html | aria-allowed-attr(2), aria-required-parent(7) | identical |
| index, build, docs, embed, health | none | none |

All six pages HTTP 200, zero uncaught page errors. `embed.html` is clean at every impact.
The nine critical nodes on `explorer.html` are pre-existing on `main`; this branch neither adds
nor removes one. They remain real defects worth their own ticket — `aria-required-parent` plus
`nested-interactive(7)` is screen-reader-breaking on the primary browse surface.

**No contrast regression.** A first run suggested +4 nodes on index.html. Three runs per side
gave TIP 170/169/169 and BASE 169/165/169 — neither side stable, delta inside the noise band.

## 4. Empty states — FAILS the empty-vs-zero rule

Signed out, `localStorage` cleared, rendered: **52 visible elements displaying a bare `0`**,
all `class="vote-count"`.

    js/firebase-community.js:250   btn.innerHTML = ...<span class="vote-count">0</span>
    js/firebase-community.js:267   if (el) el.textContent = d.data().count ?? 0;

Line 250 stamps a literal `0` into every vote button at creation; line 267 overwrites it only
for products the query returned, and `?? 0` fabricates a zero for a doc missing the field. Any
tool with no vote document — and every tool if the query fails, the user is signed out, or
Firestore is slow — displays `0` permanently, indistinguishable from a genuine zero.

The page already knows the right pattern: `explorer.html:33281` initialises
`panelVoteCount` to `loading…`.

Fix, two lines: initialise to a neutral placeholder with `data-loaded="0"`, and write the
numeral only when `typeof count === 'number'`.

Correct by measurement: all seven watch buttons render `☆ Watch` with no phantom state, and the
trending banner stays hidden when there is nothing to trend.

## Reproduce

See `tools/qa/README.md`. Every check is re-runnable; nothing here is a judgement call.
