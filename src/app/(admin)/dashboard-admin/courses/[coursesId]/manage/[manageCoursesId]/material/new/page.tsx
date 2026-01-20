"use client";

import { useParams, useRouter } from "next/navigation";
import {
  MaterialForm,
  MaterialContent,
} from "@/features/admin/dashboard/courses/components/material";

export default function MaterialDetailPage() {
  const params = useParams();
  const router = useRouter();
  const coursesId = params.coursesId as string;
  const manageCoursesId = params.manageCoursesId as string;

  const handleBack = () => {
    router.push(
      `/dashboard-admin/courses/${coursesId}/manage/${manageCoursesId}`,
    );
  };

  const handleSave = (materialName: string, contents: MaterialContent[]) => {
    console.log("Saving material:", { materialName, contents });
    // TODO: Implement save logic with API
    // For now, just navigate back
    handleBack();
  };

  return (
    <MaterialForm
      courseId={coursesId}
      courseName="Course 1"
      materialName="Course 1"
      onBack={handleBack}
      onSave={handleSave}
    />
  );
}
