/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { getErrorMessage } from "@/shared/config/api";
import { invalidateCurrentUser } from "@/shared/config/client-fetch";
import {
  loginUser,
  logoutUser,
  registerUser,
  updateUserProfile,
} from "@/features/auth/lib/auth.client";
import { useAuthStore } from "@/store/useAuthStore";
import { useMutation } from "@/shared/hooks/useMutation";
import type {
  LoginRequest,
  RegisterRequest,
  UpdateUserRequest,
} from "@/shared/types";

export function useLogin() {
  const { setAuth } = useAuthStore();
  const base = useMutation(loginUser);

  return {
    ...base,
    mutate: (
      credentials: LoginRequest,
      options?: Parameters<typeof base.mutate>[1],
    ) =>
      base.mutate(credentials, {
        ...options,
        onSuccess: (data) => {
          setAuth(data.user, data.token);
          void invalidateCurrentUser();
          options?.onSuccess?.(data);
        },
        onError: (error) => {
          console.error("Login error:", getErrorMessage(error));
          options?.onError?.(error);
        },
      }),
  };
}

export function useRegister() {
  const { setAuth } = useAuthStore();
  const base = useMutation(registerUser);

  return {
    ...base,
    mutate: (
      userData: RegisterRequest,
      options?: Parameters<typeof base.mutate>[1],
    ) =>
      base.mutate(userData, {
        ...options,
        onSuccess: (data) => {
          setAuth(data.user, data.token);
          void invalidateCurrentUser();
          options?.onSuccess?.(data);
        },
        onError: (error) => {
          console.error("Register error:", getErrorMessage(error));
          options?.onError?.(error);
        },
      }),
  };
}

export function useUpdateUser() {
  const { updateUser: updateUserStore } = useAuthStore();
  const base = useMutation(updateUserProfile);

  return {
    ...base,
    mutate: (
      args: { id: string; data: UpdateUserRequest },
      options?: Parameters<typeof base.mutate>[1],
    ) =>
      base.mutate(args, {
        ...options,
        onSuccess: (data) => {
          updateUserStore(data);
          void invalidateCurrentUser();
          options?.onSuccess?.(data);
        },
        onError: (error) => {
          console.error("Update user error:", getErrorMessage(error));
          options?.onError?.(error);
        },
      }),
  };
}

export function useLogout() {
  const { logout: logoutStore } = useAuthStore();
  const base = useMutation(async (_?: unknown) => {
    await logoutUser();
  });

  return {
    ...base,
    mutate: (options?: Parameters<typeof base.mutate>[1]) =>
      base.mutate(undefined as unknown, {
        ...options,
        onSuccess: () => {
          logoutStore();
          void invalidateCurrentUser();
          window.location.href = "/";
          options?.onSuccess?.(undefined);
        },
        onError: (error) => {
          console.error("Logout error:", getErrorMessage(error));
          logoutStore();
          void invalidateCurrentUser();
          window.location.href = "/";
          options?.onError?.(error);
        },
      }),
  };
}
