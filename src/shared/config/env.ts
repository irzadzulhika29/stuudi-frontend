export const env = {
  BASE_API: process.env.NEXT_PUBLIC_BASE_API || "http://localhost:8080/api/v1",

  APP_ENV: process.env.NODE_ENV || "development",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",

  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
} as const;
