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
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { historySchema } from "./columns";
import { RunQueryDialog } from "../query/[queryId]/runQueryDialog";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}
export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();
  const [currentProjectId, setCurrentProjectId] = React.useState("");
  const task = historySchema.parse(row.original);
  const queryId = task.query._id;
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
          <Link href={`/home/${currentProjectId}/history/${task._id}`}>
            <DropdownMenuItem>View</DropdownMenuItem>
          </Link>
          <RunQueryDialog
            projectId={currentProjectId}
            queryId={queryId}
            activateBtn={<div className={dropDownItemClass}>Run</div>}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
