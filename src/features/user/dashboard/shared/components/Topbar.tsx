"use client";

import { Bell, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { useState } from "react";
import { useSidebar } from "@/features/user/dashboard/shared/context/SidebarContext";
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
      className={`
        h-16 bg-white/5 backdrop-blur border-b border-white/5 
        flex items-center justify-end px-6 
        fixed top-0 right-0 z-30
        transition-all duration-300
        ${isCollapsed ? "left-20" : "left-56"}
      `}
    >
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors">
          <Bell size={22} />
        </button>

        <div
          className="relative flex items-center gap-3 cursor-pointer"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-white leading-tight">
              {user?.name || "User Name"}
            </p>
            <p className="text-xs text-white/70">{user?.role || "Role"}</p>
          </div>

          <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center border border-white/30 text-white overflow-hidden">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name || "User"}
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={18} />
            )}
          </div>

          <ChevronDown size={16} className="text-white/70" />

          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-neutral-100 py-2 z-50">
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
                <Settings size={16} className="text-neutral-400" />
                Settings
              </button>
              <hr className="my-1 border-neutral-100" />
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
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
