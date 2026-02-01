import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config/constants";

// API Response Types
interface TeamMember {
  team_member_id: string;
  name: string;
}

export interface ApiParticipant {
  elearning_user_id: string;
  username: string;
  password: string;
  team_name: string;
  leader_name: string;
  school: string;
  team_members: TeamMember[] | null;
}

interface ApiResponse {
  status: {
    code: number;
    isSuccess: boolean;
  };
  message: string;
  data: ApiParticipant[];
}

interface ApiErrorResponse {
  status: {
    code: number;
    isSuccess: boolean;
  };
  message: string;
}

export const useGetParticipants = () => {
  return useQuery<ApiParticipant[], Error>({
    queryKey: ["participants"],
    queryFn: async () => {
      try {
        const response = await api.get<ApiResponse>(API_ENDPOINTS.TEACHER.GET_ALL_PARTICIPANTS);
        if (!response.data.status.isSuccess) {
          throw new Error(response.data.message || "Gagal mengambil data participant");
        }
        return response.data.data;
      } catch (error) {
        console.error("=== API Error ===");
        console.error("Full error:", error);
        if (error instanceof AxiosError) {
          console.error("Response data:", error.response?.data);
          console.error("Response status:", error.response?.status);
          const errorResponse = error.response?.data as ApiErrorResponse | undefined;
          const errorMessage =
            errorResponse?.message || error.message || "Terjadi kesalahan saat mengambil data";
          console.error("Error message to display:", errorMessage);
          throw new Error(errorMessage);
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
