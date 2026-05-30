'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, CheckCircle2, XCircle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useMyTransactions, useCancelTransaction } from '@/features/transaction/services/transactionApi';
import { ProofPaymentUpload } from './ProofPaymentUpload';
import { Card, CardBody } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { formatCurrency, formatDate, getStatusColor } from '@/shared/lib/helpers';
import { cn } from '@/shared/lib/utils';

/**
 * TransactionList Component
 * 
 * Why:
 * - Shows all user transactions with statuses
 * - Expand/collapse for details (proof upload, cancel)
 * - Status badge with colors for quick scanning
 * - Cancel only for pending transactions
 */

const STATUS_ICONS = {
    pending: <Clock className="w-4 h-4" />,
    success: <CheckCircle2 className="w-4 h-4" />,
    cancelled: <XCircle className="w-4 h-4" />,
};

const STATUS_LABELS: Record<string, string> = {
    pending: 'Menunggu',
    success: 'Berhasil',
    cancelled: 'Dibatalkan',
};

export const TransactionList = () => {
    const { data: transactions, isLoading, isError } = useMyTransactions();
    const { mutate: cancel, isPending: cancelling } = useCancelTransaction();
    const [expandedId, setExpandedId] = useState<string | null>(null);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center py-16 text-gray-500">
                Gagal memuat transaksi. Silakan refresh halaman.
            </div>
        );
    }

    if (!transactions || transactions.length === 0) {
        return (
            <div className="text-center py-16">
                <Clock className="w-14 h-14 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Belum ada transaksi</p>
                <p className="text-gray-400 text-sm mb-6">
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
            {transactions.map(tx => {
                const isExpanded = expandedId === tx.id;
                const status = tx.status as 'pending' | 'success' | 'cancelled';

                return (
                    <Card key={tx.id}>
                        <CardBody className="p-4">
                            {/* Header Row */}
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4 flex-1 min-w-0">
                                    {/* Activity Image */}
                                    {tx.items?.[0]?.sportActivity?.imageUrls?.[0] && (
                                        <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                            <Image
                                                src={tx.items[0].sportActivity.imageUrls[0]}
                                                alt={tx.items[0].sportActivity.title || ''}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}

                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 truncate">
                                            {tx.items?.[0]?.sportActivity?.title || 'Aktivitas tidak tersedia'}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            {tx.items?.[0]?.quantity} sesi · {formatDate(tx.createdAt)}
                                        </p>
                                        <p className="text-sm font-semibold text-blue-600 mt-1">
                                            {formatCurrency(tx.totalAmount)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    {/* Status Badge */}
                                    <span
                                        className={cn(
                                            'inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full',
                                            getStatusColor(status)
                                        )}
                                    >
                                        {STATUS_ICONS[status]}
                                        {STATUS_LABELS[status]}
                                    </span>

                                    {/* Expand Toggle */}
                                    <button
                                        onClick={() => setExpandedId(isExpanded ? null : tx.id)}
                                        className="text-gray-400 hover:text-gray-600 flex items-center gap-1 text-xs"
                                        aria-expanded={isExpanded}
                                    >
                                        {isExpanded ? 'Tutup' : 'Detail'}
                                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Expanded Detail */}
                            {isExpanded && (
                                <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                                    {/* Payment Method */}
                                    {tx.paymentMethod && (
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm text-gray-500">Metode Bayar:</span>
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
                                                <span className="text-sm font-medium">{tx.paymentMethod.name}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Proof Upload (only pending, no proof yet) */}
                                    {status === 'pending' && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 mb-2">
                                                {tx.proofPaymentUrl ? 'Bukti Pembayaran:' : 'Unggah Bukti Pembayaran:'}
                                            </p>
                                            {tx.proofPaymentUrl ? (
                                                <div className="relative h-32 w-48 rounded-lg overflow-hidden border border-gray-200">
                                                    <Image src={tx.proofPaymentUrl} alt="Bukti pembayaran" fill className="object-cover" />
                                                </div>
                                            ) : (
                                                <ProofPaymentUpload transactionId={tx.id} />
                                            )}
                                        </div>
                                    )}

                                    {/* Cancel Button */}
                                    {status === 'pending' && (
                                        <div className="flex justify-end">
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                isLoading={cancelling}
                                                onClick={() => {
                                                    if (confirm('Yakin ingin membatalkan pesanan ini?')) {
                                                        cancel(tx.id);
                                                    }
                                                }}
                                            >
                                                Batalkan Pesanan
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardBody>
                    </Card>
                );
            })}
        </div>
    );
};