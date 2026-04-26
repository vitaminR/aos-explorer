from __future__ import annotations

from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, Field, model_validator


class Source(BaseModel):
    label: str
    href: str


class Concept(BaseModel):
    slug: str
    name: str
    aliases: list[str] = []
    shortDefinition: str
    explainer: str
    strata: list[str]
    axes: list[str]
    relatedProductIds: list[str] = []
    relatedConceptSlugs: list[str] = []
    antiPatterns: list[str] = []
    mitigations: list[str] = []
    sources: list[Source] = []
    freshnessTier: Literal["A", "B", "C"]
    lastReviewed: date
    reviewPolicy: str
    confidence: float = Field(ge=0.0, le=1.0)
    status: Literal["complete", "seed", "draft"]
    hidden: bool = False
    easterEgg: bool = False


class ConceptRegistry(BaseModel):
    version: str
    generatedAt: datetime
    count: int
    concepts: list[Concept]

    @model_validator(mode="after")
    def validate_count(self) -> ConceptRegistry:
        if self.count != len(self.concepts):
            raise ValueError(
                f"count={self.count} does not match len(concepts)={len(self.concepts)}"
            )
        return self

    def by_slug(self, slug: str) -> Concept | None:
        return next((c for c in self.concepts if c.slug == slug), None)

    def by_stratum(self, label: str) -> list[Concept]:
        return [c for c in self.concepts if label in c.strata]

    def by_axis(self, axis: str) -> list[Concept]:
        return [c for c in self.concepts if axis in c.axes]
