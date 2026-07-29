from sqlalchemy import Column, Integer, String, ForeignKey, DateTime

from app.db.database import Base
from app.core.time import utcnow


class SessionCheckIn(Base):
    """How a focus block actually felt, in the user's own words.

    This is the deliberate starting point for Emotional Intelligence. Nothing
    in the research supports inferring burnout or frustration from passive
    behavioural signals (docs/research-foundation.md gap 1), so the companion
    asks instead of guessing. It also builds the labelled dataset that any
    future inference would need — and the labels come from the only authority
    on how someone feels.
    """

    __tablename__ = "session_checkins"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), index=True)

    # Optional: a check-in can follow a specific session or stand alone.
    session_id = Column(
        Integer, ForeignKey("study_sessions.id"), nullable=True, index=True
    )

    # "drained" | "tired" | "steady" | "good" | "energised"
    energy = Column(String, index=True)

    # "scattered" | "distracted" | "okay" | "sharp" | "deep"
    focus_quality = Column(String, index=True)

    # Free-text, always optional. Never required to dismiss the prompt.
    note = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), default=utcnow, index=True)
