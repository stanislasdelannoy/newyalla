import { apiGet } from "./client";

export type Trip = {
  id: number;
  title: string;
  // ajoute d'autres champs si tu veux (description, dates, etc.)
};

export async function fetchTrips(): Promise<Trip[]> {
  return apiGet<Trip[]>("/api/trips");
}

export async function fetchTrip(trip_id: number): Promise<Trip> {
  return apiGet<Trip>(`/api/trips/${trip_id}`);
}
