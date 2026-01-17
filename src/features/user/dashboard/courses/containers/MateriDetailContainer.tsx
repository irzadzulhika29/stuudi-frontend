"use client";

import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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

export function MateriDetailContainer({
  courseId,
  topicId,
  materiId,
}: MateriDetailContainerProps) {
  const { setMateriNav } = useCourseNavigation();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    setMateriNav(
      { id: courseId, name: "Course Details" },
      { id: topicId, name: topicData.title },
      { id: materiId, name: materiData.title },
    );
  }, [courseId, topicId, materiId, setMateriNav]);

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
              Courses / Course Details / {topicData.title} / {materiData.title}
            </span>
          </Link>

          <div className="lg:hidden mb-6">
            <CourseInfoSidebar
              progress={courseInfoData.progress}
              showPeople={false}
              showLastAccessed={false}
            />
          </div>

          <div className="p-5">
            <h1 className="text-xl md:text-2xl font-bold text-white mb-3">
              {materiData.title}
            </h1>
            <p className="text-white/80 text-sm leading-relaxed">
              {materiData.description}
            </p>
          </div>

          <div className="p-5 md:p-6">
            {materiData.sections.map((section, index) => (
              <div key={index} className="mb-6">
                <h2 className="text-lg font-bold text-white mb-4">
                  {section.title}
                </h2>
                <div
                  className="text-white/70"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </div>
            ))}
          </div>

          {materiData.quiz && (
            <div className="bg-white/10 backdrop-blur-sm p-5 md:p-6 rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-medium text-white">
                  {materiData.quiz.title}
                </span>
                <span className="text-xs text-red-500 bg-white rounded-full px-2 py-1 font-medium">
                  Required
                </span>
              </div>

              <div className="p-5 mb-6">
                <div className="relative w-full aspect-3/2 rounded-lg overflow-hidden mb-4">
                  <Image
                    src="/images/quiz-image.webp"
                    alt="Quiz illustration"
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-white font-medium mb-4">
                  {materiData.quiz.question}
                </p>

                <div className="space-y-3">
                  {materiData.quiz.options.map((option, index) => (
                    <label
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedOption === index
                          ? "border-primary-light bg-primary-light/5"
                          : "border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="quiz-option"
                        checked={selectedOption === index}
                        onChange={() => setSelectedOption(index)}
                        className="w-4 h-4 text-primary-light accent-primary-light"
                      />
                      <span className="text-sm text-white">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button className="w-full bg-primary text-white font-medium py-3 rounded-full hover:bg-primary-dark/90 transition-colors">
                Submit
              </button>
            </div>
          )}

          {/* Continue Button */}
          <div className="mt-6">
            <Link
              href={`/dashboard/courses/${courseId}/topic/${topicId}`}
              className="block w-full bg-secondary text-white font-medium py-3 rounded-full text-center hover:bg-secondary-dark transition-colors"
            >
              Continue to the next lesson
            </Link>
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
