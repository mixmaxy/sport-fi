import type { City, Province } from "@/shared/types";

type RawRecord = Record<string, unknown>;

export function normalizeProvince(raw: RawRecord): Province {
  return {
    id: String(raw.province_id ?? raw.id ?? ""),
    name: String(raw.province_name ?? raw.name ?? ""),
    createdAt: String(raw.created_at ?? raw.createdAt ?? ""),
    updatedAt: String(raw.updated_at ?? raw.updatedAt ?? ""),
  };
}

export function normalizeCity(raw: RawRecord): City {
  return {
    id: String(raw.city_id ?? raw.id ?? ""),
    provinceId: String(raw.province_id ?? raw.provinceId ?? ""),
    name: String(raw.city_name ?? raw.name ?? raw.city_name_full ?? ""),
    createdAt: String(raw.created_at ?? raw.createdAt ?? ""),
    updatedAt: String(raw.updated_at ?? raw.updatedAt ?? ""),
  };
}

export function normalizeProvinces(raw: RawRecord[]): Province[] {
  return raw.map(normalizeProvince).filter((p) => p.id && p.name);
}

export function normalizeCities(raw: RawRecord[]): City[] {
  return raw.map(normalizeCity).filter((c) => c.id && c.name);
}
