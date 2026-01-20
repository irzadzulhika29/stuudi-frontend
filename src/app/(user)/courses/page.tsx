import { Metadata } from "next";
import { CoursesContainer } from "@/features/user/dashboard/courses/containers/CoursesContainer";

export const metadata: Metadata = {
  title: "Kursus",
  description: "Jelajahi berbagai kursus dan materi pembelajaran di Arteri.",
};

export default function CoursesPage() {
  return <CoursesContainer />;
}
