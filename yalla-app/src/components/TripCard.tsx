import { Link } from "react-router-dom";
import type { Trip } from "../api/trips";
import "./style/TripCard.css";

type TripCardProps = {
  trip: Trip;
};

export function TripCard({ trip }: TripCardProps) {
  const locationLabel = [trip.city, trip.country].filter(Boolean).join(", ");

  return (
    <Link to={`/trips/${trip.id}`} className="trip-card">
      <div className="trip-card-image-wrapper">
        {trip.photo ? (
          <img
            src={trip.photo}
            alt={trip.title}
            className="trip-card-image"
          />
        ) : (
          <div className="trip-card-image placeholder">
            <span>{trip.city || trip.title}</span>
          </div>
        )}
      </div>

      <div className="trip-card-body">
        <div className="trip-card-header-row">
          <h3 className="trip-card-title">{trip.title}</h3>
          {trip.category && (
            <span className="trip-card-pill">{trip.category}</span>
          )}
        </div>

        {locationLabel && (
          <p className="trip-card-location">{locationLabel}</p>
        )}

        {trip.description && (
          <p className="trip-card-description">
            {trip.description.length > 80
              ? trip.description.slice(0, 80) + "…"
              : trip.description}
          </p>
        )}
      </div>
    </Link>
  );
}
