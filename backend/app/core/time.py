"""Time helpers.

Everything is stored in UTC and timezone-aware. Anything user-facing —
"what day was this session", "when do you focus best" — must be bucketed in
the user's own timezone, otherwise a 1 AM IST session lands on the previous
day and silently corrupts streaks, peak hours, and daily goals.
"""

from datetime import datetime, timezone, tzinfo
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

DEFAULT_TIMEZONE = "UTC"

# Windows ships no system tz database, so ZoneInfo("UTC") can itself raise.
# stdlib timezone.utc always works, so it is the real floor for fallbacks.
UTC: tzinfo = timezone.utc


def utcnow() -> datetime:
    """Timezone-aware replacement for the deprecated datetime.utcnow()."""
    return datetime.now(timezone.utc)


def resolve_timezone(name: str | None) -> tzinfo:
    """Return a usable tzinfo, falling back to UTC for unknown zones."""
    if not name or name == DEFAULT_TIMEZONE:
        return UTC
    try:
        return ZoneInfo(name)
    except (ZoneInfoNotFoundError, ValueError):
        return UTC


def to_user_time(value: datetime, tz: tzinfo) -> datetime:
    """Convert a stored timestamp into the user's local time.

    Rows written before timestamps became timezone-aware are naive; treat
    those as UTC rather than letting Python assume the server's zone.
    """
    if value.tzinfo is None:
        value = value.replace(tzinfo=timezone.utc)
    return value.astimezone(tz)


def is_valid_timezone(name: str | None) -> bool:
    if not name:
        return False
    if name == DEFAULT_TIMEZONE:
        return True
    try:
        ZoneInfo(name)
        return True
    except (ZoneInfoNotFoundError, ValueError):
        return False
