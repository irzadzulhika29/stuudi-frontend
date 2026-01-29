export interface TeamMember {
  team_member_id: string;
  name: string;
  nis: string;
}

export interface TeamDetails {
  team_id: string;
  team_name: string;
  school: string;
  team_leader: string;
  nis: string;
  team_member: TeamMember[];
}

export interface TeamListItem {
  team_name: string;
  school_name: string;
}

export interface TeamListResponse {
  teams: TeamListItem[];
}

// Legacy/Dummy types
export interface Member {
  name: string;
  nis: string;
  role: string;
}

export interface TeamData {
  teamName: string;
  schoolName: string;
  members: Member[];
}
