"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useRestoreAuthSession } from "@/features/auth/hooks/useRestoreAuthSession";
import { useAuthStore } from "@/store/useAuthStore";

interface UseAdminGuardOptions {
  redirectPath?: string;
  loginRedirect?: string;
}

export function useAdminGuard({
  redirectPath = "/admin",
  loginRedirect,
}: UseAdminGuardOptions = {}) {
  const router = useRouter();
  const { user, isAuthenticated, hasHydrated } = useAuthStore();
  const { isRestoring, isReady } = useRestoreAuthSession({
    redirectToLogin: false,
  });
  const isAdmin = user?.role === "admin";
  const isLoading =
    !hasHydrated || isRestoring || (isAuthenticated && !user);

  useEffect(() => {
    if (!isReady || isRestoring) return;

    if (!isAuthenticated) {
      const loginUrl = loginRedirect ?? `/login?redirect=${redirectPath}`;
      router.replace(loginUrl);
      return;
    }

    if (user && user.role !== "admin") {
      toast.error("Akses ditolak. Halaman ini hanya untuk Administrator.");
      router.replace("/");
    }
  }, [
    user,
    isAuthenticated,
    isReady,
    isRestoring,
    router,
    redirectPath,
    loginRedirect,
  ]);

  return { user, isAuthenticated, isAdmin, isLoading };
}
