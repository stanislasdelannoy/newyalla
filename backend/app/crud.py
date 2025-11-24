from typing import List, Optional, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.db.models.trip import Trip
from app.db.models.activity import Activity
from app.db.models.trip_day import TripDay
from app.db.models.participant import Participant
from app.db.models.invite import Invite
from app.db.models.user import User
from app.db.models.vote import Vote


# ---------- Trips ----------
def list_trips(db: Session, q: Optional[str] = None, limit: int = 50, offset: int = 0) -> List[Trip]:
    query = db.query(Trip).filter(getattr(Trip, "public", True) == True)
    if q:
        if hasattr(Trip, "title"):
            query = query.filter(Trip.title.ilike(f"%{q}%"))
    return query.order_by(getattr(Trip, "id")).offset(offset).limit(limit).all()


def search_trips(db: Session, city: str) -> List[Trip]:
    if hasattr(Trip, "city"):
        return db.query(Trip).filter(Trip.city.ilike(f"%{city}%")).all()
    return []


def get_user_trips(db: Session, user_id: int) -> List[Trip]:
    trips = []
    # owned trips
    owned = db.query(Trip).filter(getattr(Trip, "owner_id", None) == user_id).all()
    trips.extend(owned)
    # participated trips
    parts = db.query(Participant).filter(Participant.user_id == user_id).all()
    for p in parts:
        t = getattr(p, "trip", None)
        if t and t not in trips:
            trips.append(t)
    return trips


def create_trip(db: Session, user_id: int, trip_in: Any) -> Trip:
    data = trip_in.dict() if hasattr(trip_in, "dict") else dict(trip_in)
    data["user_id"] = user_id
    trip = Trip(**data)
    db.add(trip)
    db.commit()
    db.refresh(trip)
    return trip


def get_trip(db: Session, trip_id: int) -> Optional[Trip]:
    return db.query(Trip).get(trip_id)


def update_trip(db: Session, trip_id: int, trip_in: Any, user: User) -> Trip:
    trip = get_trip(db, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    owner_id = getattr(trip, "owner_id", None)
    if owner_id is not None and owner_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this trip")
    data = trip_in.dict(exclude_unset=True) if hasattr(trip_in, "dict") else dict(trip_in)
    for k, v in data.items():
        if hasattr(trip, k):
            setattr(trip, k, v)
    db.add(trip)
    db.commit()
    db.refresh(trip)
    return trip


def delete_trip(db: Session, trip_id: int, user: User) -> None:
    trip = get_trip(db, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    owner_id = getattr(trip, "owner_id", None)
    if owner_id is not None and owner_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this trip")
    db.delete(trip)
    db.commit()
    return


def toggle_like(db: Session, user_id: int, trip_id: int) -> None:
    # basic implementation: Vote model with user_id & trip_id fields
    vote = db.query(Vote).filter(getattr(Vote, "user_id") == user_id, getattr(Vote, "trip_id") == trip_id).first()
    if vote:
        db.delete(vote)
        db.commit()
        return
    new_vote = Vote(user_id=user_id, trip_id=trip_id)
    db.add(new_vote)
    db.commit()
    return


# ---------- Activities ----------
def create_activity_for_trip(db: Session, trip_id: int, user_id: int, activity_in: Any) -> Activity:
    data = activity_in.dict() if hasattr(activity_in, "dict") else dict(activity_in)
    data["trip_id"] = trip_id
    data["user_id"] = user_id
    activity = Activity(**data)
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return activity


def copy_activity(db: Session, activity_id: int, user: User, target_trip_id: Optional[int] = None) -> Activity:
    act = db.query(Activity).get(activity_id)
    if not act:
        raise HTTPException(status_code=404, detail="Activity not found")
    data = {c.name: getattr(act, c.name) for c in act.__table__.columns if c.name not in ("id", "created_at", "updated_at")}
    if target_trip_id:
        data["trip_id"] = target_trip_id
    new_act = Activity(**data)
    db.add(new_act)
    db.commit()
    db.refresh(new_act)
    return new_act


def pin_activity(db: Session, activity_id: int, user: User) -> None:
    act = db.query(Activity).get(activity_id)
    if not act:
        raise HTTPException(status_code=404, detail="Activity not found")
    # toggle pinned flag if exists
    if hasattr(act, "pinned"):
        act.pinned = not bool(getattr(act, "pinned"))
        db.add(act)
        db.commit()
    return


def change_position(db: Session, activity_id: int, new_index: int, user: User) -> None:
    act = db.query(Activity).get(activity_id)
    if not act:
        raise HTTPException(status_code=404, detail="Activity not found")
    if hasattr(act, "position"):
        act.position = new_index
        db.add(act)
        db.commit()
    return


# ---------- TripDays ----------
def create_trip_day(db: Session, trip_id: int, payload: Any, user: User) -> TripDay:
    data = payload.dict() if hasattr(payload, "dict") else dict(payload)
    data["trip_id"] = trip_id
    td = TripDay(**data)
    db.add(td)
    db.commit()
    db.refresh(td)
    return td


def get_trip_day(db: Session, trip_day_id: int) -> Optional[TripDay]:
    return db.query(TripDay).get(trip_day_id)


def update_trip_day(db: Session, trip_day_id: int, payload: Any, user: User) -> TripDay:
    td = get_trip_day(db, trip_day_id)
    if not td:
        raise HTTPException(status_code=404, detail="TripDay not found")
    data = payload.dict(exclude_unset=True) if hasattr(payload, "dict") else dict(payload)
    for k, v in data.items():
        if hasattr(td, k):
            setattr(td, k, v)
    db.add(td)
    db.commit()
    db.refresh(td)
    return td


def delete_trip_day(db: Session, trip_day_id: int, user: User) -> None:
    td = get_trip_day(db, trip_day_id)
    if not td:
        raise HTTPException(status_code=404, detail="TripDay not found")
    db.delete(td)
    db.commit()
    return


def update_title(db: Session, trip_day_id: int, title: str, user: User) -> None:
    td = get_trip_day(db, trip_day_id)
    if not td:
        raise HTTPException(status_code=404, detail="TripDay not found")
    if hasattr(td, "title"):
        td.title = title
        db.add(td)
        db.commit()
    return


# ---------- Participants ----------
def delete_participant(db: Session, participant_id: int, user: User) -> None:
    p = db.query(Participant).get(participant_id)
    if not p:
        raise HTTPException(status_code=404, detail="Participant not found")
    db.delete(p)
    db.commit()
    return


# ---------- Invites ----------
def create_invite(db: Session, payload: Any, user: User) -> Invite:
    data = payload.dict() if hasattr(payload, "dict") else dict(payload)
    data["sender_id"] = user.id if user is not None else None
    inv = Invite(**data)
    db.add(inv)
    db.commit()
    db.refresh(inv)
    return inv


def delete_invite(db: Session, invite_id: int, user: User) -> None:
    inv = db.query(Invite).get(invite_id)
    if not inv:
        raise HTTPException(status_code=404, detail="Invite not found")
    db.delete(inv)
    db.commit()
    return


def trip_properties(db: Session, trip_id: int) -> dict:
    trip = get_trip(db, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    # minimal properties payload: invites count, participants count
    invites_count = db.query(Invite).filter(getattr(Invite, "trip_id", None) == trip_id).count()
    participants_count = db.query(Participant).filter(getattr(Participant, "trip_id", None) == trip_id).count()
    return {"invites_count": invites_count, "participants_count": participants_count}


# ---------- Users ----------
def create_user(db: Session, payload: Any) -> User:
    data = payload.dict() if hasattr(payload, "dict") else dict(payload)
    # TODO: hash password here in production
    user = User(**data)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# ---------- Utilities ----------
def get_markers_for_trip(db: Session, trip_id: int) -> List[dict]:
    acts = db.query(Activity).filter(getattr(Activity, "trip_id", None) == trip_id).all()
    markers = []
    for a in acts:
        lat = getattr(a, "lat", None)
        lon = getattr(a, "lon", None)
        if lat is not None and lon is not None:
            markers.append({"id": getattr(a, "id", None), "lat": lat, "lon": lon, "title": getattr(a, "title", None)})
    return markers
