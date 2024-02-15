"use client";
import {
  LogOut,
  NotebookPen,
  ScanText,
  History,
  User,
  Building2,
  Users,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";
import TeamSwitcher from "./teamSwitcher";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

type SingleNavigation = {
  name: string;
  href: string;
  icon: LucideIcon;
  current: boolean;
};

type Navigation = {
  top: SingleNavigation[];
  bottom: SingleNavigation[];
};

export default function Sidebar() {
  const pathName = usePathname();
  const [navigation, setNavigation] = React.useState<Navigation>({
    top: [],
    bottom: [],
  });
  useEffect(() => {
    setNavigation({
      top: [
        {
          name: "Query",
          href: `/home/${localStorage.getItem("projectId")}/query`,
          icon: ScanText,
          current: pathName.includes("query"),
        },
        {
          name: "Mutate",
          href: `/home/${localStorage.getItem("projectId")}/mutate`,
          icon: NotebookPen,
          current: pathName.includes("mutate"),
        },
        {
          name: "History",
          href: `/home/${localStorage.getItem("projectId")}/history`,
          icon: History,
          current: pathName.includes("history"),
        },
        {
          name: "Members",
          href: `/home/${localStorage.getItem("projectId")}/members`,
          icon: Users,
          current: pathName.includes("members"),
        },
      ],
      bottom: [
        {
          name: "Project",
          href: `/home/${localStorage.getItem("projectId")}/project`,
          icon: Building2,
          current: pathName.includes("project"),
        },
        {
          name: "Profile",
          href: "/home/profile",
          icon: User,
          current: pathName.includes("profile"),
        },
        {
          name: "Log out",
          href: "/api/auth/signout",
          icon: LogOut,
          current: false,
        },
      ],
    });
  }, [pathName]);
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
              item.current ? "bg-secondary" : ""
            } ${
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
                item.current ? "bg-secondary" : ""
              } ${
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
