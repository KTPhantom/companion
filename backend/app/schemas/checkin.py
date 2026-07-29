from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

# Ordered worst-to-best so they can be scored numerically for trends.
ENERGY_LEVELS = ["drained", "tired", "steady", "good", "energised"]
FOCUS_LEVELS = ["scattered", "distracted", "okay", "sharp", "deep"]

EnergyLevel = Literal["drained", "tired", "steady", "good", "energised"]
FocusLevel = Literal["scattered", "distracted", "okay", "sharp", "deep"]


class CheckInCreate(BaseModel):
    energy: EnergyLevel
    focus_quality: FocusLevel
    note: str | None = Field(default=None, max_length=500)
    session_id: int | None = None


class CheckInResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    energy: str
    focus_quality: str
    note: str | None
    created_at: datetime


class WellbeingSummary(BaseModel):
    check_ins: int
    avg_energy: float | None
    avg_focus_quality: float | None
    energy_trend: str | None
    lowest_energy_hour: int | None
    recent_notes: list[str]
    consecutive_low_energy: int
