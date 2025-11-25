import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTrips, createTrip } from "../api/trips";
import type { Trip } from "../api/trips";

export default function TripsList() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newCountry, setNewCountry] = useState("");

  useEffect(() => {
    fetchTrips()
      .then((data) => {
        setTrips(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleCreateTrip = async () => {
    if (!newTitle.trim()) return;

    try {
      const trip = await createTrip({
        title: newTitle,
        description: newDescription || undefined,
        city: newCity || undefined,
        country: newCountry || undefined,
      });

      // soit on rajoute à la liste localement :
      setTrips((prev) => [...prev, trip]);

      // soit on re-fetch si tu préfères :
      // const fresh = await fetchTrips();
      // setTrips(fresh);

      setNewTitle("");
      setNewDescription("");
      setNewCity("");
      setNewCountry("");
    } catch (err) {
      console.error("Erreur création trip:", err);
      // tu peux afficher un message d'erreur si tu veux
    }
  };

  if (loading) return <p>Chargement des voyages...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Mes voyages</h1>

      {/* Formulaire de création de trip */}
      <section style={{ marginBottom: "2rem" }}>
        <h2>Créer un nouveau voyage</h2>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 400, gap: "0.5rem" }}>
          <input
            type="text"
            placeholder="Titre du voyage (obligatoire)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Ville"
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
          />
          <input
            type="text"
            placeholder="Pays"
            value={newCountry}
            onChange={(e) => setNewCountry(e.target.value)}
          />
          <textarea
            placeholder="Description (optionnelle)"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <button onClick={handleCreateTrip}>Ajouter le voyage</button>
        </div>
      </section>

      {/* Liste des trips */}
      {trips.length === 0 ? (
        <p>Aucun voyage pour le moment.</p>
      ) : (
        <ul>
          {trips.map((trip) => (
            <li key={trip.id}>
              <Link to={`/trips/${trip.id}`}>{trip.title}</Link>
              {trip.city || trip.country ? (
                <> – <small>{trip.city}{trip.city && trip.country ? ", " : ""}{trip.country}</small></>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
