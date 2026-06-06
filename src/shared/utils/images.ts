export const PLACEHOLDER_ACTIVITY_IMAGE = "/placeholder.svg";
export const PLACEHOLDER_CATEGORY_IMAGE = "/placeholder.svg";

function isValidImageUrl(url?: string | null): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  return (
    trimmed.length > 0 && trimmed !== "undefined" && trimmed !== "null"
  );
}

/** Local SVG placeholders should skip Next.js image optimization. */
export function isLocalPlaceholderImage(url: string): boolean {
  return url.startsWith("/") && url.endsWith(".svg");
}

/** Returns first valid activity image URL or local placeholder. */
export function getActivityImageUrl(
  imageUrls?: string[] | null,
  index = 0,
): string {
  const url = imageUrls?.[index];
  return isValidImageUrl(url) ? url!.trim() : PLACEHOLDER_ACTIVITY_IMAGE;
}

/** Returns category image URL or shared placeholder. */
export function getCategoryImageUrl(imageUrl?: string | null): string {
  return isValidImageUrl(imageUrl)
    ? imageUrl!.trim()
    : PLACEHOLDER_CATEGORY_IMAGE;
}
