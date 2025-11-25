// src/api/tripActivities.ts
import { apiGet, apiPost } from "./client";

export type Activity = {
  id: number;
  title: string | null;
  description?: string | null;
  city?: string | null;
  address?: string | null;
  lon?: number | null;
  lat?: number | null;
  index?: number | null;
  trip_day_id?: number | null;
  trip_id?: number;
};

export async function fetchActivitiesForDay(
  dayId: number,
): Promise<Activity[]> {
  return apiGet<Activity[]>(`/api/trip_days/${dayId}/activities`);
}

export async function createActivityForDay(
  dayId: number,
  data: {
    title: string;
    description?: string | null;
  },
): Promise<Activity> {
  return apiPost<Activity, typeof data>(
    `/api/trip_days/${dayId}/activities`,
    data,
  );
}
