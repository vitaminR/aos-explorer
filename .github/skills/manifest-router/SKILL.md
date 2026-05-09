---
name: manifest-router
description: "Read the workspace manifest for zero-overhead routing. One file replaces cold-start reads of soul.md + registry.json + CLAUDE.md. Use --update to regenerate the manifest after adding repos or skills."
model_tier: fast
---

# /manifest-router — Workspace Manifest Router

## What it is

`WORKSPACE_MANIFEST.json` is a single dense JSON file that replaces the multi-file cold-start read pattern.

**Token savings:** Reading the manifest (~4 KB) instead of soul.md + registry.json + CLAUDE.md saves approximately 80% of cold-start tokens for routing decisions.

**Location:** `0.agentic/00_Ledger/WORKSPACE_MANIFEST.json`

---

## Mode 1 — Route (default)

When invoked with a request or topic, read the manifest and return a routing decision in under 5 lines:

```
Read: 0.agentic/00_Ledger/WORKSPACE_MANIFEST.json

ROUTE → <skill or repo>
MODEL: fast | reasoning
ENTRY: <single file to open next if needed>
```

Do not read any other file before routing unless the manifest has `"status": "reference"` on the matched repo (in which case, read its `entry` file).

---

## Mode 2 — Update (`/manifest-router --update`)

Regenerate `WORKSPACE_MANIFEST.json` by scanning:

1. `0.agentic/Skills/registry.json` — active skills (exclude `_deleted` entries)
2. Top-level repo dirs in `C:/Users/nymil/Codepro/` — list with `Get-ChildItem -Directory`
3. `0.agentic/00_Ledger/NORTH_STAR.md` — current goal stack
4. `0.agentic/00_Ledger/g1_feedback_log.jsonl` (last 5 lines) — stall detection

Update the `goals[*].status` fields with fresh stall data.
Update `_meta.generated` to today's date.
Overwrite `WORKSPACE_MANIFEST.json` in place.

---

## When to use the manifest vs full reads

| Situation | Action |
|-----------|--------|
| User asks which skill/repo handles X | Read manifest only |
| User asks for session orientation | Read manifest only |
| User is working inside a specific repo | Read that repo's entry file (listed in manifest) |
| User asks for skill step-by-step instructions | Read `0.agentic/Skills/<name>/SKILL.md` |
| Manifest `generated` date > 7 days ago | Run `--update` before routing |

---

## Hard rules

- Never read `registry.json` for routing if the manifest is current (< 7 days old).
- Never read `soul.md` for routing. The manifest's `repos` table is the routing surface.
- After adding a new repo or skill, run `--update` immediately.
- The manifest does not replace SKILL.md files — it routes to them. Read the SKILL.md when execution details are needed.
