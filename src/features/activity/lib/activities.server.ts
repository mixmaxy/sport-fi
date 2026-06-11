import { serverFetch } from "@/shared/config/server-fetch";
import {
  normalizeSportActivities,
  normalizeSportActivity,
} from "@/features/activity/lib/activities.mapper";
import type { SportActivity } from "@/shared/types";

export interface GetActivitiesParams {
  sportCategoryId?: string;
  provinceId?: string;
  cityId?: string;
  search?: string;
  page?: number;
  perPage?: number;
  isPaginate?: boolean;
}

export async function fetchActivities(
  params?: GetActivitiesParams,
): Promise<SportActivity[]> {
  const raw = await serverFetch<Record<string, unknown>[]>(
    "/sport-activities",
    {
      params: {
        is_paginate: String(params?.isPaginate ?? false),
        per_page: String(params?.perPage ?? 5),
        page: String(params?.page ?? 1),
        search: params?.search,
        sport_category_id: params?.sportCategoryId,
        city_id: params?.cityId,
      },
      tags: ["activities"],
    },
  );
  return normalizeSportActivities(raw);
}

export async function fetchActivityById(id: string): Promise<SportActivity> {
  const raw = await serverFetch<Record<string, unknown>>(
    `/sport-activities/${id}`,
    {
      tags: ["activities", `activity-${id}`],
    },
  );
  const activity = normalizeSportActivity(raw);
  if (!activity) {
    throw new Error("Aktivitas tidak ditemukan.");
  }
  return activity;
}
