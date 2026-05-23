#!/usr/bin/env python3
"""check-catalog-drift.py — Phase 2b guardrail.

Compares data/products.json against the inline PRODUCT_DETAILS in explorer.html
and exits non-zero if any *shared* ID disagrees on `type`, `primary`, or
`secondary`. Run before deploys.
"""
import json, re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
PJ_PATH = ROOT / "data" / "products.json"
HTML_PATH = ROOT / "explorer.html"
FIELDS = ("type", "primary", "secondary")

def load_pj():
    return {p["id"]: p for p in json.loads(PJ_PATH.read_text(encoding="utf-8"))["products"]}

def load_pd():
    text = HTML_PATH.read_text(encoding="utf-8").splitlines()
    start = next((i for i, l in enumerate(text) if l.strip() == "const PRODUCT_DETAILS = {"), None)
    if start is None:
        sys.exit("ERROR: could not locate `const PRODUCT_DETAILS = {` in explorer.html")
    end = next((i for i, l in enumerate(text[start + 1:], start + 1) if l == "      };"), None)
    if end is None:
        sys.exit("ERROR: could not locate PRODUCT_DETAILS closing brace")
    out, cur, buf = {}, None, []
    for line in text[start + 1:end]:
        m = re.match(r"^        ([A-Za-z0-9_-]+):\s*\{\s*$", line)
        if m:
            if cur:
                out[cur] = "\n".join(buf)
            cur, buf = m.group(1), [line]
        else:
            buf.append(line)
    if cur:
        out[cur] = "\n".join(buf)
    parsed = {}
    for ident, body in out.items():
        rec = {}
        for f in FIELDS:
            mm = re.search(rf'^\s*{f}:\s*"([^"]+)"', body, re.M)
            if mm:
                rec[f] = mm.group(1)
        parsed[ident] = rec
    return parsed

def main():
    pj, pd = load_pj(), load_pd()
    shared = sorted(set(pj) & set(pd))
    drifted = []
    for ident in shared:
        for f in FIELDS:
            a, b = pd[ident].get(f), pj[ident].get(f)
            if a is not None and b is not None and a != b:
                drifted.append((ident, f, a, b))
    print(f"Shared IDs: {len(shared)}  |  PD-only: {len(set(pd) - set(pj))}  |  PJ-only: {len(set(pj) - set(pd))}")
    if drifted:
        print("DRIFT detected on shared IDs:")
        for ident, f, a, b in drifted:
            print(f"  {ident}.{f}: PRODUCT_DETAILS='{a}'  !=  products.json='{b}'")
        sys.exit(1)
    print("OK — no drift on shared IDs.")

if __name__ == "__main__":
    main()
