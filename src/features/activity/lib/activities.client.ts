import { api, clientDelete, clientGet, clientPost } from "@/shared/config/api";
import { unwrapPaginatedResult } from "@/shared/config/api-envelope";
import type {
  CreateActivityRequest,
  PaginatedResponse,
  SportActivity,
  UpdateActivityRequest,
} from "@/shared/types";
import type { GetActivitiesParams } from "./activities.server";

/** API unwrap may return a bare array or a paginated object. */
export function normalizeActivitiesPage(
  raw: PaginatedResponse<SportActivity> | SportActivity[] | undefined,
): PaginatedResponse<SportActivity> | undefined {
  if (raw == null) return undefined;
  if (Array.isArray(raw)) {
    return {
      data: raw,
      current_page: 1,
      last_page: 1,
      per_page: raw.length,
      total: raw.length,
    };
  }
  return raw;
}

export async function getActivitiesPage(
  params?: GetActivitiesParams,
): Promise<PaginatedResponse<SportActivity>> {
  const query = {
    is_paginate: params?.isPaginate ?? true,
    per_page: params?.perPage ?? 5,
    page: params?.page ?? 1,
    search: params?.search,
    sport_category_id: params?.sportCategoryId,
    city_id: params?.cityId,
  };
  const { data: body } = await api.get("/sport-activities", { params: query });
  return unwrapPaginatedResult<SportActivity>(body);
}

export async function getActivityById(id: string): Promise<SportActivity> {
  return clientGet<SportActivity>(`/sport-activities/${id}`);
}

export async function createActivity(
  activityData: CreateActivityRequest,
): Promise<SportActivity> {
  const payload = {
    sport_category_id: activityData.sportCategoryId,
    city_id: activityData.cityId,
    title: activityData.title,
    description: activityData.description,
    slot: activityData.slot,
    price: activityData.price,
    address: activityData.address,
    activity_date: activityData.activityDate,
    start_time: activityData.startTime,
    end_time: activityData.endTime,
    map_url: activityData.mapUrl ?? activityData.locationMap,
  };
  return clientPost<SportActivity>("/sport-activities/create", payload);
}

export async function updateActivity(
  payload: UpdateActivityRequest & { id: string },
): Promise<SportActivity> {
  const { id, ...activityData } = payload;
  const body = {
    sport_category_id: activityData.sportCategoryId,
    city_id: activityData.cityId,
    title: activityData.title,
    description: activityData.description,
    slot: activityData.slot,
    price: activityData.price,
    address: activityData.address,
    activity_date: activityData.activityDate,
    start_time: activityData.startTime,
    end_time: activityData.endTime,
    map_url: activityData.mapUrl ?? activityData.locationMap,
  };
  return clientPost<SportActivity>(`/sport-activities/update/${id}`, body);
}

export async function deleteActivity(id: string): Promise<void> {
  await clientDelete(`/sport-activities/delete/${id}`);
}
