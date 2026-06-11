"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ChevronRight,
  ShoppingCart,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
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
import { toast } from "sonner";
import { cn } from "@/shared/utils/cn";
import type { SportActivity } from "@/shared/types";

interface ActivityDetailClientProps {
  activity: SportActivity;
}

export function ActivityDetailClient({ activity }: ActivityDetailClientProps) {
  const router = useRouter();
  const { addItem, getItemQuantity } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const inCart = getItemQuantity(activity.id);
  const discount = calculateDiscountPercentage(
    activity.price,
    activity.priceDiscount,
  );
  const finalPrice = getActivityFinalPrice(
    activity.price,
    activity.priceDiscount,
  );

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.info("Silakan login terlebih dahulu untuk booking.");
      router.push("/login");
      return;
    }
    addItem(activity, qty);
    setAdded(true);
    toast.success(`${activity.title} ditambahkan ke keranjang (${qty} sesi).`);
    setTimeout(() => setAdded(false), 2000);
  };

  const images = activity.imageUrls?.length
    ? activity.imageUrls
    : [getActivityImageUrl(null, 0, activity.id)];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 pb-16 sm:px-6 lg:px-10">
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex flex-wrap items-center gap-2 text-sm text-on-surface-variant"
        >
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" aria-hidden />
          <Link href="/activities" className="hover:text-primary">
            Venues
          </Link>
          <ChevronRight className="h-4 w-4" aria-hidden />
          <span className="font-semibold text-on-surface line-clamp-1">
            {activity.title}
          </span>
        </nav>

        <div className="mb-8">
          {activity.category && (
            <span className="mb-2 inline-block rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-on-primary">
              {activity.category.name}
            </span>
          )}
          <h1 className="text-3xl font-bold tracking-tight text-on-surface md:text-4xl">
            {activity.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-tertiary">
              <Star className="h-4 w-4 fill-tertiary" aria-hidden />
              <span className="font-bold text-on-surface">
                {(activity.rating ?? 0).toFixed(1)}
              </span>
              <span className="text-on-surface-variant">
                ({activity.totalReviews ?? 0} reviews)
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
          <div className="space-y-8 lg:col-span-2">
            <div className="w-full">
              <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl shadow-sm sm:aspect-2/1">
                <Image
                  src={images[activeImg]}
                  alt={activity.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                  priority
                  unoptimized={skipImageOptimization(images[activeImg])}
                />
                {discount > 0 && (
                  <span className="absolute top-4 right-4 rounded-full bg-tertiary px-3 py-1 text-sm font-bold text-on-primary">
                    -{discount}%
                  </span>
                )}
              </div>
              {images.length > 1 && (
                <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImg(i)}
                      className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border-2 transition-all sm:h-24 sm:w-32 ${
                        i === activeImg
                          ? "border-primary"
                          : "border-transparent hover:border-outline-variant"
                      }`}
                    >
                      <Image
                        src={img}
                        alt=""
                        fill
                        sizes="128px"
                        className="object-cover"
                        unoptimized={skipImageOptimization(img)}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6">
              <h2 className="mb-4 text-xl font-bold text-on-surface">
                About this Venue
              </h2>
              <p className="leading-relaxed whitespace-pre-line text-on-surface-variant">
                {activity.description}
              </p>
            </section>

            {activity.facilities && (
              <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6">
                <h2 className="mb-4 text-xl font-bold text-on-surface">
                  Amenities
                </h2>
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {activity.facilities.split(",").map((f, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-on-surface"
                    >
                      <CheckCircle2
                        className="h-4 w-4 shrink-0 text-primary"
                        aria-hidden
                      />
                      {f.trim()}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6">
              <h2 className="mb-3 text-xl font-bold text-on-surface">
                Location
              </h2>
              <p className="mb-4 text-on-surface-variant">{activity.address}</p>
              {activity.locationMap && (
                <a
                  href={activity.locationMap}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open in Google Maps
                </a>
              )}
            </section>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-[0_4px_6px_-1px_rgba(15,23,42,0.1)]">
              <p className="text-xs text-on-surface-variant">Starts from</p>
              {discount > 0 && (
                <p className="text-sm text-on-surface-variant line-through">
                  {formatCurrency(activity.price)}
                </p>
              )}
              <p className="text-3xl font-bold text-primary">
                {formatCurrency(finalPrice)}
                <span className="text-base font-medium text-on-surface-variant">
                  /sesi
                </span>
              </p>

              <div className="mt-6">
                <label className="mb-2 block text-sm font-semibold text-on-surface">
                  Sessions
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant font-bold hover:bg-surface-container-low"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-lg font-bold">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant font-bold hover:bg-surface-container-low"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-outline-variant py-4">
                <span className="text-on-surface-variant">Total</span>
                <span className="text-xl font-bold text-on-surface">
                  {formatCurrency(finalPrice * qty)}
                </span>
              </div>

              <Button
                fullWidth
                size="lg"
                variant="primary"
                className={cn(
                  "font-bold",
                  added && "bg-green-600 text-white hover:brightness-110",
                )}
                leftIcon={
                  added ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <ShoppingCart className="h-5 w-5" />
                  )
                }
                onClick={handleAddToCart}
              >
                {added
                  ? "Added!"
                  : inCart > 0
                    ? `Add Again (${inCart} in cart)`
                    : isAuthenticated
                      ? "Book Now"
                      : "Sign in to Book"}
              </Button>

              {inCart > 0 && (
                <Link href="/cart" className="mt-3 block">
                  <Button variant="outline" fullWidth>
                    View Cart
                  </Button>
                </Link>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
