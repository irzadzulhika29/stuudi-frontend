import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config/constants";
import { ApiError } from "@/shared/api/api";

interface QuizOption {
  text: string;
  is_correct: boolean;
}

export type QuizDifficulty = "easy" | "medium" | "hard";

interface AddQuizBlockRequest {
  question: string;
  question_type: "single" | "multiple";
  difficulty: QuizDifficulty;
  options: QuizOption[];
}

interface AddQuizBlockResponse {
  status: {
    code: number;
    isSuccess: boolean;
  };
  message: string;
  data: {
    block_id: string;
    type: "quiz";
    sequence: number;
    question_id: string;
  };
}

export const useAddQuizBlock = (contentId: string) => {
  return useMutation<AddQuizBlockResponse, AxiosError<ApiError>, AddQuizBlockRequest>({
    mutationFn: async (data: AddQuizBlockRequest) => {
      const response = await api.post<AddQuizBlockResponse>(
        API_ENDPOINTS.TEACHER.ADD_QUIZ_BLOCK(contentId),
        data
      );
      return response.data;
    },
  });
};

// Hook for adding additional questions to quiz block
interface AddQuizQuestionRequest {
  question_text: string;
  question_type: "single" | "multiple";
  difficulty: QuizDifficulty;
  options: QuizOption[];
}

interface AddQuizQuestionResponse {
  status: {
    code: number;
    isSuccess: boolean;
  };
  message: string;
  data: {
    question_id: string;
    question_text: string;
    question_type: string;
    difficulty: string;
    options: {
      option_id: string;
      option_text: string;
      sequence: number;
    }[];
  };
}

export const useAddQuizQuestion = (blockId: string) => {
  return useMutation<AddQuizQuestionResponse, AxiosError<ApiError>, AddQuizQuestionRequest>({
    mutationFn: async (data: AddQuizQuestionRequest) => {
      const response = await api.post<AddQuizQuestionResponse>(
        API_ENDPOINTS.TEACHER.ADD_QUIZ_QUESTION(blockId),
        data
      );
      return response.data;
    },
  });
};
