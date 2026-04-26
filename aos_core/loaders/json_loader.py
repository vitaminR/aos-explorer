"""
Load and validate aOS data from api/v1/*.json against Pydantic models.

Usage:
    from aos_core.loaders.json_loader import load_all
    data = load_all()
    concept = data.concepts.by_slug("harness")
    stratum = data.strata.by_label("L4")
    products = data.products.by_concept("harness")
"""

from __future__ import annotations

import json
from pathlib import Path

from pydantic import BaseModel

from aos_core.models import ConceptRegistry, ProductRegistry, StratumRegistry

# Default data path: api/v1/ relative to this package's repo root
_REPO_ROOT = Path(__file__).parent.parent.parent
_API_DIR = _REPO_ROOT / "api" / "v1"


class AosData(BaseModel):
    """Validated snapshot of the full aOS knowledge base."""

    concepts: ConceptRegistry
    strata: StratumRegistry
    products: ProductRegistry

    model_config = {"arbitrary_types_allowed": True}

    @property
    def version(self) -> str:
        return self.concepts.version


def load_concepts(api_dir: Path = _API_DIR) -> ConceptRegistry:
    raw = json.loads((api_dir / "concepts.json").read_text(encoding="utf-8"))
    return ConceptRegistry.model_validate(raw)


def load_strata(api_dir: Path = _API_DIR) -> StratumRegistry:
    raw = json.loads((api_dir / "strata.json").read_text(encoding="utf-8"))
    return StratumRegistry.model_validate(raw)


def load_products(api_dir: Path = _API_DIR) -> ProductRegistry:
    raw = json.loads((api_dir / "products.json").read_text(encoding="utf-8"))
    return ProductRegistry.model_validate(raw)


def load_all(api_dir: Path = _API_DIR) -> AosData:
    return AosData(
        concepts=load_concepts(api_dir),
        strata=load_strata(api_dir),
        products=load_products(api_dir),
    )
