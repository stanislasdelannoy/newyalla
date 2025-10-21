from pydantic import BaseModel
from typing import Optional

class VoteBase(BaseModel):
    votable_type: str
    votable_id: int
    voter_id: Optional[int] = None
    vote_flag: Optional[bool] = None
    vote_scope: Optional[str] = None

class VoteCreate(VoteBase):
    pass

class VoteRead(VoteBase):
    id: int

    class Config:
        orm_mode = True