import { api } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config";
import { ApiResponse } from "@/features/auth/shared/types/authTypes";
import { CreateNoteRequest, Note } from "../types/courseTypes";

// API response type for notes list
interface ApiNote {
  note_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at?: string;
}

export const notesService = {
  async getNotes(topicId: string): Promise<Note[]> {
    console.log("[notesService] Fetching notes for topic:", topicId);

    try {
      const response = await api.get<ApiResponse<{ notes: ApiNote[] }>>(
        API_ENDPOINTS.COURSES.TOPIC_NOTES(topicId)
      );
      console.log("[notesService] Notes response:", response.data);

      // Transform API response to local Note type
      return response.data.data.notes.map((note) => ({
        note_id: note.note_id,
        topic_id: topicId,
        title: note.title,
        content: note.content,
        created_at: note.created_at,
      }));
    } catch (error) {
      console.error("[notesService] Error fetching notes:", error);
      throw error;
    }
  },

  async createNote(topicId: string, data: CreateNoteRequest): Promise<Note> {
    console.log("[notesService] Creating note for topic:", topicId);
    console.log("[notesService] Payload:", data);
    console.log("[notesService] Endpoint:", API_ENDPOINTS.COURSES.TOPIC_NOTES(topicId));

    try {
      const response = await api.post<ApiResponse<Note>>(
        API_ENDPOINTS.COURSES.TOPIC_NOTES(topicId),
        data
      );
      console.log("[notesService] Response:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("[notesService] Error:", error);
      throw error;
    }
  },

  async updateNote(noteId: string, data: CreateNoteRequest): Promise<Note> {
    console.log("[notesService] Updating note:", noteId);
    console.log("[notesService] Payload:", data);

    try {
      const response = await api.patch<ApiResponse<Note>>(
        API_ENDPOINTS.COURSES.NOTE_UPDATE(noteId),
        data
      );
      console.log("[notesService] Update response:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("[notesService] Error updating note:", error);
      throw error;
    }
  },

  async deleteNote(noteId: string): Promise<void> {
    console.log("[notesService] Deleting note:", noteId);

    try {
      await api.delete(API_ENDPOINTS.COURSES.NOTE_DELETE(noteId));
      console.log("[notesService] Note deleted successfully");
    } catch (error) {
      console.error("[notesService] Error deleting note:", error);
      throw error;
    }
  },
};
