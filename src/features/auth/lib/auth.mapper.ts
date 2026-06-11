import type { User } from "@/shared/types";

export function mapUserFromApi(raw: unknown): User {
  const record =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

  return {
    id: String(record.id ?? ""),
    name: String(record.name ?? ""),
    email: String(record.email ?? ""),
    phoneNumber: String(record.phone_number ?? record.phoneNumber ?? ""),
    role: record.role === "admin" ? "admin" : "user",
    createdAt: String(record.created_at ?? record.createdAt ?? ""),
    updatedAt: String(record.updated_at ?? record.updatedAt ?? ""),
  };
}
