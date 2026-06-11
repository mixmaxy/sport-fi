"use client";

import useSWR, { mutate } from "swr";
import { getCurrentUser } from "@/features/auth/lib/auth.client";
import { getActivitiesPage } from "@/features/activity/lib/activities.client";
import type { GetActivitiesParams } from "@/features/activity/lib/activities.server";
import { getCategories, getCategoriesPage } from "@/features/category/lib/categories.client";
import type { GetCategoriesParams } from "@/features/category/lib/categories.client";
import { getMyTransactions } from "@/features/transaction/lib/transactions.client";
import {
  getCitiesByProvinceId,
  getProvinces,
} from "@/features/location/lib/locations.client";
import { getPaymentMethods } from "@/features/payment/lib/payment.client";
import { swrKeys } from "@/shared/config/swr-keys";
import { getAllTransactionsPage } from "@/features/transaction/lib/transactions.client";

export { mutate as revalidateSwr };

const defaultQueryOptions = {
  revalidateOnFocus: false, 
  shouldRetryOnError: false,
} as const;

function toQueryResult<T>(swr: ReturnType<typeof useSWR<T>>) {
  return {
    data: swr.data,
    isLoading: swr.isLoading,
    isError: !!swr.error,
    refetch: () => swr.mutate(),  
  };
}

export function useCurrentUser(enabled = true) {
  return useSWR(
    enabled ? swrKeys.me : null,
    getCurrentUser,
    { ...defaultQueryOptions, dedupingInterval: 5 * 60 * 1000 },
  );
}

export function useCategoriesList(enabled = true) {
  const swr = useSWR(
    enabled ? swrKeys.categories : null,
    getCategories,
    defaultQueryOptions,
  );
  return toQueryResult(swr);
}

export function useCategoriesPage(
  params?: GetCategoriesParams,
  enabled = true,
) {
  const swr = useSWR(
    enabled ? swrKeys.categoriesList(params) : null,
    () => getCategoriesPage(params),
    defaultQueryOptions,
  );
  return toQueryResult(swr);
}

export function useActivitiesList(
  params?: GetActivitiesParams,
  enabled = true,
) {
  const swr = useSWR(
    enabled ? swrKeys.activitiesList(params) : null,
    () => getActivitiesPage(params),
    defaultQueryOptions,
  );
  return toQueryResult(swr);
}

export function useMyTransactions(enabled = true) {
  const swr = useSWR(
    enabled ? swrKeys.myTransactions : null,
    getMyTransactions,
    { revalidateOnFocus: true, dedupingInterval: 2 * 60 * 1000 },
  );
  return toQueryResult(swr);
}

export function useAllTransactions(
  params?: {
    search?: string;
    page?: number;
    perPage?: number;
    status?: string;
    isPaginate?: boolean;
  },
  enabled = true,
) {
  const swr = useSWR(
    enabled ? swrKeys.allTransactionsList(params) : null,
    () => getAllTransactionsPage(params),
    { ...defaultQueryOptions, dedupingInterval: 30 * 1000 },
  );
  return toQueryResult(swr);
}

export function useProvinces() {
  const swr = useSWR(swrKeys.provinces, getProvinces, {
    ...defaultQueryOptions,
    dedupingInterval: 60 * 60 * 1000,
  });
  return toQueryResult(swr);
}

export function useCitiesByProvince(provinceId: string | null) {
  const swr = useSWR(
    provinceId ? swrKeys.citiesByProvince(provinceId) : null,
    () => getCitiesByProvinceId(provinceId!),
    { ...defaultQueryOptions, dedupingInterval: 60 * 60 * 1000 },
  );
  return toQueryResult(swr);
}

export function usePaymentMethods() {
  const swr = useSWR(swrKeys.paymentMethods, getPaymentMethods, {
    ...defaultQueryOptions,
    dedupingInterval: 30 * 60 * 1000,
  });
  return toQueryResult(swr);
}

/** Invalidate list caches after admin CRUD or checkout. */
export function invalidateCategories() {
  return mutate(
    (key) =>
      key === swrKeys.categories ||
      (Array.isArray(key) && key[0] === swrKeys.categories),
  );
}

export function invalidateActivities() {
  return mutate(
    (key) => Array.isArray(key) && key[0] === swrKeys.activities,
  );
}

export function invalidateMyTransactions() {
  return mutate(swrKeys.myTransactions);
}

export function invalidateCurrentUser() {
  return mutate(swrKeys.me);
}
