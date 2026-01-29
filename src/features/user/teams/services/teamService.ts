import { api } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config";
import { ApiResponse } from "@/features/auth/shared/types/authTypes";
import { TeamDetails, TeamListResponse } from "../types/teamTypes";

export const teamService = {
  async getTeamDetails(): Promise<TeamDetails> {
    const response = await api.get<ApiResponse<TeamDetails>>(API_ENDPOINTS.TEAM.INFO);
    return response.data.data;
  },
  async getTeams(): Promise<TeamListResponse> {
    const response = await api.get<ApiResponse<TeamListResponse>>(API_ENDPOINTS.TEAM.LIST);
    return response.data.data;
  },
};
