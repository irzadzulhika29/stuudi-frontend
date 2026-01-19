"use client";

import { useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCourseNavigation } from "@/features/user/dashboard/courses/context/CourseNavigationContext";
import { TopicCard } from "@/features/admin/dashboard/courses/components/TopicCard";
import { CourseInfoSidebar } from "@/features/admin/dashboard/courses/components/CourseInfoSidebar";
import {
  courseData,
  courseInfoData,
} from "@/features/user/dashboard/courses/data/dummyData";
import { Button } from "@/shared/components/ui";

interface CourseDetailContainerProps {
  courseId: string;
}

export function CourseDetailContainer({
  courseId,
}: CourseDetailContainerProps) {
  const { setCourseNav } = useCourseNavigation();

  useEffect(() => {
    setCourseNav({ id: courseId, name: "Course Details" });
  }, [courseId, setCourseNav]);

  return (
    <div className="min-h-screen ">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/dashboard-admin/courses"
              className="w-10 h-10 bg-[#FF9D00] rounded-full flex items-center justify-center text-white hover:bg-[#E68E00] transition-colors"
            >
              <ChevronLeft size={24} />
            </Link>
            <span className="text-white text-lg">Course/Course Details</span>
          </div>

          <div className="relative w-full h-64 mb-6 overflow-hidden">
            <Image
              src={courseData.image}
              alt="Course Image"
              fill
              className="object-cover"
            />
          </div>

          <div className="mb-5 flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
              {courseData.title}
            </h1>
            <Link href={`/dashboard-admin/courses/${courseId}/manage/${courseId}`}>
              <Button className="cursor-pointer" size="md" variant="outline">
                Manage Course
              </Button>
            </Link>
          </div>
          <p className="text-white/70 leading-relaxed mb-6 md:mb-8 max-w-2xl text-sm">
            {courseData.description}
          </p>

          <div className="lg:hidden mb-6">
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

        <div className="w-64 shrink-0 hidden lg:block">
          <div className="sticky top-24">
            <CourseInfoSidebar {...courseInfoData} />
          </div>
        </div>
      </div>
    </div>
  );
}
