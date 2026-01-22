"use client";

import { ChevronDown, User, Settings, LogOut } from "lucide-react";
import { useState } from "react";
import { useSidebar } from "@/features/user/dashboard/shared/context/SidebarContext";
import { NotificationDropdown } from "./NotificationDropdown";
import Image from "next/image";

interface TopbarProps {
  user?: {
    name?: string;
    role?: string;
    image?: string;
  };
}

export function Topbar({ user }: TopbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const { isCollapsed } = useSidebar();

  return (
    <header
      className={`fixed top-0 right-0 z-30 flex h-16 items-center justify-end border-b border-white/5 bg-white/5 px-6 backdrop-blur transition-all duration-300 ${isCollapsed ? "left-20" : "left-56"} `}
    >
      <div className="flex items-center gap-4">
        <NotificationDropdown />

        <div
          className="relative flex cursor-pointer items-center gap-3"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div className="hidden text-right md:block">
            <p className="text-sm leading-tight font-semibold text-white">
              {user?.name || "User Name"}
            </p>
            <p className="text-xs text-white/70">{user?.role || "Role"}</p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/30 bg-white/20 text-white">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name || "User"}
                width={36}
                height={36}
                className="h-full w-full object-cover"
              />
            ) : (
              <User size={18} />
            )}
          </div>

          <ChevronDown size={16} className="text-white/70" />

          {showDropdown && (
            <div className="absolute top-full right-0 z-50 mt-2 w-48 rounded-xl border border-neutral-100 bg-white py-2 shadow-xl">
              <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-50">
                <Settings size={16} className="text-neutral-400" />
                Settings
              </button>
              <hr className="my-1 border-neutral-100" />
              <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50">
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
