import { Metadata } from "next";
import { TeamContainer } from "@/features/user/teams/containers/TeamContainer";

export const metadata: Metadata = {
  title: "Informasi Tim - Stuudi",
  description:
    "Kelola identitas tim, tambahkan anggota, dan koordinasikan pembelajaran bersama. Kolaborasi yang efektif dimulai dari sini.",
  openGraph: {
    title: "Informasi Tim - Stuudi",
    description: "Platform kolaborasi tim untuk pembelajaran bersama dan manajemen anggota.",
    type: "website",
    locale: "id_ID",
  },
  robots: {
    index: false, // Private page, not for public indexing
    follow: false,
  },
};

export default function TeamIdentityPage() {
  return <TeamContainer />;
}
