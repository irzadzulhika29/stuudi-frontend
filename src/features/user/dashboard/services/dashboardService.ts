import { api } from "@/shared/api/api";
import { AxiosError } from "axios";
import { API_ENDPOINTS } from "@/shared/config";
import { ApiResponse } from "@/features/auth/shared/types/authTypes";
import {
  UpcomingExam,
  ExamAccessData,
  ExamStartResponse,
  ExamAttemptsResponse,
  ExamResumeResponse,
} from "@/features/user/dashboard/types/dashboardTypes";

export const dashboardService = {
  async getUpcomingExam(): Promise<UpcomingExam | null> {
    try {
      const response = await api.get<ApiResponse<UpcomingExam>>(API_ENDPOINTS.EXAM.UPCOMING);
      return response.data.data;
    } catch (error: unknown) {
      if ((error as AxiosError).response?.status === 404) {
        return null;
      }
      console.error("Failed to fetch upcoming exam", error);
      return null;
    }
  },

  async accessExam(code: string): Promise<ExamAccessData> {
    try {
      const response = await api.post<ApiResponse<ExamAccessData>>(API_ENDPOINTS.EXAM.ACCESS, {
        exam_code: code,
      });
      return response.data.data;
    } catch (error) {
      console.error("Failed to access exam", error);
      throw error;
    }
  },

  async startExam(examId: string): Promise<ExamStartResponse> {
    try {
      console.log("[DashboardService] Requesting start exam:", examId);
      const response = await api.post<ApiResponse<ExamStartResponse>>(
        `/student/exams/${examId}/start`
      );
      console.log("[DashboardService] Start exam response:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("Failed to start exam", error);
      throw error;
    }
  },

  async getAttempts(): Promise<ExamAttemptsResponse> {
    try {
      console.log("[DashboardService] Requesting exam attempts...");
      const response = await api.get<ApiResponse<ExamAttemptsResponse>>("/student/exams-attempts");
      console.log("[DashboardService] Exam attempts response:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch exam attempts", error);
      throw error;
    }
  },

  async resumeExam(examId: string): Promise<ExamResumeResponse> {
    try {
      console.log("[DashboardService] Requesting resume exam:", examId);
      const response = await api.get<ApiResponse<ExamResumeResponse>>(
        `/student/exams/${examId}/resume`
      );
      console.log("[DashboardService] Resume exam response:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("Failed to resume exam", error);
      throw error;
    }
  },
};
