import { ChevronDown, ExternalLink } from "lucide-react";
import { Note } from "../../../types/cTypes";

interface GroupedNotes {
  topicId: string;
  topicName: string;
  notes: Note[];
}

interface GroupedNotesListProps {
  groupedNotes: GroupedNotes[];
  expandedTopics: Set<string>;
  courseId?: string;
  onToggleTopic: (topicId: string) => void;
  onToggleNote: (noteId: string) => void;
  onNavigateToTopic: (topicId: string, e: React.MouseEvent) => void;
  onNavigateToNote: (topicId: string, noteId: string) => void;
}

export const GroupedNotesList = ({
  groupedNotes,
  expandedTopics,
  courseId,
  onToggleTopic,
  onToggleNote,
  onNavigateToTopic,
  onNavigateToNote,
}: GroupedNotesListProps) => {
  return (
    <div className="scrollbar-thin max-h-[340px] space-y-2 overflow-y-auto pr-1">
      {groupedNotes.map((group) => (
        <div
          key={group.topicId}
          className="overflow-hidden rounded-xl border border-neutral-100 bg-white shadow-sm"
        >
          <button
            onClick={() => onToggleTopic(group.topicId)}
            className="flex w-full items-center justify-between p-3 text-left transition-colors hover:bg-neutral-50"
          >
            <div className="flex items-center gap-2">
              <span className="bg-primary-light/10 text-primary-light rounded px-2 py-1 text-[10px] font-bold">
                {group.notes.length}
              </span>
              <span className="text-sm font-semibold text-neutral-700">{group.topicName}</span>
            </div>
            <div className="flex items-center gap-1">
              {group.topicId !== "general" && courseId && (
                <button
                  onClick={(e) => onNavigateToTopic(group.topicId, e)}
                  className="hover:bg-primary-light/10 hover:text-primary-light rounded p-1.5 text-neutral-400 transition-colors"
                  title="Buka di halaman topic"
                >
                  <ExternalLink size={14} />
                </button>
              )}
              <ChevronDown
                size={16}
                className={`text-neutral-400 transition-transform duration-200 ${
                  expandedTopics.has(group.topicId) ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-out ${
              expandedTopics.has(group.topicId) ? "max-h-[500px]" : "max-h-0"
            }`}
          >
            <div className="space-y-1.5 border-t border-neutral-100 bg-neutral-50/50 p-2">
              {group.notes.map((note) => (
                <div
                  key={note.id}
                  className="rounded-lg bg-white p-3 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <button onClick={() => onToggleNote(note.id)} className="flex-1 text-left">
                      <p className="text-sm font-medium text-neutral-800">
                        {note.title || "Tanpa Judul"}
                      </p>
                    </button>
                    <div className="flex items-center gap-1">
                      {courseId && note.topicId && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateToNote(note.topicId!, note.id);
                          }}
                          className="text-primary-light hover:bg-primary-light/10 rounded p-1 transition-all"
                          title="Buka di halaman topic"
                        >
                          <ExternalLink size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export type { GroupedNotes };
