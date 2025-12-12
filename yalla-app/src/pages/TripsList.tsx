import { useEffect, useState } from "react";
import { fetchTrips, createTrip } from "../api/trips";
import type { Trip } from "../api/trips"
import { TripCard } from "../components/TripCard";
import { Navbar } from "../components/Navbar";
import { FormField } from "../components/FormField";
import "./style/TripsList.css";

const TripsList = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newCountry, setNewCountry] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);


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
      <Navbar title='Yalla' />
       <header className="trips-hero">
        <div>
          <h1>Mes voyages</h1>
            <p>Retrouve la liste de tes voyages ci-dessous.</p>
            <div className="trips-hero-actions">
              <button className="primary-button" onClick={() => setIsCreateOpen(true)}>
                    + Ajouter un voyage
              </button>
            </div>
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
      {isCreateOpen && (
        <div className="modal-backdrop" onClick={(e) => {if (e.target === e.currentTarget) setIsCreateOpen(false);}}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2>Créer un voyage</h2>

            {createError && <p className="modal-error">{createError}</p>}
            <FormField label="Titre" name="title" value={newTitle} onChange={setNewTitle} required />
            <FormField label="Ville" name="city" value={newCity} onChange={setNewCity} />
            <FormField label="Pays" name="country" value={newCountry} onChange={setNewCountry} />
            <FormField
              label="Description"
              name="description"
              value={newDescription}
              onChange={setNewDescription}
              as="textarea"
            />

            <div className="modal-actions">
              <button type="button" onClick={() => setIsCreateOpen(false)}>
                Annuler
              </button>
              <button
                type="button"
                disabled={creating}
                onClick={async () => {
                  setCreateError(null);
                  setCreating(true);
                  try {
                    const created = await createTrip({
                      title: newTitle,
                      city: newCity || undefined,
                      country: newCountry || undefined,
                      description: newDescription || undefined,
                    });

                    setTrips((prev) => [created, ...prev]); // ou [...prev, created]
                    setIsCreateOpen(false);

                    // reset
                    setNewTitle("");
                    setNewCity("");
                    setNewCountry("");
                    setNewDescription("");
                  } catch (err: any) {
                    setCreateError(err.message || "Erreur lors de la création.");
                  } finally {
                    setCreating(false);
                  }
                }}
              >
                {creating ? "Création..." : "Créer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripsList;
