from pydantic import BaseModel
from typing import Optional

class ParticipantBase(BaseModel):
    role: Optional[str] = None

class ParticipantCreate(ParticipantBase):
    user_id: int
    trip_id: int

class ParticipantRead(ParticipantBase):
    id: int
    user_id: int
    trip_id: int

    class Config:
        orm_mode = True