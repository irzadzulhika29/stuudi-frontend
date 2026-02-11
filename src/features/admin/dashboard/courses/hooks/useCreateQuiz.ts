"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api, ApiError } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config/constants";
import { QuizItem } from "../containers/QuizFormContainer";
import { transformQuizItemToApiFormat, QuizQuestionApiFormat } from "../utils/quizTransformers";

interface AddQuizContentRequest {
  title: string;
  type: "quiz";
}

interface AddQuizContentResponse {
  status: {
    code: number;
    isSuccess: boolean;
  };
  message: string;
  data: {
    content_id: string;
    title: string;
  };
}

interface AddQuizQuestionResponse {
  status: {
    code: number;
    isSuccess: boolean;
  };
  message: string;
  data: {
    question_id: string;
  };
}

export const useAddQuizContent = (topicId: string) => {
  return useMutation<AddQuizContentResponse, AxiosError<ApiError>, AddQuizContentRequest>({
    mutationFn: async (data: AddQuizContentRequest) => {
      const response = await api.post<AddQuizContentResponse>(
        API_ENDPOINTS.TEACHER.ADD_QUIZ_CONTENT(topicId),
        data
      );
      return response.data;
    },
  });
};

export const useAddQuizQuestions = () => {
  return useMutation<
    AddQuizQuestionResponse,
    AxiosError<ApiError>,
    { contentId: string; question: QuizQuestionApiFormat }
  >({
    mutationFn: async ({ contentId, question }) => {
      const response = await api.post<AddQuizQuestionResponse>(
        API_ENDPOINTS.TEACHER.ADD_QUIZ_QUESTIONS(contentId),
        question
      );
      return response.data;
    },
  });
};

interface UpdateQuizQuestionResponse {
  status: {
    code: number;
    isSuccess: boolean;
  };
  message: string;
  data: {
    question_id: string;
  };
}

export const useUpdateQuizQuestion = () => {
  return useMutation<
    UpdateQuizQuestionResponse,
    AxiosError<ApiError>,
    { questionId: string; question: QuizQuestionApiFormat }
  >({
    mutationFn: async ({ questionId, question }) => {
      const response = await api.patch<UpdateQuizQuestionResponse>(
        API_ENDPOINTS.TEACHER.UPDATE_QUESTION(questionId),
        question
      );
      return response.data;
    },
  });
};

// Interface for delete question response
interface DeleteQuizQuestionResponse {
  status: {
    code: number;
    isSuccess: boolean;
  };
  message: string;
}

// Hook for deleting a quiz question
export const useDeleteQuizQuestion = () => {
  return useMutation<DeleteQuizQuestionResponse, AxiosError<ApiError>, { questionId: string }>({
    mutationFn: async ({ questionId }) => {
      const response = await api.delete<DeleteQuizQuestionResponse>(
        API_ENDPOINTS.TEACHER.DELETE_QUESTION(questionId)
      );
      return response.data;
    },
  });
};

interface CreateQuizResult {
  success: boolean;
  contentId?: string;
  error?: string;
  failedQuestions?: number[];
}

export const useCreateQuiz = (topicId: string) => {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const addQuizContentMutation = useAddQuizContent(topicId);
  const addQuizQuestionMutation = useAddQuizQuestions();

  const createQuiz = async (quizName: string, quizItems: QuizItem[]): Promise<CreateQuizResult> => {
    setIsCreating(true);
    setProgress({ current: 0, total: quizItems.length + 1 });

    try {
      const quizContentResponse = await addQuizContentMutation.mutateAsync({
        title: quizName,
        type: "quiz",
      });

      const contentId = quizContentResponse.data.content_id;

      setProgress({ current: 1, total: quizItems.length + 1 });

      const failedQuestions: number[] = [];

      for (let i = 0; i < quizItems.length; i++) {
        const item = quizItems[i];
        const questionData = transformQuizItemToApiFormat(item);

        try {
          await addQuizQuestionMutation.mutateAsync({
            contentId,
            question: questionData,
          });
        } catch (error) {
          console.error(`Failed to add question ${i + 1}:`, error);
          failedQuestions.push(i);
        }

        setProgress({ current: i + 2, total: quizItems.length + 1 });
      }

      queryClient.invalidateQueries({ queryKey: ["teachingCourse"] });

      setIsCreating(false);

      if (failedQuestions.length > 0) {
        return {
          success: false,
          contentId,
          error: `${failedQuestions.length} pertanyaan gagal ditambahkan`,
          failedQuestions,
        };
      }

      return { success: true, contentId };
    } catch (error) {
      console.error("Failed to create quiz:", error);
      setIsCreating(false);

      const axiosError = error as AxiosError<ApiError>;
      return {
        success: false,
        error: axiosError.response?.data?.message || "Gagal membuat quiz",
      };
    }
  };

  return {
    createQuiz,
    isCreating,
    progress,
  };
};
