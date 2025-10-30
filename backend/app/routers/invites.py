from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.invite import InviteCreate, InviteRead
from app.deps import get_current_user

router = APIRouter(prefix="/api/invites", tags=["invites"])

@router.post("", response_model=InviteRead, status_code=201)
def create_invite(payload: InviteCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    from app.crud import create_invite
    return create_invite(db, payload, current_user)

@router.delete("/{invite_id}", status_code=204)
def delete_invite(invite_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    from app.crud import delete_invite
    delete_invite(db, invite_id, current_user)
    return
