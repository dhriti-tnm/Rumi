from fastapi import APIRouter, Depends, HTTPException, status, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session
from typing import Optional

from app.config import api_response, get_session
from app.models import User
from app.services import create_user, authenticate_user, create_session, validate_access_token,revoke_session
from app.schemas import RegisterRequest, LoginRequest

router = APIRouter(prefix="/auth", tags=["Auth"])
security = HTTPBearer()

@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_session)):
    user = create_user(db, data)

    return api_response(
        success=True,
        message="User registered successfully",
        result={
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "username": user.username
        },
        status_code=status.HTTP_201_CREATED
    )


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_session)):
    user = authenticate_user(db, data.username, data.password)

    if not user:
        return api_response(
            success=False,
            message="Invalid credentials",
            errors=["Invalid username or password"],
            code=status.HTTP_401_UNAUTHORIZED
        )

    tokens = create_session(db, user.id)

    return api_response(
        success=True,
        message="Login successful",
        result={
            "access_token": tokens["access_token"],
            "refresh_token": tokens["refresh_token"],
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "username": user.username
            }
        },
        code=status.HTTP_200_OK
    )


@router.get("/me")
def get_me(authorization: HTTPAuthorizationCredentials = Depends(security),db: Session = Depends(get_session)):
    token = authorization.credentials

    user = validate_access_token(db, token)

    if not user:
        return api_response(
            success=False,
            message="Invalid token",
            errors=["Token expired or invalid"],
            code=status.HTTP_401_UNAUTHORIZED
        )

    return api_response(
        success=True,
        message="User fetched successfully",
        result={
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "username": user.username
        },
        code=status.HTTP_200_OK
    )


@router.post("/logout")
def logout(authorization: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_session)):
    token = authorization.credentials
    revoke_session(db, token)

    return api_response(
        success=True,
        message="Logout successful",
        result=None,
        code=status.HTTP_200_OK
    )