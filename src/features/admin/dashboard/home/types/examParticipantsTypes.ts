export interface TeamMember {
  team_member_id: string;
  name: string;
}

export interface ExamParticipant {
  elearning_user_id: string;
  username: string;
  team_name: string;
  leader_name: string;
  school: string;
  team_members: TeamMember[];
}

export interface ExamParticipantsData {
  participants: ExamParticipant[];
}

export interface ExamParticipantsResponse {
  status: {
    code: number;
    isSuccess: boolean;
  };
  message: string;
  data: ExamParticipant[];
}
