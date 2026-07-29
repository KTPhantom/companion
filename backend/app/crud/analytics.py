from collections import Counter
from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.models.session import StudySession


def get_user_analytics(db: Session, user_id: int):
    """Build the behavioral profile that powers the companion's intelligence.

    Goes beyond raw totals: peak focus hours, consistency (active-day streak),
    subject affinity, and recent momentum — the signals Companion OS uses to
    coach the person, not just report numbers.
    """
    sessions = db.query(StudySession).filter(
        StudySession.user_id == user_id
    ).order_by(StudySession.started_at.desc()).all()

    if not sessions:
        return {
            "total_sessions": 0,
            "total_minutes": 0,
            "avg_session_minutes": 0,
            "avg_focus_score": None,
            "completion_rate": 0,
            "active_days": 0,
            "peak_hour": None,
            "top_subject": None,
            "sessions_last_7_days": 0,
            "minutes_last_7_days": 0,
            "recent_subjects": [],
        }

    total_sessions = len(sessions)
    total_minutes = sum(s.duration or 0 for s in sessions)
    completed = sum(1 for s in sessions if s.completed)

    # Interruption-based focus scores (0 means recorded before instrumentation).
    scored = [s.focus_score for s in sessions if s.focus_score]
    avg_focus_score = round(sum(scored) / len(scored)) if scored else None

    active_days = len({
        s.started_at.date() for s in sessions if s.started_at
    })

    hour_counts = Counter(
        s.started_at.hour for s in sessions if s.started_at
    )
    peak_hour = hour_counts.most_common(1)[0][0] if hour_counts else None

    subject_counts = Counter(
        s.subject for s in sessions if s.subject
    )
    top_subject = subject_counts.most_common(1)[0][0] if subject_counts else None

    week_ago = datetime.utcnow() - timedelta(days=7)
    recent = [s for s in sessions if s.started_at and s.started_at >= week_ago]

    return {
        "total_sessions": total_sessions,
        "total_minutes": total_minutes,
        "avg_session_minutes": round(total_minutes / total_sessions, 1),
        "avg_focus_score": avg_focus_score,
        "completion_rate": round(completed / total_sessions * 100),
        "active_days": active_days,
        "peak_hour": peak_hour,
        "top_subject": top_subject,
        "sessions_last_7_days": len(recent),
        "minutes_last_7_days": sum(s.duration or 0 for s in recent),
        "recent_subjects": [s.subject for s in sessions[:5] if s.subject],
    }
