import { useQuery } from '@tanstack/react-query';
import { api } from '@/config/api';
import type { ApiResponse, Province, City } from '@/shared/types';

const getProvinces = async (): Promise<Province[]> => {
  const { data } = await api.get<ApiResponse<Province[]>>(
    '/location/provinces'
  );
  return data.data;
};

const getCities = async (): Promise<City[]> => {
  const { data } = await api.get<ApiResponse<City[]>>(
    '/location/cities'
  );
  return data.data;
};

const getCitiesByProvinceId = async (provinceId: string): Promise<City[]> => {
  const { data } = await api.get<ApiResponse<City[]>>(
    `/location/cities-by-province/${provinceId}`
  );
  return data.data;
};

export const useProvinces = () => {
  return useQuery({
    queryKey: ['provinces'],
    queryFn: getProvinces,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

export const useCities = () => {
  return useQuery({
    queryKey: ['cities'],
    queryFn: getCities,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000,
  });
};

export const useCitiesByProvince = (provinceId: string | null) => {
  return useQuery({
    queryKey: ['cities', 'province', provinceId],
    queryFn: () => getCitiesByProvinceId(provinceId!),
    enabled: !!provinceId,
    staleTime: 60 * 60 * 1000,
  });
};