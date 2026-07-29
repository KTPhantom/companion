from sqlalchemy.orm import Session

from app.models.user_memory import UserMemory

def save_memory(

    db: Session,

    user_id: int,

    key: str,

    value: str

):

    existing = db.query(

        UserMemory

    ).filter(

        UserMemory.user_id == user_id,

        UserMemory.key == key

    ).first()

    if existing:

        existing.value = value

    else:

        memory = UserMemory(

            user_id=user_id,

            key=key,

            value=value
        )

        db.add(memory)

    db.commit()

def get_user_memories(
    db: Session,
    user_id: int
):
    memories = db.query(
        UserMemory
    ).filter(
        UserMemory.user_id == user_id
    ).all()

    return {
        memory.key: memory.value
        for memory in memories
    }