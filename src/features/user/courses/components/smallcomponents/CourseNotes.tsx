"use client";

import "@/features/user/courses/styles/notes.css";
import React, { useState } from "react";
import { Pencil, Trash2, Check, X, StickyNote } from "lucide-react";
import { CourseNotesProps, Note } from "../../types/cTypes";
import { RichTextEditor } from "./RichTextEditor";
import { ConfirmDeleteModal } from "@/shared/components/ui/ConfirmDeleteModal";

export const CourseNotes = ({
  notes,
  onAddNote,
  onEditNote,
  onDeleteNote,
  level = "course",
}: CourseNotesProps) => {
  const [newNote, setNewNote] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  const handleAddNote = () => {
    if (newNote.trim() && newNote !== "<p></p>" && onAddNote) {
      onAddNote(newNote);
      setNewNote("");
    }
  };

  const handleStartEdit = (note: Note) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  const handleSaveEdit = () => {
    if (editingId && editContent.trim() && editContent !== "<p></p>" && onEditNote) {
      onEditNote(editingId, editContent);
      setEditingId(null);
      setEditContent("");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
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
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <StickyNote className="text-primary-dark h-4 w-4" />
            <h3 className="text-primary-dark text-sm font-bold">Catatan kamu</h3>
          </div>

          <div className="mb-4">
            <RichTextEditor
              content={newNote}
              onChange={setNewNote}
              placeholder="Start taking a note..."
            />
            {!isContentEmpty(newNote) && (
              <button
                onClick={handleAddNote}
                className="bg-primary-light hover:bg-primary mt-3 w-full cursor-pointer rounded-full px-3 py-2.5 text-xs font-medium text-white transition-colors"
              >
                Simpan Catatan
              </button>
            )}
          </div>

          {notes.length > 0 ? (
            <div className="max-h-80 space-y-3 overflow-y-auto">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="rounded-lg border border-neutral-100 bg-neutral-50 p-3"
                >
                  {editingId === note.id ? (
                    <div>
                      <RichTextEditor content={editContent} onChange={setEditContent} />
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={handleSaveEdit}
                          className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-600"
                        >
                          <Check size={14} />
                          Simpan
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center gap-1.5 rounded-lg bg-neutral-400 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-neutral-500"
                        >
                          <X size={14} />
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <div className="flex-1">{getLevelBadge(note)}</div>
                        <div className="flex shrink-0 gap-1">
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
                        className="note-content text-xs leading-relaxed text-neutral-700"
                        dangerouslySetInnerHTML={{ __html: note.content }}
                      />
                      <p className="mt-2 border-t border-neutral-100 pt-2 text-[10px] text-neutral-400">
                        {formatDate(note.createdAt)}
                        {note.updatedAt && note.updatedAt !== note.createdAt && (
                          <span> • diubah {formatDate(note.updatedAt)}</span>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-xs text-neutral-400">Belum ada catatan</p>
          )}
        </div>
      </section>

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
