from pydantic import BaseModel
from datetime import datetime
from typing import Optional


# -------- REQUEST MODELS --------

class JournalCreateRequest(BaseModel):
    title: str
    content: str
    mood: Optional[str] = None


class JournalUpdateRequest(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    mood: Optional[str] = None


# -------- RESPONSE MODELS --------

class JournalResponse(BaseModel):
    id: int
    user_id: int
    title: str
    content: str
    mood: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
