"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HelpCircle, ChevronLeft, Menu, X, Phone, MessageCircle } from "lucide-react";
import { ReactNode, useState } from "react";
import Image from "next/image";
import { useSidebar } from "@/features/user/dashboard/shared/context/SidebarContext";
import { useCourseNavigation } from "@/features/user/courses/context/CourseNavigationContext";

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
  const [showSupportModal, setShowSupportModal] = useState(false);

  const getSubItems = (item: MenuItem): SubItem[] => {
    // Support dynamic sub-items for both user and admin courses
    if (
      item.dynamicSubItems &&
      (item.href === "/courses" || item.href === "/dashboard-admin/courses")
    ) {
      return navigation.subItems;
    }
    return item.subItems || [];
  };

  return (
    <>
      <aside
        className={` ${isCollapsed ? "w-20" : "w-56"} fixed top-0 left-0 z-40 flex h-screen flex-col bg-white shadow-lg transition-all duration-300 ease-in-out ${className} `}
      >
        <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-5">
          <div
            className={`relative overflow-hidden transition-all duration-300 ease-in-out ${
              isCollapsed ? "h-0 w-0 opacity-0" : "h-10 w-20 opacity-100"
            }`}
          >
            <Image
              src="/images/logo/ARTERI.webp"
              alt="ARTERI"
              fill
              className="object-contain transition-transform duration-300"
              priority
            />
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`rounded-lg p-2 text-neutral-500 transition-all duration-300 hover:bg-neutral-100 hover:text-neutral-700 ${
              isCollapsed ? "mx-auto" : ""
            }`}
          >
            {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto py-4">
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
              <div key={item.href} className="px-3">
                <Link
                  href={item.href}
                  className={`group flex items-center rounded-xl px-3 py-2.5 transition-all duration-300 hover:translate-x-1 ${
                    isCollapsed ? "justify-center gap-0" : "gap-3"
                  } ${
                    isActive
                      ? "bg-primary shadow-primary/30 font-medium text-white shadow-sm"
                      : "hover:text-primary text-neutral-600 hover:bg-neutral-50"
                  } `}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span
                    className={`${isActive ? "text-white" : "group-hover:text-primary text-neutral-400"} shrink-0 transition-colors`}
                  >
                    {item.icon}
                  </span>
                  <span
                    className={`text-sm whitespace-nowrap transition-all duration-300 ${
                      isCollapsed ? "w-0 overflow-hidden opacity-0" : "w-auto opacity-100"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>

                <div
                  className={`relative overflow-hidden transition-all duration-300 ease-in-out ${
                    !isCollapsed && isActive && subItems.length > 0
                      ? "mt-2 max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {/* Tree Vertical Line */}
                  <div className="absolute top-0 bottom-4 left-9 w-px bg-neutral-200" />

                  <div className="space-y-1">
                    {subItems.map((sub, idx) => {
                      const isSubActive = pathname === sub.href;
                      return (
                        <div key={idx} className="relative flex items-center">
                          {/* Branch Line (Curve) */}
                          <div className="absolute top-1/2 left-9 h-px w-3 bg-neutral-200" />
                          {/* Connector Dot for Active State */}
                          {isSubActive && (
                            <div className="bg-primary absolute top-1/2 left-9 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white" />
                          )}

                          <Link
                            href={sub.href}
                            className={`relative ml-14 flex flex-1 items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-300 hover:translate-x-1 ${
                              isSubActive
                                ? "bg-primary/5 text-primary font-semibold"
                                : "hover:text-primary text-neutral-500 hover:bg-neutral-50"
                            }`}
                            style={{
                              transitionDelay: `${idx * 50}ms`,
                            }}
                          >
                            {sub.isCompleted && <span className="text-green-500">✓</span>}
                            <span className="truncate">{sub.label}</span>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-neutral-100 p-3">
          <button
            onClick={() => setShowSupportModal(true)}
            className={`group from-primary to-primary/80 shadow-primary/20 hover:shadow-primary/30 flex w-full items-center rounded-xl bg-linear-to-r px-4 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
              isCollapsed ? "justify-center gap-0 px-2" : "justify-center gap-2"
            } `}
            title={isCollapsed ? "Support" : undefined}
          >
            <HelpCircle
              size={18}
              className="shrink-0 transition-transform duration-300 group-hover:rotate-12"
            />
            <span
              className={`whitespace-nowrap transition-all duration-300 ${
                isCollapsed ? "w-0 overflow-hidden opacity-0" : "w-auto opacity-100"
              }`}
            >
              Support
            </span>
          </button>
        </div>
      </aside>

      {showSupportModal && (
        <div className="fixed inset-0 z-20 flex items-center justify-center p-4">
          <div
            className="animate-fade-in absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSupportModal(false)}
          />
          <div className="animate-scale-in relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setShowSupportModal(false)}
              className="absolute top-4 right-4 p-1 text-neutral-400 transition-colors hover:text-neutral-600"
            >
              <X size={20} />
            </button>

            <div className="mb-6 text-center">
              <div className="bg-secondary/10 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full">
                <MessageCircle size={28} className="text-secondary" />
              </div>
              <h2 className="text-xl font-bold text-neutral-800">Butuh Bantuan?</h2>
              <p className="mt-1 text-sm text-neutral-500">
                Hubungi kami untuk mendapatkan bantuan
              </p>
            </div>

            <a
              href="https://wa.me/6285226055932"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 transition-colors hover:bg-green-100"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500">
                <Phone size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-neutral-800">Zakwan</p>
                <p className="text-sm text-neutral-600">+62 852-2605-5932</p>
              </div>
            </a>

            <p className="mt-4 text-center text-xs text-neutral-400">
              Klik untuk menghubungi via WhatsApp
            </p>
          </div>
        </div>
      )}
    </>
  );
}
