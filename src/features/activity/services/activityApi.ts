import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, getErrorMessage } from '@/config/api';
import type {
  ApiResponse,
  SportActivity,
  CreateActivityRequest,
  UpdateActivityRequest,
} from '@/shared/types';

interface GetActivitiesParams {
  categoryId?: string;
  province?: string;
  city?: string;
  search?: string;
}

const getActivities = async (params?: GetActivitiesParams): Promise<SportActivity[]> => {
  const { data } = await api.get<ApiResponse<SportActivity[]>>(
    '/sport-activities',
    { params }
  );
  return data.data;
};

const getActivityById = async (id: string): Promise<SportActivity> => {
  const { data } = await api.get<ApiResponse<SportActivity>>(
    `/sport-activities/${id}`
  );
  return data.data;
};

const createActivity = async (activityData: CreateActivityRequest): Promise<SportActivity> => {
  const { data } = await api.post<ApiResponse<SportActivity>>(
    '/sport-activities/create',
    activityData
  );
  return data.data;
};

const updateActivity = async ({
  id,
  ...activityData
}: UpdateActivityRequest & { id: string }): Promise<SportActivity> => {
  const { data } = await api.post<ApiResponse<SportActivity>>(
    `/sport-activities/update/${id}`,
    activityData
  );
  return data.data;
};

const deleteActivity = async (id: string): Promise<void> => {
  await api.delete(`/sport-activities/delete/${id}`);
};

export const useActivities = (params?: GetActivitiesParams) => {
  return useQuery({
    queryKey: ['activities', params],
    queryFn: () => getActivities(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useActivityDetail = (id: string) => {
  return useQuery({
    queryKey: ['activity', id],
    queryFn: () => getActivityById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
    onError: (error) => {
      console.error('Create activity error:', getErrorMessage(error));
    },
  });
};

export const useUpdateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateActivity,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['activity', data.id] });
    },
    onError: (error) => {
      console.error('Update activity error:', getErrorMessage(error));
    },
  });
};

export const useDeleteActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
    onError: (error) => {
      console.error('Delete activity error:', getErrorMessage(error));
    },
  });
};

export const usePrefetchActivity = () => {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: ['activity', id],
      queryFn: () => getActivityById(id),
      staleTime: 5 * 60 * 1000,
    });
  };
};