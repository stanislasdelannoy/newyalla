// src/pages/TripDetail.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchTrip } from "../api/trips";
import type { Trip } from "../api/trips";
import { fetchTripDays } from "../api/tripDays";
import type { TripDay } from "../api/tripDays";

export default function TripDetail() {
  const { id } = useParams();
  const tripId = Number(id);

  const [trip, setTrip] = useState<Trip | null>(null);
  const [tripDays, setTripDays] = useState<TripDay[]>([]);
  const [loadingTrip, setLoadingTrip] = useState(true);
  const [loadingDays, setLoadingDays] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chargement du trip
  useEffect(() => {
    if (!tripId) {
      setError("Identifiant de voyage invalide");
      setLoadingTrip(false);
      setLoadingDays(false);
      return;
    }

    fetchTrip(tripId)
      .then((data) => {
        setTrip(data);
        setLoadingTrip(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoadingTrip(false);
      });
  }, [tripId]);

  // Chargement des TripDays
  useEffect(() => {
    if (!tripId) return;

    fetchTripDays(tripId)
      .then((days) => {
        setTripDays(days);
        setLoadingDays(false);
      })
      .catch((err) => {
        console.error(err);
        // on ne bloque pas tout l'écran si les jours ne chargent pas
        setLoadingDays(false);
      });
  }, [tripId]);

  if (loadingTrip) return <p>Chargement du voyage...</p>;
  if (error) return <p>Erreur : {error}</p>;
  if (!trip) return <p>Voyage introuvable.</p>;

  return (
    <div style={{ paddingTop: "1rem" }}>
      <Link to="">&larr; Retour à mes voyages</Link>
      <h2>{trip.title}</h2>

      {trip.description && <p>{trip.description}</p>}

      <ul>
        {trip.city && trip.country && (
          <li>
            <strong>Destination :</strong> {trip.city}, {trip.country}
          </li>
        )}
        {trip.category && (
          <li>
            <strong>Catégorie :</strong> {trip.category}
          </li>
        )}
        {trip.public !== undefined && (
          <li>
            <strong>Visibilité :</strong> {trip.public ? "Public" : "Privé"}
          </li>
        )}
      </ul>

      <hr style={{ margin: "1.5rem 0" }} />

      <section>
        <h3>Jours du voyage</h3>
        {loadingDays && <p>Chargement des jours...</p>}
        {!loadingDays && tripDays.length === 0 && (
          <p>Aucun jour n’a encore été défini pour ce voyage.</p>
        )}
        {!loadingDays && tripDays.length > 0 && (
          <ol>
            {tripDays.map((day) => (
              <li key={day.id}>
                <strong>{day.title || "Jour sans titre"}</strong>
                {day.date && (
                  <>
                    {" "}
                    – <em>{day.date}</em>
                  </>
                )}
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
