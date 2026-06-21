"use client";

import { useMemo, useState } from "react";
import { useAllTransactions } from "@/shared/config/client-fetch";
import { useMutationWithInvalidation } from "@/shared/hooks/useMutationWithInvalidation";
import { updateTransactionStatus } from "@/features/transaction/lib/transactions.client";
import { admin_transactions_per_page } from "@/features/admin/constants";
import type { AdminTransactionStatusTab } from "@/features/admin/components/transactions/transactionConstants";
import { formatCurrency } from "@/shared/utils/helper";
import { getErrorMessage } from "@/shared/config/api";
import { toast } from "sonner";
import type { Transaction } from "@/shared/types";

interface UseAdminTransactionsOptions {
  enabled: boolean;
}

export function useAdminTransactions({ enabled }: UseAdminTransactionsOptions) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] =
    useState<AdminTransactionStatusTab>("pending");

  const params = useMemo(
    () => ({ search: search || undefined, isPaginate: false as const }),
    [search],
  );

  const {
    data: txPage,
    isLoading,
    isError,
    refetch,
  } = useAllTransactions(params, enabled);

  const isInitialLoading = isLoading && !txPage;

  const { mutate: setStatus, isPending: updating } =
    useMutationWithInvalidation(updateTransactionStatus, () => refetch());

  const allRows = useMemo(() => txPage?.data ?? [], [txPage?.data]);

  const statusCounts = useMemo(() => {
    const counts: Record<AdminTransactionStatusTab, number> = {
      pending: 0,
      success: 0,
      cancelled: 0,
    };
    for (const tx of allRows) {
      const status = tx.status.toLowerCase() as AdminTransactionStatusTab;
      if (status in counts) counts[status] += 1;
    }
    return counts;
  }, [allRows]);

  const filteredRows = useMemo(
    () => allRows.filter((tx) => tx.status.toLowerCase() === activeStatus),
    [allRows, activeStatus],
  );

  const lastPage = Math.max(
    Math.ceil(filteredRows.length / admin_transactions_per_page),
    1,
  );
  const currentPage = Math.min(page, lastPage);
  const rows = useMemo(() => {
    const start = (currentPage - 1) * admin_transactions_per_page;
    return filteredRows.slice(start, start + admin_transactions_per_page);
  }, [filteredRows, currentPage]);

  const isPendingStatus = (status: string) =>
    status.toLowerCase() === "pending";

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

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (status: AdminTransactionStatusTab) => {
    setActiveStatus(status);
    setPage(1);
  };

  return {
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
  };
}
