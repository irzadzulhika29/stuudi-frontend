"use client";

import { LayoutDashboard, BookOpen, Users, Shield } from "lucide-react";
import DashboardLayout from "@/features/user/dashboard/components/DashboardLayout";
import { Sidebar } from "@/features/user/dashboard/components/Sidebar";
import { Topbar } from "@/features/user/dashboard/components/Topbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminMenuItems = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: "Manage Courses",
      href: "/admin/courses",
      icon: <BookOpen size={20} />,
    },
    {
      label: "Users",
      href: "/admin/users",
      icon: <Users size={20} />,
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: <Shield size={20} />,
    },
  ];

  const mockAdmin = {
    name: "Admin User",
    role: "Administrator",
    image:
      "https://ui-avatars.com/api/?name=Admin+User&background=180905&color=fff",
  };

  return (
    <DashboardLayout
      sidebar={
        <Sidebar menuItems={adminMenuItems} className="border-r-neutral-800" />
      }
      topbar={<Topbar user={mockAdmin} />}
    >
      {children}
    </DashboardLayout>
  );
}
