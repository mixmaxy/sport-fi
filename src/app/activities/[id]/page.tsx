import { notFound } from "next/navigation";
import { ActivityDetailClient } from "@/features/activity/components/ActivityDetailClient";
import { fetchActivityById } from "@/features/activity/lib/activities.server";
import type { SportActivity } from "@/shared/types";

export const revalidate = 300;

interface ActivityDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getActivityById(id: string): Promise<SportActivity> {
  try {
    return await fetchActivityById(id);
  } catch {
    notFound();
  }
}

export async function generateMetadata({ params }: ActivityDetailPageProps) {
  const { id } = await params;
  try {
    const activity = await fetchActivityById(id);
    return { title: activity.title };
  } catch {
    return { title: "Detail Aktivitas" };
  }
}

export default async function ActivityDetailPage({
  params,
}: ActivityDetailPageProps) {
  const { id } = await params;
  const activity = await getActivityById(id);

  return <ActivityDetailClient activity={activity} />;
}
