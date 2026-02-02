export interface TabSwitchDetail {
  switch_number: number;
  switched_at: string;
  time_elapsed: string;
}

export interface SuspiciousAttempt {
  team_name: string;
  school: string;
  tab_switches: number;
  tab_switch_details: TabSwitchDetail[];
}

export interface CheatingReportData {
  exam_id: string;
  exam_title: string;
  total_suspicious: number;
  suspicious_attempts: SuspiciousAttempt[];
}

export interface CheatingReportResponse {
  status: {
    code: number;
    isSuccess: boolean;
  };
  message: string;
  data: CheatingReportData;
}
