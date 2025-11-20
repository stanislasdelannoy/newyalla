import { apiGet } from "./client";

export type TripDay = {
  id: number;
  title?: string | null;
  date?: string | null; 
  position?: number | null;
  trip_id?: number;
};

export async function fetchTripDays(tripId: number): Promise<TripDay[]> {
  return apiGet<TripDay[]>(`/api/trips/${tripId}/trip_days`);
}
