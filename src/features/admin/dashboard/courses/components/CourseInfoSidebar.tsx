"use client";

import { useState } from "react";
import { CourseInfoSidebarProps, Note } from "../types/cTypes";
import { CoursePeople } from "./smallcomponents/CoursePeople";
import { CourseNotes } from "./smallcomponents/CourseNotes";
import { CourseProgress } from "./smallcomponents/CourseProgress";

export function CourseInfoSidebar({
  progress,
  teachers = [],
  participants = [],
  totalParticipants = 0,
  lastAccessed,
  notes: initialNotes = [],
  showPeople = true,
  showLastAccessed = true,
}: CourseInfoSidebarProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);

  const handleAddNote = (content: string) => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const handleEditNote = (id: string, content: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? { ...note, content, updatedAt: new Date().toISOString() }
          : note,
      ),
    );
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  return (
    <div className="space-y-3">
      <CourseProgress progress={progress} />

      {showPeople && teachers.length > 0 && (
        <CoursePeople
          teachers={teachers}
          participants={participants}
          totalParticipants={totalParticipants}
        />
      )}

      {showLastAccessed && lastAccessed && (
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-primary-light">
          <p className="text-xs text-primary-light font-medium">
            Last Accessed
          </p>
          <p className="font-bold text-primary-dark text-sm">{lastAccessed}</p>
        </div>
      )}
    </div>
  );
}
