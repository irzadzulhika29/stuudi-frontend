import { Pencil, Trash2, Maximize2 } from "lucide-react";
import { Note } from "../../../types/cTypes";
import { formatDate, getLevelBadgeContent } from "./noteUtils";
import { NoteEditForm } from "./NoteEditForm";

interface NoteCardProps {
  note: Note;
  level: "course" | "topic" | "material";
  isEditing: boolean;
  editTitle: string;
  editContent: string;
  onEditTitleChange: (title: string) => void;
  onEditContentChange: (content: string) => void;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
  onExpand: () => void;
}

const LevelBadge = ({ note, level }: { note: Note; level: "course" | "topic" | "material" }) => {
  const badge = getLevelBadgeContent(note, level);
  if (!badge) return null;

  const className =
    badge.variant === "primary"
      ? "bg-primary-light/10 text-primary-light rounded px-1.5 py-0.5 text-[10px] font-medium"
      : "rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700";

  return <span className={className}>{badge.text}</span>;
};

export const NoteCard = ({
  note,
  level,
  isEditing,
  editTitle,
  editContent,
  onEditTitleChange,
  onEditContentChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onExpand,
}: NoteCardProps) => {
  return (
    <div className="group rounded-xl border border-neutral-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
      {isEditing ? (
        <NoteEditForm
          title={editTitle}
          content={editContent}
          onTitleChange={onEditTitleChange}
          onContentChange={onEditContentChange}
          onSave={onSaveEdit}
          onCancel={onCancelEdit}
        />
      ) : (
        <div>
          <div className="mb-2 flex items-start justify-between gap-2">
            <div className="flex-1">
              <LevelBadge note={note} level={level} />
              <h4 className="mt-1 text-sm font-bold text-neutral-800">{note.title}</h4>
            </div>

            <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={onExpand}
                className="hover:bg-primary-light/10 hover:text-primary-light rounded p-1.5 text-neutral-400 transition-colors"
                title="Buka di floating editor"
              >
                <Maximize2 size={14} />
              </button>
              <button
                onClick={onStartEdit}
                className="hover:text-primary-light hover:bg-primary-light/10 rounded p-1.5 text-neutral-400 transition-colors"
                title="Edit"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={onDelete}
                className="rounded p-1.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500"
                title="Hapus"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          <div
            className="note-content scrollbar-thin max-h-32 overflow-y-auto pr-1 text-xs leading-relaxed text-neutral-600"
            dangerouslySetInnerHTML={{ __html: note.content }}
          />

          <p className="mt-3 flex items-center gap-1 border-t border-neutral-100 pt-2 text-[10px] font-medium text-neutral-400">
            <span>{formatDate(note.createdAt)}</span>
            {note.updatedAt && note.updatedAt !== note.createdAt && (
              <span>• diedit pada {formatDate(note.updatedAt)}</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};
