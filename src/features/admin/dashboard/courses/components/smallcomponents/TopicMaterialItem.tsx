import { Edit2, ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import Link from "next/link";

export interface TopicMaterialItemProps {
  id: string;
  title: string;
  isCompleted: boolean;
  type?: "material" | "quiz";
  index: number;
  totalItems: number;
  courseId: string;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function TopicMaterialItem({
  id,
  title,
  type,
  index,
  totalItems,
  courseId,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete,
}: TopicMaterialItemProps) {
  const isFirst = index === 0;
  const isLast = index === totalItems - 1;

  // Build edit link based on type
  const editHref =
    type === "quiz"
      ? `/dashboard-admin/courses/${courseId}/manage/${courseId}/quiz/${id}`
      : `/dashboard-admin/courses/${courseId}/manage/${courseId}/material/${id}`;

  return (
    <div className="group flex items-center justify-between rounded-lg bg-neutral-100/80 p-4 transition-all duration-200 hover:bg-neutral-100">
      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-0.5">
          <button
            onClick={onMoveUp}
            disabled={isFirst}
            className={`rounded p-0.5 transition-colors ${
              isFirst
                ? "cursor-not-allowed text-neutral-300"
                : "hover:text-primary-light cursor-pointer text-neutral-400 hover:bg-neutral-200"
            }`}
          >
            <ChevronUp size={12} />
          </button>
          <button
            onClick={onMoveDown}
            disabled={isLast}
            className={`rounded p-0.5 transition-colors ${
              isLast
                ? "cursor-not-allowed text-neutral-300"
                : "hover:text-primary-light cursor-pointer text-neutral-400 hover:bg-neutral-200"
            }`}
          >
            <ChevronDown size={12} />
          </button>
        </div>
        <span className="ml-2 font-medium text-neutral-700">{title}</span>
        {type && (
          <span
            className={`rounded px-2 py-0.5 text-xs ${
              type === "quiz" ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"
            }`}
          >
            {type === "quiz" ? "Quiz" : "Materi"}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 opacity-50 transition-opacity group-hover:opacity-100">
        <Link
          href={editHref}
          onClick={onEdit}
          className="hover:text-primary-light p-2 text-neutral-500 transition-colors"
        >
          <Edit2 size={16} />
        </Link>
        <button
          onClick={onDelete}
          className="p-2 text-neutral-300 transition-colors hover:text-red-500"
          title="Hapus"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
