"use client";

import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api, ApiError } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config/constants";

// Types based on API response
interface QuizOption {
  option_id: string;
  text: string;
  is_correct: boolean;
}

interface QuizQuestion {
  question_id: string;
  // Support both field name formats
  text?: string;
  question_text?: string;
  type?: "single" | "multiple" | "matching";
  question_type?: "single" | "multiple" | "matching";
  points: number;
  difficulty: "easy" | "medium" | "hard";
  explanation?: string;
  options?: QuizOption[];
  pairs?: { pair_id?: string; left: string; right: string }[];
  matching_pairs?: { pair_id?: string; left_text: string; right_text: string }[];
}

interface QuizSettings {
  time_limit: number;
  passing_score: number;
  questions_to_show: number;
}

interface QuizDetailsData {
  content_id: string;
  title: string;
  description: string;
  settings: QuizSettings;
  questions: QuizQuestion[];
}

interface GetQuizDetailsResponse {
  status: {
    code: number;
    isSuccess: boolean;
  };
  message: string;
  data: QuizDetailsData;
}

export const useGetQuizDetails = (contentId: string) => {
  return useQuery<GetQuizDetailsResponse, AxiosError<ApiError>>({
    queryKey: ["quizDetails", contentId],
    queryFn: async () => {
      const response = await api.get<GetQuizDetailsResponse>(
        API_ENDPOINTS.TEACHER.GET_QUIZ_DETAILS(contentId)
      );
      return response.data;
    },
    enabled: !!contentId,
  });
};

export type { QuizDetailsData, QuizQuestion, QuizOption, QuizSettings as QuizDetailsSettings };
