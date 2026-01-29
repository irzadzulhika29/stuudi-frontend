"use client";

import React, { useState, useRef, useEffect } from "react";
import { Check, GripHorizontal, Minimize2 } from "lucide-react";
import { RichTextEditor } from "./RichTextEditor";

interface FloatingNoteEditorProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onSave: () => void;
  isSaving?: boolean;
}

export const FloatingNoteEditor = ({
  isOpen,
  onClose,
  title,
  content,
  onTitleChange,
  onContentChange,
  onSave,
  isSaving = false,
}: FloatingNoteEditorProps) => {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  // Reset position when closed to ensure it re-centers on next open
  // Reset position logic removed; handled by 'key' prop in parent re-mounting the component.

  const handleMouseDown = (e: React.MouseEvent) => {
    if (modalRef.current) {
      setIsDragging(true);

      // If position is null (centered via CSS), calculate actual current position to start drag
      const currentX = position ? position.x : modalRef.current.offsetLeft;
      const currentY = position ? position.y : modalRef.current.offsetTop;

      // If it was null, we need to "snap" it to absolute coordinates now
      if (!position) {
        setPosition({ x: currentX, y: currentY });
      }

      setDragOffset({
        x: e.clientX - currentX,
        y: e.clientY - currentY,
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
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
  }, [isDragging, dragOffset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        ref={modalRef}
        style={
          position
            ? {
                left: `${position.x}px`,
                top: `${position.y}px`,
                position: "fixed",
                transform: "none",
                margin: 0,
              }
            : {
                // Initial centered state handled by flex parent, but we want it fixed relative to screen for consistency?
                // Actually parent is flex center, so it is centered already relative to viewport (fixed inset-0).
                // We just need to ensure no conflicting styles.
                position: "relative", // Relative to flex container
              }
        }
        className="flex h-[500px] w-[600px] flex-col rounded-xl border border-neutral-200 bg-white shadow-2xl transition-shadow"
      >
        {/* Header - Draggable Area */}
        <div
          className="flex cursor-move items-center justify-between border-b border-neutral-100 bg-neutral-50 px-4 py-3"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-2 text-neutral-500">
            <GripHorizontal size={18} />
            <span className="text-xs font-bold tracking-wider uppercase">Editor Mode</span>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-600"
            title="Minimize"
          >
            <Minimize2 size={16} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden p-6">
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
              // We need to pass a prop to make it fill height, or style the container class in RichTextEditor
            />
            <style jsx global>{`
              .ProseMirror {
                min-height: 300px !important;
              }
            `}</style>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-neutral-100 p-4">
          <p className="text-[10px] text-neutral-400">Drag header to move • Auto-saving enabled</p>
          <button
            onClick={onSave}
            disabled={!title.trim() && !content.trim()}
            className="bg-primary hover:bg-primary-dark flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Check size={16} />
            {isSaving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
};
