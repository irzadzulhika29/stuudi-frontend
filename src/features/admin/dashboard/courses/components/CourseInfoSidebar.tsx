"use client";

import { useState } from "react";
import { CourseInfoSidebarProps, Note } from "../types/cTypes";
import { CoursePeople } from "./smallcomponents/CoursePeople";
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
