import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Search,
  Calendar,
  Star,
  ArrowRight,
  Dumbbell,
  Waves,
  Bike,
  Footprints,
  Volleyball,
  Trophy,
  BarChart3,
  CreditCard,
  CalendarClock,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { formatCurrency, calculateDiscountPercentage } from "@/shared/utils/helper";
import { getActivityImageUrl } from "@/shared/utils/images";
import type { SportActivity, SportCategory } from "@/shared/types";

const heroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBuBVkprj6We4NUVJhm6OO_9EgalgOauwRx8LMPhLUQAeIY6T2G5GZxkJK2NTdhU-thXu-GgwOSljjaqKKDB83UrC2FyvbnZJYhRsw3-NLAguqV4YTKRX2m-3EMiYf5M9fwBrpJFFCSPGOqk1cgxgUERgC-vFkwlcAfd-poPHojmSt9eWucRBIdp8amtIibcp3Ngl1UWBBsp_7dQAvh7LOPnN-SE1bgac4M_Gqi0pi6FYICGFn3p8NI5v2scO3Cd2c8fnldir9e2rA";

interface HomePageContentProps {
  categories: SportCategory[];
  activities: SportActivity[];
}

const categoryPreviewLimit = 7;

function getCategoryIcon(name: string): LucideIcon {
  const key = name.toLowerCase();
  if (
    key.includes("futsal") ||
    key.includes("sepak bola") ||
    key.includes("mini soccer") ||
    key.includes("basketball")
  ) {
    return Volleyball;
  }
  if (key.includes("renang") || key.includes("swim")) return Waves;
  if (key.includes("gym") || key.includes("fitness")) return Dumbbell;
  if (key.includes("sepeda") || key.includes("bike")) return Bike;
  if (key.includes("lari") || key.includes("run")) return Footprints;
  return Trophy;
}

export function HomePageContent({ categories, activities }: HomePageContentProps) {
  const popularActivities = activities.slice(0, 6);
  const previewCategories = categories.slice(0, categoryPreviewLimit);
  const remainingCategoryCount = Math.max(
    0,
    categories.length - categoryPreviewLimit,
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden">
        <Image
          src={heroImage}
          alt="Fasilitas olahraga indoor"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-inverse-surface/80 via-inverse-surface/20 to-transparent" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white drop-shadow-xl md:text-5xl lg:text-6xl">
            Book Your Next Game
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-lg text-white/90 md:text-xl">
            Discover and reserve top-tier sports venues in your city with
            professional lighting and championship-standard surfaces.
          </p>

          <div className="mx-auto flex max-w-5xl flex-col items-stretch gap-2 rounded-xl bg-white/85 p-4 shadow-2xl backdrop-blur-md md:flex-row md:p-2">
            <div className="flex flex-1 items-center gap-3 rounded-lg border border-outline-variant bg-surface-container-low px-4 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
              <MapPin className="h-5 w-5 shrink-0 text-on-surface-variant" aria-hidden />
              <input
                type="text"
                readOnly
                placeholder="Select Location"
                className="w-full bg-transparent py-4 text-on-surface outline-none placeholder:text-on-surface-variant"
                aria-label="Lokasi"
              />
            </div>
            <div className="flex flex-1 items-center gap-3 rounded-lg border border-outline-variant bg-surface-container-low px-4 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
              <Calendar className="h-5 w-5 shrink-0 text-on-surface-variant" aria-hidden />
              <input
                type="text"
                readOnly
                placeholder="Choose Date"
                className="w-full bg-transparent py-4 text-on-surface outline-none placeholder:text-on-surface-variant"
                aria-label="Tanggal"
              />
            </div>
            <div className="flex flex-1 items-center gap-3 rounded-lg border border-outline-variant bg-surface-container-low px-4 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
              <Search className="h-5 w-5 shrink-0 text-on-surface-variant" aria-hidden />
              <select
                className="w-full appearance-none bg-transparent py-4 text-on-surface outline-none"
                defaultValue=""
                aria-label="Kategori olahraga"
              >
                <option value="">All Sports</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <Link href="/activities" className="shrink-0">
              <Button
                size="lg"
                className="h-full w-full gap-2 rounded-lg bg-primary px-10 py-4 font-bold uppercase tracking-wide hover:brightness-110"
                leftIcon={<Search className="h-5 w-5" />}
              >
                Search
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories — compact chip strip (preview only) */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-on-surface">
                Explore Categories
              </h2>
              <p className="mt-1 text-sm text-on-surface-variant">
                Jump straight into the sport you love
              </p>
            </div>
            <Link
              href="/activities"
              className="flex shrink-0 items-center gap-1.5 text-sm font-bold text-primary hover:underline"
            >
              View all
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-1 scroll-smooth scrollbar-none sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
            {previewCategories.map((category) => {
              const Icon = getCategoryIcon(category.name);
              return (
                <Link
                  key={category.id}
                  href={`/activities?category=${category.id}`}
                  className="group inline-flex shrink-0 items-center gap-2.5 rounded-full border border-outline-variant bg-surface-container-low px-3 py-2 pr-4 text-sm font-semibold text-on-surface transition-colors hover:border-primary hover:bg-primary-container/30 hover:text-primary sm:px-4"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container text-on-primary transition-transform group-hover:scale-105">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="whitespace-nowrap">{category.name}</span>
                </Link>
              );
            })}
            {remainingCategoryCount > 0 && (
              <Link
                href="/activities"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-dashed border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:border-primary hover:bg-primary-container/20"
              >
                +{remainingCategoryCount} more
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            )}
          </div>
        </section>
      )}

      {/* Popular Venues */}
      <section className="bg-surface-container-lowest py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="mb-2 text-3xl font-bold tracking-tight text-on-surface">
                Popular Venues
              </h2>
              <p className="text-on-surface-variant">
                Top rated sports facilities recommended for you
              </p>
            </div>
            <Link
              href="/activities"
              className="flex items-center gap-2 font-bold text-primary hover:underline"
            >
              View All Venues
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {popularActivities.map((activity) => {
              const discount = calculateDiscountPercentage(
                activity.price,
                activity.priceDiscount ?? 0,
              );
              const finalPrice =
                (activity.priceDiscount ?? 0) > 0
                  ? (activity.priceDiscount ?? activity.price)
                  : activity.price;
              const categoryLabel =
                activity.category?.name ?? "Sport";

              return (
                <Link
                  key={activity.id}
                  href={`/activities/${activity.id}`}
                  className="group relative block overflow-hidden rounded-xl border border-outline-variant bg-white shadow-sm transition-all duration-500 hover:shadow-xl"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={getActivityImageUrl(activity.imageUrls)}
                      alt={activity.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      unoptimized={!activity.imageUrls?.[0]}
                    />
                    <div className="absolute top-4 right-4 flex items-center gap-1 rounded-lg bg-white/90 px-3 py-1 shadow-sm backdrop-blur-sm">
                      <Star
                        className="h-4 w-4 fill-tertiary text-tertiary"
                        aria-hidden
                      />
                      <span className="text-sm font-semibold text-on-surface">
                        {(activity.rating ?? 0).toFixed(1)}
                      </span>
                    </div>
                    <span className="absolute top-4 left-4 rounded-full bg-primary px-3 py-1 text-xs font-bold tracking-wider text-on-primary uppercase">
                      {categoryLabel}
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <h3 className="text-lg font-bold text-on-surface line-clamp-2">
                        {activity.title}
                      </h3>
                      <p className="shrink-0 text-lg font-bold text-primary">
                        {formatCurrency(finalPrice)}
                        <span className="text-sm font-normal text-on-surface-variant">
                          /sesi
                        </span>
                      </p>
                    </div>
                    {discount > 0 && (
                      <p className="mb-2 text-sm text-on-surface-variant line-through">
                        {formatCurrency(activity.price)}
                      </p>
                    )}
                    <p className="mb-6 flex items-center gap-1 text-on-surface-variant">
                      <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                      <span className="line-clamp-1">
                        {activity.city?.name ?? activity.cityId},{" "}
                        {activity.province?.name ?? activity.provinceId}
                      </span>
                    </p>
                    <div className="flex items-center gap-3 border-t border-outline-variant pt-4">
                      <div className="flex -space-x-2">
                        <div className="h-8 w-8 rounded-full border-2 border-white bg-slate-200" />
                        <div className="h-8 w-8 rounded-full border-2 border-white bg-slate-300" />
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#adc6ff] text-[10px] font-bold text-[#001a42]">
                          +{Math.min(activity.totalReviews ?? 0, 99)}
                        </div>
                      </div>
                      <span className="text-sm text-on-surface-variant">
                        booked this week
                      </span>
                    </div>
                  </div>

                  <span className="pointer-events-none absolute right-6 bottom-6 translate-y-4 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-on-primary opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    BOOK NOW
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partner CTA */}
      <section className="relative overflow-hidden bg-inverse-surface px-4 py-24 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full bg-on-surface-variant/20 blur-[100px]" />

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-16 lg:flex-row">
          <div className="lg:w-1/2">
            <h2 className="mb-6 text-3xl leading-tight font-extrabold text-white md:text-5xl">
              Own a Sports Facility?
              <br />
              <span className="text-[#adc6ff]">Partner with us today.</span>
            </h2>
            <p className="mb-10 max-w-lg text-lg text-[#bec6e0]">
              Increase your venue&apos;s visibility, manage bookings effortlessly,
              and grow your community with Sport Reserve&apos;s premium management
              platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-primary px-8 uppercase tracking-widest shadow-xl shadow-primary/20 hover:brightness-110"
                >
                  List Your Venue
                </Button>
              </Link>
              <Link href="/categories">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-outline-variant px-8 text-white uppercase tracking-widest hover:bg-white/10"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid w-full grid-cols-2 gap-6 lg:w-1/2">
            <div className="space-y-6 translate-y-8">
              <PartnerFeatureCard
                icon={BarChart3}
                title="Advanced Analytics"
                description="Track your revenue and occupancy in real-time."
              />
              <PartnerFeatureCard
                icon={CreditCard}
                title="Secure Payments"
                description="Automated payouts and secure transaction gateways."
              />
            </div>
            <div className="space-y-6">
              <PartnerFeatureCard
                icon={CalendarClock}
                title="Smart Scheduling"
                description="No more double bookings or manual logs."
              />
              <PartnerFeatureCard
                icon={Users}
                title="User Community"
                description="Access to thousands of active sports enthusiasts."
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function PartnerFeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-colors hover:bg-white/10">
      <Icon className="mb-4 h-10 w-10 text-primary" aria-hidden />
      <h4 className="mb-2 text-lg font-bold text-white">{title}</h4>
      <p className="text-sm text-on-surface-variant">{description}</p>
    </div>
  );
}
