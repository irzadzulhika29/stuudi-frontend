"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config/constants";
import { CheatingReportData, CheatingReportResponse } from "../types/cheatingReportTypes";

export const useGetCheatingReport = (examId: string) => {
  return useQuery<CheatingReportData>({
    queryKey: ["cheatingReport", examId],
    queryFn: async () => {
      const response = await api.get<CheatingReportResponse>(
        API_ENDPOINTS.TEACHER.CHEATING_REPORT(examId)
      );
      return response.data.data;
    },
    enabled: !!examId,
  });
};
