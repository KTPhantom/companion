from sqlalchemy import Column, Integer, String, ForeignKey, DateTime

from app.db.database import Base
from app.core.time import utcnow


class PresenceEvent(Base):
    """A single attention signal.

    This is the instrumentation layer everything downstream depends on:
    interventions, fatigue inference, and the efficacy measurement that the
    body-doubling research says we cannot assume (docs/research-foundation.md
    #7, #12). Raw and append-only — interpretation happens in analytics.
    """

    __tablename__ = "presence_events"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), index=True)

    # See app/schemas/presence.py for the accepted vocabulary.
    event_type = Column(String, index=True)

    occurred_at = Column(DateTime(timezone=True), default=utcnow, index=True)

    # What they were working on when it happened.
    subject = Column(String, nullable=True)

    # How long the state lasted (seconds away, seconds idle).
    duration_seconds = Column(Integer, nullable=True)

    # Which intervention this relates to, for shown/followed pairing.
    intervention_key = Column(String, nullable=True)
