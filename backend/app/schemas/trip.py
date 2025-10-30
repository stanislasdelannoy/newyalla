from pydantic import BaseModel
from typing import Optional

class TripBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    lat: Optional[float] = None
    lon: Optional[float] = None
    photo: Optional[str] = None
    public: Optional[bool] = True

class TripCreate(TripBase):
    user_id: int

class TripRead(TripBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True

class TripUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    lat: Optional[float] = None
    lon: Optional[float] = None
    photo: Optional[str] = None
    public: Optional[bool] = None
    user_id: Optional[int] = None

    class Config:
        orm_mode = True
