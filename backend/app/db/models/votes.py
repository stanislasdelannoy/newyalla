from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.session import Base

class Vote(Base):
    __tablename__ = "votes"

    id = Column(Integer, primary_key=True)
    voter_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), index=True, nullable=True)
    votable_id = Column(Integer, index=True, nullable=False)
    votable_type = Column(String, nullable=False)  # polymorphic target (e.g. "Trip", "Activity")
    vote_flag = Column(Boolean, default=True)
    vote_scope = Column(String, nullable=True)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())

    voter = relationship("User")

