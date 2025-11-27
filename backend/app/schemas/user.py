from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    encrypted_password: str
    sign_in_count: int = 0
    admin: bool = False

    reset_password_token: Optional[str] = None
    reset_password_sent_at: Optional[str] = None
    remember_created_at: Optional[str] = None
    current_sign_in_at: Optional[str] = None
    last_sign_in_at: Optional[str] = None
    current_sign_in_ip: Optional[str] = None
    last_sign_in_ip: Optional[str] = None
    username: Optional[str] = None
    phone: Optional[str] = None
    photo: Optional[str] = None
    hometown: Optional[str] = None
    provider: Optional[str] = None
    uid: Optional[str] = None
    facebook_picture_url: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    token: Optional[str] = None
    token_expiry: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserRead(UserBase):
    id: int

    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: Optional[int] = None
