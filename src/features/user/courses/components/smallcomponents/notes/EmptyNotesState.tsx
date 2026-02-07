import { StickyNote } from "lucide-react";

export const EmptyNotesState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="mb-2 rounded-full bg-neutral-50 p-3">
        <StickyNote className="text-neutral-300" size={24} />
      </div>
      <p className="text-xs font-medium text-neutral-500">Belum ada catatan untuk topik ini.</p>
      <p className="text-[10px] text-neutral-400">Tulis poin penting untuk diingat!</p>
    </div>
  );
};
