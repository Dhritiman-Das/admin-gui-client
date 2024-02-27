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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { addMembers, getMembers, updateMember } from "@/routes/project-routes";
import { toast } from "sonner";
import {
  ADMIN_ROLES,
  AddMembersDialogQuery,
  DEVELOPER_ROLES,
  Member,
  SUPPORT_ROLES,
  generateName,
} from "./addMembersDialog";
import { AxiosError } from "axios";
import { useMutation } from "@/app/hooks/customMutation";

export const EditMembersDialogQuery = AddMembersDialogQuery;

interface ErrorResponse {
  message: string;
}

export default function EditMembersDialog({
  projectId,
  userId,
  activateBtn,
}: {
  projectId: string;
  userId: string;
  activateBtn: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const jwtToken = useUserToken();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [userData, setUserData] = React.useState<Member>();

  const form = useForm<z.infer<typeof EditMembersDialogQuery>>({
    resolver: zodResolver(EditMembersDialogQuery),
    defaultValues: {
      email: "",
      role: "support",
      isAdvancedRolesOpen: false,
      advancedRoles: SUPPORT_ROLES,
    },
  });
  const {
    isPending,
    error,
    isSuccess,
    data: getMembersData,
  } = useQuery({
    queryKey: [`${projectId}/members`],
    queryFn: () => getMembers({ projectId, token: jwtToken as string }),
    enabled: !!jwtToken && !!projectId,
  });
  useEffect(() => {
    if (getMembersData?.data) {
      const data = getMembersData?.data as any[];
      const user = data.find((user) => user._id === userId);
      const project = user?.projects[0];
      const email = user?.email;
      const role = project?.role;
      const isAdvancedRolesOpen = project?.isAdvancedSettings;
      const advancedRoles = project?.advancedSettings;
      form.setValue("email", email || "");
      form.setValue("role", role || "support");
      form.setValue("isAdvancedRolesOpen", isAdvancedRolesOpen || false);
      form.setValue("advancedRoles", advancedRoles || SUPPORT_ROLES);
    }
  }, [isSuccess]);

  const updateMembersMutation = useMutation({
    mutationFn: updateMember,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`${projectId}/members`],
      });
      setDialogOpen(false);
      toast.success("Member updated successfully");
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
    updateMembersMutation.mutate({
      userId,
      user: data,
      projectId,
      token: jwtToken as string,
    });
  };
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{activateBtn}</DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Update member</DialogTitle>
          <DialogDescription>
            Update an existing member. You can change the roles and permissions
            to the member.
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
                      disabled
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
              <Button type="submit" loading={updateMembersMutation.isPending}>
                Edit member
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
