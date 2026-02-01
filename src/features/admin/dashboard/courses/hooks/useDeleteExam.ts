"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api, ApiError } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config/constants";

interface DeleteExamResponse {
  status: {
    code: number;
    isSuccess: boolean;
  };
  message: string;
}

export const useDeleteExam = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteExamResponse, AxiosError<ApiError>, string>({
    mutationFn: async (examId: string) => {
      const response = await api.delete<DeleteExamResponse>(
        API_ENDPOINTS.TEACHER.DELETE_EXAM(examId)
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate exam-related queries
      queryClient.invalidateQueries({ queryKey: ["courseExams"] });
      queryClient.invalidateQueries({ queryKey: ["teachingCourse"] });
    },
  });
};
