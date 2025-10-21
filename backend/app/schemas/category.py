from pydantic import BaseModel
from typing import Optional

class CategoryBase(BaseModel):
    title: Optional[str] = None
    google_title: Optional[str] = None

class CategoryCreate(CategoryBase):
    main_category_id: Optional[int] = None

class CategoryRead(CategoryBase):
    id: int
    main_category_id: Optional[int] = None

    class Config:
        orm_mode = True