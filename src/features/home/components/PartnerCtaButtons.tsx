"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/shared/components/ui/Button";

export function PartnerCtaButtons() {
  const { isAuthenticated, user, hasHydrated } = useAuthStore();

  const primaryHref =
    hasHydrated && isAuthenticated
      ? user?.role === "admin"
        ? "/admin"
        : "/dashboard"
      : "/register";

  const primaryLabel =
    hasHydrated && isAuthenticated
      ? user?.role === "admin"
        ? "Manage Venues"
        : "Go to Dashboard"
      : "List Your Venue";

  return (
    <div className="flex flex-wrap gap-4">
      <Link href={primaryHref}>
        <Button
          size="lg"
          className="bg-primary px-8 uppercase tracking-widest shadow-xl shadow-primary/20 hover:brightness-110"
        >
          {primaryLabel}
        </Button>
      </Link>
      <Link href="/categories">
        <Button
          variant="outline"
          size="lg"
          className="border-white/30 bg-transparent px-8 text-white uppercase tracking-widest hover:border-white/50 hover:bg-white/10 hover:text-white"
        >
          Learn More
        </Button>
      </Link>
    </div>
  );
}
