from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.deps import get_current_user
from app.schemas.activity import ActivityCreate, ActivityRead, ActivityUpdate

router = APIRouter(tags=["activities"])

# nested create + copy under a trip
@router.post("/api/trips/{trip_id}/activities", response_model=ActivityRead, status_code=201)
def create_activity_for_trip(trip_id: int, payload: ActivityCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    from app.crud import create_activity_for_trip
    return create_activity_for_trip(db, trip_id=trip_id, creator_id=current_user.id, activity_in=payload)

@router.put("/api/trips/{trip_id}/activities/{activity_id}/copy", response_model=ActivityRead)
def copy_activity_under_trip(trip_id: int, activity_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    from app.crud import copy_activity
    return copy_activity(db, activity_id=activity_id, user=current_user, target_trip_id=trip_id)

# top-level activity member actions
@router.put("/api/activities/{activity_id}/pin", status_code=204)
def pin_activity(activity_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    from app.crud import pin_activity
    pin_activity(db, activity_id=activity_id, user=current_user)
    return

@router.put("/api/activities/{activity_id}/change_position", status_code=204)
def change_position(activity_id: int, new_index: int = Body(..., embed=True), db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    from app.crud import change_position
    change_position(db, activity_id=activity_id, new_index=new_index, user=current_user)
    return
