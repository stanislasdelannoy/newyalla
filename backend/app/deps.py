from typing import Optional
from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.orm import Session
from jose import JWTError, jwt

from app.db.session import SessionLocal
from app.db.models.user import User
from app.core.auth import SECRET_KEY, ALGORITHM


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


def get_current_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db),
) -> User:
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized",
            headers={"WWW-Authenticate": "Bearer"},
        )

    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unauthorized",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user


def get_current_user_optional(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)) -> Optional[User]:
    return _get_user_from_token(db, authorization)
