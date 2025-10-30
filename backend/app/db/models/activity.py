from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.session import Base

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True)
    title = Column(String)
    description = Column(String)
    establishment = Column(String)
    city = Column(String)
    address = Column(String)
    lon = Column(Float)
    lat = Column(Float)
    index = Column(Integer)
    trip_id = Column(Integer, ForeignKey("trips.id", ondelete="CASCADE"), index=True)
    trip_day_id = Column(Integer, ForeignKey("trip_days.id", ondelete="SET NULL"), index=True, nullable=True)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())
    main_category_id = Column(Integer, ForeignKey("main_categories.id"), index=True, nullable=True)
    google_place_identifier = Column(String)
    google_category = Column(String)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), index=True, nullable=True)
    url = Column(String)
    photo = Column(String)
    parent_id = Column(Integer, ForeignKey("activities.id", ondelete="SET NULL"), index=True, nullable=True)

    trip = relationship("Trip", back_populates="activities")
    trip_day = relationship("TripDay", back_populates="activities")
    user = relationship("User", back_populates="activities")
    main_category = relationship("MainCategory", back_populates="activities")
    children = relationship("Activity", backref="parent", remote_side=[id], cascade="all, delete-orphan", single_parent=True)
