"use client";

import { useState, useCallback } from "react";
import { ChevronLeft } from "lucide-react";
import { TextContentBox } from "./TextContentBox";
import { MediaBox } from "./MediaBox";
import { QuizBox, QuizData } from "./QuizBox";
import {
  AddContentButtons,
  MaterialContent,
  TextContent,
  MediaContent,
  QuizContent,
} from "./AddContentButtons";
import Link from "next/link";
import { useToast } from "@/shared/components/ui/Toast";

interface MaterialFormProps {
  courseId: string;
  courseName: string;
  materialName: string;
  onBack: () => void;
  onSave: (materialName: string, contents: MaterialContent[]) => void;
  isSaving?: boolean;
  initialContents?: MaterialContent[];
  isEditMode?: boolean;
  pageTitle?: string;
  onDeleteContent?: (id: string, type: "text" | "media" | "quiz") => Promise<void>;
}

export function MaterialForm({
  courseId,
  materialName: initialMaterialName,
  onSave,
  isSaving = false,
  initialContents = [],
  isEditMode = false,
  pageTitle,
  onDeleteContent,
}: MaterialFormProps) {
  const [materialName, setMaterialName] = useState(initialMaterialName);
  const [contents, setContents] = useState<MaterialContent[]>(initialContents);
  const { showToast } = useToast();

  const generateId = () => `content-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addTextContent = useCallback(() => {
    const newContent: TextContent = {
      id: generateId(),
      type: "text",
      content: "",
    };
    setContents((prev) => [...prev, newContent]);
  }, []);

  const addMediaContent = useCallback(() => {
    const newContent: MediaContent = {
      id: generateId(),
      type: "media",
      file: null,
      embedUrl: "",
    };
    setContents((prev) => [...prev, newContent]);
  }, []);

  const addQuizContent = useCallback(() => {
    const newContent: QuizContent = {
      id: generateId(),
      type: "quiz",
      question: "",
      questionType: "single",
      isRequired: true,
      difficulty: "medium",
      options: [
        { id: `opt-${Date.now()}-1`, text: "", isCorrect: false },
        { id: `opt-${Date.now()}-2`, text: "", isCorrect: true },
        { id: `opt-${Date.now()}-3`, text: "", isCorrect: false },
        { id: `opt-${Date.now()}-4`, text: "", isCorrect: false },
      ],
    };
    setContents((prev) => [...prev, newContent]);
  }, []);

  const updateTextContent = useCallback((id: string, content: string) => {
    setContents((prev) =>
      prev.map((c) => (c.id === id && c.type === "text" ? { ...c, content } : c))
    );
  }, []);

  const updateMediaFile = useCallback((id: string, file: File | null) => {
    setContents((prev) =>
      prev.map((c) => (c.id === id && c.type === "media" ? { ...c, file } : c))
    );
  }, []);

  const updateMediaUrl = useCallback((id: string, embedUrl: string) => {
    setContents((prev) =>
      prev.map((c) => (c.id === id && c.type === "media" ? { ...c, embedUrl } : c))
    );
  }, []);

  const clearMediaPreview = useCallback((id: string) => {
    setContents((prev) =>
      prev.map((c) => (c.id === id && c.type === "media" ? { ...c, previewUrl: undefined } : c))
    );
  }, []);

  const updateQuizContent = useCallback((id: string, data: QuizData) => {
    setContents((prev) =>
      prev.map((c) =>
        c.id === id && c.type === "quiz"
          ? {
              ...c,
              ...data,
            }
          : c
      )
    );
  }, []);

  const moveContent = useCallback((index: number, direction: "up" | "down") => {
    setContents((prev) => {
      const newContents = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newContents.length) return prev;
      [newContents[index], newContents[targetIndex]] = [
        newContents[targetIndex],
        newContents[index],
      ];
      return newContents;
    });
  }, []);

  const deleteContent = useCallback(
    async (id: string) => {
      // Find the content to get its type
      const content = contents.find((c) => c.id === id);

      // If in edit mode and onDeleteContent is provided, call it to delete from API
      if (isEditMode && onDeleteContent && content) {
        try {
          await onDeleteContent(id, content.type);
        } catch (error) {
          console.error("Failed to delete content:", error);
          showToast("Gagal menghapus. Silakan coba lagi.", "error");
          return;
        }
      }
      setContents((prev) => prev.filter((c) => c.id !== id));
    },
    [isEditMode, onDeleteContent, contents, showToast]
  );

  const handleSave = () => {
    onSave(materialName, contents);
  };

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-10">
        <div className="mb-8 flex items-center gap-4">
          <Link
            href={`/dashboard-admin/courses/${courseId}/manage/${courseId}`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF9D00] text-white transition-colors hover:bg-[#E68E00]"
          >
            <ChevronLeft size={24} />
          </Link>
          <span className="text-lg text-white">Course/Course Details</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-white">
          {pageTitle || (isEditMode ? "Edit Materi" : "Tambah Materi")}
        </h1>

        <div className="mb-8 space-y-2">
          <label className="block text-sm font-medium text-white">Nama Materi</label>
          <input
            type="text"
            value={materialName}
            onChange={(e) => setMaterialName(e.target.value)}
            placeholder="Masukkan nama materi"
            className="w-full rounded-lg border border-white/20 px-4 py-3 text-white transition-all placeholder:text-white/60 focus:ring-2 focus:ring-white/30 focus:outline-none"
          />
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Konten Materi</h2>

          <div className="space-y-4">
            {contents.map((content, index) => {
              if (content.type === "text") {
                return (
                  <TextContentBox
                    key={content.id}
                    id={content.id}
                    content={content.content}
                    onChange={updateTextContent}
                    onMoveUp={() => moveContent(index, "up")}
                    onMoveDown={() => moveContent(index, "down")}
                    onDelete={() => deleteContent(content.id)}
                    canMoveUp={index > 0}
                    canMoveDown={index < contents.length - 1}
                  />
                );
              }

              if (content.type === "media") {
                return (
                  <MediaBox
                    key={content.id}
                    id={content.id}
                    file={content.file}
                    embedUrl={content.embedUrl}
                    previewUrl={content.previewUrl}
                    onFileChange={updateMediaFile}
                    onEmbedUrlChange={updateMediaUrl}
                    onClearPreview={clearMediaPreview}
                    onMoveUp={() => moveContent(index, "up")}
                    onMoveDown={() => moveContent(index, "down")}
                    onDelete={() => deleteContent(content.id)}
                    canMoveUp={index > 0}
                    canMoveDown={index < contents.length - 1}
                  />
                );
              }

              if (content.type === "quiz") {
                const quizData: QuizData = {
                  question: content.question,
                  questionType: content.questionType,
                  isRequired: content.isRequired,
                  difficulty: content.difficulty,
                  options: content.options,
                  imageUrl: content.imageUrl,
                  pairs: content.pairs,
                };
                return (
                  <QuizBox
                    key={content.id}
                    id={content.id}
                    data={quizData}
                    onChange={updateQuizContent}
                    onMoveUp={() => moveContent(index, "up")}
                    onMoveDown={() => moveContent(index, "down")}
                    onDelete={() => deleteContent(content.id)}
                    canMoveUp={index > 0}
                    canMoveDown={index < contents.length - 1}
                  />
                );
              }

              return null;
            })}
          </div>

          <AddContentButtons
            onAddText={addTextContent}
            onAddQuiz={addQuizContent}
            onAddMedia={addMediaContent}
          />

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="w-full rounded-full bg-white py-2 text-lg font-medium text-gray-500 shadow-lg transition-all hover:opacity-90 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
