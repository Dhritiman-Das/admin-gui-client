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
import { querySchema } from "./columns";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { RunQueryDialog } from "./[queryId]/runQueryDialog";
import EditQueryDialog from "./editQueryDialog";
import DuplicateQueryDialog from "./duplicateQueryDialog";
import DeleteQueryDialog from "./deleteQueryDialog";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();
  const [currentProjectId, setCurrentProjectId] = React.useState("");
  const query = querySchema.parse(row.original);
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
          <RunQueryDialog
            projectId={currentProjectId}
            queryId={query._id}
            activateBtn={<div className={dropDownItemClass}>Run</div>}
          />
          <Link href={`/home/${currentProjectId}/query/${query._id}/view`}>
            <DropdownMenuItem>View</DropdownMenuItem>
          </Link>
          <EditQueryDialog
            projectId={currentProjectId}
            queryId={query._id}
            activateBtn={<div className={dropDownItemClass}>Edit</div>}
          />
          <DuplicateQueryDialog
            projectId={currentProjectId}
            queryId={query._id}
            activateBtn={<div className={dropDownItemClass}>Duplicate</div>}
          />
          <DropdownMenuItem>Favorite</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DeleteQueryDialog
            projectId={currentProjectId}
            queryId={query._id}
            activateBtn={
              <div className={`${dropDownItemClass} text-destructive`}>
                Delete
              </div>
            }
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
