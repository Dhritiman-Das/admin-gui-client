import React, { useEffect, useState } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { Editor } from "@monaco-editor/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getDbDetails } from "@/routes/project-routes";
import { useUserToken } from "@/app/hooks/useUserToken";
import { useTheme } from "next-themes";
import { extractVariables } from "@/lib/helpers";
import { QueryDataTypes } from "../query/addQueryDialog";
import { capitalizeFirstLetter } from "@/lib/helpers";
import { PlusIcon } from "lucide-react";

export const FieldObject = z.object({
  field: z.string(),
  type: z.enum(["string", "number", "boolean", "date"]),
  required: z.boolean(),
});

export const MutationFormSchema = z.object({
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
  mutateObj: z.array(FieldObject),
});

export type Mutation = z.infer<typeof MutationFormSchema>;

export default function MutationDialog({
  type,
  initialData,
  onSubmit,
  activateBtn,
  closeModal,
  isLoading,
}: {
  type: "add" | "edit";
  initialData?: Mutation;
  onSubmit: (data: Mutation) => void;
  activateBtn: React.ReactNode;
  closeModal: boolean;
  isLoading: boolean;
}) {
  const { resolvedTheme } = useTheme();
  const jwtToken = useUserToken();
  const [currentProjectId, setCurrentProjectId] = useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [variables, setVariables] = useState<{ variable: string }[]>([]);
  const form = useForm<Mutation>({
    resolver: zodResolver(MutationFormSchema),
    defaultValues: initialData ?? {
      mutateObj: [{ field: "", type: "string", required: false }],
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData]);

  const watchedQuery = form.watch("queryString");

  const [dbDetails, setDbDetails] = useState<
    { dbName: string; collections: string[] }[]
  >([]);

  const fetchDbDetails = useQuery({
    queryKey: [`${currentProjectId}/project/db-details`],
    queryFn: () =>
      getDbDetails({ projectId: currentProjectId, token: jwtToken as string }),
    enabled: !!jwtToken && !!currentProjectId && !!dialogOpen,
  });

  useEffect(() => {
    setCurrentProjectId(localStorage.getItem("projectId") || "");
  }, []);

  useEffect(() => {
    if (fetchDbDetails.data?.status === 200) {
      setDbDetails(fetchDbDetails.data?.data);
    }
  }, [fetchDbDetails.data]);

  useEffect(() => {
    setVariables(extractVariables(watchedQuery));
  }, [watchedQuery]);

  useEffect(() => {
    if (!!closeModal) {
      setDialogOpen(false);
    }
  }, [closeModal]);

  const onSubmitFn = (data: Mutation) => {
    console.log({ data });
    onSubmit(data);
  };
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{activateBtn}</DialogTrigger>
      <DialogContent
        className={"lg:max-w-screen-lg overflow-y-scroll max-h-screen"}
      >
        <DialogHeader>
          <DialogTitle>{capitalizeFirstLetter(type)} mutation</DialogTitle>
          <DialogDescription>
            {capitalizeFirstLetter(type)} your mutation here. Click save when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitFn)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Mutation name"
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
                  <FormLabel>Search query</FormLabel>
                  <FormControl>
                    <div className="bg-codeEditor py-3 border-solid border-2 border-muted rounded-[--radius]">
                      <Editor
                        height="100px"
                        defaultLanguage="json"
                        theme={resolvedTheme === "dark" ? "vs-dark" : "vs"}
                        defaultValue={field.value}
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
                        defaultValue={field.value}
                        onChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-2">
              {form.watch("mutateObj")?.map((item, index) => (
                <div key={"mutationObj_" + index} className="flex gap-4 w-full">
                  <FormField
                    control={form.control}
                    name={`mutateObj.${index}.field`}
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 w-3/5">
                        <FormLabel>Field</FormLabel>
                        <FormControl className="m-0">
                          <Input
                            className="m-0"
                            placeholder="Field name"
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
                    name={`mutateObj.${index}.type`}
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 w-1/5">
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                            <SelectContent>
                              {["string", "number", "boolean", "date"].map(
                                (dataType, index) => (
                                  <SelectItem
                                    value={dataType}
                                    key={dataType + index}
                                  >
                                    {capitalizeFirstLetter(dataType)}
                                  </SelectItem>
                                )
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
                    name={`mutateObj.${index}.required`}
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 w-1/5">
                        <FormControl>
                          <Select
                            value={field.value.toString()}
                            onValueChange={(value) =>
                              field.onChange(value === "true")
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Required" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={"true"}>Required</SelectItem>
                              <SelectItem value={"false"}>Optional</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              <Button
                type="button"
                variant={"outline"}
                onClick={() => {
                  form.setValue("mutateObj", [
                    ...form.watch("mutateObj"),
                    {
                      field: "",
                      type: "string",
                      required: false,
                    },
                  ]);
                }}
              >
                Add more <PlusIcon size={18} />
              </Button>
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mutation description"
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
              <Button type="submit" loading={isLoading}>
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
