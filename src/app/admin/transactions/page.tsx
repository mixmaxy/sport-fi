"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Search, ShieldAlert, XCircle } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useAllTransactions } from "@/shared/config/client-fetch";
import { useMutationWithInvalidation } from "@/shared/hooks/useMutationWithInvalidation";
import { updateTransactionStatus } from "@/features/transaction/lib/transactions.client";
import { Button } from "@/shared/components/ui/Button";
import { formatCurrency, formatDate, getStatusColor } from "@/shared/utils/helper";
import { cn } from "@/shared/utils/cn";

export default function AdminTransactionsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const params = useMemo(() => ({ page, perPage: 5, search: search || undefined }), [page, search]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (user?.role !== "admin") router.replace("/");
  }, [isAuthenticated, user, router]);

  const { data: txPage, isLoading, isError, refetch } = useAllTransactions(params, isAuthenticated && user?.role === "admin");

  const { mutate: setStatus, isPending: updating } = useMutationWithInvalidation(
    updateTransactionStatus,
    () => refetch(),
  );

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center flex-col gap-3 text-center px-4">
        <ShieldAlert className="h-14 w-14 text-red-500" />
        <p className="text-xl font-semibold text-on-surface">Akses ditolak</p>
        <p className="text-on-surface-variant">Halaman ini hanya untuk admin.</p>
      </div>
    );
  }

  const currentPage = txPage?.current_page ?? page;
  const lastPage = txPage?.last_page ?? 1;
  const rows = txPage?.data ?? [];

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

        <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="py-16 text-center text-on-surface-variant">
              Gagal memuat transaksi.
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {tx.proofPaymentUrl ? (
                          <a href={tx.proofPaymentUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">
                            <div className="relative h-10 w-16 overflow-hidden rounded-md border border-outline-variant bg-surface-container-low">
                              <Image src={tx.proofPaymentUrl} alt="proof" fill className="object-cover" />
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
                            disabled={updating || tx.status !== "pending"}
                            leftIcon={<CheckCircle2 className="h-4 w-4" />}
                            onClick={() => setStatus({ transactionId: tx.id, status: "success" })}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            disabled={updating || tx.status !== "pending"}
                            leftIcon={<XCircle className="h-4 w-4" />}
                            onClick={() => setStatus({ transactionId: tx.id, status: "failed" })}
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
                        Tidak ada transaksi.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <Button variant="outline" disabled={currentPage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            Prev
          </Button>
          <p className="text-sm text-on-surface-variant">
            Page <strong className="text-on-surface">{currentPage}</strong> of{" "}
            <strong className="text-on-surface">{lastPage}</strong>
          </p>
          <Button variant="outline" disabled={currentPage >= lastPage} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

