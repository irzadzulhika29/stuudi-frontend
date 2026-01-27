"use client";

import { useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCourseNavigation } from "@/features/user/dashboard/courses/context/CourseNavigationContext";
import { TopicCard } from "@/features/admin/dashboard/courses/components/TopicCard";
import { CourseInfoSidebar } from "@/features/admin/dashboard/courses/components/CourseInfoSidebar";
import { useTeachingCourseDetails } from "../hooks/useTeachingCourseDetails";
import { Button } from "@/shared/components/ui";
import { CourseDetailSkeleton } from "@/features/user/dashboard/courses/components/CourseDetailSkeleton";

interface CourseDetailContainerProps {
  courseId: string;
}

export function CourseDetailContainer({ courseId }: CourseDetailContainerProps) {
  const { setCourseNav } = useCourseNavigation();
  const { data: course, isLoading, isError } = useTeachingCourseDetails(courseId);

  useEffect(() => {
    if (course) {
      setCourseNav({ id: courseId, name: course.name }, "/dashboard-admin/courses");
    }
  }, [courseId, setCourseNav, course]);

  if (isLoading) {
    return <CourseDetailSkeleton />;
  }

  if (isError || !course) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Gagal memuat kursus</h2>
          <Link href="/dashboard-admin/courses">
            <Button className="mt-4" variant="secondary">
              Kembali ke Courses
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
    <div className="min-h-screen">
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        <div className="min-w-0 flex-1">
          <div className="mb-8 flex items-center gap-4">
            <Link
              href="/dashboard-admin/courses"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF9D00] text-white transition-colors hover:bg-[#E68E00]"
            >
              <ChevronLeft size={24} />
            </Link>
            <span className="text-lg text-white">Course / {course.name}</span>
          </div>

          {course.image_url && (
            <div className="relative mb-6 h-64 w-full overflow-hidden rounded-xl">
              <Image src={course.image_url} alt={course.name} fill className="object-cover" />
            </div>
          )}

          <div className="mb-5 flex items-center justify-between">
            <h1 className="mb-3 text-2xl font-bold text-white md:text-3xl">{course.name}</h1>
            <Link href={`/dashboard-admin/courses/${courseId}/manage/${courseId}`}>
              <Button
                className="!text-primary hover:!bg-neutral-light !border-none !bg-white hover:!border-none"
                size="md"
                variant="outline"
              >
                Manage Course
              </Button>
            </Link>
          </div>
          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-white/70 md:mb-8">
            {course.description}
          </p>

          <div className="mb-6 lg:hidden">
            <CourseInfoSidebar {...sidebarProps} />
          </div>

          <div className="space-y-3">
            {course.topics && course.topics.length > 0 ? (
              course.topics.map((topic, index) => (
                <TopicCard
                  key={topic.topic_id}
                  id={topic.topic_id}
                  courseId={courseId}
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
                  isExpanded={index === 0}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-white/50 backdrop-blur-sm">
                Belum ada materi yang tersedia untuk kursus ini.
              </div>
            )}
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
