"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../../../../components/ui/data-table/data-table-column-header";
import { z } from "zod";
import { capitalizeFirstChar } from "@/server/lib/helpers";
import { Badge } from "@/components/ui/badge";
import { DataTableRowActions } from "./data-table-row-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const advancedSettingsSchema = z.object({
  query: z.string(),
  mutate: z.string(),
  members: z.string(),
  projects: z.string(),
});

const projectSchema = z.object({
  project: z.string(),
  role: z.string(),
  isAdvancedSettings: z.boolean(),
  advancedSettings: advancedSettingsSchema,
});

export const memberSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string(),
  profilePic: z.string().optional(),
  projects: z.array(projectSchema),
});

export type Member = z.infer<typeof memberSchema>;

export const columns: ColumnDef<Member>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const name = (row.getValue("name") as Member["name"]) ?? "No Name";
      const profilePic = row.original.profilePic || "";
      const email = row.original.email;
      return (
        <div className="flex items-center">
          <div className="h-11 w-11 flex-shrink-0">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profilePic ?? ""} alt={name ?? "No Name"} />
              <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
          <div className="ml-4">
            <div className="font-medium">{name}</div>
            <div className="mt-1 text-muted-foreground">{email}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const role = row.original.projects[0].role;
      return <Badge variant="outline">{capitalizeFirstChar(role)}</Badge>;
    },
  },
  {
    accessorKey: "permissions",
    header: "Permissions",
    cell: ({ row }) => {
      const permissions = row.original.projects[0].advancedSettings;
      const permissionsKeys = Object.keys(permissions);
      const permissionsValues = Object.values(permissions);
      return (
        <div className="flex space-x-2">
          {permissionsKeys.map((key, index) => (
            <TooltipProvider key={key}>
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    variant="default"
                    className={`${
                      permissionsValues[index] === "read-only"
                        ? "bg-gray-600 hover:bg-gray-500"
                        : permissionsValues[index] === "read-write"
                        ? "bg-blue-600 hover:bg-blue-500"
                        : "bg-green-600 hover:bg-green-500"
                    } text-gray-100`}
                  >
                    {capitalizeFirstChar(key)}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="rounded-lg ">
                    <div className="text-sm font-medium ">
                      {capitalizeFirstChar(key)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {capitalizeFirstChar(permissionsValues[index])}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
