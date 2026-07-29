from collections import Counter
from datetime import timedelta

from sqlalchemy.orm import Session

from app.core.time import utcnow, resolve_timezone, to_user_time
from app.models.presence_event import PresenceEvent
from app.schemas.presence import PresenceEventIn

# Leaving the tab or going idle mid-session are the two distraction signals.
DISTRACTION_EVENTS = ("tab_hidden", "idle_start")

EMPTY_SUMMARY = {
    "total_focus_sessions": 0,
    "completed_sessions": 0,
    "abandoned_sessions": 0,
    "distraction_events": 0,
    "distractions_per_session": 0.0,
    "avg_away_seconds": None,
    "most_distracted_hour": None,
    "interventions_shown": 0,
    "interventions_followed": 0,
    "intervention_follow_rate": None,
}


def record_events(db: Session, user_id: int, events: list[PresenceEventIn]):
    """Append a batch of attention signals."""
    now = utcnow()
    rows = [
        PresenceEvent(
            user_id=user_id,
            event_type=event.event_type,
            # Trust the client's timestamp only as far as "not in the future".
            occurred_at=min(event.occurred_at or now, now)
            if event.occurred_at else now,
            subject=event.subject,
            duration_seconds=event.duration_seconds,
            intervention_key=event.intervention_key,
        )
        for event in events
    ]
    db.add_all(rows)
    db.commit()
    return len(rows)


def get_presence_summary(
    db: Session,
    user_id: int,
    timezone_name: str | None = None,
    days: int = 30,
):
    """Aggregate attention behaviour over a recent window.

    `intervention_follow_rate` is the number that matters most: the
    body-doubling evidence is self-reported rather than proven
    (docs/research-foundation.md #7), so the product measures whether its own
    interventions actually bring someone back to focus.
    """
    since = utcnow() - timedelta(days=days)

    events = db.query(PresenceEvent).filter(
        PresenceEvent.user_id == user_id,
        PresenceEvent.occurred_at >= since,
    ).all()

    if not events:
        return dict(EMPTY_SUMMARY)

    tz = resolve_timezone(timezone_name)
    counts = Counter(e.event_type for e in events)

    started = counts.get("focus_start", 0)
    completed = counts.get("focus_complete", 0)
    abandoned = counts.get("focus_abandon", 0)

    distractions = [e for e in events if e.event_type in DISTRACTION_EVENTS]

    away_durations = [
        e.duration_seconds for e in events
        if e.event_type in ("tab_visible", "idle_end") and e.duration_seconds
    ]

    distracted_hours = Counter(
        to_user_time(e.occurred_at, tz).hour for e in distractions
        if e.occurred_at
    )

    shown = counts.get("intervention_shown", 0)
    followed = counts.get("intervention_followed", 0)

    return {
        "total_focus_sessions": started,
        "completed_sessions": completed,
        "abandoned_sessions": abandoned,
        "distraction_events": len(distractions),
        "distractions_per_session": (
            round(len(distractions) / started, 2) if started else 0.0
        ),
        "avg_away_seconds": (
            round(sum(away_durations) / len(away_durations))
            if away_durations else None
        ),
        "most_distracted_hour": (
            distracted_hours.most_common(1)[0][0] if distracted_hours else None
        ),
        "interventions_shown": shown,
        "interventions_followed": followed,
        "intervention_follow_rate": (
            round(followed / shown, 2) if shown else None
        ),
    }
