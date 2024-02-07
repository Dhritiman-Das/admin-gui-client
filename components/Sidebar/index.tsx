"use client";
import {
  LogOut,
  NotebookPen,
  ScanText,
  History,
  User,
  Building2,
  Users,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import TeamSwitcher from "./teamSwitcher";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

const navigation = {
  top: [
    { name: "Query", href: "query", icon: ScanText, current: true },
    { name: "Mutate", href: "mutate", icon: NotebookPen, current: false },
    { name: "History", href: "history", icon: History, current: false },
    { name: "Members", href: "members", icon: Users, current: false },
  ],
  bottom: [
    { name: "Project", href: "project", icon: Building2, current: true },
    { name: "Profile", href: "profile", icon: User, current: true },
    { name: "Log out", href: "/api/auth/signout", icon: LogOut, current: true },
  ],
};

export default function Sidebar() {
  const pathName = usePathname();

  return (
    <aside
      id="sidebar"
      className="fixed left-0 top-0 z-40 h-screen w-64 transition-transform"
      aria-label="Sidebar"
    >
      <div className="flex h-full flex-col overflow-y-auto border-r border-border bg-background px-3 py-4">
        <TeamSwitcher />
        <div className="my-1"></div>
        {navigation.top.map((item, index) => (
          <Link
            key={item.name + index}
            href={item.href}
            className={`flex items-center rounded-lg px-3 py-2 ${
              item.href === pathName.split("/")[2] ? "bg-secondary" : ""
            } hover:bg-secondary text-primary`}
          >
            <item.icon className="h-6 w-6" />
            <span className="ml-3 flex-1 whitespace-nowrap">{item.name}</span>
          </Link>
        ))}
        <div className="mt-auto flex flex-col">
          {navigation.bottom.map((item, index) => (
            <Link
              key={item.name + index}
              href={item.href}
              className={`flex items-center rounded-lg px-3 py-2 ${
                item.href === pathName.split("/")[2] ? "bg-secondary" : ""
              } hover:bg-secondary text-primary`}
            >
              <item.icon className="h-6 w-6" />
              <span className="ml-3 flex-1 whitespace-nowrap">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
