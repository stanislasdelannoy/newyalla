from __future__ import annotations  # 👈 ajoute ça tout en haut du fichier

import datetime
from typing import Optional
from pydantic import BaseModel


class TripDayBase(BaseModel):
    title: Optional[str] = None
    date: Optional[datetime.date] = None  # 👈 bien datetime.date, pas "date"


class TripDayCreate(TripDayBase):
    trip_id: int


class TripDayRead(TripDayBase):
    id: int
    trip_id: int

    class Config:
        orm_mode = True


class TripDayUpdate(BaseModel):
    title: Optional[str] = None
    date: Optional[datetime.date] = None
    trip_id: Optional[int] = None

    class Config:
        orm_mode = True
