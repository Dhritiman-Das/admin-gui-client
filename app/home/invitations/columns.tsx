"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
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
import { Button } from "@/components/ui/button";
import { useUserToken } from "@/app/hooks/useUserToken";
import { handleProjectInvite } from "@/routes/user-routes";
import { useMutation } from "@/app/hooks/customMutation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const ActionCell = ({ row }: { row: Row<ProjectInvite> }) => {
  const queryClient = useQueryClient();
  const jwtToken = useUserToken();
  const projectId = row.original.project._id;
  const handleInviteMutation = useMutation({
    mutationFn: handleProjectInvite,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["user/projects/invited", jwtToken as string],
      });
      queryClient.invalidateQueries({
        queryKey: ["user/me", jwtToken as string],
      });
      toast.success(
        variables.accept ? "Invitation accepted" : "Invitation rejected"
      );
    },
  });
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={async () => {
          handleInviteMutation.mutate({
            token: jwtToken,
            accept: true,
            projectId,
          });
        }}
      >
        Accept
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={async () => {
          handleInviteMutation.mutate({
            token: jwtToken,
            accept: false,
            projectId,
          });
        }}
      >
        Reject
      </Button>
    </div>
  );
};

export const projectSchema = z.object({
  _id: z.string(),
  mode: z.enum(["team", "personal"]),
  name: z.string(),
});

export const projectInviteSchema = z.object({
  project: projectSchema,
  role: z.string(),
  isAdvancedSettings: z.boolean(),
  advancedSettings: z.object({
    "read-only": z.string(),
    "read-write": z.string(),
    admin: z.string(),
  }),
});

export type ProjectInvite = z.infer<typeof projectInviteSchema>;

export const Columns: ColumnDef<ProjectInvite>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project" />
    ),
    cell: ({ row }) => {
      const name = row.original.project.name;
      return <div className="">{name}</div>;
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const role = row.original.role;
      return <Badge variant="outline">{capitalizeFirstChar(role)}</Badge>;
    },
  },
  {
    accessorKey: "permissions",
    header: "Permissions",
    cell: ({ row }) => {
      const permissions = row.original.advancedSettings;
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
    accessorKey: "actionBtns",
    header: "Actions",
    cell: ({ row }) => <ActionCell row={row} />,
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
];
