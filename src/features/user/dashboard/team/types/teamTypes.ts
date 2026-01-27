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
