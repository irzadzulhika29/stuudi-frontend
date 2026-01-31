"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api, ApiError } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config/constants";

// ========== Interfaces ==========

export interface QuizConfigureRequest {
  questions_to_show: number;
  is_random_order: boolean;
  is_random_selection: boolean;
  passing_score: number;
  time_limit_minutes: number;
}

export interface QuizConfigData {
  questions_to_show: number;
  is_random_order: boolean;
  is_random_selection: boolean;
  passing_score: number;
  time_limit_minutes: number;
}

interface QuizConfigureResponse {
  status: {
    code: number;
    isSuccess: boolean;
  };
  message: string;
  data: QuizConfigData;
}

interface GetQuizConfigResponse {
  status: {
    code: number;
    isSuccess: boolean;
  };
  message: string;
  data: QuizConfigData;
}

// ========== Hooks ==========

export const useConfigureQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation<
    QuizConfigureResponse,
    AxiosError<ApiError>,
    { contentId: string; config: QuizConfigureRequest }
  >({
    mutationFn: async ({ contentId, config }) => {
      const response = await api.post<QuizConfigureResponse>(
        API_ENDPOINTS.TEACHER.QUIZ_CONFIGURE(contentId),
        config
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["quizConfig", variables.contentId] });
    },
  });
};

export const useGetQuizConfig = (contentId: string) => {
  return useQuery<QuizConfigData>({
    queryKey: ["quizConfig", contentId],
    queryFn: async () => {
      const response = await api.get<GetQuizConfigResponse>(
        API_ENDPOINTS.TEACHER.QUIZ_CONFIGURE(contentId)
      );
      return response.data.data;
    },
    enabled: !!contentId,
  });
};
