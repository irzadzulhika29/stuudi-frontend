import { ExamFormContainer } from "@/features/admin/dashboard/courses/containers/ExamFormContainer";

export default async function NewExamPage({
  params,
}: {
  params: Promise<{ coursesId: string; manageCoursesId: string }>;
}) {
  const { coursesId } = await params;

  return (
    <div className="min-h-screen w-full">
      <ExamFormContainer courseId={coursesId} />
    </div>
  );
}
