import { useEffect, useState } from "react";
import { fetchTrips } from "../api/trips";
import type { Trip } from "../api/trips";
import { Link } from "react-router-dom";

export default function TripsList() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips().then((data) => {
      setTrips(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Chargement…</p>;

  return (
    <>
      <h2>Mes voyages</h2>
      <ul>
        {trips.map((trip) => (
          <li key={trip.id}>
            <Link to={`/trips/${trip.id}`}>{trip.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
