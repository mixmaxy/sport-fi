import Link from "next/link";
import Image from "next/image";
import { fetchCategories } from "@/features/category/lib/categories.server";
import { PageShell } from "@/shared/components/layout/PageShell";
import {
  getCategoryImageUrl,
  skipImageOptimization,
} from "@/shared/utils/images";

export const revalidate = 300;

export default async function CategoriesPage() {
  const categories = await fetchCategories();

  return (
    <PageShell>
      <header className="mb-8 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-on-surface">
          Sport Categories
        </h1>
        <p className="text-lg text-on-surface-variant">
          Pick a category to browse available venues
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/activities?category=${cat.id}`}
            className="group"
          >
            <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm transition-shadow hover:shadow-md">
              <div className="relative h-28 overflow-hidden bg-surface-container-low sm:h-36">
                <Image
                  src={getCategoryImageUrl(cat.imageUrl)}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  unoptimized={skipImageOptimization(
                    getCategoryImageUrl(cat.imageUrl),
                  )}
                />
              </div>
              <div className="p-3 text-center">
                <h2 className="text-sm font-semibold text-on-surface transition-colors group-hover:text-primary">
                  {cat.name}
                </h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
