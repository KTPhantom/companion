from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import Base, engine
from app.models.user import User
from app.models.magic_token import MagicToken
from app.api.routes import auth
from app.models.session import StudySession
from app.api.routes.session import router as session_router

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the exact origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(session_router)

@app.get("/")
def root():
    return {
        "message": "Companion Backend Running"
    }