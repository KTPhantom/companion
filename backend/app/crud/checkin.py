from collections import Counter
from datetime import timedelta

from sqlalchemy.orm import Session

from app.core.time import utcnow, resolve_timezone, to_user_time
from app.models.session_checkin import SessionCheckIn
from app.schemas.checkin import CheckInCreate, ENERGY_LEVELS, FOCUS_LEVELS

# Enough consecutive low-energy reports to be a pattern rather than a bad day.
LOW_ENERGY_RUN_THRESHOLD = 3

EMPTY_SUMMARY = {
    "check_ins": 0,
    "avg_energy": None,
    "avg_focus_quality": None,
    "energy_trend": None,
    "lowest_energy_hour": None,
    "recent_notes": [],
    "consecutive_low_energy": 0,
}


def _score(value: str, scale: list[str]) -> int | None:
    """Map a label onto 1..5 so it can be averaged and trended."""
    return scale.index(value) + 1 if value in scale else None


def create_check_in(db: Session, user_id: int, data: CheckInCreate) -> SessionCheckIn:
    check_in = SessionCheckIn(
        user_id=user_id,
        session_id=data.session_id,
        energy=data.energy,
        focus_quality=data.focus_quality,
        note=(data.note or "").strip() or None,
    )
    db.add(check_in)
    db.commit()
    db.refresh(check_in)
    return check_in


def _trend(scores: list[int]) -> str | None:
    """Compare the recent half against the earlier half.

    Needs at least four points; below that, day-to-day noise looks like a
    trend and the companion would be reacting to nothing.
    """
    if len(scores) < 4:
        return None

    midpoint = len(scores) // 2
    earlier = scores[:midpoint]
    recent = scores[midpoint:]

    delta = (sum(recent) / len(recent)) - (sum(earlier) / len(earlier))

    if delta >= 0.5:
        return "improving"
    if delta <= -0.5:
        return "declining"
    return "steady"


def get_wellbeing_summary(
    db: Session,
    user_id: int,
    timezone_name: str | None = None,
    days: int = 30,
):
    """Self-reported wellbeing over a recent window.

    Reports what the person said about themselves. It does not infer emotion
    from behaviour — that remains unevidenced.
    """
    since = utcnow() - timedelta(days=days)

    check_ins = db.query(SessionCheckIn).filter(
        SessionCheckIn.user_id == user_id,
        SessionCheckIn.created_at >= since,
    ).order_by(SessionCheckIn.created_at.asc()).all()

    if not check_ins:
        return dict(EMPTY_SUMMARY)

    tz = resolve_timezone(timezone_name)

    energy_scores = [
        s for s in (_score(c.energy, ENERGY_LEVELS) for c in check_ins) if s
    ]
    focus_scores = [
        s for s in (_score(c.focus_quality, FOCUS_LEVELS) for c in check_ins) if s
    ]

    # Which hour of their day tends to feel worst — useful for suggesting
    # when to rest rather than when to push.
    low_hours = Counter(
        to_user_time(c.created_at, tz).hour
        for c in check_ins
        if c.created_at and _score(c.energy, ENERGY_LEVELS) in (1, 2)
    )

    # Trailing run of low-energy reports, most recent first.
    consecutive_low = 0
    for check_in in reversed(check_ins):
        if _score(check_in.energy, ENERGY_LEVELS) in (1, 2):
            consecutive_low += 1
        else:
            break

    return {
        "check_ins": len(check_ins),
        "avg_energy": (
            round(sum(energy_scores) / len(energy_scores), 2) if energy_scores else None
        ),
        "avg_focus_quality": (
            round(sum(focus_scores) / len(focus_scores), 2) if focus_scores else None
        ),
        "energy_trend": _trend(energy_scores),
        "lowest_energy_hour": low_hours.most_common(1)[0][0] if low_hours else None,
        "recent_notes": [c.note for c in check_ins[-3:] if c.note],
        "consecutive_low_energy": consecutive_low,
    }
