"""One-shot exporter: generates NotebookLM source doc + all 63 infographic prompt files."""

import json, re
from collections import OrderedDict
from pathlib import Path

with open("_primitives_inventory.json", "r", encoding="utf-8") as f:
    primitives = json.load(f)

constructs = OrderedDict()
for p in primitives:
    key = f"{p['stratum']} | {p['parent']}"
    constructs.setdefault(key, []).append(p)

STRATUM_NAMES = {
    "S7": "Human Interface",
    "S6": "Governance",
    "S5": "Observability",
    "S4": "Orchestration",
    "S3": "Capabilities",
    "S2": "Knowledge & Retrieval",
    "S1": "Infrastructure",
}
STRATUM_COLORS = {
    "S7": "#818cf8",
    "S6": "#fb7185",
    "S5": "#fbbf24",
    "S4": "#34d399",
    "S3": "#38bdf8",
    "S2": "#a78bfa",
    "S1": "#94a3b8",
}
STRATUM_DESCS = {
    "S7": "Human-facing interaction: intent parsing, session state, feedback",
    "S6": "Security, policy enforcement, guardrails, compliance, audit",
    "S5": "Logging, metrics, evaluation, cost tracking, drift detection",
    "S4": "Multi-agent coordination, task routing, state management",
    "S3": "Tool use, code execution, APIs, browser, file system, messaging",
    "S2": "Search, embeddings, chunking, reranking, retrieval",
    "S1": "Model serving, tokenization, GPU infra, fine-tuning",
}

# === 1. NotebookLM source document ===
nlm_path = Path("docs/aOS_primitives_for_notebooklm.md")
nlm_path.parent.mkdir(parents=True, exist_ok=True)

with open(nlm_path, "w", encoding="utf-8") as f:
    f.write("# {a}OS Agentic Operating System - Complete Primitive Reference\n\n")
    f.write(
        "This document contains all 312 primitives from the {a}OS 7-stratum reference model, "
        "grouped by parent construct. Each primitive is a named, typed building block "
        "that agentic systems use at a specific stratum of the stack.\n\n"
    )
    f.write(
        "## Stratum Overview\n\n| Stratum | Name | Description |\n|-------|------|-------------|\n"
    )
    for stratum in ["S7", "S6", "S5", "S4", "S3", "S2", "S1"]:
        f.write(f"| {stratum} | {STRATUM_NAMES[stratum]} | {STRATUM_DESCS[stratum]} |\n")
    f.write("\n---\n\n")
    for stratum in ["S7", "S6", "S5", "S4", "S3", "S2", "S1"]:
        f.write(f"## {stratum} - {STRATUM_NAMES[stratum]}\n\n")
        for key, prims in constructs.items():
            if not key.startswith(stratum):
                continue
            parent = prims[0]["parent"]
            f.write(f"### {parent}\n\n")
            f.write(
                f"Parent construct in {stratum} ({STRATUM_NAMES[stratum]}). Contains {len(prims)} primitives.\n\n"
            )
            for p in prims:
                f.write(f"- **{p['name']}**: {p.get('desc', 'No description.')}\n")
            f.write("\n")
        f.write("---\n\n")

# === 2. Infographic prompts ===
SYSTEM_PROMPT = (
    "You are a visual design assistant creating ADHD-friendly technical infographics "
    "for the {a}OS Agentic Operating System reference model.\n\n"
    "DESIGN RULES:\n"
    "- Dark background (#0a0a0f) with high-contrast text\n"
    "- Use the stratum accent color as the primary highlight\n"
    "- Clean, minimal layout - no clutter\n"
    "- Large readable typography (minimum 14pt equivalent)\n"
    "- Each primitive shown as a distinct card/node with its name + 1-line description\n"
    "- Show relationships between primitives with arrows or connectors if applicable\n"
    "- Include a small icon or visual metaphor for each primitive\n"
    '- Include the stratum badge (e.g. "S4 . Orchestration") in the top-left corner\n'
    "- Parent construct name is the large title\n"
    "- Aspect ratio: 16:9 (landscape)\n"
    "- Style: flat design, subtle gradients, no 3D, modern SaaS dashboard aesthetic\n"
    '- Footer: "{a}OS Reference Model . vitaminR" in small text\n\n'
    "FORMAT: Create a single infographic image. Do NOT return markdown or text descriptions.\n"
)

out_dir = Path("docs/infographic-prompts")
out_dir.mkdir(parents=True, exist_ok=True)

all_prompts = OrderedDict()
for key, prims in constructs.items():
    stratum = prims[0]["stratum"]
    parent = prims[0]["parent"]
    stratum_name = STRATUM_NAMES.get(stratum, "Unknown")
    color = STRATUM_COLORS.get(stratum, "#888")
    prim_lines = [
        f"  - **{p['name']}**: {p.get('desc', 'No description.')}" for p in prims
    ]
    prompt = (
        f'Create an infographic for the "{parent}" construct from the {{a}}OS reference model.\n\n'
        f"STRATUM: {stratum} - {stratum_name}\nACCENT COLOR: {color}\nCONSTRUCT: {parent}\n"
        f"PRIMITIVE COUNT: {len(prims)}\n\nPRIMITIVES (show each as a card/node):\n"
        + "\n".join(prim_lines)
        + f'\n\nVISUAL GUIDANCE:\n- Title: "{parent}" in large text, colored {color}\n'
        f'- Stratum badge: "{stratum} . {stratum_name}" top-left\n'
        f"- Show all {len(prims)} primitives as connected cards on dark (#0a0a0f) background\n"
        f"- Use {color} accent for borders, connectors, and highlights\n"
        f"- Each card: primitive name (bold) + 1-line description (smaller)\n"
        f"- If primitives have a natural flow or hierarchy, show it with arrows\n"
        f"- Keep it clean, scannable, ADHD-friendly - no walls of text"
    )
    all_prompts[key] = prompt

# Individual .txt files
for i, (key, prompt) in enumerate(all_prompts.items(), 1):
    stratum_slug = key.split(" | ")[0].lower()
    parent_slug = re.sub(r"[^a-z0-9]+", "-", key.split(" | ")[1].lower()).strip("-")
    with open(
        out_dir / f"{i:02d}_{stratum_slug}_{parent_slug}.txt", "w", encoding="utf-8"
    ) as f:
        f.write(f"SYSTEM PROMPT:\n{SYSTEM_PROMPT}\n\nUSER PROMPT:\n{prompt}\n")

# Combined markdown
combined = out_dir / "_ALL_PROMPTS.md"
with open(combined, "w", encoding="utf-8") as f:
    f.write("# {a}OS Infographic Prompts - All 63 Constructs\n\n")
    f.write("Generated from 312 primitives across 7 strata.\n\n")
    f.write(f"## System Prompt (shared)\n\n```\n{SYSTEM_PROMPT}\n```\n\n---\n\n")
    for i, (key, prompt) in enumerate(all_prompts.items(), 1):
        count = len(constructs[key])
        f.write(
            f"## {i:02d}. {key} ({count} primitives)\n\n```\n{prompt}\n```\n\n---\n\n"
        )

print(f"Done. {len(primitives)} primitives, {len(all_prompts)} prompts.")
print(f"  NotebookLM source: {nlm_path} ({nlm_path.stat().st_size:,} bytes)")
print(f"  Prompt files:      {out_dir}/ ({len(list(out_dir.glob('*.txt')))} files)")
print(f"  Combined prompts:  {combined}")
