"use client";

import { useEffect } from "react";
import { ChevronLeft, Check } from "lucide-react";
import Link from "next/link";
import { useCourseNavigation } from "@/features/user/dashboard/courses/context/CourseNavigationContext";
import { CourseInfoSidebar } from "@/features/user/dashboard/courses/components/CourseInfoSidebar";
import { topicData, courseInfoData } from "@/features/user/dashboard/courses/data/dummyData";

interface TopicDetailContainerProps {
  courseId: string;
  topicId: string;
}

export function TopicDetailContainer({ courseId, topicId }: TopicDetailContainerProps) {
  const { setTopicNav } = useCourseNavigation();

  useEffect(() => {
    setTopicNav({ id: courseId, name: "Course Details" }, { id: topicId, name: topicData.title });
  }, [courseId, topicId, setTopicNav]);

  return (
    <div className="min-h-screen px-3 py-4 md:px-4 md:py-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        <div className="min-w-0 flex-1">
          <Link
            href={`/courses/${courseId}`}
            className="mb-4 inline-flex items-center gap-2 text-white/70 transition-colors duration-200 hover:text-white md:mb-6"
          >
            <ChevronLeft size={18} />
            <span className="text-sm">Courses / Course Details / {topicData.title}</span>
          </Link>

          <h1 className="mb-3 text-2xl font-bold text-white md:text-3xl">{topicData.title}</h1>
          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-white/70 md:mb-8">
            {topicData.description}
          </p>

          <div className="mb-6 lg:hidden">
            <CourseInfoSidebar
              progress={courseInfoData.progress}
              showPeople={false}
              showLastAccessed={false}
            />
          </div>

          <div className="overflow-hidden rounded-xl shadow-sm">
            <div className="border-primary-light border-l-4 bg-white p-5">
              <h2 className="text-primary-dark text-lg font-semibold">Konten Pembelajaran</h2>
              <p className="mt-1 text-sm text-neutral-500">
                {topicData.materials.filter((m) => m.isCompleted).length}/
                {topicData.materials.length} materi selesai
              </p>
            </div>
            <div className="border-t border-white/20 bg-white/10 backdrop-blur-sm">
              {topicData.materials.map((material, index) => (
                <Link
                  key={material.id}
                  href={`/courses/${courseId}/topic/${topicId}/materi/${material.id}`}
                  className={`hover:bg-primary-light/20 flex items-center justify-between px-5 py-3.5 transition-all duration-200 ${
                    index !== topicData.materials.length - 1 ? "border-b border-white/10" : ""
                  }`}
                >
                  <span className="text-sm text-white">{material.title}</span>
                  {material.isCompleted && <Check className="text-white" size={18} />}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24">
            <CourseInfoSidebar
              progress={courseInfoData.progress}
              showPeople={false}
              showLastAccessed={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
