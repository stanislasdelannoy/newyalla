from fastapi import APIRouter, Depends
from app.db.session import get_db
from app.schemas.user import UserCreate, UserRead

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=UserRead, status_code=201)
def register(payload: UserCreate, db = Depends(get_db)):
    from app.crud import create_user
    return create_user(db, payload)

@router.get("/omniauth/callback")
def omniauth_callback():
    # stub: implement oauth callback flow if required
    return {"detail": "OmniAuth callback stub"}
