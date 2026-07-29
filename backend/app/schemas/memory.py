from pydantic import BaseModel

class MemoryCreate(BaseModel):

    key: str

    value: str