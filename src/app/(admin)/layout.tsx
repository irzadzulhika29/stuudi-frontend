"use client";

import { LayoutDashboard, BookOpen, Users } from "lucide-react";
import DashboardLayout from "@/features/user/dashboard/shared/components/DashboardLayout";
import { Sidebar } from "@/features/user/dashboard/shared/components/Sidebar";
import { Topbar } from "@/features/user/dashboard/shared/components/Topbar";
import { CourseNavigationProvider } from "@/features/user/courses/context/CourseNavigationContext";
import { useUser } from "@/features/auth/shared/hooks/useUser";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const adminMenuItems = [
    {
      label: "Dashboard",
      href: "/dashboard-admin",
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: "Courses",
      href: "/dashboard-admin/courses",
      icon: <BookOpen size={20} />,
      dynamicSubItems: true,
    },
    {
      label: "Participant",
      href: "/dashboard-admin/participant",
      icon: <Users size={20} />,
    },
  ];

  const { data: user } = useUser();

  const getDisplayName = () => {
    if (user?.email) return user.email.split("@")[0];
    return "Admin";
  };

  const topbarUser = {
    name: getDisplayName(),
    role: user?.roleName || user?.user_type || "Teacher",
    avatar: user?.avatar,
  };

  return (
    <CourseNavigationProvider>
      <DashboardLayout
        sidebar={<Sidebar menuItems={adminMenuItems} className="border-r-neutral-800" />}
        topbar={<Topbar user={topbarUser} />}
      >
        {children}
      </DashboardLayout>
    </CourseNavigationProvider>
  );
}
