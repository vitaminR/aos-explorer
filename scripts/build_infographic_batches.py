"""
Generate batch prompt files (5 per batch) for infographic generation,
plus an HTML tracker page to manage progress and download.
"""

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
    '- Include the layer badge (e.g. "L4 · Orchestration") in the top-left corner\n'
    "- Parent construct name is the large title\n"
    "- Aspect ratio: 16:9 (landscape)\n"
    "- Style: flat design, subtle gradients, no 3D, modern SaaS dashboard aesthetic\n"
    '- Footer: "{a}OS Reference Model · vitaminR" in small text\n\n'
    "FORMAT: Create a single infographic image. Do NOT return markdown or text descriptions.\n"
)

# Build all prompts
all_prompts = []
for key, prims in constructs.items():
    layer = prims[0]["layer"]
    parent = prims[0]["parent"]
    layer_name = LAYER_NAMES.get(layer, "Unknown")
    color = LAYER_COLORS.get(layer, "#888")
    prim_lines = [f"  - {p['name']}: {p.get('desc', 'No description.')}" for p in prims]
    slug = re.sub(r"[^a-z0-9]+", "-", parent.lower()).strip("-")
    prompt = (
        f'Create an infographic for the "{parent}" construct from the {{a}}OS reference model.\n\n'
        f"LAYER: {layer} — {layer_name}\nACCENT COLOR: {color}\nCONSTRUCT: {parent}\n"
        f"PRIMITIVE COUNT: {len(prims)}\n\nPRIMITIVES (show each as a card/node):\n"
        + "\n".join(prim_lines)
        + f'\n\nVISUAL GUIDANCE:\n- Title: "{parent}" in large text, colored {color}\n'
        f'- Layer badge: "{layer} · {layer_name}" top-left\n'
        f"- Show all {len(prims)} primitives as connected cards on dark (#0a0a0f) background\n"
        f"- Use {color} accent for borders, connectors, and highlights\n"
        f"- Each card: primitive name (bold) + 1-line description (smaller)\n"
        f"- If primitives have a natural flow or hierarchy, show it with arrows\n"
        f"- Keep it clean, scannable, ADHD-friendly — no walls of text"
    )
    all_prompts.append(
        {
            "index": len(all_prompts) + 1,
            "key": key,
            "layer": layer,
            "parent": parent,
            "layer_name": layer_name,
            "color": color,
            "prim_count": len(prims),
            "slug": slug,
            "prompt": prompt,
        }
    )

# Create output dirs
batch_dir = Path("docs/infographic-batches")
batch_dir.mkdir(parents=True, exist_ok=True)
output_dir = Path("docs/infographic-output")
output_dir.mkdir(parents=True, exist_ok=True)

# Write batch files (5 per batch)
BATCH_SIZE = 5
batches = []
for i in range(0, len(all_prompts), BATCH_SIZE):
    batch_num = i // BATCH_SIZE + 1
    batch = all_prompts[i : i + BATCH_SIZE]
    batches.append(batch)

    # Write the batch file
    batch_file = batch_dir / f"batch_{batch_num:02d}.txt"
    with open(batch_file, "w", encoding="utf-8") as f:
        f.write(f"═══════════════════════════════════════════════════════════\n")
        f.write(f"  BATCH {batch_num} of {len(range(0, len(all_prompts), BATCH_SIZE))}")
        f.write(f"  —  {len(batch)} infographics\n")
        f.write(f"═══════════════════════════════════════════════════════════\n\n")
        f.write(f"SYSTEM PROMPT (paste this first, or set as custom instructions):\n")
        f.write(f"─────────────────────────────────────────────────────────\n")
        f.write(SYSTEM_PROMPT)
        f.write(f"\n─────────────────────────────────────────────────────────\n\n")

        for j, item in enumerate(batch, 1):
            f.write(f"┌─────────────────────────────────────────────────────┐\n")
            f.write(
                f"│  PROMPT {j}/{len(batch)}  —  #{item['index']:02d}  {item['key']}\n"
            )
            f.write(f"│  Save as: {item['slug']}.png\n")
            f.write(f"└─────────────────────────────────────────────────────┘\n\n")
            f.write(item["prompt"])
            f.write("\n\n")
            if j < len(batch):
                f.write(
                    "═══  NEXT PROMPT  (paste after saving the image above)  ═══\n\n"
                )

# Write the HTML tracker
tracker_path = Path("docs/infographic-tracker.html")
with open(tracker_path, "w", encoding="utf-8") as f:
    f.write("""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>{a}OS Infographic Batch Tracker</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0a0f; color: #e2e8f0; font-family: 'Inter', system-ui, sans-serif; padding: 24px; }
  h1 { font-size: 28px; margin-bottom: 4px; }
  .subtitle { color: #64748b; margin-bottom: 24px; font-size: 14px; }
  .progress-bar { background: #1e1e2e; border-radius: 12px; height: 24px; margin-bottom: 24px; overflow: hidden; position: relative; }
  .progress-fill { background: linear-gradient(90deg, #34d399, #38bdf8, #818cf8); height: 100%; transition: width 0.3s; border-radius: 12px; }
  .progress-label { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 12px; font-weight: 700; }
  .batch { background: #1a1a2e; border: 1px solid #2a2a3e; border-radius: 12px; margin-bottom: 16px; overflow: hidden; }
  .batch-header { padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
  .batch-header:hover { background: #22223a; }
  .batch-title { font-weight: 700; font-size: 15px; }
  .batch-status { font-size: 12px; padding: 4px 10px; border-radius: 8px; }
  .batch-body { padding: 0 16px 16px; display: none; }
  .batch.open .batch-body { display: block; }
  .item { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #2a2a3e; }
  .item:last-child { border-bottom: none; }
  .item input[type=checkbox] { width: 20px; height: 20px; accent-color: #34d399; cursor: pointer; flex-shrink: 0; }
  .item-info { flex: 1; }
  .item-name { font-weight: 600; font-size: 14px; }
  .item-meta { font-size: 11px; color: #64748b; }
  .layer-badge { display: inline-block; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; }
  .copy-btn { background: #2a2a3e; color: #94a3b8; border: none; padding: 6px 12px; border-radius: 8px; cursor: pointer; font-size: 12px; white-space: nowrap; }
  .copy-btn:hover { background: #3a3a4e; color: #e2e8f0; }
  .copy-btn.copied { background: #166534; color: #34d399; }
  .batch-copy-all { background: #1e293b; color: #38bdf8; border: 1px solid #38bdf8; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; margin-top: 12px; }
  .batch-copy-all:hover { background: #38bdf8; color: #0a0a0f; }
  .instructions { background: #1a1a2e; border: 1px solid #2a2a3e; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
  .instructions h2 { font-size: 16px; margin-bottom: 8px; color: #fbbf24; }
  .instructions ol { padding-left: 20px; line-height: 1.8; font-size: 14px; }
  .instructions code { background: #2a2a3e; padding: 2px 6px; border-radius: 4px; font-size: 13px; }
  code.filename { cursor: pointer; user-select: all; padding: 2px 8px; border: 1px solid transparent; transition: all 0.15s; }
  code.filename:hover { border-color: #38bdf8; background: #1e293b; color: #38bdf8; }
  code.filename.copied { border-color: #34d399; background: #16653422; color: #34d399; }
  .sys-prompt { background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px; font-family: monospace; font-size: 11px; color: #94a3b8; max-height: 120px; overflow-y: auto; margin: 8px 0; white-space: pre-wrap; cursor: pointer; }
  .sys-prompt:hover { border-color: #38bdf8; }
""")

    # Color map for layer badges
    f.write("</style>\n</head>\n<body>\n")
    f.write("<h1>{a}OS Infographic Batch Generator</h1>\n")
    f.write(
        f'<div class="subtitle">63 constructs · 312 primitives · {len(batches)} batches of {BATCH_SIZE}</div>\n'
    )

    # Progress bar
    f.write(
        '<div class="progress-bar"><div class="progress-fill" id="progressFill" style="width:0%"></div>'
    )
    f.write('<div class="progress-label" id="progressLabel">0 / 63</div></div>\n')

    # Instructions
    f.write("""<div class="instructions">
<h2>How to use this</h2>
<ol>
<li>Copy the <strong>System Prompt</strong> below and paste it into ChatGPT as your first message (or set it as custom instructions)</li>
<li>Open a batch, click <strong>Copy Prompt</strong> for the first item</li>
<li>Paste it into ChatGPT — it generates the infographic image</li>
<li>Download the image, check the box here to track progress</li>
<li>Move to the next prompt. Do 5 per session, take a break, come back</li>
</ol>
</div>\n""")

    # System prompt display
    f.write('<div class="instructions"><h2>System Prompt (copy once)</h2>\n')
    f.write(
        f'<div class="sys-prompt" id="sysPromptText">{SYSTEM_PROMPT.replace("<", "&lt;").replace(">", "&gt;")}</div>\n'
    )
    f.write(
        '<button class="copy-btn" onclick="copySysPrompt()" style="margin-top:8px">📋 Copy System Prompt</button>\n'
    )
    f.write("</div>\n")

    # Embed all prompts as a JS array (safe JSON encoding, no inline escaping issues)
    f.write("<script>\nconst PROMPTS = ")
    prompts_for_js = [item["prompt"] for item in all_prompts]
    f.write(json.dumps(prompts_for_js))
    f.write(";\n</script>\n")

    # Batches
    for bi, batch in enumerate(batches):
        batch_num = bi + 1
        f.write(f'<div class="batch" id="batch{batch_num}">\n')
        f.write(f'<div class="batch-header" onclick="toggleBatch({batch_num})">\n')
        f.write(f'<span class="batch-title">Batch {batch_num} — ')
        layers_in_batch = sorted(set(item["layer"] for item in batch))
        f.write(", ".join(f"{item['parent']}" for item in batch))
        f.write(f"</span>\n")
        f.write(
            f'<span class="batch-status" id="batchStatus{batch_num}">0/{len(batch)}</span>\n'
        )
        f.write("</div>\n")
        f.write(f'<div class="batch-body">\n')

        for item in batch:
            color = item["color"]
            idx = item["index"] - 1  # 0-based index into PROMPTS array
            f.write(f'<div class="item">\n')
            f.write(
                f'<input type="checkbox" id="check{item["index"]}" onchange="updateProgress()">\n'
            )
            f.write(f'<div class="item-info">\n')
            f.write(
                f'<div class="item-name"><span class="layer-badge" style="background:{color}22;color:{color};border:1px solid {color}44">{item["layer"]}</span> {item["parent"]}</div>\n'
            )
            f.write(
                f'<div class="item-meta">{item["prim_count"]} primitives · save as <code class="filename" onclick="copyFilename(this)" title="Click to copy">{item["slug"]}.png</code></div>\n'
            )
            f.write(f"</div>\n")
            f.write(
                f'<button class="copy-btn" onclick="copyPrompt(this, {idx})">📋 Copy</button>\n'
            )
            f.write(f"</div>\n")

        f.write("</div></div>\n")

    # JavaScript
    f.write("""
<script>
const TOTAL = 63;

function toggleBatch(n) {
  document.getElementById('batch' + n).classList.toggle('open');
}

function copyPrompt(btn, idx) {
  navigator.clipboard.writeText(PROMPTS[idx]).then(() => {
    btn.textContent = '✅ Copied!';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = '📋 Copy'; btn.classList.remove('copied'); }, 2000);
  });
}

function copyFilename(el) {
  navigator.clipboard.writeText(el.textContent).then(() => {
    el.classList.add('copied');
    const orig = el.textContent;
    el.textContent = '✅ copied!';
    setTimeout(() => { el.textContent = orig; el.classList.remove('copied'); }, 1500);
  });
}

function copySysPrompt() {
  const text = document.getElementById('sysPromptText').textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector('.instructions .copy-btn');
    btn.textContent = '✅ Copied!';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = '📋 Copy System Prompt'; btn.classList.remove('copied'); }, 2000);
  });
}

function updateProgress() {
  let done = 0;
  for (let i = 1; i <= TOTAL; i++) {
    if (document.getElementById('check' + i)?.checked) done++;
  }
  document.getElementById('progressFill').style.width = (done / TOTAL * 100) + '%';
  document.getElementById('progressLabel').textContent = done + ' / ' + TOTAL;

  // Update batch statuses
  let idx = 0;
  const batches = document.querySelectorAll('.batch');
  batches.forEach((b, bi) => {
    const checks = b.querySelectorAll('input[type=checkbox]');
    let batchDone = 0;
    checks.forEach(c => { if (c.checked) batchDone++; });
    const statusEl = document.getElementById('batchStatus' + (bi + 1));
    statusEl.textContent = batchDone + '/' + checks.length;
    statusEl.style.background = batchDone === checks.length ? '#166534' : '#1e293b';
    statusEl.style.color = batchDone === checks.length ? '#34d399' : '#64748b';
  });

  // Save to localStorage
  const state = {};
  for (let i = 1; i <= TOTAL; i++) {
    if (document.getElementById('check' + i)?.checked) state[i] = true;
  }
  localStorage.setItem('aosInfographicProgress', JSON.stringify(state));
}

// Restore state
window.addEventListener('load', () => {
  try {
    const state = JSON.parse(localStorage.getItem('aosInfographicProgress') || '{}');
    for (const [k, v] of Object.entries(state)) {
      const el = document.getElementById('check' + k);
      if (el && v) el.checked = true;
    }
    updateProgress();
  } catch(e) {}
  // Auto-open first incomplete batch
  const batches = document.querySelectorAll('.batch');
  for (const b of batches) {
    const checks = b.querySelectorAll('input[type=checkbox]');
    const allDone = [...checks].every(c => c.checked);
    if (!allDone) { b.classList.add('open'); break; }
  }
});
</script>
</body></html>
""")

print(f"Done.")
print(f"  {len(batches)} batch files in {batch_dir}/")
print(f"  Tracker page: {tracker_path}")
print(f"  Output folder: {output_dir}/ (save your images here)")
