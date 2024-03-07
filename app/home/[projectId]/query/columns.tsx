"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../../../../components/ui/data-table/data-table-column-header";
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
import { ProfileHoverCard } from "@/components/essentials/profileHoverCard";
import { useEffect, useState } from "react";

export const profileSchema = z.object({
  name: z.string(),
  image: z.string(),
  email: z.string(),
  createdAt: z.string(),
  timeZone: z.string(),
  verified: z.boolean(),
  title: z.string(),
  _id: z.string(),
});

export const querySchema = z.object({
  _id: z.string(),
  name: z.string(),
  dbName: z.string(),
  dbCollectionName: z.string(),
  queryString: z.string(),
  author: z.object({
    name: z.string(),
    image: z.string(),
    email: z.string(),
    createdAt: z.string(),
    timeZone: z.string(),
    verified: z.boolean(),
    title: z.string(),
    _id: z.string(),
  }),
});

export type Profile = z.infer<typeof profileSchema>;

export type Query = z.infer<typeof querySchema>;

export const columns: ColumnDef<Query>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const queryId = row.original._id;
      const name = (row.getValue("name") as Query["name"]) ?? "No Name";
      const [currentProjectId, setCurrentProjectId] = useState("");
      useEffect(() => {
        setCurrentProjectId(localStorage.getItem("projectId") || "");
      }, []);
      // const queryId
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            <Link href={`/home/${currentProjectId}/query/${queryId}/view`}>
              {name}
            </Link>
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "dbName",
    header: "Database",
  },
  {
    accessorKey: "dbCollectionName",
    header: "Collection",
  },
  {
    accessorKey: "queryString",
    header: "Query variables",
    cell: ({ row }) => {
      const queryString = row.getValue("queryString") ?? "";
      const variables = extractVariables(queryString);
      const displayVariables = variables.slice(0, 2);
      const remainingVariables =
        variables.length > 2 ? variables.length - 2 : 0;

      return (
        <div className="flex space-x-2">
          {displayVariables.map((variable, index) => (
            <Badge variant={"outline"} key={variable.variable + index}>
              {variable.variable}
            </Badge>
          ))}
          {remainingVariables > 0 && (
            <Badge className="rounded-full" variant={"outline"}>
              +{remainingVariables}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "author",
    header: "Author",
    cell: ({ row }) => {
      const author = row.getValue("author") as Query["author"];
      return <ProfileHoverCard profile={author} />;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
