import { useQuery } from "@tanstack/react-query";
import { notesService } from "../services/notesService";

export function useTopicNotes(topicId: string | undefined) {
  return useQuery({
    queryKey: ["topicNotes", topicId],
    queryFn: () => notesService.getNotes(topicId!),
    enabled: !!topicId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}
