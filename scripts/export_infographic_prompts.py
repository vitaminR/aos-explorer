"""One-shot exporter: generates NotebookLM source doc + all 63 infographic prompt files."""

import json, re
from collections import OrderedDict
from pathlib import Path

with open("_primitives_inventory.json", "r", encoding="utf-8") as f:
    primitives = json.load(f)

constructs = OrderedDict()
for p in primitives:
    key = f"{p['layer']} | {p['parent']}"
    constructs.setdefault(key, []).append(p)

LAYER_NAMES = {
    "L7": "Human Interface",
    "L6": "Governance",
    "L5": "Observability",
    "L4": "Orchestration",
    "L3": "Capabilities",
    "L2": "Knowledge & Retrieval",
    "L1": "Infrastructure",
}
LAYER_COLORS = {
    "L7": "#818cf8",
    "L6": "#fb7185",
    "L5": "#fbbf24",
    "L4": "#34d399",
    "L3": "#38bdf8",
    "L2": "#a78bfa",
    "L1": "#94a3b8",
}
LAYER_DESCS = {
    "L7": "Human-facing interaction: intent parsing, session state, feedback",
    "L6": "Security, policy enforcement, guardrails, compliance, audit",
    "L5": "Logging, metrics, evaluation, cost tracking, drift detection",
    "L4": "Multi-agent coordination, task routing, state management",
    "L3": "Tool use, code execution, APIs, browser, file system, messaging",
    "L2": "Search, embeddings, chunking, reranking, retrieval",
    "L1": "Model serving, tokenization, GPU infra, fine-tuning",
}

# === 1. NotebookLM source document ===
nlm_path = Path("docs/aOS_primitives_for_notebooklm.md")
nlm_path.parent.mkdir(parents=True, exist_ok=True)

with open(nlm_path, "w", encoding="utf-8") as f:
    f.write("# {a}OS Agentic Operating System - Complete Primitive Reference\n\n")
    f.write(
        "This document contains all 312 primitives from the {a}OS 7-layer reference model, "
        "grouped by parent construct. Each primitive is a named, typed building block "
        "that agentic systems use at a specific layer of the stack.\n\n"
    )
    f.write(
        "## Layer Overview\n\n| Layer | Name | Description |\n|-------|------|-------------|\n"
    )
    for layer in ["L7", "L6", "L5", "L4", "L3", "L2", "L1"]:
        f.write(f"| {layer} | {LAYER_NAMES[layer]} | {LAYER_DESCS[layer]} |\n")
    f.write("\n---\n\n")
    for layer in ["L7", "L6", "L5", "L4", "L3", "L2", "L1"]:
        f.write(f"## {layer} - {LAYER_NAMES[layer]}\n\n")
        for key, prims in constructs.items():
            if not key.startswith(layer):
                continue
            parent = prims[0]["parent"]
            f.write(f"### {parent}\n\n")
            f.write(
                f"Parent construct in {layer} ({LAYER_NAMES[layer]}). Contains {len(prims)} primitives.\n\n"
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
    "- Use the layer accent color as the primary highlight\n"
    "- Clean, minimal layout - no clutter\n"
    "- Large readable typography (minimum 14pt equivalent)\n"
    "- Each primitive shown as a distinct card/node with its name + 1-line description\n"
    "- Show relationships between primitives with arrows or connectors if applicable\n"
    "- Include a small icon or visual metaphor for each primitive\n"
    '- Include the layer badge (e.g. "L4 . Orchestration") in the top-left corner\n'
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
    layer = prims[0]["layer"]
    parent = prims[0]["parent"]
    layer_name = LAYER_NAMES.get(layer, "Unknown")
    color = LAYER_COLORS.get(layer, "#888")
    prim_lines = [
        f"  - **{p['name']}**: {p.get('desc', 'No description.')}" for p in prims
    ]
    prompt = (
        f'Create an infographic for the "{parent}" construct from the {{a}}OS reference model.\n\n'
        f"LAYER: {layer} - {layer_name}\nACCENT COLOR: {color}\nCONSTRUCT: {parent}\n"
        f"PRIMITIVE COUNT: {len(prims)}\n\nPRIMITIVES (show each as a card/node):\n"
        + "\n".join(prim_lines)
        + f'\n\nVISUAL GUIDANCE:\n- Title: "{parent}" in large text, colored {color}\n'
        f'- Layer badge: "{layer} . {layer_name}" top-left\n'
        f"- Show all {len(prims)} primitives as connected cards on dark (#0a0a0f) background\n"
        f"- Use {color} accent for borders, connectors, and highlights\n"
        f"- Each card: primitive name (bold) + 1-line description (smaller)\n"
        f"- If primitives have a natural flow or hierarchy, show it with arrows\n"
        f"- Keep it clean, scannable, ADHD-friendly - no walls of text"
    )
    all_prompts[key] = prompt

# Individual .txt files
for i, (key, prompt) in enumerate(all_prompts.items(), 1):
    layer_slug = key.split(" | ")[0].lower()
    parent_slug = re.sub(r"[^a-z0-9]+", "-", key.split(" | ")[1].lower()).strip("-")
    with open(
        out_dir / f"{i:02d}_{layer_slug}_{parent_slug}.txt", "w", encoding="utf-8"
    ) as f:
        f.write(f"SYSTEM PROMPT:\n{SYSTEM_PROMPT}\n\nUSER PROMPT:\n{prompt}\n")

# Combined markdown
combined = out_dir / "_ALL_PROMPTS.md"
with open(combined, "w", encoding="utf-8") as f:
    f.write("# {a}OS Infographic Prompts - All 63 Constructs\n\n")
    f.write("Generated from 312 primitives across 7 layers.\n\n")
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
