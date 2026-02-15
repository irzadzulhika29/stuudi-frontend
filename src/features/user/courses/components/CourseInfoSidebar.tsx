"use client";

import { Award } from "lucide-react";

interface Teacher {
  name: string;
  avatar?: string;
}

interface Participant {
  name: string;
  avatar?: string;
}

interface CourseInfoSidebarProps {
  progress: {
    current: number;
    total: number;
  };
  teachers: Teacher[];
  participants: Participant[];
  totalParticipants: number;
  lastAccessed: string;
}

export function CourseInfoSidebar({
  progress,
  teachers,
  participants,
  totalParticipants,
  lastAccessed,
}: CourseInfoSidebarProps) {
  const progressPercent = (progress.current / progress.total) * 100;
  const remainingParticipants = totalParticipants - participants.length;

  return (
    <div className="space-y-3">
      <div className="bg-primary-dark rounded-xl p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-3">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400">
              <Award className="text-white" size={20} />
            </div>
            <div className="absolute -bottom-1 left-1/2 h-2 w-4 -translate-x-1/2 rounded-b-full bg-amber-400" />
          </div>
          <h3 className="text-base font-bold text-white">Your Progress</h3>
        </div>
        <div className="relative h-2.5 overflow-hidden rounded-full bg-white/20">
          <div
            className="absolute top-0 left-0 h-full rounded-full bg-emerald-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
          <div
            className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow-sm transition-all duration-500"
            style={{ left: `calc(${progressPercent}% - 6px)` }}
          />
        </div>
        <p className="mt-2 text-sm text-white/80">
          {progress.current}/{progress.total} exp
        </p>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <h3 className="text-primary-dark mb-3 text-sm font-bold">Peoples</h3>

        <div className="mb-3">
          <p className="mb-2 text-xs font-medium text-neutral-500">Teachers</p>
          <div className="space-y-1.5">
            {teachers.map((teacher, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="bg-primary-light flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-medium text-white">
                  {teacher.name.charAt(0)}
                </div>
                <span className="text-xs text-neutral-700">{teacher.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-neutral-500">Participants</p>
          <div className="space-y-1.5">
            {participants.map((participant, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="bg-primary flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-medium text-white">
                  {participant.name.charAt(0)}
                </div>
                <span className="text-xs text-neutral-700">{participant.name}</span>
              </div>
            ))}
          </div>
          {remainingParticipants > 0 && (
            <button className="text-primary-light hover:text-primary mt-2 text-xs font-medium transition-colors">
              and {remainingParticipants} more...
            </button>
          )}
        </div>
      </div>

      <div className="border-primary-light rounded-xl border-l-4 bg-white p-4 shadow-sm">
        <p className="text-primary-light text-xs font-medium">Last Accessed</p>
        <p className="text-primary-dark text-sm font-bold">{lastAccessed}</p>
      </div>
    </div>
  );
}
