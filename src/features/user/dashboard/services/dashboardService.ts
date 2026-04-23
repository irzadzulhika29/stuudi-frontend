import { api } from "@/shared/api/api";
import { AxiosError } from "axios";
import { API_ENDPOINTS } from "@/shared/config";
import { ApiResponse } from "@/features/auth/shared/types/authTypes";
import {
  UpcomingExam,
  UpcomingExamCollection,
  ExamAccessData,
  ExamStartResponse,
  ExamAttemptsResponse,
  ExamResumeResponse,
} from "@/features/user/dashboard/types/dashboardTypes";

export const dashboardService = {
  async getUpcomingExam(): Promise<UpcomingExam | null> {
    try {
      const response = await api.get<ApiResponse<UpcomingExamCollection>>(
        API_ENDPOINTS.EXAM.UPCOMING
      );
      const payload = response.data.data;
      const sortByStartDate = (items: UpcomingExam[]) =>
        [...items].sort(
          (left, right) => new Date(left.start_at).getTime() - new Date(right.start_at).getTime()
        );
      const normalizedOngoingExams = Array.isArray(payload?.ongoing_exams)
        ? sortByStartDate(payload.ongoing_exams)
        : payload?.ongoing_exams
          ? [payload.ongoing_exams]
          : [];
      const normalizedUpcomingExams = sortByStartDate(payload?.upcoming_exams ?? []);
      const selectedExam = normalizedUpcomingExams[0] ?? normalizedOngoingExams[0] ?? null;

      return selectedExam;
    } catch (error: unknown) {
      if ((error as AxiosError).response?.status === 404) {
        return null;
      }

      console.error("Failed to fetch upcoming exam", error);
      throw error;
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
      const endpoint = `/student/exams/${examId}/start`;

      const response = await api.post<ApiResponse<ExamStartResponse>>(endpoint);

      return response.data.data;
    } catch (error) {
      console.error("Failed to start exam", error);
      throw error;
    }
  },

  async getAttempts(): Promise<ExamAttemptsResponse> {
    try {
      const response = await api.get<ApiResponse<ExamAttemptsResponse>>("/student/exams-attempts");
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch exam attempts", error);
      throw error;
    }
  },

  async resumeExam(examId: string): Promise<ExamResumeResponse> {
    try {
      const response = await api.get<ApiResponse<ExamResumeResponse>>(
        `/student/exams/${examId}/resume`
      );
      return response.data.data;
    } catch (error) {
      console.error("Failed to resume exam", error);
      throw error;
    }
  },
};
