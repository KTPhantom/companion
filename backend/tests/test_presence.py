"""Tests for presence aggregation.

The intervention follow rate is the product's own answer to a real research
gap: body-doubling efficacy is self-reported, not proven
(docs/research-foundation.md #7). If this aggregation is wrong, we would be
measuring nothing.
"""

from datetime import datetime, timedelta, timezone

import pytest

from app.crud.presence import get_presence_summary, record_events
from app.models.user import User
from app.schemas.presence import PresenceEventIn

IST = "Asia/Kolkata"


@pytest.fixture
def user(db):
    user = User(username="kshitij", email="k@example.com", hashed_password="x")
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def emit(db, user, event_type, **kwargs):
    record_events(db, user.id, [PresenceEventIn(event_type=event_type, **kwargs)])


def test_empty_summary(db, user):
    summary = get_presence_summary(db, user.id)

    assert summary["total_focus_sessions"] == 0
    assert summary["intervention_follow_rate"] is None
    assert summary["most_distracted_hour"] is None


def test_counts_sessions_and_distractions(db, user):
    emit(db, user, "focus_start")
    emit(db, user, "focus_start")
    emit(db, user, "focus_complete")
    emit(db, user, "focus_abandon")
    emit(db, user, "tab_hidden")
    emit(db, user, "tab_hidden")
    emit(db, user, "idle_start")

    summary = get_presence_summary(db, user.id)

    assert summary["total_focus_sessions"] == 2
    assert summary["completed_sessions"] == 1
    assert summary["abandoned_sessions"] == 1
    assert summary["distraction_events"] == 3
    assert summary["distractions_per_session"] == 1.5


def test_intervention_follow_rate(db, user):
    for _ in range(4):
        emit(db, user, "intervention_shown", intervention_key="idle_check")
    for _ in range(3):
        emit(db, user, "intervention_followed", intervention_key="idle_check")

    summary = get_presence_summary(db, user.id)

    assert summary["interventions_shown"] == 4
    assert summary["interventions_followed"] == 3
    assert summary["intervention_follow_rate"] == 0.75


def test_follow_rate_is_none_when_nothing_was_shown(db, user):
    emit(db, user, "focus_start")

    assert get_presence_summary(db, user.id)["intervention_follow_rate"] is None


def test_average_away_time(db, user):
    emit(db, user, "tab_visible", duration_seconds=30)
    emit(db, user, "idle_end", duration_seconds=90)

    assert get_presence_summary(db, user.id)["avg_away_seconds"] == 60


def test_most_distracted_hour_uses_user_timezone(db, user):
    # 20:30 UTC is 02:00 next day in IST.
    at = datetime(2026, 7, 20, 20, 30, tzinfo=timezone.utc)
    record_events(db, user.id, [
        PresenceEventIn(event_type="tab_hidden", occurred_at=at),
        PresenceEventIn(event_type="tab_hidden", occurred_at=at),
    ])

    assert get_presence_summary(db, user.id, "UTC")["most_distracted_hour"] == 20
    assert get_presence_summary(db, user.id, IST)["most_distracted_hour"] == 2


def test_window_excludes_old_events(db, user):
    old = datetime.now(timezone.utc) - timedelta(days=45)
    record_events(db, user.id, [
        PresenceEventIn(event_type="focus_start", occurred_at=old),
    ])
    emit(db, user, "focus_start")

    assert get_presence_summary(db, user.id, days=30)["total_focus_sessions"] == 1
    assert get_presence_summary(db, user.id, days=60)["total_focus_sessions"] == 2


def test_future_timestamps_are_clamped(db, user):
    """A client with a skewed clock must not be able to write the future."""
    future = datetime.now(timezone.utc) + timedelta(days=3)
    record_events(db, user.id, [
        PresenceEventIn(event_type="focus_start", occurred_at=future),
    ])

    assert get_presence_summary(db, user.id, days=1)["total_focus_sessions"] == 1


def test_summary_is_scoped_to_the_user(db, user):
    other = User(username="other", email="o@example.com", hashed_password="x")
    db.add(other)
    db.commit()
    db.refresh(other)

    emit(db, user, "focus_start")
    emit(db, other, "focus_start")
    emit(db, other, "focus_start")

    assert get_presence_summary(db, user.id)["total_focus_sessions"] == 1
    assert get_presence_summary(db, other.id)["total_focus_sessions"] == 2
