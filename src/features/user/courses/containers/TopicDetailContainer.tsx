"use client";

import { useEffect } from "react";
import { ChevronLeft, Check, Play } from "lucide-react";
import Link from "next/link";
import { useCourseNavigation } from "@/features/user/courses/context/CourseNavigationContext";
import { CourseInfoSidebar } from "@/features/user/courses/components/CourseInfoSidebar";

const topicData = {
  id: "1",
  title: "Topic 1",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum varius, dui nec auctor pellentesque, purus massa pulvinar odio, in lacinia mauris erat eu dolor.",
  materials: [
    { id: "1", title: "Kata Pengantar", isCompleted: true, duration: "5 min" },
    { id: "2", title: "Materi 1", isCompleted: true, duration: "15 min" },
    { id: "3", title: "Materi 2", isCompleted: false, duration: "20 min" },
    { id: "4", title: "Uji Pemahaman", isCompleted: false, duration: "10 min" },
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
      { id: topicId, name: topicData.title }
    );
  }, [courseId, topicId, setTopicNav]);

  return (
    <div className="min-h-screen py-4 md:py-6 px-3 md:px-4">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        <div className="flex-1 min-w-0">
          <Link
            href={`/courses/${courseId}`}
            className="inline-flex items-center gap-2 text-white/70 mb-4 md:mb-6 transition-colors duration-200 hover:text-white"
          >
            <ChevronLeft size={18} />
            <span className="text-sm">Course Details / {topicData.title}</span>
          </Link>

          <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
            {topicData.title}
          </h1>
          <p className="text-white/70 leading-relaxed mb-6 md:mb-8 max-w-2xl text-sm">
            {topicData.description}
          </p>

          <div className="lg:hidden mb-6">
            <CourseInfoSidebar {...courseInfoData} />
          </div>

          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="bg-primary-light px-5 py-4">
              <h2 className="font-semibold text-white">Konten Pembelajaran</h2>
            </div>
            <div>
              {topicData.materials.map((material, index) => (
                <Link
                  key={material.id}
                  href={`/courses/${courseId}/topic/${topicId}/materi/${material.id}`}
                  className={`flex items-center justify-between px-5 py-4 transition-colors duration-200 hover:bg-neutral-50 ${
                    index !== topicData.materials.length - 1
                      ? "border-b border-neutral-100"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        material.isCompleted
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-primary-light/20 text-primary-light"
                      }`}
                    >
                      {material.isCompleted ? (
                        <Check size={16} />
                      ) : (
                        <Play size={14} />
                      )}
                    </div>
                    <div>
                      <p className="text-neutral-800 text-sm font-medium">
                        {index + 1}. {material.title}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {material.duration}
                      </p>
                    </div>
                  </div>
                  {material.isCompleted && (
                    <span className="text-xs text-emerald-600 font-medium">
                      Selesai
                    </span>
                  )}
                </Link>
              ))}
            </div>
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
