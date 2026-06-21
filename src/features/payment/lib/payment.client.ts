import { clientGet } from "@/shared/config/api";
import { normalizePaymentMethods } from "@/features/payment/lib/payment.mapper";
import type { PaymentMethod } from "@/shared/types";

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  const list = await clientGet<unknown>("/payment-methods");
  return normalizePaymentMethods(list);
}
