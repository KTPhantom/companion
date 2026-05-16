from fastapi import FastAPI
from app.db.database import Base, engine
from app.models.user import User
from app.api.routes import auth
from app.models.session import StudySession
from app.api.routes.session import router as session_router

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(session_router)

@app.get("/")
def root():
    return {
        "message": "Companion Backend Running"
    }