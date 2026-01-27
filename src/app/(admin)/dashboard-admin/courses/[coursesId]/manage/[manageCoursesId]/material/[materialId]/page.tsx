"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  MaterialForm,
  MaterialContent,
} from "@/features/admin/dashboard/courses/components/material";
import { useAddContent } from "@/features/admin/dashboard/courses/hooks/useAddContent";
import { api } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config/constants";

export default function MaterialDetailPage() {
  const params = useParams();
  const router = useRouter();
  const coursesId = params.coursesId as string;
  const manageCoursesId = params.manageCoursesId as string;
  // materialId in this route is actually topicId when adding new material
  const topicId = params.materialId as string;

  const [isSaving, setIsSaving] = useState(false);

  const addContentMutation = useAddContent(topicId);

  const handleBack = () => {
    router.push(`/dashboard-admin/courses/${coursesId}/manage/${manageCoursesId}`);
  };

  const handleSave = async (materialName: string, contents: MaterialContent[]) => {
    if (!materialName.trim()) {
      alert("Nama materi harus diisi");
      return;
    }

    setIsSaving(true);

    try {
      // Step 1: Create content/material
      const contentResponse = await addContentMutation.mutateAsync({
        title: materialName,
        type: "materi",
      });

      const contentId = contentResponse.data.content_id;

      // Step 2: Add blocks sequentially
      for (const content of contents) {
        if (content.type === "text") {
          await api.post(API_ENDPOINTS.TEACHER.ADD_TEXT_BLOCK(contentId), {
            text_content: content.content,
          });
        } else if (content.type === "media" && content.file) {
          const formData = new FormData();
          formData.append("file", content.file);
          formData.append("media_type", content.file.type.startsWith("image/") ? "image" : "video");

          await api.post(API_ENDPOINTS.TEACHER.ADD_MEDIA_BLOCK(contentId), formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else if (content.type === "quiz") {
          const options = content.options.map((opt) => ({
            text: opt.text,
            is_correct: opt.isCorrect,
          }));

          await api.post(API_ENDPOINTS.TEACHER.ADD_QUIZ_BLOCK(contentId), {
            question: content.question,
            question_type: content.isMultipleAnswer ? "multiple" : "single",
            difficulty: content.difficulty,
            options,
          });
        }
      }

      // Success - navigate back
      handleBack();
    } catch (error) {
      console.error("Failed to save material:", error);
      alert("Gagal menyimpan materi. Silakan coba lagi.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MaterialForm
      courseId={coursesId}
      courseName="Course"
      materialName=""
      onBack={handleBack}
      onSave={handleSave}
      isSaving={isSaving}
    />
  );
}
