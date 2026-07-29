import os

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.time import utcnow, resolve_timezone

from app.dependencies.auth import get_db, get_current_user
from app.crud.memory import get_user_memories
from app.crud.analytics import get_user_analytics
from app.crud.presence import get_presence_summary
from app.crud.checkin import get_wellbeing_summary
from app.models.chat_message import ChatMessage
from app.schemas.companion import ChatRequest, ChatResponse
from app.services.ai_service import generate_ai_response
from app.services.context_builder import build_context
from app.services.personality import supportive_response, FALLBACK_REPLY

router = APIRouter()

HISTORY_TURNS = 10

# Every chat turn is a paid API call. Without a ceiling, one user (or one
# runaway client loop) can run up an unbounded bill.
DAILY_MESSAGE_LIMIT = int(os.getenv("COMPANION_DAILY_MESSAGE_LIMIT", "100"))

QUOTA_REPLY = (
    "We've talked a lot today — I've reached my daily limit. I'll be back "
    "tomorrow. In the meantime, your sessions still count: pick one task and "
    "give it a focused block."
)


def _messages_today(db: Session, user_id: int, tz_name: str | None) -> int:
    tz = resolve_timezone(tz_name)
    start_of_day = utcnow().astimezone(tz).replace(
        hour=0, minute=0, second=0, microsecond=0
    )
    return db.query(ChatMessage).filter(
        ChatMessage.user_id == user_id,
        ChatMessage.role == "user",
        ChatMessage.created_at >= start_of_day,
    ).count()


@router.post("/chat", response_model=ChatResponse)
def chat_with_companion(
    data: ChatRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # Refuse before spending, not after.
    if _messages_today(db, current_user.id, current_user.timezone) >= DAILY_MESSAGE_LIMIT:
        db.add(ChatMessage(user_id=current_user.id, role="user", content=data.message))
        db.add(ChatMessage(user_id=current_user.id, role="assistant", content=QUOTA_REPLY))
        db.commit()
        return {"reply": QUOTA_REPLY}

    # Everything the companion knows about this person: long-term memories
    # plus the behavioral profile computed live from their sessions.
    memories = get_user_memories(db, current_user.id)
    analytics = get_user_analytics(db, current_user.id, current_user.timezone)
    presence = get_presence_summary(db, current_user.id, current_user.timezone)
    wellbeing = get_wellbeing_summary(db, current_user.id, current_user.timezone)

    # Conversation continuity comes from the server-side record, so the
    # companion remembers even across devices and refreshes.
    recent = db.query(ChatMessage).filter(
        ChatMessage.user_id == current_user.id
    ).order_by(ChatMessage.created_at.desc()).limit(HISTORY_TURNS).all()
    history = [
        {"role": m.role, "content": m.content}
        for m in reversed(recent)
    ]

    context = build_context(data.message, analytics, memories, presence, wellbeing)

    try:
        reply = generate_ai_response(context, history)
    except Exception:
        reply = FALLBACK_REPLY

    reply = supportive_response(reply)

    db.add(ChatMessage(user_id=current_user.id, role="user", content=data.message))
    db.add(ChatMessage(user_id=current_user.id, role="assistant", content=reply))
    db.commit()

    return {"reply": reply}


@router.get("/history")
def get_chat_history(
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    messages = db.query(ChatMessage).filter(
        ChatMessage.user_id == current_user.id
    ).order_by(ChatMessage.created_at.desc()).limit(min(limit, 200)).all()

    return [
        {"role": m.role, "content": m.content}
        for m in reversed(messages)
    ]
