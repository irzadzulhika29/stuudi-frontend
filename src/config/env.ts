export const env = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  
  APP_ENV: process.env.NODE_ENV || "development",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",
  
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
} as const;
