"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  MaterialForm,
  MaterialContent,
} from "@/features/admin/dashboard/courses/components/material";
import { useAddContent } from "@/features/admin/dashboard/courses/hooks/useAddContent";
import { api } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config/constants";

export default function NewMaterialPage() {
  const params = useParams();
  const router = useRouter();
  const coursesId = params.coursesId as string;
  const manageCoursesId = params.manageCoursesId as string;

  const [isSaving, setIsSaving] = useState(false);

  const searchParams = useSearchParams();
  const topicId = searchParams.get("topicId") || "";

  if (!topicId) {
    console.error("NewMaterialPage: No topicId found in search params!");
  }

  // Using key to force re-render when topicId changes if needed, but not strictly necessary here.
  const addContentMutation = useAddContent(topicId);

  const handleBack = () => {
    router.push(`/dashboard-admin/courses/${coursesId}/manage/${manageCoursesId}`);
  };

  const handleSave = async (materialName: string, contents: MaterialContent[]) => {
    console.log("Starting save material...", {
      materialName,
      contentsCount: contents.length,
      topicId,
    });

    if (!materialName.trim()) {
      alert("Nama materi harus diisi");
      return;
    }

    if (!topicId) {
      alert("Error: Topic ID missing. Cannot save.");
      return;
    }

    setIsSaving(true);

    try {
      // Step 1: Create content/material
      console.log("Creating content shell...");
      const contentResponse = await addContentMutation.mutateAsync({
        title: materialName,
        type: "materi",
      });

      console.log("Content created:", contentResponse);

      const contentId = contentResponse.data.content_id;
      console.log("Content ID:", contentId);

      // Step 2: Add blocks sequentially
      for (const [index, content] of contents.entries()) {
        console.log(`Processing block ${index + 1}/${contents.length} (Type: ${content.type})`);

        if (content.type === "text") {
          console.log("Adding text block...", { content: content.content });
          const textRes = await api.post(API_ENDPOINTS.TEACHER.ADD_TEXT_BLOCK(contentId), {
            text_content: content.content,
          });
          console.log("Text block added:", textRes.data);
        } else if (content.type === "media" && content.file) {
          console.log("Adding media block...", {
            file: content.file.name,
            type: content.file.type,
          });
          const formData = new FormData();
          formData.append("file", content.file);
          formData.append("media_type", content.file.type.startsWith("image/") ? "image" : "video");

          const mediaRes = await api.post(
            API_ENDPOINTS.TEACHER.ADD_MEDIA_BLOCK(contentId),
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
          console.log("Media block added:", mediaRes.data);
        } else if (content.type === "quiz") {
          console.log("Adding quiz block...", { optionsCount: content.options.length });
          const options = content.options.map((opt) => ({
            text: opt.text,
            is_correct: opt.isCorrect,
          }));

          const quizRes = await api.post(API_ENDPOINTS.TEACHER.ADD_QUIZ_BLOCK(contentId), {
            question: content.question,
            question_type: content.isMultipleAnswer ? "multiple" : "single",
            points: content.difficulty === "hard" ? 20 : content.difficulty === "medium" ? 10 : 5,
            difficulty: content.difficulty,
            options,
          });
          console.log("Quiz block added:", quizRes.data);
        }
      }

      console.log("All blocks saved. Navigating back...");

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
