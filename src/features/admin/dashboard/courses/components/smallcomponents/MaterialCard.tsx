import { Edit2, ChevronUp, ChevronDown } from "lucide-react";

export interface MaterialCardProps {
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

export function MaterialCard({
  id,
  title,
  isCompleted,
  type,
  index,
  totalItems,
  onMoveUp,
  onMoveDown,
  onEdit,
}: MaterialCardProps) {
  const isFirst = index === 0;
  const isLast = index === totalItems - 1;

  return (
    <div className="group flex items-center justify-between p-4 bg-neutral-100/80 rounded-lg hover:bg-neutral-100 transition-all duration-200">
      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-0.5">
          <button
            onClick={onMoveUp}
            disabled={isFirst}
            className={`p-0.5 rounded transition-colors ${
              isFirst
                ? "text-neutral-300 cursor-not-allowed"
                : "text-neutral-400 cursor-pointer hover:text-primary-light hover:bg-neutral-200"
            }`}
          >
            <ChevronUp size={12} />
          </button>
          <button
            onClick={onMoveDown}
            disabled={isLast}
            className={`p-0.5 rounded transition-colors ${
              isLast
                ? "text-neutral-300 cursor-not-allowed"
                : "text-neutral-400 cursor-pointer hover:text-primary-light hover:bg-neutral-200"
            }`}
          >
            <ChevronDown size={12} />
          </button>
        </div>
        <span className="text-neutral-700 font-medium ml-2">{title}</span>
      </div>
      <div className="flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onEdit}
          className="p-2 text-neutral-500 hover:text-primary-light transition-colors"
        >
          <Edit2 size={16} />
        </button>
      </div>
    </div>
  );
}
