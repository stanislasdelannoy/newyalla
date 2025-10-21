from pydantic import BaseModel
from typing import Optional

class InviteBase(BaseModel):
    email: Optional[str] = None
    token: Optional[str] = None

class InviteCreate(InviteBase):
    trip_id: int
    sender_id: Optional[int] = None
    recipient_id: Optional[int] = None

class InviteRead(InviteBase):
    id: int
    trip_id: int
    sender_id: Optional[int] = None
    recipient_id: Optional[int] = None

    class Config:
        orm_mode = True