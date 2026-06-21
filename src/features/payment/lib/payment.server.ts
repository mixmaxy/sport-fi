import { serverFetch } from "@/shared/config/server-fetch";
import { normalizePaymentMethods } from "@/features/payment/lib/payment.mapper";
import type { PaymentMethod } from "@/shared/types";

export async function fetchPaymentMethods(): Promise<PaymentMethod[]> {
  const list = await serverFetch<unknown>("/payment-methods", {
    tags: ["payment-methods"],
    revalidate: 1800,
  });
  return normalizePaymentMethods(list);
}
