import { Check } from "lucide-react";
import { RichTextEditor } from "../RichTextEditor";
import { isContentEmpty } from "./noteUtils";

interface NoteFormProps {
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onSave: () => void;
}

export const NoteForm = ({
  title,
  content,
  onTitleChange,
  onContentChange,
  onSave,
}: NoteFormProps) => {
  const canSave = !isContentEmpty(content) && title.trim();

  return (
    <div className="focus-within:border-primary-light/30 mb-6 rounded-xl border border-neutral-100 bg-neutral-50/50 p-4 transition-all focus-within:bg-white focus-within:shadow-sm">
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Judul catatan..."
        className="mb-3 w-full border-b border-transparent bg-transparent pb-2 text-sm font-bold text-neutral-800 placeholder-neutral-400 focus:border-neutral-200 focus:outline-none"
      />
      <div className="scrollbar-thin max-h-40 overflow-y-auto">
        <RichTextEditor
          content={content}
          onChange={onContentChange}
          placeholder="Tulis detail catatanmu disini..."
        />
      </div>
      <div
        className={`mt-3 overflow-hidden transition-all duration-300 ${canSave ? "max-h-12 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <button
          onClick={onSave}
          className="bg-primary-light hover:bg-primary flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold text-white transition-colors"
        >
          <Check size={14} />
          Simpan Catatan
        </button>
      </div>
    </div>
  );
};
