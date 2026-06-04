"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Loader2,
} from "lucide-react";
import {
  useMyTransactions,
  useCancelTransaction,
} from "@/features/transaction/hooks/useTransactions";
import { ProofPaymentUpload } from "./ProofPaymentUpload";
import { Card, CardBody } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import {
  formatCurrency,
  formatDate,
  getStatusColor,
} from "@/shared/utils/helper";
import { cn } from "@/shared/utils/cn";
import { getErrorMessage } from "@/shared/config/api";
import { toast } from "sonner";

const statusIcons = {
  pending: <Clock className="w-4 h-4" />,
  success: <CheckCircle2 className="w-4 h-4" />,
  cancelled: <XCircle className="w-4 h-4" />,
};

const statusLabels: Record<string, string> = {
  pending: "Menunggu",
  success: "Berhasil",
  cancelled: "Dibatalkan",
};

export const TransactionList = () => {
  const {
    data: transactions,
    isLoading,
    isError,
    refetch,
  } = useMyTransactions();
  const { mutate: cancel, isPending: cancelling } = useCancelTransaction();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-16 text-center text-on-surface-variant">
        Gagal memuat transaksi. Silakan refresh halaman.
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-16">
        <Clock className="mx-auto mb-4 h-14 w-14 text-outline-variant" />
        <p className="font-medium text-on-surface">Belum ada transaksi</p>
        <p className="mb-6 text-sm text-on-surface-variant">
          Pesan aktivitas olahraga dan transaksimu akan muncul di sini.
        </p>
        <Link href="/activities">
          <Button>Mulai Pesan</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((tx) => {
        const isExpanded = expandedId === tx.id;
        const status = tx.status as "pending" | "success" | "cancelled";

        return (
          <Card key={tx.id}>
            <CardBody className="p-4">
              {/* Header Row */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Activity Image */}
                  {tx.items?.[0]?.sportActivity?.imageUrls?.[0] && (
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-container-low">
                      <Image
                        src={tx.items[0].sportActivity.imageUrls[0]}
                        alt={tx.items[0].sportActivity.title || ""}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="truncate font-semibold text-on-surface">
                      {tx.items?.[0]?.sportActivity?.title ||
                        "Aktivitas tidak tersedia"}
                    </p>
                    <p className="mt-0.5 text-sm text-on-surface-variant">
                      {tx.items?.[0]?.quantity} sesi ·{" "}
                      {formatDate(tx.createdAt)}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-primary">
                      {formatCurrency(tx.totalAmount)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {/* Status Badge */}
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full",
                      getStatusColor(status),
                    )}
                  >
                    {statusIcons[status]}
                    {statusLabels[status]}
                  </span>

                  <Link href={`/transactions/${tx.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-outline-variant"
                      rightIcon={<ExternalLink className="h-3.5 w-3.5" />}
                    >
                      Lihat detail
                    </Button>
                  </Link>

                  {/* Expand Toggle */}
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : tx.id)}
                    className="flex items-center gap-1 text-xs text-on-surface-variant hover:text-primary"
                    aria-expanded={isExpanded}
                  >
                    {isExpanded ? "Tutup" : "Ringkasan"}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Detail */}
              {isExpanded && (
                <div className="mt-4 space-y-4 border-t border-outline-variant pt-4">
                  {/* Payment Method */}
                  {tx.paymentMethod && (
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-on-surface-variant">
                        Metode Bayar:
                      </span>
                      <div className="flex items-center gap-2">
                        {tx.paymentMethod.imageUrl && (
                          <div className="relative w-10 h-6">
                            <Image
                              src={tx.paymentMethod.imageUrl}
                              alt={tx.paymentMethod.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}
                        <span className="text-sm font-medium">
                          {tx.paymentMethod.name}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Proof Upload (only pending, no proof yet) */}
                  {status === "pending" && (
                    <div>
                      <p className="mb-2 text-sm font-medium text-on-surface">
                        {tx.proofPaymentUrl
                          ? "Bukti Pembayaran:"
                          : "Unggah Bukti Pembayaran:"}
                      </p>
                      {tx.proofPaymentUrl ? (
                        <div className="relative h-32 w-48 overflow-hidden rounded-lg border border-outline-variant">
                          <Image
                            src={tx.proofPaymentUrl}
                            alt="Bukti pembayaran"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <ProofPaymentUpload
                          transactionId={tx.id}
                          onSuccess={() => refetch()}
                        />
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <Link href={`/transactions/${tx.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        rightIcon={<ExternalLink className="h-3.5 w-3.5" />}
                      >
                        Halaman detail & bukti bayar
                      </Button>
                    </Link>

                    {/* Cancel Button */}
                    {status === "pending" && (
                      <Button
                        variant="danger"
                        size="sm"
                        isLoading={cancelling}
                        onClick={() => {
                          if (!confirm("Yakin ingin membatalkan pesanan ini?"))
                            return;
                          cancel(tx.id, {
                            onSuccess: () => {
                              toast.success("Pesanan berhasil dibatalkan.");
                            },
                            onError: (err) => {
                              toast.error(
                                getErrorMessage(err) ||
                                  "Gagal membatalkan pesanan.",
                              );
                            },
                          });
                        }}
                      >
                        Batalkan Pesanan
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
};
