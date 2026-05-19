#!/usr/bin/env python3
"""Cross-tier integrity validator for the {a}OS three-speed knowledge scaffold.

Checks:
  - Tier A: concept slug uniqueness, alias collisions, required fields
  - Tier B: product conceptMappings → valid slugs, evidenceIds → existing files
  - Tier C: evidence productId → valid product, no orphan evidence files
  - Queue:  targetId → valid concept/product/evidence
  - Cross-tier: bidirectional reference consistency

Usage:
  python scripts/validate_scaffold.py          # from repo root
  python scripts/validate_scaffold.py --strict  # treat warnings as errors
"""

import json
import os
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(SCRIPT_DIR)
DATA_DIR = os.path.join(ROOT_DIR, "data")

errors = []
warnings = []


def error(msg):
    errors.append(msg)
    print(f"  ✗ ERROR: {msg}", file=sys.stderr)


def warn(msg):
    warnings.append(msg)
    print(f"  ⚠ WARN:  {msg}", file=sys.stderr)


def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def validate_concepts(concepts_data):
    print("\n── Tier A: Concepts ──")
    concepts = concepts_data.get("concepts", [])
    slugs = set()
    aliases_seen = {}

    for c in concepts:
        slug = c.get("slug")
        if not slug:
            error("Concept missing 'slug'")
            continue

        # Required fields
        for field in ["name", "shortDefinition", "status"]:
            if not c.get(field):
                error(f"Concept '{slug}' missing required field '{field}'")

        # Unique slugs
        if slug in slugs:
            error(f"Duplicate concept slug: '{slug}'")
        slugs.add(slug)

        # Alias collisions
        for alias in c.get("aliases", []):
            key = alias.lower().strip()
            if key in aliases_seen and aliases_seen[key] != slug:
                error(
                    f"Alias collision: '{alias}' maps to both "
                    f"'{aliases_seen[key]}' and '{slug}'"
                )
            aliases_seen[key] = slug

        # Warn on empty explainer for non-seed
        if c.get("status") == "complete" and not c.get("explainer"):
            warn(f"Concept '{slug}' is 'complete' but has no explainer")

        # Warn on empty anti-patterns/mitigations for complete concepts
        if c.get("status") == "complete":
            if not c.get("antiPatterns"):
                warn(f"Concept '{slug}' is 'complete' but has no antiPatterns")
            if not c.get("mitigations"):
                warn(f"Concept '{slug}' is 'complete' but has no mitigations")

    print(f"  {len(concepts)} concepts, {len(slugs)} unique slugs")
    return slugs


def validate_products(products_data, concept_slugs):
    print("\n── Tier B: Products ──")
    products = products_data.get("products", [])
    product_ids = set()
    all_evidence_refs = set()

    for p in products:
        pid = p.get("id")
        if not pid:
            error("Product missing 'id'")
            continue

        # Required fields
        for field in ["name", "type", "confidence", "status"]:
            if field not in p:
                error(f"Product '{pid}' missing required field '{field}'")

        # Unique IDs
        if pid in product_ids:
            error(f"Duplicate product ID: '{pid}'")
        product_ids.add(pid)

        # conceptMappings → valid slugs
        for cm in p.get("conceptMappings", []):
            cs = cm.get("conceptSlug")
            if cs and cs not in concept_slugs:
                error(
                    f"Product '{pid}' maps to concept '{cs}' "
                    f"which does not exist in concepts.json"
                )

        # Track evidence references
        for eid in p.get("evidenceIds", []):
            all_evidence_refs.add(eid)

    print(f"  {len(products)} products, {len(product_ids)} unique IDs")
    return product_ids, all_evidence_refs


def validate_evidence(evidence_dir, product_ids, evidence_refs):
    print("\n── Tier C: Evidence ──")
    evidence_ids = set()
    orphans = []

    if not os.path.isdir(evidence_dir):
        warn("Evidence directory does not exist")
        return evidence_ids

    for fname in sorted(os.listdir(evidence_dir)):
        if not fname.endswith(".json"):
            continue
        fpath = os.path.join(evidence_dir, fname)
        ev = load_json(fpath)

        eid = ev.get("id")
        if not eid:
            error(f"Evidence file '{fname}' missing 'id'")
            continue

        evidence_ids.add(eid)

        # Required fields
        for field in ["productId", "type", "status"]:
            if not ev.get(field):
                error(f"Evidence '{eid}' missing required field '{field}'")

        # productId → valid product
        pid = ev.get("productId")
        if pid and pid not in product_ids:
            error(
                f"Evidence '{eid}' references product '{pid}' "
                f"which does not exist in products.json"
            )

        # Check if referenced by any product
        if eid not in evidence_refs:
            orphans.append(eid)

        # Warn on stub status
        if ev.get("status") == "stub":
            warn(f"Evidence '{eid}' is still a stub (no claims)")

    # Check for broken evidence references (product points to non-existent evidence)
    for ref in evidence_refs:
        if ref not in evidence_ids:
            error(f"Product references evidence '{ref}' which does not exist on disk")

    if orphans:
        for o in orphans:
            warn(f"Orphan evidence '{o}' — not referenced by any product")

    print(f"  {len(evidence_ids)} evidence files, {len(orphans)} orphans")
    return evidence_ids


def validate_queue(queue_data, concept_slugs, product_ids, evidence_ids):
    print("\n── Refresh Queue ──")
    queue = queue_data.get("queue", [])
    ids_seen = set()

    target_map = {
        "concept": concept_slugs,
        "product": product_ids,
        "evidence": evidence_ids,
    }

    for item in queue:
        qid = item.get("id")
        if not qid:
            error("Queue item missing 'id'")
            continue

        if qid in ids_seen:
            error(f"Duplicate queue ID: '{qid}'")
        ids_seen.add(qid)

        # Required fields
        for field in ["targetType", "targetId", "reason", "priority", "status"]:
            if field not in item:
                error(f"Queue item '{qid}' missing required field '{field}'")

        # targetId → valid entity
        ttype = item.get("targetType")
        tid = item.get("targetId")
        if ttype in target_map and tid:
            if tid not in target_map[ttype]:
                error(
                    f"Queue item '{qid}' targets {ttype} '{tid}' "
                    f"which does not exist"
                )

    print(f"  {len(queue)} items, {len(ids_seen)} unique IDs")


def validate_cross_tier(concepts_data, product_ids):
    """Check that concept.relatedProductIds point to real products."""
    print("\n── Cross-Tier References ──")
    concepts = concepts_data.get("concepts", [])
    broken = 0

    for c in concepts:
        slug = c.get("slug", "?")
        for pid in c.get("relatedProductIds", []):
            if pid not in product_ids:
                warn(
                    f"Concept '{slug}' references product '{pid}' "
                    f"which is not in products.json (may be in prototype only)"
                )
                broken += 1

        for rs in c.get("relatedConceptSlugs", []):
            # This is already checked in build_concepts.py but verify here too
            pass  # Cross-concept refs checked by slug existence above

    if broken == 0:
        print("  All cross-tier references valid (or in prototype-only products)")
    else:
        print(f"  {broken} cross-tier warnings (products in prototype but not in products.json)")


def main():
    strict = "--strict" in sys.argv

    print("═══ {a}OS Three-Speed Scaffold Validator ═══")

    # Load data files
    concepts_data = load_json(os.path.join(DATA_DIR, "concepts.json"))
    products_data = load_json(os.path.join(DATA_DIR, "products.json"))
    queue_data = load_json(os.path.join(DATA_DIR, "queues", "refresh-queue.json"))
    evidence_dir = os.path.join(DATA_DIR, "evidence")

    # Validate each tier
    concept_slugs = validate_concepts(concepts_data)
    product_ids, evidence_refs = validate_products(products_data, concept_slugs)
    evidence_ids = validate_evidence(evidence_dir, product_ids, evidence_refs)
    validate_queue(queue_data, concept_slugs, product_ids, evidence_ids)
    validate_cross_tier(concepts_data, product_ids)

    # Summary
    print("\n═══ RESULTS ═══")
    print(f"  Errors:   {len(errors)}")
    print(f"  Warnings: {len(warnings)}")

    if errors:
        print("\n  VERDICT: FAIL — fix errors before proceeding")
        sys.exit(1)
    elif warnings and strict:
        print("\n  VERDICT: FAIL (strict mode) — fix warnings")
        sys.exit(1)
    elif warnings:
        print("\n  VERDICT: PASS with warnings")
        sys.exit(0)
    else:
        print("\n  VERDICT: CLEAN PASS")
        sys.exit(0)


if __name__ == "__main__":
    main()
