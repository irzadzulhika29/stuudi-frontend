"use client";

import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  ExamMetadataForm,
  ExamConfigPanel,
  ExamProgressIndicator,
  QuizQuestionsSection,
  ExamFormActions,
} from "@/features/admin/dashboard/courses/components/exam";
import { ConfirmDeleteModal } from "@/shared/components/ui/ConfirmDeleteModal";
import { useExamFormState } from "../hooks/useExamFormState";
import { useExamFormHandlers } from "../hooks/useExamFormHandlers";

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
  // State management
  const {
    examDetails,
    isLoadingExam,
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
    quizItems,
    setExamTitle,
    setExamDescription,
    setExamDuration,
    setExamPassingScore,
    setExamStartTime,
    setExamEndTime,
    setExamMaxAttempts,
    setQuestionsToShow,
    setIsRandomOrder,
    setIsRandomSelection,
    setQuizItems,
    addQuizQuestion,
    updateQuizContent,
    moveQuiz,
    deleteQuiz,
  } = useExamFormState({ examId, isEditMode });

  // Handlers
  const {
    error,
    showDeleteConfirm,
    isLoading,
    isCreating,
    isUpdatingQuestions,
    progress,
    setShowDeleteConfirm,
    handleSave,
    handleDeleteExam,
    handleDeleteQuestion,
    deleteExamMutation,
  } = useExamFormHandlers({
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
  });

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
          onDeleteQuestion={handleDeleteQuestion}
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

        {/* Submit Button */}
        <div className="mt-6">
          <ExamFormActions
            isEditMode={isEditMode}
            isLoading={isLoading}
            isCreating={isCreating}
            isUpdating={isUpdatingQuestions}
            onSave={handleSave}
            onDelete={isEditMode && examId ? () => setShowDeleteConfirm(true) : undefined}
          />
        </div>
      </div>

      {/* Delete Exam Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteExam}
        title="Hapus Exam?"
        message="Apakah Anda yakin ingin menghapus exam ini? Tindakan ini tidak dapat dibatalkan."
        isLoading={deleteExamMutation.isPending}
      />
    </div>
  );
}
