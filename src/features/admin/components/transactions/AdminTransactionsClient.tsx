"use client";

import type { ReactNode } from "react";
import {
  CheckCircle2,
  Clock,
  Loader2,
  Search,
  XCircle,
} from "lucide-react";
import { AdminAccessDenied } from "@/features/admin/components/AdminAccessDenied";
import {
  admin_transaction_empty_message,
  admin_transaction_status_tab_meta,
  admin_transaction_status_tab_labels,
  type AdminTransactionStatusTab,
} from "@/features/admin/components/transactions/transactionConstants";
import { useAdminGuard } from "@/features/admin/hooks/useAdminGuard";
import { useAdminTransactions } from "@/features/admin/hooks/useAdminTransactions";
import { Button } from "@/shared/components/ui/Button";
import { PageShell } from "@/shared/components/layout/PageShell";
import { ExternalImage } from "@/shared/components/ui/ExternalImage";
import { formatCurrency, formatDate, getStatusColor } from "@/shared/utils/helper";
import { cn } from "@/shared/utils/cn";

const admin_transaction_tab_icons: Record<
  AdminTransactionStatusTab,
  ReactNode
> = {
  pending: <Clock className="h-4 w-4" />,
  success: <CheckCircle2 className="h-4 w-4" />,
  cancelled: <XCircle className="h-4 w-4" />,
};

export function AdminTransactionsClient() {
  const { isAuthenticated, isAdmin } = useAdminGuard({
    redirectPath: "/admin/transactions",
    loginRedirect: "/login",
  });

  const {
    search,
    activeStatus,
    statusCounts,
    rows,
    filteredRows,
    currentPage,
    lastPage,
    isLoading,
    isInitialLoading,
    isError,
    updating,
    isPendingStatus,
    handleApprove,
    handleReject,
    handleSearchChange,
    handleStatusChange,
    setPage,
  } = useAdminTransactions({
    enabled: isAuthenticated && isAdmin,
  });

  if (!isAuthenticated || !isAdmin) {
    return (
      <AdminAccessDenied
        title="Akses ditolak"
        description="Halaman ini hanya untuk admin."
        showHomeButton={false}
      />
    );
  }

  return (
    <PageShell>
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-on-surface">
              All Transactions
            </h1>
            <p className="mt-1 text-on-surface-variant">
              Review pembayaran dan update status transaksi
            </p>
          </div>
          <div className="relative w-full md:max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-on-surface-variant" />
            <input
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-2 pr-4 pl-10 text-on-surface outline-none placeholder:text-on-surface-variant focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div
          className="mb-6 flex snap-x snap-mandatory gap-1 overflow-x-auto rounded-xl border border-outline-variant bg-surface-container-lowest p-1"
          role="tablist"
        >
          {admin_transaction_status_tab_meta.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeStatus === tab.id}
              onClick={() => handleStatusChange(tab.id)}
              className={cn(
                "flex min-w-max flex-1 snap-start items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold whitespace-nowrap transition-all",
                activeStatus === tab.id
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container-low",
              )}
            >
              {admin_transaction_tab_icons[tab.id]}
              {tab.label}
              <span
                className={cn(
                  "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-bold",
                  activeStatus === tab.id
                    ? "bg-on-primary/20 text-on-primary"
                    : "bg-surface-container-low text-on-surface-variant",
                )}
              >
                {statusCounts[tab.id]}
              </span>
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
          {isInitialLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="py-16 text-center text-on-surface-variant">
              Gagal memuat transaksi.
            </div>
          ) : (
            <div className={cn("overflow-x-auto", isLoading && "opacity-60")}>
              <table className="w-full text-sm">
                <thead className="bg-surface-container-low">
                  <tr className="border-b border-outline-variant">
                    <th className="px-6 py-3 text-left font-semibold text-on-surface-variant">
                      User
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-on-surface-variant">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-on-surface-variant">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-on-surface-variant">
                      Proof
                    </th>
                    <th className="hidden px-6 py-3 text-left font-semibold text-on-surface-variant md:table-cell">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right font-semibold text-on-surface-variant">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {rows.map((tx) => (
                    <tr key={tx.id} className="hover:bg-surface-container-low/40">
                      <td className="px-6 py-4">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-on-surface">
                            {tx.user?.name ?? tx.userId}
                          </p>
                          <p className="truncate text-xs text-on-surface-variant">
                            {tx.user?.email ?? ""}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-on-surface">
                        {formatCurrency(tx.totalAmount)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
                            getStatusColor(tx.status),
                          )}
                        >
                          {admin_transaction_status_tab_labels[
                            tx.status.toLowerCase()
                          ] ?? tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {tx.proofPaymentUrl ? (
                          <a
                            href={tx.proofPaymentUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2"
                          >
                            <div className="relative h-10 w-16 overflow-hidden rounded-md border border-outline-variant bg-surface-container-low">
                              <ExternalImage
                                src={tx.proofPaymentUrl}
                                alt="proof"
                                fill
                              />
                            </div>
                            <span className="text-xs font-semibold text-primary hover:underline">
                              View
                            </span>
                          </a>
                        ) : (
                          <span className="text-xs text-on-surface-variant">
                            -
                          </span>
                        )}
                      </td>
                      <td className="hidden px-6 py-4 text-on-surface-variant md:table-cell">
                        {formatDate(tx.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={updating || !isPendingStatus(tx.status)}
                            leftIcon={<CheckCircle2 className="h-4 w-4" />}
                            onClick={() => handleApprove(tx)}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            disabled={updating || !isPendingStatus(tx.status)}
                            leftIcon={<XCircle className="h-4 w-4" />}
                            onClick={() => handleReject(tx)}
                          >
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-16 text-center text-on-surface-variant"
                      >
                        {admin_transaction_empty_message[activeStatus]}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <Button
            variant="outline"
            disabled={currentPage <= 1 || isLoading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </Button>
          <p className="text-sm text-on-surface-variant">
            Page <strong className="text-on-surface">{currentPage}</strong> of{" "}
            <strong className="text-on-surface">{lastPage}</strong>
            {filteredRows.length > 0 ? (
              <span className="ml-1">({filteredRows.length} transaksi)</span>
            ) : null}
            {isLoading && !isInitialLoading ? (
              <Loader2 className="ml-2 inline h-4 w-4 animate-spin text-primary" />
            ) : null}
          </p>
          <Button
            variant="outline"
            disabled={currentPage >= lastPage || isLoading}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
    </PageShell>
  );
}
