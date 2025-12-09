import { useEffect, useState } from "react";
import { fetchTrips } from "../api/trips";
import type { Trip } from "../api/trips"
import { TripCard } from "../components/TripCard";
import "./style/TripsList.css";

const TripsList = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchTrips();
        setTrips(data);
      } catch (err: any) {
        console.error(err);
        setError("Impossible de charger les voyages.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <div className="page-shell">Chargement des voyages…</div>;
  }

  if (error) {
    return <div className="page-shell error">{error}</div>;
  }

  return (
    <div className="page-shell">
      <header className="trips-hero">
        <div>
          <h1>Découvre tes prochains voyages</h1>
          <p>Inspovide an export namedire-toi, organise, et partage tes trips comme sur Yala.</p>
        </div>
        {/* plus tard : barre de recherche / filtres ici */}
      </header>

      <section className="trips-grid-section">
        {trips.length === 0 ? (
          <p>Aucun voyage pour le moment. Crée ton premier trip !</p>
        ) : (
          <div className="trips-grid">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default TripsList;
