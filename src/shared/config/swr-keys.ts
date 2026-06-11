import type { GetActivitiesParams } from "@/features/activity/lib/activities.server";
import type { GetCategoriesParams } from "@/features/category/lib/categories.client";

/** SWR cache keys — must match between hooks and mutate() invalidation. */
export const swrKeys = {
  me: "/me",
  categories: "/sport-categories",
  categoriesList: (params?: GetCategoriesParams) =>
    [
      "/sport-categories",
      params?.page ?? "",
      params?.perPage ?? "",
      params?.isPaginate ?? "",
    ] as const,  activities: "/sport-activities",
  activitiesList: (params?: GetActivitiesParams) =>
    [
      "/sport-activities",
      params?.sportCategoryId ?? "",
      params?.cityId ?? "",
      params?.search ?? "",
      params?.page ?? "",
      params?.perPage ?? "",
      params?.isPaginate ?? "",
    ] as const,
  myTransactions: "/my-transaction",
  allTransactionsList: (params?: {
    search?: string;
    page?: number;
    perPage?: number;
    status?: string;
    isPaginate?: boolean;
  }) =>
    [
      "/all-transaction",
      params?.search ?? "",
      params?.page ?? "",
      params?.perPage ?? "",
      params?.status ?? "",
      params?.isPaginate ?? "",
    ] as const,
  provinces: "/location/provinces",
  citiesByProvince: (provinceId: string) =>
    `/location/cities/${provinceId}` as const,
  paymentMethods: "/payment-methods",
} as const;
