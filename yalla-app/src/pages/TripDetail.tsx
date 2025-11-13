import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Trip } from "../api/trips";
import { fetchTrip } from "../api/trips";

export default function TripDetail() {
  const { id } = useParams();
  const tripId = Number(id);

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tripId) return;

    fetchTrip(tripId)
      .then((data) => {
        setTrip(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [tripId]);

  if (loading) return <p>Chargement du voyage...</p>;
  if (error) return <p>Erreur : {error}</p>;

  if (!trip) return <p>Voyage introuvable.</p>;

  return (
    <div>
      <h2>{trip.title}</h2>
      <p>Description : {trip.description}</p>
      <p>Id : {trip.id}</p>

      {/* Plus tard : jours, activités, partage, etc. */}
    </div>
  );
}
