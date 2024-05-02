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
import { extractVariables, safeJsonParse } from "@/lib/helpers";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createQuery, getDbDetails } from "@/routes/project-routes";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useUserToken } from "@/app/hooks/useUserToken";
import { useMutation } from "@/app/hooks/customMutation";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";

export type QueryDataTypes = "string" | "number" | "boolean" | "date";

export const AddQueryFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  dbName: z.string().min(2, {
    message: "Database name must be at least 2 characters.",
  }),
  dbCollectionName: z.string().min(2, {
    message: "Database name must be at least 2 characters.",
  }),
  queryString: z.string().min(2, {
    message: "Database name must be at least 2 characters.",
  }),
  queryDataTypes: z
    .record(z.enum(["string", "number", "boolean", "date"]))
    .optional(),
  projection: z.string().optional(),
  sort: z.string().optional(),
  collation: z.string().optional(),
});

export default function AddQueryDialog({ projectId }: { projectId: string }) {
  const { resolvedTheme } = useTheme();
  const queryClient = useQueryClient();
  const currentProjectId = projectId;
  const jwtToken = useUserToken();
  const form = useForm<z.infer<typeof AddQueryFormSchema>>({
    resolver: zodResolver(AddQueryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      dbName: "",
      dbCollectionName: "",
      queryString: "",
      queryDataTypes: {},
      projection: "",
      sort: "",
      collation: "",
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
    enabled: !!jwtToken && !!currentProjectId && !!dialogOpen,
  });
  const createQueryMutation = useMutation({
    mutationFn: createQuery,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`${currentProjectId}/query`],
      });
      setDialogOpen(false);
      toast.success("Query created successfully");
    },
  });

  useEffect(() => {
    if (fetchDbDetails.data?.status === 200) {
      setDbDetails(fetchDbDetails.data?.data);
    }
  }, [fetchDbDetails.data]);

  useEffect(() => {
    console.log(watchedQuery);
    setVariables(extractVariables(watchedQuery));
  }, [watchedQuery]);

  function onSubmit(data: z.infer<typeof AddQueryFormSchema>) {
    console.log(data);
    createQueryMutation.mutate({
      projectId: currentProjectId,
      query: {
        ...data,
        projection: safeJsonParse(data?.projection),
        sort: safeJsonParse(data?.sort),
        collation: safeJsonParse(data?.collation),
      },
      token: jwtToken as string,
    });
  }
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>Add query</Button>
      </DialogTrigger>
      <DialogContent
        className={"lg:max-w-screen-lg overflow-y-scroll max-h-screen"}
      >
        <DialogHeader>
          <DialogTitle>Add query</DialogTitle>
          <DialogDescription>
            Create your query here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel aria-required>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Query name"
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
              name="dbName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Database name</FormLabel>

                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a database" />
                      </SelectTrigger>
                    </FormControl>
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
                                : dbDetail.collections.length + " collections"}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a database" />
                      </SelectTrigger>
                    </FormControl>
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
                    <div className="bg-codeEditor py-3 border-solid border-2 border-muted rounded-[--radius]">
                      <Editor
                        height="100px"
                        defaultLanguage="json"
                        theme={resolvedTheme === "dark" ? "vs-dark" : "vs"}
                        defaultValue={`// { "plan": "__planName__", "startDate": {"$gte": "__startDate__"} }`}
                        onChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              {variables.map((variable, index) => (
                <>
                  <FormItem
                    key={"queryDataType" + index}
                    className="flex items-center gap-2"
                  >
                    <FormLabel>{variable.variable}</FormLabel>
                    <FormControl>
                      <Select
                        value={
                          form.watch(`queryDataTypes.${variable.variable}`) ||
                          "string"
                        }
                        onValueChange={(value: QueryDataTypes) =>
                          form.setValue(
                            `queryDataTypes.${variable.variable}`,
                            value
                          )
                        }
                      >
                        <SelectTrigger className="w-fit">
                          <SelectValue placeholder="Select a data type" />
                        </SelectTrigger>
                        <SelectContent>
                          {["string", "number", "boolean", "date"].map(
                            (dataType, index) => (
                              <SelectItem value={dataType} key={index}>
                                {dataType}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              ))}
            </div>
            <FormField
              control={form.control}
              name="projection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project</FormLabel>
                  <FormControl>
                    <div className="bg-codeEditor py-3 border-solid border-2 border-muted rounded-[--radius]">
                      <Editor
                        {...field}
                        height="60px"
                        defaultLanguage="json"
                        theme={resolvedTheme === "dark" ? "vs-dark" : "vs"}
                        defaultValue={``}
                        onChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sort"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sort</FormLabel>
                  <FormControl>
                    <div className="bg-codeEditor py-3 border-solid border-2 border-muted rounded-[--radius]">
                      <Editor
                        {...field}
                        height="60px"
                        defaultLanguage="json"
                        theme={resolvedTheme === "dark" ? "vs-dark" : "vs"}
                        defaultValue={``}
                        onChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="collation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collation</FormLabel>
                  <FormControl>
                    <div className="bg-codeEditor py-3 border-solid border-2 border-muted rounded-[--radius]">
                      <Editor
                        {...field}
                        height="100px"
                        defaultLanguage="json"
                        theme={resolvedTheme === "dark" ? "vs-dark" : "vs"}
                        defaultValue={``}
                        onChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

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
