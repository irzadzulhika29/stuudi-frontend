"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config/constants";

export interface LeaderboardItem {
  rank: number;
  team_name: string;
  score: number;
  duration: string;
  violence: number;
  school_name: string;
  status: string;
}

export interface ExamDashboard {
  exam_id: string;
  exam_title: string;
  total_participants: number;
  disqualified_participants: number;
  cheating_reports: number;
  leaderboard: LeaderboardItem[];
}

interface GetExamDashboardResponse {
  status: {
    code: number;
    isSuccess: boolean;
  };
  message: string;
  data: ExamDashboard;
}

export const DEFAULT_EXAM_DASHBOARD_LIMIT = 10;

export const useGetExamDashboard = (
  examId: string,
  limit: number = DEFAULT_EXAM_DASHBOARD_LIMIT
) => {
  const normalizedLimit =
    Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : DEFAULT_EXAM_DASHBOARD_LIMIT;

  return useQuery<ExamDashboard>({
    queryKey: ["examDashboard", examId, normalizedLimit],
    queryFn: async () => {
      const response = await api.get<GetExamDashboardResponse>(
        API_ENDPOINTS.TEACHER.GET_EXAM_DASHBOARD(examId),
        {
          params: {
            limit: normalizedLimit,
          },
        }
      );
      return response.data.data;
    },
    enabled: !!examId,
  });
};
