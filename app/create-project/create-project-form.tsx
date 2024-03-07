"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useMutation } from "@/app/hooks/customMutation";
import { useQueryClient } from "@tanstack/react-query";
import { createProject } from "@/routes/project-routes";
import { useUserToken } from "../hooks/useUserToken";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { routes } from "@/lib/constants/routers";

export const CreateProjectSchema = z.object({
  mode: z.enum(["team", "personal"]),
  name: z.string().default(""),
  description: z.string().default(""),
  dbConnectionString: z.string().default(""),
  //   invitedMembers: z.array(z.string()).default([]),
});

export type Project = z.infer<typeof CreateProjectSchema>;

export default function CreateProjectForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const jwtToken = useUserToken();
  const form = useForm<z.infer<typeof CreateProjectSchema>>({
    resolver: zodResolver(CreateProjectSchema),
    defaultValues: {},
  });

  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        queryKey: ["user/me"],
      });
      toast.success("Project created successfully");
      const projectId = data._id;
      router.replace(routes.default(projectId));
    },
    retry: false,
  });

  const onSubmit = (data: z.infer<typeof CreateProjectSchema>) => {
    console.log(data);
    createProjectMutation.mutate({ project: data, token: jwtToken });
  };
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel aria-required>Project name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="My first project"
                    required
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
            name="mode"
            render={({ field }) => (
              <FormItem>
                <FormLabel aria-required>Mode</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="team">Team</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel aria-required>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description"
                    required
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
            name="dbConnectionString"
            render={({ field }) => (
              <FormItem>
                <FormLabel aria-required>MongoDB URI</FormLabel>
                <FormControl>
                  <Input
                    placeholder="mongodb://<username>:<password>@<host>:<port>/<database>"
                    required
                    {...field}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" loading={createProjectMutation.isPending}>
            Save changes
          </Button>
        </form>
      </Form>
    </div>
  );
}
