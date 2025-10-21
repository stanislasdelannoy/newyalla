from pydantic import BaseModel
from typing import Optional

class TripDayBase(BaseModel):
    title: Optional[str] = None
    date: Optional[str] = None

class TripDayCreate(TripDayBase):
    trip_id: int

class TripDayRead(TripDayBase):
    id: int
    trip_id: int

    class Config:
        orm_mode = True