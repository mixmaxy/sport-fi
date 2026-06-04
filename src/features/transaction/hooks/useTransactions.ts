"use client";

import {
  cancelTransaction,
  createTransaction,
  updateProofPayment,
  updateTransactionStatus,
} from "@/features/transaction/lib/transactions.client";
import {
  invalidateMyTransactions,
  useMyTransactions,
} from "@/shared/config/client-fetch";
import { useMutationWithInvalidation } from "@/shared/hooks/useMutationWithInvalidation";

export { useMyTransactions };

export function useCreateTransaction() {
  return useMutationWithInvalidation(
    createTransaction,
    invalidateMyTransactions,
  );
}

export function useCancelTransaction() {
  return useMutationWithInvalidation(
    cancelTransaction,
    invalidateMyTransactions,
  );
}

export function useUpdateProofPayment() {
  return useMutationWithInvalidation(
    updateProofPayment,
    invalidateMyTransactions,
  );
}

export function useUpdateTransactionStatus() {
  return useMutationWithInvalidation(
    updateTransactionStatus,
    invalidateMyTransactions,
  );
}
