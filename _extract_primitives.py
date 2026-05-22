"""Extract all primitives from explorer.html into a JSON inventory."""

import json
import re
from collections import Counter


def find_object_block(source: str, anchor: str) -> str:
    anchor_pos = source.find(anchor)
    if anchor_pos == -1:
        return ""

    start = source.find("{", anchor_pos)
    if start == -1:
        return ""

    depth = 0
    in_string = False
    escaped = False

    for i in range(start, len(source)):
        ch = source[i]

        if in_string:
            if escaped:
                escaped = False
            elif ch == "\\":
                escaped = True
            elif ch == '"':
                in_string = False
            continue

        if ch == '"':
            in_string = True
        elif ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return source[start : i + 1]

    return ""


def parse_primitive_entries(block_text: str):
    entries = []
    current = None

    key_re = re.compile(r"^\s*([A-Za-z_][A-Za-z0-9_]*)\s*:\s*\{\s*$")
    name_re = re.compile(r'^\s*name:\s*"(.+?)",?\s*$')
    layer_re = re.compile(r'^\s*layer:\s*"(L[1-7])",?\s*$')
    parent_re = re.compile(r'^\s*parent:\s*"(.+?)",?\s*$')
    desc_re = re.compile(r'^\s*desc:\s*"(.*)",?\s*$')
    end_re = re.compile(r"^\s*},\s*$")

    for line in block_text.splitlines():
        m_key = key_re.match(line)
        if m_key:
            current = {"key": m_key.group(1)}
            continue

        if current is None:
            continue

        m_name = name_re.match(line)
        if m_name:
            current["name"] = m_name.group(1)
            continue

        m_layer = layer_re.match(line)
        if m_layer:
            current["layer"] = m_layer.group(1)
            continue

        m_parent = parent_re.match(line)
        if m_parent:
            current["parent"] = m_parent.group(1)
            continue

        m_desc = desc_re.match(line)
        if m_desc:
            current["desc"] = m_desc.group(1)
            continue

        if end_re.match(line):
            required = {"name", "layer", "parent", "desc"}
            if required.issubset(current.keys()):
                entries.append(
                    {
                        "name": current["name"],
                        "layer": current["layer"],
                        "parent": current["parent"],
                        "desc": current["desc"],
                    }
                )
            current = None

    return entries


with open("explorer.html", "r", encoding="utf-8") as f:
    text = f.read()

primitive_details_block = find_object_block(text, "const PRIMITIVE_DETAILS =")
product_guides_block = find_object_block(text, "const PRIMITIVE_PRODUCT_GUIDES =")

groups = []
groups.extend(parse_primitive_entries(primitive_details_block))
groups.extend(parse_primitive_entries(product_guides_block))

# De-duplicate exact duplicates while preserving order.
seen = set()
unique_groups = []
for g in groups:
    key = (g["name"], g["layer"], g["parent"], g.get("desc", ""))
    if key in seen:
        continue
    seen.add(key)
    unique_groups.append(g)

layer_counts = Counter(g["layer"] for g in unique_groups)
print("=== LAYER SUMMARY ===")
for l in sorted(layer_counts.keys()):
    print(f"  {l}: {layer_counts[l]} primitives")
print(f"  TOTAL: {len(unique_groups)}")

# Group by parent
parents = {}
for g in unique_groups:
    key = f"{g['layer']} | {g['parent']}"
    parents.setdefault(key, []).append(g["name"])

print(f"\n=== PARENT CONSTRUCTS: {len(parents)} ===")
for k in sorted(parents.keys()):
    print(f"  {k} ({len(parents[k])}): {', '.join(parents[k])}")

with open("_primitives_inventory.json", "w", encoding="utf-8") as out:
    json.dump(unique_groups, out, indent=2)
print("\nSaved _primitives_inventory.json")
