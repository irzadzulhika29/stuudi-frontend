"use client";

import { useParams } from "next/navigation";
import { MateriDetailContainer } from "@/features/user/dashboard/courses/containers/MateriDetailContainer";
import { UjiPemahamanContainer } from "@/features/user/dashboard/courses/containers/UjiPemahamanContainer";

const UJI_PEMAHAMAN_IDS = ["4"];

export default function MateriDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const topicId = params.topicId as string;
  const materiId = params.materiId as string;

  const isUjiPemahaman = UJI_PEMAHAMAN_IDS.includes(materiId);

  if (isUjiPemahaman) {
    return <UjiPemahamanContainer courseId={courseId} topicId={topicId} materiId={materiId} />;
  }

  return <MateriDetailContainer courseId={courseId} topicId={topicId} materiId={materiId} />;
}
