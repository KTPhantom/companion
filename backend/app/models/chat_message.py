from datetime import datetime

from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime

from app.db.database import Base


class ChatMessage(Base):
    """One turn of companion conversation, persisted so the relationship
    survives page refreshes — continuity is a prerequisite for presence."""

    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), index=True)

    role = Column(String)  # "user" or "assistant"

    content = Column(Text)

    created_at = Column(DateTime, default=datetime.utcnow)
