from collections import Counter
from datetime import timedelta

from sqlalchemy.orm import Session

from app.core.time import utcnow, resolve_timezone, to_user_time
from app.models.session import StudySession

EMPTY_PROFILE = {
    "total_sessions": 0,
    "total_minutes": 0,
    "avg_session_minutes": 0,
    "avg_focus_score": None,
    "completion_rate": 0,
    "active_days": 0,
    "current_streak": 0,
    "peak_hour": None,
    "top_subject": None,
    "sessions_last_7_days": 0,
    "minutes_last_7_days": 0,
    "recent_subjects": [],
}


def _current_streak(local_days: set, today) -> int:
    """Consecutive days ending today (or yesterday, if today is still empty).

    Habit research (docs/research-foundation.md #1) ties automaticity to
    unbroken repetition, so this counts consecutive days rather than
    lifetime activity. A streak that ended days ago is not a streak.
    """
    if not local_days:
        return 0

    cursor = today
    if cursor not in local_days:
        cursor -= timedelta(days=1)

    streak = 0
    while cursor in local_days:
        streak += 1
        cursor -= timedelta(days=1)
    return streak


def get_user_analytics(db: Session, user_id: int, timezone_name: str | None = None):
    """Build the behavioral profile that powers the companion's intelligence.

    All day/hour bucketing happens in the user's timezone — a 1 AM session in
    IST belongs to that person's day, not to the previous UTC one.
    """
    sessions = db.query(StudySession).filter(
        StudySession.user_id == user_id
    ).order_by(StudySession.started_at.desc()).all()

    if not sessions:
        return dict(EMPTY_PROFILE)

    tz = resolve_timezone(timezone_name)
    local_times = {
        s.id: to_user_time(s.started_at, tz)
        for s in sessions if s.started_at
    }

    total_sessions = len(sessions)
    total_minutes = sum(s.duration or 0 for s in sessions)
    completed = sum(1 for s in sessions if s.completed)

    # Interruption-based focus scores (0 means recorded before instrumentation).
    scored = [s.focus_score for s in sessions if s.focus_score]
    avg_focus_score = round(sum(scored) / len(scored)) if scored else None

    local_days = {t.date() for t in local_times.values()}

    hour_counts = Counter(t.hour for t in local_times.values())
    peak_hour = hour_counts.most_common(1)[0][0] if hour_counts else None

    subject_counts = Counter(s.subject for s in sessions if s.subject)
    top_subject = subject_counts.most_common(1)[0][0] if subject_counts else None

    now = utcnow()
    week_ago = now - timedelta(days=7)
    recent = [
        s for s in sessions
        if s.id in local_times and local_times[s.id] >= week_ago
    ]

    return {
        "total_sessions": total_sessions,
        "total_minutes": total_minutes,
        "avg_session_minutes": round(total_minutes / total_sessions, 1),
        "avg_focus_score": avg_focus_score,
        "completion_rate": round(completed / total_sessions * 100),
        "active_days": len(local_days),
        "current_streak": _current_streak(local_days, now.astimezone(tz).date()),
        "peak_hour": peak_hour,
        "top_subject": top_subject,
        "sessions_last_7_days": len(recent),
        "minutes_last_7_days": sum(s.duration or 0 for s in recent),
        "recent_subjects": [s.subject for s in sessions[:5] if s.subject],
    }
