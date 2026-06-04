import { unwrapApiResult } from "@/shared/config/api-envelope";

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

export const PUBLIC_REVALIDATE = 300; // 5 minutes ISR

type SearchParams = Record<string, string | undefined>;

function buildUrl(path: string, params?: SearchParams): string {
  if (!API_BASE) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not configured");
  }
  const url = new URL(path.replace(/^\//, ""), API_BASE.endsWith("/") ? API_BASE : `${API_BASE}/`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value) url.searchParams.set(key, value);
    }
  }
  return url.toString();
}

export async function serverFetch<T>(
  path: string,
  options?: {
    params?: SearchParams;
    revalidate?: number;
    tags?: string[];
  },
): Promise<T> {
  const res = await fetch(buildUrl(path, options?.params), {
    next: {
      revalidate: options?.revalidate ?? PUBLIC_REVALIDATE,
      tags: options?.tags,
    },
  });

  if (!res.ok) {
    throw new Error(`API ${path} failed: ${res.status}`);
  }

  const body = await res.json();
  return unwrapApiResult<T>(body);
}
