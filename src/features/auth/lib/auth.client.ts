/* eslint-disable @typescript-eslint/no-unused-vars */
import { clientGet, clientPost } from "@/shared/config/api";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UpdateUserRequest,
  User,
} from "@/shared/types";

export async function loginUser(
  credentials: LoginRequest,
): Promise<AuthResponse> {
  return clientPost<AuthResponse>("/login", credentials);
}

export async function registerUser(
  userData: RegisterRequest,
): Promise<AuthResponse> {
  const { role, ...safeUserData } = userData;
  return clientPost<AuthResponse>("/register", safeUserData);
}

export async function getCurrentUser(): Promise<User> {
  return clientGet<User>("/me");
}

export async function updateUserProfile(args: {
  id: string;
  data: UpdateUserRequest;
}): Promise<User> {
  return clientPost<User>(`/update-user/${args.id}`, args.data);
}

export async function logoutUser(): Promise<void> {
  await clientGet<void>("/logout");
}
