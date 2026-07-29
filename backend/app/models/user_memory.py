from sqlalchemy import Column, Integer, String, ForeignKey

from app.db.database import Base

class UserMemory(Base):

    __tablename__ = "user_memory"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    key = Column(String)

    value = Column(String)