from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import Any, List

from app.db.session import get_db
from app.deps import get_current_user
from app.schemas.trip_day import TripDayCreate, TripDayRead, TripDayUpdate
from app.db.models.trip_day import TripDay

router = APIRouter(tags=["trip_days"])

@router.post("/api/trips/{trip_id}/trip_days", response_model=TripDayRead, status_code=201)
def create_trip_day_under_trip(trip_id: int, payload: TripDayCreate, db: Session = Depends(get_db)): #, current_user=Depends(get_current_user)):
    from app.crud import create_trip_day
    return create_trip_day(db, trip_id=trip_id, payload=payload, user=1)

@router.get("/api/trips/{trip_id}/trip_days", response_model=List[TripDayRead], status_code=201)
def list_trip_days_under_trip(trip_id: int, db: Session = Depends(get_db)): #, current_user=Depends(get_current_user)
    trip_days = (
        db.query(TripDay)
        .filter(TripDay.trip_id == trip_id)
        .order_by(TripDay.date.asc().nulls_last(), TripDay.id.asc())
        .all()
    )
    return trip_days

@router.get("/api/trips/{trip_id}/trip_days/{trip_day_id}", response_model=TripDayRead)
def get_trip_day(trip_id: int, trip_day_id: int, db: Session = Depends(get_db)):
    from app.crud import get_trip_day
    td = get_trip_day(db, trip_day_id)
    if not td:
        raise HTTPException(status_code=404, detail="TripDay not found")
    return td

@router.put("/api/trips/{trip_id}/trip_days/{trip_day_id}", response_model=TripDayRead)
def update_trip_day(trip_id: int, trip_day_id: int, payload: TripDayUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    from app.crud import update_trip_day
    return update_trip_day(db, trip_day_id=trip_day_id, payload=payload, user=current_user)

@router.delete("/api/trips/{trip_id}/trip_days/{trip_day_id}", status_code=204)
def delete_trip_day(trip_id: int, trip_day_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    from app.crud import delete_trip_day
    delete_trip_day(db, trip_day_id=trip_day_id, user=current_user)
    return

@router.put("/api/trip_days/{trip_day_id}/update_title", status_code=200)
def update_title(trip_day_id: int, title: str = Body(..., embed=True), db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    from app.crud import update_title
    update_title(db, trip_day_id=trip_day_id, title=title, user=current_user)
    return
