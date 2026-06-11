"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";

interface AdminListPaginationProps {
  currentPage: number;
  lastPage: number;
  total: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export function AdminListPagination({
  currentPage,
  lastPage,
  total,
  isLoading,
  onPageChange,
}: AdminListPaginationProps) {
  if (lastPage <= 1 && total === 0) return null;

  return (
    <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row sm:justify-between">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1 || isLoading}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
      >
        Sebelumnya
      </Button>
      <p className="text-sm text-on-surface-variant">
        Halaman <strong className="text-on-surface">{currentPage}</strong> dari{" "}
        <strong className="text-on-surface">{lastPage}</strong>
        {total > 0 ? <span className="ml-1">({total} item)</span> : null}
        {isLoading ? (
          <Loader2 className="ml-2 inline h-4 w-4 animate-spin text-primary" />
        ) : null}
      </p>
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= lastPage || isLoading}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Selanjutnya
      </Button>
    </div>
  );
}
