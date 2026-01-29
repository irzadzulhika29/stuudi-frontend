import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notesService } from "../services/notesService";
import { CreateNoteRequest } from "../types/courseTypes";

export function useCreateNote(topicId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNoteRequest) => notesService.createNote(topicId, data),
    onSuccess: () => {
      // Optionally invalidate notes query if we add a GET notes endpoint later
      queryClient.invalidateQueries({ queryKey: ["topicNotes", topicId] });
    },
  });
}
