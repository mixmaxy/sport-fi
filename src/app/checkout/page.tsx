'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { usePaymentMethods } from '@/features/payment/services/paymentApi';
import { useCreateTransaction } from '@/features/transaction/services/transactionApi';
import { Button } from '@/shared/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/shared/components/ui/Card';
import { formatCurrency } from '@/shared/lib/helpers';
import { cn } from '@/shared/lib/utils';

/**
 * Checkout Page
 * 
 * Why:
 * - Review order before payment
 * - Payment method selection
 * - Creates transaction per item (API design)
 * - Redirects to dashboard after success
 * 
 * Why create one transaction per item:
 * - API: POST /create-transaction accepts single sportActivityId
 * - Allows individual cancellation / proof upload per item
 */

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const { data: paymentMethods, isLoading: loadingPayments } = usePaymentMethods();
  const { mutateAsync: createTransaction, isPending } = useCreateTransaction();

  const [selectedPaymentId, setSelectedPaymentId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleConfirm = async () => {
    if (!selectedPaymentId) {
      setError('Pilih metode pembayaran terlebih dahulu.');
      return;
    }
    setError(null);

    // Create one transaction per cart item
    try {
      // Build the array of TransactionItem objects
      const transactionItems = items.map(({ activity, quantity }) => ({
        sportActivityId: activity.id,
        quantity,
        price: activity.price,
        priceDiscount: activity.priceDiscount,
      }));
      // Send a single request that contains all items
      await createTransaction({
        paymentMethodId: selectedPaymentId,
        transactionItems,
      });
      clearCart();
      setSuccess(true);
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Gagal membuat pesanan. Silakan coba lagi.');
    }
  };

  if (items.length === 0 && !success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center flex-col gap-4 text-center px-4">
        <p className="text-gray-600 text-lg">Keranjangmu kosong.</p>
        <Link href="/activities"><Button>Jelajahi Aktivitas</Button></Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center flex-col gap-4 text-center px-4">
        <CheckCircle2 className="w-20 h-20 text-green-500" />
        <h1 className="text-2xl font-bold text-gray-900">Pesanan Berhasil!</h1>
        <p className="text-gray-600 max-w-sm">
          Pesananmu telah dibuat. Silakan unggah bukti pembayaran di dashboard.
        </p>
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
        <p className="text-sm text-gray-400">Mengarahkan ke dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Payment Method */}
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">Metode Pembayaran</h2>
              </CardHeader>
              <CardBody>
                {loadingPayments ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {paymentMethods?.map(method => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedPaymentId(method.id)}
                        className={cn(
                          'w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left',
                          selectedPaymentId === method.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                        aria-pressed={selectedPaymentId === method.id}
                      >
                        {/* Radio visual */}
                        <div className={cn(
                          'w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center',
                          selectedPaymentId === method.id
                            ? 'border-blue-500'
                            : 'border-gray-300'
                        )}>
                          {selectedPaymentId === method.id && (
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                          )}
                        </div>

                        {/* Payment Logo */}
                        <div className="relative w-16 h-10 flex-shrink-0">
                          <Image
                            src={method.imageUrl}
                            alt={method.name}
                            fill
                            className="object-contain"
                          />
                        </div>

                        <span className="font-medium text-gray-900">{method.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Note about proof upload */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
              <strong>Cara Pembayaran:</strong> Setelah konfirmasi pesanan, kamu perlu mengunggah
              bukti transfer di halaman Dashboard → Riwayat Transaksi.
            </div>
          </div>

          {/* Right: Order Summary */}
          <aside className="lg:col-span-2">
            <Card className="sticky top-24">
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">Ringkasan Pesanan</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {items.map(({ activity, quantity }) => {
                    const price = activity.priceDiscount > 0 ? activity.priceDiscount : activity.price;
                    return (
                      <div key={activity.id} className="flex justify-between text-sm">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{activity.title}</p>
                          <p className="text-gray-500">{quantity} sesi</p>
                        </div>
                        <span className="font-semibold text-gray-900 ml-2">
                          {formatCurrency(price * quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-blue-600">{formatCurrency(totalPrice)}</span>
                </div>

                {/* Error */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700" role="alert">
                    {error}
                  </div>
                )}

                {/* Confirm Button */}
                <Button
                  fullWidth
                  size="lg"
                  isLoading={isPending}
                  onClick={handleConfirm}
                  disabled={!selectedPaymentId || isPending}
                >
                  {isPending ? 'Memproses...' : 'Konfirmasi Pesanan'}
                </Button>

                <Link href="/cart">
                  <Button variant="ghost" fullWidth>
                    Kembali ke Keranjang
                  </Button>
                </Link>
              </CardBody>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}