"use client";

import { useState, useCallback, useMemo } from "react";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
  ExamMetadataForm,
  ExamConfigPanel,
  ExamProgressIndicator,
  ExamActionButtons,
  ExamDeleteModal,
  QuizQuestionsSection,
} from "@/features/admin/dashboard/courses/components/exam";
import {
  useCreateExam,
  CreateExamRequest,
  useAddExamQuestions,
  ExamQuestionRequest,
} from "../hooks/useCreateExam";
import { useUpdateExam } from "../hooks/useUpdateExam";
import { useDeleteExam } from "../hooks/useDeleteExam";
import { useGetExamDetails } from "../hooks/useGetExamDetails";
import { QuizData } from "@/features/admin/dashboard/courses/components/material";
import {
  formatDateTimeLocal,
  transformApiQuestionsToQuizItems,
  isValidUUID,
} from "@/features/admin/dashboard/courses/utils/examHelpers";
import { api } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config/constants";
import { DEFAULT_EXAM_STATE } from "../hooks/useExamFormState";

export interface QuizItem {
  id: string;
  data: QuizData;
}

interface ExamFormContainerProps {
  courseId: string;
  manageCoursesId: string;
  examId?: string;
  isEditMode?: boolean;
}

export function ExamFormContainer({
  courseId,
  manageCoursesId,
  examId,
  isEditMode = false,
}: ExamFormContainerProps) {
  const router = useRouter();

  // Fetch exam details if in edit mode
  const { data: examDetails, isLoading: isLoadingExam } = useGetExamDetails(
    isEditMode && examId ? examId : ""
  );

  // Derive initial values from API data
  const initialValues = useMemo(() => {
    if (isEditMode && examDetails) {
      return {
        title: examDetails.title,
        description: examDetails.description,
        duration: examDetails.duration,
        passingScore: examDetails.passing_score,
        startTime: formatDateTimeLocal(examDetails.start_time),
        endTime: formatDateTimeLocal(examDetails.end_time),
        maxAttempts: examDetails.max_attempts,
        questionsToShow: examDetails.questions_to_show,
        isRandomOrder: examDetails.is_random_order,
        isRandomSelection: examDetails.is_random_selection,
        quizItems: transformApiQuestionsToQuizItems(examDetails),
      };
    }
    return DEFAULT_EXAM_STATE;
  }, [isEditMode, examDetails]);

  // Track if user has started editing (to stop syncing with server)
  const [hasSyncedWithServer, setHasSyncedWithServer] = useState(false);

  // Exam Metadata - local state for user edits
  const [localExamTitle, setLocalExamTitle] = useState("");
  const [localExamDescription, setLocalExamDescription] = useState("");
  const [localExamDuration, setLocalExamDuration] = useState(120);
  const [localExamPassingScore, setLocalExamPassingScore] = useState(70.0);
  const [localExamStartTime, setLocalExamStartTime] = useState("");
  const [localExamEndTime, setLocalExamEndTime] = useState("");
  const [localExamMaxAttempts, setLocalExamMaxAttempts] = useState(2);
  const [localQuestionsToShow, setLocalQuestionsToShow] = useState(5);
  const [localIsRandomOrder, setLocalIsRandomOrder] = useState(false);
  const [localIsRandomSelection, setLocalIsRandomSelection] = useState(false);
  const [localQuizItems, setLocalQuizItems] = useState<QuizItem[]>([]);

  // Effective values: use server data until user starts editing
  const examTitle = hasSyncedWithServer ? localExamTitle : initialValues.title;
  const examDescription = hasSyncedWithServer ? localExamDescription : initialValues.description;
  const examDuration = hasSyncedWithServer ? localExamDuration : initialValues.duration;
  const examPassingScore = hasSyncedWithServer ? localExamPassingScore : initialValues.passingScore;
  const examStartTime = hasSyncedWithServer ? localExamStartTime : initialValues.startTime;
  const examEndTime = hasSyncedWithServer ? localExamEndTime : initialValues.endTime;
  const examMaxAttempts = hasSyncedWithServer ? localExamMaxAttempts : initialValues.maxAttempts;
  const questionsToShow = hasSyncedWithServer
    ? localQuestionsToShow
    : initialValues.questionsToShow;
  const isRandomOrder = hasSyncedWithServer ? localIsRandomOrder : initialValues.isRandomOrder;
  const isRandomSelection = hasSyncedWithServer
    ? localIsRandomSelection
    : initialValues.isRandomSelection;
  const quizItems = hasSyncedWithServer ? localQuizItems : initialValues.quizItems;

  // Helper to sync with server and then update local state
  const syncAndUpdate = useCallback(
    <T,>(setter: React.Dispatch<React.SetStateAction<T>>, value: T) => {
      if (!hasSyncedWithServer) {
        setHasSyncedWithServer(true);
        // For edit mode, sync all local state with server data first
        if (isEditMode && examDetails) {
          setLocalExamTitle(initialValues.title);
          setLocalExamDescription(initialValues.description);
          setLocalExamDuration(initialValues.duration);
          setLocalExamPassingScore(initialValues.passingScore);
          setLocalExamStartTime(initialValues.startTime);
          setLocalExamEndTime(initialValues.endTime);
          setLocalExamMaxAttempts(initialValues.maxAttempts);
          setLocalQuestionsToShow(initialValues.questionsToShow);
          setLocalIsRandomOrder(initialValues.isRandomOrder);
          setLocalIsRandomSelection(initialValues.isRandomSelection);
          setLocalQuizItems(initialValues.quizItems);
        }
      }
      setter(value);
    },
    [hasSyncedWithServer, isEditMode, examDetails, initialValues]
  );

  // Wrapped setters that sync first
  const setExamTitle = useCallback(
    (v: string) => syncAndUpdate(setLocalExamTitle, v),
    [syncAndUpdate]
  );
  const setExamDescription = useCallback(
    (v: string) => syncAndUpdate(setLocalExamDescription, v),
    [syncAndUpdate]
  );
  const setExamDuration = useCallback(
    (v: number) => syncAndUpdate(setLocalExamDuration, v),
    [syncAndUpdate]
  );
  const setExamPassingScore = useCallback(
    (v: number) => syncAndUpdate(setLocalExamPassingScore, v),
    [syncAndUpdate]
  );
  const setExamStartTime = useCallback(
    (v: string) => syncAndUpdate(setLocalExamStartTime, v),
    [syncAndUpdate]
  );
  const setExamEndTime = useCallback(
    (v: string) => syncAndUpdate(setLocalExamEndTime, v),
    [syncAndUpdate]
  );
  const setExamMaxAttempts = useCallback(
    (v: number) => syncAndUpdate(setLocalExamMaxAttempts, v),
    [syncAndUpdate]
  );
  const setQuestionsToShow = useCallback(
    (v: number) => syncAndUpdate(setLocalQuestionsToShow, v),
    [syncAndUpdate]
  );
  const setIsRandomOrder = useCallback(
    (v: boolean) => syncAndUpdate(setLocalIsRandomOrder, v),
    [syncAndUpdate]
  );
  const setIsRandomSelection = useCallback(
    (v: boolean) => syncAndUpdate(setLocalIsRandomSelection, v),
    [syncAndUpdate]
  );
  const setQuizItems = useCallback(
    (v: QuizItem[] | ((prev: QuizItem[]) => QuizItem[])) => {
      if (!hasSyncedWithServer) {
        setHasSyncedWithServer(true);
        // For edit mode, sync all local state with server data first
        if (isEditMode && examDetails) {
          setLocalExamTitle(initialValues.title);
          setLocalExamDescription(initialValues.description);
          setLocalExamDuration(initialValues.duration);
          setLocalExamPassingScore(initialValues.passingScore);
          setLocalExamStartTime(initialValues.startTime);
          setLocalExamEndTime(initialValues.endTime);
          setLocalExamMaxAttempts(initialValues.maxAttempts);
          setLocalQuestionsToShow(initialValues.questionsToShow);
          setLocalIsRandomOrder(initialValues.isRandomOrder);
          setLocalIsRandomSelection(initialValues.isRandomSelection);
          setLocalQuizItems(initialValues.quizItems);
        }
      }
      setLocalQuizItems(v);
    },
    [hasSyncedWithServer, isEditMode, examDetails, initialValues]
  );

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
    mutationFn: async ({
      questionId,
      data,
    }: {
      questionId: string;
      data: Record<string, unknown>;
    }) => {
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

  const generateId = () => `quiz-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addQuizQuestion = useCallback(() => {
    const newQuiz: QuizItem = {
      id: generateId(),
      data: {
        question: "",
        questionType: "single",
        isRequired: true,
        difficulty: "easy",
        options: [
          { id: `opt-${Date.now()}-1`, text: "", isCorrect: false },
          { id: `opt-${Date.now()}-2`, text: "", isCorrect: true },
          { id: `opt-${Date.now()}-3`, text: "", isCorrect: false },
          { id: `opt-${Date.now()}-4`, text: "", isCorrect: false },
        ],
      },
    };
    setQuizItems((prev) => [...prev, newQuiz]);
  }, [setQuizItems]);

  const updateQuizContent = useCallback(
    (id: string, data: QuizData) => {
      setQuizItems((prev) => prev.map((item) => (item.id === id ? { ...item, data } : item)));
    },
    [setQuizItems]
  );

  const moveQuiz = useCallback(
    (index: number, direction: "up" | "down") => {
      setQuizItems((prev) => {
        const newItems = [...prev];
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newItems.length) return prev;
        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
        return newItems;
      });
    },
    [setQuizItems]
  );

  const deleteQuiz = useCallback(
    async (id: string) => {
      // If in edit mode and it's an existing question (has valid UUID), call API immediately
      if (isEditMode && isValidUUID(id)) {
        try {
          await deleteQuestionMutation.mutateAsync(id);
          setQuizItems((prev) => prev.filter((item) => item.id !== id));
        } catch {
          setError("Gagal menghapus soal.");
        }
      } else {
        // Just remove from local state for new questions
        setQuizItems((prev) => prev.filter((item) => item.id !== id));
      }
    },
    [isEditMode, setQuizItems, deleteQuestionMutation]
  );

  const handleSave = async () => {
    // Validation
    if (!examTitle.trim()) {
      setError("Judul exam harus diisi");
      return;
    }

    if (!examDescription.trim()) {
      setError("Deskripsi exam harus diisi");
      return;
    }

    if (!examStartTime) {
      setError("Waktu mulai harus diisi");
      return;
    }

    if (!examEndTime) {
      setError("Waktu selesai harus diisi");
      return;
    }

    if (new Date(examStartTime) >= new Date(examEndTime)) {
      setError("Waktu selesai harus setelah waktu mulai");
      return;
    }

    if (quizItems.length === 0) {
      setError("Exam harus memiliki minimal 1 pertanyaan");
      return;
    }

    setError(null);

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
            const requestData: Record<string, unknown> = {
              question_text: item.data.question,
              question_type: item.data.questionType,
              difficulty: item.data.difficulty,
              explanation: "",
            };

            // Add options for single/multiple choice questions
            if (item.data.questionType === "single" || item.data.questionType === "multiple") {
              requestData.options =
                item.data.options?.map((opt) => ({
                  text: opt.text,
                  is_correct: opt.isCorrect,
                })) || [];
            }

            // Add matching_pairs for matching questions
            if (item.data.questionType === "matching") {
              requestData.matching_pairs =
                item.data.pairs?.map((pair) => ({
                  left_text: pair.left,
                  right_text: pair.right,
                })) || [];
            }

            await updateQuestionMutation.mutateAsync({
              questionId: item.id,
              data: requestData,
            });
          } catch {
            failedUpdates.push(item.id);
          }
        }

        // Add new questions to exam
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
              questionData.matching_pairs =
                item.data.pairs?.map((pair) => ({
                  left_text: pair.left,
                  right_text: pair.right,
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

        router.push(`/dashboard-admin/courses/${courseId}/manage/${manageCoursesId}`);
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

    // Prepare exam data
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
      if (result.failedQuestions && result.failedQuestions.length > 0) {
        console.error("Failed questions indices:", result.failedQuestions);
      }
    }
  };

  const handleDeleteExam = async () => {
    if (!examId) return;

    try {
      await deleteExamMutation.mutateAsync(examId);

      router.push(`/dashboard-admin/courses/${courseId}/manage/${manageCoursesId}`);
    } catch (err) {
      console.error("Failed to delete exam:", err);
      setError("Gagal menghapus exam");
      setShowDeleteConfirm(false);
    }
  };

  // Show loading state when fetching exam details
  if (isEditMode && isLoadingExam) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-2 text-white">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Memuat data exam...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10">
        <div className="mb-8 flex items-center gap-4">
          <Link
            href={`/dashboard-admin/courses/${courseId}`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-transparent text-white transition-colors hover:bg-[#E68E00]"
          >
            <ChevronLeft size={24} />
          </Link>
          <span className="text-lg text-white">Course / Course Details</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-white">
          {isEditMode ? "Edit Exam" : "Tambah Exam"}
        </h1>

        {/* Exam Metadata Section */}
        <ExamMetadataForm
          title={examTitle}
          onTitleChange={setExamTitle}
          description={examDescription}
          onDescriptionChange={setExamDescription}
          duration={examDuration}
          onDurationChange={setExamDuration}
          passingScore={examPassingScore}
          onPassingScoreChange={setExamPassingScore}
          startTime={examStartTime}
          onStartTimeChange={setExamStartTime}
          endTime={examEndTime}
          onEndTimeChange={setExamEndTime}
          maxAttempts={examMaxAttempts}
          onMaxAttemptsChange={setExamMaxAttempts}
          examCode={isEditMode ? examDetails?.exam_code : undefined}
        />

        {/* Exam Configuration Section - Only shown in edit mode */}
        {isEditMode && (
          <ExamConfigPanel
            questionsToShow={questionsToShow}
            onQuestionsToShowChange={setQuestionsToShow}
            isRandomOrder={isRandomOrder}
            onRandomOrderChange={setIsRandomOrder}
            isRandomSelection={isRandomSelection}
            onRandomSelectionChange={setIsRandomSelection}
            totalQuestions={quizItems.length}
          />
        )}

        {/* Quiz Questions Section */}
        <QuizQuestionsSection
          quizItems={quizItems}
          onAddQuestion={addQuizQuestion}
          onUpdateContent={updateQuizContent}
          onMoveQuiz={moveQuiz}
          onDeleteQuestion={deleteQuiz}
          onClearAll={() => setQuizItems([])}
        />

        {/* Error Message */}
        {error && <div className="mt-6 rounded-lg bg-red-500/20 p-4 text-red-200">{error}</div>}

        {/* Progress Indicator */}
        {isCreating && (
          <div className="mt-6">
            <ExamProgressIndicator
              stage={progress.stage}
              current={progress.current}
              total={progress.total}
            />
          </div>
        )}

        <ExamActionButtons
          isEditMode={isEditMode}
          isCreating={isCreating}
          isUpdating={updateExamMutation.isPending || isUpdatingQuestions}
          isDeleting={deleteExamMutation.isPending}
          onSave={handleSave}
          onDeleteRequest={() => setShowDeleteConfirm(true)}
          examId={examId}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <ExamDeleteModal
        isOpen={showDeleteConfirm}
        isDeleting={deleteExamMutation.isPending}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteExam}
      />
    </div>
  );
}
