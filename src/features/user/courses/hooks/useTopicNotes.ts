import { useQuery } from "@tanstack/react-query";
import { notesService } from "../services/notesService";

export function useTopicNotes(topicId: string | undefined) {
  return useQuery({
    queryKey: ["topicNotes", topicId],
    queryFn: () => notesService.getNotes(topicId!),
    enabled: !!topicId,
  });
}
