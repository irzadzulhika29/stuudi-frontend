"use client";

import React, { useState } from "react";
import { Settings } from "lucide-react";
import { Teacher, Participant } from "../../types/cTypes";
import { ManageParticipantsModal } from "./ManageParticipantsModal";

type AvailableStudent = {
  id: string;
  name: string;
  avatar?: string;
};

export const CoursePeople = ({
  teachers,
  participants,
  totalParticipants,
  availableStudents = [],
  onAddParticipant,
  onRemoveParticipant,
}: {
  teachers: Teacher[];
  participants: Participant[];
  totalParticipants: number;
  availableStudents?: AvailableStudent[];
  onAddParticipant?: (student: AvailableStudent) => void;
  onRemoveParticipant?: (participantId: string) => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const remainingParticipants = totalParticipants - participants.length;

  const canManageParticipants = onAddParticipant && onRemoveParticipant;

  return (
    <section>
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-primary-dark text-sm">Peoples</h3>
          {canManageParticipants && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-1.5 text-neutral-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
              title="Manage participants"
            >
              <Settings size={16} />
            </button>
          )}
        </div>

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
              <div key={participant.id || idx} className="flex items-center gap-2">
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

      {canManageParticipants && (
        <ManageParticipantsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          participants={participants}
          availableStudents={availableStudents}
          onAddParticipant={onAddParticipant}
          onRemoveParticipant={onRemoveParticipant}
        />
      )}
    </section>
  );
};
