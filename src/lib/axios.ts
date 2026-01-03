import axios from "axios";
import { env } from "@/config";

export const apiClient = axios.create({
  baseURL: env.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("arteri_access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("arteri_access_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
