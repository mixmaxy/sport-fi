"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AlertCircle, Loader2, Trash2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import {
  isRemovableTransactionStatus,
  useHiddenTransactionsStore,
} from "@/store/useHiddenTransactionsStore";
import { Button } from "@/shared/components/ui/Button";
import { PageShell } from "@/shared/components/layout/PageShell";
import { getTransactionById } from "@/features/transaction/lib/transactions.client";
import useSWR from "swr";
import {
  formatCurrency,
  formatDate,
  getStatusColor,
  getStatusLabel,
} from "@/shared/utils/helper";
import { cn } from "@/shared/utils/cn";
import { ProofPaymentUpload } from "@/features/transaction/components/ProofPaymentUpload";
import { toast } from "sonner";

export default function TransactionDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  const txId = params?.id;
  const hideTransaction = useHiddenTransactionsStore(
    (state) => state.hideTransaction,
  );
  const {
    data: tx,
    isLoading,
    error,
    mutate,
  } = useSWR(
    txId ? ["/transaction", txId] : null,
    () => getTransactionById(txId),
    { revalidateOnFocus: false, shouldRetryOnError: false },
  );

  const canRemove = tx ? isRemovableTransactionStatus(tx.status) : false;

  const handleRemoveFromList = () => {
    if (!tx) return;
    if (
      !confirm(
        "Hapus pesanan ini dari daftar? Riwayat tidak akan tampil lagi di dashboard.",
      )
    ) {
      return;
    }
    hideTransaction(tx.id);
    toast.success("Pesanan dihapus dari daftar.");
    router.push("/dashboard");
  };

  if (!isAuthenticated) return null;

  if (isLoading) {
    return (
      <PageShell
        narrow
        className="flex min-h-[60vh] items-center justify-center"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </PageShell>
    );
  }

  if (error || !tx) {
    return (
      <PageShell
        narrow
        className="flex min-h-[60vh] items-center justify-center"
      >
        <div className="text-center space-y-4">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <p className="font-semibold text-on-surface">
            Transaksi tidak ditemukan
          </p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell narrow className="pb-16">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">
            Detail Transaksi
          </h1>
          <p className="text-sm text-on-surface-variant">
            Created {formatDate(tx.createdAt)}
          </p>
        </div>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold",
            getStatusColor(tx.status),
          )}
        >
          {getStatusLabel(tx.status)}
        </span>
      </div>

      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-on-surface-variant">Total</p>
          <p className="text-xl font-bold text-on-surface">
            {formatCurrency(tx.totalAmount)}
          </p>
        </div>

        <div className="mt-6 border-t border-outline-variant pt-6">
          <p className="mb-3 font-semibold text-on-surface">Bukti Pembayaran</p>
          {tx.status === "pending" ? (
            <ProofPaymentUpload
              transactionId={tx.id}
              existingUrl={tx.proofPaymentUrl ?? undefined}
              onSuccess={() => mutate()}
            />
          ) : tx.proofPaymentUrl ? (
            <a
              href={tx.proofPaymentUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-primary hover:underline"
            >
              View proof
            </a>
          ) : (
            <p className="text-sm text-on-surface-variant">-</p>
          )}
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          {canRemove && (
            <Button
              variant="danger"
              leftIcon={<Trash2 className="h-4 w-4" />}
              onClick={handleRemoveFromList}
            >
              Hapus dari Daftar
            </Button>
          )}
          <Link href="/dashboard">
            <Button variant="outline">Kembali ke My Bookings</Button>
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
