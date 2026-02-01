"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api, ApiError } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config/constants";
import { QuizItem } from "../containers/QuizFormContainer";

// ========== Interfaces ==========

export interface CreateExamRequest {
  title: string;
  description: string;
  duration: number;
  passing_score: number;
  start_time: string;
  end_time: string;
  max_attempts: number;
  questions_to_show: number;
  is_random_order: boolean;
  is_random_selection: boolean;
}

interface CreateExamResponse {
  status: {
    code: number;
    isSuccess: boolean;
  };
  message: string;
  data: {
    exam_id: string;
    title: string;
  };
}

interface ExamQuestionOption {
  text: string;
  is_correct: boolean;
}

export interface ExamQuestionRequest {
  question_text: string;
  question_type: "single" | "multiple";
  difficulty: "easy" | "medium" | "hard";
  options: ExamQuestionOption[];
}

interface AddExamQuestionResponse {
  status: {
    code: number;
    isSuccess: boolean;
  };
  message: string;
  data: {
    question_id: string;
  };
}

// ========== Mutations ==========

export const useCreateExamContent = (courseId: string) => {
  return useMutation<CreateExamResponse, AxiosError<ApiError>, CreateExamRequest>({
    mutationFn: async (data: CreateExamRequest) => {
      const response = await api.post<CreateExamResponse>(
        API_ENDPOINTS.TEACHER.CREATE_EXAM(courseId),
        data
      );
      return response.data;
    },
  });
};

export const useAddExamQuestions = () => {
  return useMutation<
    AddExamQuestionResponse,
    AxiosError<ApiError>,
    { examId: string; question: ExamQuestionRequest }
  >({
    mutationFn: async ({ examId, question }) => {
      const response = await api.post<AddExamQuestionResponse>(
        API_ENDPOINTS.TEACHER.ADD_EXAM_QUESTIONS(examId),
        question
      );
      return response.data;
    },
  });
};

// ========== Helper Functions ==========

function transformQuizItemToExamQuestion(item: QuizItem): ExamQuestionRequest {
  const { data } = item;

  let questionType: "single" | "multiple" = "single";
  if (data.questionType === "multiple_choice") {
    questionType = data.isMultipleAnswer ? "multiple" : "single";
  }

  const options: ExamQuestionOption[] = data.options.map((opt) => ({
    text: opt.text,
    is_correct: opt.isCorrect,
  }));

  return {
    question_text: data.question,
    question_type: questionType,
    difficulty: data.difficulty,
    options,
  };
}

// ========== Main Hook ==========

export interface CreateExamResult {
  success: boolean;
  examId?: string;
  error?: string;
  failedQuestions?: number[];
}

export const useCreateExam = (courseId: string) => {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, stage: "" });

  const createExamContentMutation = useCreateExamContent(courseId);
  const addExamQuestionMutation = useAddExamQuestions();

  const createExam = async (
    examData: CreateExamRequest,
    quizItems: QuizItem[]
  ): Promise<CreateExamResult> => {
    setIsCreating(true);
    // Total steps: 1 (create exam) + N questions
    const totalSteps = 1 + quizItems.length;
    setProgress({ current: 0, total: totalSteps, stage: "Membuat exam..." });

    try {
      // Step 1: Create Exam
      console.log("Creating exam:", examData);
      const examResponse = await createExamContentMutation.mutateAsync(examData);

      const examId = examResponse.data.exam_id;
      console.log("Exam created with ID:", examId);
      setProgress({ current: 1, total: totalSteps, stage: "Menambah pertanyaan..." });

      // Step 2: Add Questions
      const failedQuestions: number[] = [];

      for (let i = 0; i < quizItems.length; i++) {
        const item = quizItems[i];
        const questionData = transformQuizItemToExamQuestion(item);

        try {
          console.log(`Adding question ${i + 1}/${quizItems.length}:`, questionData);
          await addExamQuestionMutation.mutateAsync({
            examId,
            question: questionData,
          });
          console.log(`Question ${i + 1} added successfully`);
        } catch (error) {
          console.error(`Failed to add question ${i + 1}:`, error);
          failedQuestions.push(i);
        }

        setProgress({
          current: i + 2,
          total: totalSteps,
          stage: `Menambah pertanyaan ${i + 1}/${quizItems.length}...`,
        });
      }

      setProgress({ current: totalSteps, total: totalSteps, stage: "Selesai!" });

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["teachingCourse"] });

      setIsCreating(false);

      if (failedQuestions.length > 0) {
        return {
          success: false,
          examId,
          error: `${failedQuestions.length} pertanyaan gagal ditambahkan`,
          failedQuestions,
        };
      }

      return { success: true, examId };
    } catch (error) {
      console.error("Failed to create exam:", error);
      setIsCreating(false);

      const axiosError = error as AxiosError<ApiError>;
      return {
        success: false,
        error: axiosError.response?.data?.message || "Gagal membuat exam",
      };
    }
  };

  return {
    createExam,
    isCreating,
    progress,
  };
};
