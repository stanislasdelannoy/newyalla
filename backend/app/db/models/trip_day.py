from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.session import Base

class TripDay(Base):
    __tablename__ = "trip_days"

    id = Column(Integer, primary_key=True)
    title = Column(String)
    date = Column(Date)
    trip_id = Column(Integer, ForeignKey("trips.id", ondelete="CASCADE"), index=True, nullable=False)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())

    trip = relationship("Trip", back_populates="trip_days")
    activities = relationship("Activity", back_populates="trip_day", cascade="all, delete-orphan")
