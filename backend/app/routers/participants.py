from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.deps import get_current_user

router = APIRouter(prefix="/api/participants", tags=["participants"])

@router.delete("/{participant_id}", status_code=204)
def remove_participant(participant_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    from app.crud import delete_participant
    delete_participant(db, participant_id=participant_id, user=current_user)
    return
