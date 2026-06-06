#!/usr/bin/env python3
"""
One-shot, idempotent seed: add the 6 Dynamic Agent Workflow patterns (+ a parent
concept) as Tier-A concept cards to data/concepts.json.

Source: Mark Kashef "Every Claude Code Dynamic Workflow" (g9b9G8dcS8Y), via
0.agentic/00_Ledger/PRDs/PRD-claude-code-dynamic-workflows.md  (task-0277).

Safe to re-run: skips any slug that already exists. After running, regenerate with
scripts/build_concepts.py and verify with scripts/validate_scaffold.py.
"""
import json
import pathlib

HERE = pathlib.Path(__file__).resolve().parent
CONCEPTS = HERE / "data" / "concepts.json"

SRC = [
    {"label": "Mark Kashef — Every Claude Code Dynamic Workflow (video)",
     "href": "https://www.youtube.com/watch?v=g9b9G8dcS8Y"},
    {"label": "PRD — Claude Code Dynamic Workflows",
     "href": "0.agentic/00_Ledger/PRDs/PRD-claude-code-dynamic-workflows.md"},
]

COMMON = {
    "freshnessTier": "A",
    "lastReviewed": "2026-06-05",
    "reviewPolicy": "quarterly",
    "status": "seed",
    "sources": SRC,
}

NEW = [
    {
        "slug": "dynamic-agent-workflows",
        "name": "Dynamic Agent Workflows",
        "aliases": ["dynamic workflows", "dynamic agent workflows",
                    "multi-agent workflow patterns", "agent orchestration patterns"],
        "shortDefinition": "A family of multi-agent orchestration patterns that spin up fresh, scoped agent harnesses to beat single-context failure modes.",
        "explainer": "Long, complex work inside one context window breaks down structurally: context unwinding (~500-600k tokens), agent laziness (under-delivering on a batch), self-preference bias (an agent grading its own output), and goal drift. Dynamic Agent Workflows replace the single session with scoped sub-agents on fresh contexts, explicit stop conditions, and a separate verifier. The six member patterns are Classify & Act, Fan Out & Synthesize, Adversarial Verification, Generate & Filter, Tournament, and Loop Until Done; they compose (e.g. Fan Out into Adversarial Verification, wrapped in Loop Until Done).",
        "strata": ["L4"],
        "axes": ["Orchestration"],
        "relatedProductIds": [],
        "relatedConceptSlugs": ["harness", "loop-core", "classify-and-act",
                                "fan-out-synthesize", "adversarial-verification",
                                "generate-and-filter", "tournament-pattern",
                                "loop-until-done"],
        "antiPatterns": ["Running long, complex work in a single context window until it unwinds, gets lazy, grades itself, and drifts from the goal."],
        "mitigations": ["Decompose into scoped sub-agents with fresh contexts, explicit stop conditions, and a separate verifier; pick the pattern that matches the failure mode."],
        "confidence": 0.82,
    },
    {
        "slug": "classify-and-act",
        "name": "Classify & Act",
        "aliases": ["classify and act", "router pattern", "triage agent", "receptionist routing"],
        "shortDefinition": "A lightweight classifier routes each input to the correct specialized agent.",
        "explainer": "A cheap 'receptionist' model reads each inbound item, classifies its intent against a strict system prompt, and dispatches it to a trusted, specialized agent (bug, refund, spam, etc.). This keeps any single context small and ensures work reaches the right handler instead of being force-fit into one general session.",
        "strata": ["L4"],
        "axes": ["Orchestration"],
        "relatedProductIds": [],
        "relatedConceptSlugs": ["dynamic-agent-workflows", "harness"],
        "antiPatterns": ["Handling mixed task types in one session bloats context and routes work to the wrong handler."],
        "mitigations": ["Use a cheap classifier model to label intent, then dispatch to a trusted specialized agent per category."],
        "confidence": 0.85,
    },
    {
        "slug": "fan-out-synthesize",
        "name": "Fan Out & Synthesize",
        "aliases": ["fan out and synthesize", "fan-out synthesize", "parallel sub-agents",
                    "map reduce agents", "scatter gather"],
        "shortDefinition": "Split a master task into parallel, mutually-exclusive sub-agents on clean contexts, then merge at a barrier.",
        "explainer": "For heavy research or due diligence, decompose the master task into mutually-exclusive micro-parts (one per folder, lens, or source). Each runs in parallel on a clean context and returns a structured, cited summary. A synthesizer waits at a barrier for all legs to finish, then merges them. This defeats both agent laziness and context unwinding.",
        "strata": ["L4"],
        "axes": ["Orchestration"],
        "relatedProductIds": [],
        "relatedConceptSlugs": ["dynamic-agent-workflows", "loop-until-done"],
        "antiPatterns": ["One agent given a large batch under-delivers and unwinds its context."],
        "mitigations": ["Fan the work out to parallel sub-agents on clean contexts and synthesize their structured, cited outputs at a barrier."],
        "confidence": 0.85,
    },
    {
        "slug": "adversarial-verification",
        "name": "Adversarial Verification",
        "aliases": ["adversarial verification", "devil's advocate agents", "skeptic agents",
                    "claim checking", "cross-examination pattern"],
        "shortDefinition": "Separate skeptic agents test each extracted claim against a strict rubric — the verifier is never the author.",
        "explainer": "To defeat self-preference bias, never let a session grade its own work. An extractor pulls individual claims from the draft; independent devil's-advocate agents each test a claim against a source-of-truth rubric and return pass/fail with the exact reason for any failure. This is the principle behind the shield rule: the verifier must be a different session/model than the builder.",
        "strata": ["L5", "L6"],
        "axes": ["Observability", "Governance"],
        "relatedProductIds": [],
        "relatedConceptSlugs": ["dynamic-agent-workflows", "generate-and-filter"],
        "antiPatterns": ["A session that audits its own output favors its own work and over-grades it (self-preference bias)."],
        "mitigations": ["Extract claims and have independent skeptic agents check each against a source-of-truth rubric, returning pass/fail with reasons."],
        "confidence": 0.86,
    },
    {
        "slug": "generate-and-filter",
        "name": "Generate & Filter",
        "aliases": ["generate and filter", "over-generate then judge", "generator judge",
                    "ideate and rank"],
        "shortDefinition": "Over-generate with one agent, then a separate judge agent filters to the best few by criteria.",
        "explainer": "Creativity stagnates when one agent both ideates and selects. Instead, have a generator produce massive variety (e.g. 500 options), then a separate judge agent score them against explicit criteria and return the top 3-5. The separation is what removes self-bias from selection.",
        "strata": ["L4", "L5"],
        "axes": ["Orchestration", "Observability"],
        "relatedProductIds": [],
        "relatedConceptSlugs": ["dynamic-agent-workflows", "adversarial-verification"],
        "antiPatterns": ["A single agent both ideating and selecting produces low variety and rubber-stamps its own ideas."],
        "mitigations": ["Separate generation from judgment: one agent maximizes variety, a different agent scores against criteria."],
        "confidence": 0.84,
    },
    {
        "slug": "tournament-pattern",
        "name": "Tournament",
        "aliases": ["tournament pattern", "bracket ranking", "pair-wise comparison",
                    "head-to-head ranking", "elo agents"],
        "shortDefinition": "Rank a massive set via pair-wise head-to-heads, a fresh agent per match, winners advancing in a bracket.",
        "explainer": "When the candidate set is too large to compare in one context (thousands of resumes, vendors, titles), run pair-wise comparisons. A fresh agent judges each head-to-head against a rubric; winners advance to the next round, where the rubric may change. The bracket continues until a single champion remains. Fresh agents per match keep every comparison context small and unbiased.",
        "strata": ["L4"],
        "axes": ["Orchestration"],
        "relatedProductIds": [],
        "relatedConceptSlugs": ["dynamic-agent-workflows", "generate-and-filter"],
        "antiPatterns": ["Comparing thousands of items in one context bloats and degrades the comparison."],
        "mitigations": ["Run pair-wise comparisons with a fresh agent per match against a rubric; advance winners through bracket rounds."],
        "confidence": 0.8,
    },
    {
        "slug": "loop-until-done",
        "name": "Loop Until Done",
        "aliases": ["loop until done", "loop-until-done", "unbounded retry loop",
                    "spawn until success", "persistence loop"],
        "shortDefinition": "Spawn fresh isolated attempts with no fixed pass count until a deterministic goal is met — bounded by a guardrail.",
        "explainer": "For elusive or flaky targets (catch a 1-in-50 flaky test, exhaustive search), don't pre-set a pass count. An investigator forms a theory and spawns an isolated work-tree with a fresh agent; a deterministic condition check decides whether the goal was met, looping with a new agent until it is. Critical guardrail: any loop that can reach a metered endpoint MUST be bounded (max-attempts, backoff, circuit breaker, kill-switch) — the unbounded version is the runaway-loop that burned $300 twice.",
        "strata": ["L4"],
        "axes": ["Orchestration"],
        "relatedProductIds": [],
        "relatedConceptSlugs": ["dynamic-agent-workflows", "loop-core", "fan-out-synthesize"],
        "antiPatterns": ["Declaring a task done prematurely, or looping forever with no stop condition (the runaway-loop money burn)."],
        "mitigations": ["Loop fresh isolated attempts until a deterministic goal check passes; always bound metered loops with max-attempts, backoff, and a circuit breaker."],
        "confidence": 0.85,
    },
]


def main():
    data = json.loads(CONCEPTS.read_text(encoding="utf-8"))
    existing = {c["slug"] for c in data["concepts"]}
    added = []
    for card in NEW:
        if card["slug"] in existing:
            continue
        merged = dict(COMMON)
        merged.update(card)
        data["concepts"].append(merged)
        added.append(card["slug"])
    if added:
        CONCEPTS.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n",
                            encoding="utf-8")
    print(f"added {len(added)} concept(s): {', '.join(added) if added else '(none — all present)'}")
    print(f"total concepts now: {len(data['concepts'])}")


if __name__ == "__main__":
    main()
