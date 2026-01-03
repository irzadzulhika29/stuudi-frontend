"use client";

import { useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useCourseNavigation } from "@/features/user/courses/context/CourseNavigationContext";
import { TopicCard } from "@/features/user/courses/components/TopicCard";
import { CourseInfoSidebar } from "@/features/user/courses/components/CourseInfoSidebar";

const courseData = {
  id: "1",
  title: "Course Details",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum varius, dui nec auctor pellentesque, purus massa pulvinar odio, in lacinia mauris erat eu dolor. Etiam semper, lacus id vulputate blandit, nunc libero imperdiet sem, varius luctus lorem sapien nec ex. Curabitur sollicitudin nisi nec eleifend dignissim.",
  topics: [
    {
      id: "1",
      title: "Topic 1",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum varius, dui nec auctor pellentesque, purus massa pulvinar odio, in lacinia mauris erat eu dolor.",
      status: "completed" as const,
      materials: [
        { id: "1", title: "Kata Pengantar", isCompleted: true },
        { id: "2", title: "Materi 1", isCompleted: true },
        { id: "3", title: "Materi 2", isCompleted: true },
        { id: "4", title: "Uji Pemahaman", isCompleted: true },
      ],
    },
    {
      id: "2",
      title: "Topic 2",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum varius, dui nec auctor pellentesque, purus massa pulvinar odio, in lacinia mauris erat eu dolor.",
      status: "in-progress" as const,
      materials: [
        { id: "1", title: "Kata Pengantar", isCompleted: true },
        { id: "2", title: "Materi 1", isCompleted: false },
        { id: "3", title: "Materi 2", isCompleted: false },
        { id: "4", title: "Uji Pemahaman", isCompleted: false },
      ],
    },
    {
      id: "3",
      title: "Topic 3",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum varius, dui nec auctor pellentesque.",
      status: "locked" as const,
      materials: [
        { id: "1", title: "Kata Pengantar", isCompleted: false },
        { id: "2", title: "Uji Pemahaman", isCompleted: false },
      ],
    },
  ],
};

const courseInfoData = {
  progress: {
    current: 200,
    total: 2500,
  },
  teachers: [{ name: "Dian Pratiwi" }, { name: "Dian Pratiwi" }],
  participants: [
    { name: "Dian Pratiwi" },
    { name: "Dian Pratiwi" },
    { name: "Dian Pratiwi" },
  ],
  totalParticipants: 103,
  lastAccessed: "Sunday, 28 Dec 2025",
};

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
    <div className="min-h-screen py-4 md:py-6 px-3 md:px-4">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        <div className="flex-1 min-w-0">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-white/70 mb-4 md:mb-6 transition-colors duration-200 hover:text-white"
          >
            <ChevronLeft size={18} />
            <span className="text-sm">Course / Course Details</span>
          </Link>

          <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
            {courseData.title}
          </h1>
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

        <div className="w-64 flex-shrink-0 hidden lg:block">
          <div className="sticky top-24">
            <CourseInfoSidebar {...courseInfoData} />
          </div>
        </div>
      </div>
    </div>
  );
}
