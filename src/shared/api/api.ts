import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import { env } from "@/shared/config";

const api: AxiosInstance = axios.create({
    baseURL: env.BASE_API,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        if (error.response?.status === 401) {
            if (typeof window !== "undefined") {
                localStorage.removeItem("access_token");
                document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export { api };

export interface ApiError {
    status: {
        code: number;
        isSuccess: boolean;
    };
    message: string;
    errors?: Record<string, string[]>;
}
