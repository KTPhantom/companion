from pydantic import BaseModel
from datetime import datetime


class SessionCreate(BaseModel):

    subject: str

    duration: int


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