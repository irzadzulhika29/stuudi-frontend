import { useQuery } from "@tanstack/react-query";
import { authService } from "@/features/auth/services/authService";
import { AuthUser } from "../types/authTypes";

export const useUser = () => {
  return useQuery<AuthUser>({
    queryKey: ["user"],
    queryFn: async () => {
      const user = await authService.getProfile();
      return user;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
