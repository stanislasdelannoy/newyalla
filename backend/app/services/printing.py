from typing import Optional
import logging

from fastapi import HTTPException, Response
from sqlalchemy.orm import Session

from app.crud import get_trip  # on suppose l'existence de cette fonction

logger = logging.getLogger(__name__)


def render_trip_pdf(db: Session, trip_id: int, user: Optional[object] = None):
    """
    Génère (ou simule) un PDF pour le trip.
    - Si pdfkit + wkhtmltopdf sont installés, tente de générer un vrai PDF.
    - Sinon renvoie un message JSON indiquant que la génération n'est pas configurée.
    """
    trip = get_trip(db, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    # contenu HTML minimal — remplacer par un template Jinja si souhaité
    html = f"""
    <html>
      <head><meta charset="utf-8"><title>Trip {trip_id}</title></head>
      <body>
        <h1>Trip {trip_id}</h1>
        <p>Titre: {getattr(trip, 'title', 'n/a')}</p>
        <p>Description: {getattr(trip, 'description', '')}</p>
      </body>
    </html>
    """

    try:
        import pdfkit
        pdf_bytes = pdfkit.from_string(html, False)
        headers = {"Content-Disposition": f"attachment; filename=trip_{trip_id}.pdf"}
        return Response(content=pdf_bytes, media_type="application/pdf", headers=headers)
    except Exception as exc:
        logger.debug("PDF generation not available: %s", exc)
        # Retour de secours : informer que la génération PDF n'est pas configurée
        return {"detail": "PDF generation not configured (install pdfkit/wkhtmltopdf) or error occurred"}
