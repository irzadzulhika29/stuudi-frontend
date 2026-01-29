"use client";

import { useEffect } from "react";
import { ChevronLeft, Check } from "lucide-react";
import Link from "next/link";
import { useCourseNavigation } from "@/features/user/courses/context/CourseNavigationContext";
import { CourseInfoSidebar } from "@/features/user/courses/components/CourseInfoSidebar";
import { useCourseTopics } from "../hooks/useCourseTopics";
import { useCourseDetails } from "../hooks/useCourseDetails";
import Button from "@/shared/components/ui/Button";

interface TopicDetailContainerProps {
  courseId: string;
  topicId: string;
}

export function TopicDetailContainer({ courseId, topicId }: TopicDetailContainerProps) {
  const { setTopicNav } = useCourseNavigation();
  const {
    data: courseTopics,
    isLoading: isLoadingTopics,
    isError: isTopicsError,
  } = useCourseTopics(courseId);
  const { data: courseDetails, isLoading: isLoadingCourse } = useCourseDetails(courseId);

  // Find the current topic from the topics list
  const topic = courseTopics?.topics.find((t) => t.topic_id === topicId);

  useEffect(() => {
    if (courseTopics && topic) {
      setTopicNav(
        { id: courseId, name: courseTopics.course_name },
        { id: topicId, name: topic.title }
      );
    }
  }, [courseId, topicId, setTopicNav, courseTopics, topic]);

  const isLoading = isLoadingTopics || isLoadingCourse;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-white/30 border-t-white" />
          <p>Memuat data...</p>
        </div>
      </div>
    );
  }

  if (isTopicsError || !topic) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Topik tidak ditemukan</h2>
          <Link href={`/courses/${courseId}`}>
            <Button className="mt-4" variant="secondary">
              Kembali ke Course
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const sidebarProps = {
    progress: courseDetails
      ? {
          current: courseDetails.progress.current_exp,
          total: courseDetails.progress.total_exp > 0 ? courseDetails.progress.total_exp : 100,
        }
      : { current: 0, total: 100 },
  };

  const completedCount = topic.materials.filter((m) => m.isCompleted).length;

  return (
    <div className="min-h-screen px-3 py-4 md:px-4 md:py-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        <div className="min-w-0 flex-1">
          <Link
            href={`/courses/${courseId}`}
            className="mb-4 inline-flex items-center gap-2 text-white/70 transition-colors duration-200 hover:text-white md:mb-6"
          >
            <ChevronLeft size={18} />
            <span className="text-sm">
              Courses / {courseTopics?.course_name} / {topic.title}
            </span>
          </Link>

          <h1 className="mb-3 text-2xl font-bold text-white md:text-3xl">{topic.title}</h1>
          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-white/70 md:mb-8">
            {topic.description}
          </p>

          <div className="mb-6 lg:hidden">
            <CourseInfoSidebar
              progress={sidebarProps.progress}
              topicId={topicId}
              showPeople={false}
              showLastAccessed={false}
            />
          </div>

          <div className="overflow-hidden rounded-xl shadow-sm">
            <div className="border-primary-light border-l-4 bg-white p-5">
              <h2 className="text-primary-dark text-lg font-semibold">Konten Pembelajaran</h2>
              <p className="mt-1 text-sm text-neutral-500">
                {completedCount}/{topic.materials.length} materi selesai
              </p>
            </div>
            <div className="border-t border-white/20 bg-white/10 backdrop-blur-sm">
              {topic.materials.length > 0 ? (
                topic.materials.map((material, index) => (
                  <Link
                    key={material.id}
                    href={`/courses/${courseId}/topic/${topicId}/materi/${material.id}`}
                    className={`hover:bg-primary-light/20 flex items-center justify-between px-5 py-3.5 transition-all duration-200 ${
                      index !== topic.materials.length - 1 ? "border-b border-white/10" : ""
                    }`}
                  >
                    <span className="text-sm text-white">{material.title}</span>
                    {material.isCompleted && <Check className="text-white" size={18} />}
                  </Link>
                ))
              ) : (
                <div className="px-5 py-8 text-center text-white/50">
                  Belum ada konten pada topik ini.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24">
            <CourseInfoSidebar
              progress={sidebarProps.progress}
              topicId={topicId}
              showPeople={false}
              showLastAccessed={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
