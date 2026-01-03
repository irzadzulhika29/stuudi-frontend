"use client";

import { useParams } from "next/navigation";
import { TopicDetailContainer } from "@/features/user/courses/containers/TopicDetailContainer";

export default function TopicDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const topicId = params.topicId as string;

  return <TopicDetailContainer courseId={courseId} topicId={topicId} />;
}
