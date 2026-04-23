import { ExamFormContainer } from "@/features/admin/dashboard/courses/containers/ExamFormContainer";

interface ExamDetailPageProps {
  params: Promise<{
    coursesId: string;
    manageCoursesId: string;
    examId: string;
  }>;
}

export default async function ExamDetailPage({ params }: ExamDetailPageProps) {
  const { coursesId, examId } = await params;

  return <ExamFormContainer courseId={coursesId} examId={examId} isEditMode={true} />;
}
