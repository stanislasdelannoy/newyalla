from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.deps import get_current_user
from app.schemas.activity import ActivityCreate, ActivityRead, ActivityBase
from app.db.models.activity import Activity
from app.core.auth import get_current_user

router = APIRouter(tags=["activities"])

# nested create + copy under a trip
@router.post("/api/trips/{trip_id}/activities", response_model=ActivityRead, status_code=201)
def create_activity_for_trip(trip_id: int, payload: ActivityCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    from app.crud import create_activity_for_trip

    payload.trip_id = trip_id
    return create_activity_for_trip(db, trip_id=trip_id, user_id=current_user.id, activity_in=payload)    #Remplacer par current_user.id,

@router.post("/api/trip_days/{trip_day_id}/activities", response_model=ActivityRead, status_code=201)
def create_activity_for_trip_day(
    trip_day_id: int,
    payload: ActivityBase,  # pas besoin de trip_id ni trip_day_id dans le body
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    from app.db.models.trip_day import TripDay
    from app.crud import create_activity_for_trip

    trip_day = db.query(TripDay).filter(TripDay.id == trip_day_id).first()
    if not trip_day:
        raise HTTPException(status_code=404, detail="TripDay not found")

    user_id = current_user.id  # temporaire tant qu'on n'a pas remis l'auth

    # on enlève trip_id / trip_day_id / user_id du dict avant de passer à ActivityCreate
    base_data = payload.model_dump(
        exclude={"trip_id", "trip_day_id", "user_id"},
    )

    activity_in = ActivityCreate(
        **base_data,
        trip_id=trip_day.trip_id,
        trip_day_id=trip_day_id,
        user_id=user_id,
    )

    return create_activity_for_trip(
        db=db,
        trip_id=trip_day.trip_id,
        user_id=user_id,
        activity_in=activity_in,
    )

@router.get("/api/trip_days/{trip_day_id}/activities", response_model=List[ActivityRead])
def list_activities_for_trip_day(
    trip_day_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),  # à remettre plus tard si tu veux protéger
):
    activities = (
        db.query(Activity)
        .filter(Activity.trip_day_id == trip_day_id)
        .order_by(Activity.index.asc().nulls_last(), Activity.id.asc())
        .all()
    )
    return activities

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
