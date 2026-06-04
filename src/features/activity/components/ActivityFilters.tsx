"use client";

import { useCitiesByProvince } from "@/features/location/hooks/useLocations";
import { cn } from "@/shared/utils/cn";
import type { Province, SportCategory } from "@/shared/types";

export interface ActivityFilterValues {
  search: string;
  categoryId: string;
  provinceId: string;
  cityId: string;
}

interface ActivityFiltersProps {
  categories: SportCategory[];
  provinces: Province[];
  filters: ActivityFilterValues;
  onFilterChange: (filters: ActivityFilterValues) => void;
}

export function ActivityFilters({
  categories,
  provinces,
  filters,
  onFilterChange,
}: ActivityFiltersProps) {
  const { data: cities } = useCitiesByProvince(filters.provinceId || null);

  const handleChange = (key: keyof ActivityFilterValues, value: string) => {
    const next = { ...filters, [key]: value };
    if (key === "provinceId") next.cityId = "";
    onFilterChange(next);
  };

  const clearFilters = () => {
    onFilterChange({ search: "", categoryId: "", provinceId: "", cityId: "" });
  };

  const hasActiveFilters =
    filters.categoryId || filters.provinceId || filters.cityId;

  return (
    <aside className="w-full shrink-0 lg:w-72">
      <div className="sticky top-24 rounded-xl border border-outline-variant bg-surface-container-low p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-on-surface">Filters</h2>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-semibold tracking-wide text-primary hover:underline"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="mb-8">
          <label className="mb-3 block text-sm font-semibold tracking-wide text-on-surface">
            Sport Category
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleChange("categoryId", "")}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
                !filters.categoryId
                  ? "bg-primary text-on-primary"
                  : "bg-[#d3e4fe] text-on-surface-variant hover:bg-[#cbdbf5]",
              )}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleChange("categoryId", cat.id)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
                  filters.categoryId === cat.id
                    ? "bg-primary text-on-primary"
                    : "bg-[#d3e4fe] text-on-surface-variant hover:bg-[#cbdbf5]",
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <label
            htmlFor="filter-province"
            className="mb-3 block text-sm font-semibold tracking-wide text-on-surface"
          >
            Provinsi
          </label>
          <select
            id="filter-province"
            value={filters.provinceId}
            onChange={(e) => handleChange("provinceId", e.target.value)}
            className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="">Semua Provinsi</option>
            {provinces.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {filters.provinceId && (
          <div className="mb-2">
            <label
              htmlFor="filter-city"
              className="mb-3 block text-sm font-semibold tracking-wide text-on-surface"
            >
              Kota
            </label>
            <select
              id="filter-city"
              value={filters.cityId}
              onChange={(e) => handleChange("cityId", e.target.value)}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="">Semua Kota</option>
              {cities?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </aside>
  );
}
