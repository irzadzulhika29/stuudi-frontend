"use client";

import { useParams } from "next/navigation";
import { CourseDetailContainer } from "@/features/user/courses/containers/CourseDetailContainer";
import { ErrorBoundary } from "@/shared/components/ui/ErrorBoundary";

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  return (
    <ErrorBoundary>
      <CourseDetailContainer courseId={courseId} />
    </ErrorBoundary>
  );
}
