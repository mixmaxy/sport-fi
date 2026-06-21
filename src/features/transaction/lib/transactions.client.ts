import { api, clientGet, clientPost } from "@/shared/config/api";
import { unwrapPaginatedResult } from "@/shared/config/api-envelope";
import { normalizeTransaction } from "@/features/transaction/lib/transactions.mapper";
import type {
  CreateTransactionRequest,
  PaginatedResponse,
  Transaction,
  UpdateProofPaymentRequest,
  UpdateStatus,
} from "@/shared/types";

export async function createTransaction(
  transactionData: CreateTransactionRequest,
): Promise<Transaction> {
  const first = transactionData.transactionItems[0];
  const sportActivityId = Number(first?.sportActivityId);
  const paymentMethodId = Number(transactionData.paymentMethodId);

  if (!sportActivityId || Number.isNaN(sportActivityId)) {
    throw new Error(
      "Aktivitas tidak valid. Kosongkan keranjang dan pilih venue ulang.",
    );
  }
  if (!paymentMethodId || Number.isNaN(paymentMethodId)) {
    throw new Error("Metode pembayaran tidak valid.");
  }

  const raw = await clientPost<unknown>("/transaction/create", {
    sport_activity_id: sportActivityId,
    payment_method_id: paymentMethodId,
  });
  return normalizeTransaction(raw as Record<string, unknown>);
}

export async function getMyTransactions(): Promise<Transaction[]> {
  const { data: body } = await api.get("/my-transaction", {
    params: { per_page: 100, page: 1 },
  });
  const page = unwrapPaginatedResult<Record<string, unknown>>(body);
  const transactions = page.data.map((item) => normalizeTransaction(item));

  return transactions.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function getTransactionById(
  transactionId: string,
): Promise<Transaction> {
  const raw = await clientGet<unknown>(`/transaction/${transactionId}`);
  return normalizeTransaction(raw as Record<string, unknown>);
}

export async function getAllTransactionsPage(params?: {
  search?: string;
  page?: number;
  perPage?: number;
  status?: string;
  isPaginate?: boolean;
}): Promise<PaginatedResponse<Transaction>> {
  const { data: body } = await api.get("/all-transaction", {
    params: {
      is_paginate: params?.isPaginate ?? true,
      per_page: params?.perPage ?? 5,
      page: params?.page ?? 1,
      search: params?.search || undefined,
      status: params?.status || undefined,
    },
  });
  const page = unwrapPaginatedResult<Record<string, unknown>>(body);
  return {
    ...page,
    data: page.data.map((item) => normalizeTransaction(item)),
  };
}

export async function updateProofPayment(
  payload: UpdateProofPaymentRequest,
): Promise<void> {
  const { transactionId, proofPaymentUrl } = payload;
  const { data: body } = await api.post(
    `/transaction/update-proof-payment/${transactionId}`,
    { proof_payment_url: proofPaymentUrl },
  );

  if (
    body &&
    typeof body === "object" &&
    "error" in body &&
    (body as { error?: boolean }).error
  ) {
    throw new Error(
      String((body as { message?: string }).message ?? "Update proof gagal"),
    );
  }
}

export async function cancelTransaction(
  transactionId: string,
): Promise<Transaction> {
  const { data: body } = await api.post(`/transaction/cancel/${transactionId}`);

  if (
    body &&
    typeof body === "object" &&
    "error" in body &&
    (body as { error?: boolean }).error
  ) {
    throw new Error(
      String((body as { message?: string }).message ?? "Cancel gagal"),
    );
  }

  return getTransactionById(transactionId);
}

export async function updateTransactionStatus(
  payload: UpdateStatus,
): Promise<void> {
  const { transactionId, status } = payload;
  const { data: body } = await api.post(
    `/transaction/update-status/${transactionId}`,
    { status },
  );

  if (
    body &&
    typeof body === "object" &&
    "error" in body &&
    (body as { error?: boolean }).error
  ) {
    throw new Error(
      String((body as { message?: string }).message ?? "Update status gagal"),
    );
  }
}
