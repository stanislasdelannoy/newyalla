from typing import Optional
import logging

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.crud import get_trip, get_user  # get_user peut ou non exister selon ton CRUD

logger = logging.getLogger(__name__)


def send_trip_email(db: Session, trip_id: int, sender: Optional[object] = None):
    """
    Placeholder pour envoi d'email contenant le trip.
    - Récupère le trip et loggue l'action.
    - À remplacer par un envoi SMTP / queue réel (celery, background task, etc.).
    """
    trip = get_trip(db, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    recipient = getattr(trip, "owner_email", None) or (get_user(db, trip.owner_id).email if hasattr(trip, "owner_id") else None)

    logger.info("Queueing email for trip %s to %s (sender=%s)", trip_id, recipient, getattr(sender, "id", None))
    # Ici : construire le message et le pousser dans une queue / broker ou appeler SMTP.
    # Ex : background task, celery.send_task(...)

    return True
