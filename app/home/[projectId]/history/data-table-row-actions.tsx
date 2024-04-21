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
import { History, historySchema } from "./columns";
import { RunQueryDialog } from "../query/[queryId]/runQueryDialog";
import RunMutationDialog from "../mutate/[mutateId]/runMutationDialog";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}
export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();
  const [currentProjectId, setCurrentProjectId] = React.useState("");
  const history = row.original as History;
  const id = history._id;
  const queryId = history.query?._id || "";
  const mutationId = history.mutation?._id || "";
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
          <Link href={`/home/${currentProjectId}/history/${id}`}>
            <DropdownMenuItem>View</DropdownMenuItem>
          </Link>
          {history.type === "query" ? (
            <RunQueryDialog
              projectId={currentProjectId}
              queryId={queryId}
              activateBtn={<div className={dropDownItemClass}>Run</div>}
            />
          ) : (
            <RunMutationDialog
              projectId={currentProjectId}
              mutationId={mutationId}
              activateBtn={<div className={dropDownItemClass}>Run</div>}
            />
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
