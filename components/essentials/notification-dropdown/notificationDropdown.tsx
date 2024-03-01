"use client";

import * as React from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import AccountNotifications from "./accountNotifications";
import AppUpdates from "./appUpdates";

export function NotificationDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Link
          href={"#"}
          className="flex items-center rounded-lg px-3 py-2 hover:bg-secondary"
        >
          <Bell className="h-6 w-6" />{" "}
          <span className="ml-3 flex-1 whitespace-nowrap">Notification</span>
        </Link>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-full"
        side="right"
        align="start"
        sideOffset={12}
      >
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="app-updates">App updates</TabsTrigger>
          </TabsList>
          <DropdownMenuSeparator />
          <TabsContent value="account">
            <AccountNotifications />
          </TabsContent>
          <TabsContent
            value="app-updates"
            className="max-h-[400px] overscroll-y-auto"
          >
            <AppUpdates />
          </TabsContent>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
