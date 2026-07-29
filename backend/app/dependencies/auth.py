from fastapi import Depends, Header, HTTPException
from fastapi.security import HTTPBearer
from jose import jwt, JWTError

from app.db.database import SessionLocal
from app.models.user import User
from app.core.security import SECRET_KEY, ALGORITHM
from app.core.time import is_valid_timezone

security = HTTPBearer()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    credentials=Depends(security),
    db=Depends(get_db),
    x_timezone: str | None = Header(default=None)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    # The browser reports its zone on every request; persist it when it
    # changes (travel, or a user who predates this column). Writes are rare
    # because the value is stable after the first request.
    if is_valid_timezone(x_timezone) and user.timezone != x_timezone:
        user.timezone = x_timezone
        db.commit()

    return user
