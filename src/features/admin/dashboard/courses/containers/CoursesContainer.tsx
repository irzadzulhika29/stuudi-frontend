"use client";

import { Search, Plus } from "lucide-react";
import { CourseCard } from "@/features/admin/dashboard/courses/components/CourseCard";
import { useState } from "react";
import Link from "next/link";
import { courses } from "@/features/user/dashboard/courses/data/dummyData";

export function CoursesContainer() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen py-6 px-4 overflow-x-hidden">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Course Management
        </h1>
      </div>

      <div className="flex gap-3 mb-8">
        <div className="flex-1 relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 z-10"
            size={20}
          />
          <input
            type="text"
            placeholder="Cari kelas.."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white placeholder-white/60 pl-12 pr-4 py-3 rounded-full focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all"
          />
        </div>

        <Link
          href="/dashboard-admin/courses/create"
          className="bg-secondary-light hover:bg-secondary-default text-white p-3 rounded-full transition-colors shadow-lg flex items-center justify-center"
        >
          <Plus size={24} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} {...course} />
        ))}
      </div>
    </div>
  );
}
