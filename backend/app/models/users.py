from datetime import datetime, timedelta
from typing import Optional
from sqlmodel import SQLModel, Field

class User(SQLModel, table=True):
    __tablename__ = "user"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str = Field(index=True, unique=True)
    username: str = Field(index=True, unique=True)
    hash_password: str
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    deleted_at: Optional[datetime] = Field(default=None)

class SessionManager(SQLModel, table=True):
    __tablename__ = "session_manager"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    session_token: str = Field(unique=True, index=True)
    refresh_token: str = Field(unique=True, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: datetime = Field(default_factory=lambda: datetime.utcnow() + timedelta(hours=1),index=True)
    refresh_expires_at: Optional[datetime] = Field(default=None)
    is_active: bool = Field(default=True, index=True)