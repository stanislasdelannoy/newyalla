from pydantic import BaseModel
from typing import Optional

class ActivityBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    establishment: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    lon: Optional[float] = None
    lat: Optional[float] = None
    index: Optional[int] = None
    google_place_identifier: Optional[str] = None
    google_category: Optional[str] = None
    url: Optional[str] = None
    photo: Optional[str] = None
    trip_day_id: Optional[int] = None
    main_category_id: Optional[int] = None
    user_id: Optional[int] = None
    parent_id: Optional[int] = None

class ActivityCreate(ActivityBase):
    trip_id: int

class ActivityRead(ActivityBase):
    id: int
    trip_id: int

    class Config:
        orm_mode = True