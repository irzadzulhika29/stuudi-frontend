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
import { useToast } from "@/shared/components/ui/Toast";

// Helper to check if ID is a valid UUID (existing from API)
function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

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
      // Store questionId as id, and blockId separately for API calls
      for (const question of block.questions) {
        const options: QuizOption[] = question.options.map((opt) => ({
          id: opt.option_id,
          text: opt.option_text,
          isCorrect: opt.is_correct,
        }));

        const quizContent: QuizContent = {
          id: question.question_id, // Use questionId for UPDATE_QUESTION endpoint
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
  const { data: contentData, isLoading } = useGetContentDetails(isEditMode ? materialId : null);

  // Debug logs

  // Transform API data to form format
  const initialContents = useMemo(() => {
    if (!contentData?.data?.blocks) {
      return [];
    }
    const transformed = transformBlocksToContents(contentData.data.blocks);

    return transformed;
  }, [contentData]);

  const initialMaterialName = contentData?.data?.title || "";

  const { showToast } = useToast();

  const addContentMutation = useAddContent(topicId);

  const handleBack = () => {
    router.push(`/dashboard-admin/courses/${coursesId}/manage/${manageCoursesId}`);
  };

  const handleSave = async (materialName: string, contents: MaterialContent[]) => {
    if (!materialName.trim()) {
      showToast("Nama materi harus diisi", "warning");
      return;
    }

    setIsSaving(true);

    try {
      let contentId: string;

      if (isEditMode) {
        // For edit mode, we already have the content ID
        contentId = materialId;

        // Update existing blocks (only those with valid UUID from API)
        for (const content of contents) {
          // Skip new content that doesn't have a valid UUID yet
          if (!isValidUUID(content.id)) {
            continue;
          }

          if (content.type === "text") {
            await api.patch(API_ENDPOINTS.TEACHER.UPDATE_BLOCK_TEXT(content.id), {
              text_content: content.content,
            });
          } else if (content.type === "media") {
            const formData = new FormData();
            if (content.file) {
              formData.append("file", content.file);
              formData.append(
                "media_type",
                content.file.type.startsWith("image/") ? "image" : "video"
              );
            } else if (content.embedUrl) {
              formData.append("media_type", "video");
              formData.append("youtube_url", content.embedUrl);
            }

            if (content.file || content.embedUrl) {
              await api.patch(API_ENDPOINTS.TEACHER.UPDATE_BLOCK_MEDIA(content.id), formData, {
                headers: { "Content-Type": "multipart/form-data" },
              });
            }
          } else if (content.type === "quiz") {
            // Quiz content ID is question_id, use UPDATE_QUESTION endpoint
            const options = content.options.map((opt) => ({
              text: opt.text,
              is_correct: opt.isCorrect,
            }));

            await api.patch(API_ENDPOINTS.TEACHER.UPDATE_QUESTION(content.id), {
              question_text: content.question,
              question_type: content.isMultipleAnswer ? "multiple" : "single",
              difficulty: content.difficulty || "medium",
              explanation: "",
              options,
            });
          }
        }

        // Also create NEW blocks that were added during edit mode
        for (const content of contents) {
          // Only process new content (no valid UUID)
          if (isValidUUID(content.id)) {
            continue;
          }

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
              difficulty: content.difficulty || "medium",
              options,
            });
          }
        }
      } else {
        // Step 1: Create content/material
        const contentResponse = await addContentMutation.mutateAsync({
          title: materialName,
          type: "materi",
        });
        contentId = contentResponse.data.content_id;

        // Step 2: Add blocks sequentially (for new content only)
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
      showToast("Gagal menyimpan materi. Silakan coba lagi.", "error");
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
