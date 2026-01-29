"use client";

import { useParams } from "next/navigation";
import { CourseDetailContainer } from "@/features/user/courses/containers/CourseDetailContainer";

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  return <CourseDetailContainer courseId={courseId} />;
}
