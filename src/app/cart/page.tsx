'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/shared/components/ui/Button';
import { Card, CardBody } from '@/shared/components/ui/Card';
import { formatCurrency } from '@/shared/lib/helpers';

/**
 * Cart Page
 * 
 * Why:
 * - Review items before checkout
 * - Quantity management
 * - Price summary
 * - Auth-aware checkout CTA
 * 
 * Why client-side cart (Zustand + localStorage):
 * - Instant UI updates without API calls
 * - Persists across sessions
 * - No server costs for cart state
 */

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <ShoppingBag className="w-20 h-20 text-gray-200 mb-6" />
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Keranjangmu kosong</h1>
        <p className="text-gray-500 mb-8 max-w-sm">
          Tambahkan aktivitas olahraga ke keranjang untuk melanjutkan pemesanan.
        </p>
        <Link href="/activities">
          <Button size="lg">Jelajahi Aktivitas</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Keranjang ({items.length} item)
          </h1>
          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            Kosongkan
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ activity, quantity }) => {
              const finalPrice = activity.priceDiscount > 0
                ? activity.priceDiscount
                : activity.price;

              return (
                <Card key={activity.id}>
                  <CardBody className="p-4">
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={activity.imageUrls?.[0] || 'https://placehold.co/200x200?text=No+Image'}
                          alt={activity.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/activities/${activity.id}`}
                          className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 text-sm sm:text-base"
                        >
                          {activity.title}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">
                          {activity.city?.name}, {activity.province?.name}
                        </p>

                        {/* Price + Controls */}
                        <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                          <div>
                            {activity.priceDiscount > 0 && (
                              <span className="text-xs text-gray-400 line-through block">
                                {formatCurrency(activity.price)}
                              </span>
                            )}
                            <span className="font-bold text-blue-600">
                              {formatCurrency(finalPrice)}
                            </span>
                          </div>

                          {/* Qty control */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(activity.id, quantity - 1)}
                              className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                              aria-label="Kurangi"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-semibold">{quantity}</span>
                            <button
                              onClick={() => updateQuantity(activity.id, quantity + 1)}
                              className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                              aria-label="Tambah"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeItem(activity.id)}
                              className="w-8 h-8 rounded-lg text-red-400 hover:bg-red-50 flex items-center justify-center ml-1"
                              aria-label="Hapus item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="mt-3 pt-3 border-t border-gray-100 text-right">
                      <span className="text-sm text-gray-500">Subtotal: </span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(finalPrice * quantity)}
                      </span>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>

          {/* Order Summary */}
          <aside>
            <Card className="sticky top-24">
              <CardBody className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Ringkasan Pesanan</h2>

                {/* Item breakdown */}
                <div className="space-y-2 text-sm">
                  {items.map(({ activity, quantity }) => {
                    const p = activity.priceDiscount > 0 ? activity.priceDiscount : activity.price;
                    return (
                      <div key={activity.id} className="flex justify-between text-gray-600">
                        <span className="truncate max-w-[180px]">{activity.title} ×{quantity}</span>
                        <span className="font-medium text-gray-900 ml-2">{formatCurrency(p * quantity)}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between font-bold text-gray-900 text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>
                </div>

                {/* CTA */}
                {isAuthenticated ? (
                  <Link href="/checkout">
                    <Button fullWidth size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                      Lanjut Checkout
                    </Button>
                  </Link>
                ) : (
                  <div className="space-y-3">
                    <Link href="/auth/login">
                      <Button fullWidth size="lg">
                        Masuk untuk Checkout
                      </Button>
                    </Link>
                    <p className="text-xs text-center text-gray-500">
                      Belum punya akun?{' '}
                      <Link href="/auth/register" className="text-blue-600 hover:underline">
                        Daftar sekarang
                      </Link>
                    </p>
                  </div>
                )}

                <Link href="/activities">
                  <Button variant="ghost" fullWidth>
                    Tambah Aktivitas Lain
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