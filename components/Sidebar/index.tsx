"use client";
import {
  LogOut,
  NotebookPen,
  ScanText,
  History,
  User,
  Building2,
  Users,
  Bell,
  LucideIcon,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";
import TeamSwitcher from "./teamSwitcher";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { PlanDialog } from "./planDialog";
import { NotificationDropdown } from "../essentials/notification-dropdown/notificationDropdown";
import AppLogo from "../essentials/app-logo";
import { ProfileDropdown } from "./profileDropdown";
import { Badge } from "../ui/badge";

type SingleNavigation = {
  name: string;
  href?: string;
  icon: LucideIcon;
  disabled?: boolean;
  current: boolean;
  openComponent?: React.ReactElement;
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
          disabled: true,
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
        // {
        //   name: "Notifications",
        //   icon: Bell,
        //   current: false,
        //   openComponent: <NotificationDropdown />,
        // },
        {
          name: "Project",
          href: `/home/${localStorage.getItem("projectId")}/project`,
          icon: Building2,
          current: pathName.includes("project"),
        },
      ],
      bottom: [],
    });
  }, [pathName]);
  return (
    <aside
      id="sidebar"
      className="fixed left-0 top-0 z-40 h-screen w-64 transition-transform"
      aria-label="Sidebar"
    >
      <div className="flex h-full flex-col overflow-y-auto border-r border-border bg-background px-3 py-4">
        <div className="mb-2">
          <AppLogo />
        </div>
        <TeamSwitcher />
        <div className="my-1"></div>
        {navigation.top.map((item, index) =>
          item?.href ? (
            <Link
              key={"top_" + item.name + index}
              href={item.href as string}
              className={`flex items-center relative rounded-lg px-3 py-2 ${
                item.current ? "bg-secondary" : ""
              } ${
                item.href === pathName.split("/")[2] ? "bg-secondary" : ""
              } hover:bg-secondary`}
            >
              <item.icon className="h-6 w-6" />
              <span className="ml-3 flex-1 whitespace-nowrap">{item.name}</span>
              {item?.disabled ? (
                <Badge className="absolute right-0" variant={"outline"}>
                  <Sparkles size={14} /> Soon
                </Badge>
              ) : null}
            </Link>
          ) : item?.openComponent ? (
            <React.Fragment key={"top_" + item.name + index}>
              {item.openComponent}
            </React.Fragment>
          ) : null
        )}
        <div className="mt-auto flex flex-col gap-1">
          <PlanDialog />
          {navigation.bottom.map((item, index) => (
            <Link
              key={"bottom_" + item.name + index}
              href={item.href as string}
              className={`flex items-center rounded-lg px-3 py-2 ${
                item.current ? "bg-secondary" : ""
              } ${
                item.href === pathName.split("/")[2] ? "bg-secondary" : ""
              } hover:bg-secondary`}
            >
              <item.icon className="h-6 w-6" />
              <span className="ml-3 flex-1 whitespace-nowrap">{item.name}</span>
            </Link>
          ))}
          <ProfileDropdown />
        </div>
      </div>
    </aside>
  );
}
