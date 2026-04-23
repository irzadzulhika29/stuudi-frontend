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

interface ExamQuestionPair {
  left_text: string;
  right_text: string;
}

export interface ExamQuestionRequest {
  question_text: string;
  question_type: "single" | "multiple" | "matching";
  difficulty: "easy" | "medium" | "hard";
  explanation?: string;
  options?: ExamQuestionOption[];
  matching_pairs?: ExamQuestionPair[];
  image?: File | null;
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

function summarizeQuestionForAudit(question: ExamQuestionRequest) {
  return {
    question_text: question.question_text,
    question_type: question.question_type,
    difficulty: question.difficulty,
    has_image: Boolean(question.image),
    options:
      question.options?.map((option, index) => ({
        index,
        text: option.text,
        is_correct: option.is_correct,
      })) || [],
    matching_pairs:
      question.matching_pairs?.map((pair, index) => ({
        index,
        left_text: pair.left_text,
        right_text: pair.right_text,
      })) || [],
  };
}

function summarizeFormData(formData: FormData) {
  return Array.from(formData.entries()).map(([key, value]) => ({
    key,
    value:
      value instanceof File
        ? {
            name: value.name,
            type: value.type,
            size: value.size,
          }
        : value,
  }));
}

function buildExamQuestionFormData(question: ExamQuestionRequest): FormData {
  const formData = new FormData();

  formData.append("question_text", question.question_text);
  formData.append("question_type", question.question_type);
  formData.append("difficulty", question.difficulty);
  formData.append("explanation", question.explanation || "");

  if (question.options && question.options.length > 0) {
    formData.append("options_json", JSON.stringify(question.options));
  }

  if (question.matching_pairs && question.matching_pairs.length > 0) {
    formData.append("matching_pairs_json", JSON.stringify(question.matching_pairs));
  }

  if (question.image) {
    formData.append("image", question.image);
  }

  console.log(
    "[EXAM AUDIT] buildExamQuestionFormData:summary",
    summarizeQuestionForAudit(question)
  );
  console.log("[EXAM AUDIT] buildExamQuestionFormData:formData", summarizeFormData(formData));

  return formData;
}

export const useCreateExamContent = (courseId: string) => {
  return useMutation<CreateExamResponse, AxiosError<ApiError>, CreateExamRequest>({
    mutationFn: async (data: CreateExamRequest) => {
      console.log("[EXAM AUDIT] createExamContent:request", {
        courseId,
        endpoint: API_ENDPOINTS.TEACHER.CREATE_EXAM(courseId),
        payload: data,
      });
      const response = await api.post<CreateExamResponse>(
        API_ENDPOINTS.TEACHER.CREATE_EXAM(courseId),
        data
      );
      console.log("[EXAM AUDIT] createExamContent:response", response.data);
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
      const formData = buildExamQuestionFormData(question);
      const endpoint = API_ENDPOINTS.TEACHER.ADD_EXAM_QUESTIONS(examId);
      console.log("[EXAM AUDIT] addExamQuestion:request", {
        examId,
        endpoint,
        question: summarizeQuestionForAudit(question),
      });
      const response = await api.post<AddExamQuestionResponse>(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("[EXAM AUDIT] addExamQuestion:response", response.data);
      return response.data;
    },
  });
};

// ========== Helper Functions ==========

function transformQuizItemToExamQuestion(item: QuizItem): ExamQuestionRequest {
  const { data } = item;
  console.log("[EXAM AUDIT] transformQuizItemToExamQuestion:input", {
    itemId: item.id,
    question: data.question,
    questionType: data.questionType,
    difficulty: data.difficulty,
    optionCount: data.options?.length || 0,
    pairCount: data.pairs?.length || 0,
    hasImageFile: Boolean(data.imageFile),
    hasImageUrl: Boolean(data.imageUrl),
    options:
      data.options?.map((option, index) => ({
        index,
        id: option.id,
        text: option.text,
        isCorrect: option.isCorrect,
      })) || [],
    pairs:
      data.pairs?.map((pair, index) => ({
        index,
        id: pair.id,
        left: pair.left,
        right: pair.right,
      })) || [],
  });

  const baseData = {
    question_text: data.question,
    question_type: data.questionType,
    difficulty: data.difficulty,
    image: data.imageFile || null,
  };

  // For choice questions (single or multiple)
  if (data.questionType === "single" || data.questionType === "multiple") {
    const result = {
      ...baseData,
      options:
        data.options?.map((opt) => ({
          text: opt.text,
          is_correct: opt.isCorrect,
        })) || [],
    };
    console.log(
      "[EXAM AUDIT] transformQuizItemToExamQuestion:output",
      summarizeQuestionForAudit(result)
    );
    return result;
  }

  // For matching questions
  if (data.questionType === "matching") {
    const result = {
      ...baseData,
      matching_pairs:
        data.pairs?.map((pair) => ({
          left_text: pair.left,
          right_text: pair.right,
        })) || [],
    };
    console.log(
      "[EXAM AUDIT] transformQuizItemToExamQuestion:output",
      summarizeQuestionForAudit(result)
    );
    return result;
  }

  // Fallback (should not reach here)
  throw new Error(`Unsupported question type: ${data.questionType}`);
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
    console.log("[EXAM AUDIT] createExam:start", {
      courseId,
      examData,
      questionCount: quizItems.length,
      questionTypes: quizItems.map((item, index) => ({
        index,
        id: item.id,
        type: item.data.questionType,
      })),
    });
    setIsCreating(true);
    // Total steps: 1 (create exam) + N questions
    const totalSteps = 1 + quizItems.length;
    setProgress({ current: 0, total: totalSteps, stage: "Membuat exam..." });

    try {
      // Step 1: Create Exam

      const examResponse = await createExamContentMutation.mutateAsync(examData);

      const examId = examResponse.data.exam_id;
      console.log("[EXAM AUDIT] createExam:examCreated", {
        examId,
        response: examResponse,
      });

      setProgress({ current: 1, total: totalSteps, stage: "Menambah pertanyaan..." });

      // Step 2: Add Questions
      const failedQuestions: number[] = [];

      for (let i = 0; i < quizItems.length; i++) {
        const item = quizItems[i];
        const questionData = transformQuizItemToExamQuestion(item);
        console.log("[EXAM AUDIT] createExam:addQuestion:prepared", {
          index: i,
          itemId: item.id,
          examId,
          question: summarizeQuestionForAudit(questionData),
        });

        try {
          await addExamQuestionMutation.mutateAsync({
            examId,
            question: questionData,
          });
          console.log("[EXAM AUDIT] createExam:addQuestion:success", {
            index: i,
            itemId: item.id,
            examId,
          });
        } catch (error) {
          console.error("[EXAM AUDIT] createExam:addQuestion:error", {
            index: i,
            itemId: item.id,
            examId,
            question: summarizeQuestionForAudit(questionData),
            error,
          });
          alert(`Failed to add question ${i + 1}:` + error);
          failedQuestions.push(i);
        }

        setProgress({
          current: i + 2,
          total: totalSteps,
          stage: `Menambah pertanyaan ${i + 1}/${quizItems.length}...`,
        });
      }

      setProgress({ current: totalSteps, total: totalSteps, stage: "Selesai!" });

      // Invalidate and refetch course detail + exam list cache used by CourseDetailContainer.
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["teachingCourse", courseId] }),
        queryClient.invalidateQueries({ queryKey: ["courseExams", courseId] }),
        queryClient.refetchQueries({ queryKey: ["teachingCourse", courseId], type: "active" }),
        queryClient.refetchQueries({ queryKey: ["courseExams", courseId], type: "active" }),
      ]);

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
      console.error("[EXAM AUDIT] createExam:error", {
        courseId,
        examData,
        error,
      });
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
