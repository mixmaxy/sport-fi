import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, getErrorMessage } from '@/config/api';
import { useAuthStore } from '@/store/useAuthStore';
import type {
    ApiResponse,
    AuthResponse,
    LoginRequest,
    RegisterRequest,
    UpdateUserRequest,
    User,
} from '@/shared/types';
import { useEffect } from 'react';

const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    const { data } = await api.post<ApiResponse<AuthResponse>>(
        '/login',
        credentials
    );
    return data.data;
};

const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
    const { data } = await api.post<ApiResponse<AuthResponse>>(
        '/register',
        userData
    );
    return data.data;
};

const getCurrentUser = async (): Promise<User> => {
    const { data } = await api.get<ApiResponse<User>>('/me');
    return data.data;
};

const updateUser = async (userData: UpdateUserRequest): Promise<User> => {
    const { data } = await api.post<ApiResponse<User>>(
        '/update-user',
        userData
    );
    return data.data;
};

const logout = async (): Promise<void> => {
    await api.get('/logout');
};

export const useLogin = () => {
    const { setAuth } = useAuthStore();

    return useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            // Save to Zustand store
            setAuth(data.user, data.token);
        },
        onError: (error) => {
            console.error('Login error:', getErrorMessage(error));
        },
    });
};

export const useRegister = () => {
    const { setAuth } = useAuthStore();

    return useMutation({
        mutationFn: register,
        onSuccess: (data) => {
            setAuth(data.user, data.token);
        },
        onError: (error) => {
            console.error('Register error:', getErrorMessage(error));
        },
    });
};

export const useCurrentUser = () => {
    const { isAuthenticated, updateUser } = useAuthStore();

    const query = useQuery({
        queryKey: ['currentUser'],
        queryFn: getCurrentUser,
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000,
    });

    useEffect(() => {
        if (query.data) {
            updateUser(query.data);
        }
    }, [query.data]);
};

export const useUpdateUser = () => {
    const { updateUser: updateUserStore } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateUser,
        onSuccess: (data) => {
            // Update Zustand store
            updateUserStore(data);

            // Invalidate and refetch current user query
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        },
        onError: (error) => {
            console.error('Update user error:', getErrorMessage(error));
        },
    });
};

/**
 * Logout Mutation Hook
 */
export const useLogout = () => {
    const { logout: logoutStore } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            // Clear Zustand store
            logoutStore();

            // Clear all cached queries
            queryClient.clear();

            // Redirect to home
            window.location.href = '/';
        },
        onError: (error) => {
            console.error('Logout error:', getErrorMessage(error));
            // Still logout locally even if API fails
            logoutStore();
            queryClient.clear();
            window.location.href = '/';
        },
    });
};