"use client";

import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/features/category/lib/categories.client";
import { invalidateCategories } from "@/shared/config/client-fetch";
import { useMutationWithInvalidation } from "@/shared/hooks/useMutationWithInvalidation";

export function useCreateCategory() {
  return useMutationWithInvalidation(createCategory, invalidateCategories);
}

export function useUpdateCategory() {
  return useMutationWithInvalidation(updateCategory, invalidateCategories);
}

export function useDeleteCategory() {
  return useMutationWithInvalidation(deleteCategory, invalidateCategories);
}
