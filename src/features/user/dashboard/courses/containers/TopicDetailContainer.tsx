"use client";

import { useEffect } from "react";
import { ChevronLeft, Check } from "lucide-react";
import Link from "next/link";
import { useCourseNavigation } from "@/features/user/dashboard/courses/context/CourseNavigationContext";
import { CourseInfoSidebar } from "@/features/user/dashboard/courses/components/CourseInfoSidebar";
import {
  topicData,
  courseInfoData,
} from "@/features/user/dashboard/courses/data/dummyData";

interface TopicDetailContainerProps {
  courseId: string;
  topicId: string;
}

export function TopicDetailContainer({
  courseId,
  topicId,
}: TopicDetailContainerProps) {
  const { setTopicNav } = useCourseNavigation();

  useEffect(() => {
    setTopicNav(
      { id: courseId, name: "Course Details" },
      { id: topicId, name: topicData.title },
    );
  }, [courseId, topicId, setTopicNav]);

  return (
    <div className="min-h-screen py-4 md:py-6 px-3 md:px-4">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        <div className="flex-1 min-w-0">
          <Link
            href={`/dashboard/courses/${courseId}`}
            className="inline-flex items-center gap-2 text-white/70 mb-4 md:mb-6 transition-colors duration-200 hover:text-white"
          >
            <ChevronLeft size={18} />
            <span className="text-sm">
              Courses / Course Details / {topicData.title}
            </span>
          </Link>

          <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
            {topicData.title}
          </h1>
          <p className="text-white/70 leading-relaxed mb-6 md:mb-8 max-w-2xl text-sm">
            {topicData.description}
          </p>

          <div className="lg:hidden mb-6">
            <CourseInfoSidebar
              progress={courseInfoData.progress}
              showPeople={false}
              showLastAccessed={false}
            />
          </div>

          <div className="rounded-xl overflow-hidden shadow-sm">
            <div className="bg-white p-5 border-l-4 border-primary-light">
              <h2 className="text-lg font-semibold text-primary-dark">
                Konten Pembelajaran
              </h2>
              <p className="text-sm text-neutral-500 mt-1">
                {topicData.materials.filter((m) => m.isCompleted).length}/
                {topicData.materials.length} materi selesai
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border-t border-white/20">
              {topicData.materials.map((material, index) => (
                <Link
                  key={material.id}
                  href={`/dashboard/courses/${courseId}/topic/${topicId}/materi/${material.id}`}
                  className={`flex items-center justify-between px-5 py-3.5 transition-all duration-200 hover:bg-primary-light/20 ${
                    index !== topicData.materials.length - 1
                      ? "border-b border-white/10"
                      : ""
                  }`}
                >
                  <span className="text-white text-sm">{material.title}</span>
                  {material.isCompleted && (
                    <Check className="text-white" size={18} />
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="w-64 shrink-0 hidden lg:block">
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
