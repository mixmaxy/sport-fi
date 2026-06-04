import { serverFetch } from "@/shared/config/server-fetch";
import {
  normalizeCities,
  normalizeProvinces,
} from "@/features/location/lib/locations.mapper";
import type { City, Province } from "@/shared/types";

export async function fetchProvinces(): Promise<Province[]> {
  const raw = await serverFetch<Record<string, unknown>[]>("/location/provinces", {
    tags: ["provinces"],
    revalidate: 3600,
  });
  return normalizeProvinces(raw);
}

export async function fetchCities(): Promise<City[]> {
  const raw = await serverFetch<Record<string, unknown>[]>("/location/cities", {
    tags: ["cities"],
    revalidate: 3600,
  });
  return normalizeCities(raw);
}

export async function fetchCitiesByProvinceId(
  provinceId: string,
): Promise<City[]> {
  const raw = await serverFetch<Record<string, unknown>[]>(
    `/location/cities-by-province/${provinceId}`,
    {
      tags: ["cities", `province-${provinceId}`],
      revalidate: 3600,
    },
  );
  return normalizeCities(raw);
}
