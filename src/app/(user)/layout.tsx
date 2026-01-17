"use client";

import { LayoutDashboard, BookOpen, Users } from "lucide-react";
import DashboardLayout from "@/features/user/dashboard/shared/components/DashboardLayout";
import { Sidebar } from "@/features/user/dashboard/shared/components/Sidebar";
import { Topbar } from "@/features/user/dashboard/shared/components/Topbar";
import { CourseNavigationProvider } from "@/features/user/dashboard/courses/context/CourseNavigationContext";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userMenuItems = [
    {
      label: "Dashboard",
      href: "/dashboard/home",
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: "Courses",
      href: "/dashboard/courses",
      icon: <BookOpen size={20} />,
      dynamicSubItems: true,
    },
    {
      label: "Team Identity",
      href: "/dashboard/team",
      icon: <Users size={20} />,
    },
  ];

  const user = {
    name: "Khaizuran Alvaro",
    role: "Participant",
  };

  return (
    <CourseNavigationProvider>
      <DashboardLayout
        sidebar={<Sidebar menuItems={userMenuItems} />}
        topbar={<Topbar user={user} />}
      >
        {children}
      </DashboardLayout>
    </CourseNavigationProvider>
  );
}
