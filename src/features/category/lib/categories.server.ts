import { serverFetch } from "@/shared/config/server-fetch";
import type { SportCategory } from "@/shared/types";

function normalizeCategory(raw: Record<string, unknown>): SportCategory {
  return {
    id: String(raw.id ?? ""),
    name: String(raw.name ?? ""),
    imageUrl: String(raw.imageUrl ?? raw.image_url ?? ""),
    createdAt: String(raw.created_at ?? raw.createdAt ?? ""),
    updatedAt: String(raw.updated_at ?? raw.updatedAt ?? ""),
  };
}

export async function fetchCategories(): Promise<SportCategory[]> {
  const raw = await serverFetch<Record<string, unknown>[]>(
    "/sport-categories",
    {
      params: { is_paginate: "false" },
      tags: ["categories"],
    },
  );
  return raw.map(normalizeCategory).filter((c) => c.id && c.name);
}
