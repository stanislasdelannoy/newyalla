from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.session import Base

class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(String)
    category = Column(String)
    city = Column(String)
    country = Column(String)
    lat = Column(Float)
    lon = Column(Float)
    photo = Column(String)
    public = Column(Boolean, default=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())

    # cached votes fields
    cached_votes_total = Column(Integer, default=0)
    cached_votes_score = Column(Integer, default=0)
    cached_votes_up = Column(Integer, default=0)
    cached_votes_down = Column(Integer, default=0)
    cached_weighted_score = Column(Integer, default=0)
    cached_weighted_total = Column(Integer, default=0)
    cached_weighted_average = Column(Float, default=0.0)

    user = relationship("User", back_populates="trips")
    trip_days = relationship("TripDay", back_populates="trip", cascade="all, delete-orphan")
    activities = relationship("Activity", back_populates="trip", cascade="all, delete-orphan")
    participants = relationship("Participant", back_populates="trip", cascade="all, delete-orphan")
