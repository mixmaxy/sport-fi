'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, MapPin, Calendar, TrendingUp, ChevronRight } from 'lucide-react';
import { useCategories } from '@/features/category/services/categoryApi';
import { useActivities } from '@/features/activity/services/activityApi';
import { Button } from '@/shared/components/ui/Button';
import { Card, CardBody } from '@/shared/components/ui/Card';
import { formatCurrency, calculateDiscountPercentage } from '@/shared/lib/helpers';

export default function HomePage() {
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: activities, isLoading: activitiesLoading } = useActivities();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Temukan & Pesan Aktivitas Olahraga Favoritmu
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Platform reservasi olahraga terpercaya dengan berbagai pilihan
              aktivitas di seluruh Indonesia
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-lg p-2 flex items-center gap-2 shadow-lg">
              <div className="flex-1 flex items-center gap-2 px-2">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari aktivitas olahraga..."
                  className="flex-1 py-2 text-gray-900 placeholder-gray-400 focus:outline-none"
                />
              </div>
              <Link href="/activities">
                <Button size="lg">Cari</Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold">{activities?.length || 0}+</div>
                <div className="text-blue-100">Aktivitas Olahraga</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{categories?.length || 0}+</div>
                <div className="text-blue-100">Kategori</div>
              </div>
              <div>
                <div className="text-3xl font-bold">500+</div>
                <div className="text-blue-100">Pengguna Aktif</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kategori Olahraga
            </h2>
            <p className="text-lg text-gray-600">
              Pilih kategori favoritmu dan mulai berolahraga
            </p>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton h-48 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories?.map((category) => (
                <Link
                  key={category.id}
                  href={`/activities?category=${category.id}`}
                  className="group"
                >
                  <Card hoverable className="h-full">
                    <CardBody className="p-0">
                      <div className="relative h-40 overflow-hidden rounded-t-lg">
                        <Image
                          src={category.imageUrl}
                          alt={category.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4 text-center">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {category.name}
                        </h3>
                      </div>
                    </CardBody>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/categories">
              <Button variant="outline" size="lg" rightIcon={<ChevronRight className="w-5 h-5" />}>
                Lihat Semua Kategori
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Activities Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Aktivitas Populer
              </h2>
              <p className="text-lg text-gray-600">
                Pilihan terbaik dari pengguna kami
              </p>
            </div>
            <Link href="/activities">
              <Button variant="outline" rightIcon={<ChevronRight className="w-5 h-5" />}>
                Lihat Semua
              </Button>
            </Link>
          </div>

          {activitiesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton h-96 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities?.slice(0, 6).map((activity) => {
                const discount = calculateDiscountPercentage(
                  activity.price,
                  activity.priceDiscount
                );

                return (
                  <Link key={activity.id} href={`/activities/${activity.id}`}>
                    <Card hoverable className="h-full">
                      <CardBody className="p-0">
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden rounded-t-lg">
                          <Image
                            src={activity.imageUrls[0] || '/placeholder.jpg'}
                            alt={activity.title}
                            fill
                            className="object-cover"
                          />
                          {discount > 0 && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                              -{discount}%
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                            {activity.title}
                          </h3>

                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                            <MapPin className="w-4 h-4" />
                            <span className="line-clamp-1">
                              {activity.city?.name ?? activity.cityId}, {activity.province?.name ?? activity.provinceId}
                            </span>
                          </div>

                          {/* Rating */}
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center gap-1 text-yellow-500">
                              <span className="text-lg">★</span>
                              <span className="font-semibold text-gray-900">
                                {activity.rating.toFixed(1)}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">
                              ({activity.totalReviews} review)
                            </span>
                          </div>

                          {/* Price */}
                          <div className="flex items-baseline gap-2">
                            {discount > 0 && (
                              <span className="text-sm text-gray-400 line-through">
                                {formatCurrency(activity.price)}
                              </span>
                            )}
                            <span className="text-xl font-bold text-blue-600">
                              {formatCurrency(activity.priceDiscount || activity.price)}
                            </span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mengapa Memilih SportReserve?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mudah Dicari</h3>
              <p className="text-gray-600">
                Cari aktivitas olahraga favoritmu dengan mudah berdasarkan lokasi dan kategori
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Booking Cepat</h3>
              <p className="text-gray-600">
                Proses pemesanan yang cepat dan aman dengan berbagai metode pembayaran
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Terpercaya</h3>
              <p className="text-gray-600">
                Platform terpercaya dengan review asli dari pengguna lain
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}