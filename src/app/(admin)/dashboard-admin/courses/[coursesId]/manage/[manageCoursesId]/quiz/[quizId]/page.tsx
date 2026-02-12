"use client";

import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { QuizFormContainer } from "@/features/admin/dashboard/courses/containers/QuizFormContainer";
import {
  useGetQuizDetails,
  QuizQuestion,
} from "@/features/admin/dashboard/courses/hooks/useGetQuizDetails";
import { QuizItem } from "@/features/admin/dashboard/courses/containers/QuizFormContainer";
import { transformApiToQuizItem } from "@/features/admin/dashboard/courses/utils/quizTransformers";

// Transform API data to QuizFormContainer format
function transformQuizDetailsToFormData(questions: QuizQuestion[]): QuizItem[] {
  return questions.map((q) => transformApiToQuizItem(q, q.question_id));
}

export default function QuizEditPage() {
  const params = useParams();
  const coursesId = params.coursesId as string;
  const manageCoursesId = params.manageCoursesId as string;
  const quizId = params.quizId as string;

  const { data: quizDetails, isLoading, isError } = useGetQuizDetails(quizId);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-lg">Memuat quiz...</span>
        </div>
      </div>
    );
  }

  if (isError || !quizDetails?.data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold">Gagal memuat quiz</h2>
          <p className="mt-2 text-white/60">Quiz tidak ditemukan atau terjadi kesalahan.</p>
        </div>
      </div>
    );
  }

  const { title, questions } = quizDetails.data;
  const initialQuizItems = transformQuizDetailsToFormData(questions);

  return (
    <QuizFormContainer
      courseId={coursesId}
      manageCoursesId={manageCoursesId}
      quizId={quizId}
      quizName={title}
      initialQuizItems={initialQuizItems}
      isEditMode
    />
  );
}
