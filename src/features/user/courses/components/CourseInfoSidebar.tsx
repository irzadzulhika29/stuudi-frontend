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
        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center">
              <Award className="text-white" size={20} />
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-2 bg-amber-400 rounded-b-full" />
          </div>
          <h3 className="font-bold text-white text-base">Your Progress</h3>
        </div>
        <div className="relative h-2.5 bg-white/20 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-sm transition-all duration-500"
            style={{ left: `calc(${progressPercent}% - 6px)` }}
          />
        </div>
        <p className="text-sm text-white/80 mt-2">
          {progress.current}/{progress.total} exp
        </p>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-bold text-primary-dark text-sm mb-3">Peoples</h3>

        <div className="mb-3">
          <p className="text-xs text-neutral-500 mb-2 font-medium">Teachers</p>
          <div className="space-y-1.5">
            {teachers.map((teacher, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary-light rounded-full flex items-center justify-center text-[10px] font-medium text-white">
                  {teacher.name.charAt(0)}
                </div>
                <span className="text-xs text-neutral-700">{teacher.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-neutral-500 mb-2 font-medium">
            Participants
          </p>
          <div className="space-y-1.5">
            {participants.map((participant, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-[10px] font-medium text-white">
                  {participant.name.charAt(0)}
                </div>
                <span className="text-xs text-neutral-700">
                  {participant.name}
                </span>
              </div>
            ))}
          </div>
          {remainingParticipants > 0 && (
            <button className="text-xs text-primary-light font-medium mt-2 hover:text-primary transition-colors">
              and {remainingParticipants} more...
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-primary-light">
        <p className="text-xs text-primary-light font-medium">Last Accessed</p>
        <p className="font-bold text-primary-dark text-sm">{lastAccessed}</p>
      </div>
    </div>
  );
}
