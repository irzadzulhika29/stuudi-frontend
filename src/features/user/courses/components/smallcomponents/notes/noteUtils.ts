import { Note } from "../../../types/cTypes";

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const isContentEmpty = (html: string) => {
  return !html || html === "<p></p>" || html.trim() === "";
};

type NoteLevel = "course" | "topic" | "material";

export const getLevelBadgeContent = (
  note: Note,
  level: NoteLevel
): { text: string; variant: "primary" | "amber" } | null => {
  if (level === "course") {
    if (note.topicName && note.materialName) {
      return {
        text: `${note.topicName} / ${note.materialName}`,
        variant: "primary",
      };
    } else if (note.topicName) {
      return {
        text: note.topicName,
        variant: "amber",
      };
    }
  } else if (level === "topic" && note.materialName) {
    return {
      text: note.materialName,
      variant: "primary",
    };
  }
  return null;
};
