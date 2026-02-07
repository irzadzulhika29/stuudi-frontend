"use client";

import "@/features/user/courses/styles/notes.css";
import { StickyNote, Maximize2 } from "lucide-react";
import { CourseNotesProps } from "../../types/cTypes";
import { ConfirmDeleteModal } from "@/shared/components/ui/ConfirmDeleteModal";
import { FloatingNoteEditor } from "./FloatingNoteEditor";
import { NoteCard, NoteForm, GroupedNotesList, EmptyNotesState, useCourseNotes } from "./notes";

export const CourseNotes = ({
  notes,
  onAddNote,
  onEditNote,
  onDeleteNote,
  level = "course",
  readOnly = false,
  courseId,
  openNoteId,
}: CourseNotesProps & { courseId?: string; openNoteId?: string }) => {
  const {
    newTitle,
    setNewTitle,
    newNote,
    setNewNote,

    editingId,
    editTitle,
    setEditTitle,
    editContent,
    setEditContent,

    deleteModalOpen,

    expandedTopics,

    isFloatingOpen,
    viewingNote,

    groupedNotes,

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
  } = useCourseNotes({
    notes,
    onAddNote,
    onEditNote,
    onDeleteNote,
    readOnly,
    courseId,
    openNoteId,
  });

  const renderFlatNotes = () => (
    <div className="scrollbar-thin max-h-[340px] space-y-3 overflow-y-auto pr-1">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          level={level}
          isEditing={editingId === note.id}
          editTitle={editTitle}
          editContent={editContent}
          onEditTitleChange={setEditTitle}
          onEditContentChange={setEditContent}
          onStartEdit={() => handleStartEdit(note)}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={handleCancelEdit}
          onDelete={() => handleDelete(note.id)}
          onExpand={() => openNoteViewer(note)}
        />
      ))}
    </div>
  );

  return (
    <>
      <section>
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary-light/10 text-primary-light flex h-8 w-8 items-center justify-center rounded-lg">
                <StickyNote size={18} />
              </div>
              <h3 className="text-primary-dark text-sm font-bold">Catatan Topik</h3>
            </div>
            {!readOnly && (
              <button
                onClick={openFloatingEditor}
                className="text-primary-light hover:text-primary flex items-center gap-1.5 text-[10px] font-bold transition-colors"
                title="Buka Editor Besar"
              >
                <Maximize2 size={12} />
                Expand
              </button>
            )}
          </div>

          {!readOnly && (
            <NoteForm
              title={newTitle}
              content={newNote}
              onTitleChange={setNewTitle}
              onContentChange={setNewNote}
              onSave={handleAddNote}
            />
          )}

          {notes.length > 0 ? (
            readOnly ? (
              <GroupedNotesList
                groupedNotes={groupedNotes}
                expandedTopics={expandedTopics}
                courseId={courseId}
                onToggleTopic={toggleTopic}
                onToggleNote={toggleNote}
                onNavigateToTopic={navigateToTopic}
                onNavigateToNote={navigateToNote}
              />
            ) : (
              renderFlatNotes()
            )
          ) : (
            <EmptyNotesState />
          )}
        </div>
      </section>

      <FloatingNoteEditor
        key={isFloatingOpen ? "open" : "closed"}
        isOpen={isFloatingOpen}
        onClose={closeFloatingEditor}
        title={newTitle}
        content={newNote}
        onTitleChange={setNewTitle}
        onContentChange={setNewNote}
        onSave={handleAddNote}
      />

      {viewingNote && (
        <FloatingNoteEditor
          key={`view-${viewingNote.id}`}
          isOpen={!!viewingNote}
          onClose={closeNoteViewer}
          title={viewingNote.title || ""}
          content={viewingNote.content}
          onTitleChange={() => {}}
          onContentChange={() => {}}
          onSave={() => {}}
          readOnly={true}
          noteMetadata={{
            topicName: viewingNote.topicName,
            createdAt: viewingNote.createdAt,
          }}
        />
      )}

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Hapus Catatan"
        message="Apakah kamu yakin ingin menghapus catatan ini? Tindakan ini tidak dapat dibatalkan."
      />
    </>
  );
};
