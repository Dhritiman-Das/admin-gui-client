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
import { H2 } from "@/components/ui/typography";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { extractVariables } from "@/server/lib/helpers";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createQuery, getDbDetails, getQuery } from "@/routes/project-routes";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useUserToken } from "@/app/hooks/useUserToken";
import { AddQueryFormSchema } from "./addQueryDialog";
import { useRouter } from "next/navigation";
import { useMutation } from "@/app/hooks/customMutation";

export default function DuplicateQueryDialog({
  queryId,
  projectId,
  activateBtn,
}: {
  queryId: string;
  projectId: string;
  activateBtn: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const currentProjectId = projectId;
  const jwtToken = useUserToken();
  const [data, setData] = React.useState<{
    _id: string;
    name: string;
    description: string;
    dbName: string;
    dbCollectionName: string;
    queryString: string;
  }>();
  const form = useForm<z.infer<typeof AddQueryFormSchema>>({
    resolver: zodResolver(AddQueryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      dbName: "",
      dbCollectionName: "",
      queryString: "",
    },
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [variables, setVariables] = useState<{ variable: string }[]>([]);
  const [dbDetails, setDbDetails] = useState<
    { dbName: string; collections: string[] }[]
  >([]);
  const watchedQuery = form.watch("queryString");

  const fetchDbDetails = useQuery({
    queryKey: [`${currentProjectId}/project/db-details`],
    queryFn: () =>
      getDbDetails({ projectId: currentProjectId, token: jwtToken as string }),
    enabled: !!jwtToken && !!currentProjectId,
  });
  const {
    isPending,
    error,
    isSuccess,
    data: queryData,
  } = useQuery({
    queryKey: [`${projectId}/project/${queryId}`],
    queryFn: () =>
      getQuery({
        projectId: projectId,
        queryId: queryId,
        token: jwtToken as string,
      }),
    enabled: !!jwtToken && !!queryId,
  });
  const createQueryMutation = useMutation({
    mutationFn: createQuery,
    onSuccess: ({ data }) => {
      router.push(`/home/${projectId}/query/${data._id}/view`);
      queryClient.invalidateQueries({
        queryKey: [`${currentProjectId}/query`],
      });
      setDialogOpen(false);
      toast.success("Query updated successfully");
    },
  });
  useEffect(() => {
    if (queryData?.status === 200 && queryData?.data) {
      console.log({ data: queryData.data });
      setData(queryData?.data);
    }
  }, [queryData?.data]);

  useEffect(() => {
    if (fetchDbDetails.data?.status === 200) {
      setDbDetails(fetchDbDetails.data?.data);
    }
  }, [fetchDbDetails.data]);

  useEffect(() => {
    setVariables(extractVariables(watchedQuery));
  }, [watchedQuery]);

  useEffect(() => {
    form.setValue("name", "Duplicate - " + data?.name || "");
    form.setValue("description", data?.description || "");
    form.setValue("dbName", data?.dbName || "");
    form.setValue("dbCollectionName", data?.dbCollectionName || "");
    form.setValue("queryString", data?.queryString || "");
  }, [data]);

  function onSubmit(data: z.infer<typeof AddQueryFormSchema>) {
    console.log(data);
    createQueryMutation.mutate({
      projectId: currentProjectId,
      query: data,
      token: jwtToken as string,
    });
  }
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{activateBtn}</DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Duplicate query</DialogTitle>
          <DialogDescription>
            Create your query here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Query name"
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
              name="dbName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Database name</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a database" />
                      </SelectTrigger>

                      <SelectContent>
                        {dbDetails.map((dbDetail, index) => (
                          <SelectItem
                            value={dbDetail.dbName}
                            key={"dbName" + index}
                            disabled={dbDetail.collections.length === 0}
                          >
                            <div className="flex justify-between">
                              {dbDetail.dbName}
                              <Badge
                                variant={
                                  dbDetail.collections.length
                                    ? "outline"
                                    : "destructive"
                                }
                                className="ml-2"
                              >
                                {dbDetail.collections.length <= 1
                                  ? dbDetail.collections.length + " collection"
                                  : dbDetail.collections.length +
                                    " collections"}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dbCollectionName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collection name</FormLabel>

                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a database" />
                      </SelectTrigger>

                      <SelectContent>
                        {dbDetails
                          .find((item) => item.dbName === form.watch("dbName"))
                          ?.collections.map((collectionName, index) => (
                            <SelectItem
                              value={collectionName}
                              key={"dbCollection" + index}
                            >
                              {collectionName}
                            </SelectItem>
                          )) || (
                          <SelectItem
                            value="Not found"
                            key={"dbCollection" + "notfound"}
                            disabled
                          >
                            No collection available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="queryString"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Query</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`{ "plan": "trial", "startDate": {"$gte": "1706265858"} }`}
                      {...field}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <div>
                    {variables.map((variable, index) => (
                      <Badge key={"Badge" + index} className="mr-2">
                        {variable.variable}
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Query description"
                      {...field}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" loading={createQueryMutation.isPending}>
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
