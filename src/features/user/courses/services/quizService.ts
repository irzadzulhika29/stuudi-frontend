import { api } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config";
import { ApiResponse } from "@/features/auth/shared/types/authTypes";
import { CheckAnswerRequest, CheckAnswerResponse } from "../types/courseTypes";

export const quizService = {
  async checkAnswer(questionId: string, selectedOptionId: string): Promise<CheckAnswerResponse> {
    const payload: CheckAnswerRequest = {
      question_id: questionId,
      selected_option_id: selectedOptionId,
    };
    const response = await api.post<ApiResponse<CheckAnswerResponse>>(
      API_ENDPOINTS.COURSES.QUIZ_CHECK_ANSWER,
      payload
    );
    return response.data.data;
  },
};
