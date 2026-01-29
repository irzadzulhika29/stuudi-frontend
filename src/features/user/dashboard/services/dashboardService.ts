import { api } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config";
import { ApiResponse } from "@/features/auth/shared/types/authTypes";
import { UpcomingExam } from "../types/dashboardTypes";

export const dashboardService = {
  async getUpcomingExam(): Promise<UpcomingExam | null> {
    try {
      const response = await api.get<ApiResponse<UpcomingExam>>(API_ENDPOINTS.EXAM.UPCOMING);
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch upcoming exam", error);
      return null;
    }
  },
};
