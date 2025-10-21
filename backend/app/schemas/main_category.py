from pydantic import BaseModel
from typing import Optional

class MainCategoryBase(BaseModel):
    title: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None

class MainCategoryCreate(MainCategoryBase):
    pass

class MainCategoryRead(MainCategoryBase):
    id: int

    class Config:
        orm_mode = True