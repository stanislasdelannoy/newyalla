from pydantic import BaseModel

class PinnedActivityCreate(BaseModel):
    user_id: int
    activity_id: int

class PinnedActivityRead(PinnedActivityCreate):
    id: int

    class Config:
        orm_mode = True