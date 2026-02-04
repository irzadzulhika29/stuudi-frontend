import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config/constants";
import {
  useCreateExam,
  CreateExamRequest,
  useAddExamQuestions,
  ExamQuestionRequest,
} from "./useCreateExam";
import { useUpdateExam } from "./useUpdateExam";
import { useDeleteExam } from "./useDeleteExam";
import { isValidUUID } from "../utils";
import { QuizItem } from "../types";

interface UpdateQuestionData {
  question_text: string;
  question_type: "single" | "multiple" | "matching";
  difficulty: "easy" | "medium" | "hard";
  explanation: string;
  options?: Array<{
    text: string;
    is_correct: boolean;
  }>;
  pairs?: Array<{
    left: string;
    right: string;
  }>;
}

interface UseExamFormHandlersProps {
  courseId: string;
  manageCoursesId: string;
  examId?: string;
  isEditMode: boolean;
  quizItems: QuizItem[];
  examTitle: string;
  examDescription: string;
  examDuration: number;
  examPassingScore: number;
  examStartTime: string;
  examEndTime: string;
  examMaxAttempts: number;
  questionsToShow: number;
  isRandomOrder: boolean;
  isRandomSelection: boolean;
  deleteQuiz: (id: string) => void;
}

export function useExamFormHandlers({
  courseId,
  manageCoursesId,
  examId,
  isEditMode,
  quizItems,
  examTitle,
  examDescription,
  examDuration,
  examPassingScore,
  examStartTime,
  examEndTime,
  examMaxAttempts,
  questionsToShow,
  isRandomOrder,
  isRandomSelection,
  deleteQuiz,
}: UseExamFormHandlersProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isUpdatingQuestions, setIsUpdatingQuestions] = useState(false);

  // Hooks
  const { createExam, isCreating, progress } = useCreateExam(courseId);
  const updateExamMutation = useUpdateExam(examId || "");
  const deleteExamMutation = useDeleteExam();
  const addExamQuestionMutation = useAddExamQuestions();

  // Mutation for updating individual question
  const updateQuestionMutation = useMutation({
    mutationFn: async ({ questionId, data }: { questionId: string; data: UpdateQuestionData }) => {
      const response = await api.patch(API_ENDPOINTS.TEACHER.UPDATE_QUESTION(questionId), data);
      return response.data;
    },
  });

  // Mutation for deleting individual question
  const deleteQuestionMutation = useMutation({
    mutationFn: async (questionId: string) => {
      const response = await api.delete(API_ENDPOINTS.TEACHER.DELETE_QUESTION(questionId));
      return response.data;
    },
  });

  // Validation helper
  const validateExamData = useCallback((): boolean => {
    if (!examTitle.trim()) {
      setError("Judul exam harus diisi");
      return false;
    }

    if (!examDescription.trim()) {
      setError("Deskripsi exam harus diisi");
      return false;
    }

    if (!examStartTime) {
      setError("Waktu mulai harus diisi");
      return false;
    }

    if (!examEndTime) {
      setError("Waktu selesai harus diisi");
      return false;
    }

    if (new Date(examStartTime) >= new Date(examEndTime)) {
      setError("Waktu selesai harus setelah waktu mulai");
      return false;
    }

    if (quizItems.length === 0) {
      setError("Exam harus memiliki minimal 1 pertanyaan");
      return false;
    }

    setError(null);
    return true;
  }, [examTitle, examDescription, examStartTime, examEndTime, quizItems]);

  // Handle delete question - simplified without confirmation
  const handleDeleteQuestion = useCallback(
    async (id: string) => {
      // If in edit mode and it's an existing question (has valid UUID), call API
      if (isEditMode && isValidUUID(id)) {
        try {
          await deleteQuestionMutation.mutateAsync(id);
          deleteQuiz(id);
        } catch {
          setError("Gagal menghapus soal.");
        }
      } else {
        // Just remove from local state for new questions
        deleteQuiz(id);
      }
    },
    [isEditMode, deleteQuiz, deleteQuestionMutation]
  );

  // Handle save exam
  const handleSave = async () => {
    if (!validateExamData()) return;

    if (isEditMode && examId) {
      // Update exam with questions
      try {
        setIsUpdatingQuestions(true);
        setError(null);

        // Update exam metadata first
        await updateExamMutation.mutateAsync({
          title: examTitle,
          description: examDescription,
          duration: examDuration,
          passing_score: examPassingScore,
          start_time: new Date(examStartTime).toISOString(),
          end_time: new Date(examEndTime).toISOString(),
          max_attempts: examMaxAttempts,
          questions_to_show: questionsToShow,
          is_random_order: isRandomOrder,
          is_random_selection: isRandomSelection,
        });

        // Separate existing questions (valid UUID) and new questions (no valid UUID)
        const existingQuestions = quizItems.filter((item) => isValidUUID(item.id));
        const newQuestions = quizItems.filter((item) => !isValidUUID(item.id));

        const failedUpdates: string[] = [];
        const failedCreates: string[] = [];

        // Update existing questions
        for (const item of existingQuestions) {
          try {
            const requestData: UpdateQuestionData = {
              question_text: item.data.question,
              question_type: item.data.questionType,
              difficulty: item.data.difficulty,
              explanation: "",
              options:
                item.data.options?.map((opt) => ({
                  text: opt.text,
                  is_correct: opt.isCorrect,
                })) || [],
            };

            await updateQuestionMutation.mutateAsync({
              questionId: item.id,
              data: requestData,
            });
          } catch {
            failedUpdates.push(item.id);
          }
        }

        // Add new questions
        for (const item of newQuestions) {
          try {
            const questionData: ExamQuestionRequest = {
              question_text: item.data.question,
              question_type: item.data.questionType,
              difficulty: item.data.difficulty,
            };

            // Add options for single/multiple choice questions
            if (item.data.questionType === "single" || item.data.questionType === "multiple") {
              questionData.options =
                item.data.options?.map((opt) => ({
                  text: opt.text,
                  is_correct: opt.isCorrect,
                })) || [];
            }

            // Add pairs for matching questions
            if (item.data.questionType === "matching") {
              questionData.pairs =
                item.data.pairs?.map((pair) => ({
                  left: pair.left,
                  right: pair.right,
                })) || [];
            }

            await addExamQuestionMutation.mutateAsync({
              examId,
              question: questionData,
            });
          } catch {
            failedCreates.push(item.id);
          }
        }

        // Show error message if any operations failed
        const errors: string[] = [];
        if (failedUpdates.length > 0) {
          errors.push(`${failedUpdates.length} soal gagal diupdate`);
        }
        if (failedCreates.length > 0) {
          errors.push(`${failedCreates.length} soal baru gagal ditambahkan`);
        }

        if (errors.length > 0) {
          setError(errors.join(", ") + ".");
        }

        router.push(`/dashboard-admin/courses/${courseId}`);
      } catch (err: unknown) {
        const axiosError = err as { response?: { data?: { message?: string; data?: string } } };
        const errorMessage =
          axiosError.response?.data?.message ||
          axiosError.response?.data?.data ||
          "Gagal mengupdate exam";
        setError(`Gagal mengupdate exam: ${errorMessage}`);
      } finally {
        setIsUpdatingQuestions(false);
      }
      return;
    }

    // Create new exam
    const examData: CreateExamRequest = {
      title: examTitle,
      description: examDescription,
      duration: examDuration,
      passing_score: examPassingScore,
      start_time: new Date(examStartTime).toISOString(),
      end_time: new Date(examEndTime).toISOString(),
      max_attempts: examMaxAttempts,
      questions_to_show: questionsToShow,
      is_random_order: isRandomOrder,
      is_random_selection: isRandomSelection,
    };

    const result = await createExam(examData, quizItems);

    if (result.success) {
      router.push(`/dashboard-admin/courses/${courseId}/manage/${manageCoursesId}`);
    } else {
      setError(result.error || "Gagal membuat exam");
    }
  };

  // Handle delete exam
  const handleDeleteExam = async () => {
    if (!examId) return;

    try {
      await deleteExamMutation.mutateAsync(examId);
      router.push(`/dashboard-admin/courses/${courseId}/manage/${manageCoursesId}`);
    } catch {
      setError("Gagal menghapus exam");
      setShowDeleteConfirm(false);
    }
  };

  const isLoading =
    isCreating ||
    updateExamMutation.isPending ||
    deleteExamMutation.isPending ||
    deleteQuestionMutation.isPending ||
    addExamQuestionMutation.isPending ||
    isUpdatingQuestions;

  return {
    // State
    error,
    showDeleteConfirm,
    isLoading,
    isCreating,
    isUpdatingQuestions,
    progress,

    // State setters
    setError,
    setShowDeleteConfirm,

    // Handlers
    handleSave,
    handleDeleteExam,
    handleDeleteQuestion,

    // Mutations
    deleteExamMutation,
  };
}
