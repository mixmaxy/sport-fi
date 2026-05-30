'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin, Star, ChevronLeft, ShoppingCart, ExternalLink,
  CheckCircle2, Loader2, AlertCircle
} from 'lucide-react';
import { useActivityDetail } from '@/features/activity/services/activityApi';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/shared/components/ui/Button';
import { Card, CardBody } from '@/shared/components/ui/Card';
import { formatCurrency, calculateDiscountPercentage } from '@/shared/lib/helpers';

/**
 * Activity Detail Page
 *
 * Why:
 * - Full activity info: images, description, facilities, pricing, map
 * - Image gallery with thumbnail selector
 * - Add to cart with quantity control
 * - Auth-aware: redirects to login if not authenticated
 * 
 * SEO:
 * - Dynamic title using activity name
 * - Breadcrumb navigation
 * - Structured content with semantic elements
 */

export default function ActivityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: activity, isLoading, isError } = useActivityDetail(id);
  const { addItem, getItemQuantity } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const inCart = activity ? getItemQuantity(activity.id) : 0;
  const discount = activity
    ? calculateDiscountPercentage(activity.price, activity.priceDiscount)
    : 0;
  const finalPrice = activity
    ? (activity.priceDiscount > 0 ? activity.priceDiscount : activity.price)
    : 0;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (!activity) return;
    addItem(activity, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // ---- Loading state ----
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto" />
          <p className="text-gray-500">Memuat detail aktivitas...</p>
        </div>
      </div>
    );
  }

  // ---- Error state ----
  if (isError || !activity) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-sm">
          <AlertCircle className="w-14 h-14 text-red-400 mx-auto" />
          <h1 className="text-xl font-semibold text-gray-800">Aktivitas tidak ditemukan</h1>
          <p className="text-gray-500">Aktivitas yang kamu cari tidak tersedia atau telah dihapus.</p>
          <Link href="/activities">
            <Button>Kembali ke Daftar Aktivitas</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images =
    activity.imageUrls?.length > 0
      ? activity.imageUrls
      : ['https://placehold.co/800x500?text=No+Image'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-blue-600">Beranda</Link></li>
            <li>/</li>
            <li><Link href="/activities" className="hover:text-blue-600">Aktivitas</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-medium truncate max-w-xs">{activity.title}</li>
          </ol>
        </nav>

        <Link href="/activities" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mb-6">
          <ChevronLeft className="w-4 h-4" />
          Kembali
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Images + Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <div className="relative w-full h-80 sm:h-[420px] rounded-xl overflow-hidden bg-gray-200">
              <Image
                src={images[activeImg]}
                alt={`Foto ${activity.title} - gambar ${activeImg + 1}`}
                fill
                className="object-cover"
                priority
              />
              {discount > 0 && (
                <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{discount}% OFF
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${i === activeImg ? 'border-blue-500' : 'border-transparent hover:border-gray-300'
                      }`}
                    aria-label={`Gambar ${i + 1}`}
                    aria-current={i === activeImg}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Title + Rating */}
            <div>
              {activity.category && (
                <span className="inline-block text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full mb-3">
                  {activity.category.name}
                </span>
              )}
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                {activity.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <strong className="text-gray-800">{activity.rating?.toFixed(1) || '0.0'}</strong>
                  <span>({activity.totalReviews || 0} ulasan)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{activity.city?.name}, {activity.province?.name}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardBody>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Deskripsi</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {activity.description}
                </p>
              </CardBody>
            </Card>

            {/* Facilities */}
            {activity.facilities && (
              <Card>
                <CardBody>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Fasilitas</h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activity.facilities.split(',').map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{f.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            )}

            {/* Address */}
            <Card>
              <CardBody>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Lokasi</h2>
                <p className="text-gray-600 mb-4">{activity.address}</p>
                {activity.locationMap && (
                  <a
                    href={activity.locationMap}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Buka di Google Maps
                  </a>
                )}
              </CardBody>
            </Card>
          </div>

          {/* RIGHT: Booking Card */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <Card>
                <CardBody className="space-y-6">
                  {/* Price */}
                  <div>
                    {discount > 0 && (
                      <p className="text-sm text-gray-400 line-through mb-1">
                        {formatCurrency(activity.price)}
                      </p>
                    )}
                    <p className="text-3xl font-bold text-blue-600">
                      {formatCurrency(finalPrice)}
                    </p>
                    <p className="text-sm text-gray-500">per sesi</p>
                  </div>

                  {/* Quantity selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jumlah Sesi
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQty(q => Math.max(1, q - 1))}
                        className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center text-lg font-bold hover:bg-gray-50"
                        aria-label="Kurangi jumlah"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-semibold text-lg">{qty}</span>
                      <button
                        onClick={() => setQty(q => q + 1)}
                        className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center text-lg font-bold hover:bg-gray-50"
                        aria-label="Tambah jumlah"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total</span>
                    <span className="font-bold text-gray-900">
                      {formatCurrency(finalPrice * qty)}
                    </span>
                  </div>

                  {/* CTA */}
                  <Button
                    fullWidth
                    size="lg"
                    variant={added ? 'secondary' : 'primary'}
                    leftIcon={added ? <CheckCircle2 className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                    onClick={handleAddToCart}
                  >
                    {added
                      ? 'Ditambahkan!'
                      : inCart > 0
                        ? `Tambah Lagi (${inCart} di keranjang)`
                        : isAuthenticated
                          ? 'Tambah ke Keranjang'
                          : 'Masuk untuk Memesan'}
                  </Button>

                  {inCart > 0 && (
                    <Link href="/cart">
                      <Button variant="outline" fullWidth>
                        Lihat Keranjang
                      </Button>
                    </Link>
                  )}

                  {!isAuthenticated && (
                    <p className="text-xs text-gray-500 text-center">
                      <Link href="/auth/login" className="text-blue-600 hover:underline">
                        Masuk
                      </Link>{' '}
                      atau{' '}
                      <Link href="/auth/register" className="text-blue-600 hover:underline">
                        daftar
                      </Link>{' '}
                      untuk memesan
                    </p>
                  )}
                </CardBody>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}