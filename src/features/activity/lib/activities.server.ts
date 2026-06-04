import { serverFetch } from "@/shared/config/server-fetch";
import type { SportActivity } from "@/shared/types";

export interface GetActivitiesParams {
  sportCategoryId?: string;
  cityId?: string;
  search?: string;
  page?: number;
  perPage?: number;
  isPaginate?: boolean;
}

export async function fetchActivities(
  params?: GetActivitiesParams,
): Promise<SportActivity[]> {
  return serverFetch<SportActivity[]>("/sport-activities", {
    params: {
      is_paginate: String(params?.isPaginate ?? false),
      per_page: String(params?.perPage ?? 5),
      page: String(params?.page ?? 1),
      search: params?.search,
      sport_category_id: params?.sportCategoryId,
      city_id: params?.cityId,
    },
    tags: ["activities"],
  });
}

export async function fetchActivityById(id: string): Promise<SportActivity> {
  return serverFetch<SportActivity>(`/sport-activities/${id}`, {
    tags: ["activities", `activity-${id}`],
  });
}
