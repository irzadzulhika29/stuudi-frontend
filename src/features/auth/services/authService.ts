import { api } from "@/shared/api/api";
import { API_ENDPOINTS, STORAGE_KEYS } from "@/shared/config";
import { ApiResponse, LoginRequest, LoginResponse, AuthUser } from "../shared/types/authTypes";
import { decodeJwt, JwtPayload } from "@/shared/utils/jwt";

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

    const decoded = decodeJwt<JwtPayload>(result.token);
    const roleName = decoded?.RoleName;

    if (typeof window !== "undefined") {
      const userData: AuthUser = {
        id: decoded?.UserID || "local-user",
        email: data.email,
        user_type: result.user_type,
        roleName: roleName || undefined,
      };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    }

    // Return result with roleName included for redirect logic
    return { ...result, roleName };
  },

  async logout(): Promise<void> {
    clearTokens();
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  },

  async getProfile(): Promise<AuthUser> {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (storedUser) {
        return JSON.parse(storedUser);
      }
    }
    throw new Error("User data not found");
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
