"use client";

import { Row } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  dropDownItemClass,
} from "@/components/ui/dropdown-menu";
import { memberSchema } from "./columns";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import EditMembersDialog from "./editMembersDialog";
import { Badge } from "@/components/ui/badge";
import RemoveMemberDialog from "./removeMembersDialog";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();
  const [currentProjectId, setCurrentProjectId] = React.useState("");
  const member = memberSchema.parse(row.original);
  useEffect(() => {
    setCurrentProjectId(localStorage.getItem("projectId") || "");
  }, []);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <EditMembersDialog
            projectId={currentProjectId}
            userId={member._id}
            activateBtn={<div className={dropDownItemClass}>Update</div>}
          />
          <DropdownMenuItem>
            Message <Badge variant={"outline"}>Soon</Badge>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <RemoveMemberDialog
            userId={member._id}
            email={member.email}
            projectId={currentProjectId}
            activateBtn={
              <div className={`${dropDownItemClass} text-destructive`}>
                Remove
              </div>
            }
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
