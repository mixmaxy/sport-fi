import { clientGet, clientPost } from "@/shared/config/api";
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
  return clientPost<Transaction>("/transaction/create", {
    sport_activity_id: first?.sportActivityId,
    payment_method_id: transactionData.paymentMethodId,
  });
}

export async function getMyTransactions(params?: {
  search?: string;
  page?: number;
  perPage?: number;
  isPaginate?: boolean;
}): Promise<Transaction[]> {
  return clientGet<Transaction[]>("/my-transaction", {
    params: {
      is_paginate: params?.isPaginate ?? false,
      per_page: params?.perPage ?? 5,
      page: params?.page ?? 1,
      search: params?.search,
    },
  });
}

export async function getTransactionById(
  transactionId: string,
): Promise<Transaction> {
  return clientGet<Transaction>(`/transaction/${transactionId}`);
}

export async function getAllTransactionsPage(params?: {
  search?: string;
  page?: number;
  perPage?: number;
}): Promise<PaginatedResponse<Transaction>> {
  return clientGet<PaginatedResponse<Transaction>>("/all-transaction", {
    params: {
      is_paginate: true,
      per_page: params?.perPage ?? 5,
      page: params?.page ?? 1,
      search: params?.search,
    },
  });
}

export async function updateProofPayment(
  payload: UpdateProofPaymentRequest,
): Promise<Transaction> {
  const { transactionId, proofPaymentUrl } = payload;
  return clientPost<Transaction>(
    `/transaction/update-proof-payment/${transactionId}`,
    { proofPaymentUrl },
  );
}

export async function cancelTransaction(
  transactionId: string,
): Promise<Transaction> {
  return clientPost<Transaction>(`/transaction/cancel/${transactionId}`);
}

export async function updateTransactionStatus(
  payload: UpdateStatus,
): Promise<Transaction> {
  const { transactionId, status } = payload;
  return clientPost<Transaction>(
    `/transaction/update-status/${transactionId}`,
    { status },
  );
}
