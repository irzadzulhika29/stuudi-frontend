"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, Trash2, Folder } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCourseNavigation } from "@/features/user/dashboard/courses/context/CourseNavigationContext";
import { ManageTopicList } from "@/features/admin/dashboard/courses/components/ManageTopicList";
import { CourseInfoSidebar } from "@/features/admin/dashboard/courses/components/CourseInfoSidebar";
import {
  courseData as initialCourseData,
  courseInfoData,
} from "@/features/user/dashboard/courses/data/dummyData";
import { Button, Input } from "@/shared/components/ui";

interface ManageCourseContainerProps {
  courseId: string;
}

export function ManageCourseContainer({
  courseId,
}: ManageCourseContainerProps) {
  const { setCourseNav } = useCourseNavigation();
  const [courseName, setCourseName] = useState(initialCourseData.title);
  const [description, setDescription] = useState(initialCourseData.description);

  useEffect(() => {
    setCourseNav({ id: courseId, name: "Manage Course" });
  }, [courseId, setCourseNav]);

  return (
    <div className="min-h-screen">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-4 mb-8">
            <Link
              href={`/dashboard-admin/courses/${courseId}`}
              className="w-10 h-10 bg-[#FF9D00] rounded-full flex items-center justify-center text-white hover:bg-[#E68E00] transition-colors"
            >
              <ChevronLeft size={24} />
            </Link>
            <span className="text-white text-lg">Course/Course Details</span>
          </div>

          {/* Header Actions */}
          <div className="flex justify-end mb-6 gap-3">
            <button className="text-white/80 hover:text-white transition-colors p-2">
              <Trash2 size={24} />
            </button>
            <Button
              variant="outline"
              className="text-white border-white bg-transparent hover:bg-white hover:text-black rounded-full px-8"
            >
              Apply edit
            </Button>
          </div>

          {/* Form Fields */}
          <div className="space-y-6 mb-8">
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">
                Nama Courses
              </label>
              <div className="bg-white p-1 rounded-xl">
                <Input
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 placeholder:text-white/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-white text-sm font-medium">
                Deskripsi Courses
              </label>
              <div className="bg-white p-1 rounded-xl">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl bg-transparent border-none focus:outline-none resize-none h-32 placeholder:text-white/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-white text-sm font-medium">
                Thumbnail Course
              </label>
              <div className="bg-white p-1 rounded-xl">
                <Input
                  placeholder="Pilih File"
                  rightIcon={<Folder size={20} />}
                  className="bg-transparent border-none focus:ring-0 placeholder:text-black cursor-pointer"
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="lg:hidden mb-6">
            <CourseInfoSidebar {...courseInfoData} />
          </div>

          <div className="">
            <ManageTopicList
              courseId={courseId}
              topics={initialCourseData.topics}
            />
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
