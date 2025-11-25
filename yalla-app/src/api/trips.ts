import { apiGet, apiPost } from "./client";

export type Trip = {
  id: number;
  title: string;
  description?: string | null;
  category?: string | null;
  city?: string | null;
  country?: string | null;
  lat?: number | null;
  lon?: number | null;
  photo?: string | null;
  public?: boolean;
  user_id?: number;

};

export async function fetchTrips(): Promise<Trip[]> {
  return apiGet<Trip[]>("/api/trips");
}

export async function fetchTrip(trip_id: number): Promise<Trip> {
  return apiGet<Trip>(`/api/trips/${trip_id}`);
}

export type TripCreatePayload = {
  title: string;
  description?: string;
  city?: string;
  country?: string;
};

export async function createTrip(
  data: TripCreatePayload,
): Promise<Trip> {
  return apiPost<Trip, TripCreatePayload>("/api/trips", data);
}
