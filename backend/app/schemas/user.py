from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    timezone: str = "UTC"
    daily_goal: int = 6

    class Config:
        from_attributes = True


class UserPreferences(BaseModel):
    daily_goal: int = Field(ge=1, le=20)