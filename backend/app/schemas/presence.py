from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

# The accepted event vocabulary. Kept explicit so a typo in the client can't
# quietly pollute the behavioral record.
PresenceEventType = Literal[
    "focus_start",
    "focus_complete",
    "focus_abandon",
    "tab_hidden",
    "tab_visible",
    "idle_start",
    "idle_end",
    "intervention_shown",
    "intervention_followed",
]


class PresenceEventIn(BaseModel):
    event_type: PresenceEventType
    occurred_at: datetime | None = None
    subject: str | None = Field(default=None, max_length=200)
    duration_seconds: int | None = Field(default=None, ge=0, le=24 * 60 * 60)
    intervention_key: str | None = Field(default=None, max_length=64)


class PresenceEventBatch(BaseModel):
    """Events are batched so a distracted user doesn't generate a request storm."""
    events: list[PresenceEventIn] = Field(min_length=1, max_length=100)


class PresenceSummary(BaseModel):
    total_focus_sessions: int
    completed_sessions: int
    abandoned_sessions: int
    distraction_events: int
    distractions_per_session: float
    avg_away_seconds: int | None
    most_distracted_hour: int | None
    interventions_shown: int
    interventions_followed: int
    intervention_follow_rate: float | None
