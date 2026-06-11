"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Star,
  ShoppingCart,
  Car,
  Droplets,
  UtensilsCrossed,
  Lock,
  Wifi,
  Dumbbell,
} from "lucide-react";
import type { SportActivity } from "@/shared/types";
import { Button } from "@/shared/components/ui/Button";
import {
  formatCurrency,
  calculateDiscountPercentage,
  getActivityFinalPrice,
} from "@/shared/utils/helper";
import {
  getActivityImageUrl,
  skipImageOptimization,
} from "@/shared/utils/images";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";

interface ActivityCardProps {
  activity: SportActivity;
  priority?: boolean;
}

function getFacilityIcons(facilities?: string) {
  if (!facilities) return [];
  const text = facilities.toLowerCase();
  const icons = [];
  if (text.includes("parkir") || text.includes("parking"))
    icons.push({ Icon: Car, label: "Parking" });
  if (text.includes("shower") || text.includes("mandi"))
    icons.push({ Icon: Droplets, label: "Shower" });
  if (text.includes("locker") || text.includes("loker"))
    icons.push({ Icon: Lock, label: "Locker" });
  if (
    text.includes("kantin") ||
    text.includes("cafe") ||
    text.includes("minum")
  )
    icons.push({ Icon: UtensilsCrossed, label: "Cafe" });
  if (text.includes("wifi")) icons.push({ Icon: Wifi, label: "WiFi" });
  if (text.includes("gym") || text.includes("fitness"))
    icons.push({ Icon: Dumbbell, label: "Gym" });
  return icons.slice(0, 4);
}

export function ActivityCard({
  activity,
  priority = false,
}: ActivityCardProps) {
  const { addItem, getItemQuantity } = useCartStore();
  const inCartQty = getItemQuantity(activity.id);
  const discount = calculateDiscountPercentage(
    activity.price,
    activity.priceDiscount,
  );
  const finalPrice = getActivityFinalPrice(
    activity.price,
    activity.priceDiscount,
  );
  const imageUrl = getActivityImageUrl(activity.imageUrls, 0, activity.id);
  const facilityIcons = getFacilityIcons(activity.facilities);
  const categoryLabel = activity.category?.name ?? "Sport";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(activity, 1);
    toast.success(`${activity.title} berhasil ditambahkan ke keranjang!`);
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-[0_4px_6px_-1px_rgba(15,23,42,0.1)] transition-all hover:shadow-[0_10px_15px_-3px_rgba(15,23,42,0.15)]">
      <Link
        href={`/activities/${activity.id}`}
        className="relative block h-56 overflow-hidden"
      >
        <Image
          src={imageUrl}
          alt={activity.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={priority}
          unoptimized={skipImageOptimization(imageUrl)}
        />
        <span className="absolute top-4 left-4 rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-on-primary">
          {categoryLabel}
        </span>
        {discount > 0 && (
          <span className="absolute top-4 right-4 rounded-lg bg-tertiary px-3 py-1 text-xs font-bold text-on-primary">
            -{discount}%
          </span>
        )}
        {inCartQty > 0 && (
          <span className="absolute bottom-4 right-4 flex items-center gap-1 rounded-lg bg-green-600 px-2 py-1 text-xs font-bold text-white">
            <ShoppingCart className="h-3 w-3" />
            {inCartQty}
          </span>
        )}
      </Link>

      <div className="flex flex-col p-5">
        <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
          <Link
            href={`/activities/${activity.id}`}
            className="text-lg font-bold text-on-surface transition-colors hover:text-primary line-clamp-2"
          >
            {activity.title}
          </Link>
          <div className="flex shrink-0 items-center gap-1 text-tertiary">
            <Star className="h-4 w-4 fill-tertiary text-tertiary" aria-hidden />
            <span className="font-bold text-on-surface">
              {(activity.rating ?? 0).toFixed(1)}
            </span>
            <span className="text-xs text-on-surface-variant">
              ({activity.totalReviews ?? 0})
            </span>
          </div>
        </div>

        <p className="mb-4 flex items-center gap-1 text-sm text-on-surface-variant">
          <MapPin className="h-4 w-4 shrink-0" aria-hidden />
          <span className="line-clamp-2">
            {activity.address ||
              `${activity.city?.name ?? activity.cityId}, ${activity.province?.name ?? activity.provinceId}`}
          </span>
        </p>

        {facilityIcons.length > 0 && (
          <div className="mb-6 flex items-center gap-2">
            {facilityIcons.map(({ Icon, label }) => (
              <Icon
                key={label}
                className="h-[18px] w-[18px] text-primary"
                aria-label={label}
              />
            ))}
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-outline-variant pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-xs text-on-surface-variant">Starts from</span>
            <div className="text-xl font-bold text-primary">
              {formatCurrency(finalPrice)}
              <span className="text-sm font-medium text-on-surface-variant">
                /sesi
              </span>
            </div>
            {discount > 0 && (
              <span className="text-xs text-on-surface-variant line-through">
                {formatCurrency(activity.price)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 sm:justify-end">
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg border-outline-variant p-2 hover:border-primary hover:bg-surface-container-low"
              onClick={handleAddToCart}
              aria-label="Tambah ke keranjang"
            >
              <ShoppingCart className="h-4 w-4 text-primary" />
            </Button>
            <Link href={`/activities/${activity.id}`} className="flex-1 sm:flex-none">
              <Button
                size="sm"
                fullWidth
                className="rounded-lg bg-primary px-6 py-3 font-bold hover:brightness-110 sm:w-auto"
              >
                View Detail
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ActivityCard;
