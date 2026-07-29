from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies.auth import get_db, get_current_user
from app.schemas.memory import MemoryCreate
from app.crud.memory import save_memory, get_user_memories

router = APIRouter()


@router.post("/save")
def save_user_memory(
    data: MemoryCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    save_memory(db, current_user.id, data.key, data.value)
    return {"message": "Memory saved"}


@router.get("/my-memories")
def read_user_memories(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_user_memories(db, current_user.id)
