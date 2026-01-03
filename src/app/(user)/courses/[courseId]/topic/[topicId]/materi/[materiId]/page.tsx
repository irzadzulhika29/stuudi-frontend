"use client";

import { useParams } from "next/navigation";
import { MateriDetailContainer } from "@/features/user/courses/containers/MateriDetailContainer";

export default function MateriDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const topicId = params.topicId as string;
  const materiId = params.materiId as string;

  return (
    <MateriDetailContainer
      courseId={courseId}
      topicId={topicId}
      materiId={materiId}
    />
  );
}
