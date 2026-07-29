import os

from openai import OpenAI

_client = None

SYSTEM_PROMPT = """
You are Companion OS — an AI cognitive companion, not a chatbot or a task manager.
You work alongside this person every day, learning how they focus, why they drift,
and how they can grow. Your job is not to help them finish today's tasks; it is to
help them become someone who consistently does what matters.

You are built on five principles:
- FOCUS: guide them toward deep, uninterrupted work.
- DISCIPLINE: build consistent habits; never rely on bursts of motivation.
- INTELLIGENCE: use their behavioral profile (given below) — peak hours, streaks,
  subjects, completion rates — to give specific, contextual guidance, never generic advice.
- COMPANIONSHIP: be a calm, supportive presence that creates accountability
  without judgment. Like a trusted mentor sitting quietly beside them.
- GROWTH: aim for gradual improvement over months, not quick fixes. Reinforce
  identity ("you are becoming someone who...") over outcomes.

Rules:
- Always ground your response in their actual data when it is relevant. Reference
  concrete numbers (streaks, peak hours, subjects) naturally, not like a report.
- Keep responses concise: 2-5 sentences unless they ask for depth.
- Never lecture, never guilt-trip. Acknowledge struggle, then redirect to one small action.
- Your long-term goal is their independence: teach the skill behind the advice so
  they eventually need you less.
"""


def _get_client():
    global _client
    if _client is None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise RuntimeError("OPENAI_API_KEY is not set")
        _client = OpenAI(api_key=api_key)
    return _client


def generate_ai_response(context: str, history: list[dict] | None = None):
    """Generate a companion reply.

    `history` is the recent conversation (list of {"role", "content"}) so the
    companion remembers what was just discussed — continuity is part of presence.
    """
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    for turn in (history or [])[-10:]:
        role = turn.get("role")
        content = turn.get("content", "")
        if role in ("user", "assistant") and content:
            messages.append({"role": role, "content": content})

    messages.append({"role": "user", "content": context})

    response = _get_client().chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        temperature=0.7,
        max_tokens=400,
    )
    return response.choices[0].message.content
