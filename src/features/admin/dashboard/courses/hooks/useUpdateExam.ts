"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api, ApiError } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config/constants";

export interface UpdateExamRequest {
  title: string;
  description: string;
  duration: number;
  passing_score: number;
  start_time: string;
  end_time: string;
  max_attempts: number;
  questions_to_show?: number;
  is_random_order?: boolean;
  is_random_selection?: boolean;
}

interface UpdateExamResponse {
  status: {
    code: number;
    isSuccess: boolean;
  };
  message: string;
  data: {
    exam_id: string;
    title: string;
  };
}

export const useUpdateExam = (examId: string) => {
  const queryClient = useQueryClient();

  return useMutation<UpdateExamResponse, AxiosError<ApiError>, UpdateExamRequest>({
    mutationFn: async (data: UpdateExamRequest) => {
      const response = await api.patch<UpdateExamResponse>(
        API_ENDPOINTS.TEACHER.UPDATE_EXAM(examId),
        data
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate exam details and course exams queries
      queryClient.invalidateQueries({ queryKey: ["examDetails", examId] });
      queryClient.invalidateQueries({ queryKey: ["courseExams"] });
      queryClient.invalidateQueries({ queryKey: ["teachingCourse"] });
    },
  });
};
