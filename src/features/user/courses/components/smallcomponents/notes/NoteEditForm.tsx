import { Check, X } from "lucide-react";
import { RichTextEditor } from "../RichTextEditor";

interface NoteEditFormProps {
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const NoteEditForm = ({
  title,
  content,
  onTitleChange,
  onContentChange,
  onSave,
  onCancel,
}: NoteEditFormProps) => {
  return (
    <div className="animate-fade-in">
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="focus:border-primary-light mb-3 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-bold text-neutral-800 focus:outline-none"
        placeholder="Judul catatan"
      />
      <RichTextEditor content={content} onChange={onContentChange} />
      <div className="mt-3 flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 rounded-lg bg-neutral-100 px-3 py-1.5 text-xs font-bold text-neutral-500 transition-colors hover:bg-neutral-200"
        >
          <X size={14} />
          Batal
        </button>
        <button
          onClick={onSave}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-emerald-600"
        >
          <Check size={14} />
          Simpan
        </button>
      </div>
    </div>
  );
};
