import { Metadata } from "next";
import { TeamContainer } from "@/features/user/dashboard/team/containers/TeamContainer";

export const metadata: Metadata = {
  title: "Informasi Tim",
  description: "Kelola informasi tim dan anggota tim Anda.",
};

export default function TeamIdentityPage() {
  return <TeamContainer />;
}
