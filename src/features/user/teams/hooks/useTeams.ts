import { useQuery } from "@tanstack/react-query";
import { teamService } from "../services/teamService";

export const useTeams = () => {
  return useQuery({
    queryKey: ["teams"],
    queryFn: () => teamService.getTeams(),
  });
};
