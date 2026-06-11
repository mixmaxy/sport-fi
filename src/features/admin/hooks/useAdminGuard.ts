"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
  const { user, isAuthenticated } = useAuthStore();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!isAuthenticated) {
      const loginUrl = loginRedirect ?? `/login?redirect=${redirectPath}`;
      router.push(loginUrl);
      return;
    }
    if (user && user.role !== "admin") {
      toast.error("Akses ditolak. Halaman ini hanya untuk Administrator.");
      router.push("/");
    }
  }, [user, isAuthenticated, router, redirectPath, loginRedirect]);

  return { user, isAuthenticated, isAdmin };
}
