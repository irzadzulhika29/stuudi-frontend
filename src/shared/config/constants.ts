export const APP_NAME = "Arteri";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",

  PRODUK: "/produk",
  TENTANG_KAMI: "/tentang-kami",
  FAQ: "/faq",
  BANTUAN: "/bantuan",

  DASHBOARD: "/dashboard",
  COURSES: "/courses",
  TEAM: "/team",

  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_COURSES: "/admin/courses",
  ADMIN_TEAM: "/admin/team",
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login-elearning",

    ME: "/auth/me",
  },
  COURSES: {
    ALL: (page: number, per_page: number, search: string) =>
      `/courses/browse?page=${page}&per_page=${per_page}&search=${search}`,
    MY: "student/courses",
    LIST: "/courses",
    DETAIL: (id: string) => `student/courses/${id}`,
    Topic: (id: string) => `student/courses/${id}/topics`,
    ContentDetail: (id: string) => `student/content/${id}`,
  },
  TEACHER: {
    COURSES: "teacher/courses",
    ADD_COURSE: "teacher/add-course",
  },
  TEAM: {
    INFO: "/elearning/team-details",
  },
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER: "user_data",
} as const;
