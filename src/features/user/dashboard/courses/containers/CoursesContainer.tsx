"use client";

import { Search, Plus } from "lucide-react";
import { CourseCard } from "@/features/user/dashboard/courses/components/CourseCard";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { courses } from "@/features/user/dashboard/courses/data/dummyData";
import { JoinClassModal } from "@/shared/components/ui/JoinClassModal";

export function CoursesContainer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showJoinModal, setShowJoinModal] = useState(false);

  const handleJoinClass = (code: string) => {
    console.log("Joining class with code:", code);
    setShowJoinModal(false);
  };

  return (
    <>
      <div className="min-h-screen overflow-x-hidden px-4 py-6">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-white">Courses</h1>
          <p className="text-lg text-white/80">Mau belajar apa hari ini?</p>
        </div>

        <div className="mb-8 flex gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute top-1/2 left-4 z-10 -translate-y-1/2 text-white/60"
              size={20}
            />
            <input
              type="text"
              placeholder="Cari kelas.."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border-2 border-white/30 bg-white/10 py-3 pr-4 pl-12 text-white placeholder-white/60 backdrop-blur-sm transition-all focus:border-white/50 focus:bg-white/15 focus:outline-none"
            />
          </div>

          <button
            onClick={() => setShowJoinModal(true)}
            className="bg-secondary-light hover:bg-secondary-default rounded-full p-3 text-white shadow-lg transition-colors"
          >
            <Plus size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>
      </div>

      <JoinClassModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onJoinClass={handleJoinClass}
      />
    </>
  );
}
