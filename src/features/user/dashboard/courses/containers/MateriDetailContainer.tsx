"use client";

import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import Button from "@/shared/components/ui/Button";
import { QuestionCard } from "@/features/user/cbt/components/QuestionCard";
import { useCourseNavigation } from "@/features/user/dashboard/courses/context/CourseNavigationContext";
import { CourseInfoSidebar } from "@/features/user/dashboard/courses/components/CourseInfoSidebar";
import {
  materiData,
  topicData,
  courseInfoData,
} from "@/features/user/dashboard/courses/data/dummyData";

interface MateriDetailContainerProps {
  courseId: string;
  topicId: string;
  materiId: string;
}

export function MateriDetailContainer({ courseId, topicId, materiId }: MateriDetailContainerProps) {
  const { setMateriNav } = useCourseNavigation();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    setMateriNav(
      { id: courseId, name: "Course Details" },
      { id: topicId, name: topicData.title },
      { id: materiId, name: materiData.title }
    );
  }, [courseId, topicId, materiId, setMateriNav]);

  return (
    <div className="min-h-screen px-3 py-4 md:px-4 md:py-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        <div className="min-w-0 flex-1">
          <Link
            href={`/courses/${courseId}/topic/${topicId}`}
            className="mb-4 inline-flex items-center gap-2 text-white/70 transition-colors duration-200 hover:text-white md:mb-6"
          >
            <ChevronLeft size={18} />
            <span className="text-sm">
              Courses / Course Details / {topicData.title} / {materiData.title}
            </span>
          </Link>

          <div className="mb-6 lg:hidden">
            <CourseInfoSidebar
              progress={courseInfoData.progress}
              showPeople={false}
              showLastAccessed={false}
            />
          </div>

          <div className="p-5">
            <h1 className="mb-3 text-xl font-bold text-white md:text-2xl">{materiData.title}</h1>
            <p className="text-sm leading-relaxed text-white/80">{materiData.description}</p>
          </div>

          <div className="p-5 md:p-6">
            {materiData.sections.map((section, index) => (
              <div key={index} className="mb-6">
                <h2 className="mb-4 text-lg font-bold text-white">{section.title}</h2>
                <div
                  className="text-white/70"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </div>
            ))}
          </div>

          {materiData.quiz && (
            <div className="rounded-xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm md:p-6">
              <div className="mb-6 flex items-center justify-between">
                <span className="text-sm font-medium text-white">{materiData.quiz.title}</span>
                <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-red-500">
                  Required
                </span>
              </div>

              <QuestionCard
                question={materiData.quiz}
                selectedAnswer={
                  selectedOption !== null ? materiData.quiz.options[selectedOption].label : null
                }
                onSelectAnswer={(answer) => {
                  const idx = materiData.quiz!.options.findIndex((opt) => opt.label === answer);
                  if (idx !== -1) setSelectedOption(idx);
                }}
              />

              <div className="mt-6">
                <Button className="w-full">Submit</Button>
              </div>
            </div>
          )}

          {/* Continue Button */}
          <div className="mt-6">
            <Button
              href={`/courses/${courseId}/topic/${topicId}`}
              variant="secondary"
              className="w-full"
            >
              Continue to the next lesson
            </Button>
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
