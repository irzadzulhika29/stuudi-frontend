"use client";

import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CourseInfoSidebarProps, Note } from "../types/cTypes";
import { CoursePeople } from "./smallcomponents/CoursePeople";
import { CourseNotes } from "./smallcomponents/CourseNotes";
import { CourseProgress } from "./smallcomponents/CourseProgress";
import { notesService } from "../services/notesService";
import { useTopicNotes } from "../hooks/useTopicNotes";

export function CourseInfoSidebar({
  progress,
  teachers = [],
  participants = [],
  totalParticipants = 0,
  lastAccessed,
  notes: initialNotes = [],
  topicId,
  showPeople = true,
  showLastAccessed = true,
  readOnly = false,
}: CourseInfoSidebarProps) {
  const queryClient = useQueryClient();
  // Track local notes for when no topicId is present
  const [localNotes, setLocalNotes] = useState<Note[]>(initialNotes);

  // Fetch notes from API when topicId is provided
  const { data: apiNotes } = useTopicNotes(topicId);

  // Compute notes: use API data if available (Server Mode), otherwise local state (Client Mode)
  const notes = useMemo(() => {
    if (topicId) {
      if (apiNotes && apiNotes.length > 0) {
        return apiNotes.map(
          (note: {
            note_id: string;
            title: string;
            content: string;
            created_at: string;
            topic_id: string;
          }) => ({
            id: note.note_id,
            title: note.title,
            content: note.content,
            createdAt: note.created_at,
            topicId: note.topic_id,
          })
        );
      }
      return initialNotes;
    }
    return localNotes;
  }, [topicId, apiNotes, initialNotes, localNotes]);

  const handleAddNote = async (title: string, content: string) => {
    console.log("[CourseInfoSidebar] Adding note, topicId:", topicId);
    console.log("[CourseInfoSidebar] Content:", content);

    // If topicId is provided, call the API and invalidate cache
    if (topicId) {
      try {
        const result = await notesService.createNote(topicId, {
          title,
          content,
        });
        console.log("[CourseInfoSidebar] Note created:", result);
        queryClient.invalidateQueries({ queryKey: ["topicNotes", topicId] });
      } catch (error) {
        console.error("[CourseInfoSidebar] Failed to create note:", error);
      }
    } else {
      // Fallback to local state only
      const newNote: Note = {
        id: `note-${Date.now()}`,
        title,
        content,
        createdAt: new Date().toISOString(),
      };
      setLocalNotes((prev) => [newNote, ...prev]);
    }
  };

  const handleEditNote = async (id: string, title: string, content: string) => {
    console.log("[CourseInfoSidebar] Editing note:", id);

    if (topicId) {
      try {
        await notesService.updateNote(id, {
          title,
          content,
        });
        console.log("[CourseInfoSidebar] Note updated");
        queryClient.invalidateQueries({ queryKey: ["topicNotes", topicId] });
      } catch (error) {
        console.error("[CourseInfoSidebar] Failed to update note:", error);
      }
    } else {
      setLocalNotes((prev) =>
        prev.map((note) =>
          note.id === id ? { ...note, title, content, updatedAt: new Date().toISOString() } : note
        )
      );
    }
  };

  const handleDeleteNote = async (id: string) => {
    console.log("[CourseInfoSidebar] Deleting note:", id);

    if (topicId) {
      try {
        await notesService.deleteNote(id);
        console.log("[CourseInfoSidebar] Note deleted");
        queryClient.invalidateQueries({ queryKey: ["topicNotes", topicId] });
      } catch (error) {
        console.error("[CourseInfoSidebar] Failed to delete note:", error);
      }
    } else {
      setLocalNotes((prev) => prev.filter((note) => note.id !== id));
    }
  };

  return (
    <div className="space-y-3">
      <CourseProgress progress={progress} />

      <CourseNotes
        notes={notes}
        onAddNote={handleAddNote}
        onEditNote={handleEditNote}
        onDeleteNote={handleDeleteNote}
        level="course"
        readOnly={readOnly}
      />

      {showPeople && teachers.length > 0 && (
        <CoursePeople
          teachers={teachers}
          participants={participants}
          totalParticipants={totalParticipants}
        />
      )}

      {showLastAccessed && lastAccessed && (
        <div className="border-primary-light rounded-xl border-l-4 bg-white p-4 shadow-sm">
          <p className="text-primary-light text-xs font-medium">Last Accessed</p>
          <p className="text-primary-dark text-sm font-bold">{lastAccessed}</p>
        </div>
      )}
    </div>
  );
}
