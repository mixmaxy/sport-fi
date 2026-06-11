"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Shield,
} from "lucide-react";
import { useCartStore, selectCartTotalPrice } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/shared/components/ui/Button";
import { PageShell } from "@/shared/components/layout/PageShell";
import {
  formatCurrency,
  getActivityFinalPrice,
  hasActivityDiscount,
} from "@/shared/utils/helper";
import {
  getActivityImageUrl,
  skipImageOptimization,
} from "@/shared/utils/images";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const totalPrice = useCartStore(selectCartTotalPrice);
  const { isAuthenticated } = useAuthStore();

  if (items.length === 0) {
    return (
      <PageShell narrow centered>
        <ShoppingBag className="mb-6 h-20 w-20 text-outline-variant" />
        <h1 className="mb-3 text-2xl font-bold text-on-surface">
          Your cart is empty
        </h1>
        <p className="mb-8 max-w-sm text-on-surface-variant">
          Browse venues and add sessions to start booking.
        </p>
        <Link href="/activities">
          <Button size="lg">Explore Venues</Button>
        </Link>
      </PageShell>
    );
  }

  return (
    <PageShell narrow>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-on-surface">
            Shopping Cart
          </h1>
          <p className="mt-1 text-on-surface-variant">
            {items.length} item{items.length > 1 ? "s" : ""} in your cart
          </p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
          Clear cart
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map(({ activity, quantity }) => {
            const finalPrice = getActivityFinalPrice(
              activity.price,
              activity.priceDiscount,
            );
            const showDiscount = hasActivityDiscount(
              activity.price,
              activity.priceDiscount,
            );

            return (
              <div
                key={activity.id}
                className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 shadow-sm"
              >
                <div className="flex gap-4">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-surface-container-low">
                    <Image
                      src={getActivityImageUrl(
                        activity.imageUrls,
                        0,
                        activity.id,
                      )}
                      alt={activity.title}
                      fill
                      className="object-cover"
                      unoptimized={skipImageOptimization(
                        getActivityImageUrl(
                          activity.imageUrls,
                          0,
                          activity.id,
                        ),
                      )}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/activities/${activity.id}`}
                      className="line-clamp-2 text-sm font-semibold text-on-surface transition-colors hover:text-primary sm:text-base"
                    >
                      {activity.title}
                    </Link>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      {activity.city?.name}, {activity.province?.name}
                    </p>

                    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        {showDiscount && (
                          <span className="block text-xs text-on-surface-variant line-through">
                            {formatCurrency(activity.price)}
                          </span>
                        )}
                        <span className="font-bold text-primary">
                          {formatCurrency(finalPrice)}
                        </span>
                      </div>

                      <div className="flex items-center justify-end gap-2 sm:shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(activity.id, quantity - 1)
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-outline-variant hover:bg-surface-container-low"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-semibold">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(activity.id, quantity + 1)
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-outline-variant hover:bg-surface-container-low"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(activity.id)}
                          className="ml-1 flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 border-t border-outline-variant pt-3 text-right text-sm">
                  <span className="text-on-surface-variant">Subtotal: </span>
                  <span className="font-semibold text-on-surface">
                    {formatCurrency(finalPrice * quantity)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <aside>
          <div className="sticky top-24 rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
            <h2 className="text-lg font-bold text-on-surface">Order Summary</h2>

            <div className="mt-4 space-y-2 text-sm">
              {items.map(({ activity, quantity }) => {
                const p = getActivityFinalPrice(
                  activity.price,
                  activity.priceDiscount,
                );
                return (
                  <div
                    key={activity.id}
                    className="flex justify-between text-on-surface-variant"
                  >
                    <span className="min-w-0 flex-1 truncate">
                      {activity.title} ×{quantity}
                    </span>
                    <span className="ml-2 font-medium text-on-surface">
                      {formatCurrency(p * quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 border-t border-outline-variant pt-4">
              <div className="flex justify-between text-lg font-bold text-on-surface">
                <span>Total</span>
                <span className="text-primary">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
            </div>

            {isAuthenticated ? (
              <Link href="/checkout" className="mt-6 block">
                <Button
                  fullWidth
                  size="lg"
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                  className="font-bold"
                >
                  Proceed to Checkout
                </Button>
              </Link>
            ) : (
              <div className="mt-6 space-y-3">
                <Link href="/login">
                  <Button fullWidth size="lg" className="font-bold">
                    Sign in to Checkout
                  </Button>
                </Link>
                <p className="text-center text-xs text-on-surface-variant">
                  No account?{" "}
                  <Link
                    href="/register"
                    className="font-semibold text-primary hover:underline"
                  >
                    Register free
                  </Link>
                </p>
              </div>
            )}

            <Link href="/activities" className="mt-3 block">
              <Button variant="ghost" fullWidth>
                Add more venues
              </Button>
            </Link>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-on-surface-variant">
              <Shield className="h-3.5 w-3.5 text-primary" />
              Secure booking with Sport Reserve
            </p>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
