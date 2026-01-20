"use client";

import { useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useCourseNavigation } from "@/features/user/dashboard/courses/context/CourseNavigationContext";
import { TopicCard } from "@/features/user/dashboard/courses/components/TopicCard";
import { CourseInfoSidebar } from "@/features/user/dashboard/courses/components/CourseInfoSidebar";
import { courseData, courseInfoData } from "@/features/user/dashboard/courses/data/dummyData";

interface CourseDetailContainerProps {
  courseId: string;
}

export function CourseDetailContainer({ courseId }: CourseDetailContainerProps) {
  const { setCourseNav } = useCourseNavigation();

  useEffect(() => {
    setCourseNav({ id: courseId, name: "Course Details" });
  }, [courseId, setCourseNav]);

  return (
    <div className="min-h-screen px-3 py-4 md:px-4 md:py-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        <div className="min-w-0 flex-1">
          <Link
            href="/courses"
            className="mb-4 inline-flex items-center gap-2 text-white/70 transition-colors duration-200 hover:text-white md:mb-6"
          >
            <ChevronLeft size={18} />
            <span className="text-sm">Courses / Course Details</span>
          </Link>

          <h1 className="mb-3 text-2xl font-bold text-white md:text-3xl">{courseData.title}</h1>
          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-white/70 md:mb-8">
            {courseData.description}
          </p>

          <div className="mb-6 lg:hidden">
            <CourseInfoSidebar {...courseInfoData} />
          </div>

          <div className="space-y-3">
            {courseData.topics.map((topic) => (
              <TopicCard
                key={topic.id}
                id={topic.id}
                courseId={courseId}
                title={topic.title}
                description={topic.description}
                materials={topic.materials}
                status={topic.status}
                isExpanded={topic.id === "1"}
              />
            ))}
          </div>
        </div>

        <div className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24">
            <CourseInfoSidebar {...courseInfoData} />
          </div>
        </div>
      </div>
    </div>
  );
}
