from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.models.session import StudySession
from app.models.user import User

from app.schemas.session import (
    SessionCreate,
    SessionResponse
)

from app.dependencies.auth import (
    get_db,
    get_current_user
)

router = APIRouter(
    prefix="/sessions",
    tags=["Sessions"]
)


@router.post(
    "/create",
    response_model=SessionResponse
)
def create_session(
    session: SessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    new_session = StudySession(

        user_id=current_user.id,

        subject=session.subject,

        duration=session.duration,

        focus_score=session.focus_score,

        completed=True
    )

    db.add(new_session)

    db.commit()

    db.refresh(new_session)

    return new_session


@router.get(
    "/my-sessions",
    response_model=list[SessionResponse]
)
def get_my_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    sessions = db.query(StudySession).filter(
        StudySession.user_id == current_user.id
    ).all()

    return sessions