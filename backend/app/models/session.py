from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    ForeignKey,
    DateTime
)

from sqlalchemy.orm import relationship

from datetime import datetime

from app.db.database import Base


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
        DateTime,
        default=datetime.utcnow
    )

    ended_at = Column(DateTime)

    user = relationship("User")