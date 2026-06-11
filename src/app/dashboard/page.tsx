"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User as UserIcon, History, LayoutDashboard } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRestoreAuthSession } from "@/features/auth/hooks/useRestoreAuthSession";
import { UserProfile } from "@/features/auth/components/UserProfile";
import { TransactionList } from "@/features/transaction/components/TransactionList";
import { PageShell } from "@/shared/components/layout/PageShell";
import { cn } from "@/shared/utils/cn";
import { Loader2 } from "lucide-react";

type Tab = "profile" | "transactions";

export default function DashboardPage() {
  const { isAuthenticated, user, hasHydrated } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("transactions");
  const { isRestoring, isReady } = useRestoreAuthSession();

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [hasHydrated, isAuthenticated, router]);

  if (!hasHydrated || isRestoring || (isAuthenticated && !user)) {
    return (
      <PageShell narrow centered contentClassName="gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-on-surface-variant">Memuat data akun…</p>
      </PageShell>
    );
  }

  if (!isReady || !user) {
    return (
      <PageShell narrow centered contentClassName="gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-on-surface-variant">
          Mengalihkan ke halaman login…
        </p>
      </PageShell>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
      id: "transactions",
      label: "My Bookings",
      icon: <History className="h-5 w-5" />,
    },
    {
      id: "profile",
      label: "Settings",
      icon: <UserIcon className="h-5 w-5" />,
    },
  ];

  return (
    <PageShell>
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 rounded-xl border border-outline-variant bg-surface-container-lowest p-4 shadow-sm">
            <nav className="flex flex-col gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-all",
                    activeTab === tab.id
                      ? "bg-primary-container text-on-primary"
                      : "text-on-surface-variant hover:bg-surface-container-low",
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="relative mt-4 overflow-hidden rounded-xl bg-primary p-6 text-on-primary shadow-lg">
            <h3 className="mb-4 text-xs font-semibold tracking-widest uppercase opacity-80">
              Quick Stats
            </h3>
            <p className="text-sm opacity-90">
              Kelola pemesanan dan profilmu di satu tempat.
            </p>
            <LayoutDashboard className="absolute -right-6 -bottom-6 h-24 w-24 opacity-20" />
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-on-surface">
              {activeTab === "profile" ? "Profile Settings" : "My Bookings"}
            </h1>
            <p className="mt-1 text-on-surface-variant">
              Welcome back, <strong>{user.name}</strong>
            </p>
          </header>

          <div
            className="mb-6 flex gap-1 rounded-xl border border-outline-variant bg-surface-container-lowest p-1 lg:hidden"
            role="tablist"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold",
                  activeTab === tab.id
                    ? "bg-primary text-on-primary"
                    : "text-on-surface-variant",
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
            {activeTab === "profile" ? (
              <>
                <h2 className="mb-6 text-lg font-bold text-on-surface">
                  Profile Settings
                </h2>
                <UserProfile />
              </>
            ) : (
              <>
                <h2 className="mb-6 text-lg font-bold text-on-surface">
                  Booking History
                </h2>
                <TransactionList />
              </>
            )}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
