import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/shared/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasHydrated: boolean;
  setAuth: (user: User, token: string) => void;
  updateUser: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      hasHydrated: false,
      setAuth: (user, token) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_token", token);
          localStorage.setItem("user_data", JSON.stringify(user));
        }
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          hasHydrated: true,
        });
      },

      updateUser: (user) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("user_data", JSON.stringify(user));
        }
        set({ user, isAuthenticated: true });
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user_data");
        }

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          hasHydrated: true,
        });
      },
      setLoading: (loading) => set({ isLoading: loading }),
      setHasHydrated: (value) =>
        set({ hasHydrated: value, isLoading: false }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Auth store rehydrate error:", error);
        }
        // Jangan panggil useAuthStore di sini — masih dalam fase inisialisasi (TDZ).
        state?.setHasHydrated(true);
      },
    },
  ),
);

export default useAuthStore;
