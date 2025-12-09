// src/pages/TripDetail.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchTrip } from "../api/trips";
import type { Trip } from "../api/trips";
import { fetchTripDays, createTripDay } from "../api/tripDays";
import type { TripDay } from "../api/tripDays";
import {
  fetchActivitiesForDay,
  createActivityForDay,
} from "../api/tripActivities";
import type { Activity } from "../api/tripActivities";
import { FormField } from "../components/FormField";
import "./style/TripDetail.css";

export default function TripDetail() {
  const { id } = useParams();
  const tripId = Number(id);

  const [trip, setTrip] = useState<Trip | null>(null);
  const [tripDays, setTripDays] = useState<TripDay[]>([]);
  const [loadingTrip, setLoadingTrip] = useState(true);
  const [loadingDays, setLoadingDays] = useState(true);
  const [errorTrip, setErrorTrip] = useState<string | null>(null);
  const [errorDays, setErrorDays] = useState<string | null>(null);

  const [newDayTitle, setNewDayTitle] = useState("");
  const [newDayDate, setNewDayDate] = useState("");

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

  const handleCreateTripDay = async () => {
    if (!tripId) return;

    try {
      await createTripDay(tripId, {
        title: newDayTitle || undefined,
        date: newDayDate || undefined, // "YYYY-MM-DD"
      });

      setNewDayTitle("");
      setNewDayDate("");

      const updatedDays = await fetchTripDays(tripId);
      setTripDays(updatedDays);
    } catch (err) {
      console.error("Erreur lors de la création du jour:", err);
    }
  };

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

  // Charger les activités pour chaque TripDay
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
    return <div className="trip-detail-shell">Trip invalide.</div>;
  }

  if (loadingTrip) {
    return (
      <div className="trip-detail-shell">Chargement du voyage…</div>
    );
  }

  if (errorTrip) {
    return (
      <div className="trip-detail-shell">
        Erreur lors du chargement du voyage : {errorTrip}
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="trip-detail-shell">Voyage introuvable.</div>
    );
  }

  const locationLabel =
    trip.city && trip.country
      ? `${trip.city}, ${trip.country}`
      : trip.city || trip.country || "";

  return (
    <div className="trip-detail-shell">
      <header className="trip-detail-header">
        <div className="trip-detail-header-top">
          <Link to="/trips" className="back-link">
            &larr; Retour aux voyages
          </Link>
        </div>

        <div className="trip-detail-hero">
          <div>
            <h1>{trip.title}</h1>
            {locationLabel && (
              <p className="trip-detail-location">{locationLabel}</p>
            )}
            {trip.description && (
              <p className="trip-detail-description">
                {trip.description}
              </p>
            )}
          </div>
        </div>
      </header>

      <main className="trip-detail-main">
        <section className="trip-days-section">
          <div className="trip-days-header-row">
            <h2>Jours du voyage</h2>
            <div className="trip-days-create-card">
              <h3>Ajouter un jour</h3>
              <div className="trip-days-create-form">
                <FormField
                  label="Titre du jour"
                  name="dayTitle"
                  value={newDayTitle}
                  onChange={setNewDayTitle}
                  placeholder="Jour 1 — Arrivée à Lisbonne"
                />
                <FormField
                  label="Date"
                  name="dayDate"
                  value={newDayDate}
                  onChange={setNewDayDate}
                  type="date"
                  required={false}
                />
                <button
                  type="button"
                  className="primary-button"
                  onClick={handleCreateTripDay}
                >
                  Ajouter un jour
                </button>
              </div>
            </div>
          </div>

          {loadingDays ? (
            <p>Chargement des jours…</p>
          ) : errorDays ? (
            <p>Erreur lors du chargement des jours : {errorDays}</p>
          ) : tripDays.length === 0 ? (
            <p>Aucun jour pour ce voyage pour le moment.</p>
          ) : (
            <ol className="trip-days-list">
              {tripDays.map((day, index) => (
                <li key={day.id}>
                  <article className="trip-day-card">
                    <div className="trip-day-header">
                      <div>
                        <span className="trip-day-index">
                          Jour {index + 1}
                        </span>
                        <h3>
                          {day.title || "Jour sans titre"}
                        </h3>
                        {day.date && (
                          <p className="trip-day-date">
                            {day.date}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="trip-day-body">
                      {/* Formulaire d'ajout d'activité */}
                      <div className="activity-form">
                        <h4>Ajouter une activité</h4>
                        <FormField
                          label="Titre"
                          name={`activityTitle-${day.id}`}
                          value={newActivityTitle[day.id] || ""}
                          onChange={(value) =>
                            setNewActivityTitle((prev) => ({
                              ...prev,
                              [day.id]: value,
                            }))
                          }
                          placeholder="Brunch, visite, plage…"
                          required
                        />
                        <FormField
                          label="Description"
                          name={`activityDescription-${day.id}`}
                          value={newActivityDescription[day.id] || ""}
                          onChange={(value) =>
                            setNewActivityDescription((prev) => ({
                              ...prev,
                              [day.id]: value,
                            }))
                          }
                          placeholder="Notes, adresse, horaires…"
                          as="textarea"
                        />
                        <button
                          type="button"
                          className="secondary-button"
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

                              // recharger les activités de ce jour
                              const updated =
                                await fetchActivitiesForDay(day.id);
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
                          Ajouter l’activité
                        </button>
                      </div>

                      {/* Liste des activités */}
                      <div className="activity-list">
                        <h4>Activités</h4>
                        {activitiesByDay[day.id] &&
                        activitiesByDay[day.id].length > 0 ? (
                          <ul>
                            {activitiesByDay[day.id].map((act) => (
                              <li key={act.id}>
                                <strong>{act.title}</strong>
                                {act.description && (
                                  <span className="activity-description">
                                    {" "}
                                    – {act.description}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="activity-empty">
                            Aucune activité pour ce jour.
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ol>
          )}
        </section>
      </main>
    </div>
  );
}
