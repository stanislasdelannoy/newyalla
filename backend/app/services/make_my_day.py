from typing import Optional
import logging

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.crud import get_trip  # fonctions CRUD supplémentaires peuvent être appelées

logger = logging.getLogger(__name__)


def assign_best_itinerary(db: Session, trip_id: int, user: Optional[object] = None):
    """
    Placeholder pour calculer/assigner un itinéraire "optimal" pour la journée.
    - Vérifie que le trip existe puis effectue une action minimale.
    - À remplacer par un algorithme réel (ordonnancement, optimisation, distances, etc.).
    """
    trip = get_trip(db, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    logger.info("Assigning best itinerary for trip %s by user %s", trip_id, getattr(user, "id", None))

    # Exemple simple : si tu as des activités, tu pourrais les trier et mettre à jour leur ordre.
    # Ici on ne modifie rien par défaut.
    return True
