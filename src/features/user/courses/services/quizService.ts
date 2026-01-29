import { api } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config";
import { ApiResponse } from "@/features/auth/shared/types/authTypes";
import { QuizStartResponse, QuizResultResponse } from "../types/cTypes";
import { CheckAnswerResponse } from "../types/courseTypes";

export const quizService = {
  async startQuiz(contentId: string): Promise<QuizStartResponse> {
    const response = await api.post<ApiResponse<QuizStartResponse>>(
      API_ENDPOINTS.COURSES.QUIZ.START(contentId)
    );
    return response.data.data;
  },

  async saveAnswer(
    attemptId: string,
    questionId: string,
    selectedOptionIds: string[]
  ): Promise<unknown> {
    const response = await api.post(API_ENDPOINTS.COURSES.QUIZ.ANSWER(attemptId), {
      question_id: questionId,
      selected_option_id: selectedOptionIds,
    });
    return response.data;
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
    const response = await api.post<ApiResponse<QuizStartResponse>>(
      `/student/content/${contentId}/quiz/resume`
    );
    return response.data.data;
  },

  async checkAnswer(questionId: string, selectedOptionId: string): Promise<CheckAnswerResponse> {
    const response = await api.post<ApiResponse<CheckAnswerResponse>>(
      "/student/quiz/check-answer",
      {
        question_id: questionId,
        selected_option_id: selectedOptionId,
      }
    );
    return response.data.data;
  },
};
