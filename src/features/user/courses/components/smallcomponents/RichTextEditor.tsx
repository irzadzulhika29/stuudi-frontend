"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered } from "lucide-react";

interface ToolbarButtonProps {
  onClick: () => void;
  isActive: boolean;
  children: React.ReactNode;
  title: string;
}

const ToolbarButton = ({ onClick, isActive, children, title }: ToolbarButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`rounded p-1.5 transition-colors ${
      isActive
        ? "bg-primary-light text-white"
        : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
    }`}
  >
    {children}
  </button>
);

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  editable?: boolean;
}

export const RichTextEditor = ({
  content,
  onChange,
  placeholder = "Start taking a note...",
  editable = true,
}: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content,
    editable,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[120px] px-3 py-2",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="focus-within:border-primary-light focus-within:ring-primary-light/30 relative overflow-hidden rounded-lg border border-neutral-200 bg-white transition-colors focus-within:ring-1">
      {editable && (
        <div className="flex items-center gap-0.5 border-b border-neutral-100 bg-neutral-50/50 px-2 py-1.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            title="Bold (Ctrl+B)"
          >
            <Bold size={14} />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            title="Italic (Ctrl+I)"
          >
            <Italic size={14} />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon size={14} />
          </ToolbarButton>

          <div className="mx-1 h-4 w-px bg-neutral-200" />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            title="Bullet List"
          >
            <List size={14} />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            title="Numbered List"
          >
            <ListOrdered size={14} />
          </ToolbarButton>
        </div>
      )}
      {editor.isEmpty && editable && (
        <div className="pointer-events-none absolute top-16 right-0 left-0 mx-auto flex h-full w-full justify-center text-[10px] text-neutral-400">
          {placeholder}
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  );
};
