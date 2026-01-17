export const APP_NAME = "Arteri";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  PRODUK: "/produk",
  TENTANG_KAMI: "/tentang-kami",
  FAQ: "/faq",
  BANTUAN: "/bantuan",

  DASHBOARD: "/dashboard",
  COURSES: "/courses",
  TEAM: "/team",

  ADMIN_DASHBOARD: "/admin/dashboard",
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register-elearning",
    SEND_OTP: "/auth/register-elearning/otp",
    VERIFY_OTP: "/auth/register-elearning/verify-otp",
    COMPLETE_REGISTRATION: "/auth/register-elearning/complete",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
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
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
} as const;
