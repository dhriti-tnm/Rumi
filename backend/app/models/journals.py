from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field


class Journal(SQLModel, table=True):
    __tablename__ = "journals"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    title: str = Field(index=True)
    content: str
    mood: Optional[str] = Field(default=None)  # e.g. "happy", "sad" – for future use
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default=None)
    deleted_at: Optional[datetime] = Field(default=None)  # soft-delete
