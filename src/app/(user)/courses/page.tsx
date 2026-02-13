import { Metadata } from "next";
import { CoursesContainer } from "@/features/user/courses/containers/CoursesContainer";

export const metadata: Metadata = {
  title: "Kursus Saya - Stuudi",
  description:
    "Akses semua kursus yang Anda ikuti. Lanjutkan pembelajaran, lihat progress, dan raih target belajar Anda di Stuudi.",
  openGraph: {
    title: "Kursus Saya - Stuudi",
    description: "Jelajahi berbagai kursus dan materi pembelajaran di platform Stuudi.",
    type: "website",
    locale: "id_ID",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function CoursesPage() {
  return <CoursesContainer />;
}
