"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo } from "react";
import {
  MaterialForm,
  MaterialContent,
} from "@/features/admin/dashboard/courses/components/material";
import { useAddContent } from "@/features/admin/dashboard/courses/hooks/useAddContent";
import {
  useGetContentDetails,
  ContentBlock,
} from "@/features/admin/dashboard/courses/hooks/useGetContentDetails";
import { api } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config/constants";
import {
  TextContent,
  MediaContent,
  QuizContent,
  QuizOption,
} from "@/features/admin/dashboard/courses/components/material/AddContentButtons";

// Transform API blocks to MaterialContent format
function transformBlocksToContents(blocks: ContentBlock[]): MaterialContent[] {
  const contents: MaterialContent[] = [];

  for (const block of blocks) {
    if (block.type === "text" && block.text_content) {
      const textContent: TextContent = {
        id: block.block_id,
        type: "text",
        content: block.text_content,
      };
      contents.push(textContent);
    } else if (block.type === "media" && block.media_url) {
      const mediaContent: MediaContent = {
        id: block.block_id,
        type: "media",
        file: null,
        embedUrl: "", // Leave empty for embed URL field
        previewUrl: block.media_type === "image" ? block.media_url : undefined,
        mediaType: block.media_type,
      };
      contents.push(mediaContent);
    } else if (block.type === "quiz" && block.questions) {
      // Each question in the quiz block becomes a separate QuizContent
      for (const question of block.questions) {
        const options: QuizOption[] = question.options.map((opt) => ({
          id: opt.option_id,
          text: opt.option_text,
          isCorrect: opt.is_correct,
        }));

        const quizContent: QuizContent = {
          id: question.question_id,
          type: "quiz",
          question: question.question_text,
          questionType: "multiple_choice",
          isRequired: true,
          isMultipleAnswer: question.question_type === "multiple",
          difficulty: "medium",
          options,
        };
        contents.push(quizContent);
      }
    }
  }

  return contents;
}

export default function MaterialDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const coursesId = params.coursesId as string;
  const manageCoursesId = params.manageCoursesId as string;
  const materialId = params.materialId as string;

  // Check if this is edit mode (materialId is not "new" and not a topicId from query)
  const topicIdFromQuery = searchParams.get("topicId");
  const isEditMode = materialId !== "new" && !topicIdFromQuery;

  // For new materials, topicId comes from query param; for edit, we'll get it from content details
  const topicId = topicIdFromQuery || materialId;

  const [isSaving, setIsSaving] = useState(false);

  // Fetch content details when editing
  const {
    data: contentData,
    isLoading,
    error,
  } = useGetContentDetails(isEditMode ? materialId : null);

  // Debug logs
  console.log("=== MaterialDetailPage Debug ===");
  console.log("materialId:", materialId);
  console.log("topicIdFromQuery:", topicIdFromQuery);
  console.log("isEditMode:", isEditMode);
  console.log("isLoading:", isLoading);
  console.log("error:", error);
  console.log("contentData:", contentData);

  // Transform API data to form format
  const initialContents = useMemo(() => {
    if (!contentData?.data?.blocks) {
      console.log("No blocks found in contentData");
      return [];
    }
    const transformed = transformBlocksToContents(contentData.data.blocks);
    console.log("Transformed contents:", transformed);
    return transformed;
  }, [contentData]);

  const initialMaterialName = contentData?.data?.title || "";
  console.log("initialMaterialName:", initialMaterialName);
  console.log("initialContents:", initialContents);

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
      let contentId: string;

      if (isEditMode) {
        // For edit mode, we already have the content ID
        contentId = materialId;
        // TODO: Add API call to update content title if needed
      } else {
        // Step 1: Create content/material
        const contentResponse = await addContentMutation.mutateAsync({
          title: materialName,
          type: "materi",
        });
        contentId = contentResponse.data.content_id;
      }

      // Step 2: Add blocks sequentially (for new content only)
      // For edit mode, blocks already exist - would need update/delete APIs
      if (!isEditMode) {
        for (const content of contents) {
          if (content.type === "text") {
            await api.post(API_ENDPOINTS.TEACHER.ADD_TEXT_BLOCK(contentId), {
              text_content: content.content,
            });
          } else if (content.type === "media" && content.file) {
            const formData = new FormData();
            formData.append("file", content.file);
            formData.append(
              "media_type",
              content.file.type.startsWith("image/") ? "image" : "video"
            );

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

  // Handle content deletion based on type
  const handleDeleteContent = async (id: string, type: "text" | "media" | "quiz") => {
    if (type === "quiz") {
      // Quiz content uses question_id, so call DELETE_QUESTION
      await api.delete(API_ENDPOINTS.TEACHER.DELETE_QUESTION(id));
    } else {
      // Text and Media use block_id, so call DELETE_BLOCK
      await api.delete(API_ENDPOINTS.TEACHER.DELETE_BLOCK(id));
    }
  };

  // Show loading state when fetching content for edit mode
  if (isEditMode && isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-white">Memuat data...</div>
      </div>
    );
  }

  return (
    <MaterialForm
      courseId={coursesId}
      courseName="Course"
      materialName={initialMaterialName}
      onBack={handleBack}
      onSave={handleSave}
      isSaving={isSaving}
      initialContents={initialContents}
      isEditMode={isEditMode}
      onDeleteContent={handleDeleteContent}
    />
  );
}
