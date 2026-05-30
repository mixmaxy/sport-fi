import { useQuery } from '@tanstack/react-query';
import { api } from '@/config/api';
import type { ApiResponse, PaymentMethod } from '@/shared/types';

const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  const { data } = await api.get<ApiResponse<PaymentMethod[]>>(
    '/payment-methods'
  );
  return data.data;
};

export const usePaymentMethods = () => {
  return useQuery({
    queryKey: ['paymentMethods'],
    queryFn: getPaymentMethods,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};