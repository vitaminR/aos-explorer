from __future__ import annotations

from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, Field, model_validator


class ConceptMapping(BaseModel):
    conceptSlug: str
    role: Literal["primary", "secondary"]
    rank: int = Field(ge=1)
    why: str


class Product(BaseModel):
    id: str
    name: str
    type: str
    vendor: str
    deployment: str
    license: str
    primary: str
    secondary: str | None = None
    axisRoles: str
    confidence: float = Field(ge=0.0, le=1.0)
    rationale: str
    conceptMappings: list[ConceptMapping] = []
    evidenceIds: list[str] = []
    freshnessTier: Literal["A", "B", "C"]
    lastReviewed: date
    lastVerified: date
    updatePriority: float = Field(ge=0.0, le=1.0)
    reviewPolicy: str
    changeRisk: Literal["low", "medium", "high"]
    sourceQuality: Literal["high", "medium", "low"]
    status: Literal["active", "deprecated", "review"]

    def concepts_for_role(self, role: Literal["primary", "secondary"]) -> list[str]:
        return [m.conceptSlug for m in self.conceptMappings if m.role == role]


class ProductRegistry(BaseModel):
    version: str
    generatedAt: datetime
    count: int
    products: list[Product]

    @model_validator(mode="after")
    def validate_count(self) -> ProductRegistry:
        if self.count != len(self.products):
            raise ValueError(
                f"count={self.count} does not match len(products)={len(self.products)}"
            )
        return self

    def by_id(self, product_id: str) -> Product | None:
        return next((p for p in self.products if p.id == product_id), None)

    def by_concept(self, slug: str) -> list[Product]:
        return [p for p in self.products if any(m.conceptSlug == slug for m in p.conceptMappings)]

    def active(self) -> list[Product]:
        return [p for p in self.products if p.status == "active"]
