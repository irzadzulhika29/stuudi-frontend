"use client";

import { useParams } from "next/navigation";
import { CourseDetailContainer } from "@/features/admin/dashboard/courses/containers/CourseDetailContainer";

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.coursesId as string;

  return <CourseDetailContainer courseId={courseId} />;
}
