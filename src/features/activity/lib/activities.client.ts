import { api, clientDelete, clientGet, clientPost } from "@/shared/config/api";
import { unwrapPaginatedResult } from "@/shared/config/api-envelope";
import {
  normalizeSportActivity,
  normalizeSportActivities,
} from "@/features/activity/lib/activities.mapper";
import type {
  CreateActivityRequest,
  PaginatedResponse,
  SportActivity,
  UpdateActivityRequest,
} from "@/shared/types";
import type { GetActivitiesParams } from "./activities.server";

function toActivityApiPayload(activityData: CreateActivityRequest) {
  const payload: Record<string, unknown> = {
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

  if (activityData.provinceId) {
    payload.province_id = activityData.provinceId;
  }

  if (activityData.priceDiscount != null) {
    payload.price_discount = activityData.priceDiscount;
  }

  if (activityData.facilities) {
    payload.facilities = activityData.facilities;
  }

  if (activityData.imageUrls?.length) {
    payload.image_urls = activityData.imageUrls;
  }

  if (activityData.locationMap) {
    payload.location_map = activityData.locationMap;
  }

  return payload;
}

/** API unwrap may return a bare array or a paginated object. */
export function normalizeActivitiesPage(
  raw: PaginatedResponse<SportActivity> | SportActivity[] | undefined,
): PaginatedResponse<SportActivity> | undefined {
  if (raw == null) return undefined;
  if (Array.isArray(raw)) {
    const data = normalizeSportActivities(raw);
    return {
      data,
      current_page: 1,
      last_page: 1,
      per_page: data.length,
      total: data.length,
    };
  }
  return {
    ...raw,
    data: normalizeSportActivities(raw.data),
  };
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
  const page = unwrapPaginatedResult<Record<string, unknown>>(body);
  const data = normalizeSportActivities(page.data);
  return {
    ...page,
    data,
  };
}

export async function getActivityById(id: string): Promise<SportActivity> {
  const raw = await clientGet<Record<string, unknown>>(`/sport-activities/${id}`);
  const activity = normalizeSportActivity(raw);
  if (!activity) {
    throw new Error("Aktivitas tidak ditemukan.");
  }
  return activity;
}

export async function createActivity(
  activityData: CreateActivityRequest,
): Promise<SportActivity> {
  return clientPost<SportActivity>(
    "/sport-activities/create",
    toActivityApiPayload(activityData),
  );
}

export async function updateActivity(
  payload: UpdateActivityRequest & { id: string },
): Promise<SportActivity> {
  const { id, ...activityData } = payload;
  return clientPost<SportActivity>(
    `/sport-activities/update/${id}`,
    toActivityApiPayload(activityData),
  );
}

export async function deleteActivity(id: string): Promise<void> {
  await clientDelete(`/sport-activities/delete/${id}`);
}
