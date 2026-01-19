"use client";

import { useParams, useRouter } from "next/navigation";
import { QuizFormContainer } from "@/features/admin/dashboard/courses/containers/QuizFormContainer";

export default function QuizDetailPage() {
  const params = useParams();
  const router = useRouter();
  const coursesId = params.coursesId as string;
  const manageCoursesId = params.manageCoursesId as string;

  const handleSave = (quizName: string, quizItems: any[]) => {
    console.log("Saving quiz:", { quizName, quizItems });
    router.push(
      `/dashboard-admin/courses/${coursesId}/manage/${manageCoursesId}`,
    );
  };

  return (
    <QuizFormContainer
      courseId={coursesId}
      manageCoursesId={manageCoursesId}
      onSave={handleSave}
    />
  );
}
