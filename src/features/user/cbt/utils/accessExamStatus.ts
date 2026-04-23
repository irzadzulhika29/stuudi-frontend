import { ExamAccessData } from "@/features/user/dashboard/types/dashboardTypes";

export interface ExamAccessStatus {
  isEligible: boolean;
  statusLabel: string;
  message: string;
}

export function getExamAccessStatus(examData: ExamAccessData): ExamAccessStatus {
  const isEligible = examData.can_start && examData.attempts_left > 0;

  return {
    isEligible,
    statusLabel: isEligible ? "Siap Dimulai" : "Belum Bisa Dimulai",
    message: examData.message,
  };
}

export function formatExamAccessWindow(
  startTime: string,
  endTime: string,
  locale = "id-ID"
): string {
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "-";
  }

  const formatter = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${formatter.format(start)} - ${formatter.format(end)}`;
}
