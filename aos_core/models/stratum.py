from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, model_validator


StratumId = Literal["l0", "l1", "l2", "l3", "l4", "l5", "l6", "l7"]
StratumLabel = Literal["L0", "L1", "L2", "L3", "L4", "L5", "L6", "L7"]


class Stratum(BaseModel):
    id: str
    label: str
    name: str
    color: str
    definition: str
    boundaryQuestion: str
    oneLiner: str
    substrates: list[str]
    constructs: list[str]
    primitives: list[str]
    typicalFailures: list[str]
    coreMetrics: list[str]


class StratumRegistry(BaseModel):
    version: str
    generatedAt: datetime
    count: int
    strata: list[Stratum]

    @model_validator(mode="after")
    def validate_count(self) -> StratumRegistry:
        if self.count != len(self.strata):
            raise ValueError(
                f"count={self.count} does not match len(strata)={len(self.strata)}"
            )
        return self

    def by_label(self, label: str) -> Stratum | None:
        return next((s for s in self.strata if s.label == label), None)

    def ordered(self) -> list[Stratum]:
        """Return strata sorted L1 (foundation) → L7 (experience)."""
        return sorted(self.strata, key=lambda s: s.label)
