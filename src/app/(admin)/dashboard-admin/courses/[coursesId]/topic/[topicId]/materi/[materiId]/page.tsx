"use client";

import { useParams } from "next/navigation";
import { MateriDetailContainer } from "@/features/admin/dashboard/courses/containers/MateriDetailContainer";

export default function AdminMateriDetailPage() {
  const params = useParams();
  const courseId = params.coursesId as string;
  const topicId = params.topicId as string;
  const materiId = params.materiId as string;

  return <MateriDetailContainer courseId={courseId} topicId={topicId} materiId={materiId} />;
}
