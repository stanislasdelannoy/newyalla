from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.session import Base

class Invite(Base):
    __tablename__ = "invites"

    id = Column(Integer, primary_key=True)
    email = Column(String)
    trip_id = Column(Integer, ForeignKey("trips.id", ondelete="CASCADE"), index=True)
    sender_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), index=True, nullable=True)
    recipient_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), index=True, nullable=True)
    token = Column(String)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())

    trip = relationship("Trip")
    sender = relationship("User", back_populates="invites_sent", foreign_keys=[sender_id])
    recipient = relationship("User", back_populates="invites_received", foreign_keys=[recipient_id])