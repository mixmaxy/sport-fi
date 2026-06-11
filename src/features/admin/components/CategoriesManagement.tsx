"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, FolderOpen } from "lucide-react";
import { useCategoriesPage } from "@/features/category/hooks/useCategoriesList";
import { useDeleteCategory } from "@/features/category/hooks/useCategoryMutations";
import { CategoryFormModal } from "@/features/category/components/CategoryFormModal";
import { AdminListPagination } from "@/features/admin/components/AdminListPagination";
import { admin_page_size } from "@/features/admin/constants";
import { Button } from "@/shared/components/ui/Button";
import { Card } from "@/shared/components/ui/Card";
import {
  getCategoryImageUrl,
  skipImageOptimization,
} from "@/shared/utils/images";
import { toast } from "sonner";
import type { SportCategory } from "@/shared/types";

type CategoryModalState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; category: SportCategory };

export function CategoriesManagement() {
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<CategoryModalState>({ mode: "closed" });

  const {
    data: categoriesPage,
    isLoading,
    refetch: refetchCategories,
  } = useCategoriesPage(
    { page, perPage: admin_page_size, isPaginate: true },
    true,
  );
  const { mutate: deleteCategory } = useDeleteCategory();

  const handleDelete = (id: string) => {
    if (
      !window.confirm(
        "Apakah Anda yakin ingin menghapus kategori ini? Semua aktivitas di kategori ini mungkin akan terpengaruh.",
      )
    ) {
      return;
    }

    deleteCategory(id, {
      onSuccess: () => {
        refetchCategories();
        toast.success("Kategori berhasil dihapus.");
      },
      onError: () => toast.error("Gagal menghapus kategori."),
    });
  };

  if (isLoading && !categoriesPage) {
    return (
      <div className="grid grid-cols-2 gap-6 animate-pulse md:grid-cols-3 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton h-44 rounded-2xl" />
        ))}
      </div>
    );
  }

  const categories = categoriesPage?.data ?? [];
  const currentPage = categoriesPage?.current_page ?? page;
  const lastPage = Math.max(categoriesPage?.last_page ?? 1, 1);
  const total = categoriesPage?.total ?? categories.length;
  const isFetching = isLoading && !!categoriesPage;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          onClick={() => setModal({ mode: "create" })}
          className="gap-2 font-bold"
        >
          <Plus className="h-5 w-5" />
          Tambah Kategori
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-16 text-center shadow-sm">
          <FolderOpen className="mx-auto mb-4 h-12 w-12 text-outline-variant" />
          <h3 className="text-lg font-bold text-on-surface">Kategori Kosong</h3>
          <p className="text-sm text-on-surface-variant">
            Silakan tambahkan kategori olahraga pertama Anda.
          </p>
        </div>
      ) : (
        <div
          className={isFetching ? "opacity-60 transition-opacity" : undefined}
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <Card
                key={cat.id}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-sm"
              >
                <div className="relative aspect-video bg-surface-container-low">
                  <Image
                    src={getCategoryImageUrl(cat.imageUrl)}
                    alt={cat.name}
                    fill
                    className="object-cover"
                    unoptimized={skipImageOptimization(
                      getCategoryImageUrl(cat.imageUrl),
                    )}
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between p-4">
                  <h4 className="text-base font-bold text-on-surface">
                    {cat.name}
                  </h4>
                  <div className="mt-4 flex items-center gap-2 border-t border-outline-variant pt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs font-bold"
                      onClick={() => setModal({ mode: "edit", category: cat })}
                    >
                      <Edit2 className="mr-1 h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-red-200 text-xs font-bold text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(cat.id)}
                    >
                      <Trash2 className="mr-1 h-3.5 w-3.5" />
                      Hapus
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
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
        <CategoryFormModal
          onClose={() => setModal({ mode: "closed" })}
          onSaved={() => {
            refetchCategories();
            toast.success("Kategori berhasil ditambahkan.");
          }}
        />
      ) : null}

      {modal.mode === "edit" ? (
        <CategoryFormModal
          category={modal.category}
          onClose={() => setModal({ mode: "closed" })}
          onSaved={() => {
            refetchCategories();
            toast.success("Kategori berhasil diperbarui.");
          }}
        />
      ) : null}
    </div>
  );
}
