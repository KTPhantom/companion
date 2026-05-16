from pydantic import BaseModel, EmailStr
from typing import Optional

class MagicLinkRequest(BaseModel):
    email: EmailStr

class MagicLinkVerify(BaseModel):
    token: str
