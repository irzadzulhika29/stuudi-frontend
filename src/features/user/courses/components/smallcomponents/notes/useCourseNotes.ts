import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Note } from "../../../types/cTypes";
import { GroupedNotes } from "./GroupedNotesList";

interface UseCourseNotesProps {
  notes: Note[];
  onAddNote?: (title: string, content: string) => void;
  onEditNote?: (id: string, title: string, content: string) => void;
  onDeleteNote?: (id: string) => void;
  readOnly?: boolean;
  courseId?: string;
  openNoteId?: string;
}

export const useCourseNotes = ({
  notes,
  onAddNote,
  onEditNote,
  onDeleteNote,
  readOnly = false,
  courseId,
  openNoteId,
}: UseCourseNotesProps) => {
  const router = useRouter();

  // New note form state
  const [newTitle, setNewTitle] = useState("");
  const [newNote, setNewNote] = useState("");

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  // Expand state
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

  // Floating editor state
  const [isFloatingOpen, setIsFloatingOpen] = useState(false);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);

  // Auto-open state
  const [hasAutoOpened, setHasAutoOpened] = useState(false);

  // Auto-open note if openNoteId is provided
  if (openNoteId && !hasAutoOpened && notes.length > 0) {
    const noteToOpen = notes.find((n) => n.id === openNoteId);
    if (noteToOpen) {
      setViewingNote(noteToOpen);
      setHasAutoOpened(true);
    }
  }

  // Group notes by topic for readOnly mode
  const groupedNotes = useMemo((): GroupedNotes[] => {
    if (!readOnly) return [];

    const groups: Map<string, GroupedNotes> = new Map();

    notes.forEach((note) => {
      const topicId = note.topicId || "general";
      const topicName = note.topicName || "Catatan Umum";

      if (!groups.has(topicId)) {
        groups.set(topicId, {
          topicId,
          topicName,
          notes: [],
        });
      }
      groups.get(topicId)!.notes.push(note);
    });

    return Array.from(groups.values());
  }, [notes, readOnly]);

  // Toggle handlers
  const toggleTopic = useCallback((topicId: string) => {
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topicId)) {
        next.delete(topicId);
      } else {
        next.add(topicId);
      }
      return next;
    });
  }, []);

  const toggleNote = useCallback((noteId: string) => {
    setExpandedNotes((prev) => {
      const next = new Set(prev);
      if (next.has(noteId)) {
        next.delete(noteId);
      } else {
        next.add(noteId);
      }
      return next;
    });
  }, []);

  // Navigation handlers
  const navigateToTopic = useCallback(
    (topicId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (courseId && topicId !== "general") {
        router.push(`/courses/${courseId}/topic/${topicId}?openNotes=true`);
      }
    },
    [courseId, router]
  );

  const navigateToNote = useCallback(
    (topicId: string, noteId: string) => {
      if (courseId) {
        router.push(`/courses/${courseId}/topic/${topicId}?openNotes=true&noteId=${noteId}`);
      }
    },
    [courseId, router]
  );

  // Add note handler
  const handleAddNote = useCallback(() => {
    if (newTitle.trim() && newNote.trim() && newNote !== "<p></p>" && onAddNote) {
      onAddNote(newTitle, newNote);
      setNewTitle("");
      setNewNote("");
      setIsFloatingOpen(false);
    }
  }, [newTitle, newNote, onAddNote]);

  // Edit handlers
  const handleStartEdit = useCallback((note: Note) => {
    setEditingId(note.id);
    setEditTitle(note.title || "");
    setEditContent(note.content);
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (
      editingId &&
      editTitle.trim() &&
      editContent.trim() &&
      editContent !== "<p></p>" &&
      onEditNote
    ) {
      onEditNote(editingId, editTitle, editContent);
      setEditingId(null);
      setEditTitle("");
      setEditContent("");
    }
  }, [editingId, editTitle, editContent, onEditNote]);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
  }, []);

  // Delete handlers
  const handleDelete = useCallback((id: string) => {
    setNoteToDelete(id);
    setDeleteModalOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (noteToDelete && onDeleteNote) {
      onDeleteNote(noteToDelete);
    }
    setDeleteModalOpen(false);
    setNoteToDelete(null);
  }, [noteToDelete, onDeleteNote]);

  const closeDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setNoteToDelete(null);
  }, []);

  // Floating editor handlers
  const openFloatingEditor = useCallback(() => {
    setIsFloatingOpen(true);
  }, []);

  const closeFloatingEditor = useCallback(() => {
    setIsFloatingOpen(false);
  }, []);

  const openNoteViewer = useCallback((note: Note) => {
    setViewingNote(note);
  }, []);

  const closeNoteViewer = useCallback(() => {
    setViewingNote(null);
  }, []);

  return {
    // Form state
    newTitle,
    setNewTitle,
    newNote,
    setNewNote,

    // Edit state
    editingId,
    editTitle,
    setEditTitle,
    editContent,
    setEditContent,

    // Delete modal state
    deleteModalOpen,

    // Expand state
    expandedTopics,
    expandedNotes,

    // Floating editor state
    isFloatingOpen,
    viewingNote,

    // Computed
    groupedNotes,

    // Handlers
    toggleTopic,
    toggleNote,
    navigateToTopic,
    navigateToNote,
    handleAddNote,
    handleStartEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleDelete,
    confirmDelete,
    closeDeleteModal,
    openFloatingEditor,
    closeFloatingEditor,
    openNoteViewer,
    closeNoteViewer,
  };
};
