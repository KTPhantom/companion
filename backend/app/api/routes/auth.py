from fastapi import APIRouter, Depends, HTTPException, status
import os
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.user import User
from app.models.magic_token import MagicToken
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.schemas.auth import MagicLinkRequest, MagicLinkVerify
from app.core.security import hash_password, verify_password, create_access_token
from app.core.email import send_magic_link
import secrets
from datetime import datetime, timedelta

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
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

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/request-magic-link")
async def request_magic_link(req: MagicLinkRequest, db: Session = Depends(get_db)):
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(minutes=15)
    
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
        MagicToken.expires_at > datetime.utcnow()
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