"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { MaterialContent } from "@/features/admin/dashboard/courses/components/material/AddContentButtons";
import { MaterialForm } from "@/features/admin/dashboard/courses/components/material/MaterialForm";
import { useAddContent } from "@/features/admin/dashboard/courses/hooks/useAddContent";
import { useToast } from "@/shared/components/ui/Toast";
import { api } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config/constants";

export default function NewMaterialPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.coursesId as string;
  const manageCourseId = params.manageCoursesId as string;

  const [isSaving, setIsSaving] = useState(false);

  const searchParams = useSearchParams();
  const topicId = searchParams.get("topicId") || "";

  if (!topicId) {
    console.error("NewMaterialPage: No topicId found in search params!");
  }

  // Using key to force re-render when topicId changes if needed, but not strictly necessary here.
  const addContentMutation = useAddContent(topicId);

  const { showToast } = useToast();

  const handleBack = () => {
    router.push(`/dashboard-admin/courses/${courseId}/manage/${manageCourseId}`);
  };

  const handleSave = async (materialName: string, contents: MaterialContent[]) => {
    // console.log("Starting save material...", {
    //   materialName,
    //   contentsCount: contents.length,
    //   topicId,
    // });

    if (!materialName.trim()) {
      showToast("Nama materi harus diisi", "warning");
      return;
    }

    if (!topicId) {
      showToast("Error: Topic ID missing. Cannot save.", "error");
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
          // console.log("Adding media block...", {
          //   file: content.file.name,
          //   type: content.file.type,
          // });
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
            id: opt.id,
          }));

          await api.post(API_ENDPOINTS.TEACHER.ADD_QUIZ_BLOCK(contentId), {
            question: content.question,
            difficulty: content.difficulty,
            options,
          });
        }
      }

      // Success - navigate back
      showToast("Materi berhasil disimpan", "success");
      handleBack();
    } catch (error) {
      console.error("Failed to save material:", error);
      showToast("Gagal menyimpan materi. Silakan coba lagi.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MaterialForm
      courseId={courseId}
      courseName="Course"
      materialName=""
      onBack={handleBack}
      onSave={handleSave}
      isSaving={isSaving}
    />
  );
}
