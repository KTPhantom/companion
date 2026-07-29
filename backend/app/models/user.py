from sqlalchemy import Column, Integer, String, DateTime  # noqa: F401

from app.db.database import Base
from app.core.time import utcnow, DEFAULT_TIMEZONE


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String, unique=True, index=True)

    email = Column(String, unique=True, index=True)

    hashed_password = Column(String)

    # IANA zone (e.g. "Asia/Kolkata"). Day and hour bucketing happens here,
    # not in UTC — see app/core/time.py.
    timezone = Column(String, default=DEFAULT_TIMEZONE, nullable=False,
                      server_default=DEFAULT_TIMEZONE)

    # Self-chosen goals produce stronger habits than assigned ones
    # (docs/research-foundation.md #3), so this is the user's number.
    daily_goal = Column(Integer, default=6, nullable=False, server_default="6")

    created_at = Column(DateTime(timezone=True), default=utcnow)
