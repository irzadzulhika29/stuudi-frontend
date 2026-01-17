"use client";

import { LayoutDashboard, BookOpen, Users, Shield } from "lucide-react";
import DashboardLayout from "@/features/user/dashboard/shared/components/DashboardLayout";
import { Sidebar } from "@/features/user/dashboard/shared/components/Sidebar";
import { Topbar } from "@/features/user/dashboard/shared/components/Topbar";
import { CourseNavigationProvider } from "@/features/user/dashboard/courses/context/CourseNavigationContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminMenuItems = [
    {
      label: "Dashboard",
      href: "/dashboard-admin",
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: "Courses",
      href: "/courses",
      icon: <BookOpen size={20} />,
    },
    {
      label: "Participant",
      href: "/participant",
      icon: <Users size={20} />,
    },
  ];

  const mockAdmin = {
    name: "Admin User",
    role: "Administrator",
    image:
      "https://ui-avatars.com/api/?name=Admin+User&background=180905&color=fff",
  };

  return (
    <CourseNavigationProvider>
      <DashboardLayout
        sidebar={
          <Sidebar
            menuItems={adminMenuItems}
            className="border-r-neutral-800"
          />
        }
        topbar={<Topbar user={mockAdmin} />}
      >
        {children}
      </DashboardLayout>
    </CourseNavigationProvider>
  );
}
