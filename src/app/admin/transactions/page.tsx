"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  Loader2,
  Search,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useAllTransactions } from "@/shared/config/client-fetch";
import { useMutationWithInvalidation } from "@/shared/hooks/useMutationWithInvalidation";
import { updateTransactionStatus } from "@/features/transaction/lib/transactions.client";
import { Button } from "@/shared/components/ui/Button";
import { ExternalImage } from "@/shared/components/ui/ExternalImage";
import { formatCurrency, formatDate, getStatusColor } from "@/shared/utils/helper";
import { cn } from "@/shared/utils/cn";
import { getErrorMessage } from "@/shared/config/api";
import { toast } from "sonner";
import type { Transaction, TransactionStatus } from "@/shared/types";

const PER_PAGE = 5;

type StatusTab = Extract<TransactionStatus, "pending" | "success" | "cancelled">;

const STATUS_TABS: {
  id: StatusTab;
  label: string;
  icon: React.ReactNode;
}[] = [
  { id: "pending", label: "Menunggu", icon: <Clock className="h-4 w-4" /> },
  {
    id: "success",
    label: "Berhasil",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  {
    id: "cancelled",
    label: "Dibatalkan",
    icon: <XCircle className="h-4 w-4" />,
  },
];

const statusLabels: Record<string, string> = {
  pending: "Menunggu",
  success: "Berhasil",
  cancelled: "Dibatalkan",
  failed: "Ditolak",
};

const emptyMessages: Record<StatusTab, string> = {
  pending: "Tidak ada transaksi yang menunggu verifikasi.",
  success: "Tidak ada transaksi berhasil.",
  cancelled: "Tidak ada transaksi yang dibatalkan.",
};

export default function AdminTransactionsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<StatusTab>("pending");

  const params = useMemo(
    () => ({ search: search || undefined, isPaginate: false as const }),
    [search],
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (user?.role !== "admin") router.replace("/");
  }, [isAuthenticated, user, router]);

  const { data: txPage, isLoading, isError, refetch } = useAllTransactions(
    params,
    isAuthenticated && user?.role === "admin",
  );

  const isInitialLoading = isLoading && !txPage;

  const { mutate: setStatus, isPending: updating } = useMutationWithInvalidation(
    updateTransactionStatus,
    () => refetch(),
  );

  const allRows = useMemo(() => txPage?.data ?? [], [txPage?.data]);

  const statusCounts = useMemo(() => {
    const counts: Record<StatusTab, number> = {
      pending: 0,
      success: 0,
      cancelled: 0,
    };
    for (const tx of allRows) {
      const status = tx.status.toLowerCase() as StatusTab;
      if (status in counts) counts[status] += 1;
    }
    return counts;
  }, [allRows]);

  const filteredRows = useMemo(
    () => allRows.filter((tx) => tx.status.toLowerCase() === activeStatus),
    [allRows, activeStatus],
  );

  const lastPage = Math.max(Math.ceil(filteredRows.length / PER_PAGE), 1);
  const currentPage = Math.min(page, lastPage);
  const rows = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    return filteredRows.slice(start, start + PER_PAGE);
  }, [filteredRows, currentPage]);

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center flex-col gap-3 text-center px-4">
        <ShieldAlert className="h-14 w-14 text-red-500" />
        <p className="text-xl font-semibold text-on-surface">Akses ditolak</p>
        <p className="text-on-surface-variant">Halaman ini hanya untuk admin.</p>
      </div>
    );
  }

  const isPendingStatus = (status: string) => status.toLowerCase() === "pending";

  const handleApprove = (tx: Transaction) => {
    const customerName = tx.user?.name ?? "pelanggan";
    if (
      !window.confirm(
        `Setujui pembayaran dari ${customerName} sebesar ${formatCurrency(tx.totalAmount)}?\n\nStatus transaksi akan diubah menjadi Berhasil.`,
      )
    ) {
      return;
    }

    setStatus(
      { transactionId: tx.id, status: "success" },
      {
        onSuccess: () => toast.success("Transaksi disetujui."),
        onError: (err) => toast.error(getErrorMessage(err)),
      },
    );
  };

  const handleReject = (tx: Transaction) => {
    const customerName = tx.user?.name ?? "pelanggan";
    if (
      !window.confirm(
        `Tolak pembayaran dari ${customerName} sebesar ${formatCurrency(tx.totalAmount)}?\n\nStatus transaksi akan diubah menjadi Ditolak.`,
      )
    ) {
      return;
    }

    setStatus(
      { transactionId: tx.id, status: "failed" },
      {
        onSuccess: () => toast.success("Transaksi ditolak."),
        onError: (err) => toast.error(getErrorMessage(err)),
      },
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-on-surface">All Transactions</h1>
            <p className="mt-1 text-on-surface-variant">Review pembayaran dan update status transaksi</p>
          </div>
          <div className="relative w-full md:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-on-surface-variant" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search..."
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-2 pr-4 pl-10 text-on-surface outline-none placeholder:text-on-surface-variant focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div
          className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-outline-variant bg-surface-container-lowest p-1"
          role="tablist"
        >
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeStatus === tab.id}
              onClick={() => {
                setActiveStatus(tab.id);
                setPage(1);
              }}
              className={cn(
                "flex min-w-0 flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold whitespace-nowrap transition-all",
                activeStatus === tab.id
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container-low",
              )}
            >
              {tab.icon}
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
                    <th className="px-6 py-3 text-left font-semibold text-on-surface-variant">User</th>
                    <th className="px-6 py-3 text-left font-semibold text-on-surface-variant">Total</th>
                    <th className="px-6 py-3 text-left font-semibold text-on-surface-variant">Status</th>
                    <th className="px-6 py-3 text-left font-semibold text-on-surface-variant">Proof</th>
                    <th className="px-6 py-3 text-left font-semibold text-on-surface-variant hidden md:table-cell">Created</th>
                    <th className="px-6 py-3 text-right font-semibold text-on-surface-variant">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {rows.map((tx) => (
                    <tr key={tx.id} className="hover:bg-surface-container-low/40">
                      <td className="px-6 py-4">
                        <div className="min-w-0">
                          <p className="font-semibold text-on-surface truncate">
                            {tx.user?.name ?? tx.userId}
                          </p>
                          <p className="text-xs text-on-surface-variant truncate">
                            {tx.user?.email ?? ""}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-on-surface">
                        {formatCurrency(tx.totalAmount)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", getStatusColor(tx.status))}>
                          {statusLabels[tx.status.toLowerCase()] ?? tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {tx.proofPaymentUrl ? (
                          <a href={tx.proofPaymentUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">
                            <div className="relative h-10 w-16 overflow-hidden rounded-md border border-outline-variant bg-surface-container-low">
                              <ExternalImage
                                src={tx.proofPaymentUrl}
                                alt="proof"
                                fill
                              />
                            </div>
                            <span className="text-xs font-semibold text-primary hover:underline">View</span>
                          </a>
                        ) : (
                          <span className="text-xs text-on-surface-variant">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant hidden md:table-cell">
                        {formatDate(tx.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
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
                      <td colSpan={6} className="px-6 py-16 text-center text-on-surface-variant">
                        {emptyMessages[activeStatus]}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between">
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
              <span className="ml-1">
                ({filteredRows.length} transaksi)
              </span>
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
      </div>
    </div>
  );
}

