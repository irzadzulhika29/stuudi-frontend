"use client";

import { useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useCourseNavigation } from "@/features/user/courses/context/CourseNavigationContext";
import { TopicCard } from "@/features/user/courses/components/TopicCard";
import { CourseInfoSidebar } from "@/features/user/courses/components/CourseInfoSidebar";
import { useCourseDetails } from "../hooks/useCourseDetails";
import { CourseDetailSkeleton } from "../components/CourseDetailSkeleton";
import Button from "@/shared/components/ui/Button";

interface CourseDetailContainerProps {
  courseId: string;
}

export function CourseDetailContainer({ courseId }: CourseDetailContainerProps) {
  const { setCourseNav } = useCourseNavigation();
  const { data: course, isLoading, isError } = useCourseDetails(courseId);

  useEffect(() => {
    if (course) {
      setCourseNav({ id: courseId, name: course.name });
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
          <Link href="/courses">
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
      current: course.progress.current_exp,
      total: course.progress.total_exp > 0 ? course.progress.total_exp : 100,
    },
    teachers: course.teachers.map((t) => ({ name: t.name })),
    participants: course.participants.map((p) => ({ id: p.user_id, name: p.name })),
    totalParticipants: course.total_participants,
    lastAccessed: course.last_accessed || undefined,
    readOnly: true,
    notes:
      course.my_notes?.map((n) => ({
        id: n.note_id,
        title: n.title,
        content: n.content,
        createdAt: n.created_at,
        topicId: n.topic_id,
        topicName: n.topic_name,
      })) || [],
  };

  return (
    <div className="min-h-screen px-3 py-4 md:px-4 md:py-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        <div className="min-w-0 flex-1">
          <Link
            href="/courses"
            className="mb-4 inline-flex items-center gap-2 text-white/70 transition-colors duration-200 hover:text-white md:mb-6"
          >
            <ChevronLeft size={18} />
            <span className="text-sm">Courses / {course.name}</span>
          </Link>

          <h1 className="mb-3 text-2xl font-bold text-white md:text-3xl">{course.name}</h1>
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
                  materials={topic.materials || []}
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
