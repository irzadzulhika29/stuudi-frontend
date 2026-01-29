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
  return (
    <section>
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <h3 className="text-primary-dark mb-3 text-sm font-bold">Orang</h3>

        <PeopleList title="Pengajar" items={teachers} type="teacher" />

        <PeopleList
          title="Peserta"
          items={participants}
          type="student"
          totalCount={totalParticipants}
        />
      </div>
    </section>
  );
};

const PeopleList = ({
  title,
  items,
  type,
  totalCount,
}: {
  title: string;
  items: Teacher[] | Participant[];
  type: "teacher" | "student";
  totalCount?: number;
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const shouldShowExpand = items.length > 5;
  const displayItems = isExpanded ? items : items.slice(0, 5);

  // Calculate remaining only for students/participants where totalCount is provided
  // This is for items NOT in the list at all (server-side remaining)
  const unlistedCount = totalCount ? totalCount - items.length : 0;

  return (
    <div className="mb-4 last:mb-0">
      <p className="mb-2 text-xs font-medium text-neutral-500">{title}</p>

      <div className={`space-y-1.5 ${isExpanded ? "max-h-48 overflow-y-auto pr-1" : ""}`}>
        {displayItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-medium text-white ${
                type === "teacher" ? "bg-primary-light" : "bg-primary"
              }`}
            >
              {item.name.charAt(0)}
            </div>
            <span className="text-xs text-neutral-700">{item.name}</span>
          </div>
        ))}
      </div>

      {shouldShowExpand && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-primary-light hover:text-primary mt-2 text-xs font-medium transition-colors"
        >
          {isExpanded ? "Tampilkan lebih sedikit" : `Tampilkan ${items.length - 5} lainnya`}
        </button>
      )}

      {!isExpanded && !shouldShowExpand && unlistedCount > 0 && (
        <p className="mt-2 text-xs text-neutral-400 italic">dan {unlistedCount} lainnya...</p>
      )}

      {isExpanded && unlistedCount > 0 && (
        <p className="mt-2 text-xs text-neutral-400 italic">
          dan {unlistedCount} lainnya tidak ditampilkan
        </p>
      )}
    </div>
  );
};
