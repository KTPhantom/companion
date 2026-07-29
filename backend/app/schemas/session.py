from pydantic import BaseModel
from datetime import datetime


from pydantic import Field


class SessionCreate(BaseModel):

    subject: str

    duration: int = Field(gt=0, le=24 * 60)

    # Measured per session from interruptions; 100 = uninterrupted block.
    focus_score: int = Field(default=100, ge=0, le=100)


class SessionResponse(BaseModel):

    id: int

    subject: str

    duration: int

    focus_score: int

    completed: bool

    started_at: datetime

    ended_at: datetime | None

    class Config:
        from_attributes = True