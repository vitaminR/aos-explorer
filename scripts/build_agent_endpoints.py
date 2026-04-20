#!/usr/bin/env python3
"""Build script for {a}OS Explorer agent-facing endpoints.

Reads data/strata.json, data/concepts.json, data/products.json and generates:
  1. llms.txt         — summary for LLM discovery (llmstxt.org spec)
  2. llms-full.txt    — full taxonomy dump for LLM consumption
  3. api/v1/strata.json
  4. api/v1/concepts.json
  5. api/v1/products.json
  6. api/v1/version.json
"""

import json
import os
import sys
from datetime import datetime, timezone

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(SCRIPT_DIR)

STRATA_JSON = os.path.join(ROOT_DIR, "data", "strata.json")
CONCEPTS_JSON = os.path.join(ROOT_DIR, "data", "concepts.json")
PRODUCTS_JSON = os.path.join(ROOT_DIR, "data", "products.json")

API_DIR = os.path.join(ROOT_DIR, "api", "v1")
LLMS_TXT = os.path.join(ROOT_DIR, "llms.txt")
LLMS_FULL_TXT = os.path.join(ROOT_DIR, "llms-full.txt")


def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  + Generated {os.path.relpath(path, ROOT_DIR)}")


def write_json(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print(f"  + Generated {os.path.relpath(path, ROOT_DIR)}")


# ---------------------------------------------------------------------------
# Layer 1: llms.txt
# ---------------------------------------------------------------------------


def build_llms_txt(strata_data, concepts_data, products_data):
    version = strata_data.get("version", "v1.0.0")
    strata = strata_data["strata"]

    strata_lines = ""
    for s in strata:
        strata_lines += f"- [{s['label']} {s['name']}](https://aos7.tech/api/v1/strata): {s['oneLiner']}\n"

    txt = f"""# {{a}}OS Explorer

> The Agentic Operating System taxonomy: a 7-stratum reference model
> for classifying AI agent tools, frameworks, and infrastructure.
> Version: {version} | https://aos7.tech

## Strata

{strata_lines.rstrip()}

## API

- [Concepts](https://aos7.tech/api/v1/concepts): All taxonomy concepts with definitions
- [Products](https://aos7.tech/api/v1/products): Product catalog with strata placements
- [Strata](https://aos7.tech/api/v1/strata): Full stratum definitions with substrates and primitives
- [Version](https://aos7.tech/api/v1/version): Current taxonomy version metadata

## Documentation

- [Explorer UI](https://aos7.tech/prototype.html): Interactive taxonomy browser
- [Stack Builder](https://aos7.tech/stack-builder.html): Build and compare agentic stacks

## Optional

- [Full taxonomy data](https://aos7.tech/llms-full.txt): Complete concept and product data for LLMs
"""
    write_file(LLMS_TXT, txt)


def build_llms_full_txt(strata_data, concepts_data, products_data):
    version = strata_data.get("version", "v1.0.0")
    strata = strata_data["strata"]
    concepts = concepts_data.get("concepts", [])
    products = products_data.get("products", [])

    lines = []
    lines.append(f"# {{a}}OS Explorer — Full Taxonomy Data")
    lines.append(f"# Version: {version}")
    lines.append(
        f"# Generated: {datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')}"
    )
    lines.append(f"# Source: https://aos7.tech")
    lines.append("")

    # Strata
    lines.append("=" * 60)
    lines.append("STRATA (7 canonical layers)")
    lines.append("=" * 60)
    lines.append("")

    for s in strata:
        lines.append(f"## {s['label']} — {s['name']}")
        lines.append(f"Definition: {s['definition']}")
        lines.append(f"Boundary question: {s['boundaryQuestion']}")
        lines.append(f"Substrates: {', '.join(s.get('substrates', []))}")
        lines.append(f"Constructs: {', '.join(s.get('constructs', []))}")
        lines.append(f"Primitives: {', '.join(s.get('primitives', []))}")
        lines.append(f"Typical failures: {', '.join(s.get('typicalFailures', []))}")
        lines.append(f"Core metrics: {', '.join(s.get('coreMetrics', []))}")
        lines.append("")

    # Concepts
    lines.append("=" * 60)
    lines.append(f"CONCEPTS ({len(concepts)} entries)")
    lines.append("=" * 60)
    lines.append("")

    for c in concepts:
        lines.append(f"## {c['name']} (/{c['slug']})")
        lines.append(f"Definition: {c.get('shortDefinition', '')}")
        if c.get("explainer"):
            lines.append(f"Explainer: {c['explainer']}")
        lines.append(f"Strata: {', '.join(c.get('strata', []))}")
        if c.get("aliases"):
            lines.append(f"Aliases: {', '.join(c['aliases'])}")
        if c.get("antiPatterns"):
            lines.append(f"Anti-patterns: {'; '.join(c['antiPatterns'])}")
        if c.get("mitigations"):
            lines.append(f"Mitigations: {'; '.join(c['mitigations'])}")
        lines.append("")

    # Products
    lines.append("=" * 60)
    lines.append(f"PRODUCTS ({len(products)} entries)")
    lines.append("=" * 60)
    lines.append("")

    for p in products:
        lines.append(f"## {p['name']} ({p.get('vendor', 'Unknown')})")
        lines.append(f"Type: {p.get('type', 'unknown')}")
        lines.append(f"Primary stratum: {p.get('primary', 'N/A')}")
        if p.get("secondary"):
            lines.append(f"Secondary strata: {p['secondary']}")
        lines.append(f"Deployment: {p.get('deployment', 'N/A')}")
        lines.append(f"License: {p.get('license', 'N/A')}")
        if p.get("rationale"):
            lines.append(f"Rationale: {p['rationale']}")
        conf = p.get("confidence")
        if conf is not None:
            lines.append(f"Confidence: {int(conf * 100)}%")
        lines.append("")

    write_file(LLMS_FULL_TXT, "\n".join(lines))


# ---------------------------------------------------------------------------
# Layer 2: Static JSON API
# ---------------------------------------------------------------------------


def build_api_strata(strata_data):
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    api_obj = {
        "version": strata_data.get("version", "v1.0.0"),
        "generatedAt": now,
        "count": len(strata_data["strata"]),
        "strata": strata_data["strata"],
    }
    write_json(os.path.join(API_DIR, "strata.json"), api_obj)


def build_api_concepts(strata_data, concepts_data):
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    concepts = concepts_data.get("concepts", [])
    api_obj = {
        "version": strata_data.get("version", "v1.0.0"),
        "generatedAt": now,
        "count": len(concepts),
        "concepts": concepts,
    }
    write_json(os.path.join(API_DIR, "concepts.json"), api_obj)


def build_api_products(strata_data, products_data):
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    products = products_data.get("products", [])
    api_obj = {
        "version": strata_data.get("version", "v1.0.0"),
        "generatedAt": now,
        "count": len(products),
        "products": products,
    }
    write_json(os.path.join(API_DIR, "products.json"), api_obj)


def build_api_version(strata_data, concepts_data, products_data):
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    api_obj = {
        "version": strata_data.get("version", "v1.0.0"),
        "generatedAt": now,
        "strataCount": len(strata_data["strata"]),
        "conceptCount": len(concepts_data.get("concepts", [])),
        "productCount": len(products_data.get("products", [])),
        "endpoints": {
            "strata": "/api/v1/strata",
            "concepts": "/api/v1/concepts",
            "products": "/api/v1/products",
            "version": "/api/v1/version",
        },
        "llmsTxt": "/llms.txt",
        "llmsFullTxt": "/llms-full.txt",
    }
    write_json(os.path.join(API_DIR, "version.json"), api_obj)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main():
    print("build_agent_endpoints.py — generating agent-facing endpoints...")
    print()

    # Load data
    strata_data = load_json(STRATA_JSON)
    concepts_data = load_json(CONCEPTS_JSON)
    products_data = load_json(PRODUCTS_JSON)

    print(
        f"  Loaded {len(strata_data['strata'])} strata, "
        f"{len(concepts_data.get('concepts', []))} concepts, "
        f"{len(products_data.get('products', []))} products"
    )
    print()

    # Layer 1: llms.txt
    print("Layer 1: llms.txt")
    build_llms_txt(strata_data, concepts_data, products_data)
    build_llms_full_txt(strata_data, concepts_data, products_data)
    print()

    # Layer 2: Static JSON API
    print("Layer 2: Static JSON API")
    build_api_strata(strata_data)
    build_api_concepts(strata_data, concepts_data)
    build_api_products(strata_data, products_data)
    build_api_version(strata_data, concepts_data, products_data)
    print()

    print("Done. All agent endpoints generated.")


if __name__ == "__main__":
    main()
