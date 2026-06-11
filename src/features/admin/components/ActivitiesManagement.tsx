"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Zap } from "lucide-react";
import { useActivitiesList } from "@/features/activity/hooks/useActivitiesList";
import { useDeleteActivity } from "@/features/activity/hooks/useActivityMutations";
import { AdminActivityFormModal } from "@/features/admin/components/AdminActivityFormModal";
import { AdminListPagination } from "@/features/admin/components/AdminListPagination";
import { admin_page_size } from "@/features/admin/constants";
import { Button } from "@/shared/components/ui/Button";
import { formatCurrency, getActivityFinalPrice } from "@/shared/utils/helper";
import {
  getActivityImageUrl,
  skipImageOptimization,
} from "@/shared/utils/images";
import { toast } from "sonner";
import type { SportActivity } from "@/shared/types";

type ActivityModalState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; activity: SportActivity };

export function ActivitiesManagement() {
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<ActivityModalState>({ mode: "closed" });

  const {
    data: activitiesPage,
    isLoading,
    refetch: refetchActivities,
  } = useActivitiesList(
    { page, perPage: admin_page_size, isPaginate: true },
    true,
  );
  const { mutate: deleteActivity } = useDeleteActivity();

  const handleDelete = (id: string) => {
    if (
      !window.confirm(
        "Apakah Anda yakin ingin menghapus aktivitas olahraga ini?",
      )
    ) {
      return;
    }

    deleteActivity(id, {
      onSuccess: () => {
        refetchActivities();
        toast.success("Aktivitas berhasil dihapus.");
      },
      onError: () => toast.error("Gagal menghapus aktivitas."),
    });
  };

  if (isLoading && !activitiesPage) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  const activities = activitiesPage?.data ?? [];
  const currentPage = activitiesPage?.current_page ?? page;
  const lastPage = Math.max(activitiesPage?.last_page ?? 1, 1);
  const total = activitiesPage?.total ?? activities.length;
  const isFetching = isLoading && !!activitiesPage;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          onClick={() => setModal({ mode: "create" })}
          className="gap-2 font-bold"
        >
          <Plus className="h-5 w-5" />
          Tambah Aktivitas
        </Button>
      </div>

      {activities.length === 0 ? (
        <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-16 text-center shadow-sm">
          <Zap className="mx-auto mb-4 h-12 w-12 text-outline-variant" />
          <h3 className="text-lg font-bold text-on-surface">Aktivitas Kosong</h3>
          <p className="text-sm text-on-surface-variant">
            Silakan buat aktivitas olahraga pertama Anda.
          </p>
        </div>
      ) : (
        <div
          className={isFetching ? "opacity-60 transition-opacity" : undefined}
        >
          <div className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container-low text-xs font-bold tracking-wider text-on-surface-variant uppercase">
                    <th className="px-6 py-4">Aktivitas</th>
                    <th className="px-6 py-4">Kategori</th>
                    <th className="px-6 py-4">Harga</th>
                    <th className="px-6 py-4">Lokasi</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant text-sm">
                  {activities.map((act) => (
                    <tr key={act.id} className="hover:bg-surface-container-low/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                        <div className="relative h-8 w-12 shrink-0 overflow-hidden rounded bg-surface-container-low">
                          <Image
                            src={getActivityImageUrl(
                              act.imageUrls,
                              0,
                              act.id,
                            )}
                            alt={act.title}
                            fill
                            className="object-cover"
                            unoptimized={skipImageOptimization(
                              getActivityImageUrl(act.imageUrls, 0, act.id),
                            )}
                          />
                        </div>
                        <span className="max-w-[200px] truncate font-semibold text-on-surface">
                          {act.title}
                        </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant">
                        {act.category?.name || "-"}
                      </td>
                      <td className="px-6 py-4 font-semibold text-primary">
                        {formatCurrency(
                          getActivityFinalPrice(act.price, act.priceDiscount),
                        )}
                      </td>
                      <td className="max-w-[150px] truncate px-6 py-4 text-on-surface-variant">
                        {act.city?.name ?? act.cityId}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setModal({ mode: "edit", activity: act })
                            }
                            className="rounded-lg p-2 text-on-surface-variant transition-all hover:bg-primary-container/20 hover:text-primary"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(act.id)}
                            className="rounded-lg p-2 text-on-surface-variant transition-all hover:bg-red-50 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <AdminListPagination
            currentPage={currentPage}
            lastPage={lastPage}
            total={total}
            isLoading={isFetching}
            onPageChange={setPage}
          />
        </div>
      )}

      {modal.mode === "create" ? (
        <AdminActivityFormModal
          onClose={() => setModal({ mode: "closed" })}
          onSaved={refetchActivities}
        />
      ) : null}

      {modal.mode === "edit" ? (
        <AdminActivityFormModal
          activity={modal.activity}
          onClose={() => setModal({ mode: "closed" })}
          onSaved={refetchActivities}
        />
      ) : null}
    </div>
  );
}
