"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useUserToken } from "@/app/hooks/useUserToken";
import { useMutation } from "@/app/hooks/customMutation";
import { getUserInfo, updateUser } from "@/routes/user-routes";
import { timezones } from "@/lib/constants/options";
import { Loader2 } from "lucide-react";

export const UserProfileSchema = z.object({
  email: z.string(),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  profilePic: z.string(),
  telephone: z.string(),
  displayName: z.string(),
  title: z.string(),
  timeZone: z.string(),
  bio: z.string(),
  namePronounciation: z.string(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

type UserProfileWithoutVerified = Omit<UserProfile, "verified">;

type TextFieldType = {
  label: string;
  type: "textField" | "textArea";
  example: string;
  disabled?: boolean;
};

type SelectFieldType = {
  label: string;
  type: "Select";
  options: string[];
};

type FieldType = TextFieldType | SelectFieldType;

type FooType = {
  [K in keyof UserProfileWithoutVerified]: FieldType;
};

const foo: FooType = {
  email: {
    label: "Email",
    type: "textField",
    example: "john@doe.com",
    disabled: true,
  },
  name: {
    label: "Name",
    type: "textField",
    example: "John Doe",
  },

  profilePic: {
    label: "Profile picture",
    type: "textField",
    example: "https://example.com/profile-pic.jpg",
  },
  telephone: {
    label: "Telephone",
    type: "textField",
    example: "+1234567890",
  },
  displayName: {
    label: "Display name",
    type: "textField",
    example: "John Doe",
  },
  title: {
    label: "Title",
    type: "textField",
    example: "Software Engineer",
  },
  timeZone: {
    label: "Time-zone",
    type: "Select",
    options: timezones,
  },
  bio: {
    label: "Bio",
    type: "textArea",
    example: "Hi, I'm John Doe. I'm a software engineer.",
  },
  namePronounciation: {
    label: "Name pronounciation",
    type: "textField",
    example: "jon doh",
  },
};

export default function EditProfileDialog({
  activateBtn,
}: {
  activateBtn: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const jwtToken = useUserToken();
  const [data, setData] = React.useState<{
    _id: string;
    name: string;
    email: string;
    verified: boolean;
    createdAt: Date;
    updatedAt: Date;
    telephone: string;
    profilePic: string;
    displayName: string;
    title: string;
    timeZone: string;
    bio: string;
    namePronounciation: string;
  }>();
  const form = useForm<z.infer<typeof UserProfileSchema>>({
    resolver: zodResolver(UserProfileSchema),
    defaultValues: {
      name: "",
      email: "",
      profilePic: "",
      telephone: "",
      displayName: "",
      title: "",
      timeZone: "",
      bio: "",
      namePronounciation: "",
    },
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    isPending,
    error,
    data: userQuery,
  } = useQuery({
    queryKey: ["user/me", jwtToken as string],
    queryFn: () => getUserInfo(jwtToken as string),
    enabled: !!jwtToken,
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`user/me`],
      });
      setDialogOpen(false);
      toast.success("User updated successfully");
    },
  });
  useEffect(() => {
    if (userQuery?.status === 200 && userQuery?.data) {
      console.log({ data: userQuery.data });
      setData(userQuery?.data);
    }
  }, [userQuery?.data]);

  useEffect(() => {
    form.setValue("name", data?.name || "");
    form.setValue("email", data?.email || "");
    form.setValue("profilePic", data?.profilePic || "");
    form.setValue("telephone", data?.telephone || "");
    form.setValue("displayName", data?.displayName || "");
    form.setValue("title", data?.title || "");
    form.setValue("timeZone", data?.timeZone || "");
    form.setValue("bio", data?.bio || "");
    form.setValue("namePronounciation", data?.namePronounciation || "");
  }, [data]);

  const keys = Object.keys(UserProfileSchema.shape);
  console.log({ keys });

  function onSubmit(data: z.infer<typeof UserProfileSchema>) {
    console.log(data);
    updateUserMutation.mutate({
      token: jwtToken as string,
      user: data,
    });
  }
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        {isPending ? (
          <Button variant="ghost" className="rounded-full" size="icon" disabled>
            <Loader2 className="h-4 w-4 animate-spin" />
          </Button>
        ) : (
          activateBtn
        )}
      </DialogTrigger>
      <DialogContent
        className={"lg:max-w-screen-lg overflow-y-scroll max-h-screen"}
      >
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Edit your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            {keys.map((key) => {
              const fieldKey = key as keyof z.infer<typeof UserProfileSchema>;
              const fieldObj = foo[key as keyof FooType];
              return (
                <FormField
                  key={key}
                  control={form.control}
                  name={fieldKey}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{fieldObj.label}</FormLabel>
                      <FormControl>
                        {fieldObj["type"] === "textField" ? (
                          <Input
                            placeholder={fieldObj.example}
                            {...field}
                            value={field.value.toString()}
                            onChange={field.onChange}
                            disabled={fieldObj.disabled ?? false}
                          />
                        ) : fieldObj["type"] === "textArea" ? (
                          <Textarea
                            placeholder={fieldObj.example}
                            {...field}
                            value={field.value.toString()}
                            onChange={field.onChange}
                          />
                        ) : fieldObj["type"] === "Select" ? (
                          <Select
                            value={field.value.toString()}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={`Select a ${fieldObj.label}`}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {fieldObj.options.map((option, index) => (
                                <SelectItem
                                  value={option}
                                  key={fieldObj.label + option}
                                >
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : null}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            })}
            <DialogFooter>
              <Button type="submit" loading={updateUserMutation.isPending}>
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
