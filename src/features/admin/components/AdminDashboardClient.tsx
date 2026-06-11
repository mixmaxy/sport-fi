"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminAccessDenied } from "@/features/admin/components/AdminAccessDenied";
import { ActivitiesManagement } from "@/features/admin/components/ActivitiesManagement";
import { CategoriesManagement } from "@/features/admin/components/CategoriesManagement";
import { useAdminGuard } from "@/features/admin/hooks/useAdminGuard";
import { Button } from "@/shared/components/ui/Button";
import { PageShell } from "@/shared/components/layout/PageShell";

type AdminTab = "categories" | "activities";

export function AdminDashboardClient() {
  const { user, isAdmin } = useAdminGuard();
  const [activeTab, setActiveTab] = useState<AdminTab>("categories");

  if (!user || !isAdmin) {
    return <AdminAccessDenied />;
  }

  return (
    <PageShell>
      <div className="mb-8 flex flex-col items-start justify-between gap-4 border-b border-outline-variant pb-5 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-on-surface">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Kelola data kategori dan aktivitas olahraga Sport Reserve
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
          <Link href="/admin/transactions" className="w-full md:w-auto">
            <Button variant="outline" size="sm" fullWidth className="md:w-auto">
              Verifikasi Transaksi
            </Button>
          </Link>

          <div className="flex w-full overflow-x-auto rounded-xl border border-outline-variant bg-surface-container-low p-1.5">
            <button
              type="button"
              onClick={() => setActiveTab("categories")}
              className={`shrink-0 rounded-lg px-4 py-2 text-xs font-bold transition-all md:text-sm ${
                activeTab === "categories"
                  ? "bg-surface-container-lowest text-on-surface shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Manajemen Kategori
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("activities")}
              className={`shrink-0 rounded-lg px-4 py-2 text-xs font-bold transition-all md:text-sm ${
                activeTab === "activities"
                  ? "bg-surface-container-lowest text-on-surface shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Manajemen Aktivitas
            </button>
          </div>
        </div>
      </div>

      {activeTab === "categories" ? (
        <CategoriesManagement />
      ) : (
        <ActivitiesManagement />
      )}
    </PageShell>
  );
}
