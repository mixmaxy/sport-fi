import { clientGet } from "@/shared/config/api";
import type { PaymentMethod } from "@/shared/types";

const FALLBACK_LOGOS: Array<{ match: RegExp; url: string }> = [
  {
    match: /\bbca\b/i,
    url: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Bank_Central_Asia.svg",
  },
  {
    match: /\bbri\b/i,
    url: "https://upload.wikimedia.org/wikipedia/commons/2/2e/BRI_2020.svg",
  },
  {
    match: /\bmandiri\b/i,
    url: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg",
  },
  {
    match: /\bbni\b/i,
    url: "https://upload.wikimedia.org/wikipedia/commons/4/4b/BNI_logo.svg",
  },
  {
    match: /\bpermata\b/i,
    url: "https://upload.wikimedia.org/wikipedia/commons/5/55/Bank_Permata_logo.svg",
  },
];

function withFallbackLogo(pm: PaymentMethod): PaymentMethod {
  if (pm.imageUrl && pm.imageUrl.trim()) return pm;
  const found = FALLBACK_LOGOS.find((x) => x.match.test(pm.name));
  return { ...pm, imageUrl: found?.url ?? pm.imageUrl };
}

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  const list = await clientGet<PaymentMethod[]>("/payment-methods");
  return list.map(withFallbackLogo);
}
