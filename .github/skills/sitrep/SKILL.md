---
name: sitrep
description: "Full system situation report - sweeps prime, WARROOM, Routa, crews, and services. Phone-safe. Invoke via /sitrep."
---

> **PREAMBLE** | Type: skill | Status: active
> Owner: nymil | Updated: 2026-06-26 | Slash: /sitrep
> Full system situation report — single source of truth sweep across prime, WARROOM, Routa, crews, and services. Phone-safe output.

# /sitrep

Sweep every live data source and return a plain-English situation report. No assumptions, no memory — everything is pulled fresh. Designed to be asked from a phone when you can't reach the dashboard.

## When to run
- Any time you say "sitrep", "how's everything going?", "what's the status?", "give me a sitrep", or similar
- Morning check-in
- After waking up / returning from AFK
- Anytime you suspect something is stuck or split-brained

## Execution steps (run in order, in parallel where noted)

### 0. Prime reachability
```powershell
& "C:\Users\nymil\Codepro\0.agentic\scripts\session-start.ps1"
```
If prime is unreachable: report `PRIME: OFFLINE` and skip steps that require SSH. Still report local state.

### 1. WARROOM (parallel with steps 2–4)
```bash
ssh kotana-prime "tail -80 /root/Codepro/0.agentic/00_Ledger/WARROOM.md"
```
Extract and report:
- Open CLAIMs (agent handle + area)
- Any active deploy locks (`deploy:<target>`)
- Any CHALLENGE or BLOCKED entries
- PM identity + lease freshness (last heartbeat timestamp)
- Any SPLIT-BRAIN signals (two agents claiming `role:pm`)

### 2. Routa ticket lanes (parallel)
```bash
ssh kotana-prime "python3 /root/Codepro/0.agentic/codepro_tools/agentic/cli.py task list"
```
Report:
- Count per lane: pending / dev / verify / done
- Any ticket stuck in `dev` > 48h (flag by name)
- Any ticket with `blocked_by` unresolved

### 3. Crew presence (parallel)
```bash
ssh kotana-prime "python3 /root/Codepro/0.agentic/scripts/crew_presence.py board"
```
Report:
- Live agents (heartbeat < 2 min)
- Stale agents (2–15 min)
- Cold agents claiming active status ("cold claims active!" = flag)
- Any agent holding a deploy lock that is cold

### 4. Service health (parallel)
Check each endpoint:
- Kotana dashboard: `https://kotana-prime.tail81873b.ts.net:11000` → expect HTTP 200
- AutoBudget prod: `https://autobudget.money` → expect HTTP 200
- AutoBudget API: `https://api.autobudget.money/health` → expect HTTP 200 (if endpoint exists)

For each: report OK / DEGRADED / DOWN.

### 5. Split-brain check
From WARROOM + crew_presence data:
- More than one agent holding `role:pm` → SPLIT-BRAIN
- PM lease heartbeat > 15 min AND no WARROOM post in that window → STALE PM
- Two agents with overlapping CLAIMs on same file/area → CONFLICT
- Any deploy lock held by a cold agent → GHOST LOCK

### 6. Dead-drop (always check, regardless of prime status)
```powershell
python "C:\Users\nymil\Codepro\0.agentic\scripts\dead_drop.py" read --last 10
python "C:\Users\nymil\Codepro\0.agentic\scripts\dead_drop.py" read --type ALERT --unsynced
```
Report:
- Any unsynced ALERT entries
- Any unsynced HANDOFF entries directed at agents
- Count of unsynced entries total (if > 0 and prime is up → needs sync)

### 7. Local git hygiene (laptop-side)
```powershell
cd C:\Users\nymil\Codepro\0.agentic; git status --short
```
Flag: uncommitted files in 00_Ledger/, Skills/, scripts/ that look like shipped work (not temp/scratch).

## Output format

Render as a compact, phone-readable block. Use plain words, no glyph overload.

```
SITREP — YYYY-MM-DD HH:MM

PRIME       ✓ reachable  |  ✗ OFFLINE
WARROOM     N open claims | deploy: <target or none> | PM: <handle> (fresh/stale)
ROUTA       N pending / N dev / N verify  [FLAG: <name> stuck >48h if any]
CREWS       N live / N stale  [FLAG: cold-claims-active if any]
SERVICES    Kotana ✓  |  AB prod ✓  |  AB API ✓
SPLIT-BRAIN none  |  DETECTED: <description>
DEAD-DROP   clean  |  N unsynced entries  [ALERTS: list if any]
GIT (local) clean  |  N uncommitted files in brain

ATTENTION ITEMS:
- <only list things that need your eyes; omit section if nothing>

All clear. / N items need attention.
```

If prime is offline, show what you CAN check locally and label every skipped check `[SKIPPED — prime offline]`.

## Rules
- Pull everything fresh — never answer from memory or prior session context
- If a check fails (SSH timeout, 404, etc.), report the failure; do not fabricate a pass
- Keep the output under 30 lines — if detail is needed on a specific item, wait for the user to ask
- No shield glyph, no achievement emoji — plain text only

## Model tier
Reasoning (Sonnet) — requires SSH, HTTP checks, and data synthesis across multiple sources.
