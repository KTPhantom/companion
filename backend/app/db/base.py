"""Canonical metadata import point.

Importing this module guarantees every model is registered on Base.metadata.
Alembic autogenerate relies on it — a model missing here is a table Alembic
will silently propose to drop.
"""

from app.db.database import Base  # noqa: F401
from app.models.user import User  # noqa: F401
from app.models.magic_token import MagicToken  # noqa: F401
from app.models.session import StudySession  # noqa: F401
from app.models.user_memory import UserMemory  # noqa: F401
from app.models.chat_message import ChatMessage  # noqa: F401
from app.models.presence_event import PresenceEvent  # noqa: F401
from app.models.session_checkin import SessionCheckIn  # noqa: F401
