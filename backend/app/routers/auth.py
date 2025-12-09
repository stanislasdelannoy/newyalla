from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

from app.db.session import get_db
from app.db.models.user import User  # adapte le chemin
from app.schemas.user import UserCreate, UserRead, UserLogin, Token
from app.core.auth import get_password_hash, verify_password, create_access_token

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # 1) Email déjà utilisé ?
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # 2) Création du user
    hashed_password = get_password_hash(user_in.password)

    user = User(
        email=user_in.email,
        encrypted_password=hashed_password,
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        username=user_in.username or user_in.email.split("@")[0],
        phone=user_in.phone,
        hometown=user_in.hometown,
        # le reste (sign_in_count, created_at, etc.) est géré par les defaults du modèle
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

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
