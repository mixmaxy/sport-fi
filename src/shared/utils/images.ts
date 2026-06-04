export const PLACEHOLDER_ACTIVITY_IMAGE = "/placeholder.svg";

/** Returns first valid activity image URL or local placeholder. */
export function getActivityImageUrl(
  imageUrls?: string[] | null,
  index = 0,
): string {
  const url = imageUrls?.[index]?.trim();
  return url || PLACEHOLDER_ACTIVITY_IMAGE;
}
