import Link from "next/link";
import Image from "next/image";
import {
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
import { HeroSearchBar } from "@/features/home/components/HeroSearchBar";
import { PartnerCtaButtons } from "@/features/home/components/PartnerCtaButtons";
import { PopularVenuesSection } from "@/features/home/components/PopularVenuesSection";
import type { Province, SportActivity, SportCategory } from "@/shared/types";

const heroImage =
  "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1920&q=80";

interface HomePageContentProps {
  categories: SportCategory[];
  activities: SportActivity[];
  provinces: Province[];
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

export function HomePageContent({
  categories,
  activities,
  provinces,
}: HomePageContentProps) {
  const popularActivities = activities.slice(0, 6);
  const previewCategories = categories.slice(0, categoryPreviewLimit);
  const remainingCategoryCount = Math.max(
    0,
    categories.length - categoryPreviewLimit,
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden pb-8 md:min-h-[85vh] md:pb-0">
        <Image
          src={heroImage}
          alt="Fasilitas olahraga indoor"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-inverse-surface/90 via-inverse-surface/40 to-inverse-surface/30 md:from-inverse-surface/80 md:via-inverse-surface/20 md:to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-5xl px-4 text-center sm:px-6">
          <h1 className="mb-3 text-3xl font-extrabold leading-tight tracking-tight text-white drop-shadow-xl sm:text-4xl md:mb-4 md:text-5xl lg:text-6xl">
            Book Your Next Game
          </h1>
          <p className="mx-auto mb-6 max-w-2xl text-base leading-relaxed text-white/95 sm:text-lg md:mb-10 md:text-xl">
            Discover and reserve top-tier sports venues in your city with
            professional lighting and championship-standard surfaces.
          </p>

          <HeroSearchBar categories={categories} provinces={provinces} />
        </div>
      </section>

      {/* Categories — compact chip strip (preview only) */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10">
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

      <PopularVenuesSection activities={popularActivities} />

      {/* Partner CTA */}
      <section className="relative overflow-hidden bg-inverse-surface px-4 py-24 sm:px-6 lg:px-10">
        <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full bg-on-surface-variant/20 blur-[100px]" />

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-16 lg:flex-row">
          <div className="lg:w-1/2">
            <h2 className="mb-6 text-3xl leading-tight font-extrabold text-white md:text-5xl">
              Own a Sports Facility?
              <br />
              <span className="text-primary-container">Partner with us today.</span>
            </h2>
            <p className="mb-10 max-w-lg text-lg text-white/80">
              Increase your venue&apos;s visibility, manage bookings
              effortlessly, and grow your community with Sport Reserve&apos;s
              premium management platform.
            </p>
            <PartnerCtaButtons />
          </div>

          <div className="grid w-full grid-cols-2 gap-6 lg:w-1/2">
            <div className="space-y-6">
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
    <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm transition-colors hover:border-white/25 hover:bg-white/15 sm:p-8">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
        <Icon className="h-6 w-6 text-primary-container" aria-hidden />
      </div>
      <h4 className="mb-2 text-lg font-bold text-white">{title}</h4>
      <p className="text-sm leading-relaxed text-white/70">{description}</p>
    </div>
  );
}
