import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import Base, engine

# Models must be imported so create_all sees every table.
from app.models.user import User  # noqa: F401
from app.models.magic_token import MagicToken  # noqa: F401
from app.models.session import StudySession  # noqa: F401
from app.models.user_memory import UserMemory  # noqa: F401
from app.models.chat_message import ChatMessage  # noqa: F401

from app.api.routes import auth, memory, companion
from app.api.routes.session import router as session_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Companion OS",
    description="AI cognitive companion for focus, discipline, and lifelong growth.",
)

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
allowed_origins = {
    frontend_url,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
}

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(allowed_origins),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Every route lives under /api so the surface stays consistent for the frontend.
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(session_router, prefix="/api")
app.include_router(memory.router, prefix="/api/memory", tags=["Memory"])
app.include_router(companion.router, prefix="/api/companion", tags=["Companion"])


@app.get("/")
def root():
    return {"message": "Companion OS backend running"}
