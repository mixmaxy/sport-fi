import type { PaymentMethod } from "@/shared/types";

type RawRecord = Record<string, unknown>;

const PAYMENT_LOGO_BY_BANK: Array<{ match: RegExp; url: string }> = [
  {
    match: /\bbca\b/i,
    url: "https://dibimbing-cdn.sgp1.cdn.digitaloceanspaces.com/bca-logo.svg",
  },
  {
    match: /\bbri\b/i,
    url: "https://dibimbing-cdn.sgp1.cdn.digitaloceanspaces.com/bri-logo.svg",
  },
  {
    match: /\bmandiri\b/i,
    url: "https://dibimbing-cdn.sgp1.cdn.digitaloceanspaces.com/mandiri-logo.svg",
  },
  {
    match: /\bbni\b/i,
    url: "https://dibimbing-cdn.sgp1.cdn.digitaloceanspaces.com/bni-logo.svg",
  },
];

function resolvePaymentLogo(name: string, apiImageUrl?: string): string {
  const known = PAYMENT_LOGO_BY_BANK.find((entry) => entry.match.test(name));
  if (known) return known.url;

  const trimmed = apiImageUrl?.trim() ?? "";
  return trimmed.length > 0 && trimmed !== "undefined" && trimmed !== "null"
    ? trimmed
    : "";
}

export function normalizePaymentMethod(raw: RawRecord): PaymentMethod {
  const name = String(raw.name ?? raw.payment_method_name ?? "");

  return {
    id: String(raw.id ?? raw.payment_method_id ?? ""),
    name,
    imageUrl: resolvePaymentLogo(
      name,
      String(raw.image_url ?? raw.imageUrl ?? ""),
    ),
    accountNumber: String(
      raw.virtual_account_number ??
        raw.account_number ??
        raw.accountNumber ??
        "",
    ),
    accountName: String(
      raw.virtual_account_name ?? raw.account_name ?? raw.accountName ?? "",
    ),
    createdAt: String(raw.created_at ?? raw.createdAt ?? ""),
    updatedAt: String(raw.updated_at ?? raw.updatedAt ?? ""),
  };
}

export function normalizePaymentMethods(raw: unknown): PaymentMethod[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item): item is RawRecord => !!item && typeof item === "object")
    .map(normalizePaymentMethod);
}
