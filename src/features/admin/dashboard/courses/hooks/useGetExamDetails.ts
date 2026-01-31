"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config/constants";

export interface ExamQuestionOption {
  option_id: string;
  option_text: string;
  is_correct: boolean;
  sequence: number;
}

export interface ExamQuestion {
  question_id: string;
  question_text: string;
  question_type: "single" | "multiple";
  difficulty: "easy" | "medium" | "hard";
  points: number;
  sequence: number;
  explanation: string;
  options: ExamQuestionOption[];
}

export interface ExamDetails {
  exam_id: string;
  course_id: string;
  title: string;
  description: string;
  exam_code: string;
  duration: number;
  passing_score: number;
  start_time: string;
  end_time: string;
  max_attempts: number;
  total_questions_in_bank: number;
  questions_to_show: number;
  is_random_order: boolean;
  is_random_selection: boolean;
  created_at: string;
  updated_at: string;
  questions: ExamQuestion[];
}

interface GetExamDetailsResponse {
  status: {
    code: number;
    isSuccess: boolean;
  };
  message: string;
  data: ExamDetails;
}

export const useGetExamDetails = (examId: string) => {
  return useQuery<ExamDetails>({
    queryKey: ["examDetails", examId],
    queryFn: async () => {
      const response = await api.get<GetExamDetailsResponse>(
        API_ENDPOINTS.TEACHER.GET_EXAM_DETAILS(examId)
      );
      return response.data.data;
    },
    enabled: !!examId,
  });
};
