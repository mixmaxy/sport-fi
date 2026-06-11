"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutGrid, MapPin, Search } from "lucide-react";
import { useCitiesByProvince } from "@/features/location/hooks/useLocations";
import { Button } from "@/shared/components/ui/Button";
import { cn } from "@/shared/utils/cn";
import type { Province, SportCategory } from "@/shared/types";

interface HeroSearchBarProps {
  categories: SportCategory[];
  provinces: Province[];
}

function FieldShell({
  icon,
  label,
  htmlFor,
  children,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "min-w-0 flex-1 rounded-xl border border-outline-variant/80 bg-surface-container-lowest p-4",
        className,
      )}
    >
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-left text-sm font-semibold text-on-surface"
      >
        {label}
      </label>
      <div className="flex items-center gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant"
          aria-hidden
        >
          {icon}
        </span>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

const selectClassName =
  "w-full min-w-0 appearance-none border-0 bg-transparent py-1 text-base font-medium text-on-surface outline-none focus:ring-0 disabled:cursor-not-allowed disabled:text-on-surface-variant/60 md:text-sm";

export function HeroSearchBar({ categories, provinces }: HeroSearchBarProps) {
  const router = useRouter();
  const [provinceId, setProvinceId] = useState("");
  const [cityId, setCityId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const { data: cities, isLoading: citiesLoading } = useCitiesByProvince(
    provinceId || null,
  );

  const handleProvinceChange = (value: string) => {
    setProvinceId(value);
    setCityId("");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (categoryId) params.set("category", categoryId);
    if (provinceId) params.set("province", provinceId);
    if (cityId) params.set("cityId", cityId);

    const query = params.toString();
    router.push(query ? `/activities?${query}` : "/activities");
  };

  return (
    <form
      onSubmit={handleSearch}
      className="mx-auto w-full max-w-5xl rounded-2xl bg-white p-4 shadow-2xl md:bg-white/95 md:backdrop-blur-md"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-stretch">
        <FieldShell
          icon={<MapPin className="h-5 w-5" />}
          label="Provinsi"
          htmlFor="hero-province"
        >
          <select
            id="hero-province"
            value={provinceId}
            onChange={(e) => handleProvinceChange(e.target.value)}
            className={selectClassName}
          >
            <option value="">Semua provinsi</option>
            {provinces.map((province) => (
              <option key={province.id} value={province.id}>
                {province.name}
              </option>
            ))}
          </select>
        </FieldShell>

        <FieldShell
          icon={<MapPin className="h-5 w-5" />}
          label="Kota"
          htmlFor="hero-city"
        >
          <select
            id="hero-city"
            value={cityId}
            onChange={(e) => setCityId(e.target.value)}
            disabled={!provinceId || citiesLoading}
            className={selectClassName}
          >
            <option value="">
              {!provinceId
                ? "Pilih provinsi dulu"
                : citiesLoading
                  ? "Memuat kota…"
                  : "Semua kota"}
            </option>
            {cities?.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </FieldShell>

        <FieldShell
          icon={<LayoutGrid className="h-5 w-5" />}
          label="Kategori"
          htmlFor="hero-category"
        >
          <select
            id="hero-category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={selectClassName}
          >
            <option value="">Semua olahraga</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </FieldShell>

        <div className="flex md:min-w-[152px] md:max-w-[180px] md:flex-col md:justify-end">
          <Button
            type="submit"
            size="lg"
            className="h-12 w-full gap-2 rounded-xl text-base font-bold tracking-wide md:h-full md:min-h-12"
            leftIcon={<Search className="h-5 w-5" />}
          >
            Cari Venue
          </Button>
        </div>
      </div>
    </form>
  );
}
