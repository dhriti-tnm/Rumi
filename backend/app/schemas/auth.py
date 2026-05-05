from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SessionCreate(BaseModel):
    user_id: int


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class SessionOut(BaseModel):
    id: int
    user_id: int
    created_at: datetime
    expires_at: datetime
    is_active: bool