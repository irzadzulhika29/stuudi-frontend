"use client";

import { useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { TopicCard } from "@/features/admin/dashboard/courses/components/TopicCard";
import { CourseInfoSidebar } from "@/features/admin/dashboard/courses/components/CourseInfoSidebar";
import { useTeachingCourseDetails } from "@/features/admin/dashboard/courses/hooks/useTeachingCourseDetails";
import { CourseDetailSkeleton } from "@/features/user/courses/components/CourseDetailSkeleton";
import Button from "@/shared/components/ui/Button";

export default function AdminTopicDetailPage() {
  const params = useParams();
  const coursesId = params.coursesId as string;
  const topicId = params.topicId as string;

  const { data: course, isLoading, isError } = useTeachingCourseDetails(coursesId);

  if (isLoading) {
    return <CourseDetailSkeleton />;
  }

  if (isError || !course) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Gagal memuat kursus</h2>
          <Link href={`/dashboard-admin/courses`}>
            <Button className="mt-4" variant="secondary">
              Kembali ke Courses
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Find the specific topic
  const topic = course.topics?.find((t) => t.topic_id === topicId);

  if (!topic) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Topik tidak ditemukan</h2>
          <Link href={`/dashboard-admin/courses/${coursesId}`}>
            <Button className="mt-4" variant="secondary">
              Kembali ke Course Detail
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const sidebarProps = {
    progress: {
      current: course.progress?.current_exp || 0,
      total: course.progress?.total_exp || 100,
    },
    teachers: course.teachers?.map((t) => ({ name: t.name })) || [],
    participants: course.participants?.map((p) => ({ id: p.user_id, name: p.name })) || [],
    totalParticipants: course.total_participants || 0,
    lastAccessed: course.last_accessed || undefined,
    enrollCode: course.enrollment_code,
  };

  return (
    <div className="min-h-screen px-3 py-4 md:px-4 md:py-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        <div className="min-w-0 flex-1">
          <Link
            href={`/dashboard-admin/courses/${coursesId}`}
            className="mb-4 inline-flex items-center gap-2 text-white/70 transition-colors duration-200 hover:text-white md:mb-6"
          >
            <ChevronLeft size={18} />
            <span className="text-sm">
              Courses / {course.name} / {topic.title}
            </span>
          </Link>

          <h1 className="mb-3 text-2xl font-bold text-white md:text-3xl">{topic.title}</h1>
          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-white/70 md:mb-8">
            {topic.description}
          </p>

          <div className="mb-6 lg:hidden">
            <CourseInfoSidebar {...sidebarProps} />
          </div>

          <div className="space-y-3">
            {/* Show only this topic's content */}
            <TopicCard
              id={topic.topic_id}
              courseId={coursesId}
              title={topic.title}
              description={topic.description}
              materials={
                topic.contents?.map((c) => ({
                  id: c.content_id,
                  title: c.title,
                  isCompleted: c.is_completed,
                })) || []
              }
              status={topic.status}
              isExpanded={true}
            />
          </div>
        </div>

        <div className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24">
            <CourseInfoSidebar {...sidebarProps} />
          </div>
        </div>
      </div>
    </div>
  );
}
