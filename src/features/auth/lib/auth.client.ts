import { api, clientGet, clientPost } from "@/shared/config/api";
import { mapUserFromApi } from "@/features/auth/lib/auth.mapper";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UpdateUserRequest,
  User,
} from "@/shared/types";

type LoginApiPayload = {
  token: string;
  name?: string;
  email?: string;
  user?: unknown;
};

function persistAuthToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token);
  }
}

function hasUserRole(user: unknown): user is User {
  return (
    !!user &&
    typeof user === "object" &&
    "role" in user &&
    typeof (user as User).role === "string"
  );
}

async function resolveAuthResponse(
  payload: LoginApiPayload,
): Promise<AuthResponse> {
  const token = payload.token;
  persistAuthToken(token);

  if (hasUserRole(payload.user)) {
    return { token, user: mapUserFromApi(payload.user) };
  }

  const me = await getCurrentUser();
  return { token, user: me };
}

export async function loginUser(
  credentials: LoginRequest,
): Promise<AuthResponse> {
  const payload = await clientPost<LoginApiPayload>("/login", credentials);
  return resolveAuthResponse(payload);
}

export async function registerUser(
  userData: RegisterRequest,
): Promise<AuthResponse> {
  const { role, passwordRepeat, phoneNumber, name, email, password } = userData;
  const payload = await clientPost<LoginApiPayload>("/register", {
    name,
    email,
    password,
    c_password: passwordRepeat,
    phone_number: phoneNumber,
    role: role ?? "user",
  });
  return resolveAuthResponse(payload);
}

export async function getCurrentUser(): Promise<User> {
  const raw = await clientGet<unknown>("/me");
  return mapUserFromApi(raw);
}

export async function updateUserProfile(args: {
  id: string;
  data: UpdateUserRequest;
}): Promise<User> {
  const raw = await clientPost<unknown>(`/update-user/${args.id}`, args.data);
  return mapUserFromApi(raw);
}

export async function logoutUser(): Promise<void> {
  const { data: body } = await api.post("/logout");

  if (
    body &&
    typeof body === "object" &&
    "error" in body &&
    (body as { error?: boolean }).error
  ) {
    throw new Error(
      String((body as { message?: string }).message ?? "Logout gagal"),
    );
  }
}
