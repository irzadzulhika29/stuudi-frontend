"use client";

import { useParams } from "next/navigation";
import { TopicDetailContainer } from "@/features/user/courses/containers/TopicDetailContainer";
import { ErrorBoundary } from "@/shared/components/ui/ErrorBoundary";

export default function TopicDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const topicId = params.topicId as string;

  return (
    <ErrorBoundary>
      <TopicDetailContainer courseId={courseId} topicId={topicId} />
    </ErrorBoundary>
  );
}
