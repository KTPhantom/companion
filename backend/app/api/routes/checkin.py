from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.crud.checkin import create_check_in, get_wellbeing_summary
from app.dependencies.auth import get_db, get_current_user
from app.schemas.checkin import CheckInCreate, CheckInResponse, WellbeingSummary

router = APIRouter()


@router.post("", response_model=CheckInResponse, status_code=201)
def submit_check_in(
    data: CheckInCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return create_check_in(db, current_user.id, data)


@router.get("/summary", response_model=WellbeingSummary)
def read_wellbeing(
    days: int = 30,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_wellbeing_summary(
        db,
        current_user.id,
        current_user.timezone,
        days=max(1, min(days, 365)),
    )
