"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api, ApiError } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config/constants";
import { QuizItem } from "../containers/QuizFormContainer";

// Types for API requests/responses
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

interface QuizQuestionOption {
  text: string;
  is_correct: boolean;
}

interface AddQuizQuestionRequest {
  question_text: string;
  question_type: "single" | "multiple";
  difficulty: "easy" | "medium" | "hard";
  explanation: string;
  options: QuizQuestionOption[];
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

// Hook for creating quiz content
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

// Hook for adding questions to quiz
export const useAddQuizQuestions = () => {
  return useMutation<
    AddQuizQuestionResponse,
    AxiosError<ApiError>,
    { contentId: string; question: AddQuizQuestionRequest }
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

// Helper function to transform QuizItem to API format
function transformQuizItemToApiFormat(item: QuizItem): AddQuizQuestionRequest {
  const { data } = item;
  
  // Determine question type based on isMultipleAnswer or questionType
  let questionType: "single" | "multiple" = "single";
  if (data.questionType === "multiple_choice") {
    questionType = data.isMultipleAnswer ? "multiple" : "single";
  }

  // Transform options
  const options: QuizQuestionOption[] = data.options.map((opt) => ({
    text: opt.text,
    is_correct: opt.isCorrect,
  }));

  return {
    question_text: data.question,
    question_type: questionType,
    difficulty: data.difficulty,
    explanation: "", // Will be filled if available, or provide a default
    options,
  };
}

interface CreateQuizResult {
  success: boolean;
  contentId?: string;
  error?: string;
  failedQuestions?: number[];
}

// Main hook for creating quiz with all questions
export const useCreateQuiz = (topicId: string) => {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const addQuizContentMutation = useAddQuizContent(topicId);
  const addQuizQuestionMutation = useAddQuizQuestions();

  const createQuiz = async (
    quizName: string,
    quizItems: QuizItem[]
  ): Promise<CreateQuizResult> => {
    setIsCreating(true);
    setProgress({ current: 0, total: quizItems.length + 1 });

    try {
      // Step 1: Create quiz content
      console.log("Creating quiz content:", quizName);
      const quizContentResponse = await addQuizContentMutation.mutateAsync({
        title: quizName,
        type: "quiz",
      });

      const contentId = quizContentResponse.data.content_id;
      console.log("Quiz content created with ID:", contentId);
      setProgress({ current: 1, total: quizItems.length + 1 });

      // Step 2: Add questions sequentially
      const failedQuestions: number[] = [];

      for (let i = 0; i < quizItems.length; i++) {
        const item = quizItems[i];
        const questionData = transformQuizItemToApiFormat(item);

        try {
          console.log(`Adding question ${i + 1}/${quizItems.length}:`, questionData);
          await addQuizQuestionMutation.mutateAsync({
            contentId,
            question: questionData,
          });
          console.log(`Question ${i + 1} added successfully`);
        } catch (error) {
          console.error(`Failed to add question ${i + 1}:`, error);
          failedQuestions.push(i);
        }

        setProgress({ current: i + 2, total: quizItems.length + 1 });
      }

      // Invalidate queries to refresh data
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
