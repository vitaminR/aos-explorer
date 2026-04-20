"""Prototype HTML validator: checks PRD compliance and structural integrity."""

import re

with open("prototype.html", "r", encoding="utf-8") as f:
    html = f.read()

errors = []

# 1. Check all ids are unique
ids = re.findall(r'id="([^"]+)"', html)
seen = {}
for i in ids:
    if i in seen:
        errors.append(f"DUPLICATE ID: {i}")
    seen[i] = True

# 2. Check onclick handlers reference existing functions
func_defs = set(re.findall(r"function\s+(\w+)\s*\(", html))
# These appear in inline event handlers but are not user-defined functions
KNOWN_BUILTINS = {
    "event",
    "stopPropagation",
    "add",
    "remove",
    "if",
    "this",
    "getElementById",
    "querySelectorAll",
    "forEach",
    "classList",
    "querySelector",
    "textContent",
    "style",
    "nextElementSibling",
    "display",
    "contains",
    "toggle",
    "value",
    # Native browser methods referenced via event.x() or window.x()
    "preventDefault",
    "scrollTo",
    "open",
    "scrollIntoView",
    "focus",
    "blur",
    "closest",
    "getAttribute",
    "setAttribute",
    "removeAttribute",
}
onclick_calls = re.findall(r'onclick="[^"]*?(\w+)\s*\(', html)
for call in onclick_calls:
    if call not in func_defs and call not in KNOWN_BUILTINS:
        errors.append(f"ONCLICK references undefined function: {call}")

# 3. Check getElementById references
# These IDs are created dynamically in JS, not in static HTML
DYNAMIC_IDS = {"searchBlankSlate", "filterBlankSlate", "quickFilters"}
get_ids = re.findall(r"getElementById\(['\"](\w+)['\"]\)", html)
for gid in get_ids:
    if gid not in seen and gid not in DYNAMIC_IDS:
        errors.append(f"getElementById references missing ID: {gid}")

# 4. Check each stratum badge vs actual substrate count
strata_ids = ["l7", "l6", "l5", "l4", "l3", "l2", "l1"]
for sid in strata_ids:
    pattern = rf'id="{sid}".*?(?=id="l\d"|<!-- RIGHT RAIL|$)'
    match = re.search(pattern, html, re.DOTALL)
    if match:
        block = match.group(0)
        subs = len(re.findall(r"substrate-item", block))
        badge = re.search(r"(\d+)\s*substrates", block)
        if badge:
            badge_num = int(badge.group(1))
            if badge_num != subs:
                errors.append(
                    f"{sid.upper()} BADGE MISMATCH: badge={badge_num}, actual={subs}"
                )

# 5. Product cards vs PRODUCT_DETAILS
product_card_refs = set(re.findall(r"selectProduct\(['\"](\w+)['\"]\)", html))
# Scope to only the PRODUCT_DETAILS block to avoid false positives from
# CONSTRUCT_DETAILS and PRIMITIVE_DETAILS entries.
_pd_start = html.find("const PRODUCT_DETAILS = {")
_pd_end = html.find("\n      };", _pd_start) + len("\n      };")
_pd_block = html[_pd_start:_pd_end] if _pd_start != -1 else ""
detail_keys = set(re.findall(r"(\w+):\s*\{\s*\n\s*name:", _pd_block))
for pc in product_card_refs:
    if pc not in detail_keys:
        errors.append(f"selectProduct('{pc}') has no PRODUCT_DETAILS entry")
for dk in detail_keys:
    if dk not in product_card_refs:
        errors.append(f"PRODUCT_DETAILS['{dk}'] has no product card in HTML")

# 6. Construct panel IDs match references
construct_refs = re.findall(r"showConstructs\(this,\s*['\"](\w+)['\"]\)", html)
for ref in construct_refs:
    expected_id = ref + "-constructs"
    if expected_id not in seen:
        errors.append(f"showConstructs references missing panel: {expected_id}")

# 7. Data attributes on product cards
product_card_blocks = re.findall(r'<div\s+class="product-card"[^>]*>', html)
for i, pc in enumerate(product_card_blocks):
    for attr in ["data-name", "data-vendor", "data-deployment", "data-license"]:
        if attr not in pc:
            errors.append(f"Product card #{i + 1} missing {attr}")

# 8. Tag balance (basic)
open_divs = len(re.findall(r"<div[\s>]", html))
close_divs = len(re.findall(r"</div>", html))
if abs(open_divs - close_divs) > 2:
    errors.append(f"DIV TAG MISMATCH: {open_divs} opening vs {close_divs} closing")

# 9. PRD 6.5.9 — Keyboard shortcuts
required_shortcuts = {
    "ArrowUp": "Navigate up",
    "ArrowDown": "Navigate down",
    "ArrowRight": "Expand/drill deeper",
    "ArrowLeft": "Collapse/drill up",
}
for key, desc in required_shortcuts.items():
    if key not in html:
        errors.append(f"KEYBOARD: {key} ({desc}) not implemented (PRD 6.5.9)")

# 10. PRD 6.5.2 — Blank slates
blank_slate_checks = [
    ("search-empty", "No matches", "Search empty state"),
    ("filter-empty", "No products match", "Filter empty state"),
]
for _, phrase, desc in blank_slate_checks:
    if phrase not in html:
        errors.append(f"BLANK SLATE: {desc} missing (PRD 6.5.2)")

# 11. PRD 6.5.11 — Confidence feedback loops
if "dashed" not in html and "low" not in html:
    errors.append("CONFIDENCE: No low-confidence dashed style (PRD 6.5.11)")

# 12. Evidence / rationale behind affordance
if "Show rationale" not in html and "Show details" not in html:
    errors.append(
        "PROGRESSIVE DISCLOSURE: No 'Show rationale/details' affordance for evidence (PRD 6.5.6)"
    )

# 13. Tooltip definitions for vocab terms
if "tooltip" not in html.lower() and "title=" not in html:
    errors.append("RECOGNITION: No tooltip definitions for vocab terms (PRD 6.5.5)")

# ── User Story validations ──────────────────────────────────────────────────

# US-8: Mobile — viewport meta must exist
if 'name="viewport"' not in html:
    errors.append('US-8 MOBILE: Missing <meta name="viewport"> (responsive)')

# US-6: Suggest form must have required fields
for field_id in ("sgName", "sgVendor"):
    if f'id="{field_id}"' not in html:
        errors.append(f"US-6 SUGGEST: Form field #{field_id} missing")

# US-5: Download taxonomy must be reachable from UI
if "downloadTaxonomyJSON" not in html:
    errors.append("US-5 EXPORT: downloadTaxonomyJSON not referenced in HTML")

# US-9: Keyboard navigation — keydown listener required
if (
    'addEventListener("keydown"' not in html
    and "addEventListener('keydown'" not in html
):
    errors.append("US-9 KEYBOARD: No keydown event listener found")

# US-2: Search input must exist
if 'id="searchInput"' not in html:
    errors.append("US-2 SEARCH: searchInput element missing")

# US-10: Share URL — hash-based routing required
if "updateHashFromState" not in html and "restoreFromHash" not in html:
    errors.append(
        "US-10 SHARE: No hash routing found (updateHashFromState / restoreFromHash)"
    )

# US-6 continued: resetSuggestForm must be defined for 'Suggest Another' button
if "resetSuggestForm" in html and "function resetSuggestForm" not in html:
    errors.append("US-6 SUGGEST: resetSuggestForm() called but never defined")

# US-7: Quick filters container must exist in HTML
if 'id="quickFilters"' not in html:
    errors.append("US-7 QUICKFILTER: #quickFilters container missing from HTML")

# Summary
print(f"=== VALIDATION RESULTS ({len(errors)} issues) ===")
for e in errors:
    print(f"  X {e}")
if not errors:
    print("  OK All checks passed")

print()
print("=== STATS ===")
print(f"  Unique IDs: {len(seen)}")
print(f"  JS functions: {len(func_defs)} — {sorted(func_defs)}")
print(f"  Product cards in HTML: {len(product_card_blocks)}")
print(f"  Product detail keys: {sorted(detail_keys)}")
print(f"  Construct panel refs: {construct_refs}")
print(f"  Lines: {html.count(chr(10)) + 1}")
print(f"  DIV balance: {open_divs} open / {close_divs} close")
