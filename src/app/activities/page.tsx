'use client';

import React, { useCallback, useState } from 'react';
import { useActivities } from '@/features/activity/services/activityApi';
import { ActivityCard } from '@/features/activity/components/ActivityCard';
import { ActivityFilters } from '@/features/activity/components/ActivityFilters';
import { Loader2, SearchX } from 'lucide-react';

/**
 * Activities Listing Page
 * 
 * Why client component:
 * - Filter state requires interactivity
 * - TanStack Query hooks need client context
 * 
 * SEO:
 * - Descriptive page title in layout
 * - Meaningful heading hierarchy
 * - Content visible without JavaScript (SSR hydration)
 */

interface Filters {
  search: string;
  categoryId: string;
  province: string;
  city: string;
}

export default function ActivitiesPage() {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    categoryId: '',
    province: '',
    city: '',
  });

  // TanStack Query fetches with filter params, caches per unique filter set
  const { data: activities, isLoading, isError } = useActivities({
    categoryId: filters.categoryId || undefined,
    province: filters.province || undefined,
    city: filters.city || undefined,
  });

  // Client-side search filter applied on top of API results
  const filtered = activities?.filter(a =>
    filters.search
      ? a.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      a.description?.toLowerCase().includes(filters.search.toLowerCase())
      : true
  );

  const handleFilterChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Aktivitas Olahraga
          </h1>
          <p className="text-gray-600">
            {filtered ? (
              <>Menampilkan <strong>{filtered.length}</strong> aktivitas</>
            ) : (
              'Temukan aktivitas olahraga favoritmu'
            )}
          </p>
        </header>

        {/* Filters */}
        <section aria-label="Filter aktivitas" className="mb-8">
          <ActivityFilters onFilterChange={handleFilterChange} />
        </section>

        {/* Results */}
        <section aria-label="Daftar aktivitas">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
              <p className="text-gray-500">Memuat aktivitas...</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
              <SearchX className="w-14 h-14 text-gray-300" />
              <h2 className="text-xl font-semibold text-gray-700">Gagal memuat data</h2>
              <p className="text-gray-500 max-w-sm">
                Terjadi kesalahan saat memuat aktivitas. Silakan coba lagi.
              </p>
            </div>
          ) : filtered?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
              <SearchX className="w-14 h-14 text-gray-300" />
              <h2 className="text-xl font-semibold text-gray-700">Tidak ada aktivitas</h2>
              <p className="text-gray-500 max-w-sm">
                Tidak ada aktivitas yang cocok dengan filter kamu. Coba ubah filter atau cari dengan kata kunci berbeda.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered?.map((activity, idx) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  priority={idx < 4} // Prioritize loading first 4 images (LCP)
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}