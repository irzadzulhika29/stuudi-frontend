"use client";

// import { useState } from "react";
// import { CourseInfoSidebarProps, Note } from "../types/cTypes";
import { CourseInfoSidebarProps } from "../types/cTypes";
import { CoursePeople } from "./smallcomponents/CoursePeople";
import { CourseEnrollCode } from "./smallcomponents/CourseEnrollCode";

export function CourseInfoSidebar({
  progress, // eslint-disable-line @typescript-eslint/no-unused-vars
  teachers = [],
  participants = [],
  totalParticipants = 0,
  lastAccessed,
  showPeople = true,
  showLastAccessed = true,
  enrollCode,
}: CourseInfoSidebarProps) {
  // const [notes] = useState<Note[]>(initialNotes); // eslint-disable-line @typescript-eslint/no-unused-vars

  return (
    <div className="space-y-3">
      {enrollCode && <CourseEnrollCode enrollCode={enrollCode} />}

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
