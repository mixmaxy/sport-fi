"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/features/auth/lib/auth.client";
import { useAuthStore } from "@/store/useAuthStore";
import type { User } from "@/shared/types";

function readLegacyUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("user_data");
  if (!raw || raw === "undefined" || raw === "null") return null;
  try {
    const parsed = JSON.parse(raw) as User;
    return parsed?.id ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * When persist has token + isAuthenticated but user is missing, recover via
 * legacy localStorage or GET /me so protected pages do not render blank.
 */
export function useRestoreAuthSession(options?: { redirectToLogin?: boolean }) {
  const router = useRouter();
  const redirectToLogin = options?.redirectToLogin ?? true;
  const { hasHydrated, isAuthenticated, user, token, updateUser, logout } =
    useAuthStore();
  const [isRestoring, setIsRestoring] = useState(false);

  useEffect(() => {
    if (!hasHydrated || !isAuthenticated || user) return;

    let cancelled = false;

    const restore = async () => {
      setIsRestoring(true);

      const legacyUser = readLegacyUser();
      if (legacyUser) {
        updateUser(legacyUser);
        if (!cancelled) setIsRestoring(false);
        return;
      }

      const authToken =
        token ??
        (typeof window !== "undefined"
          ? localStorage.getItem("auth_token")
          : null);

      if (!authToken) {
        logout();
        if (redirectToLogin && !cancelled) router.replace("/login");
        if (!cancelled) setIsRestoring(false);
        return;
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", authToken);
      }
      if (!token) {
        useAuthStore.setState({ token: authToken, isAuthenticated: true });
      }

      try {
        const me = await getCurrentUser();
        if (!cancelled) updateUser(me);
      } catch {
        logout();
        if (redirectToLogin && !cancelled) router.replace("/login");
      } finally {
        if (!cancelled) setIsRestoring(false);
      }
    };

    void restore();

    return () => {
      cancelled = true;
    };
  }, [
    hasHydrated,
    isAuthenticated,
    user,
    token,
    updateUser,
    logout,
    router,
    redirectToLogin,
  ]);

  return {
    isRestoring:
      hasHydrated && isAuthenticated && !user && isRestoring,
    isReady: hasHydrated && (!isAuthenticated || !!user),
  };
}
