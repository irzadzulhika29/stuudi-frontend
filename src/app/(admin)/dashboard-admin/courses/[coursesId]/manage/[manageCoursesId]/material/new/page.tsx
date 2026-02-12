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
    alert("No topicId found in search params!");
  }

  const addContentMutation = useAddContent(topicId);

  const { showToast } = useToast();

  const handleBack = () => {
    router.push(`/dashboard-admin/courses/${courseId}/manage/${manageCourseId}`);
  };

  const handleSave = async (materialName: string, contents: MaterialContent[]) => {
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
          const formData = new FormData();
          formData.append("file", content.file);
          formData.append("media_type", content.file.type.startsWith("image/") ? "image" : "video");

          await api.post(API_ENDPOINTS.TEACHER.ADD_MEDIA_BLOCK(contentId), formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else if (content.type === "quiz") {
          const requestData: {
            question: string;
            question_type: string;
            difficulty: string;
            explanation: string;
            options?: { text: string; is_correct: boolean }[];
            matching_pairs?: { left_text: string; right_text: string }[];
          } = {
            question: content.question,
            question_type: content.questionType || "single",
            difficulty: content.difficulty || "medium",
            explanation: "",
          };

          if (content.questionType === "matching") {
            requestData.matching_pairs =
              content.pairs?.map((pair) => ({
                left_text: pair.left,
                right_text: pair.right,
              })) || [];
          } else {
            requestData.options =
              content.options?.map((opt) => ({
                text: opt.text,
                is_correct: opt.isCorrect,
              })) || [];
          }

          await api.post(API_ENDPOINTS.TEACHER.ADD_QUIZ_BLOCK(contentId), requestData);
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
