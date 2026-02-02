export interface DisqualifiedParticipant {
  team_name: string;
  school: string;
  violation_type?: string;
  reason?: string;
  disqualified_at?: string;
}

export interface DisqualifiedParticipantsData {
  exam_id: string;
  exam_title: string;
  total_disqualified: number;
  disqualified_participants: DisqualifiedParticipant[];
}

export interface DisqualifiedParticipantsResponse {
  status: {
    code: number;
    isSuccess: boolean;
  };
  message: string;
  data: DisqualifiedParticipantsData;
}
