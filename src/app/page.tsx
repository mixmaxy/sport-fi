import { HomePageContent } from "@/features/home/components/HomePageContent";
import { fetchActivities } from "@/features/activity/lib/activities.server";
import { fetchCategories } from "@/features/category/lib/categories.server";
export const revalidate = 300;

export default async function HomePage() {
  const [categories, activities] = await Promise.all([
    fetchCategories(),
    fetchActivities(),
  ]);

  return <HomePageContent categories={categories} activities={activities} />;
}
