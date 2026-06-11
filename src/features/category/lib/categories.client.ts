import { api, clientDelete, clientPost } from "@/shared/config/api";
import { unwrapPaginatedResult } from "@/shared/config/api-envelope";
import type {
  CreateCategoryRequest,
  PaginatedResponse,
  SportCategory,
  UpdateCategoryRequest,
} from "@/shared/types";

export interface GetCategoriesParams {
  page?: number;
  perPage?: number;
  isPaginate?: boolean;
}

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
  const { data: body } = await api.get("/sport-categories", {
    params: { is_paginate: false },
  });
  const page = unwrapPaginatedResult<Record<string, unknown>>(body);
  return page.data.map(normalizeCategory).filter((c) => c.id && c.name);
}

export async function getCategoriesPage(
  params?: GetCategoriesParams,
): Promise<PaginatedResponse<SportCategory>> {
  const { data: body } = await api.get("/sport-categories", {
    params: {
      is_paginate: params?.isPaginate ?? true,
      per_page: params?.perPage ?? 8,
      page: params?.page ?? 1,
    },
  });
  const page = unwrapPaginatedResult<Record<string, unknown>>(body);
  return {
    ...page,
    data: page.data.map(normalizeCategory).filter((c) => c.id && c.name),
  };
}

function toCategoryPayload(categoryData: CreateCategoryRequest) {
  return {
    name: categoryData.name,
    image_url: categoryData.imageUrl,
  };
}

export async function createCategory(
  categoryData: CreateCategoryRequest,
): Promise<SportCategory> {
  const raw = await clientPost<Record<string, unknown>>(
    "/sport-categories/create",
    toCategoryPayload(categoryData),
  );
  return normalizeCategory(raw);
}

export async function updateCategory(
  payload: UpdateCategoryRequest & { id: string },
): Promise<SportCategory> {
  const { id, ...categoryData } = payload;
  const raw = await clientPost<Record<string, unknown>>(
    `/sport-categories/update/${id}`,
    toCategoryPayload(categoryData),
  );
  return normalizeCategory(raw);
}

export async function deleteCategory(id: string): Promise<void> {
  await clientDelete(`/sport-categories/delete/${id}`);
}
