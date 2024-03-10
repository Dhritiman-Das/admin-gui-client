"use client";
import { useUserToken } from "@/app/hooks/useUserToken";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { capitalizeFirstChar } from "@/server/lib/helpers";
import { useQueryClient } from "@tanstack/react-query";
import { addMembers } from "@/routes/project-routes";
import { toast } from "sonner";
import { useMutation } from "@/app/hooks/customMutation";

export const AddMembersDialogQuery = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "developer", "support"]),
  isAdvancedRolesOpen: z.boolean(),
  advancedRoles: z.object({
    query: z.enum(["read-only", "read-write", "admin"]),
    mutate: z.enum(["read-only", "read-write", "admin"]),
    members: z.enum(["read-only", "read-write", "admin"]),
    projects: z.enum(["read-only", "read-write", "admin"]),
  }),
});

export type Member = z.infer<typeof AddMembersDialogQuery>;

export type RolesType = {
  query: Member["advancedRoles"]["query"];
  mutate: Member["advancedRoles"]["mutate"];
  members: Member["advancedRoles"]["members"];
  projects: Member["advancedRoles"]["projects"];
};

export const ADMIN_ROLES: RolesType = {
  query: "admin",
  mutate: "admin",
  members: "admin",
  projects: "admin",
};
export const DEVELOPER_ROLES: RolesType = {
  query: "read-write",
  mutate: "read-write",
  members: "read-write",
  projects: "read-write",
};
export const SUPPORT_ROLES: RolesType = {
  query: "read-only",
  mutate: "read-only",
  members: "read-only",
  projects: "read-only",
};

export const generateName = (key: string) => {
  return `advancedRoles.${key}` as
    | "advancedRoles.query"
    | "advancedRoles.mutate"
    | "advancedRoles.members"
    | "advancedRoles.projects";
};

export default function AddMembersDialog({ projectId }: { projectId: string }) {
  const queryClient = useQueryClient();
  const jwtToken = useUserToken();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const form = useForm<z.infer<typeof AddMembersDialogQuery>>({
    resolver: zodResolver(AddMembersDialogQuery),
    defaultValues: {
      email: "",
      role: "support",
      isAdvancedRolesOpen: false,
      advancedRoles: SUPPORT_ROLES,
    },
  });
  const addMembersMutation = useMutation({
    mutationFn: addMembers,
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        queryKey: [`${projectId}/members`],
      });
      queryClient.invalidateQueries({
        queryKey: [`${projectId}/members/invited`],
      });
      setDialogOpen(false);
      console.log({ data });

      toast.success(data.message || "Member added successfully");
    },
  });
  const role = form.watch("role");

  // Update advancedRoles when role changes
  useEffect(() => {
    switch (role) {
      case "admin":
        form.setValue("advancedRoles", ADMIN_ROLES);
        break;
      case "developer":
        form.setValue("advancedRoles", DEVELOPER_ROLES);
        break;
      case "support":
        form.setValue("advancedRoles", SUPPORT_ROLES);
        break;
      default:
        break;
    }
  }, [role, form]);
  const onSubmit = async (data: Member) => {
    console.log({ data });
    addMembersMutation.mutate({
      projectId,
      addMembersDto: data,
      token: jwtToken as string,
    });
  };
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>Add member</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add member</DialogTitle>
          <DialogDescription>
            Add a new member. You can assign roles and permissions to the
            member.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john@doe.com"
                      {...field}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User role</FormLabel>

                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={"admin"}>Admin</SelectItem>
                      <SelectItem value={"developer"}>Developer</SelectItem>
                      <SelectItem value={"support"}>Support</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isAdvancedRolesOpen"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="advanced-settings"
                      />
                      <Label htmlFor="advanced-settings">
                        Advanced settings
                      </Label>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            {form.watch("isAdvancedRolesOpen") && (
              <>
                {Object.entries(form.watch("advancedRoles")).map(
                  ([key, value]) => (
                    <FormField
                      control={form.control}
                      name={generateName(key)}
                      key={"advancedSettings_" + key}
                      render={({ field }) => (
                        <>
                          <FormItem className="flex items-center">
                            <FormLabel className="w-[150px]">
                              {capitalizeFirstChar(key)}
                            </FormLabel>
                            <FormControl>
                              <ToggleGroup
                                type="single"
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <ToggleGroupItem
                                  value="read-only"
                                  aria-label="Toggle bold"
                                >
                                  Read only
                                </ToggleGroupItem>
                                <ToggleGroupItem
                                  value="read-write"
                                  aria-label="Toggle italic"
                                >
                                  Read write
                                </ToggleGroupItem>
                                <ToggleGroupItem
                                  value="admin"
                                  aria-label="Toggle strikethrough"
                                >
                                  Admin
                                </ToggleGroupItem>
                              </ToggleGroup>
                            </FormControl>
                          </FormItem>
                        </>
                      )}
                    />
                  )
                )}
              </>
            )}
            <DialogFooter>
              <Button type="submit" loading={addMembersMutation.isPending}>
                Add member
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
