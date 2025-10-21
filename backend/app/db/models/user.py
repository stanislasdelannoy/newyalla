from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String, nullable=False, unique=True, default="")
    encrypted_password = Column(String, nullable=False, default="")
    reset_password_token = Column(String, unique=True)
    reset_password_sent_at = Column(DateTime)
    remember_created_at = Column(DateTime)
    sign_in_count = Column(Integer, nullable=False, default=0)
    current_sign_in_at = Column(DateTime)
    last_sign_in_at = Column(DateTime)
    current_sign_in_ip = Column(String)
    last_sign_in_ip = Column(String)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())
    username = Column(String)
    phone = Column(String)
    photo = Column(String)
    hometown = Column(String)
    provider = Column(String)
    uid = Column(String)
    facebook_picture_url = Column(String)
    first_name = Column(String)
    last_name = Column(String)
    token = Column(String)
    token_expiry = Column(DateTime)
    admin = Column(Boolean, nullable=False, default=False)

    trips = relationship("Trip", back_populates="user", cascade="all, delete-orphan")
    participants = relationship("Participant", back_populates="user", cascade="all, delete-orphan")
    activities = relationship("Activity", back_populates="user", cascade="all, delete-orphan")
    pinned_activities = relationship("PinnedActivity", back_populates="user", cascade="all, delete-orphan")
    invites_sent = relationship("Invite", back_populates="sender", foreign_keys="Invite.sender_id")
    invites_received = relationship("Invite", back_populates="recipient", foreign_keys="Invite.recipient_id")
