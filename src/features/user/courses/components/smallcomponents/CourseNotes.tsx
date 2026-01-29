"use client";

import "@/features/user/courses/styles/notes.css";
import React, { useState } from "react";
import { Pencil, Trash2, Check, X, StickyNote, Maximize2 } from "lucide-react";
import { CourseNotesProps, Note } from "../../types/cTypes";
import { RichTextEditor } from "./RichTextEditor";
import { ConfirmDeleteModal } from "@/shared/components/ui/ConfirmDeleteModal";
import { FloatingNoteEditor } from "./FloatingNoteEditor";

export const CourseNotes = ({
  notes,
  onAddNote,
  onEditNote,
  onDeleteNote,
  level = "course",
  readOnly = false,
}: CourseNotesProps) => {
  const [newTitle, setNewTitle] = useState("");
  const [newNote, setNewNote] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  // Floating Editor State
  const [isFloatingOpen, setIsFloatingOpen] = useState(false);

  const handleAddNote = () => {
    if (newTitle.trim() && newNote.trim() && newNote !== "<p></p>" && onAddNote) {
      onAddNote(newTitle, newNote);
      setNewTitle("");
      setNewNote("");
      setIsFloatingOpen(false);
    }
  };

  const handleStartEdit = (note: Note) => {
    setEditingId(note.id);
    setEditTitle(note.title || "");
    setEditContent(note.content);
  };

  const handleSaveEdit = () => {
    if (
      editingId &&
      editTitle.trim() &&
      editContent.trim() &&
      editContent !== "<p></p>" &&
      onEditNote
    ) {
      onEditNote(editingId, editTitle, editContent);
      setEditingId(null);
      setEditTitle("");
      setEditContent("");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
  };

  const handleDelete = (id: string) => {
    setNoteToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (noteToDelete && onDeleteNote) {
      onDeleteNote(noteToDelete);
    }
    setDeleteModalOpen(false);
    setNoteToDelete(null);
  };

  const getLevelBadge = (note: Note) => {
    if (level === "course") {
      if (note.topicName && note.materialName) {
        return (
          <span className="bg-primary-light/10 text-primary-light rounded px-1.5 py-0.5 text-[10px] font-medium">
            {note.topicName} / {note.materialName}
          </span>
        );
      } else if (note.topicName) {
        return (
          <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
            {note.topicName}
          </span>
        );
      }
    } else if (level === "topic" && note.materialName) {
      return (
        <span className="bg-primary-light/10 text-primary-light rounded px-1.5 py-0.5 text-[10px] font-medium">
          {note.materialName}
        </span>
      );
    }
    return null;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const isContentEmpty = (html: string) => {
    return !html || html === "<p></p>" || html.trim() === "";
  };

  return (
    <>
      <section>
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary-light/10 text-primary-light flex h-8 w-8 items-center justify-center rounded-lg">
                <StickyNote size={18} />
              </div>
              <h3 className="text-primary-dark text-sm font-bold">Catatan Topik</h3>
            </div>
            {!readOnly && (
              <button
                onClick={() => setIsFloatingOpen(true)}
                className="text-primary-light hover:text-primary flex items-center gap-1.5 text-[10px] font-bold transition-colors"
                title="Buka Editor Besar"
              >
                <Maximize2 size={12} />
                Expand
              </button>
            )}
          </div>

          {!readOnly && (
            <div className="focus-within:border-primary-light/30 mb-6 rounded-xl border border-neutral-100 bg-neutral-50/50 p-4 transition-all focus-within:bg-white focus-within:shadow-sm">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Judul catatan..."
                className="mb-3 w-full border-b border-transparent bg-transparent pb-2 text-sm font-bold text-neutral-800 placeholder-neutral-400 focus:border-neutral-200 focus:outline-none"
              />
              <div className="scrollbar-thin max-h-40 overflow-y-auto">
                <RichTextEditor
                  content={newNote}
                  onChange={setNewNote}
                  placeholder="Tulis detail catatanmu disini..."
                />
              </div>
              <div
                className={`mt-3 overflow-hidden transition-all duration-300 ${!isContentEmpty(newNote) && newTitle.trim() ? "max-h-12 opacity-100" : "max-h-0 opacity-0"}`}
              >
                <button
                  onClick={handleAddNote}
                  className="bg-primary-light hover:bg-primary flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold text-white transition-colors"
                >
                  <Check size={14} />
                  Simpan Catatan
                </button>
              </div>
            </div>
          )}

          {notes.length > 0 ? (
            <div className="scrollbar-thin max-h-[340px] space-y-3 overflow-y-auto pr-1">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className={`group rounded-xl border border-neutral-100 bg-white p-4 shadow-sm transition-all hover:shadow-md ${
                    readOnly ? "cursor-pointer active:scale-[0.99]" : ""
                  }`}
                  onClick={() => {
                    if (readOnly) {
                      setEditingId(editingId === note.id ? null : note.id);
                    }
                  }}
                >
                  {readOnly ? (
                    // Read-only View (Course Detail)
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="bg-primary-light/10 text-primary-light rounded px-2 py-1 text-[10px] font-bold">
                          {note.topicName || "General"}
                        </span>
                      </div>

                      <p className="text-sm font-bold text-neutral-800">
                        {note.title || "Tanpa Judul"}
                      </p>

                      {editingId === note.id && (
                        <div
                          className="mt-3 border-t border-neutral-100 pt-3 text-xs leading-relaxed text-neutral-600"
                          dangerouslySetInnerHTML={{ __html: note.content }}
                        />
                      )}
                    </div>
                  ) : (
                    // Editable View (Topic/Material Detail)
                    <>
                      {editingId === note.id ? (
                        <div className="animate-fade-in">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="focus:border-primary-light mb-3 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-bold text-neutral-800 focus:outline-none"
                            placeholder="Judul catatan"
                          />
                          <RichTextEditor content={editContent} onChange={setEditContent} />
                          <div className="mt-3 flex justify-end gap-2">
                            <button
                              onClick={handleCancelEdit}
                              className="flex items-center gap-1.5 rounded-lg bg-neutral-100 px-3 py-1.5 text-xs font-bold text-neutral-500 transition-colors hover:bg-neutral-200"
                            >
                              <X size={14} />
                              Batal
                            </button>
                            <button
                              onClick={handleSaveEdit}
                              className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-emerald-600"
                            >
                              <Check size={14} />
                              Simpan
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="mb-2 flex items-start justify-between gap-2">
                            <div className="flex-1">
                              {getLevelBadge(note)}
                              <h4 className="mt-1 text-sm font-bold text-neutral-800">
                                {note.title}
                              </h4>
                            </div>

                            <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                              <button
                                onClick={() => handleStartEdit(note)}
                                className="hover:text-primary-light hover:bg-primary-light/10 rounded p-1.5 text-neutral-400 transition-colors"
                                title="Edit"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={() => handleDelete(note.id)}
                                className="rounded p-1.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500"
                                title="Hapus"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>

                          <div
                            className="note-content scrollbar-thin max-h-32 overflow-y-auto pr-1 text-xs leading-relaxed text-neutral-600"
                            dangerouslySetInnerHTML={{ __html: note.content }}
                          />

                          <p className="mt-3 flex items-center gap-1 border-t border-neutral-100 pt-2 text-[10px] font-medium text-neutral-400">
                            <span>{formatDate(note.createdAt)}</span>
                            {note.updatedAt && note.updatedAt !== note.createdAt && (
                              <span>• diedit pada {formatDate(note.updatedAt)}</span>
                            )}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-2 rounded-full bg-neutral-50 p-3">
                <StickyNote className="text-neutral-300" size={24} />
              </div>
              <p className="text-xs font-medium text-neutral-500">
                Belum ada catatan untuk topik ini.
              </p>
              <p className="text-[10px] text-neutral-400">Tulis poin penting untuk diingat!</p>
            </div>
          )}
        </div>
      </section>

      {/* Draggable Floating Editor */}
      <FloatingNoteEditor
        key={isFloatingOpen ? "open" : "closed"}
        isOpen={isFloatingOpen}
        onClose={() => setIsFloatingOpen(false)}
        title={newTitle}
        content={newNote}
        onTitleChange={setNewTitle}
        onContentChange={setNewNote}
        onSave={handleAddNote}
      />

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setNoteToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Hapus Catatan"
        message="Apakah kamu yakin ingin menghapus catatan ini? Tindakan ini tidak dapat dibatalkan."
      />
    </>
  );
};
