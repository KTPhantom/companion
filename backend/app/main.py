import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Registers every model on Base.metadata (used by Alembic autogenerate).
import app.db.base  # noqa: F401

from app.api.routes import auth, memory, companion, presence, checkin
from app.api.routes.session import router as session_router

# Schema is owned by Alembic, not create_all(). Apply changes with:
#   alembic upgrade head

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
app.include_router(presence.router, prefix="/api/presence", tags=["Presence"])
app.include_router(checkin.router, prefix="/api/check-ins", tags=["Wellbeing"])


@app.get("/")
def root():
    return {"message": "Companion OS backend running"}
