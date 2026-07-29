from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.crud.presence import record_events, get_presence_summary
from app.dependencies.auth import get_db, get_current_user
from app.schemas.presence import PresenceEventBatch, PresenceSummary

router = APIRouter()


@router.post("/events", status_code=202)
def ingest_events(
    batch: PresenceEventBatch,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    recorded = record_events(db, current_user.id, batch.events)
    return {"recorded": recorded}


@router.get("/summary", response_model=PresenceSummary)
def read_summary(
    days: int = 30,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_presence_summary(
        db,
        current_user.id,
        current_user.timezone,
        days=max(1, min(days, 365)),
    )
