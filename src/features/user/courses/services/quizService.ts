import { api } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config";
import { ApiResponse } from "@/features/auth/shared/types/authTypes";
import {
  QuizAttemptHistory,
  QuizStartResponse,
  QuizResultResponse,
  QuizAnswerResponse,
} from "../types/cTypes";
import { CheckAnswerResponse } from "../types/courseTypes";

export const quizService = {
  async getQuizAttempts(contentId?: string): Promise<QuizAttemptHistory[]> {
    const response = await api.get<ApiResponse<QuizAttemptHistory[]>>("/student/quiz-attempts", {
      params: { content_id: contentId },
    });
    return response.data.data;
  },

  async startQuiz(contentId: string): Promise<QuizStartResponse> {
    const response = await api.post<ApiResponse<QuizStartResponse>>(
      API_ENDPOINTS.COURSES.QUIZ.START(contentId)
    );
    return response.data.data;
  },

  async saveAnswer(
    attemptId: string,
    questionId: string,
    selectedOptionId: string | string[]
  ): Promise<QuizAnswerResponse> {
    const payload: {
      question_id: string;
      selected_option_id?: string;
      selected_option_ids?: string[];
    } = {
      question_id: questionId,
    };

    if (Array.isArray(selectedOptionId)) {
      payload.selected_option_ids = selectedOptionId;
    } else {
      payload.selected_option_id = selectedOptionId;
    }

    const response = await api.post<ApiResponse<QuizAnswerResponse>>(
      API_ENDPOINTS.COURSES.QUIZ.ANSWER(attemptId),
      payload
    );
    return response.data.data;
  },

  async submitQuiz(attemptId: string): Promise<QuizResultResponse> {
    const response = await api.post<ApiResponse<QuizResultResponse>>(
      API_ENDPOINTS.COURSES.QUIZ.SUBMIT(attemptId)
    );
    return response.data.data;
  },

  async getQuizResult(attemptId: string): Promise<QuizResultResponse> {
    const response = await api.get<ApiResponse<QuizResultResponse>>(
      API_ENDPOINTS.COURSES.QUIZ.RESULT(attemptId)
    );
    return response.data.data;
  },

  async resumeQuiz(contentId: string): Promise<QuizStartResponse> {
    const url = `/student/content/${contentId}/quiz/resume`;
    const response = await api.get<ApiResponse<QuizStartResponse>>(url);
    return response.data.data;
  },

  async checkAnswer(
    questionId: string,
    selectedOptionId: string | string[]
  ): Promise<CheckAnswerResponse> {
    const payload: {
      question_id: string;
      selected_option_id?: string;
      selected_option_ids?: string[];
    } = {
      question_id: questionId,
    };

    if (Array.isArray(selectedOptionId)) {
      payload.selected_option_ids = selectedOptionId;
    } else {
      payload.selected_option_id = selectedOptionId;
    }

    const response = await api.post<ApiResponse<CheckAnswerResponse>>(
      "/student/content/quiz/check-answer",
      payload
    );
    return response.data.data;
  },
};
