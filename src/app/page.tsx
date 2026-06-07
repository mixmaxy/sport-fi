import { HomePageContent } from "@/features/home/components/HomePageContent";
import { fetchActivities } from "@/features/activity/lib/activities.server";
import { fetchCategories } from "@/features/category/lib/categories.server";
import { fetchProvinces } from "@/features/location/lib/locations.server";
export const revalidate = 300;

export default async function HomePage() {
  const [categories, activities, provinces] = await Promise.all([
    fetchCategories(),
    fetchActivities(),
    fetchProvinces(),
  ]);

  return (
    <HomePageContent
      categories={categories}
      activities={activities}
      provinces={provinces}
    />
  );
}
