"use client";

import { useState, useCallback } from "react";
import { Plus, Trash2, ChevronLeft } from "lucide-react";
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
}

export function MaterialForm({
  courseId,
  materialName: initialMaterialName,
  onSave,
  isSaving = false,
  initialContents = [],
  isEditMode = false,
  pageTitle,
}: MaterialFormProps) {
  const [materialName, setMaterialName] = useState(initialMaterialName);
  const [contents, setContents] = useState<MaterialContent[]>(initialContents);

  // Generate unique ID
  const generateId = () => `content-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Add new content blocks
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
      questionType: "multiple_choice",
      isRequired: true,
      isMultipleAnswer: false,
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

  // Update content
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

  // Reorder content
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

  // Delete content
  const deleteContent = useCallback((id: string) => {
    setContents((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // Handle save
  const handleSave = () => {
    onSave(materialName, contents);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Title */}
        <h1 className="mb-8 text-3xl font-bold text-white">{pageTitle || (isEditMode ? "Edit Materi" : "Tambah Materi")}</h1>

        {/* Material Name Input */}
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

        {/* Content Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Konten Materi</h2>

          {/* Content Items */}
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
                    onFileChange={updateMediaFile}
                    onEmbedUrlChange={updateMediaUrl}
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
                  isMultipleAnswer: content.isMultipleAnswer,
                  difficulty: content.difficulty,
                  options: content.options,
                  imageUrl: content.imageUrl,
                  correctAnswer: content.correctAnswer,
                  expectedAnswer: content.expectedAnswer,
                  caseSensitive: content.caseSensitive,
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

          {/* Add New Question Button */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="text-neutral-gray hover:text-error hover:bg-error/10 rounded-lg p-2 transition-all"
              title="Hapus semua"
            >
              <Trash2 className="hover:text-gray h-5 w-5 text-white" />
            </button>
            <button
              type="button"
              onClick={addQuizContent}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-dashed border-white/50 bg-transparent px-6 py-3 text-white transition-all hover:border-white hover:bg-white/20"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">Tambah Pertanyaan</span>
            </button>
          </div>

          {/* Add Content Buttons */}
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
