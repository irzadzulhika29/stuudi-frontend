export interface TeamMember {
    name: string;
    nis: string;
    role: string;
}

export interface TeamData {
    teamName: string;
    schoolName: string;
    members: TeamMember[];
}
