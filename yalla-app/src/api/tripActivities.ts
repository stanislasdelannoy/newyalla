import { apiGet } from "./client";

export type Activity = {
  id: number;
  title: string | null;
  description?: string | null;
  city?: string | null;
  address?: string | null;
  lat?: number | null;
  lon?: number | null;
  index?: number | null;
  trip_day_id?: number | null;
};

export async function fetchActivitiesForDay(dayId: number): Promise<Activity[]> {
  return apiGet<Activity[]>(`/api/trip_days/${dayId}/activities`);
}
