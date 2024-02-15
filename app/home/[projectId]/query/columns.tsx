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

export const querySchema = z.object({
  _id: z.string(),
  name: z.string(),
  dbName: z.string(),
  dbCollectionName: z.string(),
  queryString: z.string(),
  author: z.object({
    name: z.string(),
    profilePic: z.string(),
    _id: z.string(),
  }),
});

export type Query = z.infer<typeof querySchema>;

export const columns: ColumnDef<Query>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("name")}
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
      const variables = extractVariables(row.getValue("queryString"));
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
      return (
        <div className="flex gap-2 items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/users/${author._id}`}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={author.profilePic} alt={author.name} />
                    <AvatarFallback>DD</AvatarFallback>
                  </Avatar>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{author.name}</p>
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
