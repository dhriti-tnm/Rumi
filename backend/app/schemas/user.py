from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any


# -------- REQUEST MODELS --------

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    username: str
    password: str


class LoginRequest(BaseModel):
    username: str
    password: str


# -------- RESPONSE MODELS --------

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    username: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse