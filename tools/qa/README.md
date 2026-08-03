# QA harness — task-0310 / task-0311 tip verification

Dependency-free apart from what is already on the box. No npm install, no CDN.

    # serve the ref under test (no worktree, no repo mutation)
    rm -rf /tmp/exp-tip && mkdir -p /tmp/exp-tip
    git archive <ref> | tar -x -C /tmp/exp-tip
    cd /tmp/exp-tip && python3 -m http.server 8899 &

    node tools/qa/axe-sweep.mjs         # axe wcag2a/aa + wcag21a/aa + section508, 6 pages
    node tools/qa/empty-state.mjs       # signed-out, storage cleared: bare-zero census
    node tools/qa/axe-stability.mjs     # 3 runs per side — proves whether a delta is real
    node tools/qa/ally-gate-control.mjs # MUST-DENY / MUST-ALLOW suite on the origin gate

Set `BASE` to point a runner at a different port (the baseline server).

## Gotchas that cost time

- `playwright-core` is CommonJS. Use `import pw from '.../index.js'; const { chromium } = pw;`
  — a named import fails.
- The bundled chromium build is MISSING from `~/.cache/ms-playwright` on this box. Always pass
  `executablePath: '/usr/bin/google-chrome'` with `--no-sandbox --disable-dev-shm-usage`.
- axe-core is injected from a local `node_modules` path, never a CDN.
- Compose scripts locally and `scp` them. Writing a heredoc inside a quoted `ssh` argument lets
  backticks and `$` in the content execute remotely; it silently corrupts the file.

## Read this before trusting a number

`axe-stability.mjs` exists because a single axe run on a dynamic page is NOT evidence.
Measured 2026-08-03 on index.html color-contrast: TIP 170/169/169, BASE 169/165/169.
A first-run comparison showed a clean-looking "+4 regression" that does not exist.
Run the stability check before reporting any delta.

Likewise: confirm a finding still exists AT THE TIP before reporting it. A client-side
ally-gate leak measured at 5883bda had already been fixed at 3cec81a.
