import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config/constants";

export interface QuizOption {
  option_id: string;
  option_text: string;
  is_correct: boolean;
}

export interface MatchingOption {
  option_id: string;
  option_text: string;
}

export interface QuizQuestion {
  question_id: string;
  question_text: string;
  question_type: "single" | "multiple" | "matching";
  points: number;
  options: QuizOption[];
  // Matching question formats
  left_options?: MatchingOption[];
  right_options?: MatchingOption[];
  matching_pairs?: { pair_id?: string; left_text: string; right_text: string }[];
}

export interface ContentBlock {
  block_id: string;
  type: "text" | "media" | "quiz";
  order: number;
  // Text block
  text_content?: string;
  // Media block
  media_type?: "image" | "video";
  media_url?: string;
  // Quiz block
  questions?: QuizQuestion[];
}

export interface ContentDetails {
  content_id: string;
  title: string;
  description?: string;
  type: "materi" | "quiz";
  blocks: ContentBlock[];
}

interface ContentDetailsResponse {
  status: {
    code: number;
    isSuccess: boolean;
  };
  message: string;
  data: ContentDetails;
}

export function useGetContentDetails(contentId: string | null) {
  return useQuery<ContentDetailsResponse, Error>({
    queryKey: ["contentDetails", contentId],
    queryFn: async () => {
      if (!contentId) throw new Error("No content ID provided");
      const response = await api.get<ContentDetailsResponse>(
        API_ENDPOINTS.TEACHER.CONTENT_DETAIL(contentId)
      );
      return response.data;
    },
    enabled: !!contentId && contentId !== "new",
  });
}
