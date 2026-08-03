# QA harness — task-0310 / task-0311 tip verification

Dependency-free apart from what is already on the box. No npm install, no CDN.

    # serve the ref under test (no worktree, no repo mutation)
    rm -rf /tmp/exp-tip && mkdir -p /tmp/exp-tip
    git archive <ref> | tar -x -C /tmp/exp-tip
    cd /tmp/exp-tip && python3 -m http.server 8899 &

    node tools/qa/axe-sweep.mjs         # axe wcag2a/aa + wcag21a/aa + section508, 6 pages
    node tools/qa/empty-state.mjs       # signed-out, storage cleared: bare-zero census
    node tools/qa/axe-stability.mjs     # 3 runs per side — proves whether a delta is real
    node tools/qa/ally-gate-control.mjs [ref]   # MUST-DENY / MUST-ALLOW on the origin gate

Set `BASE` to point a runner at a different port (the baseline server). The browser runners
need a server; the gate control does not — it reads the repo directly.

## The gate control reads the repo at run time, on purpose

`ally-gate-control.mjs` extracts `isAllyOrigin` from `js/firebase-community.js` at the ref you
name (default `HEAD`, or `--worktree` for uncommitted code). It does **not** import a snapshot.

A snapshot would keep passing after the real gate changed — the control would be green while
testing code that no longer ships. That is precisely the failure this harness exists to catch,
so it must not be built into the harness.

Two ways it refuses rather than guesses, both deliberate:

- If it cannot find `const ALLY_ORIGIN_CODES` and `function isAllyOrigin`, it exits 2 with
  "FIX THIS CONTROL rather than trusting it". Verified against `5883bda`, which used the older
  denylist shape: the control fails loudly instead of reporting a pass.
- If the allowlist has fewer than 20 entries it exits 2. An allowlist that admits nothing would
  otherwise score a perfect MUST-DENY while being completely broken.

Exit codes: `0` clean, `1` a denied origin was admitted (security failure, break the build),
`2` the control could not run. A MUST-ALLOW false positive prints REVIEW and exits `0` — it
fails closed, so it is a usability defect, not a hole.

## Gotchas that cost time

- `playwright-core` is CommonJS. Use `import pw from '.../index.js'; const { chromium } = pw;`
  — a named import fails.
- The bundled chromium build is MISSING from `~/.cache/ms-playwright` on this box. Always pass
  `executablePath: '/usr/bin/google-chrome'` with `--no-sandbox --disable-dev-shm-usage`.
- axe-core is injected from a local `node_modules` path, never a CDN.
- Compose scripts locally and `scp` them. Writing a heredoc inside a quoted `ssh` argument lets
  backticks and `$` in the content execute remotely; it silently corrupts the file with no error.

## Read this before trusting a number

`axe-stability.mjs` exists because a single axe run on a dynamic page is NOT evidence.
Measured 2026-08-03 on index.html color-contrast: TIP 170/169/169, BASE 169/165/169.
A first-run comparison showed a clean-looking "+4 regression" that does not exist.
Run the stability check before reporting any delta.

Likewise: confirm a finding still exists AT THE TIP before reporting it. A client-side
ally-gate leak measured at `5883bda` had already been fixed at `3cec81a`.
