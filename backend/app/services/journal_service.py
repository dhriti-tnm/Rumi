from datetime import datetime
from sqlmodel import Session, select
from fastapi import HTTPException, status

from app.models import Journal
from app.schemas import JournalCreateRequest, JournalUpdateRequest


# -------- CREATE --------

def create_journal(db: Session, user_id: int, data: JournalCreateRequest) -> Journal:
    journal = Journal(
        user_id=user_id,
        title=data.title,
        content=data.content,
        mood=data.mood,
    )
    db.add(journal)
    db.commit()
    db.refresh(journal)
    return journal


# -------- READ ALL (paginated) --------

def get_journals(db: Session, user_id: int, skip: int = 0, limit: int = 20) -> list[Journal]:
    statement = (
        select(Journal)
        .where(Journal.user_id == user_id, Journal.deleted_at == None)
        .order_by(Journal.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return db.exec(statement).all()


# -------- READ ONE --------

def get_journal(db: Session, user_id: int, journal_id: int) -> Journal:
    journal = db.exec(
        select(Journal).where(
            Journal.id == journal_id,
            Journal.user_id == user_id,
            Journal.deleted_at == None,
        )
    ).first()

    if not journal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal entry not found",
        )
    return journal


# -------- UPDATE --------

def update_journal(db: Session, user_id: int, journal_id: int, data: JournalUpdateRequest) -> Journal:
    journal = get_journal(db, user_id, journal_id)

    if data.title is not None:
        journal.title = data.title
    if data.content is not None:
        journal.content = data.content
    if data.mood is not None:
        journal.mood = data.mood

    journal.updated_at = datetime.utcnow()

    db.add(journal)
    db.commit()
    db.refresh(journal)
    return journal


# -------- DELETE (soft) --------

def delete_journal(db: Session, user_id: int, journal_id: int) -> None:
    journal = get_journal(db, user_id, journal_id)
    journal.deleted_at = datetime.utcnow()
    db.add(journal)
    db.commit()
