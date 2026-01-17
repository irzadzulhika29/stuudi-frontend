"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
} from "lucide-react";

interface ToolbarButtonProps {
  onClick: () => void;
  isActive: boolean;
  children: React.ReactNode;
  title: string;
}

const ToolbarButton = ({
  onClick,
  isActive,
  children,
  title,
}: ToolbarButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`p-1.5 rounded transition-colors ${
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
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[120px] px-3 py-2",
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
    <div className="border relative border-neutral-200 rounded-lg overflow-hidden focus-within:border-primary-light focus-within:ring-1 focus-within:ring-primary-light/30 transition-colors bg-white">
      {editable && (
        <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-neutral-100 bg-neutral-50/50">
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

          <div className="w-px h-4 bg-neutral-200 mx-1" />

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
        <div className="absolute top-16 w-full h-full left-0 right-0 mx-auto flex justify-center text-neutral-400 text-[10px] pointer-events-none">
          {placeholder}
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  );
};
