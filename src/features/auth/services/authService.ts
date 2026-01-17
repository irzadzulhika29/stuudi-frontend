import { api } from "@/shared/api/api";
import { API_ENDPOINTS, STORAGE_KEYS } from "@/shared/config";
import {
    ApiResponse,
    LoginRequest,
    LoginResponse,
    SendOtpRequest,
    SendOtpResponse,
    VerifyOtpRequest,
    VerifyOtpResponse,
    CompleteRegistrationRequest,
    CompleteRegistrationResponse,
    AuthUser,
} from "../shared/types/authTypes";

const setTokens = (token: string) => {
    if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
        document.cookie = `${STORAGE_KEYS.ACCESS_TOKEN}=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    }
};

const clearTokens = () => {
    if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        document.cookie = `${STORAGE_KEYS.ACCESS_TOKEN}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
};

export const authService = {
    async login(data: LoginRequest): Promise<LoginResponse> {
        const response = await api.post<ApiResponse<LoginResponse>>(API_ENDPOINTS.AUTH.LOGIN, data);
        const result = response.data.data;
        setTokens(result.token);
        return result;
    },

    async sendOtp(data: SendOtpRequest): Promise<SendOtpResponse> {
        const response = await api.post<ApiResponse<SendOtpResponse>>(
            API_ENDPOINTS.AUTH.SEND_OTP,
            data
        );
        return response.data.data;
    },

    async verifyOtp(sessionToken: string, data: VerifyOtpRequest): Promise<VerifyOtpResponse> {
        const response = await api.post<ApiResponse<VerifyOtpResponse>>(
            API_ENDPOINTS.AUTH.VERIFY_OTP,
            data,
            {
                headers: {
                    "X-Session-Token": sessionToken,
                },
            }
        );
        return response.data.data;
    },

    async completeRegistration(
        sessionToken: string,
        data: CompleteRegistrationRequest
    ): Promise<CompleteRegistrationResponse> {
        const response = await api.post<ApiResponse<CompleteRegistrationResponse>>(
            API_ENDPOINTS.AUTH.COMPLETE_REGISTRATION,
            data,
            {
                headers: {
                    "X-Session-Token": sessionToken,
                },
            }
        );
        const result = response.data.data;
        setTokens(result.token);
        return result;
    },

    async logout(): Promise<void> {
        try {
            await api.post(API_ENDPOINTS.AUTH.LOGOUT);
        } finally {
            clearTokens();
        }
    },

    async getProfile(): Promise<AuthUser> {
        const response = await api.get<ApiResponse<AuthUser>>(API_ENDPOINTS.AUTH.ME);
        return response.data.data;
    },

    isAuthenticated(): boolean {
        if (typeof window === "undefined") return false;
        return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    },

    getToken(): string | null {
        if (typeof window === "undefined") return null;
        return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    },
};
