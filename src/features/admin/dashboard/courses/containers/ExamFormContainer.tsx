"use client";

import { useState, useCallback, useMemo } from "react";
import { ChevronLeft, Plus, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QuizBox, QuizData } from "@/features/admin/dashboard/courses/components/material";
import {
  ExamMetadataForm,
  ExamConfigPanel,
  ExamProgressIndicator,
  ExamActionButtons,
  ExamDeleteModal,
} from "@/features/admin/dashboard/courses/components/exam";
import { useCreateExam, CreateExamRequest } from "../hooks/useCreateExam";
import { useUpdateExam } from "../hooks/useUpdateExam";
import { useDeleteExam } from "../hooks/useDeleteExam";
import { useGetExamDetails, ExamDetails } from "../hooks/useGetExamDetails";

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

// Helper to format ISO date to datetime-local input format
function formatDateTimeLocal(isoString: string): string {
  if (!isoString) return "";
  const date = new Date(isoString);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
}

// Helper to transform API questions to QuizItem format
function transformApiQuestionsToQuizItems(examDetails: ExamDetails): QuizItem[] {
  return examDetails.questions.map((q) => ({
    id: q.question_id,
    data: {
      question: q.question_text,
      questionType: "multiple_choice" as const,
      isRequired: true,
      isMultipleAnswer: q.question_type === "multiple",
      difficulty: q.difficulty,
      options: q.options
        .sort((a, b) => a.sequence - b.sequence)
        .map((opt) => ({
          id: opt.option_id,
          text: opt.option_text,
          isCorrect: opt.is_correct,
        })),
    },
  }));
}

// Default values
const DEFAULT_EXAM_STATE = {
  title: "",
  description: "",
  duration: 120,
  passingScore: 70.0,
  startTime: "",
  endTime: "",
  maxAttempts: 2,
  questionsToShow: 5,
  isRandomOrder: false,
  isRandomSelection: false,
  quizItems: [] as QuizItem[],
};

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

  // Hooks
  const { createExam, isCreating, progress } = useCreateExam(courseId);
  const updateExamMutation = useUpdateExam(examId || "");
  const deleteExamMutation = useDeleteExam();

  const generateId = () => `quiz-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addQuizQuestion = useCallback(() => {
    const newQuiz: QuizItem = {
      id: generateId(),
      data: {
        question: "",
        questionType: "multiple_choice",
        isRequired: true,
        isMultipleAnswer: false,
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
    (id: string) => {
      setQuizItems((prev) => prev.filter((item) => item.id !== id));
    },
    [setQuizItems]
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
      // Update exam
      try {
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

        router.push(`/dashboard-admin/courses/${courseId}/manage/${manageCoursesId}`);
      } catch (err) {
        console.error("Failed to update exam:", err);
        setError("Gagal mengupdate exam");
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
      <div className="sticky top-0 z-10">
        <div className="mb-8 flex items-center gap-4">
          <Link
            href={`/dashboard-admin/courses/${courseId}/manage/${manageCoursesId}`}
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
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Soal Exam</h2>

          <div className="space-y-4">
            {quizItems.map((item, index) => (
              <QuizBox
                key={item.id}
                id={item.id}
                data={item.data}
                onChange={updateQuizContent}
                onMoveUp={() => moveQuiz(index, "up")}
                onMoveDown={() => moveQuiz(index, "down")}
                onDelete={() => deleteQuiz(item.id)}
                canMoveUp={index > 0}
                canMoveDown={index < quizItems.length - 1}
              />
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="text-neutral-gray hover:text-error hover:bg-error/10 rounded-lg p-2 transition-all"
              title="Hapus semua"
              onClick={() => setQuizItems([])}
            >
              <Trash2 className="hover:text-gray h-5 w-5 text-white" />
            </button>
            <button
              type="button"
              onClick={addQuizQuestion}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-dashed border-white/50 bg-transparent px-6 py-3 text-white transition-all hover:border-white hover:bg-white/20"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">Tambah Pertanyaan</span>
            </button>
          </div>

          {/* Error Message */}
          {error && <div className="rounded-lg bg-red-500/20 p-4 text-red-200">{error}</div>}

          {/* Progress Indicator */}
          {isCreating && (
            <ExamProgressIndicator
              stage={progress.stage}
              current={progress.current}
              total={progress.total}
            />
          )}

          {/* Submit Button */}
          {/* Submit Buttons */}
          <ExamActionButtons
            isEditMode={isEditMode}
            isCreating={isCreating}
            isUpdating={updateExamMutation.isPending}
            isDeleting={deleteExamMutation.isPending}
            onSave={handleSave}
            onDeleteRequest={() => setShowDeleteConfirm(true)}
            examId={examId}
          />
        </div>
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
