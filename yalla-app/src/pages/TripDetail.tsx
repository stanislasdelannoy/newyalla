// src/pages/TripDetail.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchTrip } from "../api/trips";
import type { Trip } from "../api/trips";
import { fetchTripDays } from "../api/tripDays";
import type { TripDay } from "../api/tripDays";
import {
  fetchActivitiesForDay,
  createActivityForDay,
} from "../api/tripActivities";
import type { Activity } from "../api/tripActivities";

export default function TripDetail() {
  const { id } = useParams();
  const tripId = Number(id);

  const [trip, setTrip] = useState<Trip | null>(null);
  const [tripDays, setTripDays] = useState<TripDay[]>([]);
  const [loadingTrip, setLoadingTrip] = useState(true);
  const [loadingDays, setLoadingDays] = useState(true);
  const [errorTrip, setErrorTrip] = useState<string | null>(null);
  const [errorDays, setErrorDays] = useState<string | null>(null);

  // activités par jour : { [dayId]: Activity[] }
  const [activitiesByDay, setActivitiesByDay] = useState<
    Record<number, Activity[]>
  >({});

  // états des formulaires d'ajout d'activité par jour
  const [newActivityTitle, setNewActivityTitle] = useState<
    Record<number, string>
  >({});
  const [newActivityDescription, setNewActivityDescription] = useState<
    Record<number, string>
  >({});

  // Charger le trip
  useEffect(() => {
    if (!tripId) return;

    fetchTrip(tripId)
      .then((data) => {
        setTrip(data);
        setLoadingTrip(false);
      })
      .catch((err) => {
        console.error(err);
        setErrorTrip(err.message);
        setLoadingTrip(false);
      });
  }, [tripId]);

  // Charger les TripDays
  useEffect(() => {
    if (!tripId) return;

    fetchTripDays(tripId)
      .then((data) => {
        setTripDays(data);
        setLoadingDays(false);
      })
      .catch((err) => {
        console.error(err);
        setErrorDays(err.message);
        setLoadingDays(false);
      });
  }, [tripId]);

  // Charger les activités pour chaque TripDay dès qu'on a la liste des jours
  useEffect(() => {
    if (tripDays.length === 0) return;

    tripDays.forEach((day) => {
      fetchActivitiesForDay(day.id)
        .then((acts) => {
          setActivitiesByDay((prev) => ({
            ...prev,
            [day.id]: acts,
          }));
        })
        .catch((err) => {
          console.error(
            `Erreur lors du chargement des activités pour le jour ${day.id} :`,
            err,
          );
        });
    });
  }, [tripDays]);

  if (!tripId) {
    return <p>Trip invalide.</p>;
  }

  if (loadingTrip) {
    return <p>Chargement du voyage...</p>;
  }

  if (errorTrip) {
    return <p>Erreur lors du chargement du voyage : {errorTrip}</p>;
  }

  if (!trip) {
    return <p>Voyage introuvable.</p>;
  }

  return (
    <div style={{ padding: "1rem" }}>
      <p>
        <Link to="/">&larr; Retour à la liste des voyages</Link>
      </p>

      <h1>{trip.title}</h1>
      {trip.description && <p>{trip.description}</p>}
      <p>
        {trip.city && trip.country
          ? `${trip.city}, ${trip.country}`
          : trip.city || trip.country}
      </p>

      <section style={{ marginTop: "2rem" }}>
        <h2>Jours du voyage</h2>

        {loadingDays ? (
          <p>Chargement des jours...</p>
        ) : errorDays ? (
          <p>Erreur lors du chargement des jours : {errorDays}</p>
        ) : tripDays.length === 0 ? (
          <p>Aucun jour pour ce voyage pour le moment.</p>
        ) : (
          <ol>
            {tripDays.map((day) => (
              <li key={day.id} style={{ marginBottom: "2rem" }}>
                <div>
                  <strong>{day.title || "Jour sans titre"}</strong>
                  {day.date && (
                    <>
                      {" "}
                      – <em>{day.date}</em>
                    </>
                  )}
                </div>

                {/* Formulaire d'ajout d'activité pour ce jour */}
                <div style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}>
                  <input
                    type="text"
                    placeholder="Nouvelle activité..."
                    value={newActivityTitle[day.id] || ""}
                    onChange={(e) =>
                      setNewActivityTitle({
                        ...newActivityTitle,
                        [day.id]: e.target.value,
                      })
                    }
                    style={{ marginRight: "0.5rem" }}
                  />

                  <input
                    type="text"
                    placeholder="Description (optionnelle)"
                    value={newActivityDescription[day.id] || ""}
                    onChange={(e) =>
                      setNewActivityDescription({
                        ...newActivityDescription,
                        [day.id]: e.target.value,
                      })
                    }
                    style={{ marginRight: "0.5rem" }}
                  />

                  <button
                    onClick={async () => {
                      const title = newActivityTitle[day.id];
                      if (!title) return;

                      try {
                        await createActivityForDay(day.id, {
                          title,
                          description:
                            newActivityDescription[day.id] || null,
                        });

                        // reset du formulaire pour ce jour
                        setNewActivityTitle((prev) => ({
                          ...prev,
                          [day.id]: "",
                        }));
                        setNewActivityDescription((prev) => ({
                          ...prev,
                          [day.id]: "",
                        }));

                        // recharger les activités de ce jour uniquement
                        const updated = await fetchActivitiesForDay(day.id);
                        setActivitiesByDay((prev) => ({
                          ...prev,
                          [day.id]: updated,
                        }));
                      } catch (err) {
                        console.error(
                          "Erreur lors de la création de l'activité :",
                          err,
                        );
                      }
                    }}
                  >
                    Ajouter une activité
                  </button>
                </div>

                {/* Liste des activités pour ce jour */}
                <ul style={{ marginTop: "0.5rem", paddingLeft: "1.2rem" }}>
                  {activitiesByDay[day.id] &&
                  activitiesByDay[day.id].length > 0 ? (
                    activitiesByDay[day.id].map((act) => (
                      <li key={act.id}>
                        <strong>{act.title}</strong>
                        {act.description && (
                          <>
                            {" "}
                            – <em>{act.description}</em>
                          </>
                        )}
                      </li>
                    ))
                  ) : (
                    <li>
                      <em>Aucune activité pour ce jour.</em>
                    </li>
                  )}
                </ul>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
