import { apiGet, apiPost } from "./client";

export type TripDay = {
  id: number;
  title?: string | null;
  date?: string | null;
  position?: number | null;
  trip_id?: number;
};

export async function fetchTripDays(
  tripId: number,
): Promise<TripDay[]> {
  return apiGet<TripDay[]>(`/api/trips/${tripId}/trip_days`);
}

// 🔽 nouveau
export type TripDayCreatePayload = {
  title?: string;
  date?: string; // au format "YYYY-MM-DD"
};

export async function createTripDay(
  tripId: number,
  data: TripDayCreatePayload,
): Promise<TripDay> {
  return apiPost<TripDay, TripDayCreatePayload>(
    `/api/trips/${tripId}/trip_days`,
    data,
  );
}
