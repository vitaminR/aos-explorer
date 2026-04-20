"""Extract all primitives from prototype.html into a JSON inventory."""
import re, json
from collections import Counter

with open("prototype.html", "r", encoding="utf-8") as f:
    text = f.read()

s = text.index("const PRIMITIVE_DETAILS = {")
e = text.index("const PRIMITIVE_PRODUCT_GUIDES")
section = text[s:e]

groups = []
current_layer = ""
current_parent = ""

for line in section.split("\n"):
    m = re.match(r"\s*// (L\d)\s+.\s+(.+)", line)
    if m:
        current_layer = m.group(1)
        current_parent = m.group(2).strip()

    m2 = re.match(r'\s+name:\s*"(.+?)"', line)
    if m2:
        groups.append({
            "name": m2.group(1),
            "layer": current_layer,
            "parent": current_parent,
        })

    m3 = re.match(r'\s+desc:\s*"(.+?)"', line)
    if m3 and groups and "desc" not in groups[-1]:
        groups[-1]["desc"] = m3.group(1)

layer_counts = Counter(g["layer"] for g in groups)
print("=== LAYER SUMMARY ===")
for l in sorted(layer_counts.keys()):
    print(f"  {l}: {layer_counts[l]} primitives")
print(f"  TOTAL: {len(groups)}")

# Group by parent
parents = {}
for g in groups:
    key = f"{g['layer']} | {g['parent']}"
    parents.setdefault(key, []).append(g["name"])

print(f"\n=== PARENT CONSTRUCTS: {len(parents)} ===")
for k in sorted(parents.keys()):
    print(f"  {k} ({len(parents[k])}): {', '.join(parents[k])}")

with open("_primitives_inventory.json", "w", encoding="utf-8") as out:
    json.dump(groups, out, indent=2)
print("\nSaved _primitives_inventory.json")
