from enum import Enum

from pydantic import BaseModel, Field


class RiskPreference(str, Enum):
    any = "any"
    low = "low"
    medium = "medium"


class OccupancyPreference(str, Enum):
    any = "any"
    available = "available"
    not_occupied = "not_occupied"


class ParkingTypePreference(str, Enum):
    any = "any"
    street_meter = "street_meter"
    garage_or_lot = "garage_or_lot"


class RankRequest(BaseModel):
    maxWalk: float = Field(default=10, ge=1, le=60)
    risk: RiskPreference = RiskPreference.any
    occupancy: OccupancyPreference = OccupancyPreference.any
    type: ParkingTypePreference = ParkingTypePreference.any


class QueryRequest(BaseModel):
    query: str = Field(min_length=2, max_length=300)
