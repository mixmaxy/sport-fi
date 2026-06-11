import type { City, Province, SportActivity, SportCategory } from "@/shared/types";

type RawRecord = Record<string, unknown>;

function parseImageUrls(raw: RawRecord): string[] | undefined {
  const urls = raw.image_urls ?? raw.imageUrls;
  if (Array.isArray(urls)) {
    return urls.map(String).filter(Boolean);
  }
  const single = raw.image_url ?? raw.imageUrl;
  return single ? [String(single)] : undefined;
}

function normalizeCategoryBrief(raw: unknown): SportCategory | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const record = raw as RawRecord;
  const id = String(record.id ?? "");
  const name = String(record.name ?? "");
  if (!id && !name) return undefined;
  return {
    id,
    name,
    imageUrl: String(record.image_url ?? record.imageUrl ?? ""),
    createdAt: String(record.created_at ?? record.createdAt ?? ""),
    updatedAt: String(record.updated_at ?? record.updatedAt ?? ""),
  };
}

function normalizeCityBrief(raw: unknown): City | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const record = raw as RawRecord;
  const id = String(record.id ?? "");
  if (!id) return undefined;
  return {
    id,
    provinceId: String(record.province_id ?? record.provinceId ?? ""),
    name: String(record.name ?? ""),
    createdAt: String(record.created_at ?? record.createdAt ?? ""),
    updatedAt: String(record.updated_at ?? record.updatedAt ?? ""),
  };
}

function normalizeProvinceBrief(raw: unknown): Province | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const record = raw as RawRecord;
  const id = String(record.id ?? "");
  if (!id) return undefined;
  return {
    id,
    name: String(record.name ?? ""),
    createdAt: String(record.created_at ?? record.createdAt ?? ""),
    updatedAt: String(record.updated_at ?? record.updatedAt ?? ""),
  };
}

export function normalizeSportActivity(
  raw: RawRecord | SportActivity | null | undefined,
  fallbackTitle?: string,
): SportActivity | undefined {
  if (!raw && !fallbackTitle) return undefined;

  const base = (raw ?? {}) as RawRecord;
  const id = String(base.id ?? base.sport_activity_id ?? "");
  const title = String(base.title ?? fallbackTitle ?? "");

  if (!id || !title) return undefined;

  const categoryRaw =
    base.sport_category ?? base.category ?? base.sportCategory;
  const cityRaw = base.city;
  const provinceRaw = base.province;

  return {
    id,
    sportCategoryId: String(
      base.sport_category_id ??
        base.sportCategoryId ??
        (categoryRaw ? String((categoryRaw as RawRecord).id ?? "") : ""),
    ),
    title,
    description: String(base.description ?? ""),
    price: Number(base.price ?? 0),
    slot: base.slot != null ? Number(base.slot) : undefined,
    activityDate:
      base.activity_date ?? base.activityDate
        ? String(base.activity_date ?? base.activityDate)
        : undefined,
    startTime:
      base.start_time ?? base.startTime
        ? String(base.start_time ?? base.startTime)
        : undefined,
    endTime:
      base.end_time ?? base.endTime
        ? String(base.end_time ?? base.endTime)
        : undefined,
    mapUrl:
      base.map_url ?? base.mapUrl
        ? String(base.map_url ?? base.mapUrl)
        : undefined,
    priceDiscount:
      base.price_discount != null || base.priceDiscount != null
        ? Number(base.price_discount ?? base.priceDiscount ?? 0)
        : undefined,
    rating: base.rating != null ? Number(base.rating) : undefined,
    totalReviews:
      base.total_reviews != null || base.totalReviews != null
        ? Number(base.total_reviews ?? base.totalReviews ?? 0)
        : undefined,
    facilities:
      base.facilities != null ? String(base.facilities) : undefined,
    address: String(base.address ?? ""),
    provinceId: String(
      base.province_id ??
        base.provinceId ??
        (provinceRaw ? (provinceRaw as RawRecord).id : "") ??
        "",
    ),
    cityId: String(
      base.city_id ??
        base.cityId ??
        (cityRaw ? (cityRaw as RawRecord).id : "") ??
        "",
    ),
    locationMap:
      base.location_map ?? base.locationMap
        ? String(base.location_map ?? base.locationMap)
        : undefined,
    imageUrls: parseImageUrls(base),
    createdAt: String(base.created_at ?? base.createdAt ?? ""),
    updatedAt: String(base.updated_at ?? base.updatedAt ?? ""),
    category: normalizeCategoryBrief(categoryRaw),
    city: normalizeCityBrief(cityRaw),
    province: normalizeProvinceBrief(provinceRaw),
  };
}

export function normalizeSportActivities(raw: unknown): SportActivity[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) =>
      normalizeSportActivity(
        item as RawRecord,
      ),
    )
    .filter((item): item is SportActivity => !!item);
}
