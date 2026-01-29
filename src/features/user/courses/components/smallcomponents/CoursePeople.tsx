import React from "react";
import { Teacher, Participant } from "../../types/cTypes";

export const CoursePeople = ({
  teachers,
  participants,
  totalParticipants,
}: {
  teachers: Teacher[];
  participants: Participant[];
  totalParticipants: number;
}) => {
  const remainingParticipants = totalParticipants - participants.length;

  return (
    <section>
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
    </section>
  );
};
