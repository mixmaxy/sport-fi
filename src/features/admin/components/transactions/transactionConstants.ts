import type { TransactionStatus } from "@/shared/types";

export type AdminTransactionStatusTab = Extract<
  TransactionStatus,
  "pending" | "success" | "cancelled"
>;

export const admin_transaction_status_tab_meta: {
  id: AdminTransactionStatusTab;
  label: string;
}[] = [
  { id: "pending", label: "Menunggu" },
  { id: "success", label: "Berhasil" },
  { id: "cancelled", label: "Dibatalkan" },
];

export const admin_transaction_status_tab_labels: Record<string, string> = {
  pending: "Menunggu",
  success: "Berhasil",
  cancelled: "Dibatalkan",
  failed: "Ditolak",
};

export const admin_transaction_empty_message: Record<
  AdminTransactionStatusTab,
  string
> = {
  pending: "Tidak ada transaksi yang menunggu verifikasi.",
  success: "Tidak ada transaksi berhasil.",
  cancelled: "Tidak ada transaksi yang dibatalkan.",
};
