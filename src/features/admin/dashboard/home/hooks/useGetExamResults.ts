"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config/constants";

export interface ExamStatistics {
  total_attempts: number;
  total_students: number;
  average_score: number;
  highest_score: number;
  lowest_score: number;
  pass_rate: number;
  passed_students: number;
  failed_students: number;
}

export interface ExamResults {
  exam_id: string;
  exam_title: string;
  passing_score: number;
  statistics: ExamStatistics;
  attempts: Array<Record<string, unknown>>;
}

interface GetExamResultsResponse {
  status: {
    code: number;
    isSuccess: boolean;
  };
  message: string;
  data: ExamResults;
}

export const useGetExamResults = (examId: string) => {
  return useQuery<ExamResults>({
    queryKey: ["examResults", examId],
    queryFn: async () => {
      const response = await api.get<GetExamResultsResponse>(
        API_ENDPOINTS.TEACHER.GET_EXAM_RESULTS(examId)
      );
      return response.data.data;
    },
    enabled: !!examId,
  });
};
