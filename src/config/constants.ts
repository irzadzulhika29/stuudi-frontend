export const APP_NAME = "Arteri";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  PRODUK: "/produk",
  TENTANG_KAMI: "/tentang-kami",
  
  DASHBOARD: "/dashboard",
  COURSES: "/courses",
  TEAM: "/team",
  
  ADMIN_DASHBOARD: "/admin/dashboard",
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    VERIFY_OTP: "/auth/verify-otp",
  },
  COURSES: {
    LIST: "/courses",
    DETAIL: (id: string) => `/courses/${id}`,
  },
  TEAM: {
    INFO: "/team",
  },
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "arteri_access_token",
  REFRESH_TOKEN: "arteri_refresh_token",
  USER: "arteri_user",
} as const;
