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
import { mutationSchema } from "./columns";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import DeleteMutationDialog from "./deleteMutationDialog";
import RunMutationDialog from "./[mutateId]/runMutationDialog";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();
  const [currentProjectId, setCurrentProjectId] = React.useState("");
  const mutation = mutationSchema.parse(row.original);
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
          <RunMutationDialog
            projectId={currentProjectId}
            mutationId={mutation._id}
            activateBtn={<div className={dropDownItemClass}>Run</div>}
          />
          <Link href={`/home/${currentProjectId}/mutate/${mutation._id}/view`}>
            <DropdownMenuItem>View</DropdownMenuItem>
          </Link>
          <DropdownMenuItem>Favorite</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DeleteMutationDialog
            projectId={currentProjectId}
            mutationId={mutation._id}
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
