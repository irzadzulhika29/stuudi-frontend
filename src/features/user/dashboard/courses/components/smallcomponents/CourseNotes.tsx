"use client";

import "@/features/user/dashboard/courses/styles/notes.css";
import React, { useState } from "react";
import { Pencil, Trash2, Check, X, StickyNote } from "lucide-react";
import { CourseNotesProps, Note } from "../../types/cTypes";
import { RichTextEditor } from "./RichTextEditor";

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
    if (
      editingId &&
      editContent.trim() &&
      editContent !== "<p></p>" &&
      onEditNote
    ) {
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
    if (onDeleteNote) {
      onDeleteNote(id);
    }
  };

  const getLevelBadge = (note: Note) => {
    if (level === "course") {
      if (note.topicName && note.materialName) {
        return (
          <span className="text-[10px] bg-primary-light/10 text-primary-light px-1.5 py-0.5 rounded font-medium">
            {note.topicName} / {note.materialName}
          </span>
        );
      } else if (note.topicName) {
        return (
          <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">
            {note.topicName}
          </span>
        );
      }
    } else if (level === "topic" && note.materialName) {
      return (
        <span className="text-[10px] bg-primary-light/10 text-primary-light px-1.5 py-0.5 rounded font-medium">
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
    <section>
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <StickyNote className="w-4 h-4 text-primary-dark" />
          <h3 className="font-bold text-primary-dark text-sm">Catatan kamu</h3>
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
              className="mt-3 w-full bg-primary-light text-white text-xs font-medium py-2.5 px-3 rounded-full hover:bg-primary transition-colors cursor-pointer"
            >
              Simpan Catatan
            </button>
          )}
        </div>

        {notes.length > 0 ? (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {notes.map((note) => (
              <div
                key={note.id}
                className="bg-neutral-50 rounded-lg p-3 border border-neutral-100"
              >
                {editingId === note.id ? (
                  <div>
                    <RichTextEditor
                      content={editContent}
                      onChange={setEditContent}
                    />
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={handleSaveEdit}
                        className="flex items-center gap-1.5 bg-emerald-500 text-white text-xs font-medium py-1.5 px-3 rounded-lg hover:bg-emerald-600 transition-colors"
                      >
                        <Check size={14} />
                        Simpan
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center gap-1.5 bg-neutral-400 text-white text-xs font-medium py-1.5 px-3 rounded-lg hover:bg-neutral-500 transition-colors"
                      >
                        <X size={14} />
                        Batal
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">{getLevelBadge(note)}</div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => handleStartEdit(note)}
                          className="p-1.5 text-neutral-400 hover:text-primary-light hover:bg-primary-light/10 rounded transition-colors"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(note.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div
                      className="note-content text-xs text-neutral-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: note.content }}
                    />
                    <p className="text-[10px] text-neutral-400 mt-2 pt-2 border-t border-neutral-100">
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
          <p className="text-xs text-neutral-400 text-center py-4">
            Belum ada catatan
          </p>
        )}
      </div>
    </section>
  );
};
