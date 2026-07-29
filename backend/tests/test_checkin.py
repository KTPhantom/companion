"""Tests for self-reported wellbeing.

This is the entry point to Emotional Intelligence, and the reason it is
self-reported rather than inferred is that nothing in the research supports
deriving emotion from behavioural signals. These tests hold that line: the
summary reports what the user said, and low energy must be detectable so the
companion can suggest rest instead of pressure.
"""

from datetime import datetime, timedelta, timezone

import pytest

from app.crud.checkin import create_check_in, get_wellbeing_summary
from app.models.session_checkin import SessionCheckIn
from app.models.user import User
from app.schemas.checkin import CheckInCreate

IST = "Asia/Kolkata"


@pytest.fixture
def user(db):
    user = User(username="kshitij", email="k@example.com", hashed_password="x")
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def check_in(db, user, energy, focus="okay", note=None, at=None):
    if at is None:
        create_check_in(db, user.id, CheckInCreate(
            energy=energy, focus_quality=focus, note=note
        ))
        return
    row = SessionCheckIn(
        user_id=user.id, energy=energy, focus_quality=focus,
        note=note, created_at=at,
    )
    db.add(row)
    db.commit()


def test_empty_summary(db, user):
    summary = get_wellbeing_summary(db, user.id)

    assert summary["check_ins"] == 0
    assert summary["avg_energy"] is None
    assert summary["energy_trend"] is None
    assert summary["consecutive_low_energy"] == 0


def test_averages_use_an_ordered_scale(db, user):
    check_in(db, user, "drained")     # 1
    check_in(db, user, "energised")   # 5

    summary = get_wellbeing_summary(db, user.id)

    assert summary["check_ins"] == 2
    assert summary["avg_energy"] == 3.0


def test_focus_quality_is_scored_separately(db, user):
    check_in(db, user, "good", focus="deep")      # focus 5
    check_in(db, user, "good", focus="scattered")  # focus 1

    assert get_wellbeing_summary(db, user.id)["avg_focus_quality"] == 3.0


def test_consecutive_low_energy_is_detected(db, user):
    """Three low reports in a row is the signal for suggesting rest."""
    base = datetime.now(timezone.utc) - timedelta(hours=5)
    check_in(db, user, "good", at=base)
    check_in(db, user, "tired", at=base + timedelta(hours=1))
    check_in(db, user, "drained", at=base + timedelta(hours=2))
    check_in(db, user, "tired", at=base + timedelta(hours=3))

    assert get_wellbeing_summary(db, user.id)["consecutive_low_energy"] == 3


def test_a_good_report_breaks_the_low_run(db, user):
    base = datetime.now(timezone.utc) - timedelta(hours=5)
    check_in(db, user, "drained", at=base)
    check_in(db, user, "drained", at=base + timedelta(hours=1))
    check_in(db, user, "good", at=base + timedelta(hours=2))

    assert get_wellbeing_summary(db, user.id)["consecutive_low_energy"] == 0


def test_trend_needs_enough_data(db, user):
    """Below four points, noise looks like a trend."""
    check_in(db, user, "tired")
    check_in(db, user, "good")

    assert get_wellbeing_summary(db, user.id)["energy_trend"] is None


def test_declining_and_improving_trends(db, user):
    base = datetime.now(timezone.utc) - timedelta(hours=8)
    for i, energy in enumerate(["energised", "good", "tired", "drained"]):
        check_in(db, user, energy, at=base + timedelta(hours=i))

    assert get_wellbeing_summary(db, user.id)["energy_trend"] == "declining"

    other = User(username="b", email="b@example.com", hashed_password="x")
    db.add(other)
    db.commit()
    db.refresh(other)
    for i, energy in enumerate(["drained", "tired", "good", "energised"]):
        check_in(db, other, energy, at=base + timedelta(hours=i))

    assert get_wellbeing_summary(db, other.id)["energy_trend"] == "improving"


def test_lowest_energy_hour_uses_user_timezone(db, user):
    # 20:30 UTC is 02:00 next day in IST.
    at = datetime(2026, 7, 20, 20, 30, tzinfo=timezone.utc)
    check_in(db, user, "drained", at=at)
    check_in(db, user, "tired", at=at)

    assert get_wellbeing_summary(db, user.id, "UTC")["lowest_energy_hour"] == 20
    assert get_wellbeing_summary(db, user.id, IST)["lowest_energy_hour"] == 2


def test_notes_are_optional_and_blank_notes_dropped(db, user):
    create_check_in(db, user.id, CheckInCreate(
        energy="good", focus_quality="sharp", note="   "
    ))

    summary = get_wellbeing_summary(db, user.id)

    assert summary["check_ins"] == 1
    assert summary["recent_notes"] == []


def test_recent_notes_are_returned_for_the_companion(db, user):
    check_in(db, user, "tired", note="Slept badly")

    assert get_wellbeing_summary(db, user.id)["recent_notes"] == ["Slept badly"]


def test_summary_is_scoped_to_the_user(db, user):
    other = User(username="other", email="o@example.com", hashed_password="x")
    db.add(other)
    db.commit()
    db.refresh(other)

    check_in(db, user, "good")
    check_in(db, other, "drained")
    check_in(db, other, "drained")

    assert get_wellbeing_summary(db, user.id)["check_ins"] == 1
    assert get_wellbeing_summary(db, other.id)["check_ins"] == 2
