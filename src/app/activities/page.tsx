import { ActivitiesPageClient } from "@/features/activity/components/ActivitiesPageClient";
import { fetchActivities } from "@/features/activity/lib/activities.server";
import { fetchCategories } from "@/features/category/lib/categories.server";
import { fetchProvinces } from "@/features/location/lib/locations.server";
export const revalidate = 300;

interface ActivitiesPageProps {
  searchParams: Promise<{
    category?: string;
    cityId?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function ActivitiesPage({
  searchParams,
}: ActivitiesPageProps) {
  const params = await searchParams;
  const initialFilters = {
    sportCategoryId: params.category,
    cityId: params.cityId,
    search: params.search,
    page: params.page ? Number(params.page) : 1,
    perPage: 5,
    isPaginate: false,
  };

  const [initialActivities, categories, provinces] = await Promise.all([
    fetchActivities(initialFilters),
    fetchCategories(),
    fetchProvinces(),
  ]);

  return (
    <ActivitiesPageClient
      initialActivities={initialActivities}
      categories={categories}
      provinces={provinces}
      initialFilters={initialFilters}
    />
  );
}
