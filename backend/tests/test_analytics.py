"""Tests for the behavioral profile.

These functions decide what the companion believes about the user, so a silent
regression here corrupts every downstream reply, insight, and intervention.
"""

from datetime import datetime, timedelta, timezone

import pytest

from app.crud.analytics import get_user_analytics
from app.models.session import StudySession
from app.models.user import User

IST = "Asia/Kolkata"


@pytest.fixture
def user(db):
    user = User(username="kshitij", email="k@example.com", hashed_password="x")
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def add_session(db, user, started_at, *, subject="Deep Work", duration=25,
                focus_score=100, completed=True):
    db.add(StudySession(
        user_id=user.id,
        subject=subject,
        duration=duration,
        focus_score=focus_score,
        completed=completed,
        started_at=started_at,
    ))
    db.commit()


def test_empty_profile_for_new_user(db, user):
    profile = get_user_analytics(db, user.id)

    assert profile["total_sessions"] == 0
    assert profile["current_streak"] == 0
    assert profile["peak_hour"] is None
    assert profile["avg_focus_score"] is None


def test_totals_and_averages(db, user):
    now = datetime.now(timezone.utc)
    add_session(db, user, now, duration=30, focus_score=100)
    add_session(db, user, now, duration=20, focus_score=70)

    profile = get_user_analytics(db, user.id)

    assert profile["total_sessions"] == 2
    assert profile["total_minutes"] == 50
    assert profile["avg_session_minutes"] == 25.0
    assert profile["avg_focus_score"] == 85
    assert profile["completion_rate"] == 100


def test_unmeasured_focus_scores_are_ignored(db, user):
    """Sessions recorded before interruption tracking have focus_score 0 and
    must not drag the average down."""
    now = datetime.now(timezone.utc)
    add_session(db, user, now, focus_score=0)
    add_session(db, user, now, focus_score=80)

    assert get_user_analytics(db, user.id)["avg_focus_score"] == 80


def test_streak_counts_consecutive_days(db, user):
    today = datetime.now(timezone.utc)
    for days_ago in (0, 1, 2):
        add_session(db, user, today - timedelta(days=days_ago))

    assert get_user_analytics(db, user.id)["current_streak"] == 3


def test_streak_breaks_on_a_missed_day(db, user):
    today = datetime.now(timezone.utc)
    for days_ago in (0, 1, 3, 4):  # gap at 2
        add_session(db, user, today - timedelta(days=days_ago))

    profile = get_user_analytics(db, user.id)

    assert profile["current_streak"] == 2
    assert profile["active_days"] == 4


def test_stale_streak_does_not_count(db, user):
    """A run that ended a week ago is not a current streak."""
    long_ago = datetime.now(timezone.utc) - timedelta(days=7)
    for days_ago in (0, 1, 2):
        add_session(db, user, long_ago - timedelta(days=days_ago))

    assert get_user_analytics(db, user.id)["current_streak"] == 0


def test_streak_survives_a_day_with_no_session_yet(db, user):
    """Today being empty must not break yesterday's streak."""
    yesterday = datetime.now(timezone.utc) - timedelta(days=1)
    add_session(db, user, yesterday)
    add_session(db, user, yesterday - timedelta(days=1))

    assert get_user_analytics(db, user.id)["current_streak"] == 2


def test_peak_hour_uses_user_timezone(db, user):
    """A session at 20:30 UTC is 02:00 next day in IST — the peak hour must
    reflect the user's experience, not the server's."""
    started = datetime(2026, 7, 20, 20, 30, tzinfo=timezone.utc)
    add_session(db, user, started)

    assert get_user_analytics(db, user.id, "UTC")["peak_hour"] == 20
    assert get_user_analytics(db, user.id, IST)["peak_hour"] == 2


def test_day_bucketing_uses_user_timezone(db, user):
    """Two sessions on either side of UTC midnight are the same IST day."""
    add_session(db, user, datetime(2026, 7, 20, 20, 0, tzinfo=timezone.utc))
    add_session(db, user, datetime(2026, 7, 20, 21, 0, tzinfo=timezone.utc))

    # 01:30 and 02:30 on Jul 21 in IST — one local day, not two.
    assert get_user_analytics(db, user.id, IST)["active_days"] == 1


def test_unknown_timezone_falls_back_to_utc(db, user):
    add_session(db, user, datetime(2026, 7, 20, 20, 30, tzinfo=timezone.utc))

    assert get_user_analytics(db, user.id, "Not/AZone")["peak_hour"] == 20


def test_top_subject_and_recent_window(db, user):
    now = datetime.now(timezone.utc)
    add_session(db, user, now, subject="Math")
    add_session(db, user, now, subject="Math")
    add_session(db, user, now, subject="Physics")
    add_session(db, user, now - timedelta(days=30), subject="History")

    profile = get_user_analytics(db, user.id)

    assert profile["top_subject"] == "Math"
    assert profile["sessions_last_7_days"] == 3
    assert profile["total_sessions"] == 4


def test_profile_is_scoped_to_the_user(db, user):
    other = User(username="other", email="o@example.com", hashed_password="x")
    db.add(other)
    db.commit()
    db.refresh(other)

    add_session(db, user, datetime.now(timezone.utc))
    add_session(db, other, datetime.now(timezone.utc))
    add_session(db, other, datetime.now(timezone.utc))

    assert get_user_analytics(db, user.id)["total_sessions"] == 1
    assert get_user_analytics(db, other.id)["total_sessions"] == 2
