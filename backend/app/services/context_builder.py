def _format_hour(hour):
    if hour is None:
        return "not yet known"
    suffix = "AM" if hour < 12 else "PM"
    display = hour % 12 or 12
    return f"around {display}:00 {suffix}"


def _presence_lines(presence: dict | None):
    if not presence or not presence.get("total_focus_sessions"):
        return ["- No attention data captured yet."]

    lines = [
        f"- Distractions per session: {presence.get('distractions_per_session', 0)}",
        f"- Sessions completed vs abandoned: "
        f"{presence.get('completed_sessions', 0)} / {presence.get('abandoned_sessions', 0)}",
    ]
    if presence.get("most_distracted_hour") is not None:
        lines.append(
            f"- Most distraction-prone hour: {_format_hour(presence['most_distracted_hour'])}"
        )
    if presence.get("avg_away_seconds"):
        lines.append(
            f"- Average time away when they drift: {presence['avg_away_seconds']}s"
        )
    return lines


def _wellbeing_lines(wellbeing: dict | None):
    """What the person has said about how they feel — never inferred."""
    if not wellbeing or not wellbeing.get("check_ins"):
        return ["- They haven't shared how sessions feel yet."]

    lines = [
        f"- Self-reported energy (1 drained - 5 energised): {wellbeing.get('avg_energy')}",
        f"- Self-reported focus quality (1 scattered - 5 deep): "
        f"{wellbeing.get('avg_focus_quality')}",
    ]
    if wellbeing.get("energy_trend"):
        lines.append(f"- Energy trend: {wellbeing['energy_trend']}")
    if wellbeing.get("lowest_energy_hour") is not None:
        lines.append(
            f"- Energy is usually lowest {_format_hour(wellbeing['lowest_energy_hour'])}"
        )
    if wellbeing.get("consecutive_low_energy", 0) >= 3:
        lines.append(
            f"- IMPORTANT: {wellbeing['consecutive_low_energy']} low-energy check-ins "
            "in a row. Prioritise rest and lighter goals over pushing harder."
        )
    if wellbeing.get("recent_notes"):
        notes = "; ".join(f'"{n}"' for n in wellbeing["recent_notes"])
        lines.append(f"- Their recent words: {notes}")
    return lines


def build_context(
    message: str,
    analytics: dict,
    memories: dict,
    presence: dict | None = None,
    wellbeing: dict | None = None,
):
    """Assemble everything the companion knows about this person into one prompt.

    Combines live behavioral analytics (computed from sessions) with long-term
    memories (persisted observations) so replies are personal, not generic.
    """
    profile_lines = [
        f"- Total focus sessions: {analytics.get('total_sessions', 0)}",
        f"- Total focused minutes: {analytics.get('total_minutes', 0)}",
        f"- Average session length: {analytics.get('avg_session_minutes', 0)} min",
        f"- Session completion rate: {analytics.get('completion_rate', 0)}%",
        f"- Average focus score (100 = uninterrupted): "
        f"{analytics.get('avg_focus_score') or 'not yet measured'}",
        f"- Days with at least one session: {analytics.get('active_days', 0)}",
        f"- Peak focus hour: {_format_hour(analytics.get('peak_hour'))}",
        f"- Most-studied subject: {analytics.get('top_subject') or 'not yet known'}",
        f"- Sessions in the last 7 days: {analytics.get('sessions_last_7_days', 0)} "
        f"({analytics.get('minutes_last_7_days', 0)} min)",
    ]

    if analytics.get("recent_subjects"):
        profile_lines.append(
            "- Recent subjects: " + ", ".join(analytics["recent_subjects"])
        )

    memory_lines = [
        f"- {key.replace('_', ' ')}: {value}"
        for key, value in memories.items()
    ] or ["- No long-term memories recorded yet."]

    return f"""BEHAVIORAL PROFILE (computed from their real sessions):
{chr(10).join(profile_lines)}

ATTENTION PATTERNS (captured while they work):
{chr(10).join(_presence_lines(presence))}

WELLBEING (their own words, not inferred):
{chr(10).join(_wellbeing_lines(wellbeing))}

LONG-TERM MEMORY (observations persisted across sessions):
{chr(10).join(memory_lines)}

THEIR MESSAGE:
{message}

Respond as their cognitive companion. Use the profile and memory above to make
the reply specific to them. If they are new (few sessions), focus on building
the habit; if they are consistent, reinforce identity and suggest the next
level of depth."""
