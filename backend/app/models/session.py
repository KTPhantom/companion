from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    ForeignKey,
    DateTime
)

from sqlalchemy.orm import relationship

from app.db.database import Base
from app.core.time import utcnow


class StudySession(Base):

    __tablename__ = "study_sessions"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    subject = Column(String)

    duration = Column(Integer)

    focus_score = Column(Integer, default=0)

    completed = Column(Boolean, default=False)

    started_at = Column(
        DateTime(timezone=True),
        default=utcnow
    )

    ended_at = Column(DateTime(timezone=True))

    user = relationship("User")
