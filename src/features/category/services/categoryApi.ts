import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, getErrorMessage } from '@/config/api';
import type {
  ApiResponse,
  SportCategory,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/shared/types';

const getCategories = async (): Promise<SportCategory[]> => {
  const { data } = await api.get<ApiResponse<SportCategory[]>>(
    '/sport-categories'
  );
  return data.data;
};

const createCategory = async (categoryData: CreateCategoryRequest): Promise<SportCategory> => {
  const { data } = await api.post<ApiResponse<SportCategory>>(
    '/sport-categories/create',
    categoryData
  );
  return data.data;
};

const updateCategory = async ({
  id,
  ...categoryData
}: UpdateCategoryRequest & { id: string }): Promise<SportCategory> => {
  const { data } = await api.post<ApiResponse<SportCategory>>(
    `/sport-categories/update/${id}`,
    categoryData
  );
  return data.data;
};

const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/sport-categories/delete/${id}`);
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      console.error('Create category error:', getErrorMessage(error));
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      console.error('Update category error:', getErrorMessage(error));
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      console.error('Delete category error:', getErrorMessage(error));
    },
  });
};