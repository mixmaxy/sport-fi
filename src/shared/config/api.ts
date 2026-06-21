import axios, {
    AxiosInstance,
    InternalAxiosRequestConfig,
    AxiosError,
    AxiosRequestConfig,
} from "axios";
import { unwrapApiResult } from "@/shared/config/api-envelope";

export { unwrapApiResult };

export const api: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 30000,
});

import { useAuthStore } from "@/store/useAuthStore";
import { ApiResponse } from "@/shared/types";

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem('auth_token');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        // FormData: hapus Content-Type default agar axios set boundary multipart.
        if (config.data instanceof FormData && config.headers) {
            delete config.headers["Content-Type"];
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
                const { hasHydrated, logout } = useAuthStore.getState();
                if (!hasHydrated) {
                    return Promise.reject(error);
                }
                logout();
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export async function clientGet<T>(
    url: string,
    config?: AxiosRequestConfig,
): Promise<T> {
    const { data } = await api.get(url, config);
    return unwrapApiResult<T>(data);
}

export async function clientPost<T>(
    url: string,
    body?: unknown,
    config?: AxiosRequestConfig,
): Promise<T> {
    const { data } = await api.post(url, body, config);
    return unwrapApiResult<T>(data);
}

export async function clientDelete(url: string): Promise<void> {
    await api.delete(url);
}

export const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const responseData = (error.response?.data as ApiResponse);
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