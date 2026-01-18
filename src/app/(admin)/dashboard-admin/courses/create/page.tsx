import { Metadata } from "next";
import { CreateCourseContainer } from "@/features/admin/dashboard/courses/containers/CreateCourseContainer";

export const metadata: Metadata = {
  title: "Tambah Kursus Baru",
  description: "Buat kursus baru di platform Arteri.",
};

export default function CreateCoursePage() {
  return <CreateCourseContainer />;
}
