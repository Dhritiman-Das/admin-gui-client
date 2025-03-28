"use client";

import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
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
import { capitalizeFirstLetter } from "@/lib/helpers";

export const historySchema = z.object({
  _id: z.string(),
  user: z.object({
    _id: z.string(),
    name: z.string(),
    image: z.string(),
  }),
  type: z.enum(["query", "mutation"]),
  query: z
    .object({
      _id: z.string(),
      name: z.string(),
      dbName: z.string(),
      dbCollectionName: z.string(),
    })
    .optional(),
  mutation: z
    .object({
      _id: z.string(),
      name: z.string(),
      dbName: z.string(),
      dbCollectionName: z.string(),
    })
    .optional(),
  success: z.boolean(),
  queryValues: z.record(z.any()),
  mutationObjValues: z.record(z.any()).optional(),
  createdAt: z.string(),
});

export type History = z.infer<typeof historySchema>;

const QueryCell = ({ row }: { row: any }) => {
  const [currentProjectId, setCurrentProjectId] = useState("");
  useEffect(() => {
    setCurrentProjectId(localStorage.getItem("projectId") || "");
  }, []);
  const rowOriginal = row.original as History;
  const type = rowOriginal.type;
  const query = rowOriginal.query;
  const mutation = rowOriginal.mutation;
  const action = type === "mutation" ? mutation : query;

  return (
    <div className="flex space-x-2">
      <span className="max-w-[400px] truncate font-medium">
        <Link href={`/home/${currentProjectId}/query/${query?._id ?? ""}`}>
          {action?.name ?? "No Name"}
        </Link>
      </span>
    </div>
  );
};

export const Columns: ColumnDef<History>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <QueryCell row={row} />,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const rowOriginal = row.original as History;
      return (
        <div className="flex space-x-2">
          <span className="max-w-[200px] truncate font-medium">
            {capitalizeFirstLetter(rowOriginal.type)}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "dbName",
    header: "Database",
    cell: ({ row }) => {
      const rowOriginal = row.original as History;
      const type = rowOriginal.type;
      const query = rowOriginal.query;
      const mutation = rowOriginal.mutation;
      const action = type === "mutation" ? mutation : query;

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {action?.dbName ?? "No Database"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "dbCollectionName",
    header: "Collection",
    cell: ({ row }) => {
      const rowOriginal = row.original as History;
      const type = rowOriginal.type;
      const query = rowOriginal.query;
      const mutation = rowOriginal.mutation;
      const action = type === "mutation" ? mutation : query;
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {action?.dbCollectionName ?? "No Collection"}
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
                      src={user?.image ?? ""}
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
