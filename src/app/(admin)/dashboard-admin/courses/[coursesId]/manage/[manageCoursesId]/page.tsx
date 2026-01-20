import { use } from "react";
import { ManageCourseContainer } from "@/features/admin/dashboard/courses/containers/ManageCourseContainer";

interface PageProps {
  params: Promise<{
    coursesId: string;
    manageCoursesId: string;
  }>;
}

export default function ManageCoursePage({ params }: PageProps) {
  const { coursesId } = use(params);
  return <ManageCourseContainer courseId={coursesId} />;
}
