import { Edit2, ChevronUp, ChevronDown } from "lucide-react";

export interface TopicMaterialItemProps {
  id: string;
  title: string;
  isCompleted: boolean;
  type?: "material" | "quiz";
  index: number;
  totalItems: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onEdit?: () => void;
}

export function TopicMaterialItem({
  title,
  index,
  totalItems,
  onMoveUp,
  onMoveDown,
  onEdit,
}: TopicMaterialItemProps) {
  const isFirst = index === 0;
  const isLast = index === totalItems - 1;

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
      </div>
      <div className="flex items-center gap-2 opacity-50 transition-opacity group-hover:opacity-100">
        <button
          onClick={onEdit}
          className="hover:text-primary-light p-2 text-neutral-500 transition-colors"
        >
          <Edit2 size={16} />
        </button>
      </div>
    </div>
  );
}
