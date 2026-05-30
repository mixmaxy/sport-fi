import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, getErrorMessage } from '@/config/api';
import type {
  ApiResponse,
  Transaction,
  CreateTransactionRequest,
  UpdateProofPaymentRequest,
  UpdateStatus,
} from '@/shared/types';

/**
 * Transaction API Service
 * 
 * Endpoints:
 * - POST /create-transaction - Create new transaction
 * - GET /my-transactions - Get user's transactions
 * - POST /update-proof-payment/:id - Upload payment proof
 * - POST /cancel-transaction/:id - Cancel transaction
 */

// ==========================================
// API Functions
// ==========================================

const createTransaction = async (
  transactionData: CreateTransactionRequest
): Promise<Transaction> => {
  const { data } = await api.post<ApiResponse<Transaction>>(
    '/transaction/create',
    transactionData
  );
  return data.data;
};

const getMyTransactions = async (): Promise<Transaction[]> => {
  const { data } = await api.get<ApiResponse<Transaction[]>>(
    '/my-transaction'
  );
  return data.data;
};

const getAllTransactions = async (): Promise<Transaction[]> => {
  const { data } = await api.get<ApiResponse<Transaction[]>>(
    '/all-transaction'
  );
  return data.data;
};

const getTransactionById = async (transactionId: string): Promise<Transaction[]> => {
  const { data } = await api.get<ApiResponse<Transaction[]>>(
    `/transaction/${transactionId}`
  );
  return data.data;
};

const updateProofPayment = async ({
  transactionId,
  proofPaymentUrl,
}: UpdateProofPaymentRequest): Promise<Transaction> => {
  const { data } = await api.post<ApiResponse<Transaction>>(
    `/transaction/update-proof-payment/${transactionId}`,
    { proofPaymentUrl }
  );
  return data.data;
};

const updateStatus = async ({
  transactionId,
  status,
}: UpdateStatus): Promise<Transaction> => {
  const { data } = await api.post<ApiResponse<Transaction>>(
    `/transaction/update-status/${transactionId}`,
    { status }
  );
  return data.data;
};

const cancelTransaction = async (transactionId: string): Promise<Transaction> => {
  const { data } = await api.post<ApiResponse<Transaction>>(
    `/transaction/cancel/${transactionId}`
  );
  return data.data;
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      // Invalidate transactions to show new transaction
      queryClient.invalidateQueries({ queryKey: ['myTransactions'] });
    },
    onError: (error) => {
      console.error('Create transaction error:', getErrorMessage(error));
    },
  });
};

export const useMyTransactions = () => {
  return useQuery({
    queryKey: ['myTransactions'],
    queryFn: getMyTransactions,
    staleTime: 2 * 60 * 1000, // 2 minutes - needs fresh data
    refetchOnWindowFocus: true, // Refetch when user returns to tab
  });
};

export const useAllTransactions = () => {
  return useQuery({
    queryKey: ['allTransactions'],
    queryFn: getAllTransactions,
    staleTime: 2 * 60 * 1000, // 2 minutes - needs fresh data
    refetchOnWindowFocus: true, // Refetch when user returns to tab
  });
};

export const useTransactionById = (transactionId: string) => {
  return useQuery({
    queryKey: ['transactionById', transactionId],
    queryFn: () => getTransactionById(transactionId),
    staleTime: 2 * 60 * 1000, // 2 minutes - needs fresh data
    refetchOnWindowFocus: true, // Refetch when user returns to tab
  });
};

export const useUpdateProofPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProofPayment,
    onSuccess: () => {
      // Refetch transactions to show updated proof
      queryClient.invalidateQueries({ queryKey: ['myTransactions'] });
    },
    onError: (error) => {
      console.error('Update proof payment error:', getErrorMessage(error));
    },
  });
};

export const useUpdateStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStatus,
    onSuccess: () => {
      // Refetch transactions to show updated status
      queryClient.invalidateQueries({ queryKey: ['myTransactions'] });
    },
    onError: (error) => {
      console.error('Update status error:', getErrorMessage(error));
    },
  });
};

export const useCancelTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelTransaction,
    onSuccess: () => {
      // Refetch transactions to show cancelled status
      queryClient.invalidateQueries({ queryKey: ['myTransactions'] });
    },
    onError: (error) => {
      console.error('Cancel transaction error:', getErrorMessage(error));
    },
  });
};