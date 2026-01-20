"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HelpCircle, ChevronRight, Menu } from "lucide-react";
import { ReactNode } from "react";
import Image from "next/image";
import { useSidebar } from "@/features/user/dashboard/shared/context/SidebarContext";
import { useCourseNavigation } from "@/features/user/dashboard/courses/context/CourseNavigationContext";

export type SubItem = {
  label: string;
  href: string;
  isCompleted?: boolean;
};

export type MenuItem = {
  label: string;
  href: string;
  icon: ReactNode;
  subItems?: SubItem[];
  dynamicSubItems?: boolean;
};

interface SidebarProps {
  menuItems: MenuItem[];
  className?: string;
}

export function Sidebar({ menuItems, className = "" }: SidebarProps) {
  const pathname = usePathname();
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const { navigation } = useCourseNavigation();

  const getSubItems = (item: MenuItem): SubItem[] => {
    if (item.dynamicSubItems && item.href === "/courses") {
      return navigation.subItems;
    }
    return item.subItems || [];
  };

  return (
    <aside
      className={` ${isCollapsed ? "w-20" : "w-56"} fixed top-0 left-0 z-40 flex h-screen flex-col bg-white shadow-lg transition-all duration-300 ease-in-out ${className} `}
    >
      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-5">
        <div
          className={`relative ${
            isCollapsed ? "h-8 w-10" : "h-10 w-20"
          } transition-all duration-300`}
        >
          <Image
            src="/images/logo/ARTERI.webp"
            alt="ARTERI"
            fill
            className="object-contain"
            priority
          />
        </div>

        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(true)}
            className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
          >
            <Menu size={20} />
          </button>
        )}
      </div>

      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="mx-auto mt-4 rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
        >
          <ChevronRight size={20} />
        </button>
      )}

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (pathname.startsWith(`${item.href}/`) &&
              !menuItems.some(
                (otherItem) =>
                  otherItem.href !== item.href &&
                  otherItem.href.length > item.href.length &&
                  pathname.startsWith(otherItem.href)
              ));
          const subItems = getSubItems(item);

          return (
            <div key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 ${isCollapsed ? "justify-center" : ""} ${
                  isActive
                    ? "bg-[#B95C2F] font-medium text-white"
                    : "text-neutral-700 hover:bg-neutral-100"
                } `}
                title={isCollapsed ? item.label : undefined}
              >
                <span className={`${isActive ? "text-white" : "text-neutral-500"} flex-shrink-0`}>
                  {item.icon}
                </span>
                {!isCollapsed && <span className="text-sm">{item.label}</span>}
              </Link>

              {!isCollapsed && isActive && subItems.length > 0 && (
                <div className="mt-1 ml-9 space-y-1 border-l-2 border-neutral-200 pl-3">
                  {subItems.map((sub, idx) => {
                    const isSubActive = pathname === sub.href;
                    return (
                      <Link
                        key={idx}
                        href={sub.href}
                        className={`flex items-center gap-2 py-1.5 text-sm ${
                          isSubActive
                            ? "font-medium text-[#B95C2F]"
                            : "text-neutral-500 hover:text-[#B95C2F]"
                        }`}
                      >
                        {sub.isCompleted && <span className="text-green-500">✓</span>}
                        <span className="truncate">{sub.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="mt-auto p-3">
        <button
          className={`flex w-full items-center gap-2 rounded-xl bg-[#EA7D17] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#D77211] ${isCollapsed ? "justify-center px-2" : "justify-center"} `}
          title={isCollapsed ? "Support" : undefined}
        >
          <HelpCircle size={18} />
          {!isCollapsed && <span>Support</span>}
        </button>
      </div>
    </aside>
  );
}
