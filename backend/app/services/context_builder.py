def _format_hour(hour):
    if hour is None:
        return "not yet known"
    suffix = "AM" if hour < 12 else "PM"
    display = hour % 12 or 12
    return f"around {display}:00 {suffix}"


def build_context(message: str, analytics: dict, memories: dict):
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

LONG-TERM MEMORY (observations persisted across sessions):
{chr(10).join(memory_lines)}

THEIR MESSAGE:
{message}

Respond as their cognitive companion. Use the profile and memory above to make
the reply specific to them. If they are new (few sessions), focus on building
the habit; if they are consistent, reinforce identity and suggest the next
level of depth."""
