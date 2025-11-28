from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

from app.db.session import get_db
from app.db.models.user import User  # adapte le chemin
from app.schemas.user import UserCreate, UserRead, UserLogin, Token
from app.core.auth import get_password_hash, verify_password, create_access_token

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=UserRead, status_code=201)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # vérifier si email déjà pris
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    db_user = User(
        email=user_in.email,
        encrypted_password=get_password_hash(user_in.password),
        sign_in_count=0,
        # mets created_at/updated_at par défaut en DB si possible
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

from sqlalchemy import text

@router.post("/login", response_model=Token)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    print("📌 user trouvé =", user)

    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not verify_password(user_in.password, user.encrypted_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access_token = create_access_token({"sub": str(user.id)})
    return Token(access_token=access_token, token_type="bearer")
