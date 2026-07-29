FALLBACK_REPLY = (
    "I can't reach my reasoning systems right now, but I'm still here with you. "
    "Pick the one task that matters most and give it twenty focused minutes — "
    "I'll be tracking your session."
)


def supportive_response(message: str) -> str:
    """Final tone guard for companion replies.

    The companion's voice (calm, specific, identity-reinforcing) is enforced by
    the system prompt; this only cleans up the output. Appending the same
    motivational line to every reply made the companion feel scripted, which is
    the opposite of presence — so it no longer does that.
    """
    return (message or FALLBACK_REPLY).strip()
