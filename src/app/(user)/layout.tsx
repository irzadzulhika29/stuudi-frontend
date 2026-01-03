"use client";

import { LayoutDashboard, BookOpen, Users } from "lucide-react";
import DashboardLayout from "@/features/user/dashboard/components/DashboardLayout";
import { Sidebar } from "@/features/user/dashboard/components/Sidebar";
import { Topbar } from "@/features/user/dashboard/components/Topbar";
import { CourseNavigationProvider } from "@/features/user/courses/context/CourseNavigationContext";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userMenuItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: "Courses",
      href: "/courses",
      icon: <BookOpen size={20} />,
      dynamicSubItems: true,
    },
    {
      label: "Team Identity",
      href: "/team",
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
