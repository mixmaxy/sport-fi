"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Loader2, Lock, Shield } from "lucide-react";
import { useCartStore, selectCartTotalPrice } from "@/store/useCartStore";
import { useCreateTransaction } from "@/features/transaction/hooks/useTransactions";
import { getErrorMessage } from "@/shared/config/api";
import { Button } from "@/shared/components/ui/Button";
import { PageShell } from "@/shared/components/layout/PageShell";
import {
  formatCurrency,
  getActivityFinalPrice,
  hasActivityDiscount,
} from "@/shared/utils/helper";
import { cn } from "@/shared/utils/cn";
import { toast } from "sonner";
import type { PaymentMethod } from "@/shared/types";

interface CheckoutClientProps {
  paymentMethods: PaymentMethod[];
}

export function CheckoutClient({ paymentMethods }: CheckoutClientProps) {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const totalPrice = useCartStore(selectCartTotalPrice);
  const { mutateAsync: createTransaction, isPending } = useCreateTransaction();

  const [selectedPaymentId, setSelectedPaymentId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleConfirm = async () => {
    if (!selectedPaymentId) {
      const message = "Pilih metode pembayaran terlebih dahulu.";
      setError(message);
      toast.warning(message);
      return;
    }
    setError(null);

    try {
      const transactionItems = items.map(({ activity, quantity }) => ({
        sportActivityId: activity.id,
        quantity,
        price: activity.price,
        priceDiscount: hasActivityDiscount(
          activity.price,
          activity.priceDiscount,
        )
          ? activity.priceDiscount!
          : 0,
      }));

      await createTransaction({
        paymentMethodId: selectedPaymentId,
        transactionItems,
      });
      clearCart();
      setSuccess(true);
      toast.success(
        "Booking berhasil! Silakan unggah bukti pembayaran di My Bookings.",
      );
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err) {
      const message =
        getErrorMessage(err) || "Booking gagal. Silakan coba lagi.";
      setError(message);
      toast.error(message);
    }
  };

  if (items.length === 0 && !success) {
    return (
      <PageShell
        narrow
        className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center"
      >
        <p className="text-lg text-on-surface-variant">Keranjangmu kosong.</p>
        <Link href="/activities">
          <Button>Explore Venues</Button>
        </Link>
      </PageShell>
    );
  }

  if (success) {
    return (
      <PageShell
        narrow
        className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center"
      >
        <CheckCircle2 className="h-20 w-20 text-green-600" />
        <h1 className="text-2xl font-bold text-on-surface">
          Booking Confirmed!
        </h1>
        <p className="max-w-sm text-on-surface-variant">
          Upload your payment proof in My Bookings on the dashboard.
        </p>
        <Loader2 className="h-5 w-5 animate-spin text-on-surface-variant" />
        <p className="text-sm text-on-surface-variant">
          Redirecting to dashboard...
        </p>
      </PageShell>
    );
  }

  return (
    <PageShell narrow className="pb-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-on-surface">
            Secure Checkout
          </h1>
          <p className="mt-1 text-on-surface-variant">
            Complete your booking in a few steps
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-primary-container px-4 py-2 text-sm font-semibold text-on-primary">
          <Lock className="h-4 w-4" />
          SSL Secured
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-on-surface">
              Payment Method
            </h2>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setSelectedPaymentId(method.id)}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all",
                    selectedPaymentId === method.id
                      ? "border-primary bg-primary-container/30"
                      : "border-outline-variant hover:border-primary/40",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                      selectedPaymentId === method.id
                        ? "border-primary"
                        : "border-outline-variant",
                    )}
                  >
                    {selectedPaymentId === method.id && (
                      <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                    )}
                  </div>
                  <div className="relative h-10 w-16 shrink-0">
                    <Image
                      src={method.imageUrl}
                      alt={method.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="font-semibold text-on-surface">
                    {method.name}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <strong>Payment instructions:</strong> After confirming, upload your
            transfer proof under Dashboard → My Bookings.
          </div>
        </div>

        <aside className="lg:col-span-2">
          <div className="sticky top-24 rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
            <h2 className="text-lg font-bold text-on-surface">Order Summary</h2>

            <div className="mt-4 space-y-3">
              {items.map(({ activity, quantity }) => {
                const price = getActivityFinalPrice(
                  activity.price,
                  activity.priceDiscount,
                );
                return (
                  <div
                    key={activity.id}
                    className="flex justify-between text-sm"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-on-surface">
                        {activity.title}
                      </p>
                      <p className="text-on-surface-variant">
                        {quantity} session{quantity > 1 ? "s" : ""}
                      </p>
                    </div>
                    <span className="ml-2 font-semibold text-on-surface">
                      {formatCurrency(price * quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex justify-between border-t border-outline-variant pt-4 text-lg font-bold">
              <span className="text-on-surface">Total</span>
              <span className="text-primary">{formatCurrency(totalPrice)}</span>
            </div>

            {error && (
              <div
                className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                role="alert"
              >
                {error}
              </div>
            )}

            <Button
              fullWidth
              size="lg"
              className="mt-6 font-bold"
              isLoading={isPending}
              onClick={handleConfirm}
              disabled={!selectedPaymentId || isPending}
            >
              {isPending ? "Processing..." : "Confirm Booking"}
            </Button>

            <Link href="/cart" className="mt-3 block">
              <Button variant="ghost" fullWidth>
                Back to Cart
              </Button>
            </Link>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-on-surface-variant">
              <Shield className="h-3.5 w-3.5 text-primary" />
              Your data is protected
            </p>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
