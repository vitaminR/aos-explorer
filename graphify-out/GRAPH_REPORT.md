# Graph Report - 7.aOS-Explorer  (2026-04-30)

## Corpus Check
- 43 files · ~7,587,768 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 150 nodes · 171 edges · 11 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]

## God Nodes (most connected - your core abstractions)
1. `main()` - 8 edges
2. `renderSuiteCard()` - 7 edges
3. `main()` - 7 edges
4. `load_all()` - 5 edges
5. `ConceptRegistry` - 5 edges
6. `ProductRegistry` - 5 edges
7. `write_json()` - 5 edges
8. `main()` - 5 edges
9. `error()` - 5 edges
10. `validate_evidence()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `AosData` --inherits--> `BaseModel`  [EXTRACTED]
  aos_core\loaders\json_loader.py →   _Bridges community 4 → community 0_

## Communities

### Community 0 - "Community 0"
Cohesion: 0.1
Nodes (10): BaseModel, Concept, ConceptRegistry, Source, ConceptMapping, Product, ProductRegistry, Return strata sorted S1 (foundation) → S7 (experience). (+2 more)

### Community 1 - "Community 1"
Cohesion: 0.33
Nodes (11): grade(), isStale(), loadHealth(), relativeTime(), renderDelta(), renderNoData(), renderProbes(), renderScoreRing() (+3 more)

### Community 2 - "Community 2"
Cohesion: 0.42
Nodes (10): build_api_concepts(), build_api_products(), build_api_strata(), build_api_version(), build_llms_full_txt(), build_llms_txt(), load_json(), main() (+2 more)

### Community 3 - "Community 3"
Cohesion: 0.44
Nodes (10): error(), load_json(), main(), Check that concept.relatedProductIds point to real products., validate_concepts(), validate_cross_tier(), validate_evidence(), validate_products() (+2 more)

### Community 4 - "Community 4"
Cohesion: 0.29
Nodes (7): AosData, load_all(), load_concepts(), load_products(), load_strata(), Load and validate aOS data from api/v1/*.json against Pydantic models.  Usage:, Validated snapshot of the full aOS knowledge base.

### Community 5 - "Community 5"
Cohesion: 0.33
Nodes (5): getConcepts(), getProducts(), getStrata(), getVersion(), loadFile()

### Community 6 - "Community 6"
Cohesion: 0.52
Nodes (6): _esc(), generate_concept_page(), generate_js(), load_concepts(), main(), validate()

### Community 8 - "Community 8"
Cohesion: 0.5
Nodes (1): Extract all primitives from prototype.html into a JSON inventory.

### Community 13 - "Community 13"
Cohesion: 1.0
Nodes (1): Prototype HTML validator: checks PRD compliance and structural integrity.

### Community 14 - "Community 14"
Cohesion: 1.0
Nodes (1): Generate batch prompt files (5 per batch) for infographic generation, plus an H

### Community 15 - "Community 15"
Cohesion: 1.0
Nodes (1): One-shot exporter: generates NotebookLM source doc + all 63 infographic prompt f

## Knowledge Gaps
- **8 isolated node(s):** `Prototype HTML validator: checks PRD compliance and structural integrity.`, `Extract all primitives from prototype.html into a JSON inventory.`, `Load and validate aOS data from api/v1/*.json against Pydantic models.  Usage:`, `Validated snapshot of the full aOS knowledge base.`, `Return strata sorted S1 (foundation) → S7 (experience).` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 8`** (4 nodes): `find_object_block()`, `parse_primitive_entries()`, `Extract all primitives from prototype.html into a JSON inventory.`, `_extract_primitives.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (2 nodes): `Prototype HTML validator: checks PRD compliance and structural integrity.`, `validate.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (2 nodes): `build_infographic_batches.py`, `Generate batch prompt files (5 per batch) for infographic generation, plus an H`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (2 nodes): `export_infographic_prompts.py`, `One-shot exporter: generates NotebookLM source doc + all 63 infographic prompt f`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AosData` connect `Community 4` to `Community 0`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `Prototype HTML validator: checks PRD compliance and structural integrity.`, `Extract all primitives from prototype.html into a JSON inventory.`, `Load and validate aOS data from api/v1/*.json against Pydantic models.  Usage:` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._