from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.deps import get_current_user, get_current_user_optional
from app.schemas.trip import TripRead, TripCreate, TripUpdate

router = APIRouter(prefix="/api/trips", tags=["trips"])

@router.get("", response_model=List[TripRead])
def list_trips(q: Optional[str] = Query(None), limit: int = 50, offset: int = 0, db: Session = Depends(get_db)):
    from app.crud import list_trips as crud_list
    return crud_list(db, q=q, limit=limit, offset=offset)

@router.get("/search", response_model=List[TripRead])
def search_trips(city: str = Query(...), db: Session = Depends(get_db)):
    from app.crud import search_trips
    return search_trips(db, city=city)

@router.post("", response_model=TripRead, status_code=201)
def create_trip(payload: TripCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    from app.crud import create_trip
    return create_trip(db, user_id=current_user.id, trip_in=payload)    # Remplacer 1 par current_user.id

@router.get("/{trip_id}", response_model=TripRead)
def get_trip(trip_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user_optional)):
    from app.crud import get_trip
    trip = get_trip(db, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip

@router.put("/{trip_id}", response_model=TripRead)
def update_trip(trip_id: int, payload: TripUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    from app.crud import update_trip
    return update_trip(db, trip_id=trip_id, trip_in=payload, user=current_user)

@router.delete("/{trip_id}", status_code=204)
def delete_trip(trip_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    from app.crud import delete_trip
    delete_trip(db, trip_id=trip_id, user=current_user)
    return

@router.put("/{trip_id}/like", status_code=204)
def like_trip(trip_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    from app.crud import toggle_like
    toggle_like(db, user_id=current_user.id, trip_id=trip_id)
    return

@router.get("/{trip_id}/print")
def print_trip(trip_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user_optional)):
    # Rails: GET 'print' -> render PDF in original app
    from app.services.printing import render_trip_pdf
    return render_trip_pdf(db, trip_id, user=current_user)

@router.get("/{trip_id}/send_trip")
def send_trip(trip_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user_optional)):
    # Rails: GET send_trip (but in FastAPI prefer POST); kept GET to match routes.rb
    from app.services.mail import send_trip_email
    send_trip_email(db, trip_id=trip_id, sender=current_user)
    return {"detail": "Email queued"}

@router.put("/{trip_id}/make_my_day")
def make_my_day(trip_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    from app.services.make_my_day import assign_best_itinerary
    assign_best_itinerary(db, trip_id, user=current_user)
    return {"detail": "Itinerary updated"}

@router.get("/{trip_id}/map_markers")
def trip_markers(trip_id: int, db: Session = Depends(get_db)):
    from app.crud import get_markers_for_trip
    return get_markers_for_trip(db, trip_id)

@router.get("/{trip_id}/properties")
def trip_properties(trip_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user_optional)):
    from app.crud import trip_properties
    return trip_properties(db, trip_id)
