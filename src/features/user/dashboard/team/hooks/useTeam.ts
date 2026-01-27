import { useQuery } from "@tanstack/react-query";
import { teamService } from "../services/teamService";

export const useTeam = () => {
  return useQuery({
    queryKey: ["team-details"],
    queryFn: () => teamService.getTeamDetails(),
  });
};
