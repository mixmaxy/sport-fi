import type { GetActivitiesParams } from "@/features/activity/lib/activities.server";

/** SWR cache keys — must match between hooks and mutate() invalidation. */
export const swrKeys = {
  me: "/me",
  categories: "/sport-categories",
  activities: "/sport-activities",
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
  }) =>
    [
      "/all-transaction",
      params?.search ?? "",
      params?.page ?? "",
      params?.perPage ?? "",
    ] as const,
  provinces: "/location/provinces",
  citiesByProvince: (provinceId: string) =>
    `/location/cities/${provinceId}` as const,
  paymentMethods: "/payment-methods",
} as const;
