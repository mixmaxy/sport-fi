import { clientGet } from "@/shared/config/api";
import {
  normalizeCities,
  normalizeProvinces,
} from "@/features/location/lib/locations.mapper";
import type { City, Province } from "@/shared/types";

export async function getProvinces(): Promise<Province[]> {
  const raw = await clientGet<Record<string, unknown>[]>("/location/provinces");
  return normalizeProvinces(raw);
}

export async function getCities(): Promise<City[]> {
  const raw = await clientGet<Record<string, unknown>[]>("/location/cities");
  return normalizeCities(raw);
}

export async function getCitiesByProvinceId(
  provinceId: string,
): Promise<City[]> {
  const raw = await clientGet<Record<string, unknown>[]>(
    `/location/cities/${provinceId}`,
  );
  return normalizeCities(raw);
}
