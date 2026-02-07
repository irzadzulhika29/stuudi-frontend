import { api } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config";
import { ApiResponse } from "@/features/auth/shared/types/authTypes";
import { TeamDetails, TeamListResponse } from "../types/teamTypes";

export const teamService = {
  async getTeamDetails(): Promise<TeamDetails> {
    console.log("[TeamService] getTeamDetails called");
    const response = await api.get<ApiResponse<TeamDetails>>(API_ENDPOINTS.TEAM.INFO);
    console.log("[TeamService] getTeamDetails response:", response.data.data);
    return response.data.data;
  },
  async getTeams(): Promise<TeamListResponse> {
    console.log("[TeamService] getTeams called");
    const response = await api.get<ApiResponse<TeamListResponse>>(API_ENDPOINTS.TEAM.LIST);
    console.log("[TeamService] getTeams response:", response.data.data);
    return response.data.data;
  },
};
