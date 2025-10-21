from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.session import Base

class MainCategory(Base):
    __tablename__ = "main_categories"

    id = Column(Integer, primary_key=True)
    title = Column(String)
    icon = Column(String)
    color = Column(String)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())

    categories = relationship("Category", back_populates="main_category", cascade="all, delete-orphan")
    activities = relationship("Activity", back_populates="main_category")

class PinnedActivity(Base):
    __tablename__ = "pinned_activities"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    activity_id = Column(Integer, ForeignKey("activities.id", ondelete="CASCADE"), index=True, nullable=False)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="pinned_activities")
    activity = relationship("Activity")