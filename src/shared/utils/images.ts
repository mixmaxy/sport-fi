export const placeholderActivityImage = "/placeholder.svg";
export const placeholderCategoryImage = "/placeholder.svg";

/** Dummy sport photos when API has no activity images (Unsplash, allowed in next.config). */
const dummyActivityImages = [
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80",
] as const;

function isValidImageUrl(url?: string | null): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  return (
    trimmed.length > 0 && trimmed !== "undefined" && trimmed !== "null"
  );
}

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/** Stable dummy image per activity id/title so cards look varied. */
export function getDummyActivityImage(seed = "activity"): string {
  const index = hashSeed(seed) % dummyActivityImages.length;
  return dummyActivityImages[index];
}

export function isDummyActivityImage(url: string): boolean {
  return dummyActivityImages.some((dummy) => dummy === url);
}

/** Local SVG placeholders should skip Next.js image optimization. */
export function isLocalPlaceholderImage(url: string): boolean {
  return url.startsWith("/") && url.endsWith(".svg");
}

/** Returns activity image URL, or a dummy photo when API has none. */
export function getActivityImageUrl(
  imageUrls?: string[] | null,
  index = 0,
  seed?: string,
): string {
  const url = imageUrls?.[index];
  if (isValidImageUrl(url)) return url!.trim();
  return getDummyActivityImage(seed ? `${seed}-${index}` : `activity-${index}`);
}

/** Hostnames allowed in next.config `images.remotePatterns`. */
function isAllowedRemoteImageHost(hostname: string): boolean {
  if (hostname === "localhost" || hostname === "127.0.0.1") return true;

  const allowedExact = new Set([
    "placehold.co",
    "lh3.googleusercontent.com",
    "images.unsplash.com",
    "dibimbing-cdn.sgp1.cdn.digitaloceanspaces.com",
  ]);
  if (allowedExact.has(hostname)) return true;

  return (
    hostname.endsWith(".dibimbing.id") ||
    hostname.endsWith(".digitaloceanspaces.com")
  );
}

function isSvgImageUrl(url: string): boolean {
  try {
    return new URL(url).pathname.toLowerCase().endsWith(".svg");
  } catch {
    return url.toLowerCase().includes(".svg");
  }
}

/** True when Next.js Image should use unoptimized (placeholder, blob, or unknown host). */
export function skipImageOptimization(url: string): boolean {
  if (isLocalPlaceholderImage(url)) return true;
  if (isSvgImageUrl(url)) return true;
  if (url.startsWith("data:") || url.startsWith("blob:")) return true;

  try {
    const { hostname } = new URL(url);
    return !isAllowedRemoteImageHost(hostname);
  } catch {
    return true;
  }
}

/** Returns category image URL or shared placeholder. */
export function getCategoryImageUrl(imageUrl?: string | null): string {
  return isValidImageUrl(imageUrl)
    ? imageUrl!.trim()
    : placeholderCategoryImage;
}
