from fastapi import APIRouter, Depends, HTTPException, status
import os
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.magic_token import MagicToken
from app.schemas.user import UserCreate, UserLogin, UserResponse, UserPreferences
from app.schemas.auth import MagicLinkRequest, MagicLinkVerify
from app.core.security import hash_password, verify_password, create_access_token
from app.core.email import send_magic_link
from app.dependencies.auth import get_db, get_current_user
from app.core.time import utcnow
from app.core.rate_limit import rate_limit
import secrets
from datetime import timedelta

router = APIRouter()

@router.get("/me", response_model=UserResponse)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/me/preferences", response_model=UserResponse)
def update_preferences(
    prefs: UserPreferences,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    current_user.daily_goal = prefs.daily_goal
    db.commit()
    db.refresh(current_user)
    return current_user

@router.post(
    "/signup",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(rate_limit("signup", limit=5, window_seconds=3600))],
)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    db_username = db.query(User).filter(User.username == user.username).first()
    if db_username:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    hashed_pwd = hash_password(user.password)
    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_pwd
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post(
    "/login",
    # Password guessing is otherwise unbounded.
    dependencies=[Depends(rate_limit("login", limit=10, window_seconds=300))],
)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post(
    "/request-magic-link",
    # Each request sends a real email; without a cap this is a spam relay.
    dependencies=[Depends(rate_limit("magic_link", limit=5, window_seconds=900))],
)
async def request_magic_link(req: MagicLinkRequest, db: Session = Depends(get_db)):
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    token = secrets.token_urlsafe(32)
    expires_at = utcnow() + timedelta(minutes=15)
    
    magic_token = MagicToken(
        token=token,
        email=req.email,
        expires_at=expires_at
    )
    db.add(magic_token)
    db.commit()
    
    # Send actual email
    try:
        await send_magic_link(req.email, token)
        print(f"\n✅ [SUCCESS] Magic Link sent to {req.email}")
        print(f"🔗 [DEBUG] Link is: {frontend_url}/auth/verify?token={token}\n")
    except Exception as e:
        print(f"\n❌ [EMAIL ERROR] Failed to send to {req.email}")
        print(f"📝 [REASON] {str(e)}")
        print(f"💡 [FALLBACK] Use this link: {frontend_url}/auth/verify?token={token}\n")
    
    return {"message": "Magic link sent to your email"}

@router.post("/verify-magic-link")
def verify_magic_link(req: MagicLinkVerify, db: Session = Depends(get_db)):
    magic_token = db.query(MagicToken).filter(
        MagicToken.token == req.token,
        MagicToken.used == False,
        MagicToken.expires_at > utcnow()
    ).first()
    
    if not magic_token:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    
    # Mark token as used
    magic_token.used = True
    db.commit()
    
    # Find or create user
    db_user = db.query(User).filter(User.email == magic_token.email).first()
    if not db_user:
        # Create a basic user if they don't exist
        # Username defaults to part of email for simplicity
        username = magic_token.email.split("@")[0]
        db_user = User(
            email=magic_token.email,
            username=username,
            hashed_password=hash_password(secrets.token_hex(12)) # Secure random password
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
    
    access_token = create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}