"use client";

import { useEffect } from "react";
import { getCurrentUser } from "@/features/auth/lib/auth.client";
import { useAuthStore } from "@/store/useAuthStore";
import type { User } from "@/shared/types";

function recoverUserFromLegacyStorage() {
  const { isAuthenticated, user, updateUser } = useAuthStore.getState();
  if (!isAuthenticated || user) return;

  const raw =
    typeof window !== "undefined"
      ? localStorage.getItem("user_data")
      : null;
  if (!raw || raw === "undefined" || raw === "null") return;

  try {
    const parsed = JSON.parse(raw) as User;
    if (parsed?.id) updateUser(parsed);
  } catch {
    localStorage.removeItem("user_data");
  }
}

function syncTokenToLegacyKey() {
  const { token, isAuthenticated } = useAuthStore.getState();
  if (!isAuthenticated || !token || typeof window === "undefined") return;
  localStorage.setItem("auth_token", token);
}

function AuthSessionSync() {
  const { hasHydrated, isAuthenticated, user, updateUser, logout } =
    useAuthStore();

  useEffect(() => {
    if (!hasHydrated || !isAuthenticated || user?.role) return;

    let cancelled = false;

    void getCurrentUser()
      .then((me) => {
        if (!cancelled) updateUser(me);
      })
      .catch(() => {
        if (!cancelled) logout();
      });

    return () => {
      cancelled = true;
    };
  }, [hasHydrated, isAuthenticated, user?.role, updateUser, logout]);

  return null;
}

export function AuthHydrationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const markReady = () => {
      recoverUserFromLegacyStorage();
      syncTokenToLegacyKey();
      useAuthStore.getState().setHasHydrated(true);
    };

    const persistApi = useAuthStore.persist;
    const unsubFinish = persistApi?.onFinishHydration
      ? persistApi.onFinishHydration(() => {
          markReady();
        })
      : undefined;

    void Promise.resolve(persistApi?.rehydrate?.()).finally(() => {
      if (persistApi?.hasHydrated?.()) {
        markReady();
      }
    });

    const fallback = window.setTimeout(markReady, 500);

    return () => {
      unsubFinish?.();
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <>
      <AuthSessionSync />
      {children}
    </>
  );
}
