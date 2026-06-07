"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ActivityCard } from "@/features/activity/components/ActivityCard";
import type { SportActivity } from "@/shared/types";

interface PopularVenuesSectionProps {
  activities: SportActivity[];
}

export function PopularVenuesSection({ activities }: PopularVenuesSectionProps) {
  if (activities.length === 0) return null;

  return (
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
          {activities.map((activity, index) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              priority={index < 3}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
