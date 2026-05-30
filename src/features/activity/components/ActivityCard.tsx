'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star, ShoppingCart } from 'lucide-react';
import type { SportActivity } from '@/shared/types';
import { Button } from '@/shared/components/ui/Button';
import { Card, CardBody } from '@/shared/components/ui/Card';
import { formatCurrency, calculateDiscountPercentage } from '@/shared/lib/helpers';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'sonner';

interface ActivityCardProps {
  activity: SportActivity;
  priority?: boolean; // Prioritize image loading (LCP optimization)
}

export const ActivityCard = ({ activity, priority = false }: ActivityCardProps) => {
  const { addItem, getItemQuantity } = useCartStore();
  const inCartQty = getItemQuantity(activity.id);
  const discount = calculateDiscountPercentage(activity.price, activity.priceDiscount);
  const finalPrice = activity.priceDiscount > 0 ? activity.priceDiscount : activity.price;
  const imageUrl = activity.imageUrls?.[0] || '/placeholder.jpg';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(activity, 1);
    toast.success(`${activity.title} berhasil ditambahkan ke keranjang!`);
  };

  return (
    <Link href={`/activities/${activity.id}`} className="group block h-full">
      <Card hoverable className="h-full flex flex-col overflow-hidden bg-white border border-gray-150 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg rounded-xl">
        <CardBody className="p-0 flex flex-col h-full">
          {/* Image & Badges */}
          <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
            <Image
              src={imageUrl}
              alt={activity.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority={priority}
            />
            {/* Category Badge */}
            {activity.category?.name && (
              <span className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                {activity.category.name}
              </span>
            )}
            {/* Discount Badge */}
            {discount > 0 && (
              <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm animate-pulse">
                Hemat {discount}%
              </span>
            )}
            {inCartQty > 0 && (
              <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <ShoppingCart className="w-3 h-3" />
                {inCartQty} di keranjang
              </span>
            )}
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-1">
            {/* Title */}
            <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
              {activity.title}
            </h3>

            {/* Location & Address */}
            <div className="flex items-start gap-1.5 text-sm text-gray-500 mb-3">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-1">
                {activity.city?.name ?? activity.cityId}, {activity.province?.name ?? activity.provinceId}
              </span>
            </div>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5 text-yellow-500">
                <Star className="w-4 h-4 fill-yellow-500 stroke-yellow-500" />
                <span className="font-semibold text-gray-800 text-sm">
                  {activity.rating ? activity.rating.toFixed(1) : '5.0'}
                </span>
              </div>
              <span className="text-xs text-gray-400">
                ({activity.totalReviews ?? 0} ulasan)
              </span>
            </div>

            {/* Price and CTA at Bottom */}
            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
              <div className="flex flex-col">
                {discount > 0 && (
                  <span className="text-xs text-gray-400 line-through">
                    {formatCurrency(activity.price)}
                  </span>
                )}
                <span className="text-lg font-bold text-blue-600">
                  {formatCurrency(finalPrice)}
                </span>
              </div>

              {/* Add to Cart Quick CTA */}
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg p-2 border-blue-200 hover:border-blue-600 hover:bg-blue-50"
                onClick={handleAddToCart}
                aria-label="Add to cart"
              >
                <ShoppingCart className="w-4 h-4 text-blue-600" />
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
};

export default ActivityCard;
