import { clientDelete, clientGet, clientPost } from "@/shared/config/api";
import type {
  CreateCategoryRequest,
  SportCategory,
  UpdateCategoryRequest,
} from "@/shared/types";

function normalizeCategory(raw: Record<string, unknown>): SportCategory {
  return {
    id: String(raw.id ?? ""),
    name: String(raw.name ?? ""),
    imageUrl: String(raw.imageUrl ?? raw.image_url ?? ""),
    createdAt: String(raw.created_at ?? raw.createdAt ?? ""),
    updatedAt: String(raw.updated_at ?? raw.updatedAt ?? ""),
  };
}

export async function getCategories(): Promise<SportCategory[]> {
  const raw = await clientGet<Record<string, unknown>[]>("/sport-categories");
  return raw.map(normalizeCategory).filter((c) => c.id && c.name);
}

export async function createCategory(
  categoryData: CreateCategoryRequest,
): Promise<SportCategory> {
  return clientPost<SportCategory>("/sport-categories/create", categoryData);
}

export async function updateCategory(
  payload: UpdateCategoryRequest & { id: string },
): Promise<SportCategory> {
  const { id, ...categoryData } = payload;
  return clientPost<SportCategory>(
    `/sport-categories/update/${id}`,
    categoryData,
  );
}

export async function deleteCategory(id: string): Promise<void> {
  await clientDelete(`/sport-categories/delete/${id}`);
}
