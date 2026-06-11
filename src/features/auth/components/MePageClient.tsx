"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Loader2,
  Mail,
  Phone,
  RefreshCw,
  Shield,
  User as UserIcon,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRestoreAuthSession } from "@/features/auth/hooks/useRestoreAuthSession";
import { useCurrentUser } from "@/shared/config/client-fetch";
import { getErrorMessage } from "@/shared/config/api";
import { PageShell } from "@/shared/components/layout/PageShell";
import { Card, CardBody } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import { formatDate, getInitials } from "@/shared/utils/helper";
import { cn } from "@/shared/utils/cn";
import type { User } from "@/shared/types";

function DetailRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 border-b border-outline-variant py-4 last:border-0 last:pb-0 first:pt-0">
      {icon && (
        <div className="mt-0.5 text-on-surface-variant shrink-0">{icon}</div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
          {label}
        </p>
        <p className="mt-1 text-sm font-medium text-on-surface wrap-break-words">
          {value ?? "—"}
        </p>
      </div>
    </div>
  );
}

function MeProfileCard({ user }: { user: User }) {
  const roleLabel = user.role === "admin" ? "Admin" : "User";

  return (
    <Card>
      <CardBody className="p-6 sm:p-8">
        <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-container">
            <span className="text-2xl font-bold text-on-primary">
              {getInitials(user.name)}
            </span>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-on-surface">{user.name}</h2>
            <p className="mt-1 text-on-surface-variant">{user.email}</p>
            <span
              className={cn(
                "mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                user.role === "admin"
                  ? "bg-primary-container text-on-primary"
                  : "bg-surface-container-high text-on-surface",
              )}
            >
              <Shield className="h-3.5 w-3.5" />
              {roleLabel}
            </span>
          </div>
        </div>

        <DetailRow
          label="ID User"
          value={user.id}
          icon={<UserIcon className="h-5 w-5" />}
        />
        <DetailRow
          label="Email"
          value={user.email}
          icon={<Mail className="h-5 w-5" />}
        />
        <DetailRow
          label="Nomor Telepon"
          value={user.phoneNumber || "Belum diisi"}
          icon={<Phone className="h-5 w-5" />}
        />
        <DetailRow label="Role" value={roleLabel} icon={<Shield className="h-5 w-5" />} />
        <DetailRow
          label="Terdaftar"
          value={formatDate(user.createdAt, "long")}
        />
        <DetailRow
          label="Terakhir Diperbarui"
          value={formatDate(user.updatedAt, "long")}
        />
      </CardBody>
    </Card>
  );
}

export function MePageClient() {
  const router = useRouter();
  const { isAuthenticated, hasHydrated, updateUser } = useAuthStore();
  const { isRestoring } = useRestoreAuthSession();

  const enabled = hasHydrated && isAuthenticated && !isRestoring;
  const {
    data: me,
    error,
    isLoading,
    mutate: refetch,
    isValidating,
  } = useCurrentUser(enabled);

  useEffect(() => {
    if (hasHydrated && !isAuthenticated && !isRestoring) {
      router.replace("/login");
    }
  }, [hasHydrated, isAuthenticated, isRestoring, router]);

  useEffect(() => {
    if (me) {
      updateUser(me);
    }
  }, [me, updateUser]);

  if (!hasHydrated || isRestoring) {
    return (
      <PageShell narrow centered contentClassName="gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-on-surface-variant">Memuat sesi…</p>
      </PageShell>
    );
  }

  if (!isAuthenticated) {
    return (
      <PageShell narrow centered contentClassName="gap-4">
        <p className="text-on-surface-variant">Silakan login untuk melihat profil.</p>
        <Link href="/login">
          <Button>Login</Button>
        </Link>
      </PageShell>
    );
  }

  return (
    <PageShell narrow>
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-on-surface">
            Profil Saya
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            isLoading={isValidating}
            leftIcon={<RefreshCw className="h-4 w-4" />}
          >
            Muat ulang
          </Button>
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              My Bookings
            </Button>
          </Link>
        </div>
      </header>

      {isLoading && !me ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-on-surface-variant">
            Memanggil API /me…
          </p>
        </div>
      ) : error ? (
        <Card>
          <CardBody className="flex flex-col items-center gap-4 py-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <div>
              <p className="font-semibold text-on-surface">
                Gagal memuat data profil
              </p>
              <p className="mt-1 text-sm text-on-surface-variant">
                {getErrorMessage(error)}
              </p>
            </div>
            <Button onClick={() => refetch()} leftIcon={<RefreshCw className="h-4 w-4" />}>
              Coba lagi
            </Button>
          </CardBody>
        </Card>
      ) : me ? (
        <MeProfileCard user={me} />
      ) : null}
    </PageShell>
  );
}
