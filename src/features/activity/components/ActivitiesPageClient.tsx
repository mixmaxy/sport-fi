"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  SearchX,
} from "lucide-react";
import { ActivityCard } from "@/features/activity/components/ActivityCard";
import {
  ActivityFilters,
  type ActivityFilterValues,
} from "@/features/activity/components/ActivityFilters";
import { useActivitiesList } from "@/features/activity/hooks/useActivitiesList";
import { normalizeActivitiesPage } from "@/features/activity/lib/activities.client";
import type { GetActivitiesParams } from "@/features/activity/lib/activities.server";
import { PageShell } from "@/shared/components/layout/PageShell";
import { cn } from "@/shared/utils/cn";
import type { Province, SportActivity, SportCategory } from "@/shared/types";

interface ActivitiesPageClientProps {
  initialActivities: SportActivity[];
  categories: SportCategory[];
  provinces: Province[];
  initialFilters?: GetActivitiesParams;
}

const pageSize = 5;

export function ActivitiesPageClient({
  initialActivities,
  categories,
  provinces,
  initialFilters,
}: ActivitiesPageClientProps) {
  const [filters, setFilters] = useState<ActivityFilterValues>({
    search: initialFilters?.search ?? "",
    categoryId: initialFilters?.sportCategoryId ?? "",
    provinceId: initialFilters?.provinceId ?? "",
    cityId: initialFilters?.cityId ?? "",
  });
  const [page, setPage] = useState(1);
  const listSectionRef = useRef<HTMLElement>(null);

  const [apiParams, setApiParams] = useState<GetActivitiesParams>(() => ({
    sportCategoryId: initialFilters?.sportCategoryId,
    cityId: initialFilters?.cityId,
    page: 1,
    perPage: pageSize,
    isPaginate: true,
  }));

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        setApiParams({
          sportCategoryId: filters.categoryId || undefined,
          cityId: filters.cityId || undefined,
          search: filters.search || undefined,
          page,
          perPage: pageSize,
          isPaginate: true,
        });
      },
      filters.search ? 400 : 0,
    );
    return () => clearTimeout(timeout);
  }, [filters.categoryId, filters.cityId, filters.search, page]);

  const {
    data: fetchedActivities,
    isLoading,
    isValidating,
    isError,
  } = useActivitiesList(apiParams, true);

  const pageData = normalizeActivitiesPage(fetchedActivities);
  const hasActiveFilters =
    !!filters.categoryId || !!filters.cityId || !!filters.search;

  const isInitialLoad = isLoading && fetchedActivities == null;
  const isPageFetching = isValidating && !isInitialLoad;

  const activities =
    pageData?.data ??
    (page === 1 && !hasActiveFilters
      ? initialActivities.slice(0, pageSize)
      : []);

  const currentPage = pageData?.current_page ?? page;
  const lastPage = pageData?.last_page ?? 1;

  const filtered = activities;

  const handleFilterChange = useCallback((newFilters: ActivityFilterValues) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
    listSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  return (
    <PageShell>
        <header className="mb-6 flex flex-col justify-between gap-4 md:mb-8 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-on-surface">
              Find Your Arena
            </h1>
            <p className="text-on-surface-variant">
              Explore premium sports facilities near you and book instantly.
            </p>
          </div>
          <div className="relative w-full md:min-w-[280px] md:max-w-sm">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-on-surface-variant"
              aria-hidden
            />
            <input
              type="search"
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              placeholder="Search venues..."
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-2 pr-4 pl-10 text-on-surface outline-none placeholder:text-on-surface-variant focus:border-primary focus:ring-1 focus:ring-primary"
              aria-label="Cari venue"
            />
          </div>
        </header>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-6">
          <section aria-label="Filter aktivitas">
            <ActivityFilters
              categories={categories}
              provinces={provinces}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </section>

          <section
            ref={listSectionRef}
            aria-label="Daftar aktivitas"
            className="min-w-0 flex-1 scroll-mt-24"
          >
            {isInitialLoad ? (
              <div className="flex flex-col items-center justify-center gap-4 py-24">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-on-surface-variant">Memuat aktivitas...</p>
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
                <SearchX className="h-14 w-14 text-outline-variant" />
                <h2 className="text-xl font-semibold text-on-surface">
                  Gagal memuat data
                </h2>
                <p className="max-w-sm text-on-surface-variant">
                  Terjadi kesalahan saat memuat aktivitas. Silakan coba lagi.
                </p>
              </div>
            ) : filtered?.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
                <SearchX className="h-14 w-14 text-outline-variant" />
                <h2 className="text-xl font-semibold text-on-surface">
                  Tidak ada aktivitas
                </h2>
                <p className="max-w-sm text-on-surface-variant">
                  Tidak ada aktivitas yang cocok dengan filter kamu.
                </p>
              </div>
            ) : (
              <div
                className={cn(
                  "relative transition-opacity",
                  isPageFetching && "pointer-events-none opacity-60",
                )}
              >
                {isPageFetching && (
                  <div className="absolute inset-x-0 top-0 z-10 flex justify-center pt-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}
                <p className="mb-6 text-sm text-on-surface-variant">
                  Menampilkan <strong>{filtered.length}</strong> aktivitas
                </p>
                <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
                  {filtered.map((activity, idx) => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      priority={idx < 2}
                    />
                  ))}
                </div>

                <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-between sm:gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    disabled={currentPage <= 1 || isPageFetching}
                    className="inline-flex items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                    Prev
                  </button>
                  <p className="text-sm text-on-surface-variant">
                    Page{" "}
                    <strong className="text-on-surface">{currentPage}</strong>{" "}
                    of <strong className="text-on-surface">{lastPage}</strong>
                  </p>
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= lastPage || isPageFetching}
                    className="inline-flex items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
    </PageShell>
  );
}
