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
    console.log("[QuizService] getQuizAttempts called for content:", contentId);
    const response = await api.get<ApiResponse<QuizAttemptHistory[]>>("/student/quiz-attempts", {
      params: { content_id: contentId },
    });
    console.log("[QuizService] getQuizAttempts response:", response.data.data);
    return response.data.data;
  },

  async startQuiz(contentId: string): Promise<QuizStartResponse> {
    console.log("[QuizService] startQuiz called for content:", contentId);
    const response = await api.post<ApiResponse<QuizStartResponse>>(
      API_ENDPOINTS.COURSES.QUIZ.START(contentId)
    );
    console.log("[QuizService] startQuiz response:", response.data.data);
    return response.data.data;
  },

  async saveAnswer(
    attemptId: string,
    questionId: string,
    selectedOptionId: string | string[]
  ): Promise<QuizAnswerResponse> {
    console.log("[QuizService] saveAnswer called:", { attemptId, questionId, selectedOptionId });

    // Construct payload based on whether selectedOptionId is array or string
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

    console.log("[QuizService] saveAnswer payload:", payload);

    const response = await api.post<ApiResponse<QuizAnswerResponse>>(
      API_ENDPOINTS.COURSES.QUIZ.ANSWER(attemptId),
      payload
    );
    console.log("[QuizService] saveAnswer response:", response.data.data);
    return response.data.data;
  },

  async submitQuiz(attemptId: string): Promise<QuizResultResponse> {
    console.log("[QuizService] submitQuiz called for attempt:", attemptId);
    const response = await api.post<ApiResponse<QuizResultResponse>>(
      API_ENDPOINTS.COURSES.QUIZ.SUBMIT(attemptId)
    );
    console.log("[QuizService] submitQuiz response:", response.data.data);
    return response.data.data;
  },

  async getQuizResult(attemptId: string): Promise<QuizResultResponse> {
    console.log("[QuizService] getQuizResult called for attempt:", attemptId);
    const response = await api.get<ApiResponse<QuizResultResponse>>(
      API_ENDPOINTS.COURSES.QUIZ.RESULT(attemptId)
    );
    console.log("[QuizService] getQuizResult response:", response.data.data);
    return response.data.data;
  },

  async resumeQuiz(contentId: string): Promise<QuizStartResponse> {
    const url = `/student/content/${contentId}/quiz/resume`;
    console.log("[QuizService] resumeQuiz called for content:", contentId);
    console.log("[QuizService] resumeQuiz URL:", url);
    const response = await api.get<ApiResponse<QuizStartResponse>>(url);
    console.log("[QuizService] resumeQuiz response:", response.data.data);
    return response.data.data;
  },

  async checkAnswer(
    questionId: string,
    selectedOptionId: string | string[]
  ): Promise<CheckAnswerResponse> {
    console.log("[QuizService] checkAnswer called:", { questionId, selectedOptionId });

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
    console.log("[QuizService] checkAnswer response:", response.data.data);
    return response.data.data;
  },
};
