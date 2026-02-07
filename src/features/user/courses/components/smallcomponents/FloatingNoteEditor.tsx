"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Check,
  GripHorizontal,
  Minimize2,
  Pencil,
  Trash2,
  Maximize,
  Square,
  Columns,
} from "lucide-react";
import { RichTextEditor } from "./RichTextEditor";

interface FloatingNoteEditorProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onSave: () => void;
  onDelete?: () => void;
  isSaving?: boolean;
  readOnly?: boolean;
  noteMetadata?: {
    topicName?: string;
    createdAt?: string;
  };
}

type SizePreset = "small" | "medium" | "large";

const SIZE_PRESETS: Record<SizePreset, { width: number; height: number }> = {
  small: { width: 450, height: 400 },
  medium: { width: 600, height: 500 },
  large: { width: 800, height: 650 },
};

export const FloatingNoteEditor = ({
  isOpen,
  onClose,
  title,
  content,
  onTitleChange,
  onContentChange,
  onSave,
  onDelete,
  isSaving = false,
  readOnly = false,
  noteMetadata,
}: FloatingNoteEditorProps) => {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isEditMode, setIsEditMode] = useState(!readOnly);

  // Resize state
  const [size, setSize] = useState<{ width: number; height: number }>(SIZE_PRESETS.medium);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [currentPreset, setCurrentPreset] = useState<SizePreset>("medium");

  const modalRef = useRef<HTMLDivElement>(null);

  // Dragging logic
  const handleMouseDown = (e: React.MouseEvent) => {
    if (modalRef.current) {
      setIsDragging(true);

      const currentX = position ? position.x : modalRef.current.offsetLeft;
      const currentY = position ? position.y : modalRef.current.offsetTop;

      if (!position) {
        setPosition({ x: currentX, y: currentY });
      }

      setDragOffset({
        x: e.clientX - currentX,
        y: e.clientY - currentY,
      });
    }
  };

  // Resize logic
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    });
  };

  // Set size to preset
  const setSizePreset = (preset: SizePreset) => {
    setSize(SIZE_PRESETS[preset]);
    setCurrentPreset(preset);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
      if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        const newWidth = Math.max(350, Math.min(1000, resizeStart.width + deltaX));
        const newHeight = Math.max(300, Math.min(800, resizeStart.height + deltaY));
        setSize({ width: newWidth, height: newHeight });
        setCurrentPreset("medium"); // Reset preset when manually resizing
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, resizeStart]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop for clicking outside */}
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />

      <div
        ref={modalRef}
        style={{
          width: `${size.width}px`,
          height: `${size.height}px`,
          ...(position
            ? {
                left: `${position.x}px`,
                top: `${position.y}px`,
                position: "fixed" as const,
                transform: "none",
                margin: 0,
              }
            : {
                position: "relative" as const,
              }),
        }}
        className="flex flex-col rounded-xl border border-neutral-200 bg-white shadow-2xl transition-shadow"
      >
        {/* Header - Draggable Area */}
        <div
          className="flex cursor-move items-center justify-between border-b border-neutral-100 bg-neutral-50 px-4 py-3"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-2 text-neutral-500">
            <GripHorizontal size={18} />
            <span className="text-xs font-bold tracking-wider uppercase">
              {readOnly && !isEditMode ? "View Mode" : "Editor Mode"}
            </span>
            {noteMetadata?.topicName && (
              <span className="ml-2 rounded bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                {noteMetadata.topicName}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {/* Size presets */}
            <div className="mr-2 flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-white p-0.5">
              <button
                onClick={() => setSizePreset("small")}
                className={`rounded p-1 transition-colors ${currentPreset === "small" ? "bg-primary-light text-white" : "text-neutral-400 hover:bg-neutral-100"}`}
                title="Small"
              >
                <Square size={12} />
              </button>
              <button
                onClick={() => setSizePreset("medium")}
                className={`rounded p-1 transition-colors ${currentPreset === "medium" ? "bg-primary-light text-white" : "text-neutral-400 hover:bg-neutral-100"}`}
                title="Medium"
              >
                <Columns size={12} />
              </button>
              <button
                onClick={() => setSizePreset("large")}
                className={`rounded p-1 transition-colors ${currentPreset === "large" ? "bg-primary-light text-white" : "text-neutral-400 hover:bg-neutral-100"}`}
                title="Large"
              >
                <Maximize size={12} />
              </button>
            </div>
            {readOnly && !isEditMode && (
              <button
                onClick={() => setIsEditMode(true)}
                className="rounded p-1.5 text-neutral-400 hover:bg-blue-50 hover:text-blue-500"
                title="Edit Note"
              >
                <Pencil size={16} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="rounded p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-500"
                title="Delete Note"
              >
                <Trash2 size={16} />
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded p-1.5 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-600"
              title="Minimize"
            >
              <Minimize2 size={16} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden p-6">
          {isEditMode ? (
            <>
              <input
                type="text"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="Judul Catatan"
                className="mb-4 text-2xl font-bold text-neutral-800 placeholder-neutral-300 outline-none"
                autoFocus
              />

              <div className="flex-1 overflow-y-auto">
                <RichTextEditor
                  content={content}
                  onChange={onContentChange}
                  placeholder="Tulis idemu disini..."
                />
                <style jsx global>{`
                  .ProseMirror {
                    min-height: ${Math.max(150, size.height - 280)}px !important;
                  }
                `}</style>
              </div>
            </>
          ) : (
            <>
              <h2 className="mb-4 text-2xl font-bold text-neutral-800">{title || "Tanpa Judul"}</h2>
              <div
                className="note-content flex-1 overflow-y-auto text-sm leading-relaxed text-neutral-600"
                dangerouslySetInnerHTML={{ __html: content }}
              />
              {noteMetadata?.createdAt && (
                <p className="mt-4 border-t border-neutral-100 pt-3 text-xs text-neutral-400">
                  Dibuat:{" "}
                  {new Date(noteMetadata.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-neutral-100 p-4">
          <p className="text-[10px] text-neutral-400">
            {isEditMode
              ? "Drag header to move • Drag corner to resize"
              : "Klik edit untuk mengubah catatan"}
          </p>
          {isEditMode && (
            <button
              onClick={onSave}
              disabled={!title.trim() && !content.trim()}
              className="bg-primary hover:bg-primary-dark flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check size={16} />
              {isSaving ? "Menyimpan..." : "Simpan"}
            </button>
          )}
        </div>

        {/* Resize Handle - Bottom Right Corner */}
        <div
          className="absolute right-0 bottom-0 h-4 w-4 cursor-se-resize"
          onMouseDown={handleResizeMouseDown}
        >
          <svg
            className="absolute right-1 bottom-1 text-neutral-300"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="currentColor"
          >
            <path d="M9 1v8H1" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </div>
      </div>
    </div>
  );
};
