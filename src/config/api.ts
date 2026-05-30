import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from "axios";

export const api: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 30000,
});

import { useAuthStore } from "@/store/useAuthStore";

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem('auth_token');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            if (typeof window !== "undefined") {
                useAuthStore.getState().logout();
                if (!window.location.pathname.includes('/auth/login')) {
                    window.location.href = '/auth/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const responseData = (error.response?.data as any);
        if (responseData && typeof responseData === 'object' && 'message' in responseData) {
            return responseData.message as string;
        }
        return error.message;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return String(error);
};

export default api;