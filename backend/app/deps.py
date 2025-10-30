from typing import Optional
from fastapi import Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.db.models.user import User


def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _get_user_from_token(db: Session, token: str) -> Optional[User]:
    """
    Very small auth stub for development:
    Accepts Authorization: Bearer <user_id> and returns user from DB.
    Replace with real JWT/OAuth in production.
    """
    if not token:
        return None
    parts = token.split()
    if len(parts) == 2 and parts[0].lower() == "bearer":
        try:
            user_id = int(parts[1])
        except ValueError:
            return None
        return db.query(User).get(user_id)
    return None


def get_current_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)) -> User:
    user = _get_user_from_token(db, authorization)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return user


def get_current_user_optional(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)) -> Optional[User]:
    return _get_user_from_token(db, authorization)