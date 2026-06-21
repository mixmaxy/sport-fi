import type {
  Transaction,
  TransactionStatus,
} from "@/shared/types";
import { normalizeSportActivity } from "@/features/activity/lib/activities.mapper";
import { normalizePaymentMethod } from "@/features/payment/lib/payment.mapper";

type RawRecord = Record<string, unknown>;

function toRecordArray(value: unknown): RawRecord[] {
  if (Array.isArray(value)) {
    return value.filter(
      (item): item is RawRecord => !!item && typeof item === "object",
    );
  }
  if (value && typeof value === "object") {
    return [value as RawRecord];
  }
  return [];
}

function extractTransactionRecords(raw: unknown): RawRecord[] {
  if (Array.isArray(raw)) {
    return raw.filter(
      (item): item is RawRecord => !!item && typeof item === "object",
    );
  }

  if (!raw || typeof raw !== "object") return [];

  const obj = raw as RawRecord;
  const data = obj.data;

  if (Array.isArray(data)) {
    return data.filter(
      (item): item is RawRecord => !!item && typeof item === "object",
    );
  }

  if (data && typeof data === "object" && Array.isArray((data as RawRecord).data)) {
    return ((data as { data: unknown[] }).data ?? []).filter(
      (item): item is RawRecord => !!item && typeof item === "object",
    );
  }

  return [];
}

function normalizeTransactionItem(raw: RawRecord) {
  const itemTitle = raw.title ? String(raw.title) : undefined;
  const sportActivityId = raw.sport_activity_id ?? raw.sportActivityId;
  const sportActivityRaw =
    raw.sport_activity ??
    raw.sportActivity ??
    raw.sport_activities ??
    raw.sportActivities ??
    (sportActivityId ? { id: sportActivityId, title: itemTitle } : undefined);
  const sportActivity = normalizeSportActivity(
    sportActivityRaw as RawRecord | undefined,
    itemTitle,
  );

  return {
    id: String(raw.id ?? raw.transaction_item_id ?? ""),
    quantity: Number(raw.quantity ?? 1),
    price: Number(raw.price ?? 0),
    priceDiscount: Number(raw.price_discount ?? raw.priceDiscount ?? 0),
    sportActivity,
  };
}

export function normalizeTransaction(raw: RawRecord): Transaction {
  const rawItems = toRecordArray(
    raw.transaction_items ?? raw.items ?? raw.transactionItems,
  );

  const items = rawItems.map(normalizeTransactionItem);
  const paymentMethodRaw = raw.payment_method ?? raw.paymentMethod;

  return {
    id: String(raw.id ?? raw.transaction_id ?? raw.invoice_id ?? ""),
    userId: String(raw.user_id ?? raw.userId ?? ""),
    paymentMethodId: String(
      raw.payment_method_id ?? raw.paymentMethodId ?? "",
    ),
    status: String(raw.status ?? "pending").toLowerCase() as TransactionStatus,
    totalAmount: Number(raw.total_amount ?? raw.totalAmount ?? 0),
    proofPaymentUrl:
      (raw.proof_payment_url ?? raw.proofPaymentUrl ?? null) as string | null,
    transactionItems: items.map((item) => ({
      sportActivityId: String(item.sportActivity?.id ?? ""),
      quantity: item.quantity,
      price: item.price,
      priceDiscount: item.priceDiscount,
    })),
    items,
    createdAt: String(
      raw.order_date ?? raw.created_at ?? raw.createdAt ?? "",
    ),
    updatedAt: String(raw.updated_at ?? raw.updatedAt ?? raw.order_date ?? ""),
    paymentMethod:
      paymentMethodRaw && typeof paymentMethodRaw === "object"
        ? normalizePaymentMethod(paymentMethodRaw as RawRecord)
        : undefined,
  };
}

export function normalizeTransactions(raw: unknown): Transaction[] {
  return extractTransactionRecords(raw).map(normalizeTransaction);
}

export function normalizeTransactionsPage(raw: unknown): {
  data: Transaction[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
} {
  if (raw && typeof raw === "object") {
    const page = raw as {
      data?: unknown;
      current_page?: number;
      last_page?: number;
      per_page?: number;
      total?: number;
    };

    const data = extractTransactionRecords(raw).map(normalizeTransaction);
    return {
      data,
      current_page: page.current_page ?? 1,
      last_page: page.last_page ?? 1,
      per_page: page.per_page ?? data.length,
      total: page.total ?? data.length,
    };
  }

  const list = normalizeTransactions(raw);
  return {
    data: list,
    current_page: 1,
    last_page: 1,
    per_page: list.length,
    total: list.length,
  };
}
