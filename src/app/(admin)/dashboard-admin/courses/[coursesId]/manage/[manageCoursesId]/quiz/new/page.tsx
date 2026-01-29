"use client";

import { useParams, useSearchParams } from "next/navigation";
import { QuizFormContainer } from "@/features/admin/dashboard/courses/containers/QuizFormContainer";

export default function QuizDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const coursesId = params.coursesId as string;
  const manageCoursesId = params.manageCoursesId as string;
  const topicId = searchParams.get("topicId") || "";

  return (
    <QuizFormContainer
      courseId={coursesId}
      manageCoursesId={manageCoursesId}
      topicId={topicId}
    />
  );
}
