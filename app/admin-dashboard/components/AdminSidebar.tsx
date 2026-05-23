"use client";

import Link from "next/link";
import { useState } from "react";

import { LayoutDashboard, Users, Settings, Menu, Upload } from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin-dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Upload Movie",
    href: "/admin-dashboard/upload",
    icon: Upload,
  },

  {
    title: "Settings",
    href: "/admin-dashboard/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside
      className={`border-r border-zinc-800 bg-zinc-950 transition-all duration-300 ${
        expanded ? "w-64" : "w-20"
      }`}
    >
      <div className="flex h-20 items-center justify-between border-b border-zinc-800 px-4">
        {expanded && (
          <h1 className="text-xl font-bold tracking-wide text-white">Admin</h1>
        )}

        <button
          onClick={() => setExpanded(!expanded)}
          className="rounded-lg bg-zinc-900 p-2 hover:bg-zinc-800"
        >
          <Menu size={22} />
        </button>
      </div>

      <nav className="mt-6 flex flex-col gap-2 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className="group flex items-center gap-4 rounded-xl px-3 py-3 transition hover:bg-zinc-900"
            >
              <Icon
                size={22}
                className="text-zinc-300 group-hover:text-white"
              />

              {expanded && (
                <span className="text-sm font-medium text-zinc-200">
                  {item.title}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
