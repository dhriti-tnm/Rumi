from sqlmodel import Session, select
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from fastapi import HTTPException, status
from app.config import api_response
from app.models import User, SessionManager
from app.utils import hash_password, verify_password, create_access_token, create_refresh_token,hash_token

load_dotenv()
ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")
REFRESH_TOKEN_EXPIRE_DAYS = os.getenv("REFRESH_TOKEN_EXPIRE_DAYS")
# ---------- USER ----------
def create_user(db: Session, user_data):
    user = User(
        name=user_data.name,
        email=user_data.email,
        username=user_data.username,
        hash_password=hash_password(user_data.password),
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    return user
    
def authenticate_user(db: Session, username: str, password: str):
    user = db.exec(select(User).where(User.username == username)).first()

    if not user or not verify_password(password, user.hash_password):
        return None

    return user


# ---------- SESSION / JWT ----------
def create_session(db: Session, user_id: int):
    access_token = create_access_token({"sub": str(user_id)})
    refresh_token = create_refresh_token({"sub": str(user_id)})

    session = SessionManager(
        user_id=user_id,
        session_token=hash_token(access_token),
        refresh_token=hash_token(refresh_token),
        created_at=datetime.utcnow(),
        expires_at=datetime.utcnow() + timedelta(minutes=int(ACCESS_TOKEN_EXPIRE_MINUTES)),
        refresh_expires_at=datetime.utcnow() + timedelta(days=int(REFRESH_TOKEN_EXPIRE_DAYS))
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
    }

def validate_access_token(db: Session, token: str):
    token_hash = hash_token(token)

    session = db.exec(select(SessionManager).where(SessionManager.session_token == token_hash,SessionManager.is_active == True)).first()
    user = None
    if session is not None:
        statement = select(User).where(User.id==session.user_id)
        user = db.exec(statement).first()
    
    return user

def revoke_session(db: Session, token: str):
    token_hash = hash_token(token)

    session = db.exec(select(SessionManager).where(SessionManager.session_token == token_hash)).first()

    if session:
        session.is_active = False
        db.add(session)
        db.commit()

