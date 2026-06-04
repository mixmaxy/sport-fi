import { CheckoutClient } from "@/features/checkout/components/CheckoutClient";
import { fetchPaymentMethods } from "@/features/payment/lib/payment.server";

export const revalidate = 1800;

export default async function CheckoutPage() {
  const paymentMethods = await fetchPaymentMethods();
  return <CheckoutClient paymentMethods={paymentMethods} />;
}
