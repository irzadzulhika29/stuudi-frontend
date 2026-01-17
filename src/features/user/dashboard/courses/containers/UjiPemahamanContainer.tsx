"use client";

import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useCourseNavigation } from "@/features/user/dashboard/courses/context/CourseNavigationContext";
import { CourseInfoSidebar } from "@/features/user/dashboard/courses/components/CourseInfoSidebar";
import { QuizContainer } from "@/features/user/dashboard/courses/components/quiz/QuizContainer";
import { QuizStatus } from "@/features/user/dashboard/courses/types/cTypes";
import {
  quizData,
  topicData,
  courseInfoData,
} from "@/features/user/dashboard/courses/data/dummyData";

interface UjiPemahamanContainerProps {
  courseId: string;
  topicId: string;
  materiId: string;
}

export function UjiPemahamanContainer({
  courseId,
  topicId,
}: UjiPemahamanContainerProps) {
  const { setMateriNav } = useCourseNavigation();
  const [quizStatus, setQuizStatus] = useState<QuizStatus>("start");

  const showSidebar = quizStatus === "start";

  useEffect(() => {
    setMateriNav(
      { id: courseId, name: "Course Details" },
      { id: topicId, name: topicData.title },
      { id: "quiz", name: quizData.title },
    );
  }, [courseId, topicId, setMateriNav]);

  return (
    <div className="min-h-screen py-4 md:py-6 px-3 md:px-4">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        <div className="flex-1 min-w-0">
          <Link
            href={`/dashboard/courses/${courseId}/topic/${topicId}`}
            className="inline-flex items-center gap-2 text-white/70 mb-4 md:mb-6 transition-colors duration-200 hover:text-white"
          >
            <ChevronLeft size={18} />
            <span className="text-sm">
              Courses / Course Details / {topicData.title} / {quizData.title}
            </span>
          </Link>

          {showSidebar && (
            <div className="lg:hidden mb-6">
              <CourseInfoSidebar
                progress={courseInfoData.progress}
                showPeople={false}
                showLastAccessed={false}
              />
            </div>
          )}

          <QuizContainer
            quiz={quizData}
            courseId={courseId}
            topicId={topicId}
            onStatusChange={setQuizStatus}
          />
        </div>

        {showSidebar && (
          <div className="w-64 shrink-0 hidden lg:block">
            <div className="sticky top-24">
              <CourseInfoSidebar
                progress={courseInfoData.progress}
                showPeople={false}
                showLastAccessed={false}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
