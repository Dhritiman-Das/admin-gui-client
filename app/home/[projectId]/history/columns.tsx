"use client";

import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { extractVariables } from "@/server/lib/helpers";
import { Badge } from "@/components/ui/badge";
import { DataTableRowActions } from "./data-table-row-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { useEffect, useState } from "react";

export const historySchema = z.object({
  _id: z.string(),
  user: z.object({
    _id: z.string(),
    name: z.string(),
    profilePic: z.string(),
  }),
  query: z.object({
    _id: z.string(),
    name: z.string(),
    dbName: z.string(),
    dbCollectionName: z.string(),
  }),
  success: z.boolean(),
  queryValues: z.record(z.any()),
  createdAt: z.string(),
});

export type History = z.infer<typeof historySchema>;

export const columns: ColumnDef<History>[] = [
  {
    accessorKey: "query",
    header: "Query",
    cell: ({ row }) => {
      const [currentProjectId, setCurrentProjectId] = useState("");
      useEffect(() => {
        setCurrentProjectId(localStorage.getItem("projectId") || "");
      }, []);
      const query = row.getValue("query") as History["query"];

      return (
        <div className="flex space-x-2">
          <span className="max-w-[400px] truncate font-medium">
            <Link href={`/home/${currentProjectId}/query/${query?._id ?? ""}`}>
              {query?.name ?? "No Name"}
            </Link>
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "dbName",
    header: "Database",
    cell: ({ row }) => {
      const query = row.getValue("query") as History["query"];
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {query?.dbName ?? "No Database"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "dbCollectionName",
    header: "Collection",
    cell: ({ row }) => {
      const query = row.getValue("query") as History["query"];
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {query?.dbCollectionName ?? "No Collection"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "queryValues",
    header: "Query values",
    cell: ({ row }) => {
      const queryValues = row.getValue("queryValues") ?? {};
      return (
        <div className="flex space-x-2">
          <span className="max-w-[200px] truncate font-medium">
            {JSON.stringify(queryValues)}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "success",
    header: "Status",
    cell: ({ row }) => {
      const success = row.getValue("success") as History["success"];
      return (
        <div className="flex space-x-2">
          {success ? (
            <Badge className="bg-emerald-500">Success</Badge>
          ) : (
            <Badge className="bg-red-500">Failed</Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => {
      const user = row.getValue("user") as History["user"];
      return (
        <div className="flex gap-2 items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/users/${user?._id ?? ""}`}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user?.profilePic ?? ""}
                      alt={user?.name ?? "No Name"}
                    />
                    <AvatarFallback>DD</AvatarFallback>
                  </Avatar>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{user?.name ?? "No Name"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
